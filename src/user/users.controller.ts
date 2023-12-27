import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
  Sse,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserPayloadDto,
  ChangePasswordDto,
} from './dto/user.dto';
import { Response, Request } from 'express';
import { UsersService } from './users.service';
import { UsersPipe } from './pipes/users.pipe';
import { Roles } from '../common/decorator/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ROLE_LIST } from '../common/constant';
import { AddressesService } from '../address/addresses.service';
import { generatePasswordString } from '../common/function';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly addressService: AddressesService,
  ) {}

  @Roles([ROLE_LIST.ADMIN, ROLE_LIST.OPERATOR])
  @Get()
  findAll() {
    return this.userService.getUser();
  }

  @Roles([ROLE_LIST.ADMIN])
  @Get('detail/:id')
  @UseGuards(AuthGuard('jwt'))
  findUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUserById(id);
  }

  @Get('self')
  @UseGuards(AuthGuard('jwt'))
  async getLoggedInUser(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    const userInfo = await this.userService.findSelfUser(user);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        userInfo,
      },
    });
  }

  @Post()
  @Roles([ROLE_LIST.ADMIN, ROLE_LIST.OPERATOR])
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const addressInfo = await this.addressService.createAddress(
      createUserDto.address,
    );
    const addressId = addressInfo.id;
    const password = generatePasswordString();
    const user = await this.userService.addUser(
      createUserDto,
      addressId,
      password,
      1,
    );
    res.status(HttpStatus.OK).json({ id: user });
  }

  @Post('register')
  async selfRegisterUser(
    @Body('', UsersPipe) createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    // const user = await this.userService.addUser(createUserDto);
    // res.status(HttpStatus.OK).json({ id: user });
  }

  @Put('detail/:id')
  @Roles([ROLE_LIST.ADMIN, ROLE_LIST.OPERATOR])
  updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserPayloadDto: UpdateUserPayloadDto,
  ) {
    // this.userService.updateUser(id, updateUserPayloadDto);
  }

  @Put('change-password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(
    @Body() passwordInfo: ChangePasswordDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user;
    const response = await this.userService.updatePassword(passwordInfo, user);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        response,
      },
    });
  }

  @Put('self')
  @Roles([
    ROLE_LIST.ADMIN,
    ROLE_LIST.OPERATOR,
    ROLE_LIST.COLLECTOR,
    ROLE_LIST.SHIPPER,
  ])
  async updateSelfInfo(
    @Body() updateUserPayloadDto: UpdateUserPayloadDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    let addressInfo;
    const updateUserDto = updateUserPayloadDto;
    if (updateUserPayloadDto.address) {
      if (updateUserPayloadDto.address.id) {
        addressInfo = await this.addressService.updateAddressInfo(
          updateUserPayloadDto.address,
          updateUserPayloadDto.address.id,
        );
      } else {
        addressInfo = await this.addressService.createAddress(
          updateUserPayloadDto.address,
        );
      }
      updateUserDto.address = addressInfo.id;
    }

    const userInfo = await this.userService.updateSelfInfo(
      updateUserDto,
      req.user['id'],
    );
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        userInfo,
      },
    });
  }

  @Put('notification')
  @Roles([ROLE_LIST.COLLECTOR, ROLE_LIST.SHIPPER])
  async updateNotificationToken(
    @Body() data: { token: string },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const response = this.userService.updateNotificationToken(
      req.user['id'],
      data.token,
    );
    response.then(
      (data) => {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          data: data,
        });
      },
      (fail) => {
        res
          .status(fail.getStatus === 'function' ? fail.getStatus() : 500)
          .json({
            statusCode:
              typeof fail.getStatus === 'function' ? fail.getStatus() : 500,
            message: 'Something went wrong',
            data: {},
          });
      },
    );
  }
}
