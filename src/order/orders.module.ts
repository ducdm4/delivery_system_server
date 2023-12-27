import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { WardsService } from '../ward/wards.service';
import { StationsService } from '../station/stations.service';
import { RoutesService } from '../route/routes.service';
import { EmployeesService } from '../employee/employees.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from '../database/database.module';
import { OrderProviders } from '../typeorm/providers/order.providers';
import { AddressProviders } from '../typeorm/providers/address.providers';
import { ParcelProviders } from '../typeorm/providers/parcel.providers';
import { ManifestProviders } from '../typeorm/providers/manifest.providers';
import { OrderTrackingProviders } from '../typeorm/providers/orderTracking.providers';
import { WardProviders } from '../typeorm/providers/ward.providers';
import { StationProviders } from '../typeorm/providers/station.providers';
import { RouteProviders } from '../typeorm/providers/route.providers';
import { EmployeeProviders } from '../typeorm/providers/employee.providers';
import { NotificationProviders } from '../typeorm/providers/notification.providers';
import { ConfigProviders } from '../typeorm/providers/config.providers';
import { MailService } from '../mail/mail.service';
import { ConfigsService } from '../config/configs.service';
import { NotificationsService } from '../notification/notifications.service';

@Module({
  imports: [DatabaseModule],
  controllers: [OrdersController],
  providers: [
    ...OrderProviders,
    ...AddressProviders,
    ...ParcelProviders,
    ...OrderTrackingProviders,
    ...WardProviders,
    ...StationProviders,
    ...RouteProviders,
    ...EmployeeProviders,
    ...ManifestProviders,
    ...ConfigProviders,
    ...NotificationProviders,
    OrdersService,
    WardsService,
    MailService,
    StationsService,
    RoutesService,
    EmployeesService,
    ConfigsService,
    NotificationsService,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
