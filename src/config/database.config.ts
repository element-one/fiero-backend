import { resolve } from 'path';

const entitiesPath = resolve(__dirname, '..', 'entities');
const migrationsPath = resolve(__dirname, 'migrations');

const entitiesCliPath = entitiesPath.split('/').slice(-2).join('/');

const DatabaseConfig = () => ({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [entitiesPath.concat('/**/*{t,j}s')],
  migrations: [migrationsPath.concat('/**/*{t,j}s')],
  cli: {
    entitiesDir: entitiesCliPath,
    migrationsDir: migrationsPath,
  },
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  synchronize: process.env.APP_ENV !== 'prod',
});

export default DatabaseConfig;
