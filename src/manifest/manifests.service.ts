import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ManifestEntity } from '../typeorm/entities/manifest.entity';
import { OrderEntity } from '../typeorm/entities/order.entity';
import { EmployeesService } from 'src/employee/employees.service';
import { MANIFEST_TYPE, ORDER_STATUS } from 'src/common/constant';
import { OrdersService } from 'src/order/orders.service';
import { NotificationsService } from 'src/notification/notifications.service';

@Injectable()
export class ManifestsService {
  constructor(
    @Inject('MANIFEST_REPOSITORY')
    private manifestRepository: Repository<ManifestEntity>,
    @Inject('ORDER_REPOSITORY')
    private orderRepository: Repository<OrderEntity>,
    private employeeService: EmployeesService,
    private ordersService: OrdersService,
    private notificationService: NotificationsService,
  ) {}

  async findEmployeeCurrentManifest(employeeId: number, type: number) {
    const res = await this.manifestRepository.findOne({
      relations: {
        orderProcessed: true,
        orders: true,
      },
      where: {
        type,
        isComplete: false,
        employee: {
          id: employeeId,
        },
      },
    });

    if (res?.orders.length) {
      const resTracking = await this.ordersService.getOrdersAndStatus(
        res.orders.map((item) => item.id),
      );
      return {
        ...res,
        orders: resTracking,
      };
    }
    return res;
  }

  async createNewCollectorManifest(
    employeeId: number,
    userId: number,
    type: number,
  ) {
    const status =
      type === MANIFEST_TYPE.PICKUP
        ? [
            ORDER_STATUS.WAITING_COLLECTOR_CONFIRM,
            ORDER_STATUS.WAITING_COLLECTOR_TO_TRANSIT,
          ]
        : [
            ORDER_STATUS.ORDER_READY_TO_SHIP,
            ORDER_STATUS.ORDER_ON_THE_WAY_TO_RECEIVER,
          ];
    const orderList = await this.ordersService.findOrderByEmployee(
      userId,
      type,
      status,
    );

    if (orderList.length) {
      const manifest = this.manifestRepository.create({
        employee: {
          id: employeeId,
        },
        isComplete: false,
        type,
        orders: orderList,
      });
      await this.manifestRepository.save(manifest);
      const listToSendNotification =
        await this.ordersService.getOrderInfoListForNotification(
          orderList.map((item) => item.id as number),
        );
      for (let i = 0; i++; i < listToSendNotification.length) {
        this.notificationService.sendPushNotificationForOrder(
          listToSendNotification[i].notificationToken,
          {
            title: 'Collector on the way',
            body: `Our collector is on the way to pickup your delivery ${listToSendNotification[i].uniqueTrackingId} today. Please notice your phone!`,
          },
        );
      }
    }

    return orderList.length;
  }
}
