import { Module } from '@nestjs/common';

import { MelodifyController } from './melodify.controller';
import { MelodifyService } from './melodify.service';

import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [MelodifyController],
  providers: [MelodifyService],
})
export class MelodifyModule {}