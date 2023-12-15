import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import {
  UpdateUserDto,
  CreateUserDto,
  ChangePasswordDto,
  UpdateUserPayloadDto,
} from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { EmployeesService } from 'src/employee/employees.service';
import { ROLE_LIST } from 'src/common/constant';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<UserEntity>,
    private mailService: MailService,
    private employeeService: EmployeesService,
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

  async addUser(
    user: CreateUserDto,
    addressId,
    password,
    sendMailType: number, // 1: send mail notify password, 2: send mail verify user
  ) {
    const { email } = user;
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
      ...user,
      address: addressId,
      password: hashedPassword,
      createdAt: new Date(),
    });
    await this.userRepository.save(newUser);
    if (sendMailType === 1) {
      await this.mailService.sendEmailCreateAccount({
        name: `${user.firstName} ${user.lastName}`,
        mail: email,
        password: password,
      });
    }
    return newUser;
  }

  async updateUser(id: number, updateUserDetails: UpdateUserDto) {
    return await this.userRepository.update({ id }, { ...updateUserDetails });
  }

  async updateSelfInfo(updateUserDetails: UpdateUserPayloadDto, id: number) {
    const data = updateUserDetails;
    if (data.role) delete data.role;
    const result = await this.userRepository.update({ id }, data);
    return result;
  }

  async updatePassword(passwordInfo: ChangePasswordDto, user: Express.User) {
    const userInfo = await this.userRepository.findOne({
      select: {
        firstName: true,
        lastName: true,
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
        await this.mailService.sendEmailChangePassword(
          `${userInfo.firstName} ${userInfo.lastName}`,
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

  async getUserVerified(id: number, role: number) {
    if (role !== ROLE_LIST.ADMIN) {
      const employee = await this.employeeService.getEmployeeVerify(id);
      return employee;
    }
    const userRes = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    const data = {
      ...userRes,
      employee: null,
    };
    return data;
  }
}
