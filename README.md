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

## ⚡ Inicio Rápido (En 1 Clic)

1. Descarga o clona el repositorio.
2. Ejecuta el archivo:
   ```cmd
   iniciar_demo.bat
   ```
3. O simplemente abre el archivo [`index.html`](index.html) en tu navegador web preferido (Chrome, Edge, Firefox, Brave).
4. El servidor local correrá en: `http://localhost:8080/index.html`.

---

## 📂 Estructura del Proyecto

```text
├── index.html                    # Tienda pública para clientes y compradores
├── styles.css                    # Sistema de diseño, tokens CSS y los 5 arquetipos visuales
├── app.js                        # Lógica reactiva de catálogo, carrito, filtros y checkout
├── data.js                       # Capa de datos relacional y catálogo de productos
├── admin.html                    # Panel de control y backoffice administrativo
├── admin.css                     # Estilos del dashboard, analítica y personalizador
├── admin.js                      # Lógica de analítica, proveedores, órdenes y plantillas
├── iniciar_demo.bat              # Script de arranque en 1 clic (servidor local)
├── MANUAL_PROYECTO_ECOMMERCE.md  # Manual técnico y operativo completo (9 capítulos)
├── LEEME_CLIENTE.md              # Guía rápida de presentación
└── img/                          # Galería de imágenes y productos del catálogo
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
