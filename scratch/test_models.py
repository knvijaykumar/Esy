import os
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
import json
from transformers import AutoConfig, pipeline

def check_model(model_name):
    print(f"--- Checking {model_name} ---")
    try:
        config = AutoConfig.from_pretrained(model_name)
        labels = config.id2label
        print(f"Total Labels: {len(labels)}")
        print(f"Sample Labels: {list(labels.values())[:10]}")
    except Exception as e:
        print(f"Error loading config: {e}")

check_model("cpoisson/plantnet300k-resnet18")
check_model("BiernyVR/crop-disease-classifier")
