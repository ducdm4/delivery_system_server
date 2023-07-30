import { CreateAddressDto } from '../../address/dto/createAddress.dto';
import { Type } from 'class-transformer';
import { CreateUserDto, UpdateUserDto } from '../../user/dto/user.dto';
import { UpdateAddressDto } from '../../address/dto/updateAddress.dto';
import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
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
