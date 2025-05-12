-- CreateTable
CREATE TABLE `documento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `caminho` VARCHAR(512) NOT NULL,
    `tipo` VARCHAR(50) NOT NULL,
    `tamanho` INTEGER NOT NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `registro_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `documento` ADD CONSTRAINT `documento_registro_id_fkey` FOREIGN KEY (`registro_id`) REFERENCES `registro`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
