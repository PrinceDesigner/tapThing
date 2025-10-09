import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsDBService } from './posts-db.service';

@Injectable()
export class PostsService {
  constructor(private postsDBService: PostsDBService) { }

  create(createPostDto: {
    url: string;
    prompt_id: string;
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

  getPaginatedPostsCursor(
    prompt_id: string,
    limit: number,
    cursor: { id: string | null, created_at: string | null },
    user_id: string
  ) {

    return this.postsDBService.getPaginatedPosts(
      prompt_id,
      limit,
      cursor.created_at,
      cursor.id,
      user_id
    );
  }

  removePostById(id: string, user_id: string) {
    return this.postsDBService.removePostById(id, user_id);
  }

  react(emoji_id: number | null, user_id: string, action: 'add' | 'remove', post_id: string) {
    return this.postsDBService.reactToPost(emoji_id, user_id, action, post_id);
  }
}
