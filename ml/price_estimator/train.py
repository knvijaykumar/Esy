"""
Crop Price Estimator - Training & Fine-Tuning Specification
============================================================
NOTE ON MODEL ARCHITECTURE:
`amazon/chronos-2` is a zero-shot foundation model pre-trained by Amazon on extensive
cross-domain time-series datasets.

Key Principles:
1. No Training Required for Inference:
   Chronos-2 operates out-of-the-box for price trajectory forecasting using its pretrained
   encoder-decoder transformer. It tokenizes numerical sequences into time-series tokens and
   forecasts future distribution without requiring local gradient updates or expensive training.
2. Foundation vs Agricultural Specialization:
   The model is NOT pre-trained specifically on agricultural data; its predictions reflect
   statistical time-series continuations of historical price trends.
3. Official MSP Benchmark:
   MSP (Minimum Support Price) is an official government policy benchmark. It is NEVER predicted,
   altered, or invented by model training.
4. Future Fine-Tuning Hook:
   When real historical procurement and APMC market records (e.g. from Agmarknet or Karnataka
   State Agricultural Marketing Board) are available, this module provides the pipeline to
   format datasets for supervised LoRA / parameter-efficient fine-tuning if desired.
"""

from typing import List, Dict, Any, Optional
import pandas as pd


def prepare_market_price_dataset(
    records: List[Dict[str, Any]],
    target_column: str = "modal_price",
    date_column: str = "date",
    item_column: str = "crop",
) -> pd.DataFrame:
    """
    Standardizes historical market procurement price records into the Chronos time-series format.

    Args:
        records: Raw list of historical price records containing date, crop, district, and price.
        target_column: Column holding historical price values (INR per quintal).
        date_column: Timestamp or date string.
        item_column: Identifier for the commodity / crop.

    Returns:
        Structured DataFrame ready for time-series forecasting or fine-tuning.
    """
    if not records:
        return pd.DataFrame(columns=[item_column, date_column, target_column])

    df = pd.DataFrame(records)
    df[date_column] = pd.to_datetime(df[date_column])
    df = df.sort_values(by=[item_column, date_column])
    return df


def describe_training_status() -> Dict[str, Any]:
    """
    Returns the operational status and training semantics of the Crop Price Estimator.
    """
    return {
        "model_name": "amazon/chronos-2",
        "training_mode": "Zero-shot inference (Pretrained foundation model)",
        "fine_tuning_supported": True,
        "requires_local_training": False,
        "note": "Uses Amazon Chronos-2 pretrained weights. Real historical mandi/procurement data can be supplied via prepare_market_price_dataset() without retraining the base model.",
    }


if __name__ == "__main__":
    status = describe_training_status()
    print("Crop Price Estimator Status:")
    for k, v in status.items():
        print(f"  {k}: {v}")
