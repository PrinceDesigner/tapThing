import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { UsersDbService } from './users-db.service';

@Module({
  imports: [SupabaseModule],
  controllers: [UsersController],
  providers: [UsersService, UsersDbService],
  exports: [UsersService, UsersDbService],
})
export class UsersModule {}
