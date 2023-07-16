import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class commonUpdateDto {
  id: number;
}

export class UpdateAddressDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

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
}
