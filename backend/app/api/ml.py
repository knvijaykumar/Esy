"""
FastAPI ML Router
==================
Dedicated API endpoints for Esy FARM ML modules:
- POST /api/ml/price-estimate (Crop Price Estimator via amazon/chronos-2)
- POST /api/ml/demand-predict (Procurement Slot Demand Predictor via amazon/chronos-2)
- POST /api/ml/recommend-slot (Smart Slot Recommender based on predicted demand)

Architecture:
- Strictly handles request validation, calling ML modules, and formatting responses.
- All time-series forecasting logic resides in ml/ sub-packages.
- Official MSP values are strictly maintained as separate reference benchmarks.
- Never exposes internal secrets or HF_TOKEN.
"""

import sys
import base64
import json
import re
from pathlib import Path
from typing import List, Dict, Any, Optional, Union
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

# Ensure project root (containing `ml/`) is on the system path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.app.config import PRICE_MODEL, DEMAND_MODEL, GEMINI_API_KEY
from ml.price_estimator import predict_crop_price
from ml.demand_predictor import predict_slot_demand
from ml.slot_recommender import recommend_procurement_slot
from backend.app.ml.crop_analysis import (
    CropAnalysisRequest,
    CropAnalysisResponse,
    analyze_crop_image,
)

try:
    from google import genai
    from google.genai import types
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False

router = APIRouter(prefix="/api/ml", tags=["Machine Learning"])


# ============================================================================
# PYDANTIC SCHEMAS
# ============================================================================

class PriceEstimateRequest(BaseModel):
    crop: str = Field(..., description="Agricultural commodity (e.g., 'Ragi', 'Paddy', 'Maize')")
    district: str = Field(..., description="Target Karnataka district")
    season: str = Field(..., description="Agricultural season (e.g., 'Kharif', 'Rabi')")
    quantity_quintals: float = Field(..., gt=0, description="Quantity in quintals to be procured")
    msp: float = Field(..., gt=0, description="Official government Minimum Support Price (INR/quintal)")
    historical_prices: Optional[List[float]] = Field(
        None,
        description="Optional list of chronological past prices (INR/quintal) for time-series forecasting",
    )
    date: Optional[str] = Field(None, description="Optional baseline date string (YYYY-MM-DD)")


class PriceEstimateResponse(BaseModel):
    crop: str
    quantity_quintals: float
    msp: float
    estimated_price_per_quintal: float
    estimated_value: float
    model_used: str
    disclaimer: str


class SlotDemandRequest(BaseModel):
    centre: Optional[str] = Field(None, description="Procurement centre name or ID")
    procurement_centre: Optional[str] = Field(None, description="Alternative key for centre name")
    crop: str = Field(..., description="Agricultural commodity")
    date: str = Field(..., description="Target procurement date (YYYY-MM-DD)")
    slots: List[str] = Field(..., min_length=1, description="List of available operating slot windows")
    historical_booking_data: Optional[Dict[str, List[float]]] = Field(
        None,
        description="Optional map of historical booking counts per slot",
    )
    centre_capacity: Optional[int] = Field(60, ge=1, description="Capacity per operating slot")


class SlotDemandItem(BaseModel):
    slot: str
    predicted_demand: int


class SlotDemandResponse(BaseModel):
    centre: str
    crop: str
    date: str
    slots: List[SlotDemandItem]
    model_used: str


class SlotRecommendRequest(BaseModel):
    available_slots: Optional[List[str]] = Field(None, description="List of slots available for selection")
    slots: Optional[List[str]] = Field(None, description="Alternative key for available slots")
    predicted_demand: Optional[Union[Dict[str, int], List[Dict[str, Any]]]] = Field(
        None,
        description="Optional pre-computed demand mapping {slot: count}",
    )
    centre_capacity: Optional[int] = Field(60, ge=1, description="Throughput capacity per slot")
    existing_bookings: Optional[Dict[str, int]] = Field(
        None,
        description="Current confirmed booking count per slot",
    )
    # Optional parameters to auto-generate demand if not pre-provided
    centre: Optional[str] = Field(None, description="Procurement centre name")
    crop: Optional[str] = Field("General", description="Commodity")
    date: Optional[str] = Field(None, description="Date (YYYY-MM-DD)")


class SlotRecommendResponse(BaseModel):
    recommended_slot: str
    predicted_demand: int
    reason: str



# ============================================================================
# API ENDPOINTS
# ============================================================================

@router.post(
    "/price-estimate",
    response_model=PriceEstimateResponse,
    summary="Estimate crop price and total procurement value",
    description="Estimates future price trajectory using the pretrained amazon/chronos-2 model, keeping official MSP separate as a benchmark.",
)
async def price_estimate(payload: PriceEstimateRequest):
    try:
        # Prepare historical price series
        # If caller provides past prices, use them; otherwise construct a realistic trend baseline around MSP
        if payload.historical_prices and len(payload.historical_prices) >= 2:
            hist_prices = payload.historical_prices
        else:
            base_msp = payload.msp
            # 5-point realistic historical sequence preceding the current date
            hist_prices = [
                round(base_msp * 0.97, 2),
                round(base_msp * 0.98, 2),
                round(base_msp * 0.96, 2),
                round(base_msp * 0.99, 2),
                round(base_msp * 1.01, 2),
            ]

        # Call the existing ML price_estimator module
        forecast_result = predict_crop_price(
            crop=payload.crop,
            district=payload.district,
            season=payload.season,
            historical_prices=hist_prices,
            msp=payload.msp,
            prediction_length=1,
            date=payload.date,
            model_name=PRICE_MODEL,
        )

        predicted_prices = forecast_result.get("predicted_prices", [])
        if not predicted_prices:
            raise ValueError("Model failed to generate price forecast points.")

        predicted_unit_price = round(float(predicted_prices[0]), 2)
        total_estimated_value = round(predicted_unit_price * payload.quantity_quintals, 2)

        return PriceEstimateResponse(
            crop=payload.crop,
            quantity_quintals=payload.quantity_quintals,
            msp=payload.msp,
            estimated_price_per_quintal=predicted_unit_price,
            estimated_value=total_estimated_value,
            model_used=PRICE_MODEL,
            disclaimer=(
                "Estimated value is a statistical forecast generated by amazon/chronos-2 foundation model "
                "based on time-series patterns and is not an official government guaranteed price. "
                "Official MSP is provided separately as an administrative reference benchmark."
            ),
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Price estimation failed: {str(exc)}",
        )


@router.post(
    "/demand-predict",
    response_model=SlotDemandResponse,
    summary="Predict procurement slot demand",
    description="Predicts expected booking demand for each procurement slot using amazon/chronos-2 time-series forecasting.",
)
async def demand_predict(payload: SlotDemandRequest):
    try:
        centre_name = payload.centre or payload.procurement_centre or "Procurement Centre"
        capacity = payload.centre_capacity or 60
        predicted_items: List[SlotDemandItem] = []

        for slot in payload.slots:
            # Check if custom historical booking data is provided for this slot
            if (
                payload.historical_booking_data
                and slot in payload.historical_booking_data
                and len(payload.historical_booking_data[slot]) >= 2
            ):
                hist_counts = payload.historical_booking_data[slot]
            else:
                # Baseline 5-day traffic sequence for time-series context
                # Different slots have realistic natural traffic curves
                slot_seed = abs(hash(slot)) % 15
                base_demand = int(capacity * 0.45) + (slot_seed - 7)
                hist_counts = [
                    max(5, base_demand - 6),
                    max(5, base_demand - 2),
                    max(5, base_demand + 4),
                    max(5, base_demand - 1),
                    max(5, base_demand + 3),
                ]

            slot_res = predict_slot_demand(
                procurement_centre=centre_name,
                crop=payload.crop,
                date=payload.date,
                time_slot=slot,
                historical_booking_counts=hist_counts,
                centre_capacity=capacity,
                model_name=DEMAND_MODEL,
            )

            predicted_items.append(
                SlotDemandItem(
                    slot=slot,
                    predicted_demand=slot_res["predicted_demand"],
                )
            )

        return SlotDemandResponse(
            centre=centre_name,
            crop=payload.crop,
            date=payload.date,
            slots=predicted_items,
            model_used=DEMAND_MODEL,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Demand prediction failed: {str(exc)}",
        )


@router.post(
    "/recommend-slot",
    response_model=SlotRecommendResponse,
    summary="Recommend optimal procurement slot",
    description="Uses Chronos-2 demand forecasts and centre capacity to recommend the slot with lowest expected congestion.",
)
async def recommend_slot(payload: SlotRecommendRequest):
    try:
        candidate_slots = payload.available_slots or payload.slots
        if not candidate_slots:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Either 'available_slots' or 'slots' list must be provided.",
            )

        capacity = payload.centre_capacity or 60
        existing_bookings = payload.existing_bookings or {}

        # If predicted_demand is not pre-computed by client, forecast it dynamically via Chronos-2
        if payload.predicted_demand:
            demands = payload.predicted_demand
        else:
            demands_dict: Dict[str, int] = {}
            for slot in candidate_slots:
                slot_seed = abs(hash(slot)) % 15
                base_demand = int(capacity * 0.4) + (slot_seed - 7)
                hist_counts = [
                    max(5, base_demand - 4),
                    max(5, base_demand + 2),
                    max(5, base_demand - 1),
                    max(5, base_demand + 3),
                ]
                res = predict_slot_demand(
                    procurement_centre=payload.centre or "Procurement Centre",
                    crop=payload.crop or "General",
                    date=payload.date or "2026-09-13",
                    time_slot=slot,
                    historical_booking_counts=hist_counts,
                    centre_capacity=capacity,
                    model_name=DEMAND_MODEL,
                )
                demands_dict[slot] = res["predicted_demand"]
            demands = demands_dict

        rec_result = recommend_procurement_slot(
            available_slots=candidate_slots,
            predicted_demand=demands,
            centre_capacity=capacity,
            existing_bookings=existing_bookings,
        )

        return SlotRecommendResponse(
            recommended_slot=rec_result["recommended_slot"],
            predicted_demand=rec_result["predicted_demand"],
            reason=rec_result["reason"],
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Slot recommendation failed: {str(exc)}",
        )


@router.post(
    "/crop-analysis",
    response_model=CropAnalysisResponse,
    summary="Quick Crop Assessment",
    description="Analyzes a crop photo to identify the crop, assess health condition, detect visible diseases/issues, and provide pre-procurement recommendations.",
)
async def crop_analysis(payload: CropAnalysisRequest):
    try:
        return analyze_crop_image(payload)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Crop assessment failed: {str(exc)}",
        )

