-- CreateTable
CREATE TABLE `notificacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(255) NOT NULL,
    `mensagem` TEXT NOT NULL,
    `tipo` ENUM('GERAL', 'SISTEMA', 'EVENTO', 'PRAZO', 'ALERTA', 'FINANCEIRO', 'USUARIO') NOT NULL DEFAULT 'GERAL',
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `criador_id` INTEGER NULL,
    `userId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notificacao_recebida` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `notificacao_id` INTEGER NOT NULL,
    `lida` BOOLEAN NOT NULL DEFAULT false,
    `recebida_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `notificacao_recebida_user_id_notificacao_id_key`(`user_id`, `notificacao_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notificacao` ADD CONSTRAINT `notificacao_criador_id_fkey` FOREIGN KEY (`criador_id`) REFERENCES `utilizador`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificacao` ADD CONSTRAINT `notificacao_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `utilizador`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificacao_recebida` ADD CONSTRAINT `notificacao_recebida_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `utilizador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notificacao_recebida` ADD CONSTRAINT `notificacao_recebida_notificacao_id_fkey` FOREIGN KEY (`notificacao_id`) REFERENCES `notificacao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
