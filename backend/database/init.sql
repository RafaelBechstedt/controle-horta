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


CREATE TABLE IF NOT EXISTS fertilizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plant_id INT NOT NULL, -- Referência à planta
    fertilization_date DATE NOT NULL, -- Data da fertilização
    fertilization VARCHAR(255) NOT NULL, -- Tipo de fertilizante
    notes TEXT, -- Notas adicionais
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
);


-- Insert example data
INSERT INTO plants (name, planted_date, pesticide, observations) 
VALUES ('Tomate', '2024-12-01', 'Nenhum', 'Planta robusta.');

INSERT INTO fertilizations (plant_id, fertilization_date, fertilization, notes)
VALUES (1, '2024-12-15', 'Fertilizante NPK 10-10-10', 'Aplicado 20g em solo úmido.');