import { IsEmail } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  email: string;
  password: string;
}

export class UpdateUserDto {
  email: string;
  password: string;
  refreshToken: string;
}
