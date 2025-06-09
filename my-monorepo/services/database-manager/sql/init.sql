-- Create database if not exists
CREATE DATABASE IF NOT EXISTS userServer;
USE userServer;

-- 1. Create 'all_users' table
CREATE TABLE all_users (
    uuid CHAR(36) NOT NULL PRIMARY KEY,
    userName VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create 'sessions' table
CREATE TABLE sessions (
    sessionId CHAR(100) NOT NULL PRIMARY KEY,
    sessionData JSON NOT NULL,
    createdAT DATETIME NOT NULL,
    expiresAT DATETIME NOT NULL
);

-- 3. Optional: seed a test user (UUID must be 36 characters)
-- INSERT INTO all_users (uuid, userName, email, password, created_at)
-- VALUES ('123e4567-e89b-12d3-a456-426614174000', 'TestUser', 'test@example.com', 'hashed_password', NOW());
