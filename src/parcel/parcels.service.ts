import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { ParcelEntity } from '../typeorm/entities/parcel.entity';

@Injectable()
export class ParcelsService {
  constructor(
    @Inject('PARCEL_REPOSITORY')
    private parcelRepository: Repository<ParcelEntity>,
  ) {}

  async createParcel(parcelData) {
    const newPhoto = this.parcelRepository.create({
      ...parcelData,
    });
    try {
      const data = await this.parcelRepository.save(newPhoto);
      return data;
    } catch (e) {
      return e;
    }
  }
}
