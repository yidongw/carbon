-- Phone is now also a login identity (SMS OTP via Aliyun), mirroring
-- wechat_unionid. Enforce uniqueness with a partial index so multiple NULLs
-- coexist while preventing two users from claiming the same number. The "phone"
-- column itself already exists (20260502000000_user-phone.sql).
CREATE UNIQUE INDEX IF NOT EXISTS "user_phone_unique"
  ON "user" ("phone")
  WHERE "phone" IS NOT NULL;
