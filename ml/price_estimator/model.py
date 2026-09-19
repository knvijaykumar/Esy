"""
Crop Price Estimator - Model Loader
====================================
Uses Amazon's pretrained foundation model `amazon/chronos-2` via Hugging Face.

NOTE:
- Chronos-2 is a general-purpose, pretrained time-series foundation model based on the T5 architecture.
- It was NOT trained specifically for agriculture. It operates as a zero-shot forecaster
  that identifies statistical temporal patterns in numerical time-series sequences.
- Official MSP (Minimum Support Price) values are maintained strictly as benchmark reference points
  and are never overwritten or fabricated by the model.
"""

from typing import Optional
import torch

_PIPELINE_INSTANCE = None


def load_price_model(
    model_name: str = "amazon/chronos-2",
    device_map: str = "cpu",
    torch_dtype: torch.dtype = torch.float32,
):
    """
    Loads and caches the pretrained Chronos-2 forecasting pipeline on the specified device.
    Defaults to CPU-friendly execution without requiring specialized hardware.

    Args:
        model_name: Hugging Face model repository identifier (default: "amazon/chronos-2").
        device_map: Target execution device ("cpu" or "cuda").
        torch_dtype: PyTorch precision data type (default: float32 for CPU stability).

    Returns:
        Chronos2Pipeline instance ready for zero-shot forecasting.
    """
    global _PIPELINE_INSTANCE
    if _PIPELINE_INSTANCE is not None:
        return _PIPELINE_INSTANCE

    try:
        from chronos import Chronos2Pipeline
    except ImportError as exc:
        raise ImportError(
            "chronos-forecasting package not installed. Install via: pip install chronos-forecasting>=2.0"
        ) from exc

    _PIPELINE_INSTANCE = Chronos2Pipeline.from_pretrained(
        model_name,
        device_map=device_map,
        torch_dtype=torch_dtype,
    )
    return _PIPELINE_INSTANCE
