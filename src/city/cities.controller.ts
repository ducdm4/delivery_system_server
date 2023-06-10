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
import { CitiesService } from './cities.service';
import { ROLE_LIST } from '../common/constant';
import { Roles } from '../common/decorator/roles.decorator';
import { UpdateCityDto } from './dto/updateCity.dto';
import { SearchInterface } from '../common/interface/search.interface';
import { encode } from 'html-entities';
import { CreateCityDto } from './dto/createCity.dto';

@Controller('cities')
export class CitiesController {
  constructor(private readonly cityService: CitiesService) {}

  @Get()
  @Roles([ROLE_LIST.ADMIN])
  findAllWithFilter(@Req() req: Request, @Res() res: Response) {
    console.log('req.query', req.query);
    let citiList = null;
    const filterObject: SearchInterface = {
      keyword: '',
      sort: [],
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
    if (typeof req.query['page'] === 'string') {
      filterObject.page = parseInt(req.query['page']);
    }
    if (typeof req.query['limit'] === 'string') {
      filterObject.limit = parseInt(req.query['limit']);
    }
    if (Object.entries(req.query).length === 0) {
      citiList = this.cityService.getListCity('');
    } else {
      citiList = this.cityService.getListCity(filterObject);
    }
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
    const cityInfo = this.cityService.getCityById(id);
    cityInfo.then(
      (city) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: { city },
        });
      },
      (fail) => {
        res.status(fail.getStatus()).json({
          statusCode: fail.getStatus(),
          message: 'City not found',
          data: {},
        });
      },
    );
  }

  @Post()
  @Roles([ROLE_LIST.ADMIN])
  createNewCity(
    @Body() createCityDto: CreateCityDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.cityService.createCity(createCityDto);
    response.then((cityData) => {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: { cityInfo: cityData },
      });
    });
  }

  @Put(':id')
  @Roles([ROLE_LIST.ADMIN])
  editCityInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCityData: UpdateCityDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.cityService.updateCityInfo(updateCityData, id);
    response.then(
      (cityData) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: {},
        });
      },
      (fail) => {
        res.status(fail.getStatus()).json({
          statusCode: fail.getStatus(),
          message: 'City not found',
          data: {},
        });
      },
    );
  }

  @Delete(':id')
  @Roles([ROLE_LIST.ADMIN])
  deleteCityInfo(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const response = this.cityService.deleteCity(id);
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
          message: 'City not found',
          data: {},
        });
      },
    );
  }
}
