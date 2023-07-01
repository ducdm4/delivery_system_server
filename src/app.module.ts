import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './user/users.module';
import { CitiesModule } from './city/cities.module';
import { DistrictsModule } from './district/districts.module';
import { WardsModule } from './ward/wards.module';
import { StreetsModule } from './street/streets.module';
import { PhotosModule } from './photo/photos.module';
import { AddressesModule } from './address/addresses.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { UsersController } from './user/users.controller';
import { CitiesController } from './city/cities.controller';
import { DistrictsController } from './district/districts.controller';
import { WardsController } from './ward/wards.controller';
import { StreetsController } from './street/streets.controller';
import { PhotosController } from './photo/photos.controller';
import { AddressesController } from './address/addresses.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guard/roles.guard';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    CitiesModule,
    DistrictsModule,
    WardsModule,
    StreetsModule,
    PhotosModule,
    AddressesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, AuthMiddleware)
      .forRoutes(
        UsersController,
        CitiesController,
        DistrictsController,
        WardsController,
        StreetsController,
        PhotosController,
        AddressesController,
      );
  }
}
