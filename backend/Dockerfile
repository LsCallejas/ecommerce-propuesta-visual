FROM node:20-alpine

LABEL maintainer="Daniel Campos <daniel@tienda.com>"
LABEL description="Micro-Backend REST API para PostgreSQL 16"

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
