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
  }, userId: string) {
    return this.postsDBService.create(createPostDto, userId);
  }

}
