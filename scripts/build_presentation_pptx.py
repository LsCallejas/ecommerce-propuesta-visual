import os
import shutil
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = Presentation()
    # Set 16:9 widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # Blank slide

    # Color Palette Definitions
    COLOR_NAVY = RGBColor(15, 23, 42)       # #0F172A (Deep Slate Navy)
    COLOR_BLUE = RGBColor(37, 99, 235)      # #2563EB (Primary Accent Blue)
    COLOR_GREEN = RGBColor(16, 185, 129)    # #10B981 (Success Emerald)
    COLOR_AMBER = RGBColor(245, 158, 11)    # #F59E0B (Highlight Gold)
    COLOR_BG_LIGHT = RGBColor(248, 250, 252)# #F8FAFC (Light slate background)
    COLOR_CARD_BG = RGBColor(255, 255, 255) # Pure White
    COLOR_CARD_BORDER = RGBColor(226, 232, 240) # Slate 200
    COLOR_TEXT_MAIN = RGBColor(15, 23, 42)  # Slate 900
    COLOR_TEXT_MUTED = RGBColor(100, 116, 139) # Slate 500
    COLOR_WHITE = RGBColor(255, 255, 255)

    def set_slide_background(slide, color):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = color

    def add_header(slide, category_title, main_title, subtitle=""):
        # Header container
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(1.1))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p_cat = tf.paragraphs[0]
        r_cat = p_cat.add_run()
        r_cat.text = category_title.upper()
        r_cat.font.name = "Arial"
        r_cat.font.size = Pt(10)
        r_cat.font.bold = True
        r_cat.font.color.rgb = COLOR_BLUE
        
        p_title = tf.add_paragraph()
        r_title = p_title.add_run()
        r_title.text = main_title
        r_title.font.name = "Arial"
        r_title.font.size = Pt(22)
        r_title.font.bold = True
        r_title.font.color.rgb = COLOR_TEXT_MAIN
        
        if subtitle:
            p_sub = tf.add_paragraph()
            r_sub = p_sub.add_run()
            r_sub.text = subtitle
            r_sub.font.name = "Arial"
            r_sub.font.size = Pt(11)
            r_sub.font.color.rgb = COLOR_TEXT_MUTED

    def add_card(slide, left, top, width, height, title, subtitle="", bg_color=COLOR_CARD_BG, border_color=COLOR_CARD_BORDER):
        # Card background rectangle
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1.5)
        
        # Header text inside card
        tb = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.2), width - Inches(0.5), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = title
        r.font.name = "Arial"
        r.font.size = Pt(14)
        r.font.bold = True
        r.font.color.rgb = COLOR_NAVY
        
        if subtitle:
            p_s = tf.add_paragraph()
            r_s = p_s.add_run()
            r_s.text = subtitle
            r_s.font.name = "Arial"
            r_s.font.size = Pt(10)
            r_s.font.color.rgb = COLOR_TEXT_MUTED
            
        return shape

    # ==========================================
    # SLIDE 1: PORTADA EJECUTIVA (DARK MODE)
    # ==========================================
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide1, COLOR_NAVY)
    
    # Accent top border
    accent_bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.12))
    accent_bar.fill.solid()
    accent_bar.fill.fore_color.rgb = COLOR_BLUE
    accent_bar.line.fill.background()

    # Title box
    tb = slide1.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.333), Inches(3.5))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p_tag = tf.paragraphs[0]
    r_tag = p_tag.add_run()
    r_tag.text = "PROYECTO DE GRADO & DEFENSA TÉCNICA OFICIAL"
    r_tag.font.name = "Arial"
    r_tag.font.size = Pt(13)
    r_tag.font.bold = True
    r_tag.font.color.rgb = COLOR_GREEN
    
    p_main = tf.add_paragraph()
    p_main.space_before = Pt(12)
    r_main = p_main.add_run()
    r_main.text = "PLATAFORMA E-COMMERCE OFICIAL\nY PANEL ADMINISTRATIVO"
    r_main.font.name = "Arial"
    r_main.font.size = Pt(36)
    r_main.font.bold = True
    r_main.font.color.rgb = COLOR_WHITE
    
    p_sub = tf.add_paragraph()
    p_sub.space_before = Pt(12)
    r_sub = p_sub.add_run()
    r_sub.text = "Arquitectura Desacoplada de 3 Niveles • Motor Relacional PostgreSQL 16 (ACID) • Docker Compose"
    r_sub.font.name = "Arial"
    r_sub.font.size = Pt(16)
    r_sub.font.color.rgb = RGBColor(148, 163, 184)

    # Presenter Card
    p_card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(5.6), Inches(11.333), Inches(1.2))
    p_card.fill.solid()
    p_card.fill.fore_color.rgb = RGBColor(30, 41, 59)
    p_card.line.color.rgb = RGBColor(51, 65, 85)
    
    tb_pres = slide1.shapes.add_textbox(Inches(1.3), Inches(5.75), Inches(10.7), Inches(0.9))
    tf_pres = tb_pres.text_frame
    tf_pres.word_wrap = True
    
    p_pres = tf_pres.paragraphs[0]
    r_p1 = p_pres.add_run()
    r_p1.text = "Autor & Administrador del Sistema: "
    r_p1.font.bold = True
    r_p1.font.color.rgb = COLOR_WHITE
    r_p1.font.size = Pt(13)
    
    r_p2 = p_pres.add_run()
    r_p2.text = "Daniel Campos  |  "
    r_p2.font.bold = True
    r_p2.font.color.rgb = COLOR_BLUE
    r_p2.font.size = Pt(13)
    
    r_p3 = p_pres.add_run()
    r_p3.text = "Contacto: daniel@tienda.com\n"
    r_p3.font.color.rgb = RGBColor(203, 213, 225)
    r_p3.font.size = Pt(12)
    
    p_repo = tf_pres.add_paragraph()
    r_r1 = p_repo.add_run()
    r_r1.text = "Repositorio GitHub: "
    r_r1.font.bold = True
    r_r1.font.color.rgb = COLOR_WHITE
    r_r1.font.size = Pt(11)
    
    r_r2 = p_repo.add_run()
    r_r2.text = "https://github.com/LsCallejas/ecommerce-propuesta-visual  |  Octubre 2026"
    r_r2.font.color.rgb = RGBColor(148, 163, 184)
    r_r2.font.size = Pt(11)


    slide1.notes_slide.notes_text_frame.text = (
        "NOTAS DEL ORADOR:\n"
        "Buenos días/tardes estimados profesores y jurado examinador. "
        "Mi nombre es Daniel Campos y hoy presento la arquitectura, desarrollo e implementación oficial "
        "de nuestra plataforma de comercio electrónico multi-arquetipo con panel administrativo, "
        "diseñada bajo los más altos estándares de ingeniería de software con Docker y PostgreSQL 16."
    )

    # ==========================================
    # SLIDE 2: PLANTEAMIENTO Y OBJETIVOS
    # ==========================================
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide2, COLOR_BG_LIGHT)
    add_header(slide2, "Contexto y Motivación", "Planteamiento del Problema y Objetivos del Proyecto", 
               "Superando las limitaciones tradicionales de los e-commerce monolíticos y de memoria efímera.")

    # 3 Cards Layout
    col_w = Inches(3.64)
    gap = Inches(0.4)
    left_start = Inches(0.8)
    top_pos = Inches(1.8)
    card_h = Inches(4.9)

    # Card 1: Problema
    add_card(slide2, left_start, top_pos, col_w, card_h, "1. Desafío de la Industria", "Riesgos en sistemas tradicionales")
    tb = slide2.shapes.add_textbox(left_start + Inches(0.25), top_pos + Inches(1.0), col_w - Inches(0.5), card_h - Inches(1.2))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.text = "• Inconsistencia de Datos:\nBases de datos no relacionales sufren de sobreventa (overselling) durante picos de compras concurrentes.\n\n• Pérdida de Información:\nMuchos proyectos académicos o prototipos operan en memoria local o SQLite sin persistencia desacoplada.\n\n• Rigidez de Diseño:\nSistemas convencionales no permiten adaptar la imagen corporativa sin rehacer código."
    for p in tf.paragraphs:
        p.font.size = Pt(11)
        p.font.name = "Arial"
        p.font.color.rgb = COLOR_TEXT_MAIN

    # Card 2: Solución
    add_card(slide2, left_start + col_w + gap, top_pos, col_w, card_h, "2. Nuestra Solución", "Arquitectura modular moderna")
    tb = slide2.shapes.add_textbox(left_start + col_w + gap + Inches(0.25), top_pos + Inches(1.0), col_w - Inches(0.5), card_h - Inches(1.2))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.text = "• Transacciones ACID:\nPostgreSQL 16 garantiza atomicidad total en compras, bloqueos y control estricto de existencias.\n\n• Contenerización Total:\n3 contenedores Docker (Web, API, DB) orquestados en red privada con volumen de datos inmutable.\n\n• Motor Multi-Arquetipo:\nCapacidad de alternar paletas, estilos y temáticas en tiempo real desde el panel administrativo."
    for p in tf.paragraphs:
        p.font.size = Pt(11)
        p.font.name = "Arial"
        p.font.color.rgb = COLOR_TEXT_MAIN

    # Card 3: Impacto y Resultados
    add_card(slide2, left_start + (col_w + gap)*2, top_pos, col_w, card_h, "3. Objetivos Logrados", "Validación funcional y técnica")
    tb = slide2.shapes.add_textbox(left_start + (col_w + gap)*2 + Inches(0.25), top_pos + Inches(1.0), col_w - Inches(0.5), card_h - Inches(1.2))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.text = "• Despliegue en 1 Clic:\nEjecución transparente en Windows con scripts híbridos de detección automática WSL/Docker.\n\n• Auditoría Financiera:\nVistas SQL analíticas para el cálculo dinámico de márgenes de utilidad y valoración del inventario.\n\n• Alta Portabilidad:\nCódigo modular estructurado (frontend, backend, database, docs, scripts) disponible en GitHub."
    for p in tf.paragraphs:
        p.font.size = Pt(11)
        p.font.name = "Arial"
        p.font.color.rgb = COLOR_TEXT_MAIN

    slide2.notes_slide.notes_text_frame.text = (
        "NOTAS DEL ORADOR:\n"
        "Explicar al jurado que el proyecto nació de una necesidad real: la mayoría de los e-commerce sufren problemas "
        "de stock cuando dos usuarios compran la última unidad al mismo tiempo. "
        "Nuestra meta fue crear una plataforma real, resistente a fallos, basada en PostgreSQL 16 y Docker Compose."
    )

    # ==========================================
    # SLIDE 3: ARQUITECTURA DE 3 NIVELES
    # ==========================================
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3, COLOR_BG_LIGHT)
    add_header(slide3, "Arquitectura de Software", "Topología Desacoplada de 3 Niveles en Docker", 
               "Separación estricta de responsabilidades entre presentación, lógica de negocio y persistencia.")

    # 3 Horizontal Cards representing the 3 Tiers
    tier_w = Inches(11.733)
    tier_h = Inches(1.4)
    tier_left = Inches(0.8)
    
    # Tier 1: Frontend
    add_card(slide3, tier_left, Inches(1.8), tier_w, tier_h, "Nivel 1: Capa de Presentación (Frontend Web & Proxy)", 
             "Contenedor: ecommerce_web_app  |  Nginx 1.25 Alpine  |  Puerto Host: 8080")
    tb1 = slide3.shapes.add_textbox(tier_left + Inches(0.25), Inches(2.45), tier_w - Inches(0.5), Inches(0.65))
    tb1.text_frame.word_wrap = True
    tb1.text_frame.text = "• Tecnologías: HTML5 Semántico, Vanilla CSS3 sin dependencias pesadas, ES6+ Modular.\n• Función: Sirve el catálogo al cliente y el panel backoffice. Enruta transparentemente peticiones '/api/*' hacia la API interna."
    for p in tb1.text_frame.paragraphs:
        p.font.size = Pt(10.5)
        p.font.color.rgb = COLOR_TEXT_MAIN

    # Tier 2: API
    add_card(slide3, tier_left, Inches(3.45), tier_w, tier_h, "Nivel 2: Capa de Servicios y Lógica (REST API)", 
             "Contenedor: ecommerce_api_service  |  Node.js 20 LTS + Express  |  Puerto Interno: 3000")
    tb2 = slide3.shapes.add_textbox(tier_left + Inches(0.25), Inches(4.1), tier_w - Inches(0.5), Inches(0.65))
    tb2.text_frame.word_wrap = True
    tb2.text_frame.text = "• Tecnologías: Express REST API, Driver oficial 'pg' con Connection Pool (máx. 20 conexiones).\n• Función: Validaciones de negocio, consultas parametrizadas anti SQL Injection y sincronización bidireccional en tiempo real."
    for p in tb2.text_frame.paragraphs:
        p.font.size = Pt(10.5)
        p.font.color.rgb = COLOR_TEXT_MAIN

    # Tier 3: Database
    add_card(slide3, tier_left, Inches(5.1), tier_w, tier_h, "Nivel 3: Capa de Datos Transaccional (Database)", 
             "Contenedor: ecommerce_postgres_db  |  PostgreSQL 16.15 Alpine  |  Puerto: 5432:5432")
    tb3 = slide3.shapes.add_textbox(tier_left + Inches(0.25), Inches(5.75), tier_w - Inches(0.5), Inches(0.65))
    tb3.text_frame.word_wrap = True
    tb3.text_frame.text = "• Tecnologías: Motor PostgreSQL 16 con volumen persistente 'ecommerce_postgres_data'.\n• Función: Modelo relacional 3FN, transacciones ACID, constraints CHECK, integridad referencial y vistas analíticas de negocio."
    for p in tb3.text_frame.paragraphs:
        p.font.size = Pt(10.5)
        p.font.color.rgb = COLOR_TEXT_MAIN

    slide3.notes_slide.notes_text_frame.text = (
        "NOTAS DEL ORADOR:\n"
        "Destacar que Nginx actúa como reverse proxy. El navegador sólo conoce el puerto 8080. "
        "Nginx recibe el tráfico y reenvía internamente las solicitudes de /api/* hacia el backend en el puerto 3000, "
        "evitando problemas de CORS y garantizando seguridad en la infraestructura."
    )

    # ==========================================
    # SLIDE 4: MODELADO DE BASE DE DATOS (7 TABLAS)
    # ==========================================
    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide4, COLOR_BG_LIGHT)
    add_header(slide4, "Persistencia Relacional", "Estructura del Modelo de Datos (Tercera Forma Normal - 3FN)", 
               "7 tablas estructuradas para eliminar redundancias y garantizar la coherencia contable.")

    # 2 Columns of Cards for the 7 Tables
    c_w = Inches(5.66)
    c_left1 = Inches(0.8)
    c_left2 = Inches(6.86)
    c_h = Inches(2.35)

    # Left Top: Products & Suppliers
    add_card(slide4, c_left1, Inches(1.8), c_w, c_h, "Catálogo y Proveedores (products, suppliers)", "Cadena de valor comercial")
    tb = slide4.shapes.add_textbox(c_left1 + Inches(0.2), Inches(2.55), c_w - Inches(0.4), Inches(1.5))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.text = "• products: PK id, SKU y slug únicos, precio costo y venta, restricción CHECK (stock >= 0).\n• suppliers: Fabricantes internacionales, términos de pago (crédito/contado), rating y monto invertido.\n• Relación: products.supplier_id -> suppliers.id (ON DELETE SET NULL)."
    for p in tf.paragraphs:
        p.font.size = Pt(10.5)
        p.font.color.rgb = COLOR_TEXT_MAIN

    # Left Bottom: Purchases & Config
    add_card(slide4, c_left1, Inches(4.35), c_w, c_h, "Inversiones y Configuración (purchases, store_config)", "Abastecimiento y personalización")
    tb = slide4.shapes.add_textbox(c_left1 + Inches(0.2), Inches(5.1), c_w - Inches(0.4), Inches(1.5))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.text = "• purchases: Lotes de abastecimiento con FK a suppliers.id, unidades adquiridas y costo total de compra.\n• store_config: Configuración dinámica de marca, banners, logotipos y selector de arquetipo visual."
    for p in tf.paragraphs:
        p.font.size = Pt(10.5)
        p.font.color.rgb = COLOR_TEXT_MAIN

    # Right Top: Orders & Order Items
    add_card(slide4, c_left2, Inches(1.8), c_w, c_h, "Ventas y Detalle (orders, order_items)", "Transaccionalidad del cliente (Relación N:M)")
    tb = slide4.shapes.add_textbox(c_left2 + Inches(0.2), Inches(2.55), c_w - Inches(0.4), Inches(1.5))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.text = "• orders: Cabecera con datos del comprador, total, método de pago y estados: Pendiente, Enviado, Entregado.\n• order_items: Detalle de productos por orden. Clave de diseño: Congela el unit_price histórico para preservar la integridad contable ante futuras variaciones de precios."
    for p in tf.paragraphs:
        p.font.size = Pt(10.5)
        p.font.color.rgb = COLOR_TEXT_MAIN

    # Right Bottom: Users & RBAC
    add_card(slide4, c_left2, Inches(4.35), c_w, c_h, "Seguridad y Accesos (users)", "Control de acceso basado en roles (RBAC)")
    tb = slide4.shapes.add_textbox(c_left2 + Inches(0.2), Inches(5.1), c_w - Inches(0.4), Inches(1.5))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.text = "• users: Identificación de usuarios con correos únicos (UK) y contraseñas cifradas con hash Bcrypt.\n• Control RBAC: Restricción CHECK (role IN ('admin', 'cliente')). Administrador oficial: Daniel Campos."
    for p in tf.paragraphs:
        p.font.size = Pt(10.5)
        p.font.color.rgb = COLOR_TEXT_MAIN

    slide4.notes_slide.notes_text_frame.text = (
        "NOTAS DEL ORADOR:\n"
        "Punto crítico para el jurado: Enfatizar que en order_items se guarda el unit_price del momento de la compra. "
        "Si en el futuro el producto sube de $50 a $70 en la tabla products, la orden de venta pasada sigue marcando $50 "
        "sin alterar el balance contable histórico. Esto es un principio fundamental de Tercera Forma Normal."
    )

    # ==========================================
    # SLIDE 5: VISTA ANALÍTICA E ÍNDICES
    # ==========================================
    slide5 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide5, COLOR_BG_LIGHT)
    add_header(slide5, "Inteligencia de Negocio & Performance", "Vista Analítica Financiera y Optimización B-Tree", 
               "Lógica de negocio ejecutada directamente en el motor de base de datos para máxima velocidad.")

    # Left: SQL View
    add_card(slide5, Inches(0.8), Inches(1.8), Inches(6.8), Inches(4.9), "Vista Analítica: v_inventory_financials", "Cálculo en vivo sin redundancia de datos")
    tb = slide5.shapes.add_textbox(Inches(1.05), Inches(2.7), Inches(6.3), Inches(3.8))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.text = (
        "Une en tiempo real las tablas 'products' y 'suppliers' para ofrecer indicadores clave de rendimiento (KPIs):\n\n"
        "• Ganancia Unitaria: (sale_price - cost_price)\n"
        "• Margen Comercial: ((sale_price - cost_price) / sale_price) * 100\n"
        "• Capital Inmovilizado: (cost_price * stock)\n"
        "• Ingreso Proyectado: (sale_price * stock)\n"
        "• Utilidad Bruta Proyectada: ((sale_price - cost_price) * stock)\n\n"
        "Ventaja: Los directivos obtienen reportes financieros inmediatos sin necesidad de procesar bucles complejos en el servidor de aplicaciones."
    )
    for p in tf.paragraphs:
        p.font.size = Pt(11)
        p.font.color.rgb = COLOR_TEXT_MAIN

    # Right: Indexes & Tuning
    add_card(slide5, Inches(7.8), Inches(1.8), Inches(4.733), Inches(4.9), "Estrategia de Indexación", "Optimización algorítmica O(log n)")
    tb_r = slide5.shapes.add_textbox(Inches(8.05), Inches(2.7), Inches(4.2), Inches(3.8))
    tf_r = tb_r.text_frame
    tf_r.word_wrap = True
    tf_r.text = (
        "Se implementaron 5 índices B-Tree específicos:\n\n"
        "1. idx_products_sku: Búsqueda instantánea de inventario por código de barra.\n\n"
        "2. idx_products_category: Filtrado veloz de categorías en el catálogo del cliente.\n\n"
        "3. idx_orders_status: Consulta ágil de órdenes pendientes en el panel admin.\n\n"
        "4. idx_orders_date: Reportes cronológicos y auditoría contable.\n\n"
        "5. idx_users_email: Autenticación segura de usuarios en milisegundos."
    )
    for p in tf_r.paragraphs:
        p.font.size = Pt(11)
        p.font.color.rgb = COLOR_TEXT_MAIN

    slide5.notes_slide.notes_text_frame.text = (
        "NOTAS DEL ORADOR:\n"
        "Explicar que las bases de datos modernas no son simples depósitos de tablas, sino motores de cálculo. "
        "La vista v_inventory_financials permite responder inmediatamente preguntas de negocio: ¿cuánto vale hoy "
        "mi inventario? y ¿cuál es el margen promedio de mis productos de audio?"
    )

    # ==========================================
    # SLIDE 6: GUÍA DE DESPLIEGUE EN WINDOWS (WSL + DOCKER)
    # ==========================================
    slide6 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide6, COLOR_BG_LIGHT)
    add_header(slide6, "Despliegue e Infraestructura", "Guía Paso a Paso para Ejecución en Windows", 
               "Instalación desde cero, automatización y paridad de entornos con Docker.")

    # 4 Steps Cards in 2x2 Grid
    s_w = Inches(5.66)
    s_h = Inches(2.35)
    s_left1 = Inches(0.8)
    s_left2 = Inches(6.86)

    # Step 1
    add_card(slide6, s_left1, Inches(1.8), s_w, s_h, "Paso 1: Habilitar WSL 2", "Kernel Linux en Windows")
    tb = slide6.shapes.add_textbox(s_left1 + Inches(0.2), Inches(2.55), s_w - Inches(0.4), Inches(1.4))
    tb.text_frame.word_wrap = True
    tb.text_frame.text = "1. Abrir PowerShell como Administrador.\n2. Ejecutar: wsl --install\n3. Reiniciar el equipo y configurar usuario de Ubuntu.\n4. Verificar con: wsl -l -v (versión 2 confirmada)."
    for p in tb.text_frame.paragraphs:
        p.font.size = Pt(10.5)
        p.font.color.rgb = COLOR_TEXT_MAIN

    # Step 2
    add_card(slide6, s_left2, Inches(1.8), s_w, s_h, "Paso 2: Instalar Docker", "Entorno de microservicios")
    tb = slide6.shapes.add_textbox(s_left2 + Inches(0.2), Inches(2.55), s_w - Inches(0.4), Inches(1.4))
    tb.text_frame.word_wrap = True
    tb.text_frame.text = "• Opción Gráfica: Descargar Docker Desktop con la casilla 'Use WSL 2 based engine' marcada.\n• Opción CLI: sudo apt install docker.io docker-compose dentro de Ubuntu WSL."
    for p in tb.text_frame.paragraphs:
        p.font.size = Pt(10.5)
        p.font.color.rgb = COLOR_TEXT_MAIN

    # Step 3
    add_card(slide6, s_left1, Inches(4.35), s_w, s_h, "Paso 3: Puesta en Marcha en 1 Clic", "Automatización con docker-iniciar.bat")
    tb = slide6.shapes.add_textbox(s_left1 + Inches(0.2), Inches(5.1), s_w - Inches(0.4), Inches(1.4))
    tb.text_frame.word_wrap = True
    tb.text_frame.text = "• Doble clic en 'docker-iniciar.bat'.\n• El script detecta el motor Docker, levanta los 3 contenedores y lanza el navegador automáticamente en http://localhost:8080."
    for p in tb.text_frame.paragraphs:
        p.font.size = Pt(10.5)
        p.font.color.rgb = COLOR_TEXT_MAIN

    # Step 4
    add_card(slide6, s_left2, Inches(4.35), s_w, s_h, "Paso 4: Accesos y Credenciales", "Pruebas inmediatas")
    tb = slide6.shapes.add_textbox(s_left2 + Inches(0.2), Inches(5.1), s_w - Inches(0.4), Inches(1.4))
    tb.text_frame.word_wrap = True
    tb.text_frame.text = "• Tienda: http://localhost:8080\n• Panel Admin: http://localhost:8080/admin.html\n• Admin: admin@tienda.com / admin123\n• Cliente Demo: cliente@tienda.com / 123"
    for p in tb.text_frame.paragraphs:
        p.font.size = Pt(10.5)
        p.font.color.rgb = COLOR_TEXT_MAIN

    slide6.notes_slide.notes_text_frame.text = (
        "NOTAS DEL ORADOR:\n"
        "Aclarar al evaluador que el proyecto está diseñado con alta tolerancia a fallos: "
        "si una persona no tiene Docker, puede usar el script 'iniciar_demo.bat' en modo offline/portátil sin romper nada."
    )

    # ==========================================
    # SLIDE 7: GUÍA DE DEMOSTRACIÓN EN VIVO (4 ACCIONES)
    # ==========================================
    slide7 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide7, COLOR_BG_LIGHT)
    add_header(slide7, "Demostración Práctica", "Secuencia de Alto Impacto para la Defensa Técnica", 
               "4 pasos interactivos en vivo que comprueban la persistencia y la arquitectura ACID.")

    # 4 Columns of Interactive Actions
    act_w = Inches(2.7)
    act_gap = Inches(0.3)
    act_left = Inches(0.8)
    act_h = Inches(4.9)

    actions_data = [
        ("Acción 1: Crear Producto", "Sincronización Web -> BD", 
         "1. Abrir panel admin en http://localhost:8080/admin.html\n\n2. Crear producto de prueba con SKU.\n\n3. Ejecutar 'consultar_resumen_db.bat'.\n\nResultado: El nuevo producto aparece de inmediato en PostgreSQL con su ID serial."),
        
        ("Acción 2: Modificar Orden", "Flujo Transaccional", 
         "1. En el panel admin, cambiar una orden de 'Pendiente' a 'Enviado'.\n\n2. Consultar en psql:\nSELECT id, status FROM orders;\n\nResultado: El campo status se actualizó en disco con total consistencia."),
        
        ("Acción 3: Tolerancia a Fallos", "Prueba de Fuego", 
         "1. Ejecutar 'docker-detener.bat' (la web se cae por completo).\n\n2. Ejecutar 'docker-iniciar.bat'.\n\nResultado: Los datos persisten intactos gracias al volumen 'ecommerce_postgres_data'."),
        
        ("Acción 4: Telemetría en Vivo", "Monitoreo Integrado", 
         "1. Clic en la pastilla verde 'PostgreSQL 16 (En Vivo)' en la barra superior.\n\n2. Ver contadores en tiempo real y sincronización manual directa.")
    ]

    for idx, (title, sub, desc) in enumerate(actions_data):
        curr_left = act_left + (act_w + act_gap) * idx
        add_card(slide7, curr_left, Inches(1.8), act_w, act_h, title, sub)
        tb = slide7.shapes.add_textbox(curr_left + Inches(0.15), Inches(2.7), act_w - Inches(0.3), Inches(3.8))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.text = desc
        for p in tf.paragraphs:
            p.font.size = Pt(10)
            p.font.color.rgb = COLOR_TEXT_MAIN

    slide7.notes_slide.notes_text_frame.text = (
        "NOTAS DEL ORADOR:\n"
        "Esta lámina es tu guía durante la demostración en vivo con la laptop. "
        "Sigue el orden de las 4 acciones: 1) Creación de datos, 2) Actualización de pedidos, "
        "3) Prueba de apagado y reinicio sin pérdida de datos, y 4) Ventana modal de telemetría."
    )

    # ==========================================
    # SLIDE 8: PREGUNTAS TÍPICAS DEL JURADO (FAQ SENIOR)
    # ==========================================
    slide8 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide8, COLOR_BG_LIGHT)
    add_header(slide8, "Defensa Académica", "Banco de Preguntas Típicas del Jurado y Respuestas Senior", 
               "Argumentación técnica fundamentada para responder con máxima solvencia.")

    # 3 Horizontal Q&A Cards
    q_w = Inches(11.733)
    q_h = Inches(1.45)
    
    # Q1: PostgreSQL vs Mongo
    add_card(slide8, Inches(0.8), Inches(1.8), q_w, q_h, "¿Por qué PostgreSQL 16 y no una base NoSQL como MongoDB?", 
             "Justificación transaccional")
    tb1 = slide8.shapes.add_textbox(Inches(1.05), Inches(2.45), q_w - Inches(0.5), Inches(0.7))
    tb1.text_frame.word_wrap = True
    tb1.text_frame.text = "En comercio electrónico, la integridad del dinero y del inventario no es negociable. Las bases NoSQL aplican consistencia eventual, propensas a sobreventa de productos. PostgreSQL nos otorga propiedades ACID estrictas, transacciones atómicas y restricciones CHECK a nivel de motor."
    tb1.text_frame.paragraphs[0].font.size = Pt(10.5)

    # Q2: Concurrency & Overselling
    add_card(slide8, Inches(0.8), Inches(3.45), q_w, q_h, "¿Cómo evitan compras duplicadas si dos clientes compran la última unidad a la vez?", 
             "Aislamiento de transacciones")
    tb2 = slide8.shapes.add_textbox(Inches(1.05), Inches(4.1), q_w - Inches(0.5), Inches(0.7))
    tb2.text_frame.word_wrap = True
    tb2.text_frame.text = "Mediante transacciones atómicas con bloqueo a nivel de fila y la restricción nativa 'CHECK (stock >= 0)'. Al procesar el checkout, se descuenta stock condicionalmente; si la segunda transacción intenta descontar una unidad inexistente, el motor arroja un error y realiza un ROLLBACK automático."
    tb2.text_frame.paragraphs[0].font.size = Pt(10.5)

    # Q3: SQL Injection
    add_card(slide8, Inches(0.8), Inches(5.1), q_w, q_h, "¿Cómo protegen la base de datos contra ataques de Inyección SQL?", 
             "Seguridad en la capa de servicios")
    tb3 = slide8.shapes.add_textbox(Inches(1.05), Inches(5.75), q_w - Inches(0.5), Inches(0.7))
    tb3.text_frame.word_wrap = True
    tb3.text_frame.text = "La API utiliza exclusivamente consultas parametrizadas (Prepared Statements) con el driver oficial 'pg'. Ningún parámetro del usuario se concatena a la cadena SQL ($1, $2, etc.); PostgreSQL trata los argumentos estrictamente como valores literales y nunca como código ejecutable."
    tb3.text_frame.paragraphs[0].font.size = Pt(10.5)

    slide8.notes_slide.notes_text_frame.text = (
        "NOTAS DEL ORADOR:\n"
        "Si los evaluadores preguntan por seguridad o concurrencia, memoriza estas tres palabras clave: "
        "ACID, Transacciones Atómicas con Prepared Statements, y Restricciones CHECK en hardware/motor."
    )

    # ==========================================
    # SLIDE 9: CONCLUSIONES Y CIERRE (DARK MODE)
    # ==========================================
    slide9 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide9, COLOR_NAVY)
    
    # Accent top border
    accent_bar = slide9.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.12))
    accent_bar.fill.solid()
    accent_bar.fill.fore_color.rgb = COLOR_GREEN
    accent_bar.line.fill.background()

    # Content
    tb_c = slide9.shapes.add_textbox(Inches(1.0), Inches(1.2), Inches(11.333), Inches(4.8))
    tf_c = tb_c.text_frame
    tf_c.word_wrap = True

    p = tf_c.paragraphs[0]
    r = p.add_run()
    r.text = "CONCLUSIONES Y LOGROS DEL PROYECTO"
    r.font.name = "Arial"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = COLOR_BLUE

    p_t = tf_c.add_paragraph()
    p_t.space_before = Pt(8)
    r_t = p_t.add_run()
    r_t.text = "Solución de Grado Senior Lista para Producción"
    r_t.font.name = "Arial"
    r_t.font.size = Pt(28)
    r_t.font.bold = True
    r_t.font.color.rgb = COLOR_WHITE

    p_b = tf_c.add_paragraph()
    p_b.space_before = Pt(14)
    r_b = p_b.add_run()
    r_b.text = (
        "✔ Arquitectura Enterprise:\nDesacoplamiento total entre interfaz visual, micro-servicios y persistencia.\n\n"
        "✔ Integridad y Fidelidad Contable:\nModelo 3FN que preserva el historial de compras y calcula indicadores financieros en vivo.\n\n"
        "✔ Documentación y Respaldo Completo:\nManuales formales en Word (.docx), diagramas de arquitectura y repositorio público versionado en GitHub.\n\n"
        "✔ Experiencia de Usuario Superior:\nPanel administrativo completo con soporte de arquetipos visuales y telemetría en tiempo real."
    )
    r_b.font.name = "Arial"
    r_b.font.size = Pt(13)
    r_b.font.color.rgb = RGBColor(203, 213, 225)

    # Thank you footer card
    p_foot = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(5.8), Inches(11.333), Inches(1.1))
    p_foot.fill.solid()
    p_foot.fill.fore_color.rgb = RGBColor(30, 41, 59)
    p_foot.line.color.rgb = RGBColor(51, 65, 85)

    tb_f = slide9.shapes.add_textbox(Inches(1.3), Inches(5.95), Inches(10.7), Inches(0.8))
    tf_f = tb_f.text_frame
    tf_f.word_wrap = True
    p_f = tf_f.paragraphs[0]
    r_f1 = p_f.add_run()
    r_f1.text = "¡Muchas gracias por su atención!  "
    r_f1.font.bold = True
    r_f1.font.size = Pt(15)
    r_f1.font.color.rgb = COLOR_WHITE
    r_f2 = p_f.add_run()
    r_f2.text = "— Sesión de Preguntas y Respuestas Abierta\n"
    r_f2.font.size = Pt(14)
    r_f2.font.color.rgb = COLOR_GREEN
    r_f3 = p_f.add_run()
    r_f3.text = "Daniel Campos  •  daniel@tienda.com  •  https://github.com/LsCallejas/ecommerce-propuesta-visual"
    r_f3.font.size = Pt(11)
    r_f3.font.color.rgb = RGBColor(148, 163, 184)

    slide9.notes_slide.notes_text_frame.text = (
        "NOTAS DEL ORADOR:\n"
        "Agradecer sinceramente a los profesores y al jurado por su tiempo y evaluación, "
        "y dar paso formal a la ronda de preguntas invitándolos a consultar cualquier aspecto del código, "
        "de la base de datos o de la contenerización en Docker."
    )

    # Paths
    project_output = r"c:\Users\pc\OneDrive\Desktop\ecommerce\ecommerce_propuesta_visual\docs\presentations\PRESENTACION_ECOMMERCE_Y_BASE_DE_DATOS_DANIEL_CAMPOS.pptx"
    desktop_output = r"c:\Users\pc\OneDrive\Desktop\PRESENTACION_ECOMMERCE_Y_BASE_DE_DATOS_DANIEL_CAMPOS.pptx"
    
    os.makedirs(os.path.dirname(project_output), exist_ok=True)
    prs.save(project_output)
    print(f"[OK] Presentacion guardada en: {project_output}")
    
    shutil.copyfile(project_output, desktop_output)
    print(f"[OK] Presentacion copiada al Escritorio: {desktop_output}")

if __name__ == "__main__":
    build_presentation()
