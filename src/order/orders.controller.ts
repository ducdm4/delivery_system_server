import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { OrdersService } from './orders.service';
import { ROLE_LIST } from '../common/constant';
import { Roles } from '../common/decorator/roles.decorator';
import { createReadStream, open } from 'fs';
import { join } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { BasicOrderInfo } from './dto/order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createNewOrder(
    @Body() createOrderData: BasicOrderInfo,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.ordersService.createOrder(createOrderData);
    response.then((orderInfo) => {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: { orderInfo },
      });
    });
  }
}
