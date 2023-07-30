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
import { WardsService } from './wards.service';
import { ROLE_LIST } from '../common/constant';
import { Roles } from '../common/decorator/roles.decorator';
import { UpdateWardDto } from './dto/updateWard.dto';
import { SearchInterface } from '../common/interface/search.interface';
import { encode } from 'html-entities';
import { CreateWardDto } from './dto/createWard.dto';
import { getFilterObject } from '../common/function';

@Controller('wards')
export class WardsController {
  constructor(private readonly wardService: WardsService) {}

  @Get()
  findAllWithFilter(@Req() req: Request, @Res() res: Response) {
    const filterObject = getFilterObject(req);
    const wardList = this.wardService.getListWard(filterObject);
    wardList.then((wardsInfo) => {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: wardsInfo,
      });
    });
  }

  @Get('/not-under-manage/:id')
  @Roles([ROLE_LIST.ADMIN, ROLE_LIST.OPERATOR])
  findWardNotUnderManage(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const response = this.wardService.getWardNotUnderManage(id);
    response.then((data) => {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: {
          list: data,
        },
      });
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const wardInfo = this.wardService.getWardById(id);
    wardInfo.then(
      (ward) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: { ward },
        });
      },
      (fail) => {
        res.status(fail.getStatus()).json({
          statusCode: fail.getStatus(),
          message: 'Ward not found',
          data: {},
        });
      },
    );
  }

  @Post()
  @Roles([ROLE_LIST.ADMIN])
  createNewWard(
    @Body() createWardDto: CreateWardDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.wardService.createWard(createWardDto);
    response.then((wardData) => {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: { wardInfo: wardData },
      });
    });
  }

  @Put(':id')
  @Roles([ROLE_LIST.ADMIN])
  editWardInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWardData: UpdateWardDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.wardService.updateWardInfo(updateWardData, id);
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
          message: 'Ward not found',
          data: {},
        });
      },
    );
  }

  @Delete(':id')
  @Roles([ROLE_LIST.ADMIN])
  deleteWardInfo(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const response = this.wardService.deleteWard(id);
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
          message: 'Ward not found',
          data: {},
        });
      },
    );
  }
}
