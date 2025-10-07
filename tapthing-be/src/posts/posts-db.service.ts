import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { I18nService } from 'nestjs-i18n';
import { SupabaseService } from 'src/supabase/supabase.service';
import { PostDetail, ResponsePostPaginated } from './model/post.model';

@Injectable()
export class PostsDBService {
  constructor(private supabaseService: SupabaseService, private i18n: I18nService) { }

  async create(createPostDto: {
    url: string;
    promptid: string;
    lat?: number;
    lng?: number;
    country?: string;
    city?: string;
  }, userId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('posted')
      .insert({ storage_path: createPostDto.url, user_id: userId, prompt_id: createPostDto.promptid, lat: createPostDto.lat, lng: createPostDto.lng, country: createPostDto.country, city: createPostDto.city })
      .select('id, created_at')
      .single();


    if (error) {
      const msg = this.i18n.t('errors.POST_CREATE_ERROR');
      throw new InternalServerErrorException({ code: 'POST_CREATE_ERROR', message: msg });
    }

    return data;
  }


  async findById(id: string) {

    const { data, error }: PostgrestSingleResponse<PostDetail> = await this.supabaseService
      .getClient()
      .rpc('get_post_with_reactions', { p_post_id: id })
      .single();

    if (error) {
      const msg = this.i18n.t('errors.POST_NOT_FOUND');
      throw new InternalServerErrorException({ code: 'POST_NOT_FOUND', message: msg });
    }

    return data;
  }

  async getPaginatedPosts(
    prompt_id: string,
    limit: number,
    last_created_at: string | null,
    last_id: string | null,
  ): Promise<ResponsePostPaginated> {
    const { data, error }: PostgrestSingleResponse<ResponsePostPaginated> =
      await this.supabaseService.getClient().rpc('get_global_feed_by_prompt_id_v2', {
        p_prompt_id: prompt_id,
        p_limit: limit,                  // <-- niente +1: lo gestisce la RPC
        p_last_created_at: last_created_at, // ISO8601 o null
        p_last_id: last_id,                 // string o null
      });

    if (error) {
      const msg = this.i18n.t('errors.POSTS_FETCH_ERROR');
      throw new InternalServerErrorException({ code: 'POSTS_FETCH_ERROR', message: msg });
    }

    // BE fa solo da passthrough della RPC
    return data!;
  }

  async removePostById(id: string, user_id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('posted')
      .delete()
      .eq('id', id)
      .eq('user_id', user_id)
      .select('id');

    if (error) {
      const msg = this.i18n.t('errors.POST_DELETE_ERROR');
      throw new InternalServerErrorException({ code: 'POST_DELETE_ERROR', message: msg });
    }

    if (data.length === 0) {
      const msg = this.i18n.t('errors.POST_NOT_FOUND_OR_NOT_YOURS');
      throw new InternalServerErrorException({ code: 'POST_NOT_FOUND_OR_NOT_YOURS', message: msg });
    }

    return { success: true };
  }



}
