import { IsNotEmpty, IsNotEmptyObject, IsNumber } from 'class-validator';
import { commonUpdateDto } from '../../common/constant';
import { Type } from 'class-transformer';

export class CreateRoutesDto {
  @IsNumber()
  @IsNotEmpty()
  type: number; // 0: pickup, 1: delivery

  isGoToParent?: boolean;

  @IsNotEmptyObject()
  @Type(() => commonUpdateDto)
  employee: commonUpdateDto;

  @IsNotEmptyObject()
  @Type(() => commonUpdateDto)
  station: commonUpdateDto;

  @Type(() => commonUpdateDto)
  streets: Array<commonUpdateDto>;

  @Type(() => commonUpdateDto)
  childStation: Array<commonUpdateDto>;
}

export class UpdateRoutesDto extends CreateRoutesDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
