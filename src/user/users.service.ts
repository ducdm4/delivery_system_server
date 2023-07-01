import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import {
  UpdateUserDto,
  CreateUserDto,
  ChangePasswordDto,
} from './dto/user.dto';
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

  async updateSelfInfo(updateUserDetails: UpdateUserDto) {
    const result = await this.userRepository.update(
      { id: updateUserDetails.id },
      updateUserDetails,
    );
    return result;
  }

  async updatePassword(passwordInfo: ChangePasswordDto, user: Express.User) {
    const userInfo = await this.userRepository.findOne({
      select: {
        password: true,
      },
      where: {
        id: user['id'],
      },
    });
    const isMatch = await bcrypt.compare(
      passwordInfo.oldPassword,
      userInfo.password,
    );
    if (isMatch) {
      const reg =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/;
      if (reg.test(passwordInfo.newPassword)) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(
          passwordInfo.newPassword,
          salt,
        );
        const result = await this.userRepository.update(
          { id: user['id'] },
          { password: hashedPassword },
        );
        return result;
      } else {
        throw new BadRequestException('New password not meet requirements!');
      }
    } else {
      throw new BadRequestException('Wrong current password!');
    }
  }

  async findSelfUser(user: Express.User) {
    const userLoggedInfo = await this.userRepository.findOne({
      relations: {
        profilePicture: true,
        address: {
          city: true,
          district: true,
          ward: true,
          street: true,
        },
      },
      where: {
        email: user['email'],
      },
    });
    return userLoggedInfo;
  }
}
