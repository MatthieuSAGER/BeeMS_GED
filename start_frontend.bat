@echo off
chcp 65001 >nul
echo Démarrage du frontend BeeMS GED...
echo =================================

cd frontend

rem Vérifier si Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo Erreur: Node.js n'est pas installé ou n'est pas dans le PATH
    echo Veuillez installer Node.js 18+ et réessayer
    pause
    exit /b 1
)

rem Vérifier si npm est installé
npm --version >nul 2>&1
if errorlevel 1 (
    echo Erreur: npm n'est pas installé
    pause
    exit /b 1
)

rem Installer les dépendances si nécessaire
if not exist node_modules (
    echo Installation des dépendances...
    npm install
)

echo Démarrage du serveur de développement Vite...
echo Accès: http://localhost:3000
echo Appuyez sur Ctrl+C pour arrêter

npm run dev
