import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../user/users.service';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  async use(req: Request | any, res: Response, next: () => void) {
    const bearerHeader = req.headers.authorization;
    const accessToken = bearerHeader && bearerHeader.split(' ')[1];
    let user;
    if (!bearerHeader || !accessToken) {
      return next();
    }

    try {
      const verifyRes = verify(accessToken, process.env.JWT_SECRET);
      user = verifyRes;
    } catch (error) {
      throw new UnauthorizedException('Please sign in');
    }
    if (user) {
      req.user = user;
    }

    next();
  }
}
