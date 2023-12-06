import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { OrderEntity } from '../typeorm/entities/order.entity';
import { BasicOrderInfo, CollectorCancelOrderData } from './dto/order.dto';
import { AddressEntity } from '../typeorm/entities/address.entity';
import { ParcelEntity } from '../typeorm/entities/parcel.entity';
import { OrderTrackingEntity } from '../typeorm/entities/orderTracking.entity';
import { WardsService } from '../ward/wards.service';
import { dataSource } from '../database/database.providers';
import {
  MANIFEST_TYPE,
  MAX_ATTEMP_DROP,
  MAX_ATTEMP_PICKUP,
  ORDER_STATUS,
  ROLE_LIST,
  STATION_CONNECTED_PATH_KEY,
} from '../common/constant';
import { StationsService } from 'src/station/stations.service';
import { RoutesService } from 'src/route/routes.service';
import { EmployeesService } from 'src/employee/employees.service';
import { ManifestEntity } from 'src/typeorm/entities/manifest.entity';
import { Graph } from 'src/common/function/shortestPath';
import { ConfigsService } from 'src/config/configs.service';
import { StationEntity } from 'src/typeorm/entities/station.entity';

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
    @Inject('MANIFEST_REPOSITORY')
    private manifestRepository: Repository<ManifestEntity>,
    @Inject('STATION_REPOSITORY')
    private stationRepository: Repository<StationEntity>,
    private wardsService: WardsService,
    private stationService: StationsService,
    private routeService: RoutesService,
    private employeeService: EmployeesService,
    private configService: ConfigsService,
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
    const getStation = await this.stationService.getStationByWard(
      pickAddress.ward.id,
    );
    const getStationDrop = await this.stationService.getStationByWard(
      dropAddress.ward.id,
    );
    const stationPathSaved = await this.configService.getValueByKey(
      STATION_CONNECTED_PATH_KEY,
    );
    const edgeList = JSON.parse(stationPathSaved.value);
    const createGraph = (edgeList) => {
      const g = new Graph();
      edgeList.forEach((e) => {
        g.addEdge(e.s, e.f);
      });

      return g;
    };
    const shortestPathGraph = createGraph(edgeList);
    const path = shortestPathGraph.shortestPath(
      getStation.id,
      getStationDrop.id,
    );

    try {
      const pickAddressSaved = await queryRunner.manager.save(pickAddress);
      const dropAddressSaved = await queryRunner.manager.save(dropAddress);

      const trackingId = `${dropAddressSaved.id}${new Date().getTime()}`;

      const order = this.orderRepository.create({
        ...orderData,
        isCancelNote: '',
        pickupAddress: {
          id: pickAddressSaved.id,
        },
        dropOffAddress: {
          id: dropAddressSaved.id,
        },
        uniqueTrackingId: trackingId,
        stationRoutine: path.join(','),
      });

      orderSaved = await queryRunner.manager.save(order);

      for (const parcel of orderData.parcels) {
        this.parcelRepository.create({
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

  async getOrderByStatus(status: Array<string>, stationId: number | null) {
    const sub = this.queryToGetNewestTrackingIdOfEveryOrder();

    const query = this.orderTrackingRepository.createQueryBuilder('ot');
    query.select('ot.id');
    query.addSelect('ot.orderId');
    query.where('ot.status IN (:...status)', { status });
    query.andWhere(`ot.id IN (${sub.getQuery()})`);
    if (stationId !== null) {
      query.andWhere('ot.stationInChargeId = :stationId', { stationId });
    }
    query.groupBy('ot.orderId');

    const listId = await query.getRawMany();

    const response = await this.orderTrackingRepository.find({
      relations: {
        collectorInCharge: true,
        shipperInCharge: true,
        order: {
          pickupAddress: {
            city: true,
            ward: true,
            street: true,
            district: true,
          },
          dropOffAddress: {
            city: true,
            ward: true,
            street: true,
            district: true,
          },
          parcels: {
            photo: true,
          },
        },
      },
      where: {
        id: In(listId.map((x) => x.ot_id)),
        order: {
          isCancel: false,
        },
      },
      take: 5,
      order: {
        order: {
          id: 'ASC',
        },
      },
    });

    return response;
  }

  queryToGetNewestTrackingIdOfEveryOrder(orderId = []) {
    const subQuery = this.orderTrackingRepository.createQueryBuilder('ot1');
    subQuery.select('MAX(ot1.id)', 'mId');
    if (orderId.length) {
      subQuery.where('ot1.orderId IN (:...orderId)', { orderId });
    }
    subQuery.groupBy('ot1.orderId');

    return subQuery;
  }

  async findOrderByIDAndStation(id: number, stationId: number) {
    const subQuery = this.queryToGetNewestTrackingIdOfEveryOrder();

    const query = this.orderTrackingRepository.createQueryBuilder('ot');
    query.select('ot.orderId');
    query.where(`ot.id IN (${subQuery.getQuery()})`);
    query.andWhere('ot.orderId = :id', { id });
    query.andWhere('ot.stationInChargeId = :stationId', { stationId });

    return await query.getRawOne();
  }

  async findOrderByEmployee(id: number, type: number, status: number[]) {
    const subQuery = this.queryToGetNewestTrackingIdOfEveryOrder();

    const query = this.orderTrackingRepository.createQueryBuilder('ot');
    query.select('ot.orderId');
    query.innerJoin('orders', 'o', 'ot.orderId = o.id');
    query.where(`ot.id IN (${subQuery.getQuery()})`);
    query.andWhere('ot.status IN (:...status)', { status });
    if (type === MANIFEST_TYPE.PICKUP) {
      query.andWhere('ot.collectorInChargeId = :id', { id });
    } else {
      query.andWhere('ot.shipperInChargeId = :id', { id });
    }
    query.andWhere('o.isCancel = 0');

    const res = await query.getRawMany();
    return res.map((item) => {
      return { id: item.orderId };
    });
  }

  async operatorConfirmOrder(id: number, stationId: number) {
    const order = await this.findOrderByIDAndStation(id, stationId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const orderInfo = await this.orderRepository.findOne({
      relations: {
        pickupAddress: {
          street: true,
        },
      },
      where: {
        id: order.orderId,
      },
    });

    let collectorId = null;
    const route = await this.routeService.getRouteByStreet(
      stationId,
      0,
      orderInfo.pickupAddress.street.id,
    );
    if (route) {
      collectorId = route.employee.user.id;
    } else {
      const collector = await this.employeeService.findUserByTypeAndStation(
        ROLE_LIST.COLLECTOR,
        stationId,
      );
      if (collector) {
        collectorId = collector[0].user.id;
      }
    }

    const newOrderTracking = this.orderTrackingRepository.create({
      stationInCharge: {
        id: stationId,
      },
      collectorInCharge: {
        id: collectorId,
      },
      status: ORDER_STATUS.WAITING_COLLECTOR_CONFIRM,
      order: {
        id: orderInfo.id,
      },
    });

    this.orderTrackingRepository.save(newOrderTracking);

    return true;
  }

  async cancelOrderByOperator(id: number, note: string, stationId: number) {
    const orderId = await this.findOrderByIDAndStation(id, stationId);
    if (!orderId) {
      throw new NotFoundException('Order not found');
    }
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId.orderId,
      },
    });
    order.isCancel = true;
    order.isCancelNote = note;
    this.orderRepository.save(order);

    return order;
  }

  async findOrderTrackingByUniqueIdAndEmployeeInCharge(
    uniqueTrackingId: string,
  ) {
    const orderTracking = await this.orderTrackingRepository.findOne({
      relations: {
        order: true,
        collectorInCharge: true,
        shipperInCharge: true,
        stationInCharge: true,
      },
      where: {
        order: {
          uniqueTrackingId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return orderTracking;
  }

  async cancelOrderByCollector(
    uniqueTrackingId: string,
    data: CollectorCancelOrderData,
    collectorId: number,
  ) {
    const orderTracking =
      await this.findOrderTrackingByUniqueIdAndEmployeeInCharge(
        uniqueTrackingId,
      );
    if (
      !orderTracking ||
      (orderTracking?.collectorInCharge.id !== collectorId &&
        orderTracking?.status === ORDER_STATUS.WAITING_COLLECTOR_CONFIRM)
    ) {
      throw new ForbiddenException('Order not found');
    }

    let manifest;
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const order = await this.orderRepository.findOneBy({
        id: orderTracking.order.id,
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      order.attempToPickup = order.attempToPickup + 1;
      if (order.attempToPickup === MAX_ATTEMP_PICKUP) {
        order.isCancel = true;
        order.isCancelNote = 'TOO MANY PICKUP ATTEMP';
      }
      const newTracking =
        this.prepareOrderTrackingForCollectorConfirmOrCancel(orderTracking);
      newTracking.status = orderTracking.status;
      newTracking.proofNote = data.proofNote;
      newTracking.proof.id = data.proofImageId;

      manifest = await this.prepareManifest(data.manifestId, order);

      await queryRunner.manager.save(newTracking);
      await queryRunner.manager.save(order);
      await queryRunner.manager.save(manifest);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Something went wrong');
    } finally {
      await queryRunner.release();
    }

    return manifest;
  }

  async confirmOrderByCollector(
    uniqueTrackingId: string,
    data: CollectorCancelOrderData,
    collectorId: number,
  ) {
    const orderTracking =
      await this.findOrderTrackingByUniqueIdAndEmployeeInCharge(
        uniqueTrackingId,
      );
    if (
      !orderTracking ||
      (orderTracking?.collectorInCharge.id !== collectorId &&
        orderTracking?.status === ORDER_STATUS.WAITING_COLLECTOR_CONFIRM)
    ) {
      throw new ForbiddenException('Order not found');
    }

    let manifest;
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const order = await this.orderRepository.findOneBy({
        id: orderTracking.order.id,
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      const newTracking =
        this.prepareOrderTrackingForCollectorConfirmOrCancel(orderTracking);
      newTracking.status = ORDER_STATUS.COLLECTOR_ON_THE_WAY_TO_STATION;

      manifest = await this.prepareManifest(data.manifestId, order);

      await queryRunner.manager.save(newTracking);
      await queryRunner.manager.save(manifest);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Something went wrong');
    } finally {
      await queryRunner.release();
    }

    return manifest;
  }

  async prepareManifest(id: number, order: OrderEntity) {
    const manifest = await this.manifestRepository.findOne({
      relations: {
        orderProcessed: true,
        orders: true,
      },
      where: {
        id: id,
      },
    });
    if (!manifest) {
      throw new NotFoundException('Manifest not found');
    }
    manifest.orderProcessed.push(order);
    if (manifest.orderProcessed.length === manifest.orders.length) {
      manifest.isComplete = true;
    }

    return manifest;
  }

  prepareOrderTrackingForCollectorConfirmOrCancel(
    orderTracking: OrderTrackingEntity,
  ) {
    const newTracking = this.orderTrackingRepository.create({
      proof: {
        id: null,
      },
      proofNote: null,
      order: {
        id: orderTracking.order.id,
      },
      stationInCharge: {
        id: orderTracking.stationInCharge?.id,
      },
      collectorInCharge: {
        id: orderTracking.collectorInCharge?.id,
      },
      shipperInCharge: {
        id: orderTracking.shipperInCharge?.id,
      },
    });

    return newTracking;
  }

  async confirmOrderArrivedStation(
    uniqueTrackingId: string,
    stationId: number,
  ) {
    const orderTracking = await this.orderTrackingRepository.findOne({
      relations: {
        stationInCharge: true,
        order: {
          dropOffAddress: {
            street: true,
          },
        },
      },
      where: {
        stationInCharge: {
          id: stationId,
        },
        order: {
          uniqueTrackingId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    if (!orderTracking) {
      throw new NotFoundException('Order not found');
    }

    const routine = orderTracking.order.stationRoutine.split(',');
    const newOrderTracking = this.orderTrackingRepository.create();
    newOrderTracking.order = orderTracking.order;
    if (parseInt(routine[routine.length - 1]) === stationId) {
      newOrderTracking.status = ORDER_STATUS.ORDER_READY_TO_SHIP;
      newOrderTracking.stationInCharge = orderTracking.stationInCharge;
      const route = await this.routeService.getRouteByStreet(
        stationId,
        MANIFEST_TYPE.DROP,
        orderTracking.order.dropOffAddress.street.id,
      );
      newOrderTracking.shipperInCharge = route.employee.user;
    } else {
      newOrderTracking.status = ORDER_STATUS.WAITING_COLLECTOR_TO_TRANSIT;
      const indexStation = routine.findIndex((x) => parseInt(x) === stationId);
      newOrderTracking.stationInCharge = this.stationRepository.create({
        id: parseInt(routine[indexStation + 1]),
      });

      const route = await this.routeService.getRouteRelativeStation(
        parseInt(routine[indexStation + 1]),
        MANIFEST_TYPE.PICKUP,
        orderTracking.stationInCharge.id,
      );
      newOrderTracking.collectorInCharge = route.employee.user;
      newOrderTracking.previousStationInCharge = orderTracking.stationInCharge;
    }

    return await this.orderTrackingRepository.save(newOrderTracking);
  }

  async getOrdersAndStatus(orderId: Array<number>) {
    const trackingList = await this.queryToGetNewestTrackingIdOfEveryOrder(
      orderId,
    ).getRawMany();
    return await this.orderTrackingRepository.find({
      relations: {
        order: {
          pickupAddress: {
            street: true,
            ward: true,
            district: true,
            city: true,
          },
          dropOffAddress: {
            street: true,
            ward: true,
            district: true,
            city: true,
          },
          parcels: {
            photo: true,
          },
        },
      },
      where: {
        id: In(trackingList.map((item) => item.mId)),
      },
    });
  }

  async shipperAddedToBasket(uniqueTrackingId: string, shipperId: number) {
    const orderTracking =
      await this.findOrderTrackingByUniqueIdAndEmployeeInCharge(
        uniqueTrackingId,
      );
    if (
      !orderTracking ||
      (orderTracking?.shipperInCharge.id !== shipperId &&
        orderTracking?.status === ORDER_STATUS.ORDER_READY_TO_SHIP)
    ) {
      throw new ForbiddenException('Order not found');
    }

    const newTracking = this.orderTrackingRepository.create({
      ...orderTracking,
      status: ORDER_STATUS.ORDER_ON_THE_WAY_TO_RECEIVER,
    });

    return await this.orderTrackingRepository.save(newTracking);
  }

  async cancelOrderByShipper(
    uniqueTrackingId: string,
    data: CollectorCancelOrderData,
    shipperId: number,
  ) {
    const orderTracking =
      await this.findOrderTrackingByUniqueIdAndEmployeeInCharge(
        uniqueTrackingId,
      );
    if (
      !orderTracking ||
      (orderTracking?.shipperInCharge.id !== shipperId &&
        orderTracking?.status === ORDER_STATUS.ORDER_ON_THE_WAY_TO_RECEIVER)
    ) {
      throw new ForbiddenException('Order not found');
    }

    let manifest;
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const order = await this.orderRepository.findOneBy({
        id: orderTracking.order.id,
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      order.numberOfAtTemp = order.numberOfAtTemp + 1;
      if (order.numberOfAtTemp === MAX_ATTEMP_DROP) {
        order.isCancel = true;
        order.isCancelNote = 'TOO MANY SHIPPING ATTEMP';
      }
      const newTracking =
        this.prepareOrderTrackingForCollectorConfirmOrCancel(orderTracking);
      newTracking.status = orderTracking.status;
      newTracking.proofNote = data.proofNote;
      newTracking.proof.id = data.proofImageId;

      manifest = await this.prepareManifest(data.manifestId, order);

      await queryRunner.manager.save(newTracking);
      await queryRunner.manager.save(order);
      await queryRunner.manager.save(manifest);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Something went wrong');
    } finally {
      await queryRunner.release();
    }

    return manifest;
  }

  async shippedOrderByShipper(
    uniqueTrackingId: string,
    data: CollectorCancelOrderData,
    shipperUserId: number,
  ) {
    const orderTracking =
      await this.findOrderTrackingByUniqueIdAndEmployeeInCharge(
        uniqueTrackingId,
      );
    if (
      !orderTracking ||
      (orderTracking?.shipperInCharge.id !== shipperUserId &&
        orderTracking?.status === ORDER_STATUS.ORDER_ON_THE_WAY_TO_RECEIVER)
    ) {
      throw new ForbiddenException('Order not found');
    }

    let manifest;
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const order = await this.orderRepository.findOneBy({
        id: orderTracking.order.id,
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      const newTracking =
        this.prepareOrderTrackingForCollectorConfirmOrCancel(orderTracking);
      newTracking.status = ORDER_STATUS.ORDER_HAS_BEEN_SHIPPED;

      manifest = await this.prepareManifest(data.manifestId, order);

      await queryRunner.manager.save(newTracking);
      await queryRunner.manager.save(manifest);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Something went wrong');
    } finally {
      await queryRunner.release();
    }

    return manifest;
  }
}
