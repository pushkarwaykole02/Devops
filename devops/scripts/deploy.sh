#!/usr/bin/env bash
# =========================================================================
# Automated Deployment Script
# Student: Pushkar Waykole (23102C0012)
# =========================================================================
set -e

echo "===> Deploying Automated Broadband Installation Workflow Stack..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEVOPS_DIR="$(dirname "$SCRIPT_DIR")"
ROOT_DIR="$(dirname "$DEVOPS_DIR")"

cd "$ROOT_DIR"

if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

echo "Building and launching containers..."
docker compose up --build -d

echo "Waiting for backend service health..."
MAX_ATTEMPTS=15
ATTEMPT=1
while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    if curl -s -f http://localhost:8080/api/health > /dev/null; then
        echo "Backend health check PASSED on attempt $ATTEMPT!"
        break
    fi
    echo "Waiting for backend service to become healthy ($ATTEMPT/$MAX_ATTEMPTS)..."
    sleep 3
    ATTEMPT=$((ATTEMPT + 1))
done

if [ $ATTEMPT -gt $MAX_ATTEMPTS ]; then
    echo "ERROR: Backend health check failed after timeout!"
    exit 1
fi

echo "===> Deployment Completed Successfully!"
echo "Web Portal: http://localhost"
echo "Backend API: http://localhost:8080/api"
