@echo off
echo =======================================
echo    Jana Distrib - Lancement Rapide
echo =======================================
echo.

echo [1/4] Verification des prerequis...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installe ou n'est pas dans le PATH
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo AVERTISSEMENT: PostgreSQL n'est pas detecte dans le PATH
    echo Assurez-vous que PostgreSQL est installe et demarre
)

echo [2/4] Installation des dependances du backend...
cd server
if not exist node_modules (
    npm install
    if %errorlevel% neq 0 (
        echo ERREUR: Echec de l'installation des dependances backend
        pause
        exit /b 1
    )
)

echo [3/4] Installation des dependances du frontend...
cd ..\client
if not exist node_modules (
    npm install
    if %errorlevel% neq 0 (
        echo ERREUR: Echec de l'installation des dependances frontend
        pause
        exit /b 1
    )
)

echo [4/4] Lancement de l'application...
cd ..

echo.
echo Verification du fichier .env...
if not exist server\.env (
    echo AVERTISSEMENT: Fichier .env manquant dans server/
    echo Veuillez creer le fichier .env avec la configuration de la base de donnees
    echo Consultez le README.md pour plus d'informations
    echo.
    echo Voulez-vous continuer quand meme? [y/N]
    set /p continue=
    if /i not "%continue%"=="y" (
        echo Lancement annule
        pause
        exit /b 1
    )
)

echo.
echo Lancement du backend (port 5000)...
start "Jana Distrib Backend" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak >nul

echo Lancement du frontend (port 3000)...
start "Jana Distrib Frontend" cmd /k "cd client && npm start"

echo.
echo =======================================
echo    Application en cours de lancement
echo =======================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo Admin:    http://localhost:3000/admin/login
echo.
echo Les deux terminaux vont s'ouvrir automatiquement.
echo Fermez cette fenetre une fois que l'application est lancee.
echo.
pause