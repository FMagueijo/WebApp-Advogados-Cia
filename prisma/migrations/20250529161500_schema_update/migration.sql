/*
  Warnings:

  - You are about to drop the column `cliente_id` on the `caso` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `caso` DROP FOREIGN KEY `caso_cliente_id_fkey`;

-- DropIndex
DROP INDEX `caso_cliente_id_fkey` ON `caso`;

-- AlterTable
ALTER TABLE `caso` DROP COLUMN `cliente_id`;

-- CreateTable
CREATE TABLE `cliente_do_caso` (
    `cliente_id` INTEGER NOT NULL,
    `caso_id` INTEGER NOT NULL,
    `data_associado` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`cliente_id`, `caso_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cliente_do_caso` ADD CONSTRAINT `cliente_do_caso_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `cliente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cliente_do_caso` ADD CONSTRAINT `cliente_do_caso_caso_id_fkey` FOREIGN KEY (`caso_id`) REFERENCES `caso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
