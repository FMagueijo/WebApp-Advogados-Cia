-- CreateTable
CREATE TABLE `evento` (
    `id` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(64) NOT NULL,
    `descricao` TEXT NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizado_em` DATETIME(3) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `localizacao` VARCHAR(255) NULL,
    `tipo` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_EventoClientes` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_EventoClientes_AB_unique`(`A`, `B`),
    INDEX `_EventoClientes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_EventoCasos` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_EventoCasos_AB_unique`(`A`, `B`),
    INDEX `_EventoCasos_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_EventoColaboradores` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_EventoColaboradores_AB_unique`(`A`, `B`),
    INDEX `_EventoColaboradores_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `evento` ADD CONSTRAINT `evento_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `utilizador`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EventoClientes` ADD CONSTRAINT `_EventoClientes_A_fkey` FOREIGN KEY (`A`) REFERENCES `cliente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EventoClientes` ADD CONSTRAINT `_EventoClientes_B_fkey` FOREIGN KEY (`B`) REFERENCES `evento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EventoCasos` ADD CONSTRAINT `_EventoCasos_A_fkey` FOREIGN KEY (`A`) REFERENCES `caso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EventoCasos` ADD CONSTRAINT `_EventoCasos_B_fkey` FOREIGN KEY (`B`) REFERENCES `evento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EventoColaboradores` ADD CONSTRAINT `_EventoColaboradores_A_fkey` FOREIGN KEY (`A`) REFERENCES `evento`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EventoColaboradores` ADD CONSTRAINT `_EventoColaboradores_B_fkey` FOREIGN KEY (`B`) REFERENCES `utilizador`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
