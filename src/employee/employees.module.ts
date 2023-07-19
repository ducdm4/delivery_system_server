import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { UsersService } from '../user/users.service';
import { AddressesService } from '../address/addresses.service';
import { MailService } from '../mail/mail.service';
import { EmployeeProviders } from '../typeorm/providers/employee.providers';
import { AddressProviders } from '../typeorm/providers/address.providers';
import { UserProviders } from '../typeorm/providers/user.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [EmployeesController],
  providers: [
    ...EmployeeProviders,
    ...AddressProviders,
    ...UserProviders,
    EmployeesService,
    UsersService,
    AddressesService,
    MailService,
  ],
  exports: [EmployeesService],
})
export class EmployeesModule {}
