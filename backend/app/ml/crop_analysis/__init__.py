# backend/app/ml/crop_analysis/__init__.py
"""
Crop Analysis ML Package for Esy FARM
======================================
Provides AI-driven visual crop identification, disease/defect detection,
procurement condition grading, and actionable farmer recommendations.
"""

from .schemas import CropAnalysisRequest, CropAnalysisResponse
from .analyzer import CropAnalyzer, analyze_crop_image
from .model import CropVisionModel

__all__ = [
    "CropAnalysisRequest",
    "CropAnalysisResponse",
    "CropAnalyzer",
    "analyze_crop_image",
    "CropVisionModel",
]
