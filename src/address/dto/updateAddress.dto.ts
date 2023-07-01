import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateAddressDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

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
