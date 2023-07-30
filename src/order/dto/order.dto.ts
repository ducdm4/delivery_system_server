import { CreateAddressDto } from '../../address/dto/createAddress.dto';
import { Type } from 'class-transformer';
import { CreateUserDto, UpdateUserDto } from '../../user/dto/user.dto';
import { UpdateAddressDto } from '../../address/dto/updateAddress.dto';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { commonUpdateDto } from '../../common/constant';
import { BasicParcelInfo } from '../../parcel/dto/parcel.dto';

export class BasicOrderInfo {
  @IsDefined()
  @IsArray()
  @ValidateNested()
  @Type(() => BasicParcelInfo)
  parcels: Array<BasicParcelInfo>;

  @Type(() => commonUpdateDto)
  user: commonUpdateDto;

  @IsString()
  @IsNotEmpty()
  senderName: string;

  @IsString()
  @IsNotEmpty()
  senderPhone: string;

  @IsString()
  @IsNotEmpty()
  senderEmail: string;

  @IsString()
  @IsNotEmpty()
  receiverName: string;

  @IsString()
  @IsNotEmpty()
  receiverPhone: string;

  @IsString()
  @IsNotEmpty()
  receiverEmail: string;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => CreateAddressDto)
  pickupAddress: CreateAddressDto;

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => CreateAddressDto)
  dropOffAddress: CreateAddressDto;

  @IsNumber()
  cashOnDelivery: number;

  @IsNumber()
  shippingFare: number;
}
