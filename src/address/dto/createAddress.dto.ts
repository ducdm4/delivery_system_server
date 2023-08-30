import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class commonUpdateDto {
  id: number;
}

export class CreateAddressDto {
  @Type(() => commonUpdateDto)
  ward: commonUpdateDto;

  @Type(() => commonUpdateDto)
  street: commonUpdateDto;

  @Type(() => commonUpdateDto)
  district: commonUpdateDto;

  @Type(() => commonUpdateDto)
  city: commonUpdateDto;

  @IsString()
  building: string;

  @IsString()
  detail: string;

  lat: number | null;

  lng: number | null;
}
