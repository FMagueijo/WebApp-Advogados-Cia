/*
  Warnings:

  - You are about to drop the `cliente_do_caso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `colaborador_do_caso` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `cliente_do_caso` DROP FOREIGN KEY `cliente_do_caso_caso_id_fkey`;

-- DropForeignKey
ALTER TABLE `cliente_do_caso` DROP FOREIGN KEY `cliente_do_caso_cliente_id_fkey`;

-- DropForeignKey
ALTER TABLE `colaborador_do_caso` DROP FOREIGN KEY `colaborador_do_caso_caso_id_fkey`;

-- DropForeignKey
ALTER TABLE `colaborador_do_caso` DROP FOREIGN KEY `colaborador_do_caso_user_id_fkey`;

-- DropTable
DROP TABLE `cliente_do_caso`;

-- DropTable
DROP TABLE `colaborador_do_caso`;

-- CreateTable
CREATE TABLE `_CasoToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CasoToUser_AB_unique`(`A`, `B`),
    INDEX `_CasoToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CasoToCliente` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CasoToCliente_AB_unique`(`A`, `B`),
    INDEX `_CasoToCliente_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CasoToUser` ADD CONSTRAINT `_CasoToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `caso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CasoToUser` ADD CONSTRAINT `_CasoToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `utilizador`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CasoToCliente` ADD CONSTRAINT `_CasoToCliente_A_fkey` FOREIGN KEY (`A`) REFERENCES `caso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CasoToCliente` ADD CONSTRAINT `_CasoToCliente_B_fkey` FOREIGN KEY (`B`) REFERENCES `cliente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
