# Step 1: Create backend MySQL
RUN apt-get update && apt-get install -y mysql-client
RUN { \
        echo "CREATE DATABASE IF NOT EXISTS my_medical_secretary;"; \
        echo "CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'password';"; \
        echo "GRANT ALL PRIVILEGES ON my_medical_secretary.* TO 'root'@'localhost';"; \
        echo "FLUSH PRIVILEGES;"; \
    } | mysql -u root -ppassword

# Step 2: Build Springboot Backend
FROM adoptopenjdk:11-jre-hotspot as backend-build
WORKDIR /app
COPY ./src/backend/MMSBackend/out/artifacts/MMSBackend_jar/ .
ENTRYPOINT ["java","-jar","/MMSBackend.jar"]

# Step 3: Build React App
FROM node:alpine3.18 as build 
WORKDIR /app 
COPY ./src/webapp-frontend . 
RUN npm install  
RUN npm run build 

# Step 4: Sever with Nginx
FROM nginx:1.23-alpine 
COPY --from=build /app/build /usr/share/nginx/html/ 
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
EXPOSE 3001
ENTRYPOINT ["nginx", "-g", "daemon off;"]
