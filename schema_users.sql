-- Create table for Telegram users
CREATE TABLE IF NOT EXISTS telegram_users (
  id bigint primary key, -- The telegram user ID
  username text,
  first_name text,
  last_name text,
  language_code text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add telegram_user_id to links table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'links' AND column_name = 'telegram_user_id') THEN
    ALTER TABLE links ADD COLUMN telegram_user_id bigint REFERENCES telegram_users(id);
  END IF;
END $$;
