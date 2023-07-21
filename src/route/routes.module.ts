import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { RouteProviders } from '../typeorm/providers/route.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [RoutesController],
  providers: [...RouteProviders, RoutesService],
  exports: [RoutesService],
})
export class RoutesModule {}
