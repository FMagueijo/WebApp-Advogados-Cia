/*
  Warnings:

  - The primary key for the `registro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idRegisto` on the `registro` table. All the data in the column will be lost.
  - Added the required column `id` to the `registro` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `documento` DROP FOREIGN KEY `documento_registro_id_fkey`;

-- DropIndex
DROP INDEX `documento_registro_id_fkey` ON `documento`;

-- AlterTable
ALTER TABLE `registro` DROP PRIMARY KEY,
    DROP COLUMN `idRegisto`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `documento` ADD CONSTRAINT `documento_registro_id_fkey` FOREIGN KEY (`registro_id`) REFERENCES `registro`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
