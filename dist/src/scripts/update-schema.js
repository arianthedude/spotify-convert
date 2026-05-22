"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_orm_1 = require("drizzle-orm");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
require("dotenv/config");
async function migrate() {
    const pool = new pg_1.Pool({
        connectionString: process.env.DATABASE_URL,
    });
    const db = (0, node_postgres_1.drizzle)(pool);
    console.log('Adding Melodify columns to songs table...');
    await db.execute((0, drizzle_orm_1.sql) `
    ALTER TABLE songs 
    ADD COLUMN IF NOT EXISTS melodify_liked BOOLEAN DEFAULT false NOT NULL,
    ADD COLUMN IF NOT EXISTS melodify_liked_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS melodify_track_id INTEGER,
    ADD COLUMN IF NOT EXISTS melodify_match_score DECIMAL(3,2),
    ADD COLUMN IF NOT EXISTS melodify_sync_status VARCHAR(20) DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS last_sync_attempt TIMESTAMP,
    ADD COLUMN IF NOT EXISTS sync_error TEXT;
  `);
    console.log('Creating indexes...');
    await db.execute((0, drizzle_orm_1.sql) `
    CREATE INDEX IF NOT EXISTS idx_melodify_liked ON songs(melodify_liked);
    CREATE INDEX IF NOT EXISTS idx_melodify_sync_status ON songs(melodify_sync_status);
    CREATE INDEX IF NOT EXISTS idx_last_sync_attempt ON songs(last_sync_attempt);
  `);
    console.log('Migration completed!');
    await pool.end();
}
migrate().catch(console.error);
//# sourceMappingURL=update-schema.js.map