import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { OrdersService } from './orders.service';
import { StationsService } from '../station/stations.service';
import { BasicOrderInfo, OrderInfoQuote } from './dto/order.dto';
import { GENERAL_CONFIG, ROLE_LIST, STATION_TYPE } from '../common/constant';
import { Roles } from '../common/decorator/roles.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly stationsService: StationsService,
  ) { }

  @Post()
  async createNewOrder(
    @Body() createOrderData: BasicOrderInfo,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.ordersService.createOrder(createOrderData);
    const stationPickup = await this.stationsService.getStationByWard(
      createOrderData.pickupAddress.ward.id,
    );
    response.then((orderInfo) => {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: { orderInfo, stationPickup },
      });
    });
  }

  @Post('/calculate')
  async calculateShippingFee(
    @Body() createOrderData: OrderInfoQuote,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.calculateFee(createOrderData);
    response.then(
      (total) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: { total },
        });
      },
      (fail) => {
        res.status(fail.getStatus()).json({
          statusCode: fail.getStatus(),
          message: 'Your pickup or drop-off address is out of service',
          data: {},
        });
      },
    );
  }

  @Get('/status/:status')
  @Roles([ROLE_LIST.ADMIN, ROLE_LIST.OPERATOR])
  async getOrderByStatus(
    @Param('status', ParseIntPipe) status: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const stationId =
      req.user['role'] === ROLE_LIST.OPERATOR
        ? req.user['employeeInfo']['station']['id']
        : null;
    const orderList = this.ordersService.getOrderByStatus(status, stationId);
    orderList.then(
      (orders) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: { orders },
        });
      },
      (fail) => {
        res
          .status(fail.getStatus === 'function' ? fail.getStatus() : 500)
          .json({
            statusCode:
              typeof fail.getStatus === 'function' ? fail.getStatus() : 500,
            message: 'Order not found',
            data: {},
          });
      },
    );
  }

  async calculateFee(createOrderData: OrderInfoQuote) {
    let result = GENERAL_CONFIG.baseRate;
    //get station info
    const stationPickup = await this.stationsService.getStationByWard(
      createOrderData.pickupAddress.ward.id,
    );
    const stationDrop = await this.stationsService.getStationByWard(
      createOrderData.dropOffAddress.ward.id,
    );
    if (!stationDrop || !stationPickup) {
      throw new BadRequestException(
        'Your pickup or drop-off address is out of service',
      );
    }
    // calculate parcel
    let totalWeight = 0;
    createOrderData.parcels.forEach((parcel) => {
      totalWeight += parcel.weight + 1;
    });
    result += (totalWeight - 1) * GENERAL_CONFIG.weightLevel;

    // case both is ward station
    if (stationPickup.id === stationDrop.id) {
      return result;
    }

    // case ward to ward
    if (
      stationPickup.type === STATION_TYPE.WARD &&
      stationDrop.type === STATION_TYPE.WARD
    ) {
      if (stationPickup.parentId === stationDrop.parentId) {
        result += GENERAL_CONFIG.ward;
      } else {
        result += GENERAL_CONFIG.ward + GENERAL_CONFIG.district;
      }
    }

    // case ward -> district and vice versa and still same district
    if (
      stationPickup.parentId === stationDrop.id ||
      stationDrop.parentId === stationPickup.id
    ) {
      result += GENERAL_CONFIG.ward;
    }

    // case ward -> district and vice versa and different district
    if (
      (stationPickup.type === STATION_TYPE.WARD &&
        stationDrop.type === STATION_TYPE.DISTRICT &&
        stationPickup.parentId !== stationDrop.id) ||
      (stationPickup.type === STATION_TYPE.DISTRICT &&
        stationDrop.type === STATION_TYPE.WARD &&
        stationPickup.id !== stationDrop.parentId)
    ) {
      result += GENERAL_CONFIG.ward + GENERAL_CONFIG.district;
    }

    // case district -> district
    if (
      stationPickup.type === STATION_TYPE.DISTRICT &&
      stationDrop.type === STATION_TYPE.DISTRICT
    ) {
      result += GENERAL_CONFIG.district;
    }

    // case district -> city and vice versa
    if (
      (stationPickup.type === STATION_TYPE.DISTRICT &&
        stationDrop.type === STATION_TYPE.CITY) ||
      (stationPickup.type === STATION_TYPE.CITY &&
        stationDrop.type === STATION_TYPE.DISTRICT)
    ) {
      result += GENERAL_CONFIG.district;
    }

    return result;
  }
}
