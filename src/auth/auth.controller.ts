import {
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Res,
  HttpStatus,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { GetUser } from '../common/decorator/get-user.decorator';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { UserEntity } from '../typeorm/entities/user.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req: Request, @Res() res: Response) {
    const data = req.user;
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data,
    });
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(
    @Req() req: Request,
    @Res() res: Response,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    const { id } = refreshTokenDto;
    const tokens = req.user;
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: { tokens },
    });
  }

  @Post('verify')
  @UseGuards(AuthGuard('jwt'))
  verifyUser(@Req() req: Request, @Res() res: Response) {
    const user: Express.User = req.user;
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: { user },
    });
  }
}
