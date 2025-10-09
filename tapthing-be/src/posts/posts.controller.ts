import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { SupabaseAuthGuard } from '../guard/supabase.guard';
import { CurrentUser } from '../common/decoratores/current-user.decorator';
import { GetPaginatedPostsDto } from './dto/get-paginated-posts.dto';
import { PromptGuard } from '../guard/prompt.guard';

@UseGuards(SupabaseAuthGuard, PromptGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post('/add')
  create(
    @CurrentUser('id') userId: string,
    @Body() createPostDto: { url: string; prompt_id: string, lat?: number, lng?: number, country?: string, city?: string }) {
    return this.postsService.create(createPostDto, userId);
  }

  @Get('/:id')
  findOne(@Param('id') id: string, @Query() q: { prompt_id: string }) {
    return this.postsService.findOne(id);
  }


  @Get('/paginated/get')
  async getPaginatedPosts(@Query() q: GetPaginatedPostsDto, @CurrentUser('id') user_id: string) {
    const { prompt_id, limit, cursor_id, cursor_created_at } = q;
    return this.postsService.getPaginatedPostsCursor(prompt_id, limit, {
      id: cursor_id ?? null,
      created_at: cursor_created_at ?? null,
    }, user_id);
  }

  @Delete('/:id')
  remove(@Param('id') id: string, @CurrentUser('id') user_id: string, @Query() q: { prompt_id: string }) {
    return this.postsService.removePostById(id, user_id);
  }

  @Post('/react/:post_id')
  reactToPost(@Param('post_id') postId: string, @CurrentUser('id') user_id: string, @Body() b: { action: 'add' | 'remove', emoji_id: number | null }) {
    return this.postsService.react(b.emoji_id, user_id, b.action, postId);
  }

}
