import { configuration } from '@/config/configuration';

describe('configuration', () => {
  const ORIGINAL_ENV = { ...process.env };

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  function clearConfigEnv(): void {
    delete process.env.PORT;
    delete process.env.NODE_ENV;
    delete process.env.CORS_ORIGINS;
    delete process.env.API_PREFIX;
  }

  it('applies defaults when env is empty', () => {
    clearConfigEnv();
    const cfg = configuration();

    expect(cfg.port).toBe(3000);
    expect(cfg.nodeEnv).toBe('development');
    expect(cfg.apiPrefix).toBe('api');
    expect(cfg.corsOrigins).toEqual([
      'http://localhost:5179',
      'http://localhost:8080',
    ]);
  });

  it('reads overrides from env and splits CORS origins', () => {
    clearConfigEnv();
    process.env.PORT = '4000';
    process.env.NODE_ENV = 'production';
    process.env.API_PREFIX = 'gateway';
    process.env.CORS_ORIGINS = 'https://a.test, https://b.test ,';

    const cfg = configuration();

    expect(cfg.port).toBe(4000);
    expect(cfg.nodeEnv).toBe('production');
    expect(cfg.apiPrefix).toBe('gateway');
    expect(cfg.corsOrigins).toEqual(['https://a.test', 'https://b.test']);
  });

  it('rejects non-numeric PORT', () => {
    clearConfigEnv();
    process.env.PORT = 'not-a-port';
    expect(() => configuration()).toThrow();
  });

  it('rejects an unknown NODE_ENV value', () => {
    clearConfigEnv();
    process.env.NODE_ENV = 'staging';
    expect(() => configuration()).toThrow();
  });
});
