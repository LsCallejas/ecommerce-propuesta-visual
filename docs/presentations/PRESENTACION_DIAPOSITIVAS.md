# 📊 GUÍA MAESTRA DE LA PRESENTACIÓN POWERPOINT (EDICIÓN 20 DIAPOSITIVAS)
## Plataforma E-Commerce Oficial, Despliegue en Docker y Base de Datos PostgreSQL 16
**Autor / Expositor:** Daniel Campos (`daniel@tienda.com`)  
**Fecha:** Octubre 2026  
**Formato Oficial:** 16:9 Pantalla Panorámica (Widescreen) con Notas del Orador  
**Archivo PowerPoint (.pptx):** [PRESENTACION_ECOMMERCE_Y_BASE_DE_DATOS_DANIEL_CAMPOS.pptx](file:///c:/Users/pc/OneDrive/Desktop/PRESENTACION_ECOMMERCE_Y_BASE_DE_DATOS_DANIEL_CAMPOS.pptx)  

---

## 📑 ÍNDICE DETALLADO DE LAS 20 DIAPOSITIVAS

### 1. Portada Ejecutiva Oficial (Dark Navy)
- **Título:** PLATAFORMA E-COMMERCE OFICIAL Y PANEL ADMINISTRATIVO BACKOFFICE
- **Subtítulo:** Arquitectura Desacoplada de 3 Niveles • Motor PostgreSQL 16 (ACID) en 3FN • Docker Compose
- **Ficha Técnica:** Daniel Campos (Autor y Administrador del Sistema) | `daniel@tienda.com`
- **Repositorio GitHub:** `https://github.com/LsCallejas/ecommerce-propuesta-visual`
- **Notas del Orador:** Protocolo de apertura, bienvenida al jurado examinador y resumen del proyecto.

### 2. Contexto y Planteamiento del Problema
- **Columna 1:** Inconsistencia de Inventario y Peligro de Sobreventa (*Overselling*) en bases no relacionales.
- **Columna 2:** Prototipos Efímeros y Frágiles (pérdida de datos en memoria local o bases de datos no desacopladas).
- **Columna 3:** Trazabilidad Contable Rota (corrupción del historial de ventas por alteración de precios pasados).
- **Notas del Orador:** Justificación del porqué se descartó un desarrollo superficial y se diseñó una solución con rigor de ingeniería.

### 3. Objetivos del Proyecto (General y Específicos)
- **Tarjeta 1 (Objetivo General):** Desarrollo e implementación de la plataforma transaccional desacoplada en 3 capas contenerizada con PostgreSQL 16 en 3FN.
- **Tarjeta 2 (Objetivos Específicos):** Modelado de 7 tablas relacionales e índices B-Tree; micro-backend Express con Connection Pooling; interfaz reactiva multi-arquetipo; automatización con Docker Compose.
- **Notas del Orador:** Enfoque en resultados demostrables y artefactos verificables en el repositorio.

### 4. Topología Desacoplada de 3 Niveles en Docker
- **Nivel 1 (Web):** `ecommerce_web_app` — Nginx 1.25 Alpine en puerto 8080 (Reverse Proxy hacia `/api/*`).
- **Nivel 2 (API):** `ecommerce_api_service` — Node.js 20 LTS Express en puerto 3000 interno (Lógica de negocio y pooling).
- **Nivel 3 (Database):** `ecommerce_postgres_db` — PostgreSQL 16 Alpine en puerto 5432 (Persistencia en volumen `postgres_data`).
- **Notas del Orador:** Explicación de la fachada única de Nginx y por qué el cliente nunca se conecta directo a la base de datos.

### 5. Capa de Presentación: Frontend Web & UX/UI Reactivo
- **Tarjeta 1:** Core tecnológico limpio (HTML5 Semántico, Vanilla CSS3, ES6+ Modular sin frameworks pesados ni bloatware).
- **Tarjeta 2:** Estado reactivo con el manejador `Storage` (patrón Pub/Sub local, sincronización online con REST API y fallback offline).
- **Tarjeta 3:** Experiencia interactiva (diseño responsivo, modo oscuro, carrito flotante reactivo y telemetría en tiempo real).
- **Notas del Orador:** Por qué Vanilla JS demuestra dominio fundamental del lenguaje y garantiza tiempos de carga inferiores a 150 ms.

### 6. Motor Dinámico Multi-Arquetipo (Metamorfosis Visual)
- **Tarjeta 1:** El desafío de la rigidez visual en tiendas tradicionales y los altos costos de comprar o rehacer plantillas.
- **Tarjeta 2:** Inyección en caliente de CSS Custom Properties (`--primary-color`, tipografías, banners y estilos de botón).
- **Tarjeta 3:** Persistencia en la tabla `store_config` de PostgreSQL y propagación en tiempo real a todos los clientes.
- **Notas del Orador:** Demostración de versatilidad de negocio: una sola instalación sirve para tecnología, moda boutique o café gourmet con 1 clic.

### 7. Capa de Servicios: Micro-Backend REST API con Express
- **Tarjeta 1:** Estructura RESTful estandarizada (`/api/products`, `/api/orders`, `/api/suppliers`, `/api/health`, `/api/purchases`).
- **Tarjeta 2:** Resiliencia operativa (middleware de parsing JSON, cabeceras CORS, logging y códigos de estado HTTP correctos).
- **Tarjeta 3:** Seguridad por contención en red interna Docker (puerto 3000 inaccesible desde el exterior).
- **Notas del Orador:** Arquitectura *stateless* que permite escalar horizontalmente la API detrás de un balanceador de carga.

### 8. Seguridad y Optimización de Conexiones (Connection Pooling)
- **Tarjeta 1:** Connection Pooling con `pg.Pool` (máximo 20 hilos reutilizables, previniendo saturación de memoria RAM).
- **Tarjeta 2:** Blindaje contra SQL Injection mediante consultas preparadas obligatorias (*Prepared Statements* con `$1, $2, ...`).
- **Tarjeta 3:** Control de acceso RBAC (`admin` / `cliente`) con restricciones CHECK y contraseñas cifradas con hash Bcrypt.
- **Notas del Orador:** Resaltar el Connection Pooling como el sello distintivo de una arquitectura de nivel Senior.

### 9. Capa de Base de Datos: Justificación Técnica de PostgreSQL 16
- **Tarjeta 1:** Propiedades ACID innegociables (Atomicidad, Consistencia, Aislamiento y Durabilidad).
- **Tarjeta 2:** Comparativa exhaustiva: PostgreSQL vs NoSQL/MongoDB (por qué descartamos consistencia eventual en compras).
- **Tarjeta 3:** Motor PostgreSQL 16.15 Alpine (soporte nativo UUID, precisión numérica fija `DECIMAL(10,2)` y ligereza).
- **Notas del Orador:** Argumentación categórica: el dinero y el stock exigen ACID; NoSQL es un antipatrón en checkout financiero.

### 10. Normalización de Base de Datos: Aplicación de la 3FN
- **Tarjeta 1:** Primera Forma Normal (1FN) — Atributos atómicos, eliminación de listas o campos repetitivos y claves primarias únicas.
- **Tarjeta 2:** Segunda Forma Normal (2FN) — Dependencia funcional total de la clave primaria; separación de entidades independientes.
- **Tarjeta 3:** Tercera Forma Normal (3FN) — Eliminación estricta de dependencias transitivas mediante claves foráneas.
- **Notas del Orador:** Demostración de aplicación rigurosa de la teoría relacional de Codd para evitar anomalías de inserción y borrado.

### 11. Diccionario de Datos: Catálogo y Cadena de Suministro
- **Tarjeta 1:** Tabla `products` (campos `id` SERIAL PK, `sku` UNIQUE, `slug`, precios costo/venta, restricción `CHECK stock >= 0`).
- **Tarjeta 2:** Tabla `suppliers` (proveedores internacionales, términos de pago, rating y volumen total invertido).
- **Tarjeta 3:** Integridad referencial (`ON DELETE SET NULL` en `supplier_id` para proteger la existencia del catálogo).
- **Notas del Orador:** Importancia de la doble contabilidad (`cost_price` vs `sale_price`) para calcular la rentabilidad real.

### 12. Diccionario de Datos: Ventas, Compras y Detalles
- **Tarjeta 1:** Tabla `orders` (cabecera de compras de clientes, montos totales, método de pago y estados del pedido).
- **Tarjeta 2:** Tabla `order_items` (detalle N:M, claves foráneas y **congelación del `unit_price` histórico**).
- **Tarjeta 3:** Tabla `purchases` (lotes de abastecimiento, auditoría de capital inmovilizado y conciliación de facturas).
- **Notas del Orador:** La congelación del precio unitario histórico en `order_items` protege la fidelidad contable ante futuros aumentos de precio.

### 13. Inteligencia de Negocio: Vista Analítica `v_inventory_financials`
- **Tarjeta 1:** El concepto de vista SQL (cálculo en caliente sin almacenar datos redundantes).
- **Tarjeta 2:** Fórmulas matemáticas integradas (Ganancia unitaria, Margen comercial %, Inventario total valorado y Utilidad proyectada).
- **Tarjeta 3:** Impacto gerencial (auditoría inmediata para el administrador mediante una consulta simple `SELECT *`).
- **Notas del Orador:** Demostrar que la base de datos actúa como motor analítico activo para la toma de decisiones.

### 14. Optimización de Rendimiento: Estrategia de Indexación B-Tree
- **Tarjeta 1:** El salto algorítmico de Table Scan $O(n)$ a búsqueda en árbol B-Tree $O(\log n)$.
- **Tarjeta 2:** Los 5 índices especializados creados (`idx_products_sku`, `idx_products_category`, `idx_orders_status`, `idx_orders_date`, `idx_users_email`).
- **Tarjeta 3:** Tiempos de respuesta inferiores a 5 milisegundos aun en catálogos masivos.
- **Notas del Orador:** Justificación técnica de por qué se indexaron esos 5 campos específicos según los casos de uso más frecuentes.

### 15. Diagrama de Secuencia: Flujo Transaccional de Checkout
- **Grid 1:** Validación y confirmación del pedido en el carrito reactivo del frontend.
- **Grid 2:** Enrutamiento mediante Nginx Reverse Proxy hacia la API Express.
- **Grid 3:** Bloque transaccional ACID (`BEGIN ... COMMIT`) con descuento condicional de existencias en PostgreSQL.
- **Grid 4:** Manejo de excepciones: `COMMIT` si hay stock suficiente o `ROLLBACK` automático si el stock llega a 0 por el constraint CHECK.
- **Notas del Orador:** El diagrama maestro para explicar cómo se previene la sobreventa de productos en compras simultáneas.

### 16. Contenerización con Docker Compose y Red Bridge
- **Tarjeta 1:** Orquestación declarativa como código (`docker-compose.yml`) con 3 servicios coordinados y healthchecks.
- **Tarjeta 2:** Red privada `ecommerce_network` con resolución DNS interna entre contenedores y puertos expuestos mínimos.
- **Tarjeta 3:** Persistencia inmutable en volumen físico `ecommerce_postgres_data` independiente del ciclo de vida del contenedor.
- **Notas del Orador:** Garantía de paridad absoluta entre desarrollo, evaluación y producción.

### 17. Guía Paso a Paso para Despliegue en Windows (WSL 2)
- **Grid 1:** Habilitación de WSL 2 con `wsl --install` y verificación en versión 2.
- **Grid 2:** Instalación de Docker Desktop con motor WSL 2 o Docker nativo en Ubuntu.
- **Grid 3:** Automatización en 1 clic con `docker-iniciar.bat` híbrido.
- **Grid 4:** Enlaces a la tienda (`:8080`), panel admin (`/admin.html`) y credenciales oficiales.
- **Notas del Orador:** Cómo cualquier profesor puede correr el proyecto en su máquina personal sin configuraciones complejas.

### 18. Demostración Práctica en Vivo (4 Acciones Clave)
- **Grid 1:** Crear un producto en el panel web y auditar su inserción en vivo en PostgreSQL.
- **Grid 2:** Modificar el ciclo de vida de una orden (`Pendiente` -> `Enviado`) y verificar la actualización en SQL.
- **Grid 3 (Prueba de Fuego):** Apagar contenedores con `docker-detener.bat` y levantarlos con `docker-iniciar.bat`, demostrando cero pérdida de datos.
- **Grid 4:** Inspección de telemetría en tiempo real desde la pastilla web y consulta de la vista financiera.
- **Notas del Orador:** Guión exacto para seguir durante la demostración en vivo con la laptop.

### 19. Banco de Preguntas Típicas del Jurado y Respuestas Senior (FAQ)
- **P1:** *¿Por qué PostgreSQL y no NoSQL/MongoDB?* (Garantías ACID y prevención de sobreventa vs. consistencia eventual).
- **P2:** *¿Cómo evitan compras duplicadas simultáneas?* (Aislamiento de fila, transacciones atómicas y restricción `CHECK stock >= 0`).
- **P3:** *¿Cómo se protegen de Inyección SQL?* (Consultas parametrizadas con Prepared Statements `$1, $2`).
- **Notas del Orador:** Memorizar los tres conceptos clave: ACID, Prepared Statements y restricciones CHECK en hardware/motor.

### 20. Conclusiones, Roadmap a Producción y Cierre (Dark Navy)
- **Logros:** Arquitectura Enterprise desacoplada, modelo relacional en 3FN, fidelidad contable y experiencia de usuario superior.
- **Roadmap a Producción:** Despliegue en la nube (AWS / DigitalOcean), certificados SSL/HTTPS con Let's Encrypt y CI/CD con GitHub Actions.
- **Agradecimiento Protocolar:** Cierre formal y apertura de la sesión de preguntas y respuestas.
- **Notas del Orador:** Agradecer al jurado y dar paso con seguridad a la ronda de preguntas.
