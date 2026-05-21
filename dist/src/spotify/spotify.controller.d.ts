import { SpotifyService } from './spotify.service';
export declare class SpotifyController {
    private readonly spotifyService;
    constructor(spotifyService: SpotifyService);
    scrape(): Promise<{
        total: number;
    }>;
}
