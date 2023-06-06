import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCityDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  slug: string;
}
