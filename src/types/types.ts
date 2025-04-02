export interface UserData {
    id: number;
    role_id: number;
    nome: string;
    email: string;
    esta_verificado: boolean;
}

export interface RoleData {
    role_id: number;
    nome_role: string;
}

export interface FilterData {
    type: "toggle" | "text" | "combobox" | "number";
    label: string;
    value?: string;
    options?: string[];
}
