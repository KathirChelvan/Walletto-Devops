# Step 1: Build the app
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN NODE_OPTIONS="--max-old-space-size=1024" npm run build

# Step 2: Serve using nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]aws --version
