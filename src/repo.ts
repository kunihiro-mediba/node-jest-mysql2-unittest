import { createPool, type RowDataPacket } from "mysql2/promise";

interface Hoge extends RowDataPacket {
    id: number;
}

export async function getHoge() {
    const pool = createPool("mysql://username:password@localhost:3306/dbname");

    const conn = await pool.getConnection();

    const [rows] = await conn.query<Hoge[]>("SELECT id FROM hoge ORDER BY id DESC");

    return rows;
}
