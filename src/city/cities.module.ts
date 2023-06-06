import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { CityProviders } from '../typeorm/providers/city.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [CitiesController],
  providers: [...CityProviders, CitiesService],
  exports: [CitiesService],
})
export class CitiesModule {}
