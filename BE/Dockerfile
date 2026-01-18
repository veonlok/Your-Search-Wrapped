FROM python:3.11-slim

WORKDIR /server

RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libpq-dev \
    python3-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt instead of pyproject.toml and poetry.lock
COPY requirements.txt .

# Install dependencies with pip (with retries for network issues)
RUN pip install --no-cache-dir -r requirements.txt || \
    (echo "First attempt failed, retrying..." && sleep 5 && pip install --no-cache-dir -r requirements.txt)

# Copy the rest of your app
COPY . .

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
