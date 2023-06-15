import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { WardsController } from './wards.controller';
import { WardsService } from './wards.service';
import { WardProviders } from '../typeorm/providers/ward.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [WardsController],
  providers: [...WardProviders, WardsService],
  exports: [WardsService],
})
export class WardsModule {}
