# Imagen inicial
FROM node:20-alpine

# Directorio donde va a trabajar Docker
WORKDIR /app

# Copiar todos los archivos package dentro de /app
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Comando que se ejecuta al iniciar el contenedor
CMD ["npm", "start"]