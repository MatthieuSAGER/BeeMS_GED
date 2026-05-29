@echo off
chcp 65001 >nul
echo Demarrage du backend BeeMS GED...
echo ================================

cd backend

rem Verifier si Python est installe
python --version >nul 2>&1
if errorlevel 1 (
    echo Erreur: Python n'est pas installe ou n'est pas dans le PATH
    echo Veuillez installer Python 3.10+ et reessayer
    pause
    exit /b 1
)

rem Creer l'environnement virtuel si inexistant
if not exist venv (
    echo Creation de l'environnement virtuel...
    python -m venv venv
)

rem Activer l'environnement virtuel
call venv\Scripts\activate

rem Installer les dependances si necessaire
if not exist venv\Lib\site-packages\fastapi (
    echo Installation des dependances...
    pip install -r requirements.txt
)

rem Configurer le chemin de la base de donnees (utiliser des forward slashes)
set DATABASE_PATH=database/beems_ged.db

echo Demarrage du serveur FastAPI...
echo Acces: http://localhost:8000
echo Appuyez sur Ctrl+C pour arreter

python main.py
