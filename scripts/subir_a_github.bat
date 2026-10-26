@echo off
title Subir E-Commerce a GitHub (LsCallejas)
echo ====================================================================
echo  SUBIENDO E-COMMERCE A GITHUB - LsCallejas
echo ====================================================================
echo.
echo Verificando configuracion remota...
git remote set-url origin https://github.com/LsCallejas/ecommerce-propuesta-visual.git
echo Remoto configurado: https://github.com/LsCallejas/ecommerce-propuesta-visual.git
echo.
echo Enviando ramas y commits a GitHub...
git push -u origin main
echo.
if %errorlevel% equ 0 (
    echo ====================================================================
    echo  PROYECTO SUBIDO CON EXITO A GITHUB!
    echo  URL: https://github.com/LsCallejas/ecommerce-propuesta-visual
    echo ====================================================================
) else (
    echo ====================================================================
    echo  AVISO: Si dio error, asegurate de:
    echo  1. Haber creado el repositorio vacio en https://github.com/new
    echo     con el nombre exacto: ecommerce-propuesta-visual
    echo  2. Iniciar sesion con tu cuenta LsCallejas si la ventana lo solicita.
    echo ====================================================================
)
pause
