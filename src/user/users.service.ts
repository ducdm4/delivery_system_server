import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto, CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<UserEntity>,
  ) {}
  getUser() {
    return this.userRepository.find();
  }

  async findUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (user) {
      return user;
    } else {
      throw new BadRequestException('user not found');
    }
  }

  async addUser(user: CreateUserDto) {
    const { email, password } = user;
    const existingUser = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new BadRequestException('user existed');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });
    await this.userRepository.save(newUser);
    return newUser.id;
  }

  async updateUser(id: number, updateUserDetails: UpdateUserDto) {
    return await this.userRepository.update({ id }, { ...updateUserDetails });
  }

  async findSelfUser(user: Express.User) {
    const userLoggedInfo = await this.userRepository.findOne({
      relations: {
        profilePicture: true,
        address: true,
      },
      where: {
        email: user['email'],
      },
    });
    return userLoggedInfo;
  }
}
