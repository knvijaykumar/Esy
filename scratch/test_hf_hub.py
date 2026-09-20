from huggingface_hub import list_repo_files

def list_files(repo):
    try:
        files = list_repo_files(repo)
        print(f"--- {repo} ---")
        print(files)
    except Exception as e:
        print(f"Failed for {repo}: {e}")

list_files("cpoisson/plantnet300k-resnet18")
list_files("BiernyVR/crop-disease-classifier")
