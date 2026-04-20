import { Injectable } from '@nestjs/common';
import { PingResponseDto } from '@/modules/ping/ping.schema';

@Injectable()
export class PingService {
  ping(): PingResponseDto {
    return { message: 'pong at ' + new Date().toISOString() };
  }
}
