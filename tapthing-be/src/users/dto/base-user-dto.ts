// users/dto/base-user.dto.ts
import { IsOptional, IsString, MaxLength, IsUrl, Matches, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class BaseUserDto {

    @IsNotEmpty({ message: i18nValidationMessage('validation.REQUIRED', { property: 'username' }) })
    @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
    @Matches(/^[a-zA-Z0-9_]+$/, { message: i18nValidationMessage('validation.USERNAME_INVALID_CHARACTERS') })
    username?: string;

    @IsOptional()
    @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
    @Matches(/^[a-zA-Z]*$/, { message: i18nValidationMessage('validation.USERNAME_INVALID_CHARACTERS_CREDENTIALS') })
    nome?: string;

    @IsOptional()
    @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
    @Matches(/^[a-zA-Z]*$/, { message: i18nValidationMessage('validation.USERNAME_INVALID_CHARACTERS_CREDENTIALS') })
    cognome?: string;

    @IsOptional()
    @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
    @MaxLength(160, { message: i18nValidationMessage('validation.MAX_LENGTH', { max: 160, property: 'bio' }) })
    bio?: string;

    @IsOptional()
    @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
    localita?: string;

    @IsOptional()
    @IsUrl({}, { message: i18nValidationMessage('validation.IS_URL') })
    avatar_url?: string;
}
