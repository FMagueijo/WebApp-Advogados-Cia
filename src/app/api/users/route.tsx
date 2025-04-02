import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

import { query } from '@/lib/db';

export async function GET() {
    try {
        // Query the 'utilizador' table
        const [rows] = await query('SELECT * FROM utilizador WHERE id = 1');


        // Return the rows as a JSON response
        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}