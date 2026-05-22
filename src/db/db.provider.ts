import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const DB_PROVIDER = 'DB_PROVIDER';

export const dbProvider = {
  provide: DB_PROVIDER,
  useFactory: () => {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    return drizzle(pool, { schema });
  },
};