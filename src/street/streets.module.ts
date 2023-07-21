import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { StreetsController } from './streets.controller';
import { StreetsService } from './streets.service';
import { RoutesService } from '../route/routes.service';
import { StreetProviders } from '../typeorm/providers/street.providers';
import { RouteProviders } from '../typeorm/providers/route.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [StreetsController],
  providers: [
    ...StreetProviders,
    ...RouteProviders,
    StreetsService,
    RoutesService,
  ],
  exports: [StreetsService],
})
export class StreetsModule {}
