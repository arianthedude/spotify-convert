import { Pool } from 'pg';
import * as schema from './schema';
export declare const DB_PROVIDER = "DB_PROVIDER";
export declare const dbProvider: {
    provide: string;
    useFactory: () => import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema> & {
        $client: Pool;
    };
};
