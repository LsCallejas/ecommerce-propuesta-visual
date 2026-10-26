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
| **Arquitectura de Base de Datos PostgreSQL 16** | `.docx` (Word) | [`architecture/ARQUITECTURA_BASE_DE_DATOS_POSTGRESQL.docx`](architecture/ARQUITECTURA_BASE_DE_DATOS_POSTGRESQL.docx) | Documento formal formateado en Word listo para imprimir o enviar al jurado. Contiene ficha técnica, las 7 tablas, vista de negocio, restricciones, índices y propiedades ACID. |
| **Arquitectura de Base de Datos (Markdown)** | `.md` | [`architecture/ARQUITECTURA_BASE_DE_DATOS_POSTGRESQL.md`](architecture/ARQUITECTURA_BASE_DE_DATOS_POSTGRESQL.md) | Versión completa con diagramas interactivos Mermaid (Diagrama Entidad-Relación ERD, Topología Docker 3-Tier, Flujo transaccional de checkout y Máquina de estados). |
| **Demostración y Telemetría en Vivo** | `.md` | [`architecture/DEMO_POSTGRESQL_Y_DOCKER_DANIEL_CAMPOS.md`](architecture/DEMO_POSTGRESQL_Y_DOCKER_DANIEL_CAMPOS.md) | Guía de pruebas paso a paso para la defensa ante profesores, evidenciando consultas `psql` y endpoints de salud. |
| **Plan Maestro de Producción y Buenas Prácticas** | `.md` | [`architecture/PLAN_IMPLEMENTACION_PRODUCCION.md`](architecture/PLAN_IMPLEMENTACION_PRODUCCION.md) | Matriz comparativa entre la versión inicial y el estándar Enterprise, arquitectura de software y portabilidad. |

---

## 🎓 2. Capítulos y Documentos Académicos de la Tesis (TEG)

Ubicados en la subcarpeta [`thesis/`](thesis/):

| Capítulo / Archivo | Formato | Enlace Directo | Contenido Académico |
| :--- | :---: | :--- | :--- |
| **Capítulo I: El Problema** | `.docx` | [`thesis/ECOMMERCE CAPÍTULO I 01102026.docx`](thesis/ECOMMERCE%20CAPÍTULO%20I%2001102026.docx) | Planteamiento del problema, formulación de objetivos generales y específicos, justificación y alcance. |
| **Capítulo II: Marco Teórico** | `.docx` | [`thesis/ECOMMERCE CAPÍTULO II 30092026.docx`](thesis/ECOMMERCE%20CAPÍTULO%20II%2030092026.docx) | Antecedentes de la investigación, bases teóricas del comercio electrónico, arquitecturas web y bases legales. |
| **Capítulo III: Marco Metodológico** | `.docx` | [`thesis/ECOMMERCE CAPÍTULO III 01102026.docx`](thesis/ECOMMERCE%20CAPÍTULO%20III%2001102026.docx) | Tipo de investigación, diseño metodológico, fases de desarrollo y técnicas de recolección de requerimientos. |
| **Capítulo IV: Producto Comercial** | `.docx` | [`thesis/CAPITULO_IV_ECOMMERCE_PRODUCTO_COMERCIAL.docx`](thesis/CAPITULO_IV_ECOMMERCE_PRODUCTO_COMERCIAL.docx) | Memoria descriptiva completa del producto comercial, finanzas, rentabilidad, catálogo y módulos de backoffice. |
| **Capítulo IV: Proyecto Especial SRS** | `.docx` | [`thesis/CAPITULO_IV_PROYECTO_ESPECIAL_SRS.docx`](thesis/CAPITULO_IV_PROYECTO_ESPECIAL_SRS.docx) | Especificación de Requerimientos de Software (IEEE 830), casos de uso, actores y modelado funcional del sistema. |
| **Capítulo IV: Resultados y Pruebas** | `.docx` | [`thesis/CAPITULO_IV_RESULTADOS_ECOMMERCE.docx`](thesis/CAPITULO_IV_RESULTADOS_ECOMMERCE.docx) | Análisis de resultados obtenidos, métricas del prototipo y validación de hipótesis. |
| **Propuesta Comercial Oficial** | `.pdf` | [`thesis/Propuesta Comercial de E-commerce.pdf`](thesis/Propuesta%20Comercial%20de%20E-commerce.pdf) | Dossier ejecutivo en PDF de la propuesta de comercio electrónico. |
| **Tesis Completa para Imprimir** | `.pdf` | [`thesis/TESIS IMPRIMIR (1).pdf`](thesis/TESIS%20IMPRIMIR%20(1).pdf) | Documento encuadernable consolidado de la tesis completa de grado. |
| **Esquema Oficial TEG** | `.pdf` | [`thesis/ESQUEMA TEG (1).pdf`](thesis/ESQUEMA%20TEG%20(1).pdf) | Guía y estructura institucional de presentación de trabajo especial de grado. |

---

## 🛠️ 3. Manuales Operativos y Guías de Ejecución

Ubicados en la subcarpeta [`manuals/`](manuals/):

| Manual | Formato | Ubicación | Público Objetivo |
| :--- | :---: | :--- | :--- |
| **Manual Integral del Sistema** | `.md` | [`manuals/MANUAL_PROYECTO_ECOMMERCE.md`](manuals/MANUAL_PROYECTO_ECOMMERCE.md) | Guía integral de operación para Daniel Campos (Gestión de stock, órdenes, plantillas, exportaciones CSV y auditoría). |
| **Guía de Experiencia Cliente** | `.md` | [`manuals/LEEME_CLIENTE.md`](manuals/LEEME_CLIENTE.md) | Explicación del flujo de navegación para compradores, carrito deslizable y rastreo de envíos. |

---

## ⚙️ 4. Scripts y Archivos de Código de Persistencia

- **Esquema Relacional DDL:** [`../database/init.sql`](../database/init.sql) *(Tablas, índices, claves y vista analítica `v_inventory_financials`).*
- **Micro-Backend REST API:** [`../backend/server.js`](../backend/server.js) *(Endpoints Express con connection pool de PostgreSQL).*
- **Orquestación Multi-Contenedor:** [`../docker-compose.yml`](../docker-compose.yml) *(Servicios `web`, `api` y `db`).*
- **Lanzador Docker:** [`../scripts/docker-iniciar.bat`](../scripts/docker-iniciar.bat) *(Arranque con verificación de salud).*
- **Lanzador Portátil:** [`../scripts/iniciar_demo.bat`](../scripts/iniciar_demo.bat) *(Demostración inmediata sin dependencias).*
