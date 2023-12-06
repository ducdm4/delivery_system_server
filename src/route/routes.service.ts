import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { RouteEntity } from '../typeorm/entities/route.entity';
import { CreateRoutesDto, UpdateRoutesDto } from './dto/routes.dto';
import { KeyValue } from '../common/constant';
import { StreetEntity } from '../typeorm/entities/street.entity';
import { StationEntity } from '../typeorm/entities/station.entity';

@Injectable()
export class RoutesService {
  constructor(
    @Inject('ROUTE_REPOSITORY')
    private routeRepository: Repository<RouteEntity>,
  ) {}

  async getListRoute(filter) {
    const filterOption: KeyValue = {
      employee: {},
      station: {},
    };
    if (filter.filter?.length) {
      filter.filter.forEach((sortItem) => {
        if (sortItem.key === 'station') {
          filterOption.station.id = sortItem.value;
        }
        if (sortItem.key === 'type') {
          filterOption.type = sortItem.value;
        }
      });
    }
    if (filter.keyword) {
      filterOption.station.name = Like(`%${filter.keyword}%`);
      filterOption.employee.user.firstName = Like(`%${filter.keyword}%`);
      filterOption.employee.user.lastName = Like(`%${filter.keyword}%`);
    }
    let paginateOption = {};
    if (filter.page) {
      paginateOption = {
        skip: (filter.page - 1) * filter.limit,
        take: filter.limit,
      };
    }
    let orderOption = {};
    if (filter.sort?.length) {
      filter.sort.forEach((sortItem) => {
        if (sortItem.key === 'station') {
          orderOption = {
            order: {
              station: {
                name: sortItem.value,
              },
            },
          };
        }
      });
    }
    const routeList = await this.routeRepository.find({
      relations: {
        streets: true,
        employee: {
          user: true,
        },
        station: true,
      },
      where: {
        ...filterOption,
      },
      ...paginateOption,
      ...orderOption,
    });

    const routeCount = await this.routeRepository.count({
      where: {
        ...filterOption,
      },
    });

    return {
      page: filter.page,
      total: routeCount,
      list: routeList,
    };
  }

  async getRouteById(id: number) {
    const route = await this.routeRepository.findOne({
      relations: {
        streets: true,
        employee: {
          user: true,
        },
        station: true,
        childStation: true,
        connectedStation: true,
      },
      where: {
        id,
      },
    });
    if (route) {
      return route;
    } else {
      throw new NotFoundException('route not found');
    }
  }

  async createRoute(routeData: CreateRoutesDto) {
    const newRoute = this.routeRepository.create({
      ...routeData,
      createdAt: new Date(),
    });
    const data = await this.routeRepository.save(newRoute);
    return data;
  }

  async updateRouteInfo(data: UpdateRoutesDto, id: number) {
    const checkRoute = await this.getRouteById(id);
    if (checkRoute) {
      const route = checkRoute;
      route.employee.id = data.employee.id;
      route.station.id = data.station.id;
      route.type = data.type;
      route.isGoToParent = data.isGoToParent;
      const streets = [];
      if (data.streets.length) {
        data.streets.forEach((str) => {
          const street = new StreetEntity();
          street.id = str.id;
          streets.push(street);
        });
      }
      checkRoute.streets = streets;

      const stations = [];
      if (data.childStation.length) {
        data.childStation.forEach((stn) => {
          const station = new StationEntity();
          station.id = stn.id;
          stations.push(station);
        });
      }
      const connectedStation = [];
      if (data.connectedStation.length) {
        data.connectedStation.forEach((stn) => {
          const station = new StationEntity();
          station.id = stn.id;
          connectedStation.push(station);
        });
      }
      checkRoute.childStation = stations;
      checkRoute.connectedStation = connectedStation;
      const res = await this.routeRepository.save(route);
      return res;
    }
  }

  async deleteRoute(id) {
    const checkRoute = await this.getRouteById(id);
    if (checkRoute) {
      const result = await this.routeRepository.softDelete(id);
      return result;
    }
  }

  async getRouteByStreet(stationId: number, type: number, streetId: number) {
    const route = await this.routeRepository.findOne({
      relations: {
        employee: {
          user: true,
        },
      },
      where: {
        station: {
          id: stationId,
        },
        type,
        streets: {
          id: streetId,
        },
      },
    });

    return route;
  }

  async getRouteRelativeStation(
    stationId: number,
    type: number,
    stationRelate: number,
  ) {
    const route = await this.routeRepository.findOne({
      relations: {
        employee: {
          user: true,
        },
        station: {
          parentStation: true,
        },
      },
      where: [
        {
          station: {
            id: stationId,
          },
          type,
          childStation: {
            id: stationRelate,
          },
        },
        {
          station: {
            id: stationId,
          },
          type,
          connectedStation: {
            id: stationRelate,
          },
        },
        {
          station: {
            id: stationId,
            parentStation: {
              id: stationRelate,
            },
          },
          type,
          isGoToParent: true,
        },
      ],
    });
    return route;
  }
}
