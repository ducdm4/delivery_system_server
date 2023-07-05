import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class UsersPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    const { password } = value;
    this.validPassword(password);
    return value;
  }

  validPassword(password: string): boolean {
    const regExp =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/;
    if (!regExp.test(password))
      throw new BadRequestException('password does not meet requirement');
    return true;
  }
}
