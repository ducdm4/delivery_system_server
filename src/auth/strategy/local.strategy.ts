import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
    });
  }

  validate(req: Request) {
    const tokens = this.authService.signIn(req.body);
    if (!tokens) {
      throw new UnauthorizedException('signin failed');
    }
    return tokens;
  }
}
