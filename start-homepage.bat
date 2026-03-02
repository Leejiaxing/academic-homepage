@echo off
setlocal

set PORT=8000
set HOST=127.0.0.1
set URL=http://%HOST%:%PORT%

cd /d "%~dp0"

where python >nul 2>nul
if %errorlevel%==0 (
  set "PY=python"
) else (
  where py >nul 2>nul
  if %errorlevel%==0 (
    set "PY=py -3"
  ) else (
    echo Python not found. Please install Python 3 first.
    pause
    exit /b 1
  )
)

echo Starting local server at %URL%
start "Academic Homepage Server" cmd /k %PY% -m http.server %PORT% --bind %HOST%

timeout /t 1 >nul
start "" %URL%

exit /b 0
