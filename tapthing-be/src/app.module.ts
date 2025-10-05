// src/app.module.ts
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  I18nModule,
  I18nJsonLoader,
  AcceptLanguageResolver,
  QueryResolver,
  CookieResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { existsSync } from 'fs';
import { HealthModule } from './health/health.module';
import { TraceIdMiddleware } from './common/middleware/trace-id.middleware';
import { UsersModule } from './users/users.module';
import { SupabaseModule } from './supabase/supabase.module';
import { PromptModule } from './prompt/prompt.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loader: I18nJsonLoader,
      loaderOptions: {
        // ✅ Prova prima dist/src/i18n (runtime compilato), altrimenti src/i18n (dev)
        path: (() => {
          const distI18n = path.join(process.cwd(), 'dist', 'src', 'i18n');
          const srcI18n = path.join(process.cwd(), 'src', 'i18n');
          return existsSync(distI18n) ? distI18n : srcI18n;
        })(),
        watch: true,
      },
      resolvers: [
        // { use: HeaderResolver, options: ['accept-language'] },
        AcceptLanguageResolver,
        { use: QueryResolver, options: ['lang'] },
        CookieResolver,
      ],
    }),
    HealthModule,
    UsersModule,
    // SupabaseModule
    SupabaseModule,
    PromptModule,
    PostsModule,

  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceIdMiddleware).forRoutes('*');
  }
}
