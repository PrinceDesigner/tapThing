import { Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { PromptDBService } from './prompt-db.service';

@Module({
  imports: [SupabaseModule],
  controllers: [PromptController],
  providers: [PromptService, PromptDBService],
  exports: [PromptService, PromptDBService],
})
export class PromptModule { }
