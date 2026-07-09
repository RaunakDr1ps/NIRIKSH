@echo off
cd /d "%~dp0backend"
echo.
echo [96m============================================[0m
echo [96m  NIRIKSH Backend Server v2.1.0[0m
echo [96m============================================[0m
echo.
if not exist "venv" (
    echo [93m[INFO] Creating virtual environment...[0m
    python -m venv venv
)
echo [93m[INFO] Activating virtual environment...[0m
call venv\Scripts\activate.bat
echo [93m[INFO] Installing dependencies...[0m
pip install -r requirements.txt
echo.
echo [92m[INFO] Starting server on http://localhost:8000[0m
echo.
python main.py
pause
