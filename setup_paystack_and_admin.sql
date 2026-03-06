-- 1. Add `has_paid` column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS has_paid BOOLEAN DEFAULT false;

-- 2. Update the auth trigger to capture `has_paid` correctly and pass it along if needed,
-- but the default is false so the existing trigger is generally fine. 
-- However, we must ensure it doesn't crash if we add new columns.
-- The existing trigger `public.handle_new_user()` is fine because it specifically lists columns (`id`, `email`, `role`, `plan_tier`),
-- so the `has_paid` column will automatically get its DEFAULT false value on new signups.

-- 3. Command to make a specific user an admin.
-- PLEASE REPLACE 'your-email@example.com' WITH YOUR ACTUAL EMAIL BEFORE RUNNING THIS:
UPDATE users 
SET role = 'admin', has_paid = true 
WHERE email = 'edwardmanasseh@gmail.com';
