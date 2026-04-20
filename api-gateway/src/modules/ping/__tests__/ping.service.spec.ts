import { PingService } from '@/modules/ping/ping.service';

describe('PingService', () => {
  const service = new PingService();

  it('returns a pong message with an ISO timestamp', () => {
    const result = service.ping();
    expect(result.message).toMatch(
      /^pong at \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    );
  });
});
