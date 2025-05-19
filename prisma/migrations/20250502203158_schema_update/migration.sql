/*
  Warnings:

  - Added the required column `user_id` to the `caso` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `caso` ADD COLUMN `user_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `registro` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `resumo` VARCHAR(255) NOT NULL,
    `descricao` TEXT NULL,
    `tipo` VARCHAR(50) NOT NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_id` INTEGER NOT NULL,
    `caso_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `registro` ADD CONSTRAINT `registro_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `utilizador`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `registro` ADD CONSTRAINT `registro_caso_id_fkey` FOREIGN KEY (`caso_id`) REFERENCES `caso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `caso` ADD CONSTRAINT `caso_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `utilizador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
