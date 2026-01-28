require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function migrate() {
    const connectionString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

    if (!connectionString) {
        console.error('❌ No Postgres connection string found in .env');
        process.exit(1);
    }

    const client = new Client({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('🔌 Connecting to database...');
        await client.connect();

        const sqlPath = path.join(__dirname, '..', 'schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🚀 Running migration...');
        await client.query(sql);

        console.log('✅ Migration completed successfully!');
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

migrate();
