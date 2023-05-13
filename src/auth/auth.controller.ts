import {
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  Res,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { GetUser } from '../common/decorator/get-user.decorator';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req: Request, @Res() res: Response) {
    const tokens = req.user;
    res.status(HttpStatus.OK).json(tokens);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(
    @Req() req: Request,
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res() res: Response,
  ) {
    const { id } = refreshTokenDto;
    const tokens = req.user;
    res.status(HttpStatus.OK).json(tokens);
  }

  @Get('test')
  @UseGuards(AuthGuard('jwt'))
  test(@GetUser() user) {
    return user;
  }
}
