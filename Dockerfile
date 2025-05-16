# 1. Build React frontend
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Production image za Express server + buildani frontend
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=build /app/build ./build
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]