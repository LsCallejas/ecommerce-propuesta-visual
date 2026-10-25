@echo off
chcp 65001 > nul
title Plataforma E-Commerce Oficial & Panel Administrativo

echo =========================================================================
echo    🚀 INICIANDO DEMOSTRACIÓN DE LA PLATAFORMA E-COMMERCE
echo =========================================================================
echo.
echo  Abriendo la Tienda Pública y el Panel de Administración...
echo.

REM Intenta iniciar un servidor web liviano con Python si está disponible
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo  [OK] Python detectado. Iniciando servidor web en http://localhost:8080 ...
    start http://localhost:8080/index.html
    python -m http.server 8080
) else (
    echo  [INFO] Abriendo directamente en tu navegador predeterminado...
    start index.html
)

pause
