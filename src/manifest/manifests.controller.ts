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
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ManifestsService } from './manifests.service';
import {
  GENERAL_CONFIG,
  MANIFEST_TYPE,
  ROLE_LIST,
  STATION_TYPE,
} from '../common/constant';
import { Roles } from '../common/decorator/roles.decorator';

@Controller('manifests')
export class ManifestsController {
  constructor(private readonly manifestsService: ManifestsService) {}

  @Get('/current')
  @Roles([ROLE_LIST.COLLECTOR, ROLE_LIST.SHIPPER])
  getEmployeeCurrentManifest(@Req() req: Request, @Res() res: Response) {
    const response = this.manifestsService.findEmployeeCurrentManifest(
      req.user['employeeInfo']['id'],
      req.user['role'] === ROLE_LIST.COLLECTOR
        ? MANIFEST_TYPE.PICKUP
        : MANIFEST_TYPE.DROP,
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
            message: 'Manifest not found',
            data: {},
          });
      },
    );
  }

  @Get('/new')
  @Roles([ROLE_LIST.COLLECTOR, ROLE_LIST.SHIPPER])
  getNewManifest(@Req() req: Request, @Res() res: Response) {
    const response = this.manifestsService.createNewCollectorManifest(
      req.user['employeeInfo']['id'],
      req.user['id'],
      req.user['role'] === ROLE_LIST.COLLECTOR
        ? MANIFEST_TYPE.PICKUP
        : MANIFEST_TYPE.DROP,
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
            message: 'Manifest not found',
            data: {},
          });
      },
    );
  }
}
