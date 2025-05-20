/*
  Warnings:

  - You are about to drop the column `localizacao` on the `evento` table. All the data in the column will be lost.
  - You are about to drop the `_eventoclientes` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `tipo` on table `evento` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `_eventoclientes` DROP FOREIGN KEY `_EventoClientes_A_fkey`;

-- DropForeignKey
ALTER TABLE `_eventoclientes` DROP FOREIGN KEY `_EventoClientes_B_fkey`;

-- AlterTable
ALTER TABLE `evento` DROP COLUMN `localizacao`,
    ADD COLUMN `duracaoMinutos` INTEGER NULL,
    ADD COLUMN `local` VARCHAR(255) NULL,
    MODIFY `tipo` ENUM('EVENTO', 'COMPROMISSO', 'PRAZO_PROCESSUAL') NOT NULL DEFAULT 'EVENTO';

-- DropTable
DROP TABLE `_eventoclientes`;
