export declare class SpotifyService {
    private db;
    constructor(db: any);
    scrapeSongs(): Promise<{
        total: number;
    }>;
}
