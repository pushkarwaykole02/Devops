#!/usr/bin/env bash
# =========================================================================
# Local Development Startup Script (Linux/macOS Bash)
# Project: Automated Broadband Installation Workflow
# =========================================================================

set -e

echo "=========================================================="
echo " Automated Broadband Installation Workflow - Local Runner"
echo " Student: Pushkar Waykole (23102C0012)"
echo "=========================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo "Starting Spring Boot Backend in background..."
cd "$BACKEND_DIR"
chmod +x ./mvnw
./mvnw spring-boot:run &
BACKEND_PID=$!

echo "Starting React Frontend dev server..."
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM

echo "Services started:"
echo " - Frontend: http://localhost:3000"
echo " - Backend API: http://localhost:8080"
echo "Press Ctrl+C to terminate both servers."

wait
