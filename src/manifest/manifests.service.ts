import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, Not, Repository } from 'typeorm';
import { ManifestEntity } from '../typeorm/entities/manifest.entity';
import { OrderEntity } from '../typeorm/entities/order.entity';
import { EmployeesService } from 'src/employee/employees.service';
import { MANIFEST_TYPE, ORDER_STATUS } from 'src/common/constant';
import { OrdersService } from 'src/order/orders.service';

@Injectable()
export class ManifestsService {
  constructor(
    @Inject('MANIFEST_REPOSITORY')
    private manifestRepository: Repository<ManifestEntity>,
    @Inject('ORDER_REPOSITORY')
    private orderRepository: Repository<OrderEntity>,
    private employeeService: EmployeesService,
    private ordersService: OrdersService,
  ) {}

  async findEmployeeCurrentManifest(employeeId: number, type: number) {
    const res = await this.manifestRepository.findOne({
      relations: {
        orderProcessed: true,
        orders: {
          pickupAddress: {
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
        type,
        isComplete: false,
        employee: {
          id: employeeId,
        },
      },
    });
    return res;
  }

  async createNewCollectorManifest(employeeId: number, type: number) {
    const orderList = await this.ordersService.findOrderByEmployee(
      employeeId,
      type,
      ORDER_STATUS.WAITING_COLLECTOR_CONFIRM,
    );
    const manifest = this.manifestRepository.create({
      employee: {
        id: employeeId,
      },
      isComplete: false,
      type,
      orders: orderList,
    });

    await this.manifestRepository.save(manifest);
    const returnManifest = await this.manifestRepository.findOne({
      relations: {
        orderProcessed: true,
        orders: {
          pickupAddress: {
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
        id: manifest.id,
      },
    });

    return returnManifest;
  }
}
