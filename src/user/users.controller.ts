import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  Put,
  Param,
  ParseIntPipe,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersPipe } from './pipes/users.pipe';
import { RolesGuard } from '../common/guard/roles.guard';
import { Roles } from '../common/decorator/roles.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Roles(['admin', 'operator'])
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
