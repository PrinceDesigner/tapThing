import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { SupabaseAuthGuard } from 'src/guard/supabase.guard';
import { CurrentUser } from 'src/common/decoratores/current-user.decorator';
import { CurrentLang } from 'src/common/decoratores/current-lang.decorator';

@UseGuards(SupabaseAuthGuard)
@Controller('prompt')
export class PromptController {
  constructor(
    private readonly promptService: PromptService,
  ) { }

  @Get('/prompt_active')
  findAll(@CurrentUser('id') userId: string, @CurrentLang() lang: string) {
    return this.promptService.findAll(userId, lang);
  }

}
