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
import { DistrictsService } from './districts.service';
import { ROLE_LIST } from '../common/constant';
import { Roles } from '../common/decorator/roles.decorator';
import { UpdateDistrictDto } from './dto/updateDistrict.dto';
import { SearchInterface } from '../common/interface/search.interface';
import { encode } from 'html-entities';
import { CreateDistrictDto } from './dto/createDistrict.dto';

@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtService: DistrictsService) {}

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
    const citiList = this.districtService.getListDistrict(filterObject);
    citiList.then((citiesInfo) => {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: citiesInfo,
      });
    });
  }

  @Get(':id')
  @Roles([ROLE_LIST.ADMIN, ROLE_LIST.OPERATOR])
  findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const districtInfo = this.districtService.getDistrictById(id);
    districtInfo.then(
      (district) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: { district },
        });
      },
      (fail) => {
        res.status(fail.getStatus()).json({
          statusCode: fail.getStatus(),
          message: 'District not found',
          data: {},
        });
      },
    );
  }

  @Post()
  @Roles([ROLE_LIST.ADMIN])
  createNewDistrict(
    @Body() createDistrictDto: CreateDistrictDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.districtService.createDistrict(createDistrictDto);
    response.then((districtData) => {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: { districtInfo: districtData },
      });
    });
  }

  @Put(':id')
  @Roles([ROLE_LIST.ADMIN])
  editDistrictInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDistrictData: UpdateDistrictDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.districtService.updateDistrictInfo(
      updateDistrictData,
      id,
    );
    response.then(
      (districtData) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: {},
        });
      },
      (fail) => {
        res.status(fail.getStatus()).json({
          statusCode: fail.getStatus(),
          message: 'District not found',
          data: {},
        });
      },
    );
  }

  @Delete(':id')
  @Roles([ROLE_LIST.ADMIN])
  deleteDistrictInfo(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const response = this.districtService.deleteDistrict(id);
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
          message: 'District not found',
          data: {},
        });
      },
    );
  }
}
