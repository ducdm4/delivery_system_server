import { IsNotEmpty, IsNumber } from 'class-validator';

export class RefreshTokenDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
