// dto/get-paginated-posts.dto.ts
import { Transform } from 'class-transformer';
import { IsISO8601, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class GetPaginatedPostsDto {
  @IsString() @IsNotEmpty()
  prompt_id!: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt() @Min(1)
  limit = 20;

  @IsOptional() @IsString()
  cursor_id?: string;

  @IsOptional() @IsISO8601()
  cursor_created_at?: string; // ISO8601
}
