-- One-time annual billing support (WeChat Pay / Alipay).
-- WeChat Pay and Alipay cannot be charged recurringly through Stripe, so companies
-- may instead purchase a fixed one-year term up front. These columns track that.

ALTER TABLE "companyPlan"
  ADD COLUMN "paymentMode" TEXT NOT NULL DEFAULT 'subscription',
  ADD COLUMN "termEndsAt" TIMESTAMP WITH TIME ZONE;

ALTER TABLE "companyPlan"
  ADD CONSTRAINT "companyPlan_paymentMode_check"
  CHECK ("paymentMode" IN ('subscription', 'one_time'));

-- One-time (annual) per-seat Stripe price, priced in CNY. Distinct from the
-- recurring monthly "stripePriceId". NULL for plans that aren't sold one-time.
ALTER TABLE "plan"
  ADD COLUMN "stripeAnnualPriceId" TEXT;
