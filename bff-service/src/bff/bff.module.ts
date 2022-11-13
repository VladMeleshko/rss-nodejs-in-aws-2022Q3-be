import { Module, CacheModule } from '@nestjs/common';
import { BffController } from './bff.controller';
import { BffService } from './bff.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [BffController],
  providers: [BffService],
})
export class BffModule {}
