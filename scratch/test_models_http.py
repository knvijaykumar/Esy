import requests
import json

def fetch_config(model_name):
    url = f"https://huggingface.co/{model_name}/raw/main/config.json"
    res = requests.get(url)
    print(f"--- {model_name} ---")
    if res.status_code == 200:
        config = res.json()
        print("Keys:", config.keys())
        if 'id2label' in config:
            labels = config['id2label']
            print(f"Total Labels: {len(labels)}")
            print(f"Sample Labels: {list(labels.values())[:10]}")
    else:
        print("Failed to fetch config:", res.status_code)

fetch_config("cpoisson/plantnet300k-resnet18")
fetch_config("BiernyVR/crop-disease-classifier")
