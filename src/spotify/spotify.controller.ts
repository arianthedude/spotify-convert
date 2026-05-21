import { Controller, Get } from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller('spotify')
export class SpotifyController {
  constructor(
    private readonly spotifyService: SpotifyService,
  ) {}

  @Get('scrape')
  scrape() {
    return this.spotifyService.scrapeSongs();
  }
}