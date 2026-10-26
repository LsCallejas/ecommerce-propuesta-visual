@echo off
title E-Commerce Daniel Campos - Docker Compose (Windows / WSL)
echo ======================================================================
echo    INICIANDO E-COMMERCE CON DOCKER (NGINX + API + POSTGRESQL 16)
echo    Responsable: Daniel Campos
echo ======================================================================
echo.

set DOCKER_CMD=

where docker >nul 2>&1
if %errorlevel% equ 0 (
    set DOCKER_CMD=docker
    goto :RUN_DOCKER
)

where wsl >nul 2>&1
if %errorlevel% equ 0 (
    wsl docker --version >nul 2>&1
    if %errorlevel% equ 0 (
        set DOCKER_CMD=wsl docker
        echo [INFO] Docker detectado a traves de WSL (Windows Subsystem for Linux).
        goto :RUN_DOCKER
    )
)

echo [AVISO] Docker no esta instalado o no esta en ejecucion en esta maquina.
echo.
echo Si deseas probar el sistema sin Docker de forma inmediata, ejecuta:
echo    iniciar_demo.bat
echo.
echo Si tienes Docker Desktop, asegurate de abrirlo y reintentar este script.
echo.
pause
exit /b 1

:RUN_DOCKER
echo [+] Levantando contenedores (Web Nginx + Micro-Backend + PostgreSQL 16)...
%DOCKER_CMD% compose up -d

if %errorlevel% neq 0 (
    echo [ERROR] Hubo un problema al levantar los contenedores con Docker Compose.
    pause
    exit /b %errorlevel%
)

echo.
echo ======================================================================
echo  [OK] SERVICIOS ACTIVOS CON DOCKER:
echo.
echo  * Tienda Publica:       http://localhost:8080/index.html
echo  * Panel Administrativo: http://localhost:8080/admin.html
echo  * Base de Datos:        localhost:5432 (PostgreSQL 16)
echo    - Base de Datos:      ecommerce_db
echo    - Usuario:            daniel_admin
echo    - Contrasena:         DanielAdmin2026Secure!
echo ======================================================================
echo.
echo Abriendo la tienda en tu navegador...
start http://localhost:8080/index.html
pause
