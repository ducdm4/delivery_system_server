import { DataSource } from 'typeorm';
import { PhotoEntity } from '../entities/photo.entity';

export const PhotoProviders = [
  {
    provide: 'PHOTO_REPOSITORY',
    useFactory: (datasource: DataSource) =>
      datasource.getRepository(PhotoEntity),
    inject: ['DATA_SOURCE'],
  },
];
