-- CreateTable
CREATE TABLE `TokenPass` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(25) NOT NULL,
    `cliente_id` INTEGER NOT NULL,

    UNIQUE INDEX `TokenPass_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TokenPass` ADD CONSTRAINT `TokenPass_cliente_id_fkey` FOREIGN KEY (`cliente_id`) REFERENCES `cliente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
