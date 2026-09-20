import torch
import torchvision.models as models
from huggingface_hub import hf_hub_download

def test_models():
    print("Testing PlantNet...")
    try:
        model1 = models.resnet18(weights=None)
        model1.fc = torch.nn.Linear(model1.fc.in_features, 1081)
        path1 = hf_hub_download("cpoisson/plantnet300k-resnet18", "plantnet_resnet18.pth")
        model1.load_state_dict(torch.load(path1, map_location="cpu"))
        print("PlantNet loaded successfully!")
    except Exception as e:
        print(f"PlantNet error: {e}")

    print("Testing DiseaseNet...")
    try:
        model2 = models.efficientnet_v2_s(weights=None)
        model2.classifier[1] = torch.nn.Linear(model2.classifier[1].in_features, 38)
        path2 = hf_hub_download("BiernyVR/crop-disease-classifier", "efficientnet_v2_s_best.pth")
        model2.load_state_dict(torch.load(path2, map_location="cpu"))
        print("DiseaseNet loaded successfully!")
    except Exception as e:
        print(f"DiseaseNet error: {e}")

test_models()
