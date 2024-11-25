# Используем образ с Node.js для сборки проекта
FROM node:18 AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Строим проект
RUN npm run build-only

# Используем образ с nginx для фронтенда
FROM nginx:stable-alpine

# Копируем билд Vue в папку, откуда Nginx обслуживает файлы
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем кастомный конфиг Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
