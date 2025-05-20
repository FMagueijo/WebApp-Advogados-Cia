/*
  Warnings:

  - You are about to drop the column `user_id` on the `divida` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `divida` DROP FOREIGN KEY `divida_user_id_fkey`;

-- DropIndex
DROP INDEX `divida_user_id_fkey` ON `divida`;

-- AlterTable
ALTER TABLE `divida` DROP COLUMN `user_id`;
