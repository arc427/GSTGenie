
{ pkgs, ... }: {
  # Nix channel to use.
  channel = "stable-24.05";

  # Packages to make available in the environment.
  packages = [
    pkgs.nodejs_20
    pkgs.python3
  ];

  # Environment variables to set.
  env = {};

  # VS Code extensions to install.
  idx.extensions = [
    "dbaeumer.vscode-eslint"
    "ms-python.python"
  ];

  # Workspace lifecycle hooks.
  idx.workspace = {
    # Runs when a workspace is first created.
    onCreate = {
      frontend-npm-install = "cd frontend && npm install";
      backend-npm-install = "cd backend-api && npm install";
      pip-install = "pip install -r agent-services/requirements.txt";
    };
    # Runs every time the workspace is (re)started.
    onStart = {};
  };

  # Previews to run.
  idx.previews = {
    enable = true;
    previews = {
      # Frontend (React)
      web = {
        command = ["npm" "run" "start" "--prefix" "frontend" "--" "--port" "$PORT"];
        manager = "web";
      };
      # Backend (Express)
      backend = {
        command = ["node" "backend-api/src/server.js" "--port" "3001"];
        manager = "web";
      };
      # Agent (Flask)
      agent = {
        command = ["python" "agent-services/main.py" "--port" "$PORT"];
        manager = "web";
      };
    };
  };
}
