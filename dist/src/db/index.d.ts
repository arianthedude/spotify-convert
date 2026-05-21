import "dotenv/config";
import postgres from "postgres";
export * from './schema';
export declare const db: import("drizzle-orm/postgres-js").PostgresJsDatabase<Record<string, never>> & {
    $client: postgres.Sql<{}>;
};
