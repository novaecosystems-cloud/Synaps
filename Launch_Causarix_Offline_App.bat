@echo off
title Causarix Sovereign OS - Native Desktop App
color 0B
cls

echo ===============================================================================
echo   CAUSARIX SOVEREIGN OS - NATIVE DESKTOP APPLICATION
echo ===============================================================================
echo   * Hardware: Intel Core i3-1315U ^| Neural Storage: D:\OllamaModels
echo   * Mode:     100%% Sovereign Offline Air-Gapped Execution
echo ===============================================================================
echo.

:: 1. Ensure Ollama is running in background
echo [1/2] Initializing Ollama on D:\OllamaModels...
start "" /B "C:\Users\Shourya\AppData\Local\Programs\Ollama\ollama.exe" serve >nul 2>&1

:: 2. Ensure Local Server is active
echo [2/2] Launching Causarix Local Engine...
cd /d D:\Synaps
start "Causarix Background Server" /MIN cmd /c "cd /d D:\Synaps && npm run dev"

:: 3. Launch Real Native Electron Window (Custom Branded Frame / No localhost URL bar)
echo.
echo [*] Launching Native Causarix Desktop Application...
ping -n 3 127.0.0.1 >nul

set SYNAPS_DEV=true
start "" "D:\Synaps\node_modules\electron\dist\electron.exe" "D:\Synaps\electron\main.js"

echo [SUCCESS] Causarix Sovereign OS Native Application Launched!
exit
