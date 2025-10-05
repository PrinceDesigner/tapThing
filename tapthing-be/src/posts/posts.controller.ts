import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { SupabaseAuthGuard } from 'src/guard/supabase.guard';
import { CurrentUser } from 'src/common/decoratores/current-user.decorator';

@UseGuards(SupabaseAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/add')
  create(@CurrentUser('id') userId: string, @Body() createPostDto: { url: string; promptid: string }) {
    return this.postsService.create(createPostDto, userId);
  }
}
