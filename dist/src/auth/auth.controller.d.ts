import { SpotifyService } from './spotify.service';
export declare class AuthController {
    private spotify;
    constructor(spotify: SpotifyService);
    login(res: any): any;
    callback(code: string): Promise<{
        user: any;
        tokens: any;
    }>;
}
