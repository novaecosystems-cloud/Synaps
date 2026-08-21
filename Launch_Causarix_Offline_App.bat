@echo off
title Causarix Sovereign OS - Offline Desktop App
color 0B
cls

echo ===============================================================================
echo   CAUSARIX SOVEREIGN OS - OFFLINE DESKTOP APPLICATION LAUNCHER
echo ===============================================================================
echo   * Hardware: Intel Core i3-1315U ^| Neural Storage: D:\OllamaModels
echo   * Mode:     100%% Sovereign Offline Air-Gapped Execution
echo ===============================================================================
echo.

:: 1. Ensure Ollama is running (non-blocking)
echo [1/2] Initializing Ollama on D:\OllamaModels...
start "" /B "C:\Users\Shourya\AppData\Local\Programs\Ollama\ollama.exe" serve >nul 2>&1

:: 2. Ensure Next.js Local Server is running (non-blocking background window)
echo [2/2] Launching Causarix Engine on port 3000...
cd /d D:\Synaps
start "Causarix Background Server" /MIN cmd /c "cd /d D:\Synaps && npm run dev"

:: 3. Launch Native App Frame (Border-less Standalone Application Window)
echo.
echo [*] Launching Native Causarix Desktop Window...
ping -n 3 127.0.0.1 >nul

start "" msedge.exe --app="http://localhost:3000/dashboard" --window-size=1440,900 --name="Causarix Sovereign OS"

echo [SUCCESS] Causarix Sovereign OS is now active!
exit
