CREATE TABLE Patient (
     id INT AUTO_INCREMENT PRIMARY KEY,
     firstname VARCHAR(255) NOT NULL,
     middleName VARCHAR(255),
     surname VARCHAR(255),
     dob DATETIME NOT NULL,
     email VARCHAR(255) NOT NULL,
     street VARCHAR(255),
     suburb VARCHAR(255),
     state VARCHAR(255)
);
