# 🗄️ Módulo de Base de Datos Relacional: PostgreSQL 16
**Proyecto:** Plataforma E-Commerce Oficial & Backoffice Administrativo  
**Administrador / Dueño:** Daniel Campos  
**Motor RDBMS:** PostgreSQL 16.15 (Alpine) con soporte transaccional ACID  

---

## 🏛️ Estructura del Esquema Relacional ([`init.sql`](init.sql))

El script oficial DDL `init.sql` se ejecuta automáticamente al iniciar el contenedor `ecommerce_postgres_db`. Define:

1. **`store_config`**: Parámetros de branding, colores corporativos, teléfonos y plantilla activa.
2. **`users`**: Control de acceso basado en roles (RBAC: `admin` para Daniel Campos, `cliente` para compradores).
3. **`suppliers`**: Directorio de fabricantes, plazos de pago y balance de inversión.
4. **`products`**: Catálogo comercial, códigos SKU únicos, costos de adquisición, precios de venta y stock físico.
5. **`purchases`**: Facturas contables de lotes de reposición a proveedores.
6. **`orders`**: Registro maestro de pedidos de clientes, montos, cálculo de flete y máquina de estados (`Pendiente`, `En Preparación`, `Enviado`, `Entregado`).
7. **`order_items`**: Detalle relacional 1:N de productos facturados por cada orden de compra.
8. **`v_inventory_financials` (Vista SQL)**: Cálculo en tiempo real de márgenes unitarios, rentabilidad %, costo inmovilizado y utilidad neta proyectada.

---

## 🔌 Conexión Directa

| Parámetro | Valor |
| :--- | :--- |
| **Host** | `localhost` |
| **Puerto** | `5432` |
| **Base de Datos** | `ecommerce_db` |
| **Usuario** | `daniel_admin` |
| **Contraseña** | `DanielAdmin2026Secure!` |

### Conexión rápida por terminal (CLI psql):
```bash
wsl docker exec -it ecommerce_postgres_db psql -U daniel_admin -d ecommerce_db
```
