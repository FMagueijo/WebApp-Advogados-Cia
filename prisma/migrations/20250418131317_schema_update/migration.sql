-- CreateTable
CREATE TABLE `caso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `processo` VARCHAR(50) NOT NULL,
    `resumo` VARCHAR(100) NOT NULL,
    `descricao` TEXT NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `cliente_id` INTEGER NOT NULL,

    UNIQUE INDEX `caso_processo_key`(`processo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `caso` ADD CONSTRAINT `caso_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
