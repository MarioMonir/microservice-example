import { Module } from '@nestjs/common';
import { PingController } from '@/modules/ping/ping.controller';
import { PingService } from '@/modules/ping/ping.service';

@Module({
  controllers: [PingController],
  providers: [PingService],
})
export class PingModule {}
