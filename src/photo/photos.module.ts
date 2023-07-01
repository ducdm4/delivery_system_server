import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { PhotoProviders } from '../typeorm/providers/photo.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [PhotosController],
  providers: [...PhotoProviders, PhotosService],
  exports: [PhotosService],
})
export class PhotosModule {}
