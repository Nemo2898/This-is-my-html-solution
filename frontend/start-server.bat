@echo off
echo ========================================
echo Starting E-Tendering Frontend Server
echo ========================================
echo.
echo Frontend will be available at:
echo http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python -m http.server 8080
