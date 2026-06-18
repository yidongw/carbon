import { createClient } from "@supabase/supabase-js";
import { config as loadDotenv } from "dotenv";
import pg from "pg";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Database } from "./types.ts";
import {
  HARD_DELETE_TABLES,
  SOFT_DELETE_TABLES,
  SOFT_DELETE_VIEW_BASE,
  isSoftDeleteView,
  resolveSoftDeleteBaseTable,
  withHardDelete,
  withIncludeDeleted,
  wrapSoftDeleteClient
} from "./soft-delete.ts";

const root = resolve(fileURLToPath(new URL("../..", import.meta.url)), "../..");
loadDotenv({ path: resolve(root, ".env") });
loadDotenv({ path: resolve(root, ".env.local") });

const COMPANY_ID = "AVKwodN9KfL8fnKTti5dBL";
const USER_ID = "72f2f6f0-02ec-4de0-84c4-d4165d1d6d40";
const LOCATION_ID = "loc_6AHEeYpT2YyvAWzrmaYZoQ";
const UOM = "EA";
const TEST_PREFIX = `SD-TEST-${Date.now()}`;

type WrappedClient = ReturnType<typeof getClient>;

const ITEM_VIEW_CONFIG = [
  { itemType: "Part" as const, subtypeTable: "part" as const, listView: "parts" as const },
  {
    itemType: "Material" as const,
    subtypeTable: "material" as const,
    listView: "materials" as const
  },
  { itemType: "Tool" as const, subtypeTable: "tool" as const, listView: "tools" as const },
  {
    itemType: "Consumable" as const,
    subtypeTable: "consumable" as const,
    listView: "consumables" as const
  },
  {
    itemType: "Service" as const,
    subtypeTable: "service" as const,
    listView: "services" as const
  }
] as const;

const SIMPLE_SOFT_DELETE_TABLES: Record<
  string,
  (name: string) => Record<string, unknown>
> = {
  scrapReason: (name) => ({ name, companyId: COMPANY_ID, createdBy: USER_ID }),
  customerStatus: (name) => ({ name, companyId: COMPANY_ID, createdBy: USER_ID }),
  customerType: (name) => ({ name, companyId: COMPANY_ID, createdBy: USER_ID }),
  supplierType: (name) => ({ name, companyId: COMPANY_ID, createdBy: USER_ID }),
  noQuoteReason: (name) => ({ name, companyId: COMPANY_ID, createdBy: USER_ID }),
  department: (name) => ({ name, companyId: COMPANY_ID, createdBy: USER_ID }),
  holiday: (name) => ({
    name,
    date: "2099-06-18",
    companyId: COMPANY_ID,
    createdBy: USER_ID
  }),
  gaugeType: (name) => ({ name, companyId: COMPANY_ID, createdBy: USER_ID }),
  process: (name) => ({
    name,
    defaultStandardFactor: "Hours/Piece",
    companyId: COMPANY_ID,
    createdBy: USER_ID
  }),
  storageType: (name) => ({ name, companyId: COMPANY_ID, createdBy: USER_ID })
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function getClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required");
  }
  return wrapSoftDeleteClient(
    createClient<Database>(url, key, {
      auth: { autoRefreshToken: false, persistSession: false }
    }),
    { deletedBy: USER_ID }
  );
}

async function withPg<T>(fn: (client: pg.Client) => Promise<T>): Promise<T> {
  const port = Number(process.env.PORT_DB ?? "5432");
  const client = new pg.Client({
    host: "127.0.0.1",
    port,
    user: "postgres",
    password: "postgres",
    database: "postgres"
  });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end();
  }
}

async function assertSchema() {
  const tables = [...SOFT_DELETE_TABLES];
  const missing = await withPg(async (pgClient) => {
    const { rows } = await pgClient.query<{ table_name: string }>(
      `
        SELECT t.table_name
        FROM unnest($1::text[]) AS t(table_name)
        WHERE to_regclass(format('public.%I', t.table_name)) IS NULL
           OR NOT EXISTS (
             SELECT 1
             FROM information_schema.columns c
             WHERE c.table_schema = 'public'
               AND c.table_name = t.table_name
               AND c.column_name = 'deletedAt'
           )
           OR NOT EXISTS (
             SELECT 1
             FROM information_schema.columns c
             WHERE c.table_schema = 'public'
               AND c.table_name = t.table_name
               AND c.column_name = 'deletedBy'
           )
      `,
      [tables]
    );
    return rows.map((r) => r.table_name);
  });
  assert(
    missing.length === 0,
    `tables missing deletedAt/deletedBy: ${missing.join(", ")}`
  );
  console.log(`✓ schema: ${tables.length} soft-delete tables have deletedAt/deletedBy`);
}

async function assertViewSqlFiltersDeletedRows() {
  const itemViews = ["parts", "materials", "tools", "consumables", "services"];
  await withPg(async (pgClient) => {
    for (const view of [...itemViews, "jobs", "gauges"]) {
      const { rows } = await pgClient.query<{ definition: string }>(
        `SELECT pg_get_viewdef(format('public.%I', $1::text)::regclass, true) AS definition`,
        [view]
      );
      const def = rows[0]?.definition ?? "";
      assert(
        def.includes('"deletedAt" IS NULL'),
        `${view} view SQL should filter deletedAt IS NULL`
      );
    }
  });
  console.log("✓ schema: all 7 list views filter deletedAt in SQL");
}

async function assertWrappedSelectOnAllTables(client: WrappedClient) {
  const failures: string[] = [];
  for (const table of SOFT_DELETE_TABLES) {
    const { error } = await client.from(table).select("deletedAt").limit(0);
    if (error) failures.push(`${table}: ${error.message}`);
  }
  for (const view of Object.keys(SOFT_DELETE_VIEW_BASE)) {
    const { error } = await client.from(view).select("id").limit(0);
    if (error) failures.push(`${view}: ${error.message}`);
  }
  assert(failures.length === 0, failures.join("\n"));
  console.log(
    `✓ select: wrapped client can query ${SOFT_DELETE_TABLES.size} tables + ${Object.keys(SOFT_DELETE_VIEW_BASE).length} views`
  );
}

async function insertItem(
  client: WrappedClient,
  readableId: string,
  itemType: (typeof ITEM_VIEW_CONFIG)[number]["itemType"],
  extra?: Record<string, unknown>
) {
  const { data: item, error: itemError } = await client
    .from("item")
    .insert({
      readableId,
      name: `Soft delete test ${readableId}`,
      type: itemType,
      replenishmentSystem: "Buy",
      itemTrackingType: "Inventory",
      unitOfMeasureCode: UOM,
      active: true,
      companyId: COMPANY_ID,
      createdBy: USER_ID,
      ...extra
    })
    .select("id")
    .single();
  assert(!itemError && item, `insert item (${itemType}) failed: ${itemError?.message}`);
  return item.id;
}

async function insertMaterialFixture(client: WrappedClient, readableId: string) {
  const refs = await withPg(async (pgClient) => {
    const form = await pgClient.query<{ id: string }>(
      `SELECT id FROM "materialForm" LIMIT 1`
    );
    const substance = await pgClient.query<{ id: string }>(
      `SELECT id FROM "materialSubstance" LIMIT 1`
    );
    return {
      materialFormId: form.rows[0]?.id,
      materialSubstanceId: substance.rows[0]?.id
    };
  });
  assert(refs.materialFormId && refs.materialSubstanceId, "seed materialForm/Substance required");

  const itemId = await insertItem(client, readableId, "Material");
  const { error } = await client.from("material").insert({
    id: readableId,
    materialFormId: refs.materialFormId,
    materialSubstanceId: refs.materialSubstanceId,
    companyId: COMPANY_ID,
    createdBy: USER_ID
  });
  assert(!error, `insert material failed: ${error?.message}`);
  return itemId;
}

async function insertItemFixture(
  client: WrappedClient,
  config: (typeof ITEM_VIEW_CONFIG)[number],
  readableId: string
) {
  if (config.itemType === "Material") {
    return insertMaterialFixture(client, readableId);
  }

  const itemId = await insertItem(client, readableId, config.itemType);

  if (config.subtypeTable === "service") {
    const { error } = await client.from("service").insert({
      id: readableId,
      serviceType: "Internal",
      companyId: COMPANY_ID,
      createdBy: USER_ID
    });
    assert(!error, `insert service failed: ${error?.message}`);
  } else {
    const { error } = await client.from(config.subtypeTable).insert({
      id: readableId,
      companyId: COMPANY_ID,
      createdBy: USER_ID
    });
    assert(!error, `insert ${config.subtypeTable} failed: ${error?.message}`);
  }

  return itemId;
}

async function testItemListView(
  client: WrappedClient,
  config: (typeof ITEM_VIEW_CONFIG)[number]
) {
  const readableId = `${TEST_PREFIX}-${config.itemType.toUpperCase()}`;
  const itemId = await insertItemFixture(client, config, readableId);

  const { data: visibleBefore } = await client
    .from(config.listView)
    .select("id")
    .eq("id", itemId)
    .maybeSingle();
  assert(visibleBefore, `${config.listView}: row should be visible before delete`);

  const { error: deleteViaViewError } = await client
    .from(config.listView)
    .delete()
    .eq("id", itemId);
  assert(
    !deleteViaViewError,
    `${config.listView} delete failed: ${deleteViaViewError?.message}`
  );

  const { data: hiddenAfter } = await client
    .from(config.listView)
    .select("id")
    .eq("id", itemId)
    .maybeSingle();
  assert(!hiddenAfter, `${config.listView}: row should be hidden after delete`);

  const { data: softDeleted } = await withIncludeDeleted(async () =>
    client.from("item").select("deletedAt, deletedBy").eq("id", itemId).single()
  );
  assert(softDeleted?.deletedAt, `${config.listView}: item should be soft-deleted`);
  assert(
    softDeleted?.deletedBy === USER_ID,
    `${config.listView}: deletedBy should be set`
  );

  await withHardDelete(async () => {
    await client.from(config.subtypeTable).delete().eq("id", readableId);
    await client.from("item").delete().eq("id", itemId);
  });

  console.log(`✓ view ${config.listView} (${config.itemType})`);
}

async function insertGauge(client: WrappedClient, gaugeId: string) {
  const gaugeTypeId = await withPg(async (pgClient) => {
    const { rows } = await pgClient.query<{ id: string }>(
      `SELECT id FROM "gaugeType" WHERE "companyId" = $1 LIMIT 1`,
      [COMPANY_ID]
    );
    return rows[0]?.id;
  });
  assert(gaugeTypeId, "seed gaugeType required");

  const { data: gauge, error } = await client
    .from("gauge")
    .insert({
      gaugeId,
      gaugeTypeId,
      companyId: COMPANY_ID,
      createdBy: USER_ID
    })
    .select("id")
    .single();
  assert(!error && gauge, `insert gauge failed: ${error?.message}`);
  return gauge.id;
}

async function testGaugesView(client: WrappedClient) {
  const gaugeReadableId = `${TEST_PREFIX}-GAUGE`;
  const gaugeRowId = await insertGauge(client, gaugeReadableId);

  const { data: visibleBefore } = await client
    .from("gauges")
    .select("id")
    .eq("id", gaugeRowId)
    .maybeSingle();
  assert(visibleBefore, "gauges: row should be visible before delete");

  const { error: deleteError } = await client
    .from("gauges")
    .delete()
    .eq("id", gaugeRowId);
  assert(!deleteError, `gauges delete failed: ${deleteError?.message}`);

  const { data: hiddenAfter } = await client
    .from("gauges")
    .select("id")
    .eq("id", gaugeRowId)
    .maybeSingle();
  assert(!hiddenAfter, "gauges: row should be hidden after delete");

  const { data: softDeleted } = await withIncludeDeleted(async () =>
    client.from("gauge").select("deletedAt").eq("id", gaugeRowId).single()
  );
  assert(softDeleted?.deletedAt, "gauges: gauge should be soft-deleted");

  await withHardDelete(async () => {
    await client.from("gauge").delete().eq("id", gaugeRowId);
  });

  console.log("✓ view gauges");
}

async function testJobsView(client: WrappedClient) {
  const readableId = `${TEST_PREFIX}-JOB-PART`;
  const itemId = await insertItemFixture(
    client,
    { itemType: "Part", subtypeTable: "part", listView: "parts" },
    readableId
  );

  const { data: job, error: jobError } = await client
    .from("job")
    .insert({
      jobId: `${TEST_PREFIX}-J001`,
      itemId,
      unitOfMeasureCode: UOM,
      locationId: LOCATION_ID,
      quantity: 1,
      companyId: COMPANY_ID,
      createdBy: USER_ID
    })
    .select("id")
    .single();
  assert(!jobError && job, `insert job failed: ${jobError?.message}`);

  const { data: visibleBefore } = await client
    .from("jobs")
    .select("id")
    .eq("id", job.id)
    .maybeSingle();
  assert(visibleBefore, "jobs: row should be visible before delete");

  const { error: deleteError } = await client
    .from("jobs")
    .delete()
    .eq("id", job.id);
  assert(!deleteError, `jobs delete failed: ${deleteError?.message}`);

  const { data: hiddenAfter } = await client
    .from("jobs")
    .select("id")
    .eq("id", job.id)
    .maybeSingle();
  assert(!hiddenAfter, "jobs: row should be hidden after delete");

  await withHardDelete(async () => {
    await client.from("job").delete().eq("id", job.id);
    await client.from("part").delete().eq("id", readableId);
    await client.from("item").delete().eq("id", itemId);
  });

  console.log("✓ view jobs");
}

async function testDeactivatedPartStillVisible(client: WrappedClient) {
  const readableId = `${TEST_PREFIX}-INACTIVE`;
  const itemId = await insertItemFixture(
    client,
    { itemType: "Part", subtypeTable: "part", listView: "parts" },
    readableId
  );

  const { error: deactivateError } = await client
    .from("item")
    .update({ active: false })
    .eq("id", itemId);
  assert(!deactivateError, `deactivate failed: ${deactivateError?.message}`);

  const { data: inactiveInParts } = await client
    .from("parts")
    .select("id, active")
    .eq("id", itemId)
    .single();
  assert(inactiveInParts?.active === false, "deactivated part should stay in parts view");

  await withHardDelete(async () => {
    await client.from("part").delete().eq("id", readableId);
    await client.from("item").delete().eq("id", itemId);
  });

  console.log("✓ deactivate (active=false) keeps row in parts view");
}

async function testSimpleTableSoftDeletes(client: WrappedClient) {
  for (const [table, buildInsert] of Object.entries(SIMPLE_SOFT_DELETE_TABLES)) {
    const name = `${TEST_PREFIX}-${table}`;
    const { data: row, error: insertError } = await client
      .from(table as keyof Database["public"]["Tables"])
      .insert(buildInsert(name) as never)
      .select("id")
      .single();
    assert(!insertError && row, `${table} insert failed: ${insertError?.message}`);

    const { error: deleteError } = await client
      .from(table as keyof Database["public"]["Tables"])
      .delete()
      .eq("id", row.id);
    assert(!deleteError, `${table} soft delete failed: ${deleteError?.message}`);

    const { data: deletedRow } = await withIncludeDeleted(async () =>
      client
        .from(table as keyof Database["public"]["Tables"])
        .select("deletedAt")
        .eq("id", row.id)
        .single()
    );
    assert(deletedRow?.deletedAt, `${table} should have deletedAt after delete`);

    const { data: filteredRow } = await client
      .from(table as keyof Database["public"]["Tables"])
      .select("id")
      .eq("id", row.id)
      .maybeSingle();
    assert(!filteredRow, `${table} should be hidden from default select`);

    await withHardDelete(async () => {
      await client
        .from(table as keyof Database["public"]["Tables"])
        .delete()
        .eq("id", row.id);
    });
  }
  console.log(
    `✓ soft delete: ${Object.keys(SIMPLE_SOFT_DELETE_TABLES).length} simple lookup tables`
  );
}

async function testHardDeleteTables(client: WrappedClient) {
  for (const table of HARD_DELETE_TABLES) {
    assert(!SOFT_DELETE_TABLES.has(table), `${table} should not be soft-deletable`);
    const column = table === "oauthCode" ? "code" : "id";
    const { error } = await client.from(table).select(column).limit(0);
    assert(!error, `hard-delete table ${table} select failed: ${error?.message}`);
  }
  console.log(`✓ hard-delete tables (${HARD_DELETE_TABLES.size}) are not soft-deletable`);
}

async function testRegistryConsistency() {
  for (const [view, base] of Object.entries(SOFT_DELETE_VIEW_BASE)) {
    assert(isSoftDeleteView(view), `${view} should be a soft-delete view`);
    assert(SOFT_DELETE_TABLES.has(base), `${view} base table ${base} missing from registry`);
    assert(
      resolveSoftDeleteBaseTable(view) === base,
      `${view} should resolve to ${base}`
    );
  }
  console.log("✓ registry: view → base table mappings");
}

async function main() {
  console.log("soft-delete extensive integration tests\n");

  const client = getClient();

  await testRegistryConsistency();
  await assertSchema();
  await assertViewSqlFiltersDeletedRows();
  await assertWrappedSelectOnAllTables(client);
  await testHardDeleteTables(client);

  for (const config of ITEM_VIEW_CONFIG) {
    await testItemListView(client, config);
  }

  await testGaugesView(client);
  await testJobsView(client);
  await testDeactivatedPartStillVisible(client);
  await testSimpleTableSoftDeletes(client);

  console.log("\nAll extensive soft-delete integration tests passed.");
}

main().catch((err) => {
  console.error("\nsoft-delete integration tests FAILED:");
  console.error(err);
  process.exit(1);
});
