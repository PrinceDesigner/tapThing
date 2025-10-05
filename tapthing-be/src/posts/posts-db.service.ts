import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class PostsDBService {
  constructor(private supabaseService: SupabaseService, private i18n: I18nService) { }

  async create(createPostDto: {
    url: string;
    promptid: string;
  }, userId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('posted')
      .insert({ storage_path: createPostDto.url, user_id: userId, prompt_id: createPostDto.promptid })
      .select('id, created_at')
      .single();

    if (error) {
      const msg = this.i18n.t('errors.POST_CREATE_ERROR');
      throw new InternalServerErrorException({ code: 'POST_CREATE_ERROR', message: msg });
    }
    
    return data;
  }

}
