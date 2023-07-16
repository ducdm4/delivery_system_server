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
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StationsService } from './stations.service';
import { ROLE_LIST } from '../common/constant';
import { Roles } from '../common/decorator/roles.decorator';
import { SearchInterface } from '../common/interface/search.interface';
import { encode } from 'html-entities';
import { UpdateStationDto, CreateStationDto } from './dto/station.dto';
import { AddressesService } from '../address/addresses.service';
import { WardsService } from '../ward/wards.service';
import { PhotosService } from '../photo/photos.service';

@Controller('stations')
export class StationsController {
  constructor(
    private readonly addressService: AddressesService,
    private readonly stationService: StationsService,
    private readonly wardsService: WardsService,
    private readonly photosService: PhotosService,
  ) {}

  @Get()
  @Roles([ROLE_LIST.ADMIN])
  findAllWithFilter(@Req() req: Request, @Res() res: Response) {
    const filterObject: SearchInterface = {
      keyword: '',
      sort: [],
      filter: [],
      page: 0,
      limit: 10,
    };
    if (typeof req.query['keyword'] === 'string') {
      filterObject.keyword = encode(req.query['keyword']);
    }
    if (typeof req.query['sort'] === 'object') {
      for (const [key, value] of Object.entries(req.query['sort'])) {
        filterObject.sort.push({
          key,
          value: value as string,
        });
      }
    }
    if (typeof req.query['filter'] === 'object') {
      for (const [key, value] of Object.entries(req.query['filter'])) {
        filterObject.filter.push({
          key,
          value: value as string,
        });
      }
    }
    if (typeof req.query['page'] === 'string') {
      filterObject.page = parseInt(req.query['page']);
    }
    if (typeof req.query['limit'] === 'string') {
      filterObject.limit = parseInt(req.query['limit']);
    }
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

    const wardListCurrent = await this.wardsService.getWardUnderManage(id);
    const listWardNotIncluded = wardListCurrent.filter((ward) => {
      return updateStationData.wards.findIndex((x) => x.id === ward.id) < 0;
    });
    const listWardNeedToAdd = updateStationData.wards.filter((ward) => {
      return wardListCurrent.findIndex((x) => x.id === ward.id) < 0;
    });
    await this.wardsService.updateWardStation(
      null,
      listWardNotIncluded.map((ward) => ward.id),
    );
    await this.wardsService.updateWardStation(
      id,
      listWardNeedToAdd.map((ward) => ward.id),
    );

    const listCurrentPhoto = await this.photosService.findPhotoByStation(id);
    const listPhotoToDelete = listCurrentPhoto.filter((photo) => {
      return updateStationData.photos.findIndex((x) => x.id === photo.id) < 0;
    });
    await this.photosService.deleteMultiplePhoto(
      listPhotoToDelete.map((photo) => photo.id),
    );
    const listPhotoNeedAddStation = updateStationData.photos.filter((photo) => {
      return listCurrentPhoto.findIndex((x) => x.id === photo.id);
    });
    await this.photosService.updatePhotoStation(
      listPhotoNeedAddStation.map((photo) => photo.id),
      id,
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
