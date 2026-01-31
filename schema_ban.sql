-- Add is_banned column to telegram_users table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'telegram_users' AND column_name = 'is_banned') THEN
    ALTER TABLE telegram_users ADD COLUMN is_banned boolean DEFAULT false;
  END IF;
END $$;
