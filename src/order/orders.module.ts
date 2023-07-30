import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { WardsService } from '../ward/wards.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from '../database/database.module';
import { OrderProviders } from '../typeorm/providers/order.providers';
import { AddressProviders } from '../typeorm/providers/address.providers';
import { ParcelProviders } from '../typeorm/providers/parcel.providers';
import { OrderTrackingProviders } from '../typeorm/providers/orderTracking.providers';
import { WardProviders } from '../typeorm/providers/ward.providers';
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
    OrdersService,
    WardsService,
    MailService,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
