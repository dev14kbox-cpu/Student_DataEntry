CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;

CREATE TABLE IF NOT EXISTS students (
  id INT PRIMARY KEY,
  fullName VARCHAR(255),
  email VARCHAR(255),
  mobile VARCHAR(50),
  course VARCHAR(255),
  admissionDate VARCHAR(50),
  street VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(255),
  postalCode VARCHAR(50),
  createdAt DATETIME
);
