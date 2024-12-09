-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS garden_control;

-- Uso do banco de dados
USE garden_control;

-- Criação da tabela plants
CREATE TABLE IF NOT EXISTS plants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    planted_date DATE NOT NULL,
    pesticide_date DATE,
    pesticide VARCHAR(255),
    fertilization_date DATE,
    fertilization VARCHAR(255),
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert example data
INSERT INTO plants (name, planted_date)
VALUES ('Exemplo', '2024-01-01');