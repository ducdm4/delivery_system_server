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

class districtDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
export class CreateWardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  slug: string;

  @IsObject()
  @IsDefined()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => districtDto)
  district!: districtDto;
}
