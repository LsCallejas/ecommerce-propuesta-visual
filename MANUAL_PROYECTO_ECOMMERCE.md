# 📘 Manual Técnico y de Usuario — Plataforma E-Commerce Oficial & Panel Administrativo

> **Documento de Entrega y Referencia para Desarrolladores, Clientes y Evaluadores.**  
> Este manual explica en detalle la arquitectura del sistema, el funcionamiento de la base de datos local, la inyección y persistencia de usuarios, y cada uno de los módulos operativos de la plataforma.

---

## 📑 Tabla de Contenidos
1. [Visión General del Proyecto](#1-visión-general-del-proyecto)
2. [Gestión de Usuarios y Base de Datos (¿Quién inyecta los datos?)](#2-gestión-de-usuarios-y-base-de-datos-quién-inyecta-los-datos)
3. [Estructura del Almacenamiento y Esquema de Datos](#3-estructura-del-almacenamiento-y-esquema-de-datos)
4. [Roles del Sistema y Experiencias de Usuario](#4-roles-del-sistema-y-experiencias-de-usuario)
5. [Módulos de la Tienda Pública (Frontend)](#5-módulos-de-la-tienda-pública-frontend)
6. [Módulos del Panel Administrativo del Dueño (Backoffice)](#6-módulos-del-panel-administrativo-del-dueño-backoffice)
7. [Estudio y Funcionamiento de las 5 Plantillas Arquitectónicas](#7-estudio-y-funcionamiento-de-las-5-plantillas-arquitectónicas)
8. [Cómo Ejecutar, Probar y Compartir el Proyecto](#8-cómo-ejecutar-probar-y-compartir-el-proyecto)
9. [Cómo Personalizar o Resetear la Base de Datos](#9-cómo-personalizar-o-resetear-la-base-de-datos)

---

## 1. Visión General del Proyecto

Esta solución es una plataforma de **Comercio Electrónico de Alto Rendimiento para Comercio Único**, compuesta por dos aplicaciones web sincronizadas en tiempo real:

1. **La Tienda Pública (`index.html`)**: El portal donde los clientes descubren productos, filtran por categorías, ven especificaciones técnicas, usan el carrito de compras y completan órdenes con cálculo de envío y múltiples métodos de pago.
2. **El Panel de Control del Dueño (`admin.html`)**: El centro de operaciones exclusivo del dueño del negocio, que incluye analítica de ventas, control de catálogo con márgenes financieros, gestión de inventario, registro de proveedores y compras, personalizador visual en vivo tipo Wix, selector de plantillas arquitectónicas y editor de código estilo Blogger.

**Portabilidad Total:** El sistema está construido con HTML5, CSS3 puro y JavaScript modular estándar. **No requiere instalar motores de base de datos pesados (MySQL, PostgreSQL), ni Docker, ni backend Node/PHP para funcionar al 100%.** Todo funciona de forma autónoma desde el navegador.

---

## 2. Gestión de Usuarios y Base de Datos (¿Quién inyecta los datos?)

### ¿La persona a quien le comparta el proyecto tiene que inyectar los usuarios?
**No. Nadie tiene que inyectar datos manualmente para que el proyecto funcione.**

El archivo `data.js` cuenta con un **Motor de Inicialización Automática (Seed Engine)**:

1. **Al abrir la tienda o el panel por primera vez** en cualquier computadora o navegador:
   - El sistema comprueba si existen datos en el `localStorage` del navegador.
   - Si no existen (o si la versión cambió), `data.js` **inyecta automáticamente** todo el catálogo inicial de productos, proveedores, órdenes de prueba, configuración de tienda y los **usuarios preconfigurados**.
2. **Persistencia Dinámica**:
   - Cada vez que alguien interactúa con la plataforma (crea un producto, añade un proveedor, cambia un texto en el personalizador o hace una compra en el carrito), los cambios se guardan al instante en el `localStorage` local.
3. **¿Cómo agregar o inyectar nuevos usuarios manualmente?**:
   - En el archivo `data.js`, dentro de la constante `INITIAL_USERS` (líneas 492-513), cualquier programador puede añadir o modificar los usuarios por defecto:

```javascript
const INITIAL_USERS = [
  {
    id: "user-admin",
    name: "Daniel Campos",
    email: "admin@tienda.com",
    password: "admin123",
    role: "admin",
    role_label: "Administrador / Dueño (Daniel Campos)",
    avatar: "👑",
    phone: "+58 414 111 2233"
  },
  {
    id: "user-cliente",
    name: "María Gómez",
    email: "cliente@tienda.com",
    password: "123",
    role: "cliente",
    role_label: "Cliente Comprador",
    avatar: "🛍️",
    phone: "+58 412 999 8877"
  }
];
```

---

## 3. Estructura del Almacenamiento y Esquema de Datos

La capa de datos está encapsulada en el objeto global `Storage` en `data.js`, el cual administra 7 entidades relacionales:

```
┌────────────────────────────────────────────────────────┐
│                      data.js                           │
├───────────────────────┬──────────────────────────┬────────────────────────────┤
│  ecommerce_users      │  ecommerce_products      │  ecommerce_suppliers       │
│  (Usuarios)           │  (Catálogo & Márgenes)   │  (Proveedores/Fabricantes) │
├───────────────────────┼──────────────────────────┼────────────────────────────┤
│  ecommerce_orders     │  ecommerce_purchases     │  ecommerce_store_config    │
│  (Pedidos Clientes)   │  (Abastecimiento Stock)  │  (Branding, Textos/Theme)  │
└───────────────────────┴──────────────────────────┴────────────────────────────┘
```

### Detalle de las Tablas / Colecciones:

| Clave en LocalStorage | Entidad | Campos Principales | Propósito |
| :--- | :--- | :--- | :--- |
| `ecommerce_users` | **Usuarios** | `id`, `name`, `email`, `password`, `role` (`admin`/`cliente`), `avatar`, `phone`. | Control de autenticación y permisos de visualización. |
| `ecommerce_products` | **Productos** | `id`, `name`, `slug`, `sku`, `category`, `brand`, `costPrice`, `price`, `stock`, `supplierId`, `supplierName`, `image`, `specs`. | Catálogo público y cálculo financiero de márgenes en el admin. |
| `ecommerce_suppliers` | **Proveedores** | `id`, `name`, `contact`, `category`, `phone`, `email`, `terms`, `status`, `totalPurchased`. | Gestión de fabricantes y registro de adquisiciones comerciales. |
| `ecommerce_purchases` | **Compras de Stock** | `id`, `date`, `supplierId`, `supplierName`, `productId`, `productName`, `quantity`, `unitCost`, `totalCost`, `status`. | Registro de inversión en inventario disponible. |
| `ecommerce_orders` | **Órdenes de Venta** | `id` (`ORD-XXXX`), `customer`, `customerEmail`, `customerPhone`, `address`, `date`, `items`, `subtotal`, `shipping`, `total`, `paymentMethod`, `status`. | Pedidos ingresados desde el checkout de la tienda. |
| `ecommerce_store_config` | **Configuración de Marca** | `name`, `tagline`, `logo_icon`, `primary_color`, `announcement_text`, `hero_tag`, `hero_title`, `hero_desc`, `hero_cta_text`, `button_style`, `template_id`, `template_archetype`. | Ajustes visuales de la tienda guardados desde el personalizador Wix. |
| `ecommerce_cart` | **Carrito Activo** | Array de items con `id`, `quantity`, `price`, etc. | Carrito de compras persistente por sesión de comprador. |

---

## 4. Roles del Sistema y Experiencias de Usuario

El sistema implementa un **Control Estricto de Roles** que garantiza que ningún cliente vea las herramientas internas del negocio:

```
                  ┌───────────────────────────────┐
                  │    ¿Usuario Autenticado?      │
                  └──────────────┬────────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
       [ NO o Rol 'cliente' ]             [ Rol 'admin' ]
                 │                               │
        ┌────────┴────────┐             ┌────────┴────────┐
        ▼                 ▼             ▼                 ▼
 Tienda 100% Limpia   Panel Admin    Modo Dueño       Acceso Total a
 Sin Botones Admin     BLOQUEADO     en Tienda         admin.html
 (Solo Compra)        (Security Gate) (⚡ Panel Admin) (Métricas/Finanzas)
```

### Tabla de Credenciales de Prueba:

| Rol | Correo | Contraseña | Comportamiento en la Plataforma |
| :--- | :--- | :--- | :--- |
| **👑 Dueño / Administrador** | `admin@tienda.com` *(o `daniel@tienda.com`)* | `admin123` | - **En la Tienda**: Activa la insignia `👑 Modo Dueño (Daniel Campos)`, muestra el botón **`⚡ Panel Admin`** y botón **`🚪 Salir`**.<br>- **En el Admin**: Acceso total a finanzas, costos, órdenes, CMS tipo Wix y plantillas. |
| **🛍️ Cliente Comprador** | `cliente@tienda.com` | `123` | - **En la Tienda**: Vista limpia orientada a compra. Muestra `🛍️ María Gómez` y botón de salir.<br>- **No ve botones de admin**.<br>- Si intenta entrar a `admin.html`, el sistema le bloquea el paso con el candado de seguridad. |
| **👤 Visitante Anónimo** | *(Sin sesión)* | *(Sin clave)* | Ve la tienda estándar con botón **`👤 Iniciar Sesión`**. Los botones administrativos están completamente ocultos. |

---

## 5. Módulos de la Tienda Pública (Frontend)

Ubicación: [index.html](file:///c:/Users/pc/OneDrive/Desktop/ecommerce/ecommerce_propuesta_visual/index.html) | [app.js](file:///c:/Users/pc/OneDrive/Desktop/ecommerce/ecommerce_propuesta_visual/app.js) | [styles.css](file:///c:/Users/pc/OneDrive/Desktop/ecommerce/ecommerce_propuesta_visual/styles.css)

1. **Barra Superior de Anuncios**: Notificaciones promocionales configurables desde el panel (con soporte de desactivación).
2. **Navegación Dinámica con Búsqueda en Tiempo Real**: Buscador predictivo que filtra productos por nombre, marca o especificación a medida que se teclea.
3. **Hero Banner Reactivo**: Cabecera visual que adopta la estructura de la plantilla activa pero **preserva al 100% los textos que el dueño haya escrito**.
4. **Filtros de Catálogo y Chips de Categoría**: Navegación fluida por Audio, Smartwatches, Oficina/Setup, Accesorios y Hogar.
5. **Tarjetas de Producto Inteligentes**: Varían de estructura según el arquetipo (ej: pasarela con selector de tallas `S, M, L, XL`, fichas técnicas con chips de hardware, o cajas pop con botón arcade).
6. **Vista Rápida (Quick View)**: Modal emergente con fotografía en alta resolución, ficha de especificaciones, indicador de stock y selector de cantidad.
7. **Carrito Deslizable (Side Drawer)**: Barra lateral con cálculo automático de subtotal, costo de envío dinámico, insignia de *Envío Gratis* para compras superiores a $100 y botón de vaciado.
8. **Checkout Completo con Sincronización Inmediata**:
   - Formulario de despacho (Nombre, Teléfono, Correo, Dirección).
   - Métodos de pago venezolanos e internacionales (*Pago Móvil, Zelle, Transferencia B2B, Efectivo*).
   - Generación de comprobante con código de orden único (`ORD-XXXX`) que se inyecta en el panel administrativo sin recargar la página.

---

## 6. Módulos del Panel Administrativo del Dueño (Backoffice)

Ubicación: [admin.html](file:///c:/Users/pc/OneDrive/Desktop/ecommerce/ecommerce_propuesta_visual/admin.html) | [admin.js](file:///c:/Users/pc/OneDrive/Desktop/ecommerce/ecommerce_propuesta_visual/admin.js) | [admin.css](file:///c:/Users/pc/OneDrive/Desktop/ecommerce/ecommerce_propuesta_visual/admin.css)

### 📊 1. Dashboard de Rendimiento & KPIs
- **4 Tarjetas Principales**: Ventas Totales acumuladas, Total de Pedidos procesados, Inversión en Mercancía (a precio de costo) y Ganancia Neta Proyectada en Stock.
- **Gráfica de Tendencia Semanal**: Gráfico vectorial interactivo con desglose de facturación diaria.
- **Ventas por Categoría**: Porcentajes de participación en ventas de cada rubro comercial.
- **Últimas Órdenes Registradas**: Tabla de pedidos en vivo sincronizada con el checkout.

### 📦 2. Catálogo de Productos con Márgenes Comerciales
- Tabla completa de inventario que muestra: Código SKU, Nombre, Proveedor, **Costo de Adquisición ($)**, **Precio de Venta ($)**, **Ganancia Bruta por Unidad ($)**, **Margen de Ganancia (%)** y Stock actual.
- **Modal CRUD de Producto**: Permite registrar o editar productos asociándolos directamente a un proveedor y calculando el margen de beneficio en tiempo real.

### 📑 3. Órdenes & Pedidos
- Gestión del flujo operativo de cada compra: selector de estado para cambiar entre *Pendiente*, *En Preparación*, *Enviado* y *Entregado*.
- Búsqueda de órdenes por código de cliente o nombre.

### 💼 4. Mercancía & Ganancias
- Módulo financiero exclusivo que calcula la valorización total del stock:
  $$\text{Ganancia Potencial} = \sum (\text{Precio Venta} - \text{Costo Adquisición}) \times \text{Unidades en Stock}$$
- Porcentaje de margen comercial promedio global del negocio.

### 🤝 5. Proveedores & Inversión
- Directorio de empresas fabricantes o distribuidoras con información de contacto, términos de crédito y categoría.
- Historial de compras de reabastecimiento con cálculo del capital total invertido por proveedor.
- Modal para registrar nuevos proveedores y compras de mercancía.

### 🎨 6. Personalizar Tienda (Estilo Wix)
- **Editor Visual en Tiempo Real**: Panel lateral con controles y previsualización en vivo (iframe sincronizado).
- Personalización de: Nombre comercial, eslogan, paleta de colores con picker hexadecimal, estilo de botones (*Píldora, Redondeado, Cuadrado*), datos de contacto y textos de cabecera.
- **Preservación de Textos**: Los textos escritos en este editor quedan protegidos y nunca se sobreescriben al alternar de plantilla.

### 📐 7. Galería de Plantillas Arquitectónicas
- 5 diseños de e-commerce de la industria que cambian la disposición espacial, proporciones de tarjetas y tipografías con 1 solo click.

### 💻 8. Editor de Código (Estilo Blogger / Liquid)
- Área de desarrollo para programadores donde se puede ver y editar el código HTML de la plantilla con soporte de etiquetas dinámicas (`{{store_name}}`, `{{primary_color}}`, `{{hero_title}}`, etc.) y botón de compilación.

### 🔒 9. Barrera de Seguridad (Admin Gate)
- Si una persona no autenticada abre `admin.html`, el sistema oculta toda la información y muestra una ventana modal con candado de seguridad y fondo desenfocado exigiendo credenciales de administrador.

---

## 7. Estudio y Funcionamiento de las 5 Plantillas Arquitectónicas

Cada plantilla representa una arquitectura visual y funcional distinta inspirada en los líderes del mercado:

| Plantilla | Inspiración | Arquitectura de Cabecera | Tarjeta de Producto | Tipografía Principal |
| :--- | :--- | :--- | :--- | :--- |
| **1. Estilo Ejecutivo** | Rolex, SSENSE, Tiffany | **Monumental Centrado**: Escudo de heráldica, botones duales (*Adquirir* / *Asesoría VIP*) y **3 sellos de autenticidad** (*Garantía Vitalicia, Entrega Blindada*). | **Editorial de Lujo**: Margen amplio, precio en oro noble, badge de marca y botón refinado con micro-borde dorado. | Serif `Playfair Display` + Charcoal (`#0b0f19`) y acentos dorados. |
| **2. Estilo Moderno** | Razer, Framework, Tesla Shop | **Dividido Asimétrico (2 columnas)**: Showcase holográfico flotante y **cinta de telemetría continua** (*Latencia 0ms, GaN 48h*). | **Matriz Tecnológica**: Fondo oscuro profundo, **chips de especificaciones directas** (*WiFi 6E, GaN, ANC 45dB*) y botón neón. | `Space Grotesk` + modo oscuro espacial y destellos cian. |
| **3. Estilo a la Moda** | Zara, ASOS, Kith | **Portada de Revista**: Titular editorial en cursiva, cinta animada de *drops* y collage de lookbook. | **Pasarela Vertical (3:4)**: Fotos alargadas de pasarela, tag *HOT DROP* y **selector dinámico de tallas (`S, M, L, XL`)**. | Editorial `Syne` cursiva + fondo blanco puro de alto contraste. |
| **4. Estilo Nórdico** | IKEA, HAY, Muji | **Contenedor Orgánico Flotante**: Curvaturas suaves, paleta arena suave (`#faf7f2`) y badge ecológico (*100% Sostenible*). | **Píldora Orgánica**: Esquinas ultra-redondeadas (24px), sombras suaves difuminadas y sello de madera FSC. | `Plus Jakarta Sans` con tonos terracota y madera cálida. |
| **5. Estilo Neo-Brutalist** | Gumroad, MSCHF, Depop | **Impacto Pop Masivo**: Bordes negros sólidos de 3px, **sombras duras desplazadas de 5px** y stickers virales inclinados (*"LIMITED DROP ★"*). | **Caja Arcade Táctil**: Sombras mecánicas sin difuminar y botón recreativo que se hunde al pulsar (`translate(2px, 2px)`). | `Space Grotesk` pesada sobre lienzo amarillo pop (`#fef08a`). |

---

---

## 8. Cómo Ejecutar, Probar y Desplegar el Proyecto

La plataforma soporta una **arquitectura de ejecución dual**:

### Opción A: Despliegue con Docker Compose (Entorno Oficial de Producción)
Recomendado si cuentas con **Docker Desktop** instalado:
1. Haz doble clic en [`docker-iniciar.bat`](docker-iniciar.bat) o ejecuta en la terminal:
   ```bash
   docker compose up -d --build
   ```
2. Servicios creados y orquestados:
   - **Servidor Web Nginx Alpine**: Servidor de alta velocidad en `http://localhost:8080`.
   - **Base de Datos PostgreSQL 16**: Motor relacional en el puerto `5432` con volumen persistente `postgres_data`.
   - Inicialización automática del script [`database/init.sql`](database/init.sql).
3. Para detener los contenedores: ejecuta [`docker-detener.bat`](docker-detener.bat) o `docker compose down`.

### Opción B: Ejecución Local en Windows Sin Dependencias (En 1 Clic)
1. Extraer la carpeta `ecommerce_propuesta_visual`.
2. Ejecutar el archivo incluido [`iniciar_demo.bat`](iniciar_demo.bat) con doble clic (inicia servidor local en puerto 8080).
3. Abrir en el navegador:
   - **Tienda Pública:** [http://localhost:8080/index.html](http://localhost:8080/index.html)
   - **Panel Administrativo:** [http://localhost:8080/admin.html](http://localhost:8080/admin.html)

### Opción C: Compartir en la Nube
Puedes subir la carpeta directamente a servicios como **Vercel**, **Netlify**, **Render** o servidores VPS Linux mediante Docker.

---

## 9. Base de Datos Relacional PostgreSQL 16 & Respaldos

### 🗄️ Esquema PostgreSQL de Producción ([`database/init.sql`](database/init.sql))
El sistema incluye el script DDL completo para PostgreSQL 16 con:
- `store_config`: Configuración institucional, colores de marca y template activo.
- `users`: Usuarios y control de acceso (Daniel Campos `admin@tienda.com`).
- `suppliers`: Registro de proveedores y términos de pago.
- `products`: Catálogo con SKU, precios de costo, precios de venta y stock.
- `purchases`: Facturación de abastecimiento a proveedores.
- `orders` y `order_items`: Gestión relacional de pedidos y detalle de productos.
- `v_inventory_financials`: Vista analítica de márgenes de ganancia y valorización de inventario.

### 🛡️ Respaldos y Auditoría en el Backoffice
En el Panel Administrativo (`admin.html` > pestaña **Respaldos & Auditoría**):
1. **Exportar Órdenes a CSV**: Descarga en 1 clic de todas las ventas para Microsoft Excel.
2. **Exportar Inventario a CSV**: Reporte de stock, costos y márgenes de ganancia.
3. **Respaldo JSON Completo**: Descarga de una instantánea completa de la base de datos para migración.
4. **Importar Respaldo**: Restauración de una copia previamente guardada.
5. **Restablecer Valores de Fábrica**: Botón protegido con confirmación para reiniciar los datos a su estado original de demostración.

