# 🛍️ Plataforma E-Commerce Oficial & Panel Administrativo

> **Proyecto de E-Commerce de Alta Gama, Multiarquetipo y Gestión Backoffice Comercial**  
> **Presentador / Administrador:** Daniel Campos  
> **Versión:** 8.0 (Arquitectura Modular Headless / Zero-Dependencies)

---

## 🚀 Descripción General

Esta plataforma es un sistema de **Comercio Electrónico y Gestión Administrativa (Backoffice)** desarrollado para ofrecer una experiencia comercial integral tanto al cliente comprador como al dueño del negocio.

A diferencia de los prototipos convencionales, el sistema implementa:
1. **5 Arquetipos Arquitectónicos Reales**: Diseños con estructuras HTML/CSS radicalmente distintas (no solo cambios de color), desde estilos de Lujo y Streetwear hasta Nórdico y Neobrutalista.
2. **Lógica Financiera Comercial**: Registro de Costos de Adquisición, Cálculo de Margen de Ganancia Bruto/Neto, ROI % proyectado en tiempo real y módulo de Proveedores y Abastecimiento de Stock.
3. **Control Estricto de Roles y Seguridad**: Experiencia de compra 100% limpia para visitantes, con candado de seguridad (*Security Gate*) para acceso restringido a métricas y panel administrativo solo para **Daniel Campos**.
4. **Personalizador Tipo Wix y Editor de Plantillas**: Configuración visual de marca, paletas de colores, textos de banners y un editor de plantillas personalizado con sincronización en tiempo real.
5. **Zero-Dependencies (100% Portable)**: Opera directamente en el navegador mediante el motor reactivo de almacenamiento relacional local, sin requerir instalación de servidores MySQL, Node.js ni Docker para su demostración inmediata.

---

## 🔑 Credenciales de Acceso

| Rol | Usuario / Correo | Contraseña | Experiencia |
| :--- | :--- | :--- | :--- |
| **👑 Dueño / Administrador** | `daniel@tienda.com` *(o `admin@tienda.com`)* | `admin123` | Acceso al **Modo Dueño**, panel administrativo completo, métricas financieras, gestión de productos, órdenes, compras a proveedores y personalizador de plantillas. |
| **🛍️ Cliente Comprador** | `cliente@tienda.com` | `123` | Experiencia de compra limpia: catálogo interactivo, carrito deslizable, cálculo de envío gratis y checkout con generación de número de pedido. |
| **👤 Visitante Anónimo** | *(Sin sesión)* | *(Sin clave)* | Navegación estándar con botón de inicio de sesión. Las herramientas administrativas se encuentran totalmente ocultas. |

---

## ⚡ Opciones de Inicio y Ejecución

La plataforma implementa una **estrategia de ejecución dual**:

### Opción 1: Con Docker Compose (Entorno de Producción Oficial con PostgreSQL 16)
Si tienes **Docker / WSL** en el sistema:
1. Haz doble clic en [`docker-iniciar.bat`](docker-iniciar.bat) o ejecuta:
   ```bash
   docker compose up -d --build
   ```
2. Esto levantará los 3 servicios empresariales interconectados:
   - **Servidor Web Nginx** (`ecommerce_web_app` en puerto `:8080`): Interfaz visual de la tienda y panel administrativo.
   - **Micro-Backend REST API** (`ecommerce_api_service` en puerto `:3000`): Controlador Express con pool de conexiones ACID hacia PostgreSQL 16.
   - **Base de Datos Relacional PostgreSQL 16** (`ecommerce_postgres_db` en puerto `:5432`): Esquema relacional con tablas de productos, órdenes, proveedores y compras.
3. Al ingresar a `http://localhost:8080`, el indicador interactivo `🟢 PostgreSQL 16 (En Vivo)` permite consultar la telemetría en tiempo real y verificar la conexión con la base de datos.
4. Para detener los contenedores preservando la base de datos: [`docker-detener.bat`](docker-detener.bat) o `docker compose down`.

### Opción 2: Portátil Sin Dependencias (En 1 Clic)
Si no tienes Docker en la máquina:
1. Ejecuta el archivo:
   ```cmd
   iniciar_demo.bat
   ```
2. O simplemente abre [`index.html`](index.html) en tu navegador web (Chrome, Edge, Brave, Firefox).
3. El servidor local correrá en: `http://localhost:8080/index.html`.

---

## 📂 Estructura del Proyecto

```text
├── Dockerfile                        # Imagen de producción Nginx Alpine
├── docker-compose.yml                # Orquestación de Web Nginx + PostgreSQL 16
├── nginx.conf                        # Configuración de Nginx con Gzip y cabeceras de seguridad
├── docker-iniciar.bat                # Lanzador de Docker Compose en 1 clic
├── docker-detener.bat                # Detenedor de Docker Compose
├── database/
│   └── init.sql                      # DDL oficial de PostgreSQL 16 (7 tablas, vista e índices)
├── index.html                        # Tienda pública para clientes y compradores
├── styles.css                        # Sistema de diseño, tokens CSS y los 5 arquetipos visuales
├── app.js                            # Lógica reactiva de catálogo, carrito, filtros, checkout y tracking
├── data.js                           # Capa de datos relacional (Adapter Pattern) y catálogo
├── admin.html                        # Panel de control y backoffice administrativo
├── admin.css                         # Estilos del dashboard, analítica y personalizador
├── admin.js                          # Lógica de analítica, proveedores, órdenes, auditoría y plantillas
├── iniciar_demo.bat                  # Script de arranque en 1 clic (servidor local sin dependencias)
├── MANUAL_PROYECTO_ECOMMERCE.md      # Manual técnico y operativo completo (9 capítulos)
├── PLAN_IMPLEMENTACION_PRODUCCION.md # Plan de transición empresarial con PostgreSQL y Docker
├── LEEME_CLIENTE.md                  # Guía rápida de presentación
└── img/                              # Galería de imágenes y productos del catálogo
```

---

## 🎨 Los 5 Arquetipos Visuales Disponibles

1. **⚜️ Estilo Ejecutivo (Luxury & Corporate)**: Estructura monumental centrada, tipografía serif *Playfair Display*, paleta carbón y acentos en oro champán.
2. **⚡ Estilo Moderno (Tech Vanguard & Cyber)**: División en 2 columnas, showcase holográfico de hardware, telemetría de rendimiento y chips de especificaciones técnicas.
3. **🔥 Estilo a la Moda (Lookbook Editorial)**: Tarjetas en formato retrato vertical 3:4, selector de tallas en hover y tipografía urbana.
4. **🌿 Estilo Nórdico (Minimal & Cozy Living)**: Diseño orgánico espacioso, fondos cálidos, acentos botánicos y sellos de sostenibilidad.
5. **★ Estilo Neobrutalista (Pop & High Impact)**: Bordes negros sólidos de 3px, sombras duras desplazadas de 5px, stickers de ofertas y botones arcade táctiles.

---

## 🛠️ Tecnologías Empleadas

- **Frontend Core**: HTML5 Semántico, Vanilla JavaScript (ES6+ Modular y Reactivo).
- **Diseño & Estilos**: Vanilla CSS3 Puro (Variables CSS, Flexbox, CSS Grid, Glassmorphism y Micro-animaciones).
- **Capa de Datos**: Motor Relacional simulado en `localStorage` con patrón *Headless / API-Ready*.
- **Iconografía**: Tipografías nativas y assets vectoriales optimizados para carga ultrarrápida.

---

## 👨‍💻 Autor y Presentación

- **Estudiante / Expositor:** Daniel Campos
- **Proyecto:** Propuesta y Plataforma Comercial de E-Commerce
