/*
  Warnings:

  - Made the column `caso_id` on table `divida` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `divida` DROP FOREIGN KEY `divida_caso_id_fkey`;

-- DropIndex
DROP INDEX `divida_caso_id_fkey` ON `divida`;

-- AlterTable
ALTER TABLE `divida` MODIFY `caso_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `divida` ADD CONSTRAINT `divida_caso_id_fkey` FOREIGN KEY (`caso_id`) REFERENCES `caso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
