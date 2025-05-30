/*
  Warnings:

  - Added the required column `assunto` to the `divida` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `divida` ADD COLUMN `assunto` VARCHAR(255) NOT NULL;
