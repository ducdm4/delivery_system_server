import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EmployeesService } from './employees.service';
import { UsersService } from '../user/users.service';
import { AddressesService } from '../address/addresses.service';
import { ROLE_LIST } from '../common/constant';
import { Roles } from '../common/decorator/roles.decorator';
import {
  CreateEmployeeAdd,
  UploadedEditEmployeeDataDto,
  UploadedEmployeeDataDto,
} from './dto/employees.dto';
import { SearchInterface } from '../common/interface/search.interface';
import { encode } from 'html-entities';
import { generatePasswordString } from '../common/function';

@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly employeeService: EmployeesService,
    private readonly userService: UsersService,
    private readonly addressesService: AddressesService,
  ) {}

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
    const employeeList = this.employeeService.getListEmployee(filterObject);
    employeeList.then((employeesInfo) => {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: employeesInfo,
      });
    });
  }

  @Get(':id')
  @Roles([ROLE_LIST.ADMIN, ROLE_LIST.OPERATOR])
  findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const employeeInfo = this.employeeService.getEmployeeById(id);
    employeeInfo.then(
      (employeeInfo) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: { employeeInfo },
        });
      },
      (fail) => {
        res.status(fail.getStatus()).json({
          statusCode: fail.getStatus(),
          message: 'Employee not found',
          data: {},
        });
      },
    );
  }

  @Post()
  @Roles([ROLE_LIST.ADMIN])
  async createNewEmployee(
    @Body() createEmployeeData: UploadedEmployeeDataDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const addressAdded = await this.addressesService.createAddress(
      createEmployeeData.user.address,
    );

    const userData = createEmployeeData.user;
    userData.role = createEmployeeData.role;
    const password = generatePasswordString();
    const userAdded = await this.userService.addUser(
      userData,
      addressAdded.id,
      password,
      1,
    );

    const employeeToAdd: CreateEmployeeAdd = {
      ...createEmployeeData,
      user: {
        id: userAdded.id,
      },
      station: {
        id: createEmployeeData.station.id,
      },
    };

    const response = this.employeeService.createEmployee(employeeToAdd);
    response.then((employeeData) => {
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: { employeeInfo: employeeData },
      });
    });
  }

  @Put(':id')
  @Roles([ROLE_LIST.ADMIN])
  async editEmployeeInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeData: UploadedEditEmployeeDataDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.addressesService.updateAddressInfo(
      updateEmployeeData.user.address,
      updateEmployeeData.user.address.id,
    );

    const userData = updateEmployeeData.user;
    userData.role = updateEmployeeData.role;
    await this.userService.updateUser(userData.id, userData);
    const updateData = updateEmployeeData;
    delete updateData.user;
    delete updateData.role;
    const response = this.employeeService.updateEmployeeInfo(updateData, id);
    response.then(
      (response) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: {},
        });
      },
      (fail) => {
        res.status(fail.getStatus()).json({
          statusCode: fail.getStatus(),
          message: 'Employee not found',
          data: {},
        });
      },
    );
  }

  @Patch(':id')
  @Roles([ROLE_LIST.ADMIN, ROLE_LIST.OPERATOR])
  patchEmployeeInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { isVerified?: boolean; isActive?: boolean },
    @Res() res: Response,
  ) {
    const response = this.employeeService.updateEmployeeInfo(data, id);
    response.then(
      (employeeData) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: {},
        });
      },
      (fail) => {
        res.status(fail.getStatus()).json({
          statusCode: fail.getStatus(),
          message: 'Employee not found',
          data: {},
        });
      },
    );
  }

  @Delete(':id')
  @Roles([ROLE_LIST.ADMIN])
  deleteEmployeeInfo(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const response = this.employeeService.deleteEmployee(id);
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
          message: 'Employee not found',
          data: {},
        });
      },
    );
  }
}
