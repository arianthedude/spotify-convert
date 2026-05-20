import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SpotifyService } from './spotify.service';

@Module({
  controllers: [AuthController],
  providers: [SpotifyService],
})
export class AuthModule {}