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
  @Roles([ROLE_LIST.COLLECTOR])
  getEmployeeCurrentManifest(@Req() req: Request, @Res() res: Response) {
    const response = this.manifestsService.findEmployeeCurrentManifest(
      req.user['employeeInfo']['id'],
      MANIFEST_TYPE.PICKUP,
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
  @Roles([ROLE_LIST.COLLECTOR])
  getNewManifest(@Req() req: Request, @Res() res: Response) {
    const response = this.manifestsService.createNewCollectorManifest(
      req.user['employeeInfo']['id'],
      MANIFEST_TYPE.PICKUP,
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
