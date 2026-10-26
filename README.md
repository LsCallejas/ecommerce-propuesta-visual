# 🛍️ Plataforma E-Commerce Oficial & Backoffice Administrativo
> **Sistema de Comercio Electrónico Multi-Arquetipo con Micro-Backend REST, Base de Datos Relacional PostgreSQL 16 y Orquestación Docker Compose.**  
> **Responsable & Administrador:** Daniel Campos  
> **Versión:** 9.0 (Producción Enterprise)  

---

## 🏛️ 1. Arquitectura del Repositorio

El proyecto está organizado bajo una **arquitectura desacoplada y modular** que separa limpiamente las capas de presentación, lógica de negocio, persistencia, automatización y documentación académica:

```text
ecommerce_propuesta_visual/
├── backend/                       # Micro-Backend REST API (Node.js 20 Express + pg)
│   ├── Dockerfile                 # Contenedor Node Alpine con healthcheck
│   ├── package.json               # Dependencias: express, pg, cors
│   ├── server.js                  # Controladores REST, Pool de conexiones y transacciones ACID
│   └── .dockerignore
│
├── database/                      # Motor Relacional PostgreSQL 16
│   ├── init.sql                   # DDL: 7 tablas, vista de rentabilidad, restricciones e índices
│   └── README.md                  # Especificaciones de conexión directa (psql / DBeaver)
│
├── frontend/                      # Aplicación Web & Backoffice (Vanilla HTML5/CSS3/ES6)
│   ├── img/                       # Catálogo fotográfico de alta resolución
│   ├── index.html                 # Tienda oficial orientada al cliente (Catálogo y Carrito)
│   ├── admin.html                 # Panel de administración exclusivo para Daniel Campos
│   ├── styles.css                 # Sistema de diseño de la tienda pública
│   ├── admin.css                  # Hoja de estilos del panel de control empresarial
│   ├── app.js                     # Controlador de experiencia del cliente y checkout
│   ├── admin.js                   # Controlador de métricas de rentabilidad y órdenes
│   ├── data.js                    # Capa Storage: Sincronización REST en vivo / Offline fallback
│   └── README.md                  # Especificaciones del frontend
│
├── docs/                          # Documentación Técnica y Capítulos de Tesis
│   ├── architecture/              # Diagramas ERD, topología Docker y modelo de datos (.md / .docx)
│   ├── thesis/                    # Capítulos I, II, III, IV Comercial, SRS, Resultados y PDFs de grado
│   ├── manuals/                   # Manuales de operación del sistema y experiencia cliente
│   └── README.md                  # Directorio maestro de documentos
│
├── scripts/                       # Herramientas de automatización y despliegue
│   ├── docker-iniciar.bat         # Levantamiento de contenedores con verificación de salud
│   ├── docker-detener.bat         # Detención limpia preservando volúmenes persistentes
│   ├── iniciar_demo.bat           # Demostración autónoma en 1 clic sin dependencias externas
│   ├── subir_a_github.bat         # Sincronización automática con repositorio remoto
│   └── build_db_architecture_docx.py # Generador de informes formales Word
│
├── docker-compose.yml             # Orquestación de servicios (web, api, db) en red bridge
├── Dockerfile                     # Imagen de producción del Servidor Web Nginx 1.25 Alpine
├── nginx.conf                     # Reverse Proxy (/api/ -> api:3000), compresión Gzip y headers
├── .dockerignore                  # Exclusión de archivos pesados de compilación
├── .gitignore                     # Control de versiones Git
└── README.md                      # Ficha técnica principal del proyecto
```

---

## 🐳 2. Despliegue con Docker Compose (Recomendado)

Si tienes **Docker Desktop / WSL** instalado en tu equipo:

1. Ejecuta el comando de inicio en la raíz del proyecto:
   ```bash
   docker compose up -d --build
   ```
   *(o haz doble clic en [`scripts/docker-iniciar.bat`](scripts/docker-iniciar.bat)).*

2. Se levantarán automáticamente los **3 servicios interconectados**:
   - **`ecommerce_web_app`** (`http://localhost:8080`): Servidor Nginx que entrega la tienda y el panel de administración.
   - **`ecommerce_api_service`** (`puerto interno :3000`): Micro-backend Express conectado nativamente con pool de conexiones `pg`.
   - **`ecommerce_postgres_db`** (`puerto :5432`): Motor relacional PostgreSQL 16 con esquema ACID y volumen persistente `ecommerce_postgres_data`.

3. **Acceso Inmediato en el Navegador:**
   - 🛍️ **Tienda Pública:** [http://localhost:8080](http://localhost:8080)
   - 👑 **Panel Administrativo (Daniel Campos):** [http://localhost:8080/admin.html](http://localhost:8080/admin.html)
   - 🐘 **Healthcheck & Telemetría PostgreSQL:** [http://localhost:8080/api/health](http://localhost:8080/api/health)

4. **Para detener los servicios:**
   ```bash
   docker compose down
   ```
   *(Los datos registrados se mantendrán intactos en el volumen persistente).*

---

## 🔑 3. Credenciales y Roles de Acceso

| Rol | Correo / Usuario | Contraseña | Alcance en el Sistema |
| :--- | :--- | :--- | :--- |
| **👑 Dueño / Administrador** | `daniel@tienda.com` *(o `admin@tienda.com`)* | `admin123` | Control total del **Modo Dueño**: KPIs de ventas, márgenes brutos, inventario, compras a proveedores, auditoría y personalizador de plantillas. |
| **🛍️ Cliente Comprador** | `cliente@tienda.com` | `123` | Catálogo interactivo, carrito de compras deslizable, comprobante imprimible y seguimiento de pedidos por tracking. |
| **👤 Visitante Anónimo** | *(Sin sesión)* | *(Sin clave)* | Navegación estándar de compra. Las herramientas administrativas se encuentran completamente ocultas. |

---

## 💻 4. Modo Portátil Sin Dependencias (1 Clic)

Si necesitas realizar una presentación en un ordenador que **no disponga de Docker**:
- Ejecuta [`scripts/iniciar_demo.bat`](scripts/iniciar_demo.bat) (o el acceso directo en la raíz).
- La aplicación conmutará de forma automática al motor de almacenamiento local reactivo sin mostrar errores ni requerir servidores externos.

---

## 📚 5. Documentación Completa y Tesis

Toda la documentación académica e informes de ingeniería están organizados en [`docs/`](docs/):
- **Arquitectura de Base de Datos:** [`docs/architecture/ARQUITECTURA_BASE_DE_DATOS_POSTGRESQL.md`](docs/architecture/ARQUITECTURA_BASE_DE_DATOS_POSTGRESQL.md) *(con diagramas ERD, topología y diccionario de datos).*
- **Informe Word para Jurado:** [`docs/architecture/ARQUITECTURA_BASE_DE_DATOS_POSTGRESQL.docx`](docs/architecture/ARQUITECTURA_BASE_DE_DATOS_POSTGRESQL.docx)
- **Capítulos de Tesis de Grado:** [`docs/thesis/`](docs/thesis/) *(Capítulos I, II, III, IV Comercial, SRS y Resultados).*
- **Manual de Operaciones:** [`docs/manuals/MANUAL_PROYECTO_ECOMMERCE.md`](docs/manuals/MANUAL_PROYECTO_ECOMMERCE.md)
