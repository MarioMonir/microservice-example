import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PingService } from '@/modules/ping/ping.service';
import { PingResponseDto } from '@/modules/ping/ping.schema';

@ApiTags('ping')
@Controller({ path: 'ping', version: '1' })
export class PingController {
  constructor(private readonly pingService: PingService) {}

  @Get()
  @ApiOkResponse({ type: PingResponseDto })
  ping(): PingResponseDto {
    return this.pingService.ping();
  }
}
