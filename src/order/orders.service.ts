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
import { ORDER_STATUS } from '../common/constant';

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
  ) { }

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
      }

      const trackingItem = this.orderTrackingRepository.create({
        status: orderData.isTakeParcelMySelf
          ? ORDER_STATUS.WAITING_CUSTOMER_BRING_TO_STATION
          : ORDER_STATUS.ORDER_CREATED,
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

  async getOrderByStatus(status: number, stationId: number | null) {
    console.log('stationId', stationId);
    console.log('status', status);
    const subQuery = this.orderTrackingRepository.createQueryBuilder('ot1')
    subQuery.select('MAX(ot1.status)', 'mStatus')
    subQuery.addSelect('ot1.orderId');
    subQuery.addSelect('ot1.stationInChargeId');
    subQuery.groupBy('ot1.orderId');

    const query = this.orderTrackingRepository.createQueryBuilder('ot');
    query.select('r.orderId');
    query.addSelect('r.mStatus', 'mStatus');
    query.from(`(${subQuery.getQuery()})`, 'r')
    query.where('r.mStatus = :status', { status });
    if (stationId !== null) {
      query.andWhere('r.stationInChargeId = :stationId', { stationId });
    }
    query.groupBy('r.orderId');
    query.limit(10)

    const listId = await query.getRawMany();

    const res = await this.orderRepository.find({
      select: {
        pickupAddress: {
          building: true,
          detail: true,
          city: {
            name: true
          },
          district: {
            name: true
          },
          ward: {
            name: true
          },
          street: {
            name: true
          }
        },
        dropOffAddress: {
          building: true,
          detail: true,
          city: {
            name: true
          },
          district: {
            name: true
          },
          ward: {
            name: true
          },
          street: {
            name: true
          }
        }
      },
      relations: {
        pickupAddress: {
          city: true,
          ward: true,
          street: true,
          district: true
        },
        dropOffAddress: {
          city: true,
          ward: true,
          street: true,
          district: true
        },
        parcels: {
          photo: true
        }
      },
      where: {
        id: In(listId.map(x => x.orderId))
      }
    })

    console.log(res)
    return res;
  }
}
