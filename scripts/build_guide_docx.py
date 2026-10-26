import os
import shutil
import docx
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_shading(cell, color_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=140, bottom=140, left=180, right=180):
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

def add_callout(doc, text_content, title="INFORMACIÓN CLAVE", color_hex="2563EB", bg_hex="F0F7FF"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    tbl.columns[0].width = Inches(6.5)
    
    cell = tbl.cell(0, 0)
    set_cell_shading(cell, bg_hex)
    set_cell_margins(cell, top=160, bottom=160, left=200, right=200)
    
    # Left colored border only
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'''<w:tcBorders {nsdecls("w")}>
        <w:top w:val="none"/>
        <w:left w:val="single" w:sz="24" w:space="0" w:color="{color_hex}"/>
        <w:bottom w:val="none"/>
        <w:right w:val="none"/>
    </w:tcBorders>''')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(4)
    run_title = p.add_run(f"📌 {title}\n")
    run_title.bold = True
    run_title.font.name = "Calibri"
    run_title.font.size = Pt(10.5)
    run_title.font.color.rgb = RGBColor.from_string(color_hex)
    
    run_body = p.add_run(text_content)
    run_body.font.name = "Calibri"
    run_body.font.size = Pt(9.5)
    run_body.font.color.rgb = RGBColor(30, 41, 59)
    doc.add_paragraph()

def add_code_block(doc, code_str):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False
    tbl.columns[0].width = Inches(6.5)
    cell = tbl.cell(0, 0)
    set_cell_shading(cell, "0F172A")
    set_cell_margins(cell, top=120, bottom=120, left=180, right=180)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    run = p.add_run(code_str)
    run.font.name = "Consolas"
    run.font.size = Pt(9)
    run.font.color.rgb = RGBColor(241, 245, 249)
    doc.add_paragraph()

print("Generando documento oficial Word...")
doc = docx.Document()

# Margins
for s in doc.sections:
    s.top_margin = Cm(2.54)
    s.bottom_margin = Cm(2.54)
    s.left_margin = Cm(2.54)
    s.right_margin = Cm(2.54)

# Headers / Footers
header = doc.sections[0].header
hp = header.paragraphs[0]
hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
hrun = hp.add_run("Plataforma E-Commerce — Guía Maestra de Despliegue y Base de Datos (Daniel Campos)")
hrun.font.name = "Calibri"
hrun.font.size = Pt(8.5)
hrun.font.color.rgb = RGBColor(148, 163, 184)

footer = doc.sections[0].footer
fp = footer.paragraphs[0]
fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
frun = fp.add_run("PostgreSQL 16 (ACID) • Docker Compose • Arquitectura de 3 Niveles • Octubre 2026")
frun.font.name = "Calibri"
frun.font.size = Pt(8.5)
frun.font.color.rgb = RGBColor(148, 163, 184)

# ==================== PORTADA ====================
title_p = doc.add_paragraph()
title_p.paragraph_format.space_before = Pt(36)
title_p.paragraph_format.space_after = Pt(8)
trun = title_p.add_run("GUÍA MAESTRA DE INSTALACIÓN, DESPLIEGUE EN WINDOWS (WSL + DOCKER) Y DEFENSA DE BASE DE DATOS")
trun.font.name = "Calibri"
trun.font.size = Pt(22)
trun.bold = True
trun.font.color.rgb = RGBColor(15, 23, 42)

sub_p = doc.add_paragraph()
sub_p.paragraph_format.space_after = Pt(16)
srun = sub_p.add_run("Manual Paso a Paso desde Cero para Usuarios y Jurado Evaluador • Ecosistema PostgreSQL 16")
srun.font.name = "Calibri"
srun.font.size = Pt(13)
srun.font.color.rgb = RGBColor(37, 99, 235)

# Meta Table
tbl_meta = doc.add_table(rows=5, cols=2)
tbl_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
tbl_meta.autofit = False
set_table_borders(tbl_meta, color="CBD5E1")
tbl_meta.columns[0].width = Inches(2.2)
tbl_meta.columns[1].width = Inches(4.3)

meta_data = [
    ("Autor / Administrador:", "Daniel Campos (daniel@tienda.com)"),
    ("Motor de Base de Datos:", "PostgreSQL 16.15 (Alpine Linux) — Relacional ACID en 3FN"),
    ("Plataforma & Orquestación:", "Docker Multi-Contenedor sobre WSL 2 (Windows Subsystem for Linux)"),
    ("Repositorio Oficial GitHub:", "https://github.com/LsCallejas/ecommerce-propuesta-visual"),
    ("Fecha y Versión:", "Octubre 2026 — Versión Oficial 2.0")
]

for idx, (label, val) in enumerate(meta_data):
    row = tbl_meta.rows[idx]
    make_row_cant_split(row)
    c0 = row.cells[0]
    c1 = row.cells[1]
    set_cell_shading(c0, "F8FAFC")
    set_cell_shading(c1, "FFFFFF")
    set_cell_margins(c0)
    set_cell_margins(c1)
    
    p0 = c0.paragraphs[0]
    r0 = p0.add_run(label)
    r0.bold = True
    r0.font.name = "Calibri"
    r0.font.size = Pt(9.5)
    r0.font.color.rgb = RGBColor(51, 65, 85)
    
    p1 = c1.paragraphs[0]
    r1 = p1.add_run(val)
    r1.font.name = "Calibri"
    r1.font.size = Pt(9.5)
    r1.font.color.rgb = RGBColor(15, 23, 42)

doc.add_paragraph()
add_callout(doc, 
    "Este documento contiene todas las instrucciones necesarias para que cualquier persona configure el entorno desde cero en Windows, ejecute el proyecto con 1 solo clic y conozca a fondo la arquitectura de datos para presentarla con éxito ante profesores y evaluadores.",
    title="PROPÓSITO DEL DOCUMENTO",
    color_hex="10B981", bg_hex="ECFDF5")

doc.add_page_break()

# ==================== PARTE 1: INSTALACIÓN EN WINDOWS ====================
h1 = doc.add_heading(level=1)
h1_run = h1.add_run("1. Guía de Instalación Paso a Paso en Windows desde Cero")
h1_run.font.name = "Calibri"
h1_run.font.size = Pt(16)
h1_run.bold = True
h1_run.font.color.rgb = RGBColor(15, 23, 42)

p_intro = doc.add_paragraph(
    "Para garantizar la misma experiencia de ejecución que en un servidor de producción en la nube, el proyecto se ejecuta mediante contenedores Docker orquestados. A continuación se detallan los pasos necesarios para habilitar el entorno en cualquier equipo con Windows 10 u 11."
)
p_intro.paragraph_format.space_after = Pt(10)

# 1.1 Requisitos
h2 = doc.add_heading(level=2)
h2_run = h2.add_run("1.1 Requisitos Mínimos del Sistema")
h2_run.font.name = "Calibri"
h2_run.font.size = Pt(13)
h2_run.bold = True
h2_run.font.color.rgb = RGBColor(37, 99, 235)

doc.add_paragraph("• Windows 10 (versión 2004 o superior, compilación 19041+) o Windows 11 de 64 bits.\n"
                  "• Virtualización por hardware habilitada en la BIOS/UEFI (Intel VT-x o AMD-V).\n"
                  "• Al menos 4 GB de memoria RAM (recomendado 8 GB) y 3 GB de espacio libre en disco.")

# 1.2 Paso 1 WSL
h2 = doc.add_heading(level=2)
h2_run = h2.add_run("1.2 Paso 1: Instalar y Configurar WSL 2 (Windows Subsystem for Linux)")
h2_run.font.name = "Calibri"
h2_run.font.size = Pt(13)
h2_run.bold = True
h2_run.font.color.rgb = RGBColor(37, 99, 235)

doc.add_paragraph(
    "WSL 2 proporciona un kernel de Linux real ultraligero integrado dentro de Windows, permitiendo que Docker y PostgreSQL alcancen el máximo rendimiento."
)

p_wsl_steps = doc.add_paragraph()
p_wsl_steps.add_run("1. Abre el menú inicio de Windows, escribe ").font.name = "Calibri"
p_wsl_steps.add_run("PowerShell").bold = True
p_wsl_steps.add_run(", haz clic derecho y selecciona ").font.name = "Calibri"
p_wsl_steps.add_run("\"Ejecutar como Administrador\"").bold = True
p_wsl_steps.add_run(".\n2. En la consola azul, escribe el siguiente comando y presiona Enter:")

add_code_block(doc, "wsl --install")

doc.add_paragraph(
    "3. Reinicia tu computadora cuando Windows lo solicite.\n"
    "4. Al encender el equipo, se abrirá automáticamente una terminal de Ubuntu. Te pedirá:\n"
    "   • Enter new UNIX username: Escribe tu usuario en minúsculas (ej. daniel).\n"
    "   • New password: Crea una contraseña que recuerdes.\n"
    "5. Comprueba que WSL 2 está activo abriendo PowerShell y escribiendo:"
)
add_code_block(doc, "wsl -l -v")
doc.add_paragraph("Debe mostrar Ubuntu con VERSION en 2.")

# 1.3 Paso 2 Docker
h2 = doc.add_heading(level=2)
h2_run = h2.add_run("1.3 Paso 2: Instalar Docker")
h2_run.font.name = "Calibri"
h2_run.font.size = Pt(13)
h2_run.bold = True
h2_run.font.color.rgb = RGBColor(37, 99, 235)

doc.add_paragraph("Tienes dos alternativas disponibles:")
p_opt_a = doc.add_paragraph()
p_opt_a.add_run("Opción A (Recomendada con Interfaz Gráfica): Docker Desktop\n").bold = True
p_opt_a.add_run(
    "1. Descarga el instalador desde: https://www.docker.com/products/docker-desktop/\n"
    "2. Ejecuta el archivo .exe asegurándote de marcar la casilla ☑ 'Use WSL 2 based engine (recommended)'.\n"
    "3. Abre Docker Desktop desde el escritorio y listo."
)

p_opt_b = doc.add_paragraph()
p_opt_b.add_run("Opción B (Línea de Comandos en Ubuntu WSL):\n").bold = True
p_opt_b.add_run("Si prefieres no usar interfaz gráfica pesada, abre tu terminal de Ubuntu y corre:")
add_code_block(doc, "sudo apt update && sudo apt install -y docker.io docker-compose\nsudo usermod -aG docker $USER\nsudo service docker start")

# 1.4 Paso 3 Descarga
h2 = doc.add_heading(level=2)
h2_run = h2.add_run("1.4 Paso 3: Descargar el Código del Proyecto")
h2_run.font.name = "Calibri"
h2_run.font.size = Pt(13)
h2_run.bold = True
h2_run.font.color.rgb = RGBColor(37, 99, 235)

doc.add_paragraph(
    "Clona el repositorio oficial de GitHub con el siguiente comando en PowerShell o en tu terminal:"
)
add_code_block(doc, "git clone https://github.com/LsCallejas/ecommerce-propuesta-visual.git\ncd ecommerce-propuesta-visual")
doc.add_paragraph("O bien, descomprime el archivo ZIP oficial 'Proyecto_Ecommerce_Daniel_Campos.zip' en tu computadora.")

# 1.5 Paso 4 Inicio en 1 Clic
h2 = doc.add_heading(level=2)
h2_run = h2.add_run("1.5 Paso 4: Puesta en Marcha en 1 Clic (docker-iniciar.bat)")
h2_run.font.name = "Calibri"
h2_run.font.size = Pt(13)
h2_run.bold = True
h2_run.font.color.rgb = RGBColor(37, 99, 235)

doc.add_paragraph(
    "En la carpeta del proyecto, haz DOBLE CLIC en el archivo:\n"
    "👉 docker-iniciar.bat\n\n"
    "El script es inteligente e híbrido: detecta si tienes Docker en Windows o en WSL, compila las imágenes necesarias, levanta la base de datos PostgreSQL 16 con su script de inicialización, inicia el micro-backend Express y el servidor Nginx, y abre automáticamente tu navegador en http://localhost:8080."
)

# 1.6 Accesos y credenciales
h2 = doc.add_heading(level=2)
h2_run = h2.add_run("1.6 Accesos, Puertos y Credenciales Oficiales")
h2_run.font.name = "Calibri"
h2_run.font.size = Pt(13)
h2_run.bold = True
h2_run.font.color.rgb = RGBColor(37, 99, 235)

tbl_ports = doc.add_table(rows=4, cols=3)
tbl_ports.alignment = WD_TABLE_ALIGNMENT.CENTER
tbl_ports.autofit = False
set_table_borders(tbl_ports)
tbl_ports.columns[0].width = Inches(2.2)
tbl_ports.columns[1].width = Inches(2.2)
tbl_ports.columns[2].width = Inches(2.1)

headers_ports = ["Servicio / Módulo", "Dirección / URL", "Descripción"]
for i, h in enumerate(headers_ports):
    c = tbl_ports.rows[0].cells[i]
    set_cell_shading(c, "1E293B")
    set_cell_margins(c)
    p = c.paragraphs[0]
    r = p.add_run(h)
    r.bold = True
    r.font.name = "Calibri"
    r.font.size = Pt(9.5)
    r.font.color.rgb = RGBColor(255, 255, 255)
make_row_header(tbl_ports.rows[0])

port_rows = [
    ("Tienda Oficial (Cliente)", "http://localhost:8080", "Catálogo, carrito, filtros y personalizador de plantillas."),
    ("Panel Administrativo", "http://localhost:8080/admin.html", "Gestión de productos, órdenes, proveedores y telemetría."),
    ("API Health Check", "http://localhost:8080/api/health", "Diagnóstico JSON del estado de conexión con PostgreSQL.")
]

for idx, (srv, url, desc) in enumerate(port_rows):
    row = tbl_ports.rows[idx + 1]
    make_row_cant_split(row)
    bg = "F8FAFC" if idx % 2 == 0 else "FFFFFF"
    for ci, val in enumerate([srv, url, desc]):
        c = row.cells[ci]
        set_cell_shading(c, bg)
        set_cell_margins(c)
        p = c.paragraphs[0]
        r = p.add_run(val)
        r.font.name = "Calibri"
        r.font.size = Pt(9)
        if ci == 0:
            r.bold = True

doc.add_paragraph()
add_callout(doc,
    "Usuario Administrador / Dueño:\n"
    "• Correo: admin@tienda.com (o daniel@tienda.com)  |  Contraseña: admin123\n\n"
    "Usuario Cliente Comprador Demo:\n"
    "• Correo: cliente@tienda.com  |  Contraseña: 123",
    title="CREDENCIALES DE PRUEBA",
    color_hex="2563EB", bg_hex="F0F7FF")

doc.add_page_break()

# ==================== PARTE 2: USO DE LA BASE DE DATOS ====================
h1 = doc.add_heading(level=1)
h1_run = h1.add_run("2. Cómo Usar e Interactuar con la Base de Datos PostgreSQL 16")
h1_run.font.name = "Calibri"
h1_run.font.size = Pt(16)
h1_run.bold = True
h1_run.font.color.rgb = RGBColor(15, 23, 42)

doc.add_paragraph(
    "Para comprobar y mostrar que la base de datos es 100% real, transaccional y persistente, se han diseñado 3 métodos adaptados a diferentes niveles de exigencia:"
)

# Metodo A
h2 = doc.add_heading(level=2)
h2_run = h2.add_run("2.1 Método A: Interfaz Web con Telemetría en Tiempo Real")
h2_run.font.name = "Calibri"
h2_run.font.size = Pt(13)
h2_run.bold = True
h2_run.font.color.rgb = RGBColor(37, 99, 235)

doc.add_paragraph(
    "1. En el navegador, abre http://localhost:8080/admin.html o la tienda http://localhost:8080/.\n"
    "2. En la barra superior, haz clic en la pastilla verde interactiva '🟢 PostgreSQL 16 (En Vivo)'.\n"
    "3. Se desplegará la ventana modal de Telemetría Oficial que muestra:\n"
    "   • Motor: PostgreSQL 16.15 (Alpine Linux) con transaccionalidad ACID.\n"
    "   • Base de datos activa: ecommerce_db con usuario daniel_admin.\n"
    "   • Conteo de registros en vivo: 7 Productos, 4 Órdenes, 4 Proveedores, 4 Inversiones.\n"
    "   • Botón de sincronización manual para refrescar datos desde PostgreSQL."
)

# Metodo B
h2 = doc.add_heading(level=2)
h2_run = h2.add_run("2.2 Método B: Reporte en Terminal con 1 Clic (consultar_resumen_db.bat)")
h2_run.font.name = "Calibri"
h2_run.font.size = Pt(13)
h2_run.bold = True
h2_run.font.color.rgb = RGBColor(37, 99, 235)

doc.add_paragraph(
    "Si un profesor o evaluador te pide ver las tablas en terminal, haz doble clic en:\n"
    "👉 consultar_resumen_db.bat\n\n"
    "Este script se conecta al contenedor Docker 'ecommerce_postgres_db' e imprime en pantalla las tablas públicas, el catálogo con SKU y stock, el listado de órdenes y la vista financiera de márgenes de rentabilidad."
)

# Metodo C
h2 = doc.add_heading(level=2)
h2_run = h2.add_run("2.3 Método C: Consola Interactiva psql (ver_base_de_datos.bat)")
h2_run.font.name = "Calibri"
h2_run.font.size = Pt(13)
h2_run.bold = True
h2_run.font.color.rgb = RGBColor(37, 99, 235)

doc.add_paragraph(
    "Para interactuar como un Administrador de Base de Datos (DBA), haz doble clic en 'ver_base_de_datos.bat'. Ingresarás al prompt oficial de PostgreSQL (ecommerce_db=#). Comandos recomendados:"
)
add_code_block(doc, 
"-- 1. Listar todas las tablas creadas\n"
"\\dt\n\n"
"-- 2. Ver la estructura detallada de la tabla productos (tipos, PK, FK, CHECK)\n"
"\\d products\n\n"
"-- 3. Consultar productos y existencias\n"
"SELECT id, sku, name, sale_price, stock FROM products;\n\n"
"-- 4. Consultar compras y órdenes\n"
"SELECT id, customer_name, total, status FROM orders;\n\n"
"-- 5. Consultar la vista analítica financiera\n"
"SELECT sku, name, cost_price, sale_price, unit_profit, margin_percentage FROM v_inventory_financials;\n\n"
"-- 6. Salir de psql\n"
"\\q"
)

# Detener
h2 = doc.add_heading(level=2)
h2_run = h2.add_run("2.4 Detención Segura sin Pérdida de Datos (docker-detener.bat)")
h2_run.font.name = "Calibri"
h2_run.font.size = Pt(13)
h2_run.bold = True
h2_run.font.color.rgb = RGBColor(37, 99, 235)

doc.add_paragraph(
    "Al terminar de usar el sistema, haz doble clic en 'docker-detener.bat'.\n"
    "Garantía técnica para los evaluadores: Este comando detiene y remueve los contenedores pero conserva de forma inmutable el volumen físico 'ecommerce_postgres_data'. Nada se pierde."
)

doc.add_page_break()

# ==================== PARTE 3: GUÍA DE DEFENSA ACADÉMICA ====================
h1 = doc.add_heading(level=1)
h1_run = h1.add_run("3. Guía de Defensa y Demostración ante los Profesores")
h1_run.font.name = "Calibri"
h1_run.font.size = Pt(16)
h1_run.bold = True
h1_run.font.color.rgb = RGBColor(15, 23, 42)

# Discurso
h2 = doc.add_heading(level=2)
h2_run = h2.add_run("3.1 Discurso Inicial de Presentación (Pitch Técnico de 2 Minutos)")
h2_run.font.name = "Calibri"
h2_run.font.size = Pt(13)
h2_run.bold = True
h2_run.font.color.rgb = RGBColor(37, 99, 235)

add_callout(doc,
    "\"Estimados profesores / miembros del jurado:\n\n"
    "Para el desarrollo de esta plataforma de comercio electrónico, adoptamos una arquitectura desacoplada de 3 niveles contenerizada bajo Docker, respaldada por PostgreSQL 16 como motor relacional transaccional.\n\n"
    "Seleccionamos PostgreSQL por su cumplimiento estricto de las propiedades ACID (Atomicidad, Consistencia, Aislamiento y Durabilidad), su soporte nativo para restricciones relacionales y su capacidad para gestionar alta concurrencia sin riesgo de inconsistencias de stock.\n\n"
    "El modelo de datos se normalizó rigurosamente en Tercera Forma Normal (3FN), estructurado en 7 tablas relacionales, 1 vista analítica de rentabilidad y 5 índices B-Tree de alto rendimiento. Además, la persistencia reside en volúmenes Docker gestionables, garantizando total portabilidad y cero pérdida de información.\"",
    title="DISCURSO OFICIAL RECOMENDADO",
    color_hex="0F172A", bg_hex="F8FAFC")

# 7 Tablas
h2 = doc.add_heading(level=2)
h2_run = h2.add_run("3.2 Estructura del Modelo de Datos (Las 7 Tablas Relacionales)")
h2_run.font.name = "Calibri"
h2_run.font.size = Pt(13)
h2_run.bold = True
h2_run.font.color.rgb = RGBColor(37, 99, 235)

tbl_schema = doc.add_table(rows=8, cols=3)
tbl_schema.alignment = WD_TABLE_ALIGNMENT.CENTER
tbl_schema.autofit = False
set_table_borders(tbl_schema)
tbl_schema.columns[0].width = Inches(1.5)
tbl_schema.columns[1].width = Inches(2.2)
tbl_schema.columns[2].width = Inches(2.8)

headers_schema = ["Tabla", "Claves y Relaciones", "Justificación de Negocio / Reglas"]
for i, h in enumerate(headers_schema):
    c = tbl_schema.rows[0].cells[i]
    set_cell_shading(c, "1E293B")
    set_cell_margins(c)
    p = c.paragraphs[0]
    r = p.add_run(h)
    r.bold = True
    r.font.name = "Calibri"
    r.font.size = Pt(9.5)
    r.font.color.rgb = RGBColor(255, 255, 255)
make_row_header(tbl_schema.rows[0])

schema_rows = [
    ("users", "PK id, UK email", "Control RBAC (admin/cliente). Passwords con hash Bcrypt. Rol validado con CHECK (role IN ('admin', 'cliente'))."),
    ("suppliers", "PK id", "Fabricantes mayoristas. Registra términos de pago (crédito/contado), rating y monto acumulado de inversión."),
    ("products", "PK id, UK sku, UK slug\nFK supplier_id", "Doble contabilidad: cost_price y sale_price. Restricción CHECK (stock >= 0) a nivel de motor. FK a suppliers con ON DELETE SET NULL."),
    ("purchases", "PK id, FK supplier_id", "Lotes de abastecimiento comprados a proveedores. Permite auditar el capital inmovilizado y conciliar facturas."),
    ("orders", "PK id", "Cabecera de compras de clientes. Máquina de estados: Pendiente -> En Preparación -> Enviado -> Entregado."),
    ("order_items", "PK id, FK order_id\nFK product_id", "Resuelve la relación N:M. Congela el unit_price histórico para proteger la fidelidad contable ante futuros cambios de precio."),
    ("store_config", "PK id", "Configuración y branding en caliente: nombre, colores y cambio de arquetipo visual (moderno, boutique, gourmet).")
]

for idx, (tname, tkeys, tdesc) in enumerate(schema_rows):
    row = tbl_schema.rows[idx + 1]
    make_row_cant_split(row)
    bg = "F8FAFC" if idx % 2 == 0 else "FFFFFF"
    for ci, val in enumerate([tname, tkeys, tdesc]):
        c = row.cells[ci]
        set_cell_shading(c, bg)
        set_cell_margins(c)
        p = c.paragraphs[0]
        r = p.add_run(val)
        r.font.name = "Calibri"
        r.font.size = Pt(8.5)
        if ci == 0:
            r.bold = True

doc.add_paragraph()
doc.add_paragraph(
    "Vista Analítica v_inventory_financials: Une dinámicamente 'products' y 'suppliers' para calcular en tiempo real el margen de ganancia porcentual (((sale_price - cost_price)/sale_price)*100), el costo total inmovilizado y la utilidad bruta proyectada sin almacenar datos redundantes."
)

# Demostracion 4 pasos
h2 = doc.add_heading(level=2)
h2_run = h2.add_run("3.3 Demostración Práctica en Vivo (4 Pasos de Alto Impacto)")
h2_run.font.name = "Calibri"
h2_run.font.size = Pt(13)
h2_run.bold = True
h2_run.font.color.rgb = RGBColor(37, 99, 235)

demo_steps = [
    ("Paso 1: Creación de un Producto en la Web y Verificación en SQL", 
     "En el panel admin (http://localhost:8080/admin.html), crea un producto de prueba (ej. 'Monitor Curvo 27' - SKU 'MON-27'). Al guardar, abre la terminal y ejecuta consultar_resumen_db.bat. El nuevo registro aparecerá instantáneamente en PostgreSQL con su ID y stock."),
    ("Paso 2: Ciclo de Vida de una Orden (Cambio de Estado)", 
     "En el panel admin, ve a Órdenes y cambia una orden de 'Pendiente' a 'Enviado'. Ejecuta en SQL: SELECT id, customer_name, status FROM orders; y demuestra cómo el estado se actualizó directamente en la base de datos."),
    ("Paso 3: Demostración de Persistencia Física (Prueba de Fuego)", 
     "Ejecuta 'docker-detener.bat' para apagar por completo los contenedores (la página se caerá). Luego ejecuta 'docker-iniciar.bat'. Demuestra a los evaluadores que todos los datos siguen intactos gracias al volumen 'ecommerce_postgres_data'."),
    ("Paso 4: Auditoría Financiera con la Vista SQL", 
     "Ejecuta: SELECT sku, name, unit_profit, margin_percentage FROM v_inventory_financials LIMIT 3; Demuestra que el sistema realiza cálculos analíticos avanzados para la toma de decisiones empresariales.")
]

for title, desc in demo_steps:
    p = doc.add_paragraph()
    r_t = p.add_run(f"• {title}:\n")
    r_t.bold = True
    r_t.font.name = "Calibri"
    r_t.font.size = Pt(10)
    r_t.font.color.rgb = RGBColor(15, 23, 42)
    r_d = p.add_run(desc)
    r_d.font.name = "Calibri"
    r_d.font.size = Pt(9.5)

# Preguntas frecuentes
h2 = doc.add_heading(level=2)
h2_run = h2.add_run("3.4 Preguntas Típicas del Jurado Evaluador y Respuestas Senior")
h2_run.font.name = "Calibri"
h2_run.font.size = Pt(13)
h2_run.bold = True
h2_run.font.color.rgb = RGBColor(37, 99, 235)

faq_items = [
    ("¿Por qué PostgreSQL y no una base de datos NoSQL como MongoDB?",
     "\"En un comercio electrónico, la integridad del dinero y del inventario no es negociable. Las bases de datos NoSQL manejan consistencia eventual, lo que en compras simultáneas puede provocar sobreventa (overselling). PostgreSQL nos brinda garantías ACID completas, transacciones atómicas, restricciones CHECK y claves foráneas estrictas.\""),
    ("¿Cómo evitan compras duplicadas si dos usuarios compran la última unidad al mismo tiempo?",
     "\"Mediante transacciones atómicas con aislamiento de fila. Al procesar el pedido, el backend ejecuta un bloque BEGIN...COMMIT que descuenta stock mediante 'UPDATE products SET stock = stock - quantity WHERE id = $1 AND stock >= quantity'. Si el stock llega a 0, la restricción CHECK (stock >= 0) rechaza la segunda compra con un rollback automático.\""),
    ("¿Qué ventaja aporta Docker frente a instalar PostgreSQL directo en Windows?",
     "\"Proporciona paridad absoluta entre entornos: la base de datos corre idéntica en la máquina de desarrollo, en la máquina de los evaluadores y en el servidor de producción en la nube. Además, no ensucia el sistema operativo host y la configuración está formalizada como código en docker-compose.yml e init.sql.\""),
    ("¿Cómo protegen la base de datos ante inyecciones SQL (SQL Injection)?",
     "\"En la capa de servicio Node.js Express utilizamos consultas parametrizadas (Prepared Statements) con el driver oficial 'pg'. Ningún dato del usuario se concatena en la cadena SQL; los argumentos viajan sanitizados en un arreglo independiente ($1, $2, etc.), por lo que el analizador de PostgreSQL los trata estrictamente como valores literales.\""),
    ("¿Cómo escala la base de datos si el catálogo crece a cientos de miles de registros?",
     "\"Se implementaron índices B-Tree en las columnas de mayor filtrado (sku, category, orders.status, users.email), garantizando búsquedas en tiempo logarítmico O(log n). Adicionalmente, se configuró un Connection Pool limitado a 20 conexiones simultáneas para evitar la saturación de memoria RAM en el servidor.\"")
]

for q, a in faq_items:
    p_q = doc.add_paragraph()
    p_q.paragraph_format.space_before = Pt(8)
    p_q.paragraph_format.space_after = Pt(2)
    rq = p_q.add_run(f"❓ {q}")
    rq.bold = True
    rq.font.name = "Calibri"
    rq.font.size = Pt(10)
    rq.font.color.rgb = RGBColor(180, 83, 9)
    
    p_a = doc.add_paragraph()
    p_a.paragraph_format.space_after = Pt(6)
    ra = p_a.add_run(a)
    ra.font.name = "Calibri"
    ra.font.size = Pt(9.5)
    ra.font.color.rgb = RGBColor(51, 65, 85)

# Guardar
output_docx_project = r"c:\Users\pc\OneDrive\Desktop\ecommerce\ecommerce_propuesta_visual\docs\manuals\GUIA_INSTALACION_Y_DEFENSA_BASE_DE_DATOS.docx"
output_docx_desktop = r"c:\Users\pc\OneDrive\Desktop\GUIA_INSTALACION_Y_DEFENSA_BASE_DE_DATOS.docx"

os.makedirs(os.path.dirname(output_docx_project), exist_ok=True)
doc.save(output_docx_project)
print(f"[OK] Guardado en proyecto: {output_docx_project}")

shutil.copyfile(output_docx_project, output_docx_desktop)
print(f"[OK] Copiado al Escritorio: {output_docx_desktop}")

