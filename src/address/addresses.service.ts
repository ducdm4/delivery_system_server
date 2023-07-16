import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { AddressEntity } from '../typeorm/entities/address.entity';
import { CreateAddressDto } from './dto/createAddress.dto';
import { UpdateAddressDto } from './dto/updateAddress.dto';

@Injectable()
export class AddressesService {
  constructor(
    @Inject('ADDRESS_REPOSITORY')
    private addressRepository: Repository<AddressEntity>,
  ) {}

  async getAddressById(id: number) {
    const address = await this.addressRepository.findOne({
      where: {
        id,
      },
    });
    if (address) {
      return address;
    } else {
      throw new NotFoundException('address not found');
    }
  }

  async createAddress(addressData: CreateAddressDto) {
    const newAddress = this.addressRepository.create({
      ...addressData,
      createdAt: new Date(),
    });
    const data = await this.addressRepository.save(newAddress);
    return data;
  }

  async updateAddressInfo(data: UpdateAddressDto, id: number) {
    const checkAddress = await this.getAddressById(id);
    if (checkAddress) {
      const result = await this.addressRepository.update({ id }, { ...data });
      return result;
    }
  }

  async deleteAddress(id) {
    const checkAddress = await this.getAddressById(id);
    if (checkAddress) {
      const result = await this.addressRepository.softDelete(id);
      return result;
    }
  }
}
