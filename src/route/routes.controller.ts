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
import { RoutesService } from './routes.service';
import { ROLE_LIST } from '../common/constant';
import { Roles } from '../common/decorator/roles.decorator';
import { SearchInterface } from '../common/interface/search.interface';
import { encode } from 'html-entities';
import { CreateRoutesDto, UpdateRoutesDto } from './dto/routes.dto';
import { getFilterObject } from '../common/function';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routeService: RoutesService) {}

  @Get()
  @Roles([ROLE_LIST.ADMIN])
  findAllWithFilter(@Req() req: Request, @Res() res: Response) {
    let routeList = null;
    const filterObject = getFilterObject(req);
    if (Object.entries(req.query).length === 0) {
      routeList = this.routeService.getListRoute('');
    } else {
      routeList = this.routeService.getListRoute(filterObject);
    }
    routeList.then((routes) => {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: routes,
      });
    });
  }

  @Get(':id')
  @Roles([ROLE_LIST.ADMIN, ROLE_LIST.OPERATOR])
  findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const routeInfo = this.routeService.getRouteById(id);
    routeInfo.then(
      (route) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: { route },
        });
      },
      (fail) => {
        res.status(fail.getStatus()).json({
          statusCode: fail.getStatus(),
          message: 'Route not found',
          data: {},
        });
      },
    );
  }

  @Post()
  @Roles([ROLE_LIST.ADMIN])
  createNewRoute(
    @Body() createRouteDto: CreateRoutesDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.routeService.createRoute(createRouteDto);
    response.then((routeData) => {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: { routeInfo: routeData },
      });
    });
  }
  //
  @Put(':id')
  @Roles([ROLE_LIST.ADMIN])
  editRouteInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRouteData: UpdateRoutesDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.routeService.updateRouteInfo(updateRouteData, id);
    response.then(
      (routeData) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: {},
        });
      },
      (fail) => {
        res.status(fail.getStatus()).json({
          statusCode: fail.getStatus(),
          message: 'Route not found',
          data: {},
        });
      },
    );
  }

  @Delete(':id')
  @Roles([ROLE_LIST.ADMIN])
  deleteRouteInfo(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const response = this.routeService.deleteRoute(id);
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
          message: 'Route not found',
          data: {},
        });
      },
    );
  }
}
