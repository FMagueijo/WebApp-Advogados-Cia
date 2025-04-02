import { query } from '@/lib/db';
import { RoleData, UserData } from '@/types/types';

// User.ts
export async function getAllUsers(): Promise<UserData[]> {
    try {
        const [results] = await query('SELECT * FROM utilizador');
        return results as UserData[];
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

export async function getFilteredUsers(filters: Record<string, any>, order?: Record<string, boolean>): Promise<Record<string, any>[]> {
    try {
        console.log('Filters received:', filters);
        const conditions: string[] = [];
        const params: any[] = [];

        if (filters.ID) {
            conditions.push(`id = ${filters.ID}`);
        }
        if (filters.Nome) {
            conditions.push('nome LIKE ?');
            params.push(`%${filters.Nome}%`);
        }
        if (filters.Email) {
            conditions.push('email LIKE ?');
            params.push(`%${filters.Email}%`);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        let queryString = `SELECT * FROM utilizador ${whereClause}`;
        if (order) {
            const orderByClauses = Object.entries(order)
                .map(([key, isInverted]) => `${key} ${isInverted ? 'DESC' : 'ASC'}`)
                .join(', ');
            queryString += ` ORDER BY ${orderByClauses}`;
        }

        console.log('Query string:', queryString);

        const [results] = await query(queryString, params);
        return results as UserData[];

    } catch (error) {
        console.error('Error fetching filtered users:', error);
        throw error;
    }
}


export async function getUserRole(user:UserData): Promise<Record<string, any>> {
    try {
        
        let queryString = `SELECT * FROM role WHERE role_id = ${user.role_id}`;
        
        console.log('Query string:', queryString);

        const rows = await query(queryString) as unknown as RoleData[];
        return rows[0];
    } catch (error) {
        console.error('Error fetching filtered users:', error);
        throw error;
    }
}



