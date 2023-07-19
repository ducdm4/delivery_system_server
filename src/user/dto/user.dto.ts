import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UpdateAddressDto } from '../../address/dto/updateAddress.dto';
import { CreateAddressDto } from '../../address/dto/createAddress.dto';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  role: number;
  phone: string;
  dob: string;
  profilePictureId: number;
  address: CreateAddressDto;
}

export class UpdateUserDto {
  @IsNumber()
  id: number;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  role: number;
  lastName: string;
  phone: string;
  dob: string;
  profilePictureId: number;
  addressId: number;
  address: UpdateAddressDto;
}

export class UpdateUserPayloadDto extends UpdateUserDto {
  address: UpdateAddressDto;
}

export class ChangePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}
