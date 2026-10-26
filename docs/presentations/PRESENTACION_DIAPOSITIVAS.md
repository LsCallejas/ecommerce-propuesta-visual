# 📊 GUÍA Y ESTRUCTURA DE LA PRESENTACIÓN POWERPOINT (.PPTX)
## Plataforma E-Commerce Oficial, Despliegue en Docker y Base de Datos PostgreSQL 16
**Autor / Expositor:** Daniel Campos (`daniel@tienda.com`)  
**Fecha:** Octubre 2026  
**Formato Oficial:** 16:9 Pantalla Panorámica (Widescreen)  
**Archivo PowerPoint:** [PRESENTACION_ECOMMERCE_Y_BASE_DE_DATOS_DANIEL_CAMPOS.pptx](file:///c:/Users/pc/OneDrive/Desktop/PRESENTACION_ECOMMERCE_Y_BASE_DE_DATOS_DANIEL_CAMPOS.pptx)  

---

## 📑 ÍNDICE DE DIAPOSITIVAS Y CONTENIDO

### Diapositiva 1: Portada Ejecutiva (Dark Mode)
- **Título:** PLATAFORMA E-COMMERCE OFICIAL Y PANEL ADMINISTRATIVO
- **Subtítulo:** Arquitectura Desacoplada de 3 Niveles • Motor Relacional PostgreSQL 16 (ACID) • Docker Compose
- **Ficha:** Daniel Campos (Autor y Administrador del Sistema) | Repositorio GitHub: `https://github.com/LsCallejas/ecommerce-propuesta-visual`
- **Notas del Orador:** Discurso de saludo formal y apertura técnica.

### Diapositiva 2: Planteamiento del Problema y Objetivos
- **Columna 1 (Desafío):** Inconsistencias de stock en e-commerce tradicionales (sobreventa), pérdida de datos en prototipos sin persistencia, rigidez visual de sistemas monolíticos.
- **Columna 2 (Nuestra Solución):** PostgreSQL 16 con transaccionalidad ACID, contenerización total en Docker y motor de personalización multi-arquetipo en tiempo real.
- **Columna 3 (Objetivos Logrados):** Despliegue en 1 clic en Windows/WSL, vistas SQL para auditoría financiera en vivo y código modular ordenado en GitHub.

### Diapositiva 3: Arquitectura Desacoplada de 3 Niveles
- **Nivel 1 (Frontend):** `ecommerce_web_app` — Nginx 1.25 Alpine en puerto 8080. Reverse proxy de `/api/*`.
- **Nivel 2 (API):** `ecommerce_api_service` — Node.js 20 LTS Express en puerto 3000 con Connection Pooling (`pg.Pool` máx 20).
- **Nivel 3 (Database):** `ecommerce_postgres_db` — PostgreSQL 16 Alpine en puerto 5432 con volumen persistente `ecommerce_postgres_data`.

### Diapositiva 4: Modelado de Base de Datos en Tercera Forma Normal (3FN)
- **Bloque Catálogo:** `products` (doble precio: costo y venta, SKU único, `CHECK stock >= 0`), `suppliers` (proveedores internacionales, términos de pago).
- **Bloque Inversión & Config:** `purchases` (abastecimiento y trazabilidad de capital), `store_config` (personalización de plantilla y branding en caliente).
- **Bloque Transaccional:** `orders` (ciclo de vida del pedido: Pendiente -> Enviado -> Entregado), `order_items` (congelación de `unit_price` histórico).
- **Bloque Seguridad:** `users` (control de acceso RBAC, contraseñas con hash Bcrypt, correos únicos).

### Diapositiva 5: Inteligencia de Negocio y Optimización de Rendimiento
- **Vista Analítica `v_inventory_financials`:** Cálculo en vivo de margen de ganancia porcentual, capital inmovilizado y utilidad proyectada sin duplicar datos en tablas.
- **Estrategia de Indexación B-Tree:** 5 índices especializados (`idx_products_sku`, `idx_products_category`, `idx_orders_status`, `idx_orders_date`, `idx_users_email`) para garantizar búsquedas en tiempo logarítmico $O(\log n)$.

### Diapositiva 6: Despliegue en Windows (WSL 2 + Docker)
- **Paso 1:** Instalación de WSL 2 con `wsl --install` y verificación en versión 2.
- **Paso 2:** Instalación de Docker Desktop con backend WSL 2 activado.
- **Paso 3:** Puesta en marcha en 1 clic mediante `docker-iniciar.bat`.
- **Paso 4:** Accesos a la tienda (`:8080`), panel admin (`/admin.html`) y credenciales oficiales.

### Diapositiva 7: Secuencia de Demostración Práctica en Vivo (4 Acciones)
- **Acción 1:** Creación de un producto en la web y comprobación inmediata en PostgreSQL.
- **Acción 2:** Modificación del estado de una orden y visualización de la actualización transaccional en SQL.
- **Acción 3 (Prueba de Fuego):** Apagado con `docker-detener.bat` y reinicio con `docker-iniciar.bat` demostrando tolerancia a fallos y persistencia en volumen.
- **Acción 4:** Telemetría en tiempo real haciendo clic en la pastilla verde `PostgreSQL 16 (En Vivo)` en la cabecera web.

### Diapositiva 8: Preguntas Típicas del Jurado y Respuestas Senior (FAQ)
- **P1:** *¿Por qué PostgreSQL y no NoSQL/MongoDB?* (Garantías ACID y prevención de sobreventa vs. consistencia eventual).
- **P2:** *¿Cómo evitan compras duplicadas concurrentes?* (Bloqueos de fila, transacciones atómicas y restricción `CHECK (stock >= 0)`).
- **P3:** *¿Cómo se protegen de Inyección SQL?* (Prepared Statements y consultas parametrizadas `$1, $2`).

### Diapositiva 9: Conclusiones y Ronda de Preguntas (Dark Mode)
- **Logros:** Arquitectura Enterprise desacoplada, fidelidad contable 3FN, documentación formal completa y experiencia de usuario superior.
- **Contacto y Repositorio:** Daniel Campos (`daniel@tienda.com`) | GitHub `https://github.com/LsCallejas/ecommerce-propuesta-visual`.
