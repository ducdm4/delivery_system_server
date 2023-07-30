import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ParcelsService } from './parcels.service';
import { ParcelProviders } from '../typeorm/providers/parcel.providers';

@Module({
  imports: [DatabaseModule],
  providers: [...ParcelProviders, ParcelsService],
  exports: [ParcelsService],
})
export class ParcelsModule {}
