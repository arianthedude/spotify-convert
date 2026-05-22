import { MelodifyService } from './melodify.service';
export declare class MelodifyController {
    private readonly melodifyService;
    constructor(melodifyService: MelodifyService);
    sync(tracks: any[]): Promise<void>;
}
