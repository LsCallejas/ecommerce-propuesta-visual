@echo off
title E-Commerce Daniel Campos - Detener Docker
echo ======================================================================
echo    DETENIENDO CONTENEDORES DOCKER (NGINX + POSTGRESQL 16)
echo    Responsable: Daniel Campos
echo ======================================================================
echo.
docker compose down
echo.
echo [OK] Contenedores detenidos correctamente.
echo Los datos de la base de datos se conservan en el volumen postgres_data.
pause
