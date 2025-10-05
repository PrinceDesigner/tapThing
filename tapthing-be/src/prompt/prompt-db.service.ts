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
}
