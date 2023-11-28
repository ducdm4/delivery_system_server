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
import { StationsService } from './stations.service';
import { ROLE_LIST } from '../common/constant';
import { Roles } from '../common/decorator/roles.decorator';
import { UpdateStationDto, CreateStationDto } from './dto/station.dto';
import { AddressesService } from '../address/addresses.service';
import { getFilterObject } from '../common/function';

@Controller('stations')
export class StationsController {
  constructor(
    private readonly addressService: AddressesService,
    private readonly stationService: StationsService,
  ) {}

  @Get()
  @Roles([ROLE_LIST.ADMIN])
  findAllWithFilter(@Req() req: Request, @Res() res: Response) {
    const filterObject = getFilterObject(req);
    const stationList = this.stationService.getListStation(filterObject);
    stationList.then((stationsInfo) => {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: stationsInfo,
      });
    });
  }

  @Get(':id')
  @Roles([ROLE_LIST.ADMIN, ROLE_LIST.OPERATOR])
  findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const stationInfo = this.stationService.getStationById(id);
    stationInfo.then(
      (station) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: { station },
        });
      },
      (fail) => {
        res.status(fail.getStatus()).json({
          statusCode: fail.getStatus(),
          message: 'Station not found',
          data: {},
        });
      },
    );
  }

  @Get('child/:id')
  @Roles([ROLE_LIST.ADMIN, ROLE_LIST.OPERATOR])
  findChildStation(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const stationInfo = this.stationService.getChildStation(id);
    stationInfo.then(
      (stations) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: { stations },
        });
      },
      (fail) => {
        res.status(fail.getStatus()).json({
          statusCode: fail.getStatus(),
          message: 'Station not found',
          data: {},
        });
      },
    );
  }

  @Post()
  @Roles([ROLE_LIST.ADMIN])
  async createNewStation(
    @Body() createStationDto: CreateStationDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const addressInfo = await this.addressService.createAddress(
      createStationDto.address,
    );
    createStationDto.addressId = addressInfo.id;
    const response = this.stationService.createStation(createStationDto);
    response.then((stationData) => {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: { stationInfo: stationData },
      });
    });
  }

  @Put(':id')
  @Roles([ROLE_LIST.ADMIN])
  async editStationInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStationData: UpdateStationDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.addressService.updateAddressInfo(
      updateStationData.address,
      updateStationData.address.id,
    );

    const response = this.stationService.updateStationInfo(
      updateStationData,
      id,
    );
    response.then(
      (station) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: {},
        });
      },
      (fail) => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
          data: {},
        });
      },
    );
  }

  @Get('sameLevel/:type')
  @Roles([ROLE_LIST.ADMIN, ROLE_LIST.OPERATOR])
  async getSameLevelStation(
    @Param('type', ParseIntPipe) type: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.stationService.getStationWithSameType(type);
    response.then(
      (station) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: station,
        });
      },
      (fail) => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
          data: {},
        });
      },
    );
  }

  @Delete(':id')
  @Roles([ROLE_LIST.ADMIN])
  deleteStationInfo(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const response = this.stationService.deleteStation(id);
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
          message: 'Station not found',
          data: {},
        });
      },
    );
  }
}
