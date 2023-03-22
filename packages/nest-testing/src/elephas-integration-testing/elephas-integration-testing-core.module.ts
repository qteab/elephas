import {
  ClassProvider,
  DynamicModule,
  FactoryProvider,
  Global,
  Logger,
  Module,
  ValueProvider,
} from "@nestjs/common";
import {
  createPool,
  DatabasePool,
  DEFAULT_POOL_PROVIDER_KEY,
  ElephasModule,
  parseDsn,
  stringifyDsn,
} from "@qte/elephas-nest";

import { ModuleAsyncOptions, ModuleOptions } from "./types";
import { generateTestingDatabaseName } from "./utility";
import {
  MODULE_OPTIONS_PROVIDER_KEY,
  TESTING_DATABASE_NAME_PROVIDER_KEY,
} from "./elephas-integration-testing.constants";
import { ElephasIntegrationTestingMigrationService } from "./elephas-integration-testing-migration.service";
// import { up } from "@qte-shipping/migrate";

@Global()
@Module({})
export class ElephasIntegrationTestingCoreModule {
  public static forRootAsync(options: ModuleAsyncOptions): DynamicModule {
    const optionsProvider: FactoryProvider = {
      provide: MODULE_OPTIONS_PROVIDER_KEY,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    const testingDatabaseNameProvider: FactoryProvider = {
      provide: TESTING_DATABASE_NAME_PROVIDER_KEY,
      inject: [optionsProvider.provide],
      useFactory: async (syncOptions: ModuleOptions) => {
        const dsnParsed = parseDsn(syncOptions.connectionUri);
        if (!dsnParsed.databaseName) {
          throw new Error("No database provided");
        }
        return generateTestingDatabaseName(dsnParsed.databaseName);
      },
    };

    const migrationProvider: FactoryProvider = {
      provide: ElephasIntegrationTestingMigrationService,
      inject: [
        optionsProvider.provide,
        options.providerName || DEFAULT_POOL_PROVIDER_KEY,
        testingDatabaseNameProvider.provide,
      ],
      useFactory: async (
        syncOptions: ModuleOptions,
        testingPool: DatabasePool,
        testingDatabaseName: string
      ) => {
        const livePool = await createPool(syncOptions.connectionUri);

        return new ElephasIntegrationTestingMigrationService(
          livePool,
          testingPool,
          testingDatabaseName,
          syncOptions
        );
      },
    };

    return {
      imports: [
        ElephasModule.forRootAsync({
          inject: [
            optionsProvider.provide,
            testingDatabaseNameProvider.provide,
          ],
          useFactory: async (
            syncOptions: ModuleOptions,
            testingDatabaseName: string
          ) => {
            const dsnParsed = parseDsn(syncOptions.connectionUri);

            const testingConnectionUri = stringifyDsn({
              ...dsnParsed,
              databaseName: testingDatabaseName,
            });
            return {
              connectionUri: testingConnectionUri,
            };
          },
        }),
      ],
      module: ElephasIntegrationTestingCoreModule,
      providers: [optionsProvider, migrationProvider],
    };
  }
}
