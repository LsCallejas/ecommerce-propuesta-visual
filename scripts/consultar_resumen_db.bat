@echo off
chcp 65001 >nul
cls
echo ==============================================================================
echo    DEMOSTRACIÓN OFICIAL DE BASE DE DATOS POSTGRESQL 16
echo    Proyecto E-Commerce — Administrador: Daniel Campos
echo ==============================================================================
echo.
echo Consultando estado en vivo en Docker (ecommerce_postgres_db)...
echo.
set SQL_CMD="SELECT table_name AS \"TABLAS CREADAS EN POSTGRESQL\" FROM information_schema.tables WHERE table_schema='public'; SELECT id, sku, name, sale_price, stock FROM products; SELECT id, customer_name, total, status FROM orders; SELECT sku, name, cost_price, sale_price, unit_profit, margin_percentage, stock FROM v_inventory_financials;"

where docker >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    docker exec -it ecommerce_postgres_db psql -U daniel_admin -d ecommerce_db -c %SQL_CMD%
) else (
    wsl docker exec -it ecommerce_postgres_db psql -U daniel_admin -d ecommerce_db -c %SQL_CMD%
)

echo.
echo ==============================================================================
echo    CONSULTA COMPLETADA EXITOSAMENTE DESDE POSTGRESQL 16 (ACID)
echo ==============================================================================
echo.
pause
