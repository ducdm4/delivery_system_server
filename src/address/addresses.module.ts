import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { AddressProviders } from '../typeorm/providers/address.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [AddressesController],
  providers: [...AddressProviders, AddressesService],
  exports: [AddressesService],
})
export class AddressesModule {}
