import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AddressesService } from '../address/addresses.service';
import { EmployeesService } from '../employee/employees.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../database/database.module';
import { UserProviders } from '../typeorm/providers/user.providers';
import { AddressProviders } from '../typeorm/providers/address.providers';
import { EmployeeProviders } from '../typeorm/providers/employee.providers';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    ...UserProviders,
    ...AddressProviders,
    ...EmployeeProviders,
    UsersService,
    AddressesService,
    MailService,
    EmployeesService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
