/**
 * Provision a fresh, fully-seeded company for integration tests — the same path
 * the app uses on onboarding (`seed_company()` RPC with the shared
 * `companySeedData`) plus a default location and employee job.
 *
 * Mirrors `seed-dev.ts`, but writes `auth.users` directly (there is no GoTrue in
 * the test harness). The `on_auth_user_created` trigger fans that out into
 * `public.user` + `public.userPermission`.
 *
 * Call inside a transaction (see `withRollback`) for per-test isolation, or
 * against a committed connection to build a shared fixture.
 */
import type { PoolClient } from "pg";
import {
  companySeedData,
  defaultLocation
} from "../../supabase/functions/lib/seed.data";

export interface ProvisionedCompany {
  companyId: string;
  userId: string;
  locationId: string;
}

export interface ProvisionOptions {
  email?: string;
  /** Full name; `create_public_user()` splits it into first/last. */
  name?: string;
  companyName?: string;
}

export async function provisionTestCompany(
  client: PoolClient,
  opts: ProvisionOptions = {}
): Promise<ProvisionedCompany> {
  const email =
    opts.email ?? `itest+${Date.now()}-${process.hrtime.bigint()}@example.com`;
  const name = opts.name ?? "Integration Tester";
  const companyName = opts.companyName ?? "Integration Test Co";

  // 1. Auth user → trigger creates public.user + userPermission.
  const {
    rows: [user]
  } = await client.query<{ id: string }>(
    `INSERT INTO auth.users (id, email, raw_user_meta_data)
     VALUES (gen_random_uuid(), $1, jsonb_build_object('name', $2::text))
     RETURNING id`,
    [email, name]
  );
  if (!user) throw new Error("Failed to create auth user");
  const userId = user.id;

  // 2. Company.
  const {
    rows: [company]
  } = await client.query<{ id: string }>(
    `INSERT INTO company (name, "baseCurrencyCode") VALUES ($1, 'USD') RETURNING id`,
    [companyName]
  );
  if (!company) throw new Error("Failed to create company");
  const companyId = company.id;

  // 3. Seed via the same RPC the app calls on onboarding (chart of accounts,
  //    employee types, groups, permissions, sequences, …). Must pass the real
  //    seed data — an empty `{}` leaves the base groups uncreated.
  await client.query(`SELECT seed_company($1, $2, NULL, $3::jsonb)`, [
    companyId,
    userId,
    JSON.stringify(companySeedData)
  ]);

  // 4. Default location (after seeding so the location trigger can copy from
  //    accountDefault).
  const {
    rows: [location]
  } = await client.query<{ id: string }>(
    `INSERT INTO location (name, "addressLine1", city, "stateProvince", "postalCode", "countryCode", timezone, "companyId", "createdBy")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'system')
     RETURNING id`,
    [
      defaultLocation.name,
      defaultLocation.addressLine1,
      defaultLocation.city,
      defaultLocation.stateProvince,
      defaultLocation.postalCode,
      defaultLocation.countryCode,
      defaultLocation.timezone,
      companyId
    ]
  );
  if (!location) throw new Error("Failed to create location");
  const locationId = location.id;

  // 5. Link the employee to the location.
  await client.query(
    `INSERT INTO "employeeJob" (id, "companyId", "locationId") VALUES ($1, $2, $3)`,
    [userId, companyId, locationId]
  );

  return { companyId, userId, locationId };
}
