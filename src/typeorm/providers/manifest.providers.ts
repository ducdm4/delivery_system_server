import { DataSource } from 'typeorm';
import { ManifestEntity } from '../entities/manifest.entity';

export const ManifestProviders = [
  {
    provide: 'MANIFEST_REPOSITORY',
    useFactory: (datasource: DataSource) =>
      datasource.getRepository(ManifestEntity),
    inject: ['DATA_SOURCE'],
  },
];
