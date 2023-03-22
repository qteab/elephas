import { VOID_TYPE_ALIAS_KEY } from "./elephas.constants";
import { createSqlTag } from "slonik";
import { VoidSchema } from "./types";

export const sql = createSqlTag({
  typeAliases: {
    [VOID_TYPE_ALIAS_KEY]: VoidSchema,
  },
});

export const voidQuery = sql.typeAlias(VOID_TYPE_ALIAS_KEY);
