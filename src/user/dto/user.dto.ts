import { IsEmail, IsNumber, IsString } from 'class-validator';
import { UpdateAddressDto } from '../../address/dto/updateAddress.dto';
import { CreateAddressDto } from '../../address/dto/createAddress.dto';

export class CreateUserDto {
  @IsEmail()
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
  profilePictureId: number;
  address: CreateAddressDto;
}

export class UpdateUserDto {
  @IsNumber()
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
  profilePictureId: number;
  addressId: number;
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
