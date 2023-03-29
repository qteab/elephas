import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { createPool, DatabasePool, sql } from "slonik";
import { z } from "zod";
import { InjectPool } from "./elephas.decorators";
import { ModuleOptions } from "./types";

@Injectable()
export class ElephasCloserService implements OnModuleDestroy {
  private readonly logger = new Logger(ElephasCloserService.name);
  constructor(
    @InjectPool() private readonly pool: DatabasePool,
    private readonly options: ModuleOptions
  ) {}

  public async onModuleDestroy() {
    this.logger.debug("Ending pool connection");
    await this.pool.end();
    this.options.afterClose && (await this.options.afterClose());
  }
}
