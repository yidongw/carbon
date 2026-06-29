-- Tracks demo-company seeding so the app can (a) auto-trigger seeding the first time the
-- user lands in an unseeded demo, and (b) show a progress toast.
--   pending  → created, not yet seeded (set by the tryDemo action)
--   seeding  → seed running (set atomically so it only runs once)
--   seeded   → done
--   failed   → seed errored (partial data may still be present)
ALTER TABLE "company" ADD COLUMN "demoSeedStatus" TEXT;
