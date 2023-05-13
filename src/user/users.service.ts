import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
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

  updateUser(id: number, updateUserDetails: UpdateUserDto) {
    return this.userRepository.update({ id }, { ...updateUserDetails });
  }
}
