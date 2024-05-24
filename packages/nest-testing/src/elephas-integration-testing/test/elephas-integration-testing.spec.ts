import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { sql } from "@qte/elephas-nest";
import { z } from "zod";
import { ElephasIntegrationTestingModule } from "../elephas-integration-testing.module";

describe("Testing shit", () => {
  let app: INestApplication;
  let module: TestingModule;
  let pool: DatabasePool;

  beforeEach(async () => {
    const poolProvider = Symbol("pool");
    module = await Test.createTestingModule({
      imports: [
        ElephasIntegrationTestingModule.forRootAsync({
          providerName: poolProvider,
          imports: [],
          inject: [],
          useFactory: () => ({
            connectionUri:
              "postgresql://qte_qoins:pass@localhost:8500/qte_qoins",
          }),
        }),
      ],
    }).compile();

    await module.init();

    pool = module.get(poolProvider);
  });

  afterEach(async () => {
    await module.close();
  });

  it("poopidyscoop", async () => {
    const result = await pool.oneFirst(sql.type(
      z.object({ result: z.number() })
    )`
      select 1 as result
    `);

    expect(result).toBe(1);
  });
});
