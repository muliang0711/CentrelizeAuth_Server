-- 1. Create the database
CREATE DATABASE IF NOT EXISTS userServer;

-- 2. Use the database
USE userServer;

-- 3. Create tables
CREATE TABLE IF NOT EXISTS all_users(
    uuid INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(100),
    created_at DATETIME 
);

CREATE TABLE IF NOT EXISTS sessions (
    sessionId CHAR(64) PRIMARY KEY,            -- 1. SHA-256 hex is always 64 characters
    sessionData JSON,                          -- 3. Use JSON if MySQL 5.7+ or TEXT otherwise
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, -- 4. Auto timestamp
    expiresAt DATETIME                  -- 5. Optional expiration
);
