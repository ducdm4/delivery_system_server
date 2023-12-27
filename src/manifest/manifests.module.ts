import { Module } from '@nestjs/common';
import { OrdersService } from '../order/orders.service';
import { EmployeesService } from '../employee/employees.service';
import { ManifestsController } from './manifests.controller';
import { ManifestsService } from './manifests.service';
import { DatabaseModule } from '../database/database.module';
import { OrderProviders } from '../typeorm/providers/order.providers';
import { AddressProviders } from '../typeorm/providers/address.providers';
import { ManifestProviders } from '../typeorm/providers/manifest.providers';
import { EmployeeProviders } from '../typeorm/providers/employee.providers';
import { ParcelProviders } from '../typeorm/providers/parcel.providers';
import { WardProviders } from '../typeorm/providers/ward.providers';
import { RouteProviders } from '../typeorm/providers/route.providers';
import { StationProviders } from '../typeorm/providers/station.providers';
import { OrderTrackingProviders } from '../typeorm/providers/orderTracking.providers';
import { WardsService } from '../ward/wards.service';
import { StationsService } from '../station/stations.service';
import { RoutesService } from '../route/routes.service';
import { ConfigsService } from '../config/configs.service';
import { NotificationsService } from '../notification/notifications.service';
import { ConfigProviders } from '../typeorm/providers/config.providers';
import { NotificationProviders } from '../typeorm/providers/notification.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ManifestsController],
  providers: [
    ...OrderProviders,
    ...EmployeeProviders,
    ...ManifestProviders,
    ...AddressProviders,
    ...ParcelProviders,
    ...OrderTrackingProviders,
    ...WardProviders,
    ...RouteProviders,
    ...StationProviders,
    ...ConfigProviders,
    ...NotificationProviders,
    OrdersService,
    ManifestsService,
    EmployeesService,
    WardsService,
    StationsService,
    RoutesService,
    WardsService,
    ConfigsService,
    NotificationsService,
  ],
  exports: [ManifestsService],
})
export class ManifestsModule {}
