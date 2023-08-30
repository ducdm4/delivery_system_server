import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigsService } from './configs.service';
import { GENERAL_CONFIG } from '../common/constant';

@Controller('configs')
export class ConfigsController {
  constructor(private readonly cityService: ConfigsService) {}

  @Get()
  findAll(@Req() req: Request, @Res() res: Response) {
    const configs = GENERAL_CONFIG;
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: configs,
    });
  }
}
