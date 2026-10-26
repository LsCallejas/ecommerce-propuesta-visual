# 🛍️ Frontend: Tienda Oficial & Panel de Administración
**Proyecto:** Plataforma E-Commerce Oficial Daniel Campos  
**Tecnología:** HTML5 Semántico, Vanilla CSS3 y ES6+ Vanilla JavaScript  
**Arquitectura:** Desacoplada / Headless con Adapter Pattern (`Storage` en `data.js`)  

---

## 📂 Organización de Archivos

- **`index.html`**: Tienda orientada al cliente. Catálogo reactivo, carrito de compras deslizable, filtro por categorías, buscador en vivo y modal de rastreo de pedidos.
- **`admin.html`**: Panel de control backoffice exclusivo para **Daniel Campos**. Métricas de ventas, rentabilidad, márgenes brutos, gestión de catálogo, órdenes de compra y personalizador visual.
- **`styles.css`**: Sistema de diseño visual de la tienda pública (paleta HSL, micro-animaciones, glassmorphism y diseño responsivo).
- **`admin.css`**: Hoja de estilos para el panel de administración empresarial (tablas interactivas, KPIs, modales y selector de plantillas).
- **`data.js`**: Capa de persistencia con soporte dual:
  - *Modo Online:* Comunicación REST API en tiempo real con PostgreSQL 16 vía `/api/`.
  - *Modo Offline:* Fallback transparente a `localStorage` sin dependencias externas.
- **`app.js`**: Controlador de lógica e interacciones del cliente comprador.
- **`admin.js`**: Controlador de lógica administrativa, métricas y órdenes.
- **`img/`**: Recursos fotográficos de alta resolución del catálogo oficial.
