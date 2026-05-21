import { Module } from '@nestjs/common';
import { SpotifyController } from './spotify.controller';
import { SpotifyService } from './spotify.service';
import { DbModule } from 'src/db/db.module';
@Module({
    imports: [DbModule],
  controllers: [SpotifyController],

  providers: [SpotifyService],
})
export class SpotifyModule {}
