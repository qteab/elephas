import { DatabasePool, sql } from "slonik";
import { z } from "zod";

export const createMigrationTable = async (pool: DatabasePool) => {
  const query = sql.type(z.object({}).strict())`
    create table if not exists migration (
      id uuid primary key default gen_random_uuid(),
      name text not null,
      run_at timestamptz not null default now()
    )
  `;
  await pool.query(query);
};
