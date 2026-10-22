# =========================================================================
# Local Development Startup Script (PowerShell)
# Project: Automated Broadband Installation Workflow
# =========================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Automated Broadband Installation Workflow - Local Runner" -ForegroundColor Cyan
Write-Host " Student: Pushkar Waykole (23102C0012)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$JAVA_PATH = "C:\Program Files\Java\jdk-21"
if (Test-Path $JAVA_PATH) {
    $env:JAVA_HOME = $JAVA_PATH
    Write-Host "[✓] Configured JAVA_HOME to $JAVA_PATH" -ForegroundColor Green
}

$RootDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$BackendDir = Join-Path $RootDir "backend"
$FrontendDir = Join-Path $RootDir "frontend"

Write-Host "`nStarting Spring Boot Backend on http://localhost:8081..." -ForegroundColor Yellow
$BackendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BackendDir'; `$env:JAVA_HOME = '$JAVA_PATH'; .\mvnw.cmd spring-boot:run" -PassThru

Start-Sleep -Seconds 4

Write-Host "`nStarting React Frontend on http://localhost:3000..." -ForegroundColor Yellow
$FrontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$FrontendDir'; npm run dev" -PassThru

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host " Services Launched Successfully!" -ForegroundColor Green
Write-Host "  - Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  - Backend API: http://localhost:8081" -ForegroundColor White
Write-Host "  - Health Check: http://localhost:8081/api/health" -ForegroundColor White
Write-Host "  - H2 Database Console: http://localhost:8081/h2-console" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green
