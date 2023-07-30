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
import { getFilterObject } from '../common/function';

@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtService: DistrictsService) {}

  @Get()
  findAllWithFilter(@Req() req: Request, @Res() res: Response) {
    const filterObject = getFilterObject(req);
    const districtList = this.districtService.getListDistrict(filterObject);
    districtList.then((districtsInfo) => {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: districtsInfo,
      });
    });
  }

  @Get(':id')
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
