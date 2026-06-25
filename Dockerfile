FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/typeorm.config.js ./

EXPOSE 3000

CMD ["sh", "-c", "npx typeorm migration:run -d typeorm.config.js && node dist/main.js"]
