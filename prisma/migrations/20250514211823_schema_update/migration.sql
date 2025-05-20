-- CreateTable
CREATE TABLE `divida` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `valor` FLOAT NOT NULL DEFAULT 0,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizado_em` DATETIME(3) NOT NULL,
    `pago` BOOLEAN NOT NULL DEFAULT false,
    `cliente_id` INTEGER NOT NULL,
    `caso_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `divida` ADD CONSTRAINT `divida_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `divida` ADD CONSTRAINT `divida_caso_id_fkey` FOREIGN KEY (`caso_id`) REFERENCES `caso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `divida` ADD CONSTRAINT `divida_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `utilizador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
