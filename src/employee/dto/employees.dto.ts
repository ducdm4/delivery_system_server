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
  ValidateNested,
} from 'class-validator';

class commonUpdateDto {
  id: number;
}
export class UploadedEmployeeDataDto {
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @IsObject()
  @IsDefined()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => commonUpdateDto)
  station: commonUpdateDto;

  @IsNumber()
  @IsNotEmpty()
  role: number;
}

export class UploadedEditEmployeeDataDto {
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: UpdateUserDto;

  @Type(() => CreateAddressDto)
  address: UpdateAddressDto;

  @Type(() => commonUpdateDto)
  station: commonUpdateDto;

  isVerified: boolean;
  @Type(() => commonUpdateDto)
  identityCardImage1: commonUpdateDto;
  @Type(() => commonUpdateDto)
  identityCardImage2: commonUpdateDto;

  @IsNumber()
  @IsNotEmpty()
  role: number;
}

export class CreateEmployeeAdd {
  @Type(() => commonUpdateDto)
  user: commonUpdateDto;

  @Type(() => commonUpdateDto)
  station: commonUpdateDto;
}
