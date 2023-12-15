import {
  Controller,
  Post,
  UseGuards,
  Req,
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
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { UsersService } from 'src/user/users.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
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
  async verifyUser(@Req() req: Request, @Res() res: Response) {
    const user: Express.User = req.user;
    if (user) {
      const response = await this.userService.getUserVerified(
        user['id'],
        user['role'],
      );
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        data: response,
      });
    } else {
      res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        data: {},
      });
    }
  }
}
