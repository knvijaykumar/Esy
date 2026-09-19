"""
Procurement Slot Demand Predictor - Model Loader
=================================================
Uses the same pretrained Amazon foundation model `amazon/chronos-2`.
Shares the pipeline instance for minimal CPU and memory footprint.
"""

from typing import Optional
import torch

_DEMAND_PIPELINE_INSTANCE = None


def load_demand_model(
    model_name: str = "amazon/chronos-2",
    device_map: str = "cpu",
    torch_dtype: torch.dtype = torch.float32,
):
    """
    Loads and caches the Chronos-2 forecasting pipeline for slot demand forecasting.
    Optimized for low-resource CPU execution.
    """
    global _DEMAND_PIPELINE_INSTANCE
    if _DEMAND_PIPELINE_INSTANCE is not None:
        return _DEMAND_PIPELINE_INSTANCE

    try:
        from chronos import Chronos2Pipeline
    except ImportError as exc:
        raise ImportError(
            "chronos-forecasting package not installed. Install via: pip install chronos-forecasting>=2.0"
        ) from exc

    _DEMAND_PIPELINE_INSTANCE = Chronos2Pipeline.from_pretrained(
        model_name,
        device_map=device_map,
        torch_dtype=torch_dtype,
    )
    return _DEMAND_PIPELINE_INSTANCE
