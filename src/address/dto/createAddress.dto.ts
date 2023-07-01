import { IsNumber, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsNumber()
  cityId: number;

  @IsNumber()
  districtId: number;

  @IsNumber()
  wardId: number;

  @IsNumber()
  streetId: number;

  @IsString()
  building: string;

  @IsString()
  detail: string;
}
