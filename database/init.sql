-- ============================================================================
-- SCRIPT DE INICIALIZACIÓN OFICIAL DE BASE DE DATOS POSTGRESQL
-- PROYECTO: PLATAFORMA E-COMMERCE OFICIAL & PANEL ADMINISTRATIVO
-- PRESENTADOR / DUEÑO: Daniel Campos
-- MOTOR: PostgreSQL 16 (Relacional ACID)
-- ============================================================================

-- Habilitar extensión para UUIDs criptográficos
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. TABLA: store_config (Configuración y Branding de la Tienda)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS store_config (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL DEFAULT 'Mi Tienda Oficial',
    tagline VARCHAR(200) DEFAULT 'Tecnología, Accesorios y Estilo de Vida',
    description TEXT,
    logo_icon VARCHAR(20) DEFAULT '🛍️',
    primary_color VARCHAR(20) DEFAULT '#2563eb',
    contact_phone VARCHAR(50) DEFAULT '+58 414 123 4567',
    contact_email VARCHAR(120) DEFAULT 'contacto@mitienda.com',
    contact_address VARCHAR(255) DEFAULT 'Av. Principal Comercial, Torre Empresarial, Local 4',
    announcement_text VARCHAR(255) DEFAULT 'Catálogo oficial con existencias garantizadas y entregas express a todo el país',
    announcement_enabled BOOLEAN DEFAULT TRUE,
    hero_tag VARCHAR(100) DEFAULT 'Colección Oficial 2026',
    hero_title VARCHAR(200) DEFAULT 'Productos Exclusivos para un Estilo de Vida Moderno',
    hero_desc TEXT,
    hero_cta_text VARCHAR(80) DEFAULT 'Explorar Catálogo',
    button_style VARCHAR(30) DEFAULT 'pill',
    template_id VARCHAR(50) DEFAULT 'moderno-tech',
    template_archetype VARCHAR(50) DEFAULT 'moderno',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserción de configuración inicial
INSERT INTO store_config (name, tagline, description, logo_icon, primary_color, template_id, template_archetype)
VALUES (
    'Mi Tienda Oficial',
    'Tecnología, Accesorios y Estilo de Vida',
    'E-Commerce oficial con catálogo en tiempo real, existencias garantizadas y despacho express directo a tu puerta.',
    '🛍️',
    '#2563eb',
    'moderno-tech',
    'moderno'
);

-- ----------------------------------------------------------------------------
-- 2. TABLA: users (Usuarios, Roles y Control de Acceso)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'cliente')),
    role_label VARCHAR(100) NOT NULL,
    avatar VARCHAR(20) DEFAULT '👤',
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuarios semilla: Daniel Campos (Dueño/Admin) y Cliente Comprador
INSERT INTO users (id, name, email, password_hash, role, role_label, avatar, phone) VALUES
('usr-admin-1', 'Daniel Campos', 'admin@tienda.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin', 'Administrador / Dueño (Daniel Campos)', '👑', '+58 414 111 2233'),
('usr-admin-2', 'Daniel Campos', 'daniel@tienda.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin', 'Administrador / Dueño (Daniel Campos)', '👑', '+58 414 111 2233'),
('usr-client-1', 'María Gómez', 'cliente@tienda.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'cliente', 'Cliente Comprador', '🛍️', '+58 412 999 8877');

-- ----------------------------------------------------------------------------
-- 3. TABLA: suppliers (Proveedores Comerciales y Fabricantes)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS suppliers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(150),
    category VARCHAR(100),
    terms VARCHAR(100) DEFAULT 'Contado',
    rating VARCHAR(50) DEFAULT '4.9 ★',
    total_invested DECIMAL(12,2) DEFAULT 0.00,
    status VARCHAR(30) DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Proveedores semilla
INSERT INTO suppliers (id, name, contact_person, phone, email, category, terms, rating, total_invested) VALUES
('sup-1', 'Shenzhen Aura Sound Tech Co.', 'Lin Wei', '+86 138 2345 6789', 'orders@aurasoundtech.cn', 'Audio & Acústica', 'Transferencia Anticipada', '4.9 ★ (Proveedor Principal)', 6540.00),
('sup-2', 'Apex Chrono Global Corp', 'Marcus Vance', '+1 (305) 890-4421', 'distribution@apexchrono.com', 'Smartwatches & Wearables', 'Crédito 15 Días', '4.8 ★ (Verificado)', 5120.00),
('sup-3', 'Lumina Gear Logistics & Peripherals', 'Andrea Castillo', '+58 412 889 0012', 'ventas@luminagear.com', 'Setup & Periféricos', 'Crédito 30 Días', '4.9 ★ (Distribuidor Directo)', 4280.00),
('sup-4', 'Caffè Bella & Lifestyle Imports', 'Matteo Rossi', '+39 02 8901 2345', 'export@caffebella.it', 'Hogar & Confort', 'Transferencia / Contado', '5.0 ★ (Importación Directa)', 2150.00);

-- ----------------------------------------------------------------------------
-- 4. TABLA: products (Catálogo, Existencias, Costos y Precios de Venta)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    sku VARCHAR(60) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    category_label VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    cost_price DECIMAL(10,2) NOT NULL CHECK (cost_price >= 0),
    sale_price DECIMAL(10,2) NOT NULL CHECK (sale_price > 0),
    compare_at_price DECIMAL(10,2),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    supplier_id VARCHAR(50) REFERENCES suppliers(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    badge VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserción del catálogo semilla oficial
INSERT INTO products (name, slug, sku, category, category_label, brand, cost_price, sale_price, compare_at_price, stock, supplier_id, image_url, badge, description) VALUES
('Auriculares Inalámbricos Pro Noise-Cancelling', 'auriculares-pro-anc', 'TECH-AUDIO-01', 'audio', 'Audio & Sonido', 'AuraSound Pro', 38.50, 89.99, 119.99, 45, 'sup-1', 'img/tech_auriculares.jpg', 'TOP VENTAS', 'Cancelación activa de ruido híbrida de 45dB, transductores de titanio de 40mm y autonomía de hasta 60 horas.'),
('Smartwatch Ultra AMOLED Titanium Edition', 'smartwatch-ultra-titanium', 'TECH-WATCH-02', 'wearables', 'Smartwatches', 'Apex Watch Co.', 48.00, 119.99, 149.99, 28, 'sup-2', 'img/tech_smartwatch.jpg', 'NUEVO DROP', 'Chasis forjado en aleación de titanio aeroespacial con pantalla AMOLED Always-On de 1.96 pulgadas y sensor biométrico SpO2.'),
('Teclado Mecánico Custom 75% Wireless', 'teclado-mecanico-custom-75', 'TECH-KB-03', 'oficina', 'Setup & Oficina', 'Lumina Mech', 54.00, 129.50, 159.00, 22, 'sup-3', 'img/tech_teclado.jpg', 'RECOMENDADO', 'Estructura de montaje por juntas (Gasket mount) con interruptores lubricados de fábrica, perilla rotativa de volumen y triple conectividad.'),
('Altavoz Bluetooth 360° Waterproof IPX7', 'altavoz-bluetooth-360', 'TECH-SPK-04', 'audio', 'Audio & Sonido', 'AuraSound Pro', 22.00, 54.99, 69.99, 50, 'sup-1', 'img/tech_altavoz.jpg', 'IPX7 RESIST', 'Sonido envolvente 360 grados de 30W con radiadores pasivos de graves duales y certificación impermeable para exteriores.'),
('Mochila Urbana Antirrobo con Puerto USB', 'mochila-urbana-antirrobo', 'LIF-BAG-05', 'accesorios', 'Bolsos & Estilo', 'UrbanCraft Gear', 19.50, 44.99, 59.99, 35, 'sup-3', 'img/boutique_bolso.jpg', 'URBAN ESSENTIAL', 'Fabricada en tejido Oxford hidrófugo de alta densidad con cremalleras invisibles antirrobo y compartimento acolchado para laptops de 16 pulgadas.'),
('Cafetera Espresso Portátil Eléctrica 18 Bares', 'cafetera-espresso-portatil', 'LIF-COF-06', 'hogar', 'Hogar & Confort', 'Caffè Bella', 31.00, 69.99, 89.99, 18, 'sup-4', 'img/gourmet_cafe.jpg', 'ALTA PRESIÓN', 'Bomba italiana de alta presión de 18 bares para café espresso cremoso en cualquier lugar con batería recargable USB-C.');

-- ----------------------------------------------------------------------------
-- 5. TABLA: purchases (Órdenes de Inversión y Abastecimiento de Stock)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS purchases (
    id VARCHAR(50) PRIMARY KEY,
    date DATE NOT NULL,
    supplier_id VARCHAR(50) REFERENCES suppliers(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    units INT NOT NULL CHECK (units > 0),
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    status VARCHAR(50) DEFAULT 'Recibido & Pagado',
    receipt VARCHAR(80),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inversiones semilla
INSERT INTO purchases (id, date, supplier_id, description, units, amount, status, receipt) VALUES
('INV-2026-004', '2026-10-18', 'sup-1', 'Lote de reposición: 50x Auriculares ANC Pro + 60x Altavoces 360°', 110, 3185.00, 'Recibido & Pagado', 'FAC-SHZ-88910'),
('INV-2026-003', '2026-10-10', 'sup-2', 'Lote importación: 35x Smartwatches Ultra AMOLED 1.96"', 35, 1890.00, 'Recibido & Pagado', 'INV-MIA-4401'),
('INV-2026-002', '2026-10-02', 'sup-3', 'Lote setup: 30x Teclados Mecánicos 75% + 40x Mochilas', 70, 2790.00, 'Recibido & Pagado', 'LG-FAC-0921'),
('INV-2026-001', '2026-09-24', 'sup-4', 'Lote inicial: 25x Cafeteras Espresso Portátiles 18 Bares', 25, 775.00, 'Recibido & Pagado', 'CB-REC-3312');

-- ----------------------------------------------------------------------------
-- 6. TABLA: orders (Órdenes de Compra de Clientes)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(50),
    customer_address TEXT,
    store_name VARCHAR(150) DEFAULT 'Mi Tienda Oficial',
    subtotal DECIMAL(10,2) NOT NULL,
    shipping DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'En Preparación', 'Enviado', 'Entregado')),
    payment_method VARCHAR(80) DEFAULT 'Pago Móvil',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 7. TABLA: order_items (Líneas de Detalle de cada Orden)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

-- Órdenes semilla para demostración inmediata
INSERT INTO orders (id, date, customer_name, customer_email, customer_phone, customer_address, subtotal, shipping, total, status, payment_method) VALUES
('ORD-2026-001', '2026-10-24 16:40:00', 'Alejandro Bastidas', 'alejandro.b@gmail.com', '+58 414 332 1100', 'Urb. El Rosal, Edif. Torre Europa, Piso 6, Caracas', 89.99, 0.00, 89.99, 'Entregado', 'Transferencia Bancaria'),
('ORD-2026-002', '2026-10-24 18:15:00', 'Valentina Méndez', 'valen.mendez@outlook.com', '+58 412 555 8899', 'Av. Las Delicias, Residencias Maracay, Apto 4B', 174.98, 0.00, 174.98, 'Enviado', 'Pago Móvil'),
('ORD-2026-003', '2026-10-25 09:20:00', 'Carlos Rivas', 'carlos.rivas@empresa.com', '+58 424 777 4433', 'C.C. Sambil Chacao, Nivel Autopista, Local 12', 129.50, 0.00, 129.50, 'En Preparación', 'Zelle / Dólares'),
('ORD-2026-004', '2026-10-25 11:05:00', 'Mariana Colmenares', 'mariana.c@gmail.com', '+58 416 888 1234', 'Calle 5 de Julio, Quinta Mi Refugio, Valencia', 69.99, 12.00, 81.99, 'Pendiente', 'Pago Móvil');

INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, subtotal) VALUES
('ORD-2026-001', 1, 'Auriculares Inalámbricos Pro Noise-Cancelling', 1, 89.99, 89.99),
('ORD-2026-002', 2, 'Smartwatch Ultra AMOLED Titanium Edition', 1, 119.99, 119.99),
('ORD-2026-002', 4, 'Altavoz Bluetooth 360° Waterproof IPX7', 1, 54.99, 54.99),
('ORD-2026-003', 3, 'Teclado Mecánico Custom 75% Wireless', 1, 129.50, 129.50),
('ORD-2026-004', 6, 'Cafetera Espresso Portátil Eléctrica 18 Bares', 1, 69.99, 69.99);

-- ----------------------------------------------------------------------------
-- 8. VISTA DE NEGOCIO: v_inventory_financials (Auditoría Financiera y Márgenes)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_inventory_financials AS
SELECT 
    p.id,
    p.sku,
    p.name,
    p.category_label,
    s.name AS supplier_name,
    p.cost_price,
    p.sale_price,
    (p.sale_price - p.cost_price) AS unit_profit,
    ROUND(((p.sale_price - p.cost_price) / p.sale_price) * 100, 2) AS margin_percentage,
    p.stock,
    (p.cost_price * p.stock) AS total_inventory_cost,
    (p.sale_price * p.stock) AS total_inventory_revenue,
    ((p.sale_price - p.cost_price) * p.stock) AS projected_total_profit
FROM products p
LEFT JOIN suppliers s ON p.supplier_id = s.id;

-- Índices de alto rendimiento
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(date);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
