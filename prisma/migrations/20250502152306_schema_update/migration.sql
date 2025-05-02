-- AddForeignKey
ALTER TABLE `caso` ADD CONSTRAINT `caso_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `utilizador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
