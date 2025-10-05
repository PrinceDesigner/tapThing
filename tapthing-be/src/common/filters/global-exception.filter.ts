import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(private readonly i18n: I18nService) { }

    async catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest<Request & { traceId?: string }>();
        const res = ctx.getResponse();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let code = 'INTERNAL_SERVER_ERROR';
        let message = this.i18n.t('errors.INTERNAL');

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const payload: any = exception.getResponse();
            if (typeof payload === 'string') {
                message = payload;
            } else {
                code = payload?.code || code;
                message = payload?.message || message;
            }

        }
        
        res.status(status).json({
            statusCode: status,
            code,
            message,
            traceId: (req as any).traceId,
            timestamp: new Date().toISOString(),
            path: (req as any).url,
        });
    }
}
