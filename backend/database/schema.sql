-- Vacation System Database Schema

CREATE DATABASE IF NOT EXISTS vacation_db;
USE vacation_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vacations table
CREATE TABLE IF NOT EXISTS vacations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT NOT NULL,
    destination VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    followers_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Follows table (many-to-many relationship between users and vacations)
CREATE TABLE IF NOT EXISTS follows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vacation_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vacation_id) REFERENCES vacations(id) ON DELETE CASCADE,
    UNIQUE KEY unique_follow (user_id, vacation_id)
);

-- Create index for better performance
CREATE INDEX idx_follows_user ON follows(user_id);
CREATE INDEX idx_follows_vacation ON follows(vacation_id);
CREATE INDEX idx_vacations_dates ON vacations(start_date, end_date);

-- Admin user will be created using initAdmin.js script
-- Run: node database/initAdmin.js after creating the database

