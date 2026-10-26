@echo off
chcp 65001 >nul
cls
echo ==============================================================================
echo    CONSULTA EN VIVO - BASE DE DATOS POSTGRESQL 16 (ECOMMERCE)
echo    Dueño / Administrador: Daniel Campos
echo ==============================================================================
echo.
echo Conectando con PostgreSQL 16 (ecommerce_db)...
echo.
echo Comandos utiles que puedes escribir aqui:
echo   \dt                          (Listar todas las tablas)
echo   SELECT * FROM products;      (Ver todos los productos y existencias)
echo   SELECT * FROM orders;        (Ver las ordenes registradas)
echo   SELECT * FROM v_inventory_financials; (Ver analisis financiero y margenes)
echo   \q                           (Para salir)
echo.
echo ==============================================================================
echo.
where docker >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    docker exec -it ecommerce_postgres_db psql -U daniel_admin -d ecommerce_db
) else (
    wsl docker exec -it ecommerce_postgres_db psql -U daniel_admin -d ecommerce_db
)
pause
