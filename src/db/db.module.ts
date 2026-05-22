import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

@Module({
  providers: [
    {
      provide: 'DRIZZLE',
      useFactory: async () => {
        console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

        const pool = new Pool({
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          user: process.env.DB_USER,
          password: String(process.env.DB_PASSWORD),
          database: process.env.DB_NAME,
        });

        return drizzle(pool);
      },
    },
  ],
  exports: ['DRIZZLE'],
})
export class DbModule {}