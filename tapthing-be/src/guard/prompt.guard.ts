// src/guards/prompt.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    UnauthorizedException,
    InternalServerErrorException,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { lastValueFrom } from 'rxjs';
import { PromptDBService } from 'src/prompt/prompt-db.service';

@Injectable()
export class PromptGuard implements CanActivate {
    constructor(private readonly promptDBService: PromptDBService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const i18n = I18nContext.current(context)!;


        // 1) user id da SupabaseAuthGuard
        const userId = req.user?.id;
        if (!userId) {
            throw new UnauthorizedException({
                code: 'AUTH_INVALID_OR_EXPIRED',
                message: i18n.t('errors.AUTH_INVALID_OR_EXPIRED'),
            });
        }

        // 1️⃣ Recupera prompt_id e has_posted (accetta header, body o query)
        const promptId =
            req.body?.prompt_id ||
            req.query?.prompt_id;


        if (!promptId) {
            throw new ForbiddenException({
                code: 'PROMPT_NOT_PROVIDED',
                message: 'Prompt ID mancante nella richiesta.',
            });
        }


        // 3) prompt attivo?
        const isActive = await this.promptDBService.isPromptActive(promptId);
        if (!isActive) {
            throw new InternalServerErrorException({
                code: 'PROMPT_EXPIRED',
                message: i18n.t('errors.PROMPT_EXPIRED'),
            });
        }


        return true;
        // 2️⃣ Recupera il token dell’utente autenticato (dipende dal tuo auth guard)

    }
}
