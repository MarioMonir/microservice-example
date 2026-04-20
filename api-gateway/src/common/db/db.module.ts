import { Global, Module } from '@nestjs/common';
import { DBService } from '@/common/db/db.service';

@Global()
@Module({
  providers: [DBService],
  exports: [DBService],
})
export class DBModule {}
