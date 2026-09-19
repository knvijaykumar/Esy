"""
Pydantic Schemas for Quick Crop Assessment
===========================================
Defines the request and response models for crop photo analysis,
disease detection, quality grading, and farmer recommendations.
"""

from typing import Optional, Literal
from pydantic import BaseModel, Field


class CropAnalysisRequest(BaseModel):
    image: str = Field(
        ...,
        description="Base64-encoded image string or Data URL of the crop photograph (JPEG, PNG, WebP).",
    )
    crop_hint: Optional[str] = Field(
        None,
        description="Optional crop name or context provided by the farmer or preset.",
    )


class CropAnalysisResponse(BaseModel):
    crop: str = Field(
        ...,
        description="Identified agricultural crop or 'Unable to determine from this image'.",
    )
    crop_confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Confidence score for crop identification (0.0 to 1.0).",
    )
    disease_or_issue: str = Field(
        ...,
        description="Detected visual disease, defect, or 'No visible issue'.",
    )
    disease_confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Confidence score for defect/disease detection (0.0 to 1.0).",
    )
    condition: Literal["Healthy", "Moderate", "Poor"] = Field(
        ...,
        description="Overall physical condition derived from image quality and defects.",
    )
    quality_warning: str = Field(
        ...,
        description="Clear procurement warning regarding moisture, spots, discoloration, or foreign matter.",
    )
    recommendation: str = Field(
        ...,
        description="Actionable, farmer-friendly recommendation for cleaning, drying, or grading.",
    )
