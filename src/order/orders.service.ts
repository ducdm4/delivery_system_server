import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { OrderEntity } from '../typeorm/entities/order.entity';
import { BasicOrderInfo } from './dto/order.dto';
import { AddressEntity } from '../typeorm/entities/address.entity';
import { ParcelEntity } from '../typeorm/entities/parcel.entity';
import { OrderTrackingEntity } from '../typeorm/entities/orderTracking.entity';
import { WardsService } from '../ward/wards.service';
import { dataSource } from '../database/database.providers';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDER_REPOSITORY')
    private orderRepository: Repository<OrderEntity>,
    @Inject('ADDRESS_REPOSITORY')
    private addressRepository: Repository<AddressEntity>,
    @Inject('PARCEL_REPOSITORY')
    private parcelRepository: Repository<ParcelEntity>,
    @Inject('ORDER_TRACKING_REPOSITORY')
    private orderTrackingRepository: Repository<OrderTrackingEntity>,
    private wardsService: WardsService,
  ) {}

  async createOrder(orderData: BasicOrderInfo) {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const pickAddress = this.addressRepository.create({
      ...orderData.pickupAddress,
    });

    const dropAddress = this.addressRepository.create({
      ...orderData.dropOffAddress,
    });

    let orderSaved;
    const getStation = await this.wardsService.getWardById(pickAddress.ward.id);
    try {
      const pickAddressSaved = await queryRunner.manager.save(pickAddress);
      const dropAddressSaved = await queryRunner.manager.save(dropAddress);

      const trackingId = `${dropAddressSaved.id}${new Date().getTime()}`;

      const order = this.orderRepository.create({
        ...orderData,
        pickupAddress: {
          id: pickAddressSaved.id,
        },
        dropOffAddress: {
          id: dropAddressSaved.id,
        },
        uniqueTrackingId: trackingId,
      });
      orderSaved = await queryRunner.manager.save(order);

      for (const parcel of orderData.parcels) {
        const parcelInfo = this.parcelRepository.create({
          ...parcel,
          order: {
            id: orderSaved.id,
          },
        });
        await queryRunner.manager.save(parcelInfo);
      }

      const trackingItem = this.orderTrackingRepository.create({
        status: 0,
        isCancel: false,
        order: {
          id: orderSaved.id,
        },
        stationInCharge: {
          id: getStation.id,
        },
      });

      await queryRunner.manager.save(trackingItem);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
    return orderSaved;
  }
}
