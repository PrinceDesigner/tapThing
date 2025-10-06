import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { SupabaseAuthGuard } from 'src/guard/supabase.guard';
import { CurrentUser } from 'src/common/decoratores/current-user.decorator';

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
  async getPaginatedPosts(
    @Query('prompt_id') prompt_id: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {

    return this.postsService.getPaginatedPosts(
      prompt_id,
      limit,
      offset,
    );
  }

}
