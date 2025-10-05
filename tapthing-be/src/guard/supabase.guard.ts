import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SupabaseService } from '../supabase/supabase.service';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request & { user?: any } = context.switchToHttp().getRequest();
    const i18n = I18nContext.current(context)!; // 👈 lingua corrente (RFC4647)

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Messaggio tradotto
      const message = i18n.t('errors.AUTH_MISSING_HEADER');
      // Consiglio: restituisci anche un code stabile per il FE
      throw new UnauthorizedException({ code: 'AUTH_MISSING_HEADER', message });
    }

    const token = authHeader.slice('Bearer '.length);

    try {
      const user = await this.supabaseService.getUserFromToken(token);
      req.user = user;
      return true;
    } catch (err) {
      const message = i18n.t('errors.AUTH_INVALID_OR_EXPIRED');
      throw new UnauthorizedException({ code: 'AUTH_INVALID_OR_EXPIRED', message });
    }
  }
}
