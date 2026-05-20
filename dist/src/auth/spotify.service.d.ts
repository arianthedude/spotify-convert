export declare class SpotifyService {
    private clientId;
    private clientSecret;
    private redirectUri;
    getAuthUrl(): string;
    getTokens(code: string): Promise<any>;
    getMe(accessToken: string): Promise<any>;
}
