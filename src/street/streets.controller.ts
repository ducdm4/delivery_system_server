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
import { StreetsService } from './streets.service';
import { ROLE_LIST } from '../common/constant';
import { Roles } from '../common/decorator/roles.decorator';
import { UpdateStreetDto } from './dto/updateStreet.dto';
import { SearchInterface } from '../common/interface/search.interface';
import { encode } from 'html-entities';
import { CreateStreetDto } from './dto/createStreet.dto';

@Controller('streets')
export class StreetsController {
  constructor(private readonly streetService: StreetsService) {}

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
    const streetList = this.streetService.getListStreet(filterObject);
    streetList.then((streetsInfo) => {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: streetsInfo,
      });
    });
  }

  @Get(':id')
  @Roles([ROLE_LIST.ADMIN, ROLE_LIST.OPERATOR])
  findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const streetInfo = this.streetService.getStreetById(id);
    streetInfo.then(
      (street) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: { street },
        });
      },
      (fail) => {
        res.status(fail.getStatus()).json({
          statusCode: fail.getStatus(),
          message: 'Street not found',
          data: {},
        });
      },
    );
  }

  @Post()
  @Roles([ROLE_LIST.ADMIN])
  createNewStreet(
    @Body() createStreetDto: CreateStreetDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.streetService.createStreet(createStreetDto);
    response.then((streetData) => {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: { streetInfo: streetData },
      });
    });
  }

  @Put(':id')
  @Roles([ROLE_LIST.ADMIN])
  editStreetInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStreetData: UpdateStreetDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.streetService.updateStreetInfo(updateStreetData, id);
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
          message: 'Street not found',
          data: {},
        });
      },
    );
  }

  @Delete(':id')
  @Roles([ROLE_LIST.ADMIN])
  deleteStreetInfo(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const response = this.streetService.deleteStreet(id);
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
          message: 'Street not found',
          data: {},
        });
      },
    );
  }
}
