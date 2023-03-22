import { Inject } from "@nestjs/common";
import { DEFAULT_POOL_PROVIDER_KEY } from "./elephas.constants";

export const InjectPool = (name?: symbol) =>
  Inject(name || DEFAULT_POOL_PROVIDER_KEY);
