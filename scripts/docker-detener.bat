@echo off
title E-Commerce Daniel Campos - Detener Docker (Windows / WSL)
echo ======================================================================
echo    DETENIENDO CONTENEDORES DOCKER (NGINX + API + POSTGRESQL 16)
echo    Responsable: Daniel Campos
echo ======================================================================
echo.

set DOCKER_CMD=

where docker >nul 2>&1
if %errorlevel% equ 0 (
    set DOCKER_CMD=docker
    goto :STOP_DOCKER
)

where wsl >nul 2>&1
if %errorlevel% equ 0 (
    wsl docker --version >nul 2>&1
    if %errorlevel% equ 0 (
        set DOCKER_CMD=wsl docker
        echo [INFO] Docker detectado a traves de WSL.
        goto :STOP_DOCKER
    )
)

echo [AVISO] Docker no esta en ejecucion.
pause
exit /b 0

:STOP_DOCKER
echo [+] Deteniendo contenedores de manera segura...
%DOCKER_CMD% compose down
echo.
echo ======================================================================
echo  [OK] Contenedores detenidos correctamente.
echo.
echo  Garantia de Persistencia:
echo  Los datos de productos, ordenes y configuracion permanecen
echo  100% seguros y guardados en el volumen: ecommerce_postgres_data.
echo  Al volver a ejecutar docker-iniciar.bat, toda la informacion
echo  estara intacta.
echo ======================================================================
pause
