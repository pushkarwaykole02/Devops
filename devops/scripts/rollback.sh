#!/usr/bin/env bash
# =========================================================================
# Automated Rollback Script
# Student: Pushkar Waykole (23102C0012)
# =========================================================================
set -e

ROLLBACK_TAG="${1:-1.0.0}"
echo "===> Rolling back Broadband Workflow to version tag: $ROLLBACK_TAG..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEVOPS_DIR="$(dirname "$SCRIPT_DIR")"
ROOT_DIR="$(dirname "$DEVOPS_DIR")"

cd "$ROOT_DIR"

if [ -f .env ]; then
    sed -i "s/^IMAGE_TAG=.*/IMAGE_TAG=$ROLLBACK_TAG/" .env
fi

echo "Restarting containers with stable release $ROLLBACK_TAG..."
docker compose up -d --remove-orphans

echo "Verifying health after rollback..."
sleep 5
if curl -s -f http://localhost:8080/api/health > /dev/null; then
    echo "Rollback successful and application is UP!"
else
    echo "WARNING: Health check failed after rollback. Check logs with 'docker compose logs'."
    exit 1
fi
