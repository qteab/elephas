import { DatabasePool, sql } from "slonik";
import { MigrationRowSchema } from "~/types";

export const getRunMigrations = (pool: DatabasePool) => {
  const query = sql.type(MigrationRowSchema)`
    select 
      id, 
      name, 
      run_at
    from migration
  `;

  return pool.any(query).then((rows) =>
    rows.map((row) => ({
      id: row.id,
      name: row.name,
      runAt: new Date(row.run_at).toISOString(),
    }))
  );
};
