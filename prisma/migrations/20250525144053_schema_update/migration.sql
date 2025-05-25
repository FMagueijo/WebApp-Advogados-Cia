-- CreateTable
CREATE TABLE `_ColaboradoresDoCaso` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ColaboradoresDoCaso_AB_unique`(`A`, `B`),
    INDEX `_ColaboradoresDoCaso_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ColaboradoresDoCaso` ADD CONSTRAINT `_ColaboradoresDoCaso_A_fkey` FOREIGN KEY (`A`) REFERENCES `caso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ColaboradoresDoCaso` ADD CONSTRAINT `_ColaboradoresDoCaso_B_fkey` FOREIGN KEY (`B`) REFERENCES `utilizador`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
