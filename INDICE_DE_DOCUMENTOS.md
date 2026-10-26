# 📚 ÍNDICE GENERAL DE DOCUMENTOS DEL PROYECTO
## Plataforma E-Commerce Oficial, Base de Datos PostgreSQL 16 & Tesis de Grado
**Responsable & Administrador:** Daniel Campos  
**Proyecto:** E-Commerce Oficial Multi-Arquetipo & Backoffice Comercial  
**Carpeta Centralizada:** `ecommerce_propuesta_visual/`  
**Fecha de Actualización:** Octubre 2026  

---

## 🏛️ 1. Documentación Técnica de Base de Datos y Arquitectura

Estos documentos contienen la justificación de ingeniería, diagramas de arquitectura, diccionario de datos relacional y telemetría de persistencia en PostgreSQL 16:

| Documento | Formato | Ubicación | Descripción |
| :--- | :---: | :--- | :--- |
| **Arquitectura de Base de Datos PostgreSQL 16** | `.docx` (Word) | [`ARQUITECTURA_BASE_DE_DATOS_POSTGRESQL.docx`](ARQUITECTURA_BASE_DE_DATOS_POSTGRESQL.docx) | Documento formal formateado en Word listo para imprimir o enviar al jurado. Contiene ficha técnica, las 7 tablas, vista de negocio, restricciones, índices y propiedades ACID. |
| **Arquitectura de Base de Datos (Markdown)** | `.md` | [`ARQUITECTURA_BASE_DE_DATOS_POSTGRESQL.md`](ARQUITECTURA_BASE_DE_DATOS_POSTGRESQL.md) | Versión completa con diagramas interactivos Mermaid (Diagrama Entidad-Relación ERD, Topología Docker 3-Tier, Flujo transaccional de checkout y Máquina de estados). |
| **Demostración y Telemetría en Vivo** | `.md` | [`DEMO_POSTGRESQL_Y_DOCKER_DANIEL_CAMPOS.md`](DEMO_POSTGRESQL_Y_DOCKER_DANIEL_CAMPOS.md) | Guía de pruebas paso a paso para la defensa ante profesores, evidenciando consultas `psql` y endpoints de salud. |
| **Plan Maestro de Producción y Buenas Prácticas** | `.md` | [`PLAN_IMPLEMENTACION_PRODUCCION.md`](PLAN_IMPLEMENTACION_PRODUCCION.md) | Matriz comparativa entre la versión inicial y el estándar Enterprise, arquitectura de software y portabilidad. |

---

## 🎓 2. Capítulos y Documentos Académicos de la Tesis (TEG)

Ubicados en la subcarpeta [`documentos_proyecto_y_tesis/`](documentos_proyecto_y_tesis/):

| Capítulo / Archivo | Formato | Enlace Directo | Contenido Académico |
| :--- | :---: | :--- | :--- |
| **Capítulo I: El Problema** | `.docx` | [`ECOMMERCE CAPÍTULO I 01102026.docx`](documentos_proyecto_y_tesis/ECOMMERCE%20CAPÍTULO%20I%2001102026.docx) | Planteamiento del problema, formulación de objetivos generales y específicos, justificación y alcance. |
| **Capítulo II: Marco Teórico** | `.docx` | [`ECOMMERCE CAPÍTULO II 30092026.docx`](documentos_proyecto_y_tesis/ECOMMERCE%20CAPÍTULO%20II%2030092026.docx) | Antecedentes de la investigación, bases teóricas del comercio electrónico, arquitecturas web y bases legales. |
| **Capítulo III: Marco Metodológico** | `.docx` | [`ECOMMERCE CAPÍTULO III 01102026.docx`](documentos_proyecto_y_tesis/ECOMMERCE%20CAPÍTULO%20III%2001102026.docx) | Tipo de investigación, diseño metodológico, fases de desarrollo y técnicas de recolección de requerimientos. |
| **Capítulo IV: Producto Comercial** | `.docx` | [`CAPITULO_IV_ECOMMERCE_PRODUCTO_COMERCIAL.docx`](documentos_proyecto_y_tesis/CAPITULO_IV_ECOMMERCE_PRODUCTO_COMERCIAL.docx) | Memoria descriptiva completa del producto comercial, finanzas, rentabilidad, catálogo y módulos de backoffice. |
| **Capítulo IV: Proyecto Especial SRS** | `.docx` | [`CAPITULO_IV_PROYECTO_ESPECIAL_SRS.docx`](documentos_proyecto_y_tesis/CAPITULO_IV_PROYECTO_ESPECIAL_SRS.docx) | Especificación de Requerimientos de Software (IEEE 830), casos de uso, actores y modelado funcional del sistema. |
| **Capítulo IV: Resultados y Pruebas** | `.docx` | [`CAPITULO_IV_RESULTADOS_ECOMMERCE.docx`](documentos_proyecto_y_tesis/CAPITULO_IV_RESULTADOS_ECOMMERCE.docx) | Análisis de resultados obtenidos, métricas del prototipo y validación de hipótesis. |
| **Propuesta Comercial Oficial** | `.pdf` | [`Propuesta Comercial de E-commerce.pdf`](documentos_proyecto_y_tesis/Propuesta%20Comercial%20de%20E-commerce.pdf) | Dossier ejecutivo en PDF de la propuesta de comercio electrónico. |
| **Tesis Completa para Imprimir** | `.pdf` | [`TESIS IMPRIMIR (1).pdf`](documentos_proyecto_y_tesis/TESIS%20IMPRIMIR%20(1).pdf) | Documento encuadernable consolidado de la tesis completa de grado. |
| **Esquema Oficial TEG** | `.pdf` | [`ESQUEMA TEG (1).pdf`](documentos_proyecto_y_tesis/ESQUEMA%20TEG%20(1).pdf) | Guía y estructura institucional de presentación de trabajo especial de grado. |

---

## 🛠️ 3. Manuales Operativos y Guías de Ejecución

| Manual | Formato | Ubicación | Público Objetivo |
| :--- | :---: | :--- | :--- |
| **Manual Integral del Sistema** | `.md` | [`MANUAL_PROYECTO_ECOMMERCE.md`](MANUAL_PROYECTO_ECOMMERCE.md) | Guía integral de operación para Daniel Campos (Gestión de stock, órdenes, plantillas, exportaciones CSV y auditoría). |
| **Guía de Experiencia Cliente** | `.md` | [`LEEME_CLIENTE.md`](LEEME_CLIENTE.md) | Explicación del flujo de navegación para compradores, carrito deslizable y rastreo de envíos. |
| **README de Inicio Rápido** | `.md` | [`README.md`](README.md) | Instrucciones de despliegue con Docker Compose y modo portátil de 1 clic sin dependencias. |

---

## ⚙️ 4. Scripts y Archivos de Código de Persistencia

- **Esquema Relacional DDL:** [`database/init.sql`](database/init.sql) *(Tablas, índices, claves y vista analítica `v_inventory_financials`).*
- **Micro-Backend REST API:** [`backend/server.js`](backend/server.js) *(Endpoints Express con connection pool de PostgreSQL).*
- **Orquestación Multi-Contenedor:** [`docker-compose.yml`](docker-compose.yml) *(Servicios `web`, `api` y `db`).*
- **Lanzador Docker:** [`docker-iniciar.bat`](docker-iniciar.bat) *(Arranque con verificación de salud).*
- **Lanzador Portátil:** [`iniciar_demo.bat`](iniciar_demo.bat) *(Demostración inmediata sin dependencias).*
