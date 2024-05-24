import { DynamicModule, FactoryProvider, Global, Module } from "@nestjs/common";
import {
  createPool,
  DEFAULT_POOL_PROVIDER_KEY,
  ElephasModule,
  parseDsn,
  sql,
  stringifyDsn,
  voidQuery,
} from "@qte/elephas-nest";

import { ModuleAsyncOptions, ModuleOptions } from "./types";
import { generateTestingDatabaseName } from "./utility";
import { up } from "@qte/elephas-migrate-core";

@Global()
@Module({})
export class ElephasIntegrationTestingCoreModule {
  public static forRootAsync(options: ModuleAsyncOptions): DynamicModule {
    // const optionsProvider =
    const optionsProvider: FactoryProvider = {
      provide:
        "ELEPHAS_INTEGRATION_TESTING_OPTIONS_" +
        (options.providerName?.description || "DEFAULT"),
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return {
      module: ElephasIntegrationTestingCoreModule,
      imports: [
        ElephasModule.forRootAsync({
          providerName: options.providerName || DEFAULT_POOL_PROVIDER_KEY,
          imports: [],
          inject: [optionsProvider.provide],
          useFactory: async (syncOptions: ModuleOptions) => {
            const dsnParsed = parseDsn(syncOptions.connectionUri);
            if (!dsnParsed.databaseName) {
              throw new Error("No database name provided");
            }
            const testingDatabaseName = generateTestingDatabaseName(
              dsnParsed.databaseName
            );

            const livePool = await createPool(syncOptions.connectionUri);
            await livePool.query(voidQuery`
              create database ${sql.identifier([testingDatabaseName])}
            `);

            const testingConnectionUri = stringifyDsn({
              ...dsnParsed,
              databaseName: testingDatabaseName,
            });
            return {
              connectionUri: testingConnectionUri,
              options: syncOptions.options,
              afterConnect: async (pool) => {
                if (syncOptions.migrationsPath) {
                  await up({
                    pool,
                    migrationsPath: syncOptions.migrationsPath,
                    closePool: false,
                  });
                }
                syncOptions.afterMigrate &&
                  (await syncOptions.afterMigrate(pool));
              },
              afterClose: async () => {
                await livePool.query(voidQuery`
                  drop database ${sql.identifier([testingDatabaseName])}
                `);

                await livePool.end();
              },
            };
          },
        }),
      ],
      providers: [optionsProvider],
      exports: [optionsProvider],
    };
  }
}
