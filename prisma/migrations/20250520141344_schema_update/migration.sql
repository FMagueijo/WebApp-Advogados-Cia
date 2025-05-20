/*
  Warnings:

  - You are about to drop the column `duracaoMinutos` on the `evento` table. All the data in the column will be lost.
  - The primary key for the `registro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `registro` table. All the data in the column will be lost.
  - Added the required column `idRegisto` to the `registro` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `documento` DROP FOREIGN KEY `documento_registro_id_fkey`;

-- DropIndex
DROP INDEX `documento_registro_id_fkey` ON `documento`;

-- AlterTable
ALTER TABLE `evento` DROP COLUMN `duracaoMinutos`;

-- AlterTable
ALTER TABLE `registro` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `idRegisto` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`idRegisto`);

-- AddForeignKey
ALTER TABLE `documento` ADD CONSTRAINT `documento_registro_id_fkey` FOREIGN KEY (`registro_id`) REFERENCES `registro`(`idRegisto`) ON DELETE CASCADE ON UPDATE CASCADE;
