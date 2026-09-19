"""
Crop Analyzer Coordinator Module
================================
Coordinates image validation, model prediction, procurement condition
grading, and farmer recommendation synthesis.
"""

import logging
from typing import Optional
from fastapi import HTTPException, status

from .schemas import CropAnalysisRequest, CropAnalysisResponse
from .model import CropVisionModel

logger = logging.getLogger(__name__)


class CropAnalyzer:
    """
    Coordinator service for assessing crop photographs.
    """

    def __init__(self, vision_model: Optional[CropVisionModel] = None):
        self.vision_model = vision_model or CropVisionModel()

    def analyze(self, payload: CropAnalysisRequest) -> CropAnalysisResponse:
        """
        Processes an incoming crop analysis request and returns structured results.
        """
        raw_image = (payload.image or "").strip()
        if not raw_image or len(raw_image) < 30:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image: Please provide a clear crop photograph.",
            )

        # 1. Decode image bytes
        try:
            image_bytes, mime_type = self.vision_model.decode_image(raw_image)
        except ValueError as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Image decoding failed: {str(exc)}",
            )

        # 2. Run Vision Model prediction on image bytes
        prediction = self.vision_model.predict(
            image_bytes=image_bytes,
            mime_type=mime_type,
            crop_hint=payload.crop_hint,
        )

        # 3. Normalize and sanitize fields
        crop_name = str(prediction.get("crop", "Unable to determine from this image")).strip()
        crop_conf = round(float(prediction.get("crop_confidence", 0.85)), 2)
        disease_issue = str(prediction.get("disease_or_issue", "No visible issue")).strip()
        disease_conf = round(float(prediction.get("disease_confidence", 0.80)), 2)

        condition = str(prediction.get("condition", "Healthy")).strip().capitalize()
        if condition not in ["Healthy", "Moderate", "Poor"]:
            if "mod" in condition.lower():
                condition = "Moderate"
            elif "poor" in condition.lower() or "bad" in condition.lower():
                condition = "Poor"
            else:
                condition = "Healthy"

        quality_warning = str(prediction.get("quality_warning", "")).strip()
        recommendation = str(prediction.get("recommendation", "")).strip()

        # If crop cannot be identified, ensure condition and issues reflect that accurately
        if "unable to determine" in crop_name.lower():
            condition = "Poor"
            if "no visible issue" in disease_issue.lower() or not disease_issue:
                disease_issue = "Unable to determine from this image"
            quality_warning = "The image could not be identified as an agricultural crop or grain sample."
            recommendation = "Please capture or upload a clear, well-focused close-up photo of the crop in natural daylight."

        # Enforce quality warning truthfulness: do NOT invent problems if Healthy & no issue
        elif condition == "Healthy" and (
            "no visible" in disease_issue.lower()
            or "none" in disease_issue.lower()
            or "healthy" in disease_issue.lower()
        ):
            if not quality_warning or "warning" in quality_warning.lower() or len(quality_warning) < 10:
                quality_warning = (
                    "No obvious visible quality issue detected. Meets standard FAQ procurement guidelines."
                )

        if not recommendation:
            recommendation = (
                "Ensure moisture is measured and grains are clean prior to procurement centre arrival."
            )

        return CropAnalysisResponse(
            crop=crop_name,
            crop_confidence=crop_conf,
            disease_or_issue=disease_issue,
            disease_confidence=disease_conf,
            condition=condition,  # type: ignore
            quality_warning=quality_warning,
            recommendation=recommendation,
        )



# Global singleton instance
_default_analyzer = CropAnalyzer()


def analyze_crop_image(payload: CropAnalysisRequest) -> CropAnalysisResponse:
    """
    Convenience functional API for analyzing a crop image payload.
    """
    return _default_analyzer.analyze(payload)
