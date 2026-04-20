import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';
import { HealthController } from '@/modules/health/health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  let health: { check: jest.Mock<Promise<unknown>, [Array<() => unknown>]> };
  let memory: { checkHeap: jest.Mock };

  beforeEach(async () => {
    health = {
      check: jest.fn().mockResolvedValue({ status: 'ok', details: {} }),
    };
    memory = {
      checkHeap: jest.fn().mockResolvedValue({ memory_heap: { status: 'up' } }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: health },
        { provide: MemoryHealthIndicator, useValue: memory },
      ],
    }).compile();

    controller = module.get(HealthController);
  });

  it('liveness calls health.check with an empty indicator list', async () => {
    await controller.liveness();
    expect(health.check).toHaveBeenCalledWith([]);
  });

  it('readiness invokes the memory heap indicator with a 300MB threshold', async () => {
    await controller.readiness();
    expect(health.check).toHaveBeenCalledTimes(1);

    const indicators = health.check.mock.calls[0][0];
    expect(indicators).toHaveLength(1);

    await indicators[0]();
    expect(memory.checkHeap).toHaveBeenCalledWith(
      'memory_heap',
      300 * 1024 * 1024,
    );
  });
});
