import json
from huggingface_hub import hf_hub_download

# PlantNet 300K
try:
    path = hf_hub_download(repo_id="cpoisson/plantnet300k-resnet18", filename="plantnet300K_species_id_2_name.json")
    with open(path) as f:
        labels1 = json.load(f)
    print("PlantNet Total Labels:", len(labels1))
    print("PlantNet Sample:", list(labels1.values())[:5])
except Exception as e:
    print(e)

# Crop Disease
try:
    path2 = hf_hub_download(repo_id="BiernyVR/crop-disease-classifier", filename="classes.json")
    with open(path2) as f:
        labels2 = json.load(f)
    print("Disease Total Labels:", len(labels2))
    print("Disease Sample:", labels2[:5] if isinstance(labels2, list) else list(labels2.values())[:5])
except Exception as e:
    print(e)
