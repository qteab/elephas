import { createMockPool } from "@qte/elephas-nest";

export interface ModuleOptions {
  overrides: Parameters<typeof createMockPool>[0];
}
