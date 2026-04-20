import { Logger } from '@nestjs/common';
import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { lastValueFrom, of } from 'rxjs';
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';

function buildCtx(opts: {
  method: string;
  originalUrl: string;
  requestId?: string;
}): ExecutionContext {
  const headers = opts.requestId ? { 'x-request-id': opts.requestId } : {};
  const req = {
    method: opts.method,
    originalUrl: opts.originalUrl,
    header: (name: string) =>
      (headers as Record<string, string>)[name.toLowerCase()],
  };

  return {
    switchToHttp: () => ({ getRequest: () => req }),
  } as unknown as ExecutionContext;
}

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
    logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('logs method, url, duration and request id on successful response', async () => {
    const ctx = buildCtx({
      method: 'GET',
      originalUrl: '/api/v1/todos',
      requestId: 'req-1',
    });
    const handler: CallHandler = { handle: () => of({ ok: true }) };

    const value = await lastValueFrom(interceptor.intercept(ctx, handler));

    expect(value).toEqual({ ok: true });
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy.mock.calls[0][0]).toMatch(
      /^GET \/api\/v1\/todos \d+ms \[req-1\]$/,
    );
  });

  it('logs "[undefined]" when no request id header is present', async () => {
    const ctx = buildCtx({ method: 'POST', originalUrl: '/api/v1/users' });
    const handler: CallHandler = { handle: () => of(null) };

    await lastValueFrom(interceptor.intercept(ctx, handler));

    expect(logSpy.mock.calls[0][0]).toMatch(
      /^POST \/api\/v1\/users \d+ms \[undefined\]$/,
    );
  });
});
