#!/usr/bin/env bash

# Install project dependencies and manage it using poetry
set -e  # Exit on error

# Step 1: Install Poetry if not found
if ! command -v poetry &> /dev/null
then
    echo "🔧 Installing Poetry..."
    pip install --quiet poetry
else
    echo "Poetry is already installed."
fi

# Step 2: Install dependencies from pyproject.toml
echo "Installing dependencies with Poetry..."
poetry install --no-root --no-interaction

# Step 3: Ensure ipykernel is available inside the Poetry environment
echo "Ensuring ipykernel is installed..."
poetry run pip install ipykernel

# Step 4: Register this virtual environment as a Jupyter kernel
KERNEL_NAME="eagleEyeIntelligence"
DISPLAY_NAME="Python ($KERNEL_NAME)"

echo "Registering the virtual environment as a Jupyter kernel..."
poetry run python -m ipykernel install --user --name "$KERNEL_NAME" --display-name "$DISPLAY_NAME" 

echo "Done! Open your .ipynb file and switch the kernel to '$DISPLAY_NAME' from the Kernel menu."