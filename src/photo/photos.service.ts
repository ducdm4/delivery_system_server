import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { PhotoEntity } from '../typeorm/entities/photo.entity';

@Injectable()
export class PhotosService {
  constructor(
    @Inject('PHOTO_REPOSITORY')
    private photoRepository: Repository<PhotoEntity>,
  ) {}

  async getPhotoById(id: number) {
    const photo = await this.photoRepository.findOne({
      where: {
        id,
      },
    });
    if (photo) {
      return photo;
    } else {
      throw new NotFoundException('photo not found');
    }
  }

  async createPhoto(photoData) {
    const newPhoto = this.photoRepository.create({
      name: photoData.filename,
      mimeType: photoData.mimetype,
      createdAt: new Date(),
    });
    const data = await this.photoRepository.save(newPhoto);
    return data;
  }

  async deletePhoto(id) {
    const checkCity = await this.getPhotoById(id);
    if (checkCity) {
      const result = await this.photoRepository.softDelete(id);
      return result;
    }
  }

  async deleteMultiplePhoto(ids: Array<number>) {
    return await this.photoRepository.softDelete({
      id: In(ids),
    });
  }

  async updatePhotoStation(ids: Array<number>, stationId: number) {
    const updatePhoto = await this.photoRepository.update(
      {
        id: In(ids),
      },
      {
        station: {
          id: stationId,
        },
      },
    );
    return updatePhoto;
  }

  async findPhotoByStation(stationId: number) {
    const photoList = await this.photoRepository.findBy({
      station: {
        id: stationId,
      },
    });
    return photoList;
  }
}
