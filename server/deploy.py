import os
import requests
from github import Github
from pathlib import Path
import subprocess

# Configuration
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO_NAME = "sontx/print4me"
FOLDER_PATH_IN_REPO = "server"
LOCAL_DESTINATION = os.getcwd()

# Initialize GitHub client
g = Github(GITHUB_TOKEN)
repo = g.get_repo(REPO_NAME)

# Function to download a file
def download_file(file_url, local_path):
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    response = requests.get(file_url, headers=headers)
    response.raise_for_status()

    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    with open(local_path, "wb") as f:
        f.write(response.content)

# Get contents of the folder in the repository
def download_folder(folder_path_in_repo, local_destination):
    contents = repo.get_contents(folder_path_in_repo)

    while contents:
        content = contents.pop(0)

        if content.type == "dir":
            contents.extend(repo.get_contents(content.path))
        else:  # content.type == "file"
            relative_path = os.path.relpath(content.path, folder_path_in_repo)
            local_path = os.path.join(local_destination, relative_path)
            print(f"Downloading {content.path} to {local_path}...")
            download_file(content.download_url, local_path)

# Function to build and deploy the app
def build_and_deploy():
    try:
        print("Building the NestJS app...")
        subprocess.run(["npm", "run", "build"], check=True)

        print("Stopping existing instances...")
        subprocess.run(["pm2", "delete", "ecosystem.config.js"], check=True)

        print("Starting the NestJS app in cluster mode...")
        subprocess.run(["pm2", "start", "ecosystem.config.js", "--instances", "2", "--env", "production"], check=True)

        print("Saving the PM2 process list...")
        subprocess.run(["pm2", "save"], check=True)

        print("Displaying the PM2 process list...")
        subprocess.run(["pm2", "list"], check=True)

        print("Restarting all PM2 processes...")
        subprocess.run(["pm2", "restart", "all"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    print("Cloning folder...")
    download_folder(FOLDER_PATH_IN_REPO, LOCAL_DESTINATION)
    print("Folder cloned successfully.")

    print("Building and deploying the app...")
    build_and_deploy()
    print("Build and deployment completed.")
