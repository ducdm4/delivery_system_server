import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'delivery_system',
  entities: [__dirname + '/../**/*/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../**/*/migrations/*{.ts,.js}'],
  migrationsRun: true,
  synchronize: false,
});

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      return dataSource.initialize();
    },
  },
];
