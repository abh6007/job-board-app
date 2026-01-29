import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import { sql } from 'drizzle-orm';

const { Pool } = pg;

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set');
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log('Creating database tables...');

  try {
    // Drop existing tables to recreate with correct schema
    await db.execute(sql`DROP TABLE IF EXISTS users CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS sessions CASCADE;`);
    console.log('✓ Dropped old tables');

    // Create sessions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR PRIMARY KEY,
        sess JSONB NOT NULL,
        expire TIMESTAMP NOT NULL
      );
      CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);
    `);
    console.log('✓ Sessions table created');

    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR NOT NULL UNIQUE,
        password VARCHAR NOT NULL,
        email VARCHAR UNIQUE,
        first_name VARCHAR,
        last_name VARCHAR,
        profile_image_url VARCHAR,
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Users table created');

    // Create jobs table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        location TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Active',
        click_count INTEGER DEFAULT 0,
        search_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Jobs table created');

    // Create social_links table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS social_links (
        id SERIAL PRIMARY KEY,
        platform TEXT NOT NULL,
        url TEXT NOT NULL,
        is_visible BOOLEAN DEFAULT true
      );
    `);
    console.log('✓ Social links table created');

    // Create automation_links table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS automation_links (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        is_visible BOOLEAN DEFAULT true
      );
    `);
    console.log('✓ Automation links table created');

    // Create about_me table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS about_me (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL
      );
    `);
    console.log('✓ About me table created');

    // Create design_settings table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS design_settings (
        id SERIAL PRIMARY KEY,
        primary_color TEXT DEFAULT '#3b82f6',
        secondary_color TEXT DEFAULT '#8b5cf6',
        background_color TEXT DEFAULT '#ffffff',
        text_color TEXT DEFAULT '#1f2937',
        button_color TEXT DEFAULT '#3b82f6',
        button_text_color TEXT DEFAULT '#ffffff',
        font_family TEXT DEFAULT 'Inter',
        heading_font TEXT DEFAULT 'Inter',
        font_size TEXT DEFAULT 'medium',
        layout_style TEXT DEFAULT 'modern',
        border_radius TEXT DEFAULT 'medium',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      INSERT INTO design_settings (id) 
      VALUES (1) 
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log('✓ Design settings table created');

    console.log('✅ All tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

runMigrations()
  .then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
