/*
  Warnings:

  - The primary key for the `registro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `registro` table. All the data in the column will be lost.
  - Added the required column `idRegisto` to the `registro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `registro` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `idRegisto` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`idRegisto`);
