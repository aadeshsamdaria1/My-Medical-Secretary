# Step 1: Set up MySQL
FROM mysql:latest as mysql-setup
ENV MYSQL_DATABASE=my_medical_secretary \
    MYSQL_USER=root \
    MYSQL_PASSWORD=password \
    MYSQL_ROOT_PASSWORD=password
EXPOSE 3306

CMD ["mysqld", "--default-authentication-plugin=mysql_native_password"]
RUN mysql -u root -p$MYSQL_ROOT_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE;"
RUN mysql -u root -p$MYSQL_ROOT_PASSWORD -e "GRANT ALL PRIVILEGES ON $MYSQL_DATABASE.* TO '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';"
RUN mysql -u root -p$MYSQL_ROOT_PASSWORD -e "FLUSH PRIVILEGES;"

# Step 2: Build Springboot Backend
FROM openjdk:17-oracle as backend-build
WORKDIR /app
COPY ./src/backend/MMSBackend/out/artifacts/MMSBackend_jar/ /app/
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/MMSBackend.jar"]

# # Step 3: Build React App
FROM node:alpine3.18 as build 
WORKDIR /app 
COPY ./src/webapp-frontend . 
RUN npm install
RUN npm run build 

# # Step 4: Sever with Nginx
FROM nginx:1.23-alpine 
COPY --from=build /app/build /usr/share/nginx/html/ 
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
EXPOSE 3001
ENTRYPOINT ["nginx", "-g", "daemon off;"]
