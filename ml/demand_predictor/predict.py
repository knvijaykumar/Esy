"""
Procurement Slot Demand Predictor - Prediction Engine
======================================================
Predicts expected farmer booking traffic for procurement slots using `amazon/chronos-2`.
"""

from typing import List, Dict, Any, Optional
import torch
import numpy as np

from .model import load_demand_model


def prepare_demand_tensor(historical_booking_counts: List[int | float]) -> torch.Tensor:
    """
    Converts historical booking counts for a slot into a 3D PyTorch tensor (1, 1, context_length).
    """
    if not historical_booking_counts or len(historical_booking_counts) < 2:
        raise ValueError(
            "At least 2 historical booking count observations are required to forecast demand."
        )

    clean_counts = [float(c) for c in historical_booking_counts]
    return torch.tensor([[clean_counts]], dtype=torch.float32)


def predict_slot_demand(
    procurement_centre: str,
    crop: str,
    date: str,
    time_slot: str,
    historical_booking_counts: List[int | float],
    centre_capacity: int,
    day_of_week: Optional[str] = None,
    model_name: str = "amazon/chronos-2",
) -> Dict[str, Any]:
    """
    Forecasts expected booking demand for a specific slot at a procurement centre.

    Args:
        procurement_centre: Name / ID of the procurement centre.
        crop: Agricultural commodity (e.g. 'Ragi', 'Paddy', 'Maize').
        date: Target booking date string ('YYYY-MM-DD').
        time_slot: Operating window (e.g., '10:00-11:00').
        historical_booking_counts: Sequence of past booking numbers for this slot.
        centre_capacity: Maximum capacity of the slot/centre.
        day_of_week: Day of week name (e.g., 'Monday').
        model_name: Hugging Face model repository.

    Returns:
        Dictionary containing predicted demand matching specification:
        {
          "slot": "10:00-11:00",
          "predicted_demand": 48
        }
        along with extended capacity context.
    """
    pipeline = load_demand_model(model_name=model_name)
    context_tensor = prepare_demand_tensor(historical_booking_counts)

    # Forecast next 1 step (immediate target slot)
    forecast = pipeline.predict(
        context_tensor,
        prediction_length=1,
    )

    if isinstance(forecast, list) and len(forecast) > 0:
        sample_tensor = forecast[0]
    else:
        sample_tensor = forecast

    if isinstance(sample_tensor, torch.Tensor):
        arr = sample_tensor.detach().cpu().numpy()
    else:
        arr = np.array(sample_tensor)

    # Median forecast value across paths (shape is [batch=1, quantiles=21, pred_len=1])
    if arr.ndim == 3 and arr.shape[1] == 21:
        raw_val = float(arr[0, 10, 0])
    elif arr.ndim == 3:
        raw_val = float(np.median(arr[0], axis=0)[0])
    elif arr.ndim == 2:
        raw_val = float(np.median(arr, axis=0)[0])
    elif arr.ndim == 1:
        raw_val = float(arr[0])
    else:
        raw_val = float(arr)

    # Demand cannot be negative
    predicted_demand = max(0, int(round(raw_val)))

    return {
        "slot": time_slot,
        "predicted_demand": predicted_demand,
        "procurement_centre": procurement_centre,
        "crop": crop,
        "date": date,
        "day_of_week": day_of_week,
        "centre_capacity": centre_capacity,
        "expected_utilization_pct": round(
            (predicted_demand / max(1, centre_capacity)) * 100, 1
        ),
        "model": model_name,
    }


def predict_all_slots_demand(
    procurement_centre: str,
    crop: str,
    date: str,
    slots_history: Dict[str, List[int | float]],
    centre_capacity: int,
    day_of_week: Optional[str] = None,
    model_name: str = "amazon/chronos-2",
) -> List[Dict[str, Any]]:
    """
    Forecasts demand across all available slots for a given procurement centre and date.

    Args:
        procurement_centre: Center identifier.
        crop: Crop being procured.
        date: Target booking date.
        slots_history: Mapping of {slot_name: [historical_counts]}.
        centre_capacity: Slot capacity limit.
        day_of_week: Optional day of week.
        model_name: HF model ID.

    Returns:
        List of slot demand predictions.
    """
    results = []
    for slot_name, history in slots_history.items():
        res = predict_slot_demand(
            procurement_centre=procurement_centre,
            crop=crop,
            date=date,
            time_slot=slot_name,
            historical_booking_counts=history,
            centre_capacity=centre_capacity,
            day_of_week=day_of_week,
            model_name=model_name,
        )
        results.append(res)
    return results
