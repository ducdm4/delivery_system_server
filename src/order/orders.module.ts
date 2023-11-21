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
import { OrderTrackingProviders } from '../typeorm/providers/orderTracking.providers';
import { WardProviders } from '../typeorm/providers/ward.providers';
import { StationProviders } from '../typeorm/providers/station.providers';
import { RouteProviders } from '../typeorm/providers/route.providers';
import { EmployeeProviders } from '../typeorm/providers/employee.providers';
import { MailService } from '../mail/mail.service';

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
    OrdersService,
    WardsService,
    MailService,
    StationsService,
    RoutesService,
    EmployeesService,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
