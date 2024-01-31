require("ts-node/register");
import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const POSTGRES_DB = process.env.POSTGRES_DB;

const sequelize = new Sequelize({
  host: DB_HOST,
  dialect: "postgres",
  database: POSTGRES_DB,
  username: DB_USER,
  password: DB_PASSWORD,
});

const migrationConf = {
  migrations: {
    glob: "build/src/migrations/*.js",
  },
  storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const seedConf = {
  migrations: {
    glob: "build/src/seeders/*.js",
  },
  storage: new SequelizeStorage({ sequelize, tableName: "seed_data" }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const umzug = new Umzug(migrationConf);
const seeder = new Umzug(seedConf);

const runMigrations = async () => {
  const migrations = await umzug.up();
  console.log("Migrations up to date", {
    files: migrations.map((migration) => migration.name),
  });
};

const runSeeds = async () => {
  const seeds = await seeder.up();
  console.log("Seed data run", {
    files: seeds.map((seed) => seed.name),
  });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  await umzug.down();
};

const rollbackSeeds = async () => {
  await sequelize.authenticate();
  await seeder.down();
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    if (process.env.NODE_ENV === "dev") {
      await runSeeds();
    }
    console.log("Connected to the database");
  } catch (err) {
    console.log(err);
    console.log("Failed to connect to the database");
    return process.exit(1);
  }

  return null;
};

type Migration = typeof umzug._types.migration;

export {
  connectToDatabase,
  sequelize,
  rollbackMigration,
  rollbackSeeds,
  Migration,
};
