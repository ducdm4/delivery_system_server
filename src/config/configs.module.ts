import { Module } from '@nestjs/common';
import { ConfigsController } from './configs.controller';
import { ConfigsService } from './configs.service';
import { ConfigProviders } from '../typeorm/providers/config.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ConfigsController],
  providers: [...ConfigProviders, ConfigsService],
  exports: [ConfigsService],
})
export class ConfigsModule {}
