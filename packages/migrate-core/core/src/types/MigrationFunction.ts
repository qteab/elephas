import { DatabaseTransactionConnection } from "slonik";

export type MigrationFunction = (
  pool: DatabaseTransactionConnection
) => Promise<void>;
