import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SpotifyModule } from './spotify/spotify.module';
import { MelodifyModule } from './melodify/melodify.module';
@Module({
  imports: [
    AuthModule,
    SpotifyModule,
    MelodifyModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
