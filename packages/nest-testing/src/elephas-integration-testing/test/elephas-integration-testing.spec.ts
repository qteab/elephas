import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ElephasIntegrationTestingModule } from "../elephas-integration-testing.module";

describe("GET /v1/game", () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ElephasIntegrationTestingModule.forRootAsync({
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
  });

  afterEach(async () => {
    await module.close();
  });

  it("poopidyscoop", () => {
    expect(true).toBe(true);
  });
});

describe("ElephasIntegrationTestingModule", () => {});
