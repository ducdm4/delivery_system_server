import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';
import { StationProviders } from '../typeorm/providers/station.providers';
import { AddressProviders } from '../typeorm/providers/address.providers';
import { WardProviders } from '../typeorm/providers/ward.providers';
import { PhotoProviders } from '../typeorm/providers/photo.providers';
import { RouteProviders } from '../typeorm/providers/route.providers';
import { AddressesService } from '../address/addresses.service';
import { WardsService } from '../ward/wards.service';
import { PhotosService } from '../photo/photos.service';
import { RoutesService } from '../route/routes.service';

@Module({
  imports: [DatabaseModule],
  controllers: [StationsController],
  providers: [
    ...StationProviders,
    ...AddressProviders,
    ...WardProviders,
    ...PhotoProviders,
    ...RouteProviders,
    StationsService,
    AddressesService,
    WardsService,
    PhotosService,
    RoutesService,
  ],
  exports: [StationsService],
})
export class StationsModule {}
