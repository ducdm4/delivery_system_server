import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AddressesService } from './addresses.service';
import { ROLE_LIST } from '../common/constant';
import { Roles } from '../common/decorator/roles.decorator';
import { UpdateAddressDto } from './dto/updateAddress.dto';
import { CreateAddressDto } from './dto/createAddress.dto';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressService: AddressesService) {}

  @Get(':id')
  @Roles([ROLE_LIST.ADMIN, ROLE_LIST.OPERATOR])
  findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const addressInfo = this.addressService.getAddressById(id);
    addressInfo.then(
      (address) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: { address },
        });
      },
      (fail) => {
        res.status(fail.getStatus()).json({
          statusCode: fail.getStatus(),
          message: 'address not found',
          data: {},
        });
      },
    );
  }

  @Post()
  @Roles([ROLE_LIST.ADMIN])
  createNewCity(
    @Body() createAddressDto: CreateAddressDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.addressService.createAddress(createAddressDto);
    response.then((addressData) => {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: { addressInfo: addressData },
      });
    });
  }

  @Put(':id')
  @Roles([ROLE_LIST.ADMIN])
  editCityInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAddressDto: UpdateAddressDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.addressService.updateAddressInfo(
      updateAddressDto,
      id,
    );
    response.then(
      (addressData) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: {},
        });
      },
      (fail) => {
        res.status(fail.getStatus()).json({
          statusCode: fail.getStatus(),
          message: 'Address not found',
          data: {},
        });
      },
    );
  }

  @Delete(':id')
  @Roles([ROLE_LIST.ADMIN])
  deleteCityInfo(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const response = this.addressService.deleteAddress(id);
    response.then(
      (data) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: {},
        });
      },
      (fail) => {
        res.status(fail.getStatus()).json({
          statusCode: fail.getStatus(),
          message: 'address not found',
          data: {},
        });
      },
    );
  }
}
