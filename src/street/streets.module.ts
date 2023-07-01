import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { StreetsController } from './streets.controller';
import { StreetsService } from './streets.service';
import { StreetProviders } from '../typeorm/providers/street.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [StreetsController],
  providers: [...StreetProviders, StreetsService],
  exports: [StreetsService],
})
export class StreetsModule {}
