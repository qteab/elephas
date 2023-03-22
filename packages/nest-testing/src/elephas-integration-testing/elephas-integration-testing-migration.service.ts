import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { DatabasePool, sql, voidQuery } from "@qte/elephas-nest";
import { up } from "@qte/elephas-migrate-core";
import { ModuleOptions } from "./types";

@Injectable()
export class ElephasIntegrationTestingMigrationService
  implements OnModuleDestroy, OnModuleInit
{
  constructor(
    private readonly livePool: DatabasePool,
    private readonly testingPool: DatabasePool,
    private readonly testingDatabaseName: string,
    private readonly options: ModuleOptions
  ) {}

  public async onModuleInit() {
    if (!this.options.migrationsPath) {
      return;
    }
    await up({
      pool: this.testingPool,
      migrationsPath: this.options.migrationsPath,
    });
  }

  public async onModuleDestroy() {
    await this.livePool.query(voidQuery`
      drop database ${sql.identifier([this.testingDatabaseName])}
    `);

    await this.livePool.end();
  }
}
