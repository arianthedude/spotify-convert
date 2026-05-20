import { Controller, Get, Query, Res } from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller('auth')
export class AuthController {
  constructor(private spotify: SpotifyService) {}

  @Get('login')
  login(@Res() res: any) {
    return res.redirect(this.spotify.getAuthUrl());
  }

  @Get('callback')
  async callback(@Query('code') code: string) {
    const tokens = await this.spotify.getTokens(code);
    const me = await this.spotify.getMe(tokens.access_token);

    return {
      user: me,
      tokens,
    };
  }
}