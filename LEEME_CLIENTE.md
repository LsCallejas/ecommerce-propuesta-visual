# 🛍️ Demostración E-Commerce Oficial & Panel Administrativo del Dueño

Esta carpeta **`ecommerce_propuesta_visual`** contiene una plataforma de comercio electrónico profesional, autónoma y lista para operar, compuesta por:
1. **La tienda de compra orientada al cliente** ([index.html](file:///c:/Users/pc/OneDrive/Desktop/ecommerce/ecommerce_propuesta_visual/index.html)).
2. **El panel administrativo exclusivo para el dueño del negocio** ([admin.html](file:///c:/Users/pc/OneDrive/Desktop/ecommerce/ecommerce_propuesta_visual/admin.html)).

> 📘 **Manual Completo y Documentación Técnica:**  
> Para una explicación detallada de la base de datos, esquema de almacenamiento, módulos financieros, arquitectura de las 5 plantillas y despliegue, consulta el archivo:  
> ➔ [MANUAL_PROYECTO_ECOMMERCE.md](file:///c:/Users/pc/OneDrive/Desktop/ecommerce/ecommerce_propuesta_visual/MANUAL_PROYECTO_ECOMMERCE.md)

---

## 👥 Roles del Sistema y Permisos (No requiere inyección manual)

El sistema **auto-inicializa los datos en el navegador** de quien abra el proyecto sin necesidad de MySQL ni Docker.

| Rol | Perfil de Prueba | Credenciales | Experiencia & Vistas |
| :--- | :--- | :--- | :--- |
| **👑 Administrador / Dueño** | Daniel Campos | `admin@tienda.com` *(o `daniel@tienda.com`)* / `admin123` | - En la tienda activa el **`👑 Modo Dueño`** con acceso a **`⚡ Panel Admin`** y botón **`🚪 Salir`**.<br>- Acceso total a `admin.html`: Analítica, Catálogo con márgenes, Inventario, Proveedores e Inversión, Personalizador Wix, 5 Plantillas y Editor de Código. |
| **🛒 Usuario Normal / Comprador** | María Gómez | `cliente@tienda.com` / `123` | - **Experiencia 100% limpia de compra**: Explora el catálogo, agrega al carrito y realiza checkout.<br>- **No ve botones de administración**.<br>- Si intenta escribir `admin.html` en la URL, el sistema **bloquea la pantalla con candado de seguridad**. |

---

## 🎯 Principales Módulos Incluidos

### 1. El E-Commerce para Comprar — `index.html`
- **Catálogo Dinámico**: Filtrado predictivo y búsqueda instantánea.
- **5 Diseños Arquitectónicos Reales**:
  1. *Estilo Ejecutivo (Lujo & Corporativo - Rolex/SSENSE)*
  2. *Estilo Moderno (Tech Vanguard & Telemetría - Razer/Tesla)*
  3. *Estilo a la Moda (Lookbook Editorial & Tallas S, M, L, XL - Zara/ASOS)*
  4. *Estilo Nórdico (Cozy Living & Orgánico - IKEA/HAY)*
  5. *Estilo Neo-Brutalist (Pop Trend & Bordes Sólidos - Gumroad/MSCHF)*
- **Ficha y Vista Rápida (Quick View)**: Fotos en alta resolución y especificaciones.
- **Carrito Deslizable**: Indicador de **Envío Gratis** a partir de $100.00 y subtotales en vivo.
- **Checkout Sincronizado**: Formulario de despacho con Pago Móvil, Zelle, Transferencia B2B y Efectivo con código `ORD-XXXX`.

### 2. El Panel Administrativo del Dueño — `admin.html`
- **Dashboard & KPIs**: Ventas totales, pedidos, inversión en mercancía y ganancia neta en stock.
- **Gestión de Catálogo & Rentabilidad**: Tabla con costo de adquisición ($), precio de venta ($) y margen bruto (%).
- **Módulo de Mercancía & Ganancias**: Valorización total de stock a costo vs. venta proyectada.
- **Módulo de Proveedores & Inversión**: Directorio de fabricantes, registro de compras y cálculo de capital invertido.
- **Personalizar Tienda (Estilo Wix)**: CMS interactivo con previsualización en vivo (iframe reactivo) que **preserva siempre los textos escritos**.
- **Editor de Código (Estilo Blogger / Liquid)**: Editor HTML con inserción de tags dinámicos (`{{store_name}}`, `{{hero_title}}`).
- **Seguridad (Admin Gate)**: Protección contra accesos no autorizados.

---

## 🚀 Cómo Probar la Demostración

1. Ejecuta el servidor ligero con doble clic en **`iniciar_demo.bat`** o ejecuta:
   ```powershell
   python -m http.server 8080
   ```
2. Abre en tu navegador:
   - **Tienda:** [http://localhost:8080/index.html](http://localhost:8080/index.html)
   - **Panel Admin:** [http://localhost:8080/admin.html](http://localhost:8080/admin.html)
3. En la cabecera pulsa **`👤 Iniciar Sesión`** para alternar con 1 clic entre Dueño y Comprador.

---

## 📁 Estructura de Archivos

| Archivo | Función |
| :--- | :--- |
| **`MANUAL_PROYECTO_ECOMMERCE.md`** | Manual completo técnico y de usuario del sistema. |
| **`index.html`** | Tienda pública orientada al cliente. |
| **`styles.css`** | Diseño visual de la tienda y arquitecturas de las 5 plantillas. |
| **`app.js`** | Lógica de la tienda (catálogo, carrito, checkout, roles y plantillas). |
| **`admin.html`** | Panel administrativo y backoffice del dueño. |
| **`admin.css`** | Estilos visuales del backoffice estilo SaaS. |
| **`admin.js`** | Lógica administrativa (KPIs, CRUD, proveedores, finanzas, personalizador Wix y plantillas). |
| **`data.js`** | Motor de base de datos persistente inicial (`localStorage`) con semillas de datos. |
| **`iniciar_demo.bat`** | Lanzador automático para Windows. |
| **`img/`** | Fotografías en alta resolución del catálogo. |
