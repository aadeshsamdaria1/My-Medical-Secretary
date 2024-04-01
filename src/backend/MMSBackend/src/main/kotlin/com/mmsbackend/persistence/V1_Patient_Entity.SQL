CREATE TABLE Patient (
     id INT AUTO_INCREMENT PRIMARY KEY,
     user_type VARCHAR(20) NOT NULL,
     firstname VARCHAR(255),
     middleName VARCHAR(255),
     surname VARCHAR(255),
     dob DATETIME,
     email VARCHAR(255) NOT NULL,
     street VARCHAR(255),
     suburb VARCHAR(255),
     state VARCHAR(255)
);
