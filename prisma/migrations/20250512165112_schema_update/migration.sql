-- CreateTable
CREATE TABLE `horas_trabalhadas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `horas` FLOAT NOT NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `caso_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `horas_trabalhadas` ADD CONSTRAINT `horas_trabalhadas_caso_id_fkey` FOREIGN KEY (`caso_id`) REFERENCES `caso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `horas_trabalhadas` ADD CONSTRAINT `horas_trabalhadas_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `utilizador`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
