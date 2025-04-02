/*
  Warnings:

  - You are about to alter the column `nome` on the `utilizador` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(95)`.
  - A unique constraint covering the columns `[email]` on the table `utilizador` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `utilizador` DROP FOREIGN KEY `fk_role`;

-- AlterTable
ALTER TABLE `role` MODIFY `role_id` INTEGER NOT NULL AUTO_INCREMENT;

-- AlterTable
ALTER TABLE `utilizador` MODIFY `nome` VARCHAR(95) NOT NULL,
    MODIFY `email` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `utilizador_email_key` ON `utilizador`(`email`);

-- AddForeignKey
ALTER TABLE `utilizador` ADD CONSTRAINT `utilizador_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `role`(`role_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RedefineIndex
CREATE UNIQUE INDEX `role_nome_role_key` ON `role`(`nome_role`);
DROP INDEX `nome_role` ON `role`;
