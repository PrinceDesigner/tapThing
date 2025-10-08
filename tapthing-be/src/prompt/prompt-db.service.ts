import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { I18nService } from 'nestjs-i18n';
import { PostgrestMaybeSingleResponse, PostgrestSingleResponse } from '@supabase/supabase-js';
import { Prompt } from './model/prompt.model';

@Injectable()
export class PromptDBService {
    constructor(
        private supabase: SupabaseService,
        private readonly i18n: I18nService
    ) { }

    async findAll(userId: string, lang: string) {
        
        let { data, error }: PostgrestMaybeSingleResponse<Prompt> = await this.supabase
            .getClient()
            .rpc('get_active_prompt_for_user', {
                p_user_id: userId,
                p_language: lang
            }).maybeSingle();
        if (error) {
            const msg = this.i18n.t('errors.PROMPT_ERROR_FETCH');
            throw new InternalServerErrorException({ code: 'PROMPT_ERROR_FETCH', message: msg });
        }
        return data;
    }

    async userHasPostedInActivePrompt(p_prompt_id: string, p_user_id: string): Promise<boolean> {
        const { data, error } = await this.supabase
            .getClient()
            .rpc('user_has_posted_in_active_prompt', {
                p_prompt_id,
                p_user_id
            })
        if (error) {
            const msg = this.i18n.t('errors.PROMPT_ERROR_FETCH');
            throw new InternalServerErrorException({ code: 'PROMPT_ERROR_FETCH', message: msg });
        }
        return data;
    }

    async isPromptActive(p_prompt_id: string): Promise<boolean> {
        const { data, error } = await this.supabase
            .getClient()
            .rpc('is_prompt_active', {
                p_prompt_id
            })
            
        if (error) {
            const msg = this.i18n.t('errors.PROMPT_ERROR_FETCH');
            throw new InternalServerErrorException({ code: 'PROMPT_ERROR_FETCH', message: msg });
        }
        return data;
    }


}
