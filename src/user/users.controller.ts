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
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
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

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUserById(id);
  }

  @Post()
  async create(
    @Body('', UsersPipe) createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.userService.addUser(createUserDto);
    res.status(HttpStatus.OK).json({ id: user });
  }

  @Put(':id')
  updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    this.userService.updateUser(id, updateUserDto);
  }
}
