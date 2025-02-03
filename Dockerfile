FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN apt-get update && apt-get install -y protobuf-compiler
RUN npm ci
COPY . .
RUN npm run generate-proto
RUN npm run build
