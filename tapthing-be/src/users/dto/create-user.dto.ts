import { IsEmail, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED') })
  name: string;

  @IsEmail({}, { message: i18nValidationMessage('validation.EMAIL') })
  email: string;
}
