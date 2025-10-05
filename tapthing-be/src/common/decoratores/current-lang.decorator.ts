// src/common/decorators/current-lang.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentLang = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const acceptLanguage = request.headers['accept-language'];

    if (typeof acceptLanguage !== 'string' || acceptLanguage.length === 0) {
      return 'en'; // default
    }

    // es: "it", "it-IT", "en-US,en;q=0.9"
    // prendiamo solo la prima lingua e la parte prima del "-"
    const lang = acceptLanguage.split(',')[0]?.split('-')[0]?.trim();

    // validiamo (solo "it" o "en" nel tuo caso)
    if (lang === 'it' || lang === 'en') {
      return lang;
    }

    // fallback
    return 'en';
  },
);
