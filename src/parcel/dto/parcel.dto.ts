import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
} from 'class-validator';
import { commonUpdateDto } from '../../common/constant';

export class BasicParcelInfo {
  @IsDefined()
  @IsNotEmptyObject()
  @Type(() => commonUpdateDto)
  photo: commonUpdateDto;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  weight: number;
}

export class ParcelInfoQuote {
  @IsNumber()
  @IsNotEmpty()
  weight: number;
}
