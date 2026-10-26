import os
import docx
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def create_element(name):
    return parse_xml(f"<{name} {nsdecls('w')}/>")

def set_cell_shading(cell, color_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'''<w:tcMar {nsdecls("w")}>
        <w:top w:w="{top}" w:type="dxa"/>
        <w:bottom w:w="{bottom}" w:type="dxa"/>
        <w:left w:w="{left}" w:type="dxa"/>
        <w:right w:w="{right}" w:type="dxa"/>
    </w:tcMar>''')
    tcPr.append(tcMar)

def set_table_borders(table, color="CBD5E1", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'''<w:tblBorders {nsdecls("w")}>
        <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
        <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
        <w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
        <w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
        <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
        <w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
    </w:tblBorders>''')
    tblPr.append(borders)

def make_row_header(row):
    trPr = row._tr.get_or_add_trPr()
    tblHeader = parse_xml(f'<w:tblHeader {nsdecls("w")}/>')
    trPr.append(tblHeader)

def make_row_cant_split(row):
    trPr = row._tr.get_or_add_trPr()
    cantSplit = parse_xml(f'<w:cantSplit {nsdecls("w")}/>')
    trPr.append(cantSplit)

doc = docx.Document()

# Page Margins (2.54 cm standard)
sections = doc.sections
for s in sections:
    s.top_margin = Cm(2.54)
    s.bottom_margin = Cm(2.54)
    s.left_margin = Cm(2.54)
    s.right_margin = Cm(2.54)

# Document Header / Footer
header = sections[0].header
hp = header.paragraphs[0]
hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
hrun = hp.add_run("E-Commerce Oficial • Daniel Campos | Arquitectura PostgreSQL 16")
hrun.font.name = "Arial"
hrun.font.size = Pt(8.5)
hrun.font.color.rgb = RGBColor(148, 163, 184)

# Styles Setup
styles = doc.styles
normal_style = styles['Normal']
normal_style.font.name = 'Arial'
normal_style.font.size = Pt(10.5)
normal_style.font.color.rgb = RGBColor(30, 41, 59)
normal_style.paragraph_format.line_spacing = 1.2
normal_style.paragraph_format.space_after = Pt(6)

def add_title(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run(text)
    run.font.name = 'Arial'
    run.font.size = Pt(22)
    run.font.bold = True
    run.font.color.rgb = RGBColor(15, 23, 42)
    return p

def add_subtitle(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(14)
    run = p.add_run(text)
    run.font.name = 'Arial'
    run.font.size = Pt(13)
    run.font.bold = True
    run.font.color.rgb = RGBColor(37, 99, 235)
    return p

def add_heading_1(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(16)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Arial'
    run.font.size = Pt(14)
    run.font.bold = True
    run.font.color.rgb = RGBColor(15, 23, 42)
    return p

def add_heading_2(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Arial'
    run.font.size = Pt(11.5)
    run.font.bold = True
    run.font.color.rgb = RGBColor(30, 58, 138)
    return p

def add_callout(text, prefix="ℹ️ NOTA TÉCNICA: "):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    cell.width = Cm(16.0)
    set_cell_shading(cell, "F0F9FF")
    set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
    
    # Left border highlight
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'''<w:tcBorders {nsdecls("w")}>
        <w:left w:val="single" w:sz="24" w:space="0" w:color="0284C7"/>
        <w:top w:val="none"/>
        <w:right w:val="none"/>
        <w:bottom w:val="none"/>
    </w:tcBorders>''')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.line_spacing = 1.15
    r_pref = p.add_run(prefix)
    r_pref.font.name = 'Arial'
    r_pref.font.size = Pt(9.5)
    r_pref.font.bold = True
    r_pref.font.color.rgb = RGBColor(2, 132, 199)
    
    r_txt = p.add_run(text)
    r_txt.font.name = 'Arial'
    r_txt.font.size = Pt(9.5)
    r_txt.font.color.rgb = RGBColor(12, 74, 110)
    doc.add_paragraph()

def add_formatted_table(headers, rows, col_widths=None):
    table = doc.add_table(rows=len(rows) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table, color="CBD5E1", sz="4")
    
    # Header row
    hdr_row = table.rows[0]
    make_row_header(hdr_row)
    make_row_cant_split(hdr_row)
    for idx, heading in enumerate(headers):
        cell = hdr_row.cells[idx]
        set_cell_shading(cell, "0F172A")
        set_cell_margins(cell, top=120, bottom=120, left=140, right=140)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(heading)
        run.font.name = 'Arial'
        run.font.size = Pt(9)
        run.font.bold = True
        run.font.color.rgb = RGBColor(255, 255, 255)
    
    # Data rows
    for r_idx, row_data in enumerate(rows):
        row = table.rows[r_idx + 1]
        make_row_cant_split(row)
        bg_color = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            set_cell_shading(cell, bg_color)
            set_cell_margins(cell, top=100, bottom=100, left=130, right=130)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.15
            run = p.add_run(str(val))
            run.font.name = 'Arial'
            run.font.size = Pt(8.5)
            run.font.color.rgb = RGBColor(30, 41, 59)
            if c_idx == 0:
                run.font.bold = True
    
    if col_widths:
        for row in table.rows:
            for idx, width in enumerate(col_widths):
                row.cells[idx].width = Cm(width)
    
    doc.add_paragraph()

# ------------------------------------------------------------------------------
# DOCUMENT GENERATION
# ------------------------------------------------------------------------------
add_title("ARQUITECTURA Y MODELADO DE BASE DE DATOS POSTGRESQL 16")
add_subtitle("Plataforma E-Commerce Oficial & Backoffice Administrativo • Daniel Campos")

p_meta = doc.add_paragraph()
r = p_meta.add_run("Autor / Responsable: ")
r.bold = True
p_meta.add_run("Daniel Campos (Dueño & Administrador)\n")
r = p_meta.add_run("Motor de Persistencia: ")
r.bold = True
p_meta.add_run("PostgreSQL 16.15 (Alpine Linux, ACID Relacional)\n")
r = p_meta.add_run("Infraestructura: ")
r.bold = True
p_meta.add_run("Docker Compose Multi-Contenedor (Red Bridge ecommerce_network)\n")
r = p_meta.add_run("Estado del Sistema: ")
r.bold = True
p_meta.add_run("🟢 Operativo, Transaccional y Sincronizado en Tiempo Real\n")

add_callout(
    "El presente informe detalla el diseño relacional formal en Tercera Forma Normal (3FN), "
    "los diagramas de entidad-relación, la topología multi-contenedor en Docker, el flujo de datos transaccional, "
    "el diccionario de datos exhaustivo, las vistas analíticas de negocio y la estrategia de indexación "
    "para la defensa y evaluación académica del proyecto ante los profesores.",
    prefix="RESUMEN EJECUTIVO: "
)

# SECCION 1
add_heading_1("1. Ficha Técnica y Especificaciones de Persistencia")
add_formatted_table(
    ["Parámetro Técnico", "Valor / Especificación", "Justificación de Ingeniería"],
    [
        ["Motor de Base de Datos", "PostgreSQL 16.15 (Alpine)", "Estándar líder de la industria en integridad referencial y propiedades ACID."],
        ["Base de Datos", "ecommerce_db", "Base unificada para catálogo, usuarios, finanzas y operaciones comerciales."],
        ["Usuario Administrador", "daniel_admin", "Rol con privilegios de gestión y mantenimiento de esquema relacional."],
        ["Puerto Expuesto", "5432:5432", "Permite acceso seguro tanto a la API interna como a herramientas (psql, DBeaver)."],
        ["Volumen de Almacenamiento", "ecommerce_postgres_data", "Persistencia en disco físico del host para prevenir pérdidas ante reinicio."],
        ["Pool de Conexiones", "pg.Pool (Máx. 20 clientes)", "Reutilización eficiente de hilos concurrentes para alto tráfico."],
        ["Forma Normal", "3FN (Tercera Forma Normal)", "Eliminación total de redundancia y prevención de anomalías de modificación."]
    ],
    [3.5, 4.0, 8.5]
)

# SECCION 2
add_heading_1("2. Arquitectura de Servicios y Topología Multi-Contenedor")
doc.add_paragraph(
    "El sistema se distribuye en una arquitectura desacoplada de 3 capas empresariales (3-Tier) "
    "orquestadas mediante Docker Compose dentro de la red privada ecommerce_network:"
)
add_formatted_table(
    ["Servicio", "Imagen Base", "Puerto", "Responsabilidad Principal"],
    [
        ["web (Servidor Nginx)", "nginx:1.25-alpine", "8080:80", "Distribución de archivos estáticos (HTML5, CSS3, JS), compresión Gzip, cabeceras HTTP de seguridad y Proxy Inverso hacia /api/."],
        ["api (Micro-Backend)", "node:20-alpine", "3000 (Interno)", "Servidor Express REST, conexión nativa con pool pg hacia PostgreSQL, control de transacciones ACID y cálculo de finanzas."],
        ["db (Motor Relacional)", "postgres:16-alpine", "5432:5432", "Gestión de tablas relacionales, vistas SQL analíticas, índices B-Tree, restricciones CHECK y claves foráneas."]
    ],
    [3.5, 3.5, 2.5, 6.5]
)

add_callout(
    "Al implementar el proxy inverso en Nginx (puerto 8080), tanto la interfaz visual de la tienda como los endpoints "
    "de la API REST (/api/*) se consumen bajo el mismo origen. Esto elimina por completo problemas de CORS y "
    "simplifica la experiencia de navegación para los evaluadores.",
    prefix="VENTAJA DE ARQUITECTURA: "
)

# SECCION 3
add_heading_1("3. Diccionario de Datos Relacional Completo")

# 3.1 store_config
add_heading_2("3.1 Tabla: store_config (Configuración y Branding)")
doc.add_paragraph("Almacena la identidad visual de la tienda de Daniel Campos, colores de marca y estado del banner promocional.")
add_formatted_table(
    ["Campo", "Tipo de Dato", "Nulo", "Defecto", "Descripción del Campo"],
    [
        ["id", "SERIAL", "NO", "nextval()", "Clave primaria única."],
        ["name", "VARCHAR(150)", "NO", "'Mi Tienda Oficial'", "Razón comercial o nombre público de la tienda."],
        ["tagline", "VARCHAR(200)", "SÍ", "'Tecnología...'", "Lema corporativo de la cabecera."],
        ["logo_icon", "VARCHAR(20)", "SÍ", "'🛍️'", "Icono o imagotipo de marca."],
        ["primary_color", "VARCHAR(20)", "SÍ", "'#2563eb'", "Color corporativo en formato hexadecimal."],
        ["contact_phone", "VARCHAR(50)", "SÍ", "'+58 414...'", "Línea de soporte y atención comercial."],
        ["contact_email", "VARCHAR(120)", "SÍ", "'contacto@...'", "Correo corporativo oficial."],
        ["template_id", "VARCHAR(50)", "SÍ", "'moderno-tech'", "Identificador de la plantilla activa en el personalizador."],
        ["template_archetype", "VARCHAR(50)", "SÍ", "'moderno'", "Arquetipo estructural CSS asociado."],
        ["updated_at", "TIMESTAMP", "SÍ", "CURRENT_TIMESTAMP", "Auditoría de última actualización."]
    ],
    [3.0, 3.0, 1.5, 3.5, 5.0]
)

# 3.2 users
add_heading_2("3.2 Tabla: users (Seguridad, Roles y Control de Acceso RBAC)")
doc.add_paragraph("Segrega permisos entre el Administrador/Dueño (Daniel Campos) y los clientes registrados.")
add_formatted_table(
    ["Campo", "Tipo de Dato", "Nulo", "Restricción", "Descripción del Campo"],
    [
        ["id", "VARCHAR(50)", "NO", "PRIMARY KEY", "Identificador alfanumérico (usr-admin-1, usr-client-1)."],
        ["name", "VARCHAR(150)", "NO", "-", "Nombre y apellido del usuario registrado."],
        ["email", "VARCHAR(150)", "NO", "UNIQUE", "Correo electrónico único utilizado como login."],
        ["password_hash", "VARCHAR(255)", "NO", "-", "Hash Bcrypt de alta seguridad para autenticación."],
        ["role", "VARCHAR(20)", "NO", "CHECK (role IN ('admin','cliente'))", "Rol de autorización en el sistema."],
        ["role_label", "VARCHAR(100)", "NO", "-", "Etiqueta visual del rol en el panel de control."],
        ["avatar", "VARCHAR(20)", "SÍ", "DEFAULT '👤'", "Avatar visual del perfil de usuario."]
    ],
    [3.0, 3.0, 1.5, 4.0, 4.5]
)

# 3.3 suppliers
add_heading_2("3.3 Tabla: suppliers (Proveedores Comerciales y Fabricantes)")
doc.add_paragraph("Registra fabricantes y distribuidores directos de mercancía para la reposición de stock.")
add_formatted_table(
    ["Campo", "Tipo de Dato", "Nulo", "Restricción", "Descripción del Campo"],
    [
        ["id", "VARCHAR(50)", "NO", "PRIMARY KEY", "Código del proveedor (sup-1, sup-2)."],
        ["name", "VARCHAR(200)", "NO", "-", "Razón social de la empresa distribuidora."],
        ["contact_person", "VARCHAR(150)", "NO", "-", "Representante comercial directo."],
        ["category", "VARCHAR(100)", "SÍ", "-", "Rubro principal de suministros."],
        ["terms", "VARCHAR(100)", "SÍ", "DEFAULT 'Contado'", "Condiciones de pago (Contado, Crédito 15/30 días)."],
        ["rating", "VARCHAR(50)", "SÍ", "DEFAULT '4.9 ★'", "Índice de confiabilidad y puntualidad."],
        ["total_invested", "DECIMAL(12,2)", "SÍ", "DEFAULT 0.00", "Volumen total acumulado en compras."]
    ],
    [3.0, 3.0, 1.5, 3.5, 5.0]
)

# 3.4 products
add_heading_2("3.4 Tabla: products (Catálogo Maestro y Control de Existencias)")
doc.add_paragraph("Ficha técnica comercial de artículos, costos de adquisición, precios de venta y stock disponible.")
add_formatted_table(
    ["Campo", "Tipo de Dato", "Nulo", "Restricción", "Descripción del Campo"],
    [
        ["id", "SERIAL", "NO", "PRIMARY KEY", "Identificador único autoincremental."],
        ["name", "VARCHAR(200)", "NO", "-", "Nombre del producto en el catálogo."],
        ["slug", "VARCHAR(200)", "NO", "UNIQUE", "Identificador amigable para URLs."],
        ["sku", "VARCHAR(60)", "NO", "UNIQUE", "Stock Keeping Unit único de control de almacén."],
        ["category", "VARCHAR(50)", "NO", "-", "Identificador de categoría técnica (audio, wearables, oficina)."],
        ["category_label", "VARCHAR(100)", "NO", "-", "Etiqueta visual formateada para la tienda."],
        ["cost_price", "DECIMAL(10,2)", "NO", "CHECK (cost_price >= 0)", "Costo unitario de compra al proveedor."],
        ["sale_price", "DECIMAL(10,2)", "NO", "CHECK (sale_price > 0)", "Precio de venta al público en USD."],
        ["stock", "INT", "NO", "CHECK (stock >= 0)", "Existencias físicas en inventario."],
        ["supplier_id", "VARCHAR(50)", "SÍ", "FK suppliers(id)", "Proveedor fabricante asociado."],
        ["image_url", "TEXT", "NO", "-", "Ruta de la fotografía de alta calidad."]
    ],
    [3.0, 3.0, 1.5, 3.5, 5.0]
)

# 3.5 purchases
add_heading_2("3.5 Tabla: purchases (Facturación de Abastecimiento de Mercancía)")
doc.add_paragraph("Control contable de facturas y lotes recibidos de proveedores.")
add_formatted_table(
    ["Campo", "Tipo de Dato", "Nulo", "Restricción", "Descripción del Campo"],
    [
        ["id", "VARCHAR(50)", "NO", "PRIMARY KEY", "Código de factura o lote (INV-2026-001)."],
        ["date", "DATE", "NO", "-", "Fecha de emisión y recepción de la orden."],
        ["supplier_id", "VARCHAR(50)", "SÍ", "FK suppliers(id)", "Proveedor al que se le realizó la compra."],
        ["description", "TEXT", "NO", "-", "Descripción detallada del lote adquirido."],
        ["units", "INT", "NO", "CHECK (units > 0)", "Cantidad de unidades recibidas en el lote."],
        ["amount", "DECIMAL(12,2)", "NO", "CHECK (amount >= 0)", "Monto total facturado en USD."],
        ["status", "VARCHAR(50)", "SÍ", "DEFAULT 'Recibido'", "Estado del despacho y pago del lote."]
    ],
    [3.0, 3.0, 1.5, 3.5, 5.0]
)

# 3.6 orders & order_items
add_heading_2("3.6 Tablas: orders y order_items (Gestión Transaccional de Ventas)")
doc.add_paragraph("Registra cada compra formalizada por clientes, vinculando la cabecera del pedido con sus líneas de detalle.")
add_formatted_table(
    ["Campo", "Tipo de Dato", "Nulo", "Restricción", "Descripción del Campo"],
    [
        ["orders.id", "VARCHAR(50)", "NO", "PRIMARY KEY", "Código de seguimiento (ORD-2026-001)."],
        ["customer_name", "VARCHAR(150)", "NO", "-", "Nombre completo del comprador."],
        ["customer_email", "VARCHAR(150)", "NO", "-", "Correo para envío de factura digital."],
        ["total", "DECIMAL(10,2)", "NO", "-", "Importe total liquidado por la compra."],
        ["status", "VARCHAR(30)", "SÍ", "CHECK (status IN ('Pendiente','En Preparación','Enviado','Entregado'))", "Estado del pedido en la cadena de logística."],
        ["order_items.id", "SERIAL", "NO", "PRIMARY KEY", "Línea individual de factura."],
        ["order_id", "VARCHAR(50)", "SÍ", "FK orders(id) CASCADE", "Vínculo maestro con la orden de compra."],
        ["product_id", "INT", "SÍ", "FK products(id) SET NULL", "Vínculo con el producto vendido."],
        ["quantity", "INT", "NO", "CHECK (quantity > 0)", "Unidades compradas de este artículo."],
        ["unit_price", "DECIMAL(10,2)", "NO", "-", "Precio congelado al momento de la venta."]
    ],
    [3.0, 3.0, 1.5, 3.5, 5.0]
)

# SECCION 4
add_heading_1("4. Vista Analítica de Rentabilidad: v_inventory_financials")
doc.add_paragraph(
    "Para garantizar que el panel administrativo de Daniel Campos opere con métricas financieras "
    "exactas sin sobrecargar el navegador, se implementó una vista analítica en PostgreSQL que "
    "calcula márgenes brutos, costos inmovilizados y retornos proyectados en tiempo real:"
)

add_formatted_table(
    ["Métrica Calculada", "Fórmula SQL en Vista", "Utilidad Comercial para Daniel Campos"],
    [
        ["Ganancia Unitaria", "sale_price - cost_price", "Margen bruto nominal que deja cada unidad vendida."],
        ["Margen Porcentual", "((sale_price - cost_price) / sale_price) * 100", "Rentabilidad porcentual sobre el precio final de venta."],
        ["Costo de Inventario", "cost_price * stock", "Capital total inmovilizado en almacén."],
        ["Venta Proyectada", "sale_price * stock", "Facturación bruta total esperada al agotar existencias."],
        ["Utilidad Proyectada", "(sale_price - cost_price) * stock", "Ganancia neta total que generará el lote actual."]
    ],
    [3.5, 5.5, 7.0]
)

# SECCION 5
add_heading_1("5. Estrategia de Indexación y Optimización")
doc.add_paragraph("Se construyeron índices B-Tree específicos para optimizar las consultas de mayor frecuencia en la plataforma:")
add_formatted_table(
    ["Nombre del Índice", "Tabla Destino", "Columna Indexada", "Beneficio Operativo"],
    [
        ["idx_products_sku", "products", "sku", "Búsqueda instantánea de mercancía O(log N) por código de inventario."],
        ["idx_products_category", "products", "category", "Filtrado ágil de productos al navegar por categorías en la tienda."],
        ["idx_orders_status", "orders", "status", "Segmentación en el panel administrativo por pedidos pendientes o enviados."],
        ["idx_orders_date", "orders", "date", "Generación cronológica rápida de reportes de ventas mensuales."],
        ["idx_users_email", "users", "email", "Validación inmediata en milisegundos durante el inicio de sesión."]
    ],
    [4.0, 2.5, 3.0, 6.5]
)

# SECCION 6
add_heading_1("6. Cumplimiento Estricto de las Propiedades ACID")
add_formatted_table(
    ["Propiedad ACID", "Mecanismo en PostgreSQL 16", "Aplicación Práctica en el Proyecto"],
    [
        ["Atomicidad (A)", "Transacciones BEGIN ... COMMIT / ROLLBACK", "Si ocurre un error en el pago o falta de stock, la orden no se crea parcialmente."],
        ["Consistencia (C)", "Restricciones CHECK, FOREIGN KEY y UNIQUE", "Imposible tener existencias negativas o duplicar identificadores SKU."],
        ["Aislamiento (I)", "Nivel READ COMMITTED con Row-Level Locking", "Múltiples clientes comprando al mismo tiempo no sobre-venden el inventario."],
        ["Durabilidad (D)", "Write-Ahead Logging (WAL) + Volumen Docker", "Los datos permanecen seguros en disco físico aun ante cortes de energía."]
    ],
    [3.5, 5.0, 7.5]
)

# Guardar Documento
output_path = r"c:\Users\pc\OneDrive\Desktop\ecommerce\ecommerce_propuesta_visual\ARQUITECTURA_BASE_DE_DATOS_POSTGRESQL.docx"
desktop_path = r"c:\Users\pc\OneDrive\Desktop\ARQUITECTURA_BASE_DE_DATOS_POSTGRESQL.docx"
doc.save(output_path)
doc.save(desktop_path)
print("DOCX_GENERATED_SUCCESSFULLY")
