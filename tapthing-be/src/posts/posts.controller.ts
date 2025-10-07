import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { SupabaseAuthGuard } from 'src/guard/supabase.guard';
import { CurrentUser } from 'src/common/decoratores/current-user.decorator';
import { GetPaginatedPostsDto } from './dto/get-paginated-posts.dto';

@UseGuards(SupabaseAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post('/add')
  create(@CurrentUser('id') userId: string, @Body() createPostDto: { url: string; promptid: string, lat?: number, lng?: number, country?: string, city?: string }) {
    return this.postsService.create(createPostDto, userId);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }


  @Get('/paginated/get')
  async getPaginatedPosts(@Query() q: GetPaginatedPostsDto) {
    const { prompt_id, limit, cursor_id, cursor_created_at } = q;
    return this.postsService.getPaginatedPostsCursor(prompt_id, limit, {
      id: cursor_id ?? null,
      created_at: cursor_created_at ?? null,
    });
  }

  @Delete('/:id')
  remove(@Param('id') id: string, @CurrentUser('id') user_id: string) {
    return this.postsService.removePostById(id, user_id);
  }

}
