/**
 * API-level integration test: real service functions driven through real
 * PostgREST (supabase-js), against a real Postgres with the full Carbon schema.
 *
 * These exercise behaviour that mock-based unit tests cannot: a real write via
 * `upsertItemAttribute*`, and a real *nested PostgREST embed* read via
 * `getItemAttributeSets` (itemAttributeSet → itemAttributeSetAttribute →
 * itemAttribute) — the FK-embed class of bug that only surfaces against a real
 * PostgREST.
 *
 * The Supabase stack is started once by globalSetup
 * (app/test/integration/globalSetup.ts). Tests isolate by provisioning a fresh
 * company each (writes are companyId-scoped; the container is thrown away after
 * the run) — transaction rollback can't isolate the PostgREST HTTP client.
 *
 * Skips automatically when Docker is unavailable.
 */
import {
  createPool,
  createTestClient,
  provisionTestCompany,
} from "@carbon/database/test";
import { afterAll, beforeAll, describe, expect, inject, it } from "vitest";
import {
  getItemAttributeSets,
  upsertItemAttribute,
  upsertItemAttributeSet,
} from "./itemAttribute.service";

const pgUrl = inject("itestPgUrl");
const postgrestUrl = inject("itestPostgrestUrl");
const token = inject("itestServiceRoleToken");
const enabled = Boolean(pgUrl && postgrestUrl && token);

describe.skipIf(!enabled)("integration: item attributes API (real PostgREST)", () => {
  let pool: ReturnType<typeof createPool>;
  let client: ReturnType<typeof createTestClient>;

  beforeAll(() => {
    pool = createPool(pgUrl);
    client = createTestClient(postgrestUrl, token);
  });

  afterAll(async () => {
    await pool?.end();
  });

  async function provision() {
    const connection = await pool.connect();
    try {
      return await provisionTestCompany(connection);
    } finally {
      connection.release();
    }
  }

  it("upsertItemAttributeSet inserts a set the read API then returns", async () => {
    const { companyId, userId } = await provision();

    const created = await upsertItemAttributeSet(client, {
      code: "SIZES",
      name: "Sizes",
      attributeIds: [],
      companyId,
      createdBy: userId,
    });
    expect(created.error).toBeNull();
    expect(created.data?.id).toBeTruthy();

    const res = await getItemAttributeSets(client, companyId);
    expect(res.error).toBeNull();
    const set = (res.data ?? []).find((s: { code: string }) => s.code === "SIZES");
    expect(set).toBeDefined();
    // The embed must resolve to an array (a missing FK relationship would make
    // PostgREST error instead).
    expect(Array.isArray(set.itemAttributeSetAttribute)).toBe(true);
  });

  it("resolves the nested FK embed set → setAttribute → attribute", async () => {
    const { companyId, userId } = await provision();

    const attribute = await upsertItemAttribute(client, {
      code: "COLOR",
      name: "Color",
      values: [],
      companyId,
      createdBy: userId,
    });
    expect(attribute.error).toBeNull();
    const attributeId = attribute.data?.id as string;
    expect(attributeId).toBeTruthy();

    const set = await upsertItemAttributeSet(client, {
      code: "PALETTE",
      name: "Palette",
      attributeIds: [attributeId],
      companyId,
      createdBy: userId,
    });
    expect(set.error).toBeNull();

    const res = await getItemAttributeSets(client, companyId);
    expect(res.error).toBeNull();
    const palette = (res.data ?? []).find(
      (s: { code: string }) => s.code === "PALETTE"
    );
    expect(palette).toBeDefined();
    // Two FK hops resolved by PostgREST in one query.
    const embeddedCodes = (palette.itemAttributeSetAttribute ?? []).map(
      (a: { itemAttribute?: { code?: string } }) => a.itemAttribute?.code
    );
    expect(embeddedCodes).toContain("COLOR");
  });

  it("scopes results by company (no cross-company leakage)", async () => {
    const a = await provision();
    const b = await provision();

    await upsertItemAttributeSet(client, {
      code: "ONLY-IN-A",
      name: "Only in A",
      attributeIds: [],
      companyId: a.companyId,
      createdBy: a.userId,
    });

    const inB = await getItemAttributeSets(client, b.companyId);
    expect(inB.error).toBeNull();
    expect(
      (inB.data ?? []).some((s: { code: string }) => s.code === "ONLY-IN-A")
    ).toBe(false);
  });
});
