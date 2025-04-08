/*
  Warnings:

  - You are about to drop the column `cliente_id` on the `tokenpass` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `TokenPass` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tokenpass` DROP FOREIGN KEY `TokenPass_cliente_id_fkey`;

-- DropIndex
DROP INDEX `TokenPass_cliente_id_fkey` ON `tokenpass`;

-- AlterTable
ALTER TABLE `tokenpass` DROP COLUMN `cliente_id`,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `TokenPass` ADD CONSTRAINT `TokenPass_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `utilizador`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
