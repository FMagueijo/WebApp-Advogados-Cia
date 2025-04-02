-- SQL in migration.sql should match your provided schema exactly
CREATE TABLE role (
    role_id INT PRIMARY KEY,
    nome_role VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE utilizador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    esta_verificado BOOLEAN NOT NULL DEFAULT FALSE,
    password_hash varchar(255),
    email VARCHAR(50) NOT NULL,
    role_id INT,
    
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(role_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

INSERT INTO `role` (`role_id`, `nome_role`) VALUES (1, 'admin'), (2, 'colaborador');

INSERT INTO utilizador (nome, esta_verificado, password_hash, email, role_id) VALUES 
('João Silva', TRUE, '$2a$12$pxPUzjpFfP6SjDCg9lm3hOcQScHf8kKxNFKKrVHWJPrUONi6ogiLG', 'joao.silva@email.com', 1),
('Maria Santos', TRUE, '$2a$12$G.0BquxYM8trpulDXHQaz.9rfJNozfgjVdohBzAyloIAVRL6ks9wO', 'maria.santos@email.com', 2),
('Carlos Pereira', FALSE, '$2a$12$I2T2gvVUkYM1iE6tUWNKU.wx13VWGhdXyB7aBAiPz/LwpV8lfSDJm', 'carlos.pereira@email.com', 1),
('Ana Oliveira', TRUE, '$2a$12$3eqBgsl5jYGhSNNiR2y2/.tFnnbRbsYBBzVdAVGlZpHYYc8M0qYj.', 'ana.oliveira@email.com', 2);