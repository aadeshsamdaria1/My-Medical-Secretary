# Step 1: Build Backend
FROM adoptopenjdk:11-jre-hotspot as backend-build
WORKDIR /app
COPY ./src/backend/MMSBackend/out/artifacts/MMSBackend_jar/ .
ENTRYPOINT ["java","-jar","/MMSBackend.jar"]

# Step 2: Build React App
FROM node:alpine3.18 as build 
WORKDIR /app 
COPY ./src/webapp-frontend . 
RUN npm install  
RUN npm run build 

# Step 3: Sever with Nginx
FROM nginx:1.23-alpine 
COPY --from=build /app/build /usr/share/nginx/html/ 
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
EXPOSE 3001
ENTRYPOINT ["nginx", "-g", "daemon off;"]
