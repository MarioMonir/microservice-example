import { Test, TestingModule } from '@nestjs/testing';
import { PingController } from '@/modules/ping/ping.controller';
import { PingService } from '@/modules/ping/ping.service';

describe('PingController', () => {
  let controller: PingController;
  let service: { ping: jest.Mock };

  beforeEach(async () => {
    service = { ping: jest.fn().mockReturnValue({ message: 'pong at X' }) };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PingController],
      providers: [{ provide: PingService, useValue: service }],
    }).compile();

    controller = module.get(PingController);
  });

  it('delegates to PingService.ping', () => {
    expect(controller.ping()).toEqual({ message: 'pong at X' });
    expect(service.ping).toHaveBeenCalledTimes(1);
  });
});
