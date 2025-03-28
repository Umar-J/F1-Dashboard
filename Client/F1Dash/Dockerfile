# Development stage (with hot-reload)
FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Use the environment variable for the backend (set in docker-compose.yml)
CMD ["npm", "run", "dev"]