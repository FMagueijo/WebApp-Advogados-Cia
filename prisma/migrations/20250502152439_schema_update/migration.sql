-- DropForeignKey
ALTER TABLE `caso` DROP FOREIGN KEY `caso_user_id_fkey`;

-- DropIndex
DROP INDEX `caso_user_id_fkey` ON `caso`;
