/*
  Warnings:

  - You are about to drop the column `esta_verificado` on the `utilizador` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `utilizador` DROP COLUMN `esta_verificado`,
    ADD COLUMN `esta_bloqueado` BOOLEAN NOT NULL DEFAULT false;
