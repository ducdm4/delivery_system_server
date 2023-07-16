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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserPayloadDto,
  UpdateUserDto,
  ChangePasswordDto,
} from './dto/user.dto';
import { Response, Request } from 'express';
import { UsersService } from './users.service';
import { UsersPipe } from './pipes/users.pipe';
import { Roles } from '../common/decorator/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ROLE_LIST } from '../common/constant';
import { AddressesService } from '../address/addresses.service';

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
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz'[
      Math.floor(Math.random() * 26)
    ];
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[
      Math.floor(Math.random() * 26)
    ];
    const special = ')!@#$%^&*('[Math.floor(Math.random() * 10)];
    const password = `${lowerCase}${upperCase}${special}${Math.floor(
      Math.random() * 1000,
    )}`;
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
  @Roles([ROLE_LIST.ADMIN, ROLE_LIST.OPERATOR])
  async updateSelfInfo(
    @Body() updateUserPayloadDto: UpdateUserPayloadDto,
    @Res() res: Response,
  ) {
    let addressInfo;
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
    const updateUserDto = updateUserPayloadDto;
    updateUserDto.address = addressInfo.id;
    const userInfo = await this.userService.updateSelfInfo(updateUserDto);
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: {
        userInfo,
      },
    });
  }
}
