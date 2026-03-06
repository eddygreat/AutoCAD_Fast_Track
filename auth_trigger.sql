-- Trigger to automatically create a user in public.users when a new user signs up via Supabase Auth

-- 1. Create the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, role, plan_tier)
  VALUES (
    new.id,
    new.email,
    'user',
    -- Extract the plan_tier from the raw_user_meta_data JSONB object, default to 'basic' if not found
    COALESCE(new.raw_user_meta_data->>'plan_tier', 'basic')::plan_tier_enum
  );
  RETURN new;
END;
$$;

-- 2. Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
