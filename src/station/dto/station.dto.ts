import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class commonUpdateDto {
  id: number;
}

class createAddressDto {
  @IsString()
  building: string;

  @IsNotEmpty()
  @IsString()
  detail: string;

  lat: number;
  lng: number;

  @Type(() => commonUpdateDto)
  ward: commonUpdateDto;

  @Type(() => commonUpdateDto)
  street: commonUpdateDto;

  @Type(() => commonUpdateDto)
  district: commonUpdateDto;

  @Type(() => commonUpdateDto)
  city: commonUpdateDto;
}

class updateAddressDto extends createAddressDto {
  @IsNumber()
  id: number;
}

export class CreateStationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  type: number;

  @IsObject()
  @IsDefined()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => createAddressDto)
  address: createAddressDto;

  addressId: number;

  parentStationId: number;
}

export class UpdateStationDto extends CreateStationDto {
  @IsNumber()
  id: number;

  @IsObject()
  @IsDefined()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => createAddressDto)
  address: updateAddressDto;

  wards: Array<commonUpdateDto>;

  photos: Array<commonUpdateDto>;
}
