import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { I18nService } from 'nestjs-i18n';
import { User } from './model/user.model';

@Injectable()
export class UsersDbService {
    constructor(
        private supabaseService: SupabaseService,
        private readonly i18n: I18nService
    ) { }

    async findOne(id: string): Promise<User | null> {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('profiles')
            .select('user_id, username, nome, cognome, bio, localita, avatar_url')
            .eq('user_id', id)
            .single();

        if (error) {
            console.error('Errore nel recupero dell\'utente:', error);
            const msg = this.i18n.t('errors.USER_ERROR_FETCH');
            throw new InternalServerErrorException({ code: 'USER_ERROR_FETCH', message: msg });
        }

        return data;
    }

    async update(id: string, dto: Partial<User>): Promise<void> {

        if (dto.username) {
            const usernameTaken = await this.isUsernameTaken(dto.username, id);
            if (usernameTaken) {
                const msg = this.i18n.t('errors.USERNAME_ALREADY_TAKEN');
                throw new InternalServerErrorException({ code: 'USERNAME_ALREADY_TAKEN', message: msg });
            }
        }
        
        const { error } = await this.supabaseService
            .getClient()
            .from('profiles')
            .update(dto)
            .eq('user_id', id)

            
        if (error) {
            console.error('Errore nell\'aggiornamento dell\'utente:', error);
            const msg = this.i18n.t('errors.USER_ERROR_UPDATE');
            throw new InternalServerErrorException({ code: 'USER_ERROR_UPDATE', message: msg });
        }
    }

    async isUsernameTaken(username: string, excludeUserId: string): Promise<boolean> {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('profiles')
            .select('user_id')
            .eq('username', username)
            .neq('user_id', excludeUserId)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') { // PGRST116: No rows found
            console.error('Errore nel controllo username:', error);
            const msg = this.i18n.t('errors.USER_ERROR_FETCH');
            throw new InternalServerErrorException({ code: 'USER_ERROR_FETCH', message: msg });
        }

        return !!data;
    }
}