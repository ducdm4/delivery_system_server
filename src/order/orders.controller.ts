import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  Sse,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { OrdersService } from './orders.service';
import { StationsService } from '../station/stations.service';
import {
  BasicOrderInfo,
  CollectorCancelOrderData,
  OrderInfoQuote,
} from './dto/order.dto';
import { GENERAL_CONFIG, ROLE_LIST, STATION_TYPE } from '../common/constant';
import { Roles } from '../common/decorator/roles.decorator';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { MailService } from 'src/mail/mail.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly stationsService: StationsService,
    private eventEmitter: EventEmitter2,
    private mailService: MailService,
  ) {}

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
      this.eventEmitter.emit('new-order', { station: stationPickup.id });
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
    @Param('status') status: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const stationId =
      req.user['role'] === ROLE_LIST.OPERATOR
        ? req.user['employeeInfo']['station']['id']
        : null;
    const orderList = this.ordersService.getOrderByStatus(
      status.split(','),
      stationId,
    );
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

  @Patch('/cancelOrderOperator/:id')
  @Roles([ROLE_LIST.ADMIN, ROLE_LIST.OPERATOR])
  async cancelOrderByOperator(
    @Body() data: { note: string },
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const stationId =
      req.user['role'] === ROLE_LIST.OPERATOR
        ? req.user['employeeInfo']['station']['id']
        : null;
    const response = this.ordersService.cancelOrderByOperator(
      id,
      data.note,
      stationId,
    );
    response.then(
      (data) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data,
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

  @Patch('/operatorConfirmOrder/:id')
  @Roles([ROLE_LIST.ADMIN, ROLE_LIST.OPERATOR])
  async operatorConfirmOrder(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const stationId =
      req.user['role'] === ROLE_LIST.OPERATOR
        ? req.user['employeeInfo']['station']['id']
        : null;
    const response = this.ordersService.operatorConfirmOrder(id, stationId);
    response.then(
      (data) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: {},
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

  @Patch('/collectorCancel/:trackingId')
  @Roles([ROLE_LIST.COLLECTOR])
  async collectorCancelOrder(
    @Param('trackingId', ParseIntPipe) trackingId: string,
    @Body() collectorCancelOrderData: CollectorCancelOrderData,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.ordersService.cancelOrderByCollector(
      trackingId,
      collectorCancelOrderData,
      req.user['id'],
    );
    response.then(
      (data) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: {},
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

  @Patch('/collectorConfirm/:trackingId')
  @Roles([ROLE_LIST.COLLECTOR])
  async collectorConfirmOrder(
    @Param('trackingId', ParseIntPipe) trackingId: string,
    @Body() collectorCancelOrderData: CollectorCancelOrderData,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.ordersService.confirmOrderByCollector(
      trackingId,
      collectorCancelOrderData,
      req.user['id'],
    );
    response.then(
      (data) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: {},
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

  @Patch('/orderArrivedStation/:trackingId')
  @Roles([ROLE_LIST.OPERATOR])
  async orderArrivedStation(
    @Param('trackingId', ParseIntPipe) trackingId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.ordersService.confirmOrderArrivedStation(
      trackingId,
      req.user['employeeInfo']['station']['id'],
    );
    response.then(
      (data) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: {},
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

    // case same city
    if (
      createOrderData.pickupAddress.city.id ===
      createOrderData.dropOffAddress.city.id
    ) {
      result += GENERAL_CONFIG.city;
    } else {
      result += GENERAL_CONFIG.differentCity;
    }

    return result;
  }

  @Patch('/shipperConfirmed/:trackingId')
  @Roles([ROLE_LIST.SHIPPER])
  async shipperAddedToBasket(
    @Param('trackingId', ParseIntPipe) trackingId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.ordersService.shipperAddedToBasket(
      trackingId,
      req.user['id'],
    );
    response.then(
      (data) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: {},
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

  @Patch('/shipperCancel/:trackingId')
  @Roles([ROLE_LIST.SHIPPER])
  async shipperCancelOrder(
    @Param('trackingId', ParseIntPipe) trackingId: string,
    @Body() shipperCancelOrderData: CollectorCancelOrderData,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.ordersService.cancelOrderByShipper(
      trackingId,
      shipperCancelOrderData,
      req.user['id'],
    );
    response.then(
      (data) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: {},
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

  @Patch('/shipperShipped/:trackingId')
  @Roles([ROLE_LIST.SHIPPER])
  async shipperShippedOrder(
    @Param('trackingId', ParseIntPipe) trackingId: string,
    @Body() shipperShippedOrderData: CollectorCancelOrderData,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.ordersService.shippedOrderByShipper(
      trackingId,
      shipperShippedOrderData,
      req.user['id'],
    );
    response.then(
      (data) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: {},
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

  @Get('/tracking/:id')
  async getTrackingForOrder(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const trackingList = this.ordersService.getAllTrackingOfOrder(id);
    trackingList.then(
      (trackings) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: { trackings },
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

  @Patch('/customerRequestCancel/:trackingId')
  async customerRequestCancel(
    @Param('trackingId') trackingId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const OTP = await this.ordersService.sendOTPCancel(trackingId);
    if (OTP) {
      await this.mailService.sendEmailOTPCancelOrder(OTP, trackingId);
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {},
      });
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Can not cancel order',
        data: {},
      });
    }
  }

  @Patch('/customerConfirmCancel/:trackingId')
  async customerConfirmCancel(
    @Param('trackingId') trackingId: string,
    @Body() data: { otp: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.ordersService.customerConfirmCancel(
      trackingId,
      data.otp,
    );
    response.then(
      (data) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data,
        });
      },
      (fail) => {
        res
          .status(fail.getStatus === 'function' ? fail.getStatus() : 500)
          .json({
            statusCode:
              typeof fail.getStatus === 'function' ? fail.getStatus() : 500,
            message: 'Order not cancelable',
            data: {},
          });
      },
    );
  }

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'new-order').pipe(
      map((data) => {
        return new MessageEvent('new-order', { data });
      }),
    );
  }
}
