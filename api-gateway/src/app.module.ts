import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { configuration } from '@/config/configuration';
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
import { RequestIdMiddleware } from '@/common/middleware/request-id.middleware';
import { HealthModule } from '@/modules/health/health.module';
import { PingModule } from '@/modules/ping/ping.module';
import { TodosModule } from '@/modules/todos/todos.module';
import { UsersModule } from '@/modules/users/users.module';
import { DBModule } from '@/common/db/db.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      cache: true,
    }),
    DBModule,
    PingModule,
    HealthModule,
    TodosModule,
    UsersModule,
  ],
  providers: [
    { provide: APP_PIPE, useClass: ZodValidationPipe },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
