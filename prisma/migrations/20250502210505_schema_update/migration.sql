-- AlterTable
ALTER TABLE `caso` ADD COLUMN `estado_id` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `casoestado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_role` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `casoestado_nome_role_key`(`nome_role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert default estado values
INSERT INTO `casoestado` (`nome_role`) VALUES 
('Aberto'),
('Fechado'),
('Terminado');

-- AddForeignKey
ALTER TABLE `caso` ADD CONSTRAINT `caso_estado_id_fkey` FOREIGN KEY (`estado_id`) REFERENCES `casoestado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;