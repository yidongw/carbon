-- Add optional number field to user table
ALTER TABLE "public"."user"
ADD COLUMN "number" TEXT;

-- Create index for number field for faster lookups
CREATE INDEX "idx_user_number" ON "public"."user" ("number");

-- Add comment
COMMENT ON COLUMN "public"."user"."number" IS 'Optional human-readable number for the user, can be auto-generated or custom';

-- Add sequence configuration for user numbers
INSERT INTO "sequence" (
  "table",
  "name",
  "prefix",
  "suffix",
  "next",
  "size",
  "step",
  "companyId"
)
SELECT
  'user',
  'User',
  '',
  null,
  0,
  1,
  1,
  id
FROM company
ON CONFLICT DO NOTHING;

-- Fix existing sequences that may have been created with size=4
UPDATE "sequence"
SET "size" = 1
WHERE "table" = 'user' AND "name" = 'User';
