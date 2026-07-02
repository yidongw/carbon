-- Make email nullable to support phone-only and WeChat users
ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL;

-- Drop the existing non-partial unique index and recreate as partial so
-- multiple NULLs are allowed while still preventing duplicate emails.
DROP INDEX IF EXISTS "user_email_key";
CREATE UNIQUE INDEX IF NOT EXISTS "user_email_unique" ON "user" ("email") WHERE "email" IS NOT NULL;

-- Add wechat_unionid for future WeChat login support
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "wechat_unionid" text;
CREATE UNIQUE INDEX IF NOT EXISTS "user_wechat_unionid_unique" ON "user" ("wechat_unionid") WHERE "wechat_unionid" IS NOT NULL;

-- Update the trigger to handle null email gracefully.
-- Uses COALESCE so an existing email is never overwritten with NULL.
CREATE OR REPLACE FUNCTION public.create_public_user()
RETURNS TRIGGER AS $$
DECLARE
  full_name TEXT;
  name_parts TEXT[];
BEGIN
  full_name := NEW.raw_user_meta_data->>'name';

  IF full_name IS NOT NULL THEN
    name_parts := regexp_split_to_array(full_name, '\s+');
    INSERT INTO public."user" ("id", "email", "active", "firstName", "lastName", "about")
    VALUES (
      NEW.id,
      NEW.email,
      true,
      COALESCE(name_parts[1], ''),
      COALESCE(array_to_string(name_parts[2:], ' '), ''),
      ''
    )
    ON CONFLICT (id) DO UPDATE SET email = COALESCE(EXCLUDED.email, "user".email);
  ELSE
    INSERT INTO public."user" ("id", "email", "active", "firstName", "lastName", "about")
    VALUES (
      NEW.id,
      NEW.email,
      true,
      '',
      '',
      ''
    )
    ON CONFLICT (id) DO UPDATE SET email = COALESCE(EXCLUDED.email, "user".email);
  END IF;

  INSERT INTO public."userPermission" (id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
