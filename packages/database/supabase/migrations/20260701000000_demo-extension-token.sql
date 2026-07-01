-- Per-request extension tokens stored on the demo company row.
-- A random token is generated when the user clicks "Request extension" and
-- stored here. The approve link contains the token; on click the handler
-- looks it up, verifies expiry, clears it, and extends expiresAt.
-- No shared signing secret is needed — the token IS the secret.

ALTER TABLE "demoCompany"
  ADD COLUMN "extensionToken" TEXT,
  ADD COLUMN "extensionTokenExpiresAt" TIMESTAMP WITH TIME ZONE;

CREATE UNIQUE INDEX "demoCompany_extensionToken_idx"
  ON "demoCompany" ("extensionToken")
  WHERE "extensionToken" IS NOT NULL;
