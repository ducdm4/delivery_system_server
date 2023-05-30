import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../typeorm/entities/user.entity';
import { UsersService } from '../user/users.service';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/signIn.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<UserEntity>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(loginInfo: SignInDto) {
    const { email, password, role } = loginInfo;
    const user = await this.userRepository.findOneBy({
      email,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('ducm1', user.role);
    console.log('ducm2', loginInfo);
    if (isMatch && user.role === loginInfo.role) {
      delete user.password;
      delete user.refreshToken;
      const tokens = await this.getTokens(user);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return {
        tokens,
        user,
      };
    } else {
      throw new NotFoundException('Incorrect login info');
    }
  }

  async getTokens(user: Express.User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { user },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        { user },
        {
          secret: process.env.REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    await this.userRepository.update(
      { id: userId },
      { ...{ refreshToken: hashedRefreshToken } },
    );
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findUserById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
