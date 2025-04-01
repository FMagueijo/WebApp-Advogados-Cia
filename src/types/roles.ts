export enum UserRoles {
    ADMIN = "ADMIN",
    COLAB = "COLAB"
}

export const sys_users = {
    [UserRoles.ADMIN]: { id: 1, nome: "Admin" },
    [UserRoles.COLAB]: { id: 2, nome: "Colaborador" },
};