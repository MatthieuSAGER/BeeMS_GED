@echo off
chcp 65001 >nul
echo Démarrage du backend BeeMS GED...
echo ================================

cd backend

rem Vérifier si Python est installé
python --version >nul 2>&1
if errorlevel 1 (
    echo Erreur: Python n'est pas installé ou n'est pas dans le PATH
    echo Veuillez installer Python 3.10+ et réessayer
    pause
    exit /b 1
)

rem Créer l'environnement virtuel si inexistant
if not exist venv (
    echo Création de l'environnement virtuel...
    python -m venv venv
)

rem Activer l'environnement virtuel
call venv\Scripts\activate

rem Installer les dépendances si nécessaire
if not exist venv\Lib\site-packages\fastapi (
    echo Installation des dépendances...
    pip install -r requirements.txt
)

rem Configurer le chemin de la base de données
set DATABASE_PATH=database\beems_ged.db

echo Démarrage du serveur FastAPI...
echo Accès: http://localhost:8000
echo Appuyez sur Ctrl+C pour arrêter

python main.py
