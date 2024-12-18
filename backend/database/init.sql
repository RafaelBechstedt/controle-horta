-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS garden_control;

-- Uso do banco de dados
USE garden_control;

-- Criação da tabela plants
CREATE TABLE IF NOT EXISTS plants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    planted_date DATE NOT NULL,
    observations TEXT
);

-- Criação da tabela fertilizations
CREATE TABLE IF NOT EXISTS fertilizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plant_id INT NOT NULL, -- Referência à planta
    fertilization_date DATE NOT NULL, -- Data da fertilização
    fertilization VARCHAR(255) NOT NULL, -- Tipo de fertilizante
    notes TEXT, -- Notas adicionais
    FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);
