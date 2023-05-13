import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { IsEmail } from 'class-validator';

@Injectable()
export class UsersPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    const { email, password } = value;
    this.validPassword(password);
    return value;
  }

  validPassword(password: string): boolean {
    const regExp = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (!regExp.test(password))
      throw new BadRequestException('password does not meet requirement');
    return true;
  }
}
