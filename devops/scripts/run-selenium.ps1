# =========================================================================
# Selenium E2E Test Runner Script (PowerShell)
# Student: Pushkar Waykole (23102C0012)
# =========================================================================

$JAVA_PATH = "C:\Program Files\Java\jdk-21"
if (Test-Path $JAVA_PATH) {
    $env:JAVA_HOME = $JAVA_PATH
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$DevOpsDir = Split-Path -Parent $ScriptDir
$RootDir = Split-Path -Parent $DevOpsDir
$SeleniumDir = Join-Path $RootDir "tests\selenium"

Write-Host "Running Selenium Headless E2E Test Suite..." -ForegroundColor Cyan
Set-Location $SeleniumDir
.\mvnw.cmd test -Dheadless=true
Write-Host "Selenium test run completed. Reports saved in $SeleniumDir\target\surefire-reports" -ForegroundColor Green
