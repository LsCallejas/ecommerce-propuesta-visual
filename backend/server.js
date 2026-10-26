/**
 * SERVER.JS - MICRO-BACKEND REST API PARA E-COMMERCE OFICIAL
 * Responsable / Presentador: Daniel Campos
 * Conexión nativa con PostgreSQL 16 (Relacional ACID)
 */

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS y parsing de JSON
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Pool de conexiones a PostgreSQL 16
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://daniel_admin:DanielAdmin2026Secure!@db:5432/ecommerce_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Prueba de conexión al arrancar
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
  } else {
    console.log('✅ Conexión exitosa con PostgreSQL 16 (ecommerce_db)');
    release();
  }
});

// ----------------------------------------------------------------------------
// 1. HEALTHCHECK & TELEMETRÍA DE BASE DE DATOS
// ----------------------------------------------------------------------------
app.get('/api/health', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW() AS now, version() AS version, current_database() AS db;');
    const counts = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM products) AS products_count,
        (SELECT COUNT(*) FROM orders) AS orders_count,
        (SELECT COUNT(*) FROM suppliers) AS suppliers_count,
        (SELECT COUNT(*) FROM purchases) AS purchases_count;
    `);

    res.json({
      status: 'online',
      engine: 'PostgreSQL 16 (Alpine)',
      connected: true,
      database: dbRes.rows[0].db,
      timestamp: dbRes.rows[0].now,
      version: dbRes.rows[0].version,
      stats: {
        products: parseInt(counts.rows[0].products_count, 10),
        orders: parseInt(counts.rows[0].orders_count, 10),
        suppliers: parseInt(counts.rows[0].suppliers_count, 10),
        purchases: parseInt(counts.rows[0].purchases_count, 10)
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ----------------------------------------------------------------------------
// 2. CONFIGURACIÓN DE LA TIENDA (store_config)
// ----------------------------------------------------------------------------
app.get('/api/config', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM store_config ORDER BY id DESC LIMIT 1;');
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Configuración no encontrada' });
    }
    const row = result.rows[0];
    res.json({
      name: row.name,
      tagline: row.tagline,
      description: row.description,
      logo_icon: row.logo_icon,
      primary_color: row.primary_color,
      contact_phone: row.contact_phone,
      contact_email: row.contact_email,
      contact_address: row.contact_address,
      announcement_text: row.announcement_text,
      announcement_enabled: row.announcement_enabled,
      hero_tag: row.hero_tag,
      hero_title: row.hero_title,
      hero_desc: row.hero_desc,
      hero_cta_text: row.hero_cta_text,
      button_style: row.button_style,
      template_id: row.template_id,
      template_archetype: row.template_archetype
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/config', async (req, res) => {
  try {
    const c = req.body;
    const query = `
      UPDATE store_config SET
        name = COALESCE($1, name),
        tagline = COALESCE($2, tagline),
        description = COALESCE($3, description),
        logo_icon = COALESCE($4, logo_icon),
        primary_color = COALESCE($5, primary_color),
        contact_phone = COALESCE($6, contact_phone),
        contact_email = COALESCE($7, contact_email),
        contact_address = COALESCE($8, contact_address),
        announcement_text = COALESCE($9, announcement_text),
        announcement_enabled = COALESCE($10, announcement_enabled),
        hero_tag = COALESCE($11, hero_tag),
        hero_title = COALESCE($12, hero_title),
        hero_desc = COALESCE($13, hero_desc),
        hero_cta_text = COALESCE($14, hero_cta_text),
        button_style = COALESCE($15, button_style),
        template_id = COALESCE($16, template_id),
        template_archetype = COALESCE($17, template_archetype),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = (SELECT id FROM store_config ORDER BY id DESC LIMIT 1)
      RETURNING *;
    `;
    const values = [
      c.name, c.tagline, c.description, c.logo_icon, c.primary_color,
      c.contact_phone, c.contact_email, c.contact_address,
      c.announcement_text, c.announcement_enabled,
      c.hero_tag, c.hero_title, c.hero_desc, c.hero_cta_text,
      c.button_style, c.template_id, c.template_archetype
    ];
    const result = await pool.query(query, values);
    res.json({ success: true, config: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------------------------------
// 3. PRODUCTOS & CATÁLOGO (products)
// ----------------------------------------------------------------------------
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, s.name AS supplier_name
      FROM products p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ORDER BY p.id ASC;
    `);

    // Mapeo al formato de datos esperado por la aplicación visual
    const products = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      sku: row.sku,
      category: row.category,
      categoryLabel: row.category_label,
      brand: row.brand,
      costPrice: parseFloat(row.cost_price),
      price: parseFloat(row.sale_price),
      compareAtPrice: row.compare_at_price ? parseFloat(row.compare_at_price) : null,
      stock: parseInt(row.stock, 10),
      supplierId: row.supplier_id,
      supplierName: row.supplier_name || 'Proveedor Oficial',
      badge: row.badge,
      image: row.image_url,
      description: row.description,
      specs: {
        "Categoría": row.category_label || row.category,
        "SKU": row.sku,
        "Marca": row.brand || "Oficial",
        "Disponibilidad": `${row.stock} unidades en almacén`
      }
    }));

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const p = req.body;
    const slug = (p.name || 'producto').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const sku = p.sku || `PRD-${Date.now().toString().slice(-6)}`;
    let result;

    if (p.id) {
      const query = `
        INSERT INTO products (
          id, name, slug, sku, category, category_label, brand,
          cost_price, sale_price, compare_at_price, stock,
          supplier_id, image_url, badge, description
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          sku = EXCLUDED.sku,
          category = EXCLUDED.category,
          category_label = EXCLUDED.category_label,
          brand = EXCLUDED.brand,
          cost_price = EXCLUDED.cost_price,
          sale_price = EXCLUDED.sale_price,
          compare_at_price = EXCLUDED.compare_at_price,
          stock = EXCLUDED.stock,
          supplier_id = EXCLUDED.supplier_id,
          image_url = EXCLUDED.image_url,
          badge = EXCLUDED.badge,
          description = EXCLUDED.description
        RETURNING *;
      `;
      const values = [
        parseInt(p.id, 10),
        p.name,
        slug,
        sku,
        p.category || 'general',
        p.categoryLabel || p.category || 'General',
        p.brand || 'Marca Oficial',
        parseFloat(p.costPrice || p.cost_price || 0),
        parseFloat(p.price || p.sale_price || 0),
        p.compareAtPrice ? parseFloat(p.compareAtPrice) : null,
        parseInt(p.stock || 0, 10),
        p.supplierId || 'sup-1',
        p.image || p.image_url || 'img/tech_auriculares.jpg',
        p.badge || 'NUEVO',
        p.description || ''
      ];
      result = await pool.query(query, values);
      await pool.query("SELECT setval(pg_get_serial_sequence('products', 'id'), (SELECT COALESCE(MAX(id), 1) FROM products));");
    } else {
      const query = `
        INSERT INTO products (
          name, slug, sku, category, category_label, brand,
          cost_price, sale_price, compare_at_price, stock,
          supplier_id, image_url, badge, description
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
        ) RETURNING *;
      `;
      const values = [
        p.name,
        slug,
        sku,
        p.category || 'general',
        p.categoryLabel || p.category || 'General',
        p.brand || 'Marca Oficial',
        parseFloat(p.costPrice || p.cost_price || 0),
        parseFloat(p.price || p.sale_price || 0),
        p.compareAtPrice ? parseFloat(p.compareAtPrice) : null,
        parseInt(p.stock || 0, 10),
        p.supplierId || 'sup-1',
        p.image || p.image_url || 'img/tech_auriculares.jpg',
        p.badge || 'NUEVO',
        p.description || ''
      ];
      result = await pool.query(query, values);
    }
    res.status(201).json({ success: true, product: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const p = req.body;
    const query = `
      UPDATE products SET
        name = COALESCE($1, name),
        sku = COALESCE($2, sku),
        category = COALESCE($3, category),
        category_label = COALESCE($4, category_label),
        brand = COALESCE($5, brand),
        cost_price = COALESCE($6, cost_price),
        sale_price = COALESCE($7, sale_price),
        compare_at_price = COALESCE($8, compare_at_price),
        stock = COALESCE($9, stock),
        supplier_id = COALESCE($10, supplier_id),
        image_url = COALESCE($11, image_url),
        badge = COALESCE($12, badge),
        description = COALESCE($13, description)
      WHERE id = $14
      RETURNING *;
    `;
    const values = [
      p.name,
      p.sku,
      p.category,
      p.categoryLabel || p.category_label,
      p.brand,
      p.costPrice !== undefined ? parseFloat(p.costPrice) : undefined,
      p.price !== undefined ? parseFloat(p.price) : undefined,
      p.compareAtPrice !== undefined ? parseFloat(p.compareAtPrice) : undefined,
      p.stock !== undefined ? parseInt(p.stock, 10) : undefined,
      p.supplierId || p.supplier_id,
      p.image || p.image_url,
      p.badge,
      p.description,
      id
    ];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ success: true, product: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await pool.query('DELETE FROM products WHERE id = $1;', [id]);
    res.json({ success: true, message: `Producto ${id} eliminado de PostgreSQL` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------------------------------
// 4. PROVEEDORES (suppliers)
// ----------------------------------------------------------------------------
app.get('/api/suppliers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM suppliers ORDER BY id ASC;');
    const suppliers = result.rows.map(s => ({
      id: s.id,
      name: s.name,
      contact: s.contact,
      phone: s.phone,
      email: s.email,
      category: s.category,
      payment_terms: s.payment_terms,
      lead_time_days: s.lead_time_days,
      invested_total: parseFloat(s.invested_total || 0),
      balance_owed: parseFloat(s.balance_owed || 0),
      rating: parseFloat(s.rating || 5.0),
      status: s.status
    }));
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/suppliers', async (req, res) => {
  try {
    const s = req.body;
    const query = `
      INSERT INTO suppliers (
        id, name, contact, phone, email, category, payment_terms,
        lead_time_days, invested_total, balance_owed, rating, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        contact = EXCLUDED.contact,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        payment_terms = EXCLUDED.payment_terms,
        invested_total = EXCLUDED.invested_total,
        balance_owed = EXCLUDED.balance_owed
      RETURNING *;
    `;
    const id = s.id || `sup-${Date.now().toString().slice(-4)}`;
    const values = [
      id, s.name, s.contact, s.phone, s.email, s.category || 'General',
      s.payment_terms || 'Contado', s.lead_time_days || 7,
      parseFloat(s.invested_total || 0), parseFloat(s.balance_owed || 0),
      parseFloat(s.rating || 5.0), s.status || 'Activo'
    ];
    const result = await pool.query(query, values);
    res.json({ success: true, supplier: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------------------------------
// 5. COMPRAS Y ABASTECIMIENTO (purchases)
// ----------------------------------------------------------------------------
app.get('/api/purchases', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, s.name AS supplier_name
      FROM purchases p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      ORDER BY p.date DESC;
    `);
    const purchases = result.rows.map(r => ({
      id: r.id,
      date: r.date,
      supplier_id: r.supplier_id,
      supplier_name: r.supplier_name,
      description: r.description,
      units: r.units,
      amount: parseFloat(r.amount),
      status: r.status,
      receipt: r.receipt
    }));
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/purchases', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const p = req.body;
    const id = p.id || `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    const query = `
      INSERT INTO purchases (id, date, supplier_id, description, units, amount, status, receipt)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [
      id,
      p.date || new Date().toISOString().slice(0, 10),
      p.supplier_id || 'sup-1',
      p.description || 'Abastecimiento de inventario',
      parseInt(p.units || 1, 10),
      parseFloat(p.amount || 0),
      p.status || 'Recibido & Pagado',
      p.receipt || `FAC-${Date.now().toString().slice(-5)}`
    ];
    const result = await client.query(query, values);

    // Actualizar total invertido del proveedor
    await client.query(`
      UPDATE suppliers 
      SET invested_total = invested_total + $1
      WHERE id = $2;
    `, [parseFloat(p.amount || 0), p.supplier_id || 'sup-1']);

    await client.query('COMMIT');
    res.status(201).json({ success: true, purchase: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// ----------------------------------------------------------------------------
// 6. ÓRDENES Y VENTAS (orders & order_items)
// ----------------------------------------------------------------------------
app.get('/api/orders', async (req, res) => {
  try {
    const ordersRes = await pool.query('SELECT * FROM orders ORDER BY created_at DESC;');
    const itemsRes = await pool.query('SELECT * FROM order_items;');

    const orders = ordersRes.rows.map(o => {
      const items = itemsRes.rows
        .filter(item => item.order_id === o.id)
        .map(i => ({
          name: i.product_name,
          qty: i.quantity,
          price: parseFloat(i.unit_price),
          subtotal: parseFloat(i.subtotal)
        }));

      return {
        id: o.id,
        date: o.date ? new Date(o.date).toISOString().replace('T', ' ').slice(0, 16) : new Date().toISOString(),
        customer_name: o.customer_name,
        customer_email: o.customer_email,
        customer_phone: o.customer_phone,
        customer_address: o.customer_address,
        subtotal: parseFloat(o.subtotal || o.total),
        shipping: parseFloat(o.shipping || 0),
        total: parseFloat(o.total),
        status: o.status,
        payment_method: o.payment_method,
        items: items
      };
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const o = req.body;
    const orderId = o.id || `ORD-${Date.now().toString().slice(-4)}`;

    const orderQuery = `
      INSERT INTO orders (
        id, customer_name, customer_email, customer_phone, customer_address,
        subtotal, shipping, total, status, payment_method
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const orderValues = [
      orderId,
      o.customer_name || o.customer || 'Cliente Invitado',
      o.customer_email || 'cliente@tienda.com',
      o.customer_phone || '+58 414 000 0000',
      o.customer_address || 'Dirección de Entrega',
      parseFloat(o.subtotal || o.total || 0),
      parseFloat(o.shipping || 0),
      parseFloat(o.total || 0),
      o.status || 'Pendiente',
      o.payment_method || 'Pago Móvil'
    ];
    await client.query(orderQuery, orderValues);

    // Insertar items y decrementar stock en PostgreSQL
    if (Array.isArray(o.items)) {
      for (const item of o.items) {
        const itemQuery = `
          INSERT INTO order_items (order_id, product_name, quantity, unit_price, subtotal)
          VALUES ($1, $2, $3, $4, $5);
        `;
        const qty = parseInt(item.qty || item.quantity || 1, 10);
        const unitPrice = parseFloat(item.price || item.unit_price || 0);
        const subtotal = qty * unitPrice;
        await client.query(itemQuery, [orderId, item.name, qty, unitPrice, subtotal]);

        // Reducir stock del producto en PostgreSQL si existe
        await client.query(`
          UPDATE products 
          SET stock = GREATEST(0, stock - $1)
          WHERE name = $2 OR id = $3;
        `, [qty, item.name, item.id || -1]);
      }
    }

    await client.query('COMMIT');
    res.status(201).json({ success: true, orderId: orderId });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query(`
      UPDATE orders SET status = $1 WHERE id = $2 RETURNING *;
    `, [status, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    res.json({ success: true, order: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------------------------------
// 7. VISTA FINANCIERA (v_inventory_financials)
// ----------------------------------------------------------------------------
app.get('/api/financials', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM v_inventory_financials ORDER BY id ASC;');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------------------------------
// 8. RESTABLECER VALORES DE FÁBRICA EN POSTGRESQL
// ----------------------------------------------------------------------------
app.post('/api/reset', async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const initSqlPath = path.join(__dirname, '../database/init.sql');
    if (fs.existsSync(initSqlPath)) {
      const sql = fs.readFileSync(initSqlPath, 'utf8');
      await pool.query(sql);
      res.json({ success: true, message: 'Base de datos PostgreSQL reinicializada a valores de fábrica' });
    } else {
      res.status(404).json({ error: 'Archivo init.sql no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inicio del servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Micro-Backend REST API corriendo en puerto ${PORT}`);
});
