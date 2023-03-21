import { z } from "zod";

export const MigrationRowSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  run_at: z.number().int(),
});
