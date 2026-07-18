-- Allow inviting an employee by phone number as an alternative to email.
-- Aliyun's SMS template is verify-code-only, so we cannot deliver an invite link;
-- instead a phone invite is accepted when the invitee logs in via phone SMS-OTP.
ALTER TABLE "invite" ADD COLUMN "phone" TEXT;

-- Email is no longer mandatory: a phone invite carries a phone and a null email.
-- (NULL emails are distinct under the existing (email, companyId) unique constraint,
-- so it keeps working for email invites and does not block phone rows.)
ALTER TABLE "invite" ALTER COLUMN "email" DROP NOT NULL;

ALTER TABLE "invite" ADD CONSTRAINT "invite_email_or_phone_check"
  CHECK ("email" IS NOT NULL OR "phone" IS NOT NULL);

-- One pending/redeemed invite per phone per company, mirroring the email uniqueness.
CREATE UNIQUE INDEX "invite_phone_companyId_key"
  ON "invite" ("phone", "companyId") WHERE "phone" IS NOT NULL;
