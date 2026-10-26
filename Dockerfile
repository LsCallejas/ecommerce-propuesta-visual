# ==============================================================================
# DOCKERFILE - PLATAFORMA E-COMMERCE OFICIAL & PANEL ADMINISTRATIVO
# Presentador / Propietario: Daniel Campos
# Arquitectura: Nginx Alpine (Lightweight, High-Performance Web Server)
# ==============================================================================

FROM nginx:1.25-alpine

LABEL maintainer="Daniel Campos <daniel@tienda.com>"
LABEL description="E-Commerce Oficial Multi-Arquetipo & Backoffice Administrativo"
LABEL version="8.5-production"

# Configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia de los archivos estáticos de la aplicación web
WORKDIR /usr/share/nginx/html
COPY ./frontend /usr/share/nginx/html

# Exponer el puerto HTTP estándar
EXPOSE 80

# Healthcheck para verificar disponibilidad del servicio web
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/index.html || exit 1

# Comando por defecto para iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
