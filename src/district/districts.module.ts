import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DistrictsController } from './districts.controller';
import { DistrictsService } from './districts.service';
import { DistrictProviders } from '../typeorm/providers/district.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [DistrictsController],
  providers: [...DistrictProviders, DistrictsService],
  exports: [DistrictsService],
})
export class DistrictsModule {}
