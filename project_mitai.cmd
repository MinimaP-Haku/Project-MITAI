@echo off
title Project MITAI Launcher
color 0b
cls

:menu
echo ========================================
echo        PROJECT MITAI - ALPHA v0.2.1
echo ========================================
echo.
set /p choice="Do you want to start the project? (Y/N): "

if /i "%choice%"=="Y" goto loading
if /i "%choice%"=="N" exit
goto menu

:loading
cls
echo [SYSTEM]: Initializing boot sequence...
timeout /t 1 >nul
echo [SYSTEM]: Loading neural modules...
timeout /t 1 >nul
echo [SYSTEM]: Connecting to core...
timeout /t 2 >nul
cls
echo ========================================
echo          LOADING: [##########] 100%%
echo ========================================
echo.
echo Launching...

if exist "web\title\title.html" (
    start "" "web\title\title.html"
    exit
) else (
    start "" "errors\M-0.vbs"
    exit
)
