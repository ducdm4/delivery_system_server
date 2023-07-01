import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AddressesService } from '../address/addresses.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../database/database.module';
import { UserProviders } from '../typeorm/providers/user.providers';
import { AddressProviders } from '../typeorm/providers/address.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    ...UserProviders,
    ...AddressProviders,
    UsersService,
    AddressesService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
