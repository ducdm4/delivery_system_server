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
import { CreateUserDto } from './dto/user.dto';
import { Response, Request } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
import { UsersPipe } from './pipes/users.pipe';
import { Roles } from '../common/decorator/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ROLE_LIST } from '../common/constant';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

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
  // @Roles([ROLE_LIST.ADMIN, ROLE_LIST.OPERATOR])
  async create(
    @Body('', UsersPipe) createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.userService.addUser(createUserDto);
    res.status(HttpStatus.OK).json({ id: user });
  }

  @Put(':id')
  @Roles([ROLE_LIST.ADMIN, ROLE_LIST.OPERATOR])
  updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    this.userService.updateUser(id, updateUserDto);
  }
}
