@echo off
title CarePlus Backend Server
echo Starting CarePlus Spring Boot Backend...
cd backend

:: Load GEMINI_API_KEY from .env file if it exists
if exist .env (
    for /f "tokens=1,* delims==" %%A in (.env) do (
        set %%A=%%B
    )
    echo [INFO] Loaded API key from .env
)

mvn spring-boot:run
pause
