import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsDBService } from './posts-db.service';

@Injectable()
export class PostsService {
  constructor(private postsDBService: PostsDBService) { }
  create(createPostDto: {
    url: string;
    promptid: string;
    lat?: number;
    lng?: number;
    country?: string;
    city?: string
  }, userId: string) {
    return this.postsDBService.create(createPostDto, userId);
  }

  findOne(id: string) {
    return this.postsDBService.findById(id);
  }

  getPaginatedPosts(
    prompt_id: string,
    limit: number,
    offset: number,
  ) {
    return this.postsDBService.getPaginatedPosts(
      prompt_id,
      limit,
      offset,
    );
  }

}
