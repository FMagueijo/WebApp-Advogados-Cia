/*
  Warnings:

  - You are about to drop the `_colaboradoresdocaso` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_colaboradoresdocaso` DROP FOREIGN KEY `_ColaboradoresDoCaso_A_fkey`;

-- DropForeignKey
ALTER TABLE `_colaboradoresdocaso` DROP FOREIGN KEY `_ColaboradoresDoCaso_B_fkey`;

-- DropTable
DROP TABLE `_colaboradoresdocaso`;

-- CreateTable
CREATE TABLE `colaborador_do_caso` (
    `user_id` INTEGER NOT NULL,
    `caso_id` INTEGER NOT NULL,
    `data_entrou` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`user_id`, `caso_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `colaborador_do_caso` ADD CONSTRAINT `colaborador_do_caso_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `utilizador`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `colaborador_do_caso` ADD CONSTRAINT `colaborador_do_caso_caso_id_fkey` FOREIGN KEY (`caso_id`) REFERENCES `caso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
