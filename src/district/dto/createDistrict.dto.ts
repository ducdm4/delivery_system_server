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

class cityDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
export class CreateDistrictDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  slug: string;

  @IsObject()
  @IsDefined()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => cityDto)
  city!: cityDto;
}
