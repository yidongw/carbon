-- One user, many login identities. Each (type, value) belongs to exactly one
-- user, so logging in with any linked method resolves to the same account.
-- Login methods live here (verified, self-managed); the user.email / user.phone
-- columns become editable *contact* fields, distinct from these identities.
CREATE TABLE IF NOT EXISTS "userIdentity" (
  "id" TEXT NOT NULL DEFAULT xid(),
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "verifiedAt" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  CONSTRAINT "userIdentity_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "userIdentity_type_check"
    CHECK ("type" IN ('email', 'google', 'azure', 'wechat', 'phone')),
  CONSTRAINT "userIdentity_type_value_key" UNIQUE ("type", "value"),
  CONSTRAINT "userIdentity_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "userIdentity_userId_idx" ON "userIdentity" ("userId");

ALTER TABLE "userIdentity" ENABLE ROW LEVEL SECURITY;

-- A user may read their own login methods; all mutations go through the server
-- (service role) behind verified add/remove flows.
DROP POLICY IF EXISTS "SELECT" ON "public"."userIdentity";
CREATE POLICY "SELECT" ON "public"."userIdentity"
FOR SELECT USING ("userId" = auth.uid()::text);

-- ── Backfill existing identities ───────────────────────────────────────────
-- Only backfill a value as a LOGIN identity when it is the user's actual auth
-- credential (not a contact value typed into the profile). We detect that by
-- comparing against auth.users.email: real-email logins have au.email = the
-- public email; phone/wechat logins have a synthetic phone+/wechat+ auth email.

-- Email-based logins (email / google / azure all carry the real email).
INSERT INTO "userIdentity" ("userId", "type", "value", "verifiedAt", "createdAt")
SELECT u."id", 'email', u."email", u."createdAt", u."createdAt"
FROM "user" u
JOIN auth.users au ON au.id::text = u.id
WHERE u."email" IS NOT NULL
  AND u."email" <> ''
  AND au.email = u."email"
ON CONFLICT ("type", "value") DO NOTHING;

-- Phone logins: auth email is the synthetic phone+<num>@carbon.internal.
INSERT INTO "userIdentity" ("userId", "type", "value", "verifiedAt", "createdAt")
SELECT u."id", 'phone', u."phone", u."createdAt", u."createdAt"
FROM "user" u
JOIN auth.users au ON au.id::text = u.id
WHERE u."phone" IS NOT NULL
  AND u."phone" <> ''
  AND au.email LIKE 'phone+%@carbon.internal'
ON CONFLICT ("type", "value") DO NOTHING;

-- WeChat logins: wechat_unionid is only ever set by WeChat sign-in, so it is
-- unambiguously a login identity.
INSERT INTO "userIdentity" ("userId", "type", "value", "verifiedAt", "createdAt")
SELECT u."id", 'wechat', u."wechat_unionid", u."createdAt", u."createdAt"
FROM "user" u
WHERE u."wechat_unionid" IS NOT NULL
  AND u."wechat_unionid" <> ''
ON CONFLICT ("type", "value") DO NOTHING;
