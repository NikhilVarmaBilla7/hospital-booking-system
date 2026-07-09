@echo off
title CarePlus Backend Server
echo Starting backend...
cd backend

if exist .env (
    for /f "tokens=1,* delims==" %%A in (.env) do (
        set %%A=%%B
    )
)

mvn spring-boot:run
pause
