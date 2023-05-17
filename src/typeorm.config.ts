import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'mysql',
  database: 'learn_nest_1',
  username: 'root',
  password: '',
  port: 3306,
  host: '127.0.0.1',
  entities: ['src/typeorm/entities/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  migrationsRun: false,
  dropSchema: true,
  synchronize: false,
});
