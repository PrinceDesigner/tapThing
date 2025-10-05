import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';

declare module 'http' {
  interface IncomingMessage {
    traceId?: string;
  }
}

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const incoming = (req.headers['x-trace-id'] as string) || randomUUID();
    req.traceId = incoming;
    res.setHeader('x-trace-id', incoming);
    next();
  }
}
