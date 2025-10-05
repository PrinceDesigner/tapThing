import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { PostsDBService } from './posts-db.service';

@Module({
  imports: [SupabaseModule],
  controllers: [PostsController],
  providers: [PostsService, PostsDBService],
  exports: [PostsService, PostsDBService],
})
export class PostsModule {}
