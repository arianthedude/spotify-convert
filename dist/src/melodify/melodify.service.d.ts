export declare class MelodifyService {
    private readonly db;
    private readonly logger;
    private readonly REQUEST_DELAY;
    private readonly MAX_RETRIES;
    constructor(db: any);
    private melodify;
    syncSongsToMelodify(): Promise<void>;
    private findBestTrack;
    private likeTrack;
    private retry;
    private delay;
    private markFailed;
}
