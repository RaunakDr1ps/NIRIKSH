@echo off
cd /d "%~dp0frontend"
echo.
echo [96m============================================[0m
echo [96m  NIRIKSH Frontend v2.1.0[0m
echo [96m============================================[0m
echo.
if not exist "node_modules" (
    echo [93m[INFO] Installing dependencies...[0m
    call npm install
)
echo.
echo [92m[INFO] Starting dev server on http://localhost:5173[0m
echo.
call npm run dev
pause
