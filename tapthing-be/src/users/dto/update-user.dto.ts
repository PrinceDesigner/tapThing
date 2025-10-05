// users/dto/update-user.dto.ts
import { BaseUserDto } from './base-user-dto';
import { PartialType, OmitType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(
  OmitType(BaseUserDto, [] as const),
) {}
