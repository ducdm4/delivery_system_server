import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { usersModule } from './user/users.module';
import { productsModule } from './product/products.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { UsersController } from './user/users.controller';
import { ProductsController } from './product/products.controller';
import { UserEntity } from './typeorm/entities/user.entity';
import { UserInfoEntity } from './typeorm/entities/userInfo.entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    usersModule,
    productsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: process.env.DATABASE_TABLE,
      entities: [UserEntity, UserInfoEntity],
      synchronize: false,
      logging: true,
    }),
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(UsersController, ProductsController);
  }
}
