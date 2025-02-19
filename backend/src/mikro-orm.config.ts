import { Options } from '@mikro-orm/core'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'

const config: Options = {
  driver: PostgreSqlDriver,
  dbName: 'dwengo',
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: true
};

export default config;
