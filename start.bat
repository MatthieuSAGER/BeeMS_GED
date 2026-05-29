@echo off
chcp 65001 >nul
echo ==========================================
echo  Démarrage de BeeMS GED
  Gestion Électronique de Documents
==========================================
echo.

rem Démarrer le backend dans une nouvelle fenêtre
start "Backend - BeeMS GED" cmd /k "cd /d %~dp0 && start_backend.bat"

rem Attendre 2 secondes pour que le backend démarre
timeout /t 2 /nobreak >nul

rem Démarrer le frontend dans une nouvelle fenêtre
start "Frontend - BeeMS GED" cmd /k "cd /d %~dp0 && start_frontend.bat"

echo.
echo ==========================================
echo  BeeMS GED est en cours de démarrage...
echo.
echo  Backend:  http://localhost:8000
echo  Frontend: http://localhost:3000
echo.
echo  Appuyez sur une touche pour fermer cette fenêtre
echo ==========================================
echo.

pause >nul
