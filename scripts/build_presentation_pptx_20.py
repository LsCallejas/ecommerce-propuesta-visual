import os
import shutil
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def build_20_slide_presentation():
    prs = Presentation()
    # 16:9 Widescreen standard dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette Definitions
    COLOR_NAVY = RGBColor(15, 23, 42)        # #0F172A (Deep Slate Navy)
    COLOR_BLUE = RGBColor(37, 99, 235)       # #2563EB (Primary Accent Blue)
    COLOR_GREEN = RGBColor(16, 185, 129)     # #10B981 (Success Emerald)
    COLOR_AMBER = RGBColor(245, 158, 11)     # #F59E0B (Highlight Gold)
    COLOR_BG_LIGHT = RGBColor(248, 250, 252) # #F8FAFC (Light slate background)
    COLOR_CARD_BG = RGBColor(255, 255, 255)  # Pure White
    COLOR_CARD_BORDER = RGBColor(226, 232, 240) # Slate 200
    COLOR_TEXT_MAIN = RGBColor(15, 23, 42)   # Slate 900
    COLOR_TEXT_MUTED = RGBColor(100, 116, 139) # Slate 500
    COLOR_WHITE = RGBColor(255, 255, 255)

    def set_slide_background(slide, color):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = color

    def add_header(slide, category_title, main_title, subtitle=""):
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
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1.5)
        
        tb = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.2), width - Inches(0.5), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        
        p = tf.paragraphs[0]
        r = p.add_run()
        r.text = title
        r.font.name = "Arial"
        r.font.size = Pt(13)
        r.font.bold = True
        r.font.color.rgb = COLOR_NAVY
        
        if subtitle:
            p_s = tf.add_paragraph()
            r_s = p_s.add_run()
            r_s.text = subtitle
            r_s.font.name = "Arial"
            r_s.font.size = Pt(9.5)
            r_s.font.color.rgb = COLOR_TEXT_MUTED
            
        return shape

    def populate_card_text(slide, left, top, width, height, body_text):
        tb = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(1.0), width - Inches(0.5), height - Inches(1.2))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.text = body_text
        for p in tf.paragraphs:
            p.font.size = Pt(10)
            p.font.name = "Arial"
            p.font.color.rgb = COLOR_TEXT_MAIN

    # =========================================================================
    # SLIDE 1: PORTADA EJECUTIVA OFICIAL (DARK NAVY)
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide1, COLOR_NAVY)
    accent_bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.12))
    accent_bar.fill.solid()
    accent_bar.fill.fore_color.rgb = COLOR_BLUE
    accent_bar.line.fill.background()

    tb = slide1.shapes.add_textbox(Inches(1.0), Inches(1.6), Inches(11.333), Inches(3.8))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p0 = tf.paragraphs[0]
    r0 = p0.add_run()
    r0.text = "PROYECTO DE GRADO & DEFENSA TÉCNICA OFICIAL — MASTER EDITION (20 DIAPOSITIVAS)"
    r0.font.bold = True
    r0.font.size = Pt(12)
    r0.font.color.rgb = COLOR_GREEN

    p1 = tf.add_paragraph()
    p1.space_before = Pt(10)
    r1 = p1.add_run()
    r1.text = "PLATAFORMA E-COMMERCE OFICIAL\nY PANEL ADMINISTRATIVO BACKOFFICE"
    r1.font.bold = True
    r1.font.size = Pt(34)
    r1.font.color.rgb = COLOR_WHITE

    p2 = tf.add_paragraph()
    p2.space_before = Pt(10)
    r2 = p2.add_run()
    r2.text = "Arquitectura Desacoplada de 3 Niveles • Motor PostgreSQL 16 (ACID) en 3FN • Docker Compose"
    r2.font.size = Pt(15)
    r2.font.color.rgb = RGBColor(148, 163, 184)

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
    r_p1.font.size = Pt(13)
    r_p1.font.color.rgb = COLOR_WHITE
    r_p2 = p_pres.add_run()
    r_p2.text = "Daniel Campos  |  "
    r_p2.font.bold = True
    r_p2.font.size = Pt(13)
    r_p2.font.color.rgb = COLOR_BLUE
    r_p3 = p_pres.add_run()
    r_p3.text = "Contacto: daniel@tienda.com\n"
    r_p3.font.size = Pt(11)
    r_p3.font.color.rgb = RGBColor(203, 213, 225)
    p_repo = tf_pres.add_paragraph()
    r_r1 = p_repo.add_run()
    r_r1.text = "Repositorio GitHub: "
    r_r1.font.bold = True
    r_r1.font.size = Pt(11)
    r_r1.font.color.rgb = COLOR_WHITE
    r_r2 = p_repo.add_run()
    r_r2.text = "https://github.com/LsCallejas/ecommerce-propuesta-visual  |  Octubre 2026"
    r_r2.font.size = Pt(11)
    r_r2.font.color.rgb = RGBColor(148, 163, 184)

    slide1.notes_slide.notes_text_frame.text = (
        "NOTAS DEL ORADOR:\n"
        "Buenos días/tardes estimados miembros del jurado evaluador y profesores. "
        "Mi nombre es Daniel Campos. A continuación presento la defensa técnica y arquitectónica "
        "de nuestra plataforma de comercio electrónico profesional, construida siguiendo estrictos "
        "principios de ingeniería de software con Docker y PostgreSQL 16."
    )

    # Helper for 3 columns layout
    def create_3_col_slide(slide_num, cat, title, sub, c1, c2, c3, notes):
        slide = prs.slides.add_slide(blank_layout)
        set_slide_background(slide, COLOR_BG_LIGHT)
        add_header(slide, cat, title, sub)
        col_w = Inches(3.64)
        gap = Inches(0.4)
        left_start = Inches(0.8)
        top_pos = Inches(1.8)
        card_h = Inches(4.9)

        cards = [c1, c2, c3]
        for idx, (t, s, b) in enumerate(cards):
            curr_left = left_start + (col_w + gap) * idx
            add_card(slide, curr_left, top_pos, col_w, card_h, t, s)
            populate_card_text(slide, curr_left, top_pos, col_w, card_h, b)
        
        slide.notes_slide.notes_text_frame.text = "NOTAS DEL ORADOR:\n" + notes
        return slide

    # Helper for 2 columns layout
    def create_2_col_slide(slide_num, cat, title, sub, c1, c2, notes):
        slide = prs.slides.add_slide(blank_layout)
        set_slide_background(slide, COLOR_BG_LIGHT)
        add_header(slide, cat, title, sub)
        col_w = Inches(5.66)
        gap = Inches(0.4)
        left_start = Inches(0.8)
        top_pos = Inches(1.8)
        card_h = Inches(4.9)

        cards = [c1, c2]
        for idx, (t, s, b) in enumerate(cards):
            curr_left = left_start + (col_w + gap) * idx
            add_card(slide, curr_left, top_pos, col_w, card_h, t, s)
            populate_card_text(slide, curr_left, top_pos, col_w, card_h, b)
        
        slide.notes_slide.notes_text_frame.text = "NOTAS DEL ORADOR:\n" + notes
        return slide

    # Helper for 4 cards 2x2 layout
    def create_4_grid_slide(slide_num, cat, title, sub, c1, c2, c3, c4, notes):
        slide = prs.slides.add_slide(blank_layout)
        set_slide_background(slide, COLOR_BG_LIGHT)
        add_header(slide, cat, title, sub)
        col_w = Inches(5.66)
        card_h = Inches(2.35)
        left1 = Inches(0.8)
        left2 = Inches(6.86)
        top1 = Inches(1.8)
        top2 = Inches(4.35)

        cards = [(left1, top1, c1), (left2, top1, c2), (left1, top2, c3), (left2, top2, c4)]
        for left, top, (t, s, b) in cards:
            add_card(slide, left, top, col_w, card_h, t, s)
            tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.85), col_w - Inches(0.4), card_h - Inches(0.95))
            tf = tb.text_frame
            tf.word_wrap = True
            tf.text = b
            for p in tf.paragraphs:
                p.font.size = Pt(9.5)
                p.font.color.rgb = COLOR_TEXT_MAIN

        slide.notes_slide.notes_text_frame.text = "NOTAS DEL ORADOR:\n" + notes
        return slide

    # =========================================================================
    # SLIDE 2: PLANTEAMIENTO DEL PROBLEMA Y JUSTIFICACIÓN
    # =========================================================================
    create_3_col_slide(2, "Contexto y Diagnóstico", "Planteamiento del Problema en el Comercio Electrónico",
        "Análisis de las vulnerabilidades y fallas críticas en los e-commerce tradicionales.",
        ("1. Inconsistencia de Inventario", "Peligro de Sobreventa (Overselling)",
         "• Bases NoSQL y Eventual Consistency:\nEn campañas con alta concurrencia, bases de datos sin transacciones ACID permiten que múltiples usuarios compren el último producto disponible.\n\n• Falta de Constraints a Nivel de Motor:\nDepender sólo de validaciones de frontend genera anomalías de stock negativo y reclamos de clientes."),
        ("2. Prototipos Efímeros y Frágiles", "Persistencia No Garantizada",
         "• Proyectos Basados en Memoria:\nMuchos desarrollos operan con mocks, arrays en memoria o SQLite, perdiendo todos los datos ante un reinicio del servidor.\n\n• Dependencia del Host:\nInstalaciones manuales de bases de datos ensucian el sistema operativo y generan el problema de 'en mi máquina sí funciona'."),
        ("3. Trazabilidad Contable Rota", "Corrupción de Historial Financiero",
         "• Modificación Retrógrada de Precios:\nAl no normalizar los ítems de venta, si un producto sube de precio hoy, se alteran los registros contables de las ventas realizadas el mes pasado.\n\n• Carencia de Auditoría de Rentabilidad:\nImposibilidad de conciliar en tiempo real el costo de inversión frente a las ganancias netas."),
        "Enfatizar que el problema no es sólo visual: el gran reto de un e-commerce real es la consistencia transaccional y la fidelidad de los libros contables ante compras simultáneas.")

    # =========================================================================
    # SLIDE 3: OBJETIVOS DEL PROYECTO
    # =========================================================================
    create_2_col_slide(3, "Propuesta Técnica", "Objetivos del Proyecto: General y Específicos",
        "Metas cuantitativas y cualitativas de ingeniería de software alcanzadas.",
        ("Objetivo General", "Arquitectura Enterprise Desacoplada",
         "Diseñar, implementar y validar una plataforma de comercio electrónico integral y panel administrativo backoffice, fundamentada en una arquitectura desacoplada de 3 niveles contenerizada bajo Docker y respaldada por PostgreSQL 16 con cumplimiento estricto de transaccionalidad ACID y normalización en Tercera Forma Normal (3FN)."),
        ("Objetivos Específicos", "Hitos de Ingeniería Cumplidos",
         "1. Modelar una base de datos relacional robusta (7 tablas e índices B-Tree) que resuelva compras concurrentes y congele precios históricos de transacción.\n\n2. Desarrollar un micro-backend REST API con Node.js Express y Connection Pooling eficiente para optimizar el uso de recursos.\n\n3. Construir una interfaz web responsiva multi-arquetipo en Vanilla JS capaz de metamorfosear su diseño en caliente según la identidad del negocio.\n\n4. Automatizar la orquestación e infraestructura mediante Docker Compose con volumen físico de datos inmutable."),
        "Detallar que los objetivos no se quedaron en papel: cada meta cuenta con artefactos verificables en el repositorio oficial y en los contenedores en ejecución.")

    # =========================================================================
    # SLIDE 4: TOPOLOGÍA DE 3 NIVELES
    # =========================================================================
    create_3_col_slide(4, "Arquitectura de Software", "Topología Desacoplada de 3 Niveles en Docker",
        "Aislamiento de responsabilidades mediante contenedores interconectados en red bridge.",
        ("Nivel 1: Capa Web (Frontend)", "ecommerce_web_app (Puerto 8080)",
         "• Nginx 1.25 Alpine Linux:\nSirve la aplicación estática al cliente y al administrador.\n\n• Reverse Proxy Interno:\nIntercepta peticiones dirigidas a '/api/*' y las redirige de forma transparente al micro-backend sin exponer puertos internos ni generar problemas de CORS."),
        ("Nivel 2: Capa API (Backend)", "ecommerce_api_service (Puerto 3000)",
         "• Node.js 20 LTS + Express:\nExpone endpoints RESTful con esquemas JSON estructurados.\n\n• Connection Pooling ('pg.Pool'):\nReutiliza un grupo cerrado de conexiones TCP hacia PostgreSQL, eliminando la sobrecarga de apertura de sockets por petición."),
        ("Nivel 3: Capa Datos (Database)", "ecommerce_postgres_db (Puerto 5432)",
         "• PostgreSQL 16.15 Alpine Linux:\nMotor relacional con transaccionalidad ACID.\n\n• Volumen Persistente 'postgres_data':\nPersistencia física desacoplada del ciclo de vida de los contenedores para evitar pérdida de datos ante reinicios."),
        "Explicar al jurado que Nginx actúa como fachada única. El cliente nunca se conecta directo a la base de datos ni conoce los puertos internos.")

    # =========================================================================
    # SLIDE 5: CAPA 1 - FRONTEND & UX/UI
    # =========================================================================
    create_3_col_slide(5, "Capa de Presentación", "Frontend Web Reactivo y Experiencia de Usuario (UI/UX)",
        "Desarrollo sin frameworks pesados, garantizando máxima velocidad y rendimiento 100/100.",
        ("Core Tecnológico Limpio", "Vanilla HTML5 / CSS3 / ES6+",
         "• Cero Dependencias Externas:\nSin peso de Node modules en el cliente ni hidratación pesada de React/Angular.\n\n• Carga Instantánea:\nTiempo de renderizado inicial inferior a 150 milisegundos gracias al empaquetado optimizado en Nginx Alpine."),
        ("Arquitectura de Estado Global", "Manejador 'Storage' con Sincronización",
         "• Patrón Pub/Sub Local:\nControl centralizado del catálogo, carrito de compras, sesión de usuario y tema activo.\n\n• Sincronización Híbrida Inteligente:\nComunica con la REST API de PostgreSQL en modo online y activa fallback seguro a localStorage si se desconecta la red."),
        ("Experiencia Interactiva", "Componentes y Telemetría en Vivo",
         "• Micro-Animaciones Modernas:\nDiseño visual premium con modo oscuro, transiciones CSS suaves y tarjetas interactivas.\n\n• Indicador de Conexión en Tiempo Real:\nPastilla interactiva que informa el estado del motor PostgreSQL al usuario y al evaluador."),
        "Mencionar que la decisión de usar Vanilla JS demuestra dominio fundamental del lenguaje, sin esconderse detrás de librerías de terceros.")

    # =========================================================================
    # SLIDE 6: MOTOR MULTI-ARQUETIPO
    # =========================================================================
    create_3_col_slide(6, "Personalización Dinámica", "Motor Multi-Arquetipo: Metamorfosis Visual en Caliente",
        "Capacidad de reconfigurar la identidad de marca de la tienda sin alterar una sola línea de código.",
        ("El Desafío de la Rigidez Visual", "Costos en Plantillas Tradicionales",
         "• Dependencia del Desarrollador:\nEn comercios comunes, cambiar de nicho tecnológico a moda o gastronomía exige reconstruir plantillas y tocar código HTML/CSS.\n\n• Inconsistencia de Marca:\nFalta de control centralizado sobre paletas de colores y tipografías."),
        ("Arquitectura con Variables CSS", "CSS Custom Properties Dinámicas",
         "• Tokens de Diseño en Caliente:\nEl sistema inyecta dinámicamente variables globales (:root) que controlan: --primary-color, --accent-glow, --font-family y --border-radius.\n\n• Arquetipos Preconfigurados:\nModerno / Tech, Boutique / Moda de Lujo, Gourmet / Café de Especialidad."),
        ("Persistencia en PostgreSQL", "Tabla 'store_config'",
         "• Sincronización en Base de Datos:\nCualquier cambio de estilo, logotipo o banner realizado en el panel administrativo se persiste inmediatamente en PostgreSQL.\n\n• Propagación Inmediata:\nTodos los clientes que navegan la tienda reciben la nueva imagen sin recargar archivos estáticos."),
        "Destacar la versatilidad de negocio: una misma instalación sirve para vender tecnología, ropa de alta gama o productos gourmet con un solo clic.")

    # =========================================================================
    # SLIDE 7: CAPA 2 - MICRO-BACKEND REST API
    # =========================================================================
    create_3_col_slide(7, "Capa de Servicios", "Micro-Backend REST API con Node.js y Express",
        "Controlador transaccional liviano, modular y diseñado para alta concurrencia.",
        ("Estructura de Endpoints", "Arquitectura RESTful Estandarizada",
         "• GET /api/health: Diagnóstico en vivo de la conexión con PostgreSQL y métricas del sistema.\n\n• GET / POST / DELETE /api/products: CRUD completo del inventario con validaciones.\n\n• GET / POST / PATCH /api/orders: Registro de compras y cambio de estado de pedidos."),
        ("Manejo de Errores y Middleware", "Resiliencia Operativa",
         "• Middlewares Centralizados:\nParsing automático de cuerpos JSON, cabeceras de seguridad CORS y trazabilidad de peticiones mediante logs.\n\n• Códigos de Estado HTTP Correctos:\nRespuestas estandarizadas (200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Internal Error)."),
        ("Aislamiento en Red Docker", "Seguridad por Contención",
         "• Puerto 3000 No Expuesto:\nLa API sólo escucha dentro de la red privada 'ecommerce_network'.\n\n• Acceso Exclusivo Nginx:\nÚnicamente el contenedor web puede comunicarse con la API, previniendo ataques externos directos al backend."),
        "Punto clave: la API no tiene estado (stateless), lo que facilita escalarla horizontalmente detrás de un balanceador de carga si la demanda crece.")

    # =========================================================================
    # SLIDE 8: SEGURIDAD Y CONNECTION POOLING
    # =========================================================================
    create_3_col_slide(8, "Seguridad y Rendimiento", "Optimización de Conexiones y Seguridad de Datos",
        "Gestión eficiente de recursos y protección exhaustiva contra vectores de ataque.",
        ("Connection Pooling ('pg.Pool')", "Reutilización de Hilos TCP",
         "• Problema Tradicional:\nAbrir y cerrar una conexión TCP a la base de datos por cada clic consume ciclos de CPU y satura la RAM del motor.\n\n• Nuestra Solución:\nPool compartido de máximo 20 conexiones persistentes que se asignan y liberan en milisegundos, soportando miles de usuarios concurrentes."),
        ("Blindaje contra SQL Injection", "Prepared Statements Obligatorios",
         "• Consultas Parametrizadas:\nNingún dato introducido por el cliente se concatena en las sentencias SQL. Se utiliza la sintaxis $1, $2, $3 con argumentos separados.\n\n• Tipado Estricto:\nPostgreSQL analiza la estructura léxica de la consulta antes de enlazar los valores, neutralizando inyecciones maliciosas."),
        ("Control de Acceso RBAC y Hash", "Protección de Identidades",
         "• Roles Estrictos (RBAC):\nSeparación tajante entre 'admin' (Daniel Campos) y 'cliente' mediante restricciones CHECK.\n\n• Cifrado de Contraseñas:\nHashes criptográficos Bcrypt unidireccionales que garantizan la confidencialidad absoluta de las credenciales."),
        "Resaltar que el Connection Pooling es el sello distintivo de una arquitectura de nivel Senior frente a proyectos estudiantiles que crean conexiones infinitas.")

    # =========================================================================
    # SLIDE 9: CAPA 3 - POSTGRESQL 16 Y ACID
    # =========================================================================
    create_3_col_slide(9, "Persistencia de Datos", "Capa de Base de Datos: Justificación Técnica de PostgreSQL 16",
        "Por qué un motor relacional transaccional es la elección idónea frente a NoSQL.",
        ("Garantías ACID Innegociables", "Propiedades del Núcleo Transaccional",
         "• Atomicidad (A): Toda la compra se procesa completa o no se procesa nada (ROLLBACK).\n\n• Consistencia (C): Ningún pedido viola claves foráneas o stock negativo.\n\n• Aislamiento (I): Transacciones concurrentes no interfieren entre sí.\n\n• Durabilidad (D): Los datos se escriben a disco en el volumen de Docker."),
        ("Comparativa: PostgreSQL vs NoSQL", "¿Por qué descartamos MongoDB?",
         "• Consistencia Eventual NoSQL:\nEn compras masivas, MongoDB puede registrar dos órdenes sobre un mismo producto antes de sincronizar réplicas.\n\n• Rigor Relacional PostgreSQL:\nLas ventas exigen balance contable estricto, integridad referencial y relaciones matemáticas N:M que PostgreSQL resuelve de forma nativa."),
        ("Motor PostgreSQL 16 Alpine", "Eficiencia y Portabilidad",
         "• Versión 16.15 Oficial:\nÚltima generación con mejoras de rendimiento en índices B-Tree y consultas paralelas.\n\n• Imagen Alpine Linux:\nContenedor ultraligero de apenas 80 MB con superficie mínima de ataque para mayor seguridad."),
        "Explicar que la integridad del dinero y el inventario requiere ACID. Usar NoSQL en checkout financiero es un antipatrón en la industria.")

    # =========================================================================
    # SLIDE 10: NORMALIZACIÓN Y 3FN
    # =========================================================================
    create_3_col_slide(10, "Modelado Relacional", "Normalización de Base de Datos: Aplicación de la 3FN",
        "Eliminación metódica de redundancias y prevención de anomalías de actualización.",
        ("Primera Forma Normal (1FN)", "Atomicidad y Unicidad",
         "• Atributos Atómicos:\nCada columna almacena un único valor indivisible (se eliminaron listas o strings concatenados).\n\n• Claves Primarias Únicas:\nCada registro se identifica unívocamente mediante claves primarias (id SERIAL o VARCHAR unívoco).\n\n• Sin grupos repetitivos de columnas."),
        ("Segunda Forma Normal (2FN)", "Dependencia Funcional Total",
         "• Cumplimiento de 1FN previo.\n\n• Dependencia Total de la PK:\nTodos los atributos no clave dependen en su totalidad de la clave primaria completa.\n\n• Separación de Entidades:\nLos datos de proveedores, productos y compras se dividieron en tablas independientes."),
        ("Tercera Forma Normal (3FN)", "Sin Dependencias Transitivas",
         "• Cumplimiento de 2FN previo.\n\n• Eliminación de Transitividad:\nNingún campo no clave depende de otro campo no clave. (Ej. el nombre del proveedor no reside en 'products', sino en 'suppliers' mediante supplier_id).\n\n• Cero redundancias y anomalías de borrado."),
        "Demostrar al jurado que el esquema fue diseñado aplicando la teoría de bases de datos de Codd, asegurando pureza estructural.")

    # =========================================================================
    # SLIDE 11: DICCIONARIO - CATÁLOGO Y PROVEEDORES
    # =========================================================================
    create_3_col_slide(11, "Diccionario de Datos", "Estructura de Tablas: Catálogo y Cadena de Suministro",
        "Campos, restricciones de integridad y relaciones foráneas de inventario.",
        ("Tabla 'products'", "Catálogo Central y Existencias",
         "• id: SERIAL PRIMARY KEY.\n• sku: VARCHAR(60) UNIQUE (Código de barras).\n• slug: VARCHAR(200) UNIQUE (URL amigable).\n• cost_price: DECIMAL(10,2) CHECK >= 0.\n• sale_price: DECIMAL(10,2) CHECK > 0.\n• stock: INT DEFAULT 0 CHECK (stock >= 0).\n• supplier_id: VARCHAR(50) REFERENCES suppliers(id) ON DELETE SET NULL."),
        ("Tabla 'suppliers'", "Fabricantes y Distribuidores",
         "• id: VARCHAR(50) PRIMARY KEY.\n• name: VARCHAR(200) NOT NULL (Nombre comercial).\n• contact_person: VARCHAR(150) (Representante).\n• terms: VARCHAR(100) (Crédito 30 días, Contado).\n• rating: VARCHAR(50) (Calificación del proveedor).\n• total_invested: DECIMAL(12,2) (Inversión acumulada)."),
        ("Reglas de Negocio en Motor", "Integridad Referencial Estricta",
         "• Protección de Stock:\nLa restricción CHECK (stock >= 0) impide que un bug de código guarde existencias negativas en la base de datos.\n\n• Desvinculación Segura:\nON DELETE SET NULL asegura que si se borra un proveedor, sus productos siguen existiendo en el catálogo."),
        "Mencionar la doble contabilidad en 'products': guardar cost_price y sale_price permite calcular márgenes de ganancia reales en todo momento.")

    # =========================================================================
    # SLIDE 12: DICCIONARIO - VENTAS Y FINANZAS
    # =========================================================================
    create_3_col_slide(12, "Diccionario de Datos", "Estructura de Tablas: Ventas, Compras y Detalles",
        "Resolución de la relación N:M y congelación de precios históricos.",
        ("Tabla 'orders'", "Cabecera de Ventas a Clientes",
         "• id: VARCHAR(50) PRIMARY KEY (Ej. ORD-2026-001).\n• customer_name, customer_email, phone, address.\n• subtotal, shipping, total: DECIMAL(10,2).\n• status: VARCHAR(30) CHECK ('Pendiente', 'En Preparación', 'Enviado', 'Entregado').\n• payment_method: VARCHAR(80) (Pago Móvil, Zelle, Transferencia)."),
        ("Tabla 'order_items'", "Detalle de Venta (Relación N:M)",
         "• id: SERIAL PRIMARY KEY.\n• order_id: VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE.\n• product_id: INT REFERENCES products(id) ON DELETE SET NULL.\n• quantity: INT CHECK (quantity > 0).\n• unit_price: DECIMAL(10,2) NOT NULL.\n• subtotal: DECIMAL(10,2) NOT NULL."),
        ("Tabla 'purchases'", "Lotes de Abastecimiento",
         "• id: VARCHAR(50) PRIMARY KEY (Ej. INV-2026-001).\n• supplier_id: VARCHAR(50) REFERENCES suppliers(id) ON DELETE CASCADE.\n• units: INT CHECK (units > 0).\n• amount: DECIMAL(12,2) CHECK (amount >= 0).\n• receipt: VARCHAR(80) (Número de factura fiscal)."),
        "Hacer énfasis en 'order_items.unit_price': este campo congela el precio histórico. Si el producto sube mañana, la venta pasada no se corrompe.")

    # =========================================================================
    # SLIDE 13: VISTA ANALÍTICA v_inventory_financials
    # =========================================================================
    create_3_col_slide(13, "Inteligencia de Negocio", "Vista Analítica SQL: 'v_inventory_financials'",
        "Auditoría financiera automatizada y cálculo dinámico de márgenes comerciales.",
        ("El Concepto de Vista SQL", "Cálculo en Caliente sin Redundancia",
         "• Sin Duplicación de Datos:\nEn lugar de recalcular márgenes con bucles lentos en el servidor web, PostgreSQL calcula la vista instantáneamente al ser consultada.\n\n• Unificación de Entidades:\nCombina en tiempo real las tablas 'products' y 'suppliers' mediante un LEFT JOIN eficiente."),
        ("Fórmulas Matemáticas", "Lógica Financiera Integrada",
         "• Ganancia Unitaria:\nunit_profit = (p.sale_price - p.cost_price)\n\n• Margen Comercial Porcentual:\nmargin_% = ROUND(((sale_price - cost_price) / sale_price) * 100, 2)\n\n• Inventario Valorado:\ntotal_cost = (cost_price * stock)\ntotal_revenue = (sale_price * stock)"),
        ("Impacto en la Toma de Decisiones", "Reportes Gerenciales Instantáneos",
         "• Consulta Directa:\nSELECT * FROM v_inventory_financials ORDER BY margin_percentage DESC;\n\n• Utilidad para el Administrador:\nDaniel Campos puede saber de inmediato cuáles productos tienen el mejor retorno de inversión (ROI) y cuánto capital tiene inmovilizado."),
        "Explicar que esta vista demuestra que la base de datos no es pasiva, sino que actúa como motor analítico de toma de decisiones.")

    # =========================================================================
    # SLIDE 14: ÍNDICES B-TREE Y RENDIMIENTO
    # =========================================================================
    create_3_col_slide(14, "Optimización de Rendimiento", "Estrategia de Indexación B-Tree: Complejidad O(log n)",
        "Garantizando tiempos de respuesta ultrarrápidos aun con cientos de miles de registros.",
        ("Búsqueda Secuencial vs B-Tree", "El Salto de O(n) a O(log n)",
         "• Sin Índices (Table Scan O(n)):\nPostgreSQL debe revisar registro por registro en el disco, provocando latencia inaceptable cuando el catálogo crece.\n\n• Con Índices B-Tree (O(log n)):\nCrea un árbol balanceado que permite ubicar cualquier fila en solo 3 o 4 lecturas de nodo."),
        ("Los 5 Índices Implementados", "Optimización Específica por Módulo",
         "1. idx_products_sku: Búsqueda instantánea en almacén por SKU.\n2. idx_products_category: Filtrado veloz en catálogo.\n3. idx_orders_status: Consulta ágil de órdenes pendientes.\n4. idx_orders_date: Reportes cronológicos de ventas.\n5. idx_users_email: Autenticación de login en milisegundos."),
        ("Resultados en Escalabilidad", "Validación en Producción",
         "• Tiempos de Búsqueda:\nReducción del tiempo de respuesta de consultas complejas a menos de 5 milisegundos.\n\n• Mantenimiento Ligero:\nPostgreSQL rebalancea los árboles B-Tree automáticamente en cada inserción o modificación."),
        "Destacar que la indexación fue pensada con métricas reales: sku, category y email son los campos con mayor volumen de consultas WHERE.")

    # =========================================================================
    # SLIDE 15: FLUJO TRANSACCIONAL DE CHECKOUT
    # =========================================================================
    create_4_grid_slide(15, "Flujo de Datos", "Diagrama de Secuencia: Transaccionalidad en el Checkout",
        "El ciclo de vida completo desde el carrito de compras hasta el COMMIT en PostgreSQL.",
        ("Paso 1: Checkout en Frontend", "Validación en el Navegador",
         "El cliente confirma la compra en el carrito reactivo. JavaScript valida campos obligatorios (nombre, email, dirección, método de pago) y emite un POST asíncrono a '/api/orders'."),
        ("Paso 2: Enrutamiento Nginx & Express", "Proxy Seguro y Sanitización",
         "Nginx recibe la petición en el puerto 8080 y la redirige internamente a la API en el puerto 3000. Express sanitiza los parámetros y solicita una conexión al Connection Pool."),
        ("Paso 3: Bloque Transaccional ACID", "Ejecución Atómica en Base de Datos",
         "Se inicia un bloque BEGIN en PostgreSQL:\n1. INSERT en tabla 'orders'.\n2. INSERT de líneas en 'order_items'.\n3. UPDATE en 'products' descontando stock: (stock = stock - qty)."),
        ("Paso 4: Validación y COMMIT / ROLLBACK", "Garantía de Cero Overselling",
         "Si el stock es suficiente, se ejecuta COMMIT y la orden queda confirmada. Si el stock no alcanza, la restricción CHECK (stock >= 0) dispara un ROLLBACK automático sin alterar nada."),
        "Este diagrama de secuencia es el argumento maestro para explicar cómo se resuelven compras concurrentes sin sobreventa de productos.")

    # =========================================================================
    # SLIDE 16: INFRAESTRUCTURA DOCKER & PERSISTENCIA
    # =========================================================================
    create_3_col_slide(16, "DevOps e Infraestructura", "Contenerización con Docker Compose y Red Bridge",
        "Aislamiento de servicios, paridad de entornos y persistencia física en volumen.",
        ("Orquestación Multi-Contenedor", "docker-compose.yml",
         "• 3 Servicios Coordinados:\n'db' (PostgreSQL 16), 'api' (Express Node.js 20) y 'web' (Nginx 1.25 Alpine).\n\n• Políticas de Resiliencia:\n'restart: unless-stopped' y healthchecks automáticos con 'pg_isready' y endpoints HTTP."),
        ("Red Privada 'ecommerce_network'", "Aislamiento Bridge Seguro",
         "• Resolución DNS Interna:\nLos contenedores se comunican por nombre de servicio ('db:5432', 'api:3000') sin exponer IPs dinámicas.\n\n• Seguridad Perimetral:\nÚnicamente los puertos necesarios (8080 y 5432) se enlazan con el sistema operativo host."),
        ("Persistencia en Volumen Físico", "'ecommerce_postgres_data'",
         "• Desacoplamiento de Ciclo de Vida:\nLos datos no residen dentro del contenedor efímero, sino en un volumen Docker gestionado en el almacenamiento físico del host.\n\n• Inmunidad ante Reinicios:\n'docker compose down' puede destruir contenedores, pero la base de datos permanece intacta."),
        "Subrayar que el uso de Docker Compose garantiza paridad absoluta: el proyecto corre idéntico en Windows, Linux, Mac o servidores cloud.")

    # =========================================================================
    # SLIDE 17: GUÍA DE DESPLIEGUE EN WINDOWS (WSL 2)
    # =========================================================================
    create_4_grid_slide(17, "Manual de Puesta en Marcha", "Guía Paso a Paso para Despliegue en Windows",
        "Instrucciones para que cualquier evaluador pueda ejecutar el proyecto desde cero.",
        ("Paso 1: Habilitar WSL 2", "Kernel Linux en Windows",
         "1. Abrir PowerShell como Administrador.\n2. Ejecutar: wsl --install\n3. Reiniciar el equipo y definir usuario/password de Ubuntu.\n4. Verificar con 'wsl -l -v' que Ubuntu opere en versión 2."),
        ("Paso 2: Disponer de Docker", "Entorno de Ejecución",
         "• Opción A (Recomendada): Instalar Docker Desktop con la opción 'Use WSL 2 based engine' activada.\n• Opción B: Instalar Docker nativo en Ubuntu WSL (sudo apt install docker.io docker-compose)."),
        ("Paso 3: Inicio en 1 Clic", "docker-iniciar.bat",
         "Hacer doble clic en 'docker-iniciar.bat'. El script híbrido detecta el motor de Docker, levanta los servicios, inicializa la base de datos y abre el navegador en http://localhost:8080."),
        ("Paso 4: Accesos y Credenciales", "Pruebas de Acceso",
         "• Tienda: http://localhost:8080\n• Admin: http://localhost:8080/admin.html\n• Admin: admin@tienda.com / admin123\n• Cliente: cliente@tienda.com / 123"),
        "Aclarar que el script batch detecta automáticamente si Docker está instalado en Windows nativo o dentro de WSL, evitando errores de PATH.")

    # =========================================================================
    # SLIDE 18: DEMOSTRACIÓN PRÁCTICA EN VIVO
    # =========================================================================
    create_4_grid_slide(18, "Demostración Práctica", "Secuencia de Alto Impacto para la Defensa Técnica",
        "4 acciones cronometradas en vivo que comprueban la reactividad y persistencia real.",
        ("Acción 1: Creación de Producto", "Sincronización Web -> SQL",
         "1. En el panel admin crear un producto con SKU.\n2. Ejecutar 'consultar_resumen_db.bat'.\nResultado: El nuevo producto aparece instantáneamente en PostgreSQL con su ID serial y existencia."),
        ("Acción 2: Modificación de Orden", "Trazabilidad Transaccional",
         "1. En panel admin cambiar una orden de 'Pendiente' a 'Enviado'.\n2. Consultar en psql:\nSELECT id, status FROM orders;\nResultado: El campo status se actualizó en disco con total fidelidad."),
        ("Acción 3: Prueba de Fuego", "Tolerancia a Fallos y Persistencia",
         "1. Ejecutar 'docker-detener.bat' (la web se cae).\n2. Ejecutar 'docker-iniciar.bat'.\nResultado: Toda la información creada sigue presente gracias al volumen 'ecommerce_postgres_data'."),
        ("Acción 4: Telemetría y Vista SQL", "Inspección en Caliente",
         "1. Clic en la pastilla 'PostgreSQL 16 (En Vivo)' en la barra superior para ver contadores.\n2. Ejecutar en SQL:\nSELECT * FROM v_inventory_financials; para mostrar el reporte financiero calculado."),
        "Esta lámina sirve como 'hoja de ruta' durante la defensa frente a los profesores para guiar la demostración en vivo paso a paso.")

    # =========================================================================
    # SLIDE 19: FAQ SENIOR ANTE EL JURADO
    # =========================================================================
    create_3_col_slide(19, "Defensa Académica", "Banco de Preguntas Típicas del Jurado y Respuestas Senior",
        "Argumentación técnica fundamentada para responder con máxima solvencia.",
        ("¿Por qué PostgreSQL y no NoSQL?", "Integridad vs Consistencia Eventual",
         "\"En comercio electrónico, la integridad del dinero y del inventario no es negociable. Las bases NoSQL aplican consistencia eventual, propensas a sobreventa (overselling). PostgreSQL nos brinda transacciones ACID completas, restricciones CHECK y claves foráneas estrictas.\""),
        ("¿Cómo evitan compras duplicadas?", "Aislamiento de Fila y Locks",
         "\"Mediante transacciones atómicas con bloqueo de fila y la restricción nativa CHECK (stock >= 0). Si dos clientes intentan comprar la última unidad al mismo tiempo, el motor rechaza la segunda operación inmediatamente y genera un ROLLBACK automático sin tocar el stock.\""),
        ("¿Cómo se protegen de Inyección SQL?", "Prepared Statements",
         "\"En la API Node.js Express utilizamos exclusivamente consultas parametrizadas con el driver oficial 'pg'. Ningún dato del usuario se concatena en la cadena SQL ($1, $2, etc.); PostgreSQL trata los argumentos estrictamente como valores literales sanitizados.\""),
        "Memorizar las palabras clave: ACID, transacciones atómicas con Prepared Statements y restricciones CHECK en el motor.")

    # =========================================================================
    # SLIDE 20: CONCLUSIONES Y CIERRE (DARK NAVY)
    # =========================================================================
    slide20 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide20, COLOR_NAVY)
    accent_bar = slide20.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.12))
    accent_bar.fill.solid()
    accent_bar.fill.fore_color.rgb = COLOR_GREEN
    accent_bar.line.fill.background()

    tb_c = slide20.shapes.add_textbox(Inches(1.0), Inches(1.1), Inches(11.333), Inches(4.7))
    tf_c = tb_c.text_frame
    tf_c.word_wrap = True

    p = tf_c.paragraphs[0]
    r = p.add_run()
    r.text = "CONCLUSIONES, ROADMAP A PRODUCCIÓN Y CIERRE"
    r.font.name = "Arial"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = COLOR_BLUE

    p_t = tf_c.add_paragraph()
    p_t.space_before = Pt(8)
    r_t = p_t.add_run()
    r_t.text = "Plataforma de Comercio Electrónico de Grado Enterprise"
    r_t.font.name = "Arial"
    r_t.font.size = Pt(28)
    r_t.font.bold = True
    r_t.font.color.rgb = COLOR_WHITE

    p_b = tf_c.add_paragraph()
    p_b.space_before = Pt(14)
    r_b = p_b.add_run()
    r_b.text = (
        "✔ Arquitectura Modular Validada:\nDesacoplamiento estricto de 3 niveles con Nginx, Express y PostgreSQL 16.\n\n"
        "✔ Cumplimiento Riguroso de la 3FN:\nCero redundancias, integridad referencial protegida y congelación contable de precios históricos.\n\n"
        "✔ Portabilidad y Persistencia Demostrada:\nOrquestación contenerizada con volumen inmutable y scripts de ejecución en 1 clic en Windows/WSL.\n\n"
        "✔ Roadmap a Producción:\nDespliegue preparado para la nube (AWS EC2 / DigitalOcean), certificados SSL con Let's Encrypt y CI/CD en GitHub."
    )
    r_b.font.name = "Arial"
    r_b.font.size = Pt(12)
    r_b.font.color.rgb = RGBColor(203, 213, 225)

    p_foot = slide20.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(5.8), Inches(11.333), Inches(1.1))
    p_foot.fill.solid()
    p_foot.fill.fore_color.rgb = RGBColor(30, 41, 59)
    p_foot.line.color.rgb = RGBColor(51, 65, 85)

    tb_f = slide20.shapes.add_textbox(Inches(1.3), Inches(5.95), Inches(10.7), Inches(0.8))
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

    slide20.notes_slide.notes_text_frame.text = (
        "NOTAS DEL ORADOR:\n"
        "Agradecer a los profesores por su tiempo y evaluación, y dar paso formal a la ronda de preguntas, "
        "invitándolos a consultar cualquier aspecto del código, la base de datos o la contenerización."
    )

    # Save outputs
    project_output = r"c:\Users\pc\OneDrive\Desktop\ecommerce\ecommerce_propuesta_visual\docs\presentations\PRESENTACION_ECOMMERCE_Y_BASE_DE_DATOS_DANIEL_CAMPOS.pptx"
    desktop_output = r"c:\Users\pc\OneDrive\Desktop\PRESENTACION_ECOMMERCE_Y_BASE_DE_DATOS_DANIEL_CAMPOS.pptx"

    os.makedirs(os.path.dirname(project_output), exist_ok=True)
    prs.save(project_output)
    print(f"[OK] Presentacion maestra (20 diapositivas) guardada en: {project_output}")

    shutil.copyfile(project_output, desktop_output)
    print(f"[OK] Presentacion maestra copiada al Escritorio: {desktop_output}")

if __name__ == "__main__":
    build_20_slide_presentation()
