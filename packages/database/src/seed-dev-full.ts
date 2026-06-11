/**
 * Comprehensive development seed script for Carbon ERP.
 *
 * Runs the full base setup (user + company + reference data from seed-dev.ts)
 * and then populates all major operational tables with realistic demo data.
 *
 * Usage:
 *   pnpm run db:seed:dev:full -- --email your@email.com [--env-file /path/to/.env.dev]
 */

import process from "node:process";
import { parseArgs } from "node:util";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import {
  companySeedData,
  defaultLocation,
} from "../supabase/functions/lib/seed.data.ts";
import { getPostgresConnectionPool } from "./client.ts";
import type { Database } from "./types.ts";

const DEV_PASSWORD = "password";
const DEV_COMPANY_NAME = "Carbon Development";

function inferFirstNameFromEmail(email: string): string {
  const localPart = email.split("@")[0]!;
  const firstName = localPart.split(/[.+_-]/)[0]!;
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
}

const { values } = parseArgs({
  args: process.argv.slice(2).filter((a) => a !== "--"),
  options: {
    email: { type: "string", short: "e" },
    "env-file": { type: "string" },
  },
  strict: true,
});

function printUsage() {
  console.log(`
Usage: pnpm run db:seed:dev:full -- --email <email> [--env-file <path>]

Arguments:
  --email, -e       Required. The email for the dev user.
  --env-file        Optional. Path to a .env file (e.g. /path/to/.env.dev).

Example:
  pnpm run db:seed:dev:full -- --email developer@example.com --env-file /home/user/.env.dev
  `);
}

async function seed() {
  const email = values.email;
  const envFile = values["env-file"];

  if (!email) {
    console.error("Error: --email is required\n");
    printUsage();
    process.exit(1);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error("Error: Invalid email format\n");
    process.exit(1);
  }

  if (envFile) {
    const result = dotenv.config({ path: envFile, override: true });
    if (result.error) {
      console.error(`Error loading env file ${envFile}:`, result.error.message);
      process.exit(1);
    }
    console.log(`Loaded environment from: ${envFile}`);
  } else {
    dotenv.config();
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const dbUrl = process.env.SUPABASE_DB_URL;

  if (!supabaseUrl || !serviceRoleKey || !dbUrl) {
    console.error(
      "Error: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_DB_URL must be set."
    );
    process.exit(1);
  }

  console.log(`\nSeeding full dev data for: ${email}`);
  console.log(`Supabase URL: ${supabaseUrl}\n`);

  const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const pgPool = getPostgresConnectionPool(1);
  const client = await pgPool.connect();

  try {
    // ─── Step 1: Ensure user exists ────────────────────────────────────────────
    console.log("1. Ensuring user exists...");
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u: any) => u.email === email);

    let userId: string;

    if (existingUser) {
      console.log(`   Found existing user: ${existingUser.id}`);
      userId = existingUser.id;
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: DEV_PASSWORD,
      });
    } else {
      console.log("   Creating new user...");
      const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: DEV_PASSWORD,
        email_confirm: true,
        app_metadata: { role: "employee", provider: "email", providers: ["email"] },
      });
      if (error || !newUser.user) {
        throw new Error(`Failed to create user: ${error?.message}`);
      }
      userId = newUser.user.id;
      console.log(`   Created user: ${userId}`);
    }

    const firstName = inferFirstNameFromEmail(email);
    await client.query(`UPDATE "user" SET "firstName" = $1 WHERE id = $2`, [
      firstName,
      userId,
    ]);

    // ─── Step 2: Ensure company exists ────────────────────────────────────────
    console.log("2. Ensuring company exists...");
    const companyResult = await client.query<{ id: string }>(
      `SELECT id FROM company WHERE name = $1 LIMIT 1`,
      [DEV_COMPANY_NAME]
    );

    let companyId: string;

    if (companyResult.rows.length > 0) {
      companyId = companyResult.rows[0]!.id;
      console.log(`   Found existing company: ${companyId}`);
    } else {
      console.log("   Creating company and seeding reference data...");
      await client.query("BEGIN");
      try {
        const newCompany = await client.query<{ id: string }>(
          `INSERT INTO company (name, "baseCurrencyCode") VALUES ($1, 'USD') RETURNING id`,
          [DEV_COMPANY_NAME]
        );
        companyId = newCompany.rows[0]!.id;

        await client.query(`SELECT seed_company($1, $2, NULL, $3::jsonb)`, [
          companyId,
          userId,
          JSON.stringify(companySeedData),
        ]);

        const locationResult = await client.query<{ id: string }>(
          `INSERT INTO location (name, "addressLine1", city, "stateProvince", "postalCode", "countryCode", timezone, "companyId", "createdBy")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'system') RETURNING id`,
          [
            defaultLocation.name,
            defaultLocation.addressLine1,
            defaultLocation.city,
            defaultLocation.stateProvince,
            defaultLocation.postalCode,
            defaultLocation.countryCode,
            defaultLocation.timezone,
            companyId,
          ]
        );
        const locationId = locationResult.rows[0]!.id;

        await client.query(
          `INSERT INTO "employeeJob" (id, "companyId", "locationId") VALUES ($1, $2, $3)`,
          [userId, companyId, locationId]
        );

        await client.query("COMMIT");
        console.log(`   Company created: ${companyId}`);
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      }
    }

    // Get Headquarters locationId
    const locationRow = await client.query<{ id: string }>(
      `SELECT id FROM location WHERE name = 'Headquarters' AND "companyId" = $1 LIMIT 1`,
      [companyId]
    );
    const locationId = locationRow.rows[0]?.id;
    if (!locationId) throw new Error("Headquarters location not found");

    // ─── Helpers ───────────────────────────────────────────────────────────────
    async function nextSeq(table: string): Promise<string> {
      const r = await client.query<{ id: string }>(
        `SELECT get_next_sequence($1, $2) AS id`,
        [table, companyId]
      );
      return r.rows[0]!.id;
    }

    async function rowExists(
      table: string,
      nameCol: string,
      name: string
    ): Promise<boolean> {
      const r = await client.query(
        `SELECT 1 FROM "${table}" WHERE "${nameCol}" = $1 AND "companyId" = $2 LIMIT 1`,
        [name, companyId]
      );
      return (r.rowCount ?? 0) > 0;
    }

    // ─── Step 3: Supplier types ───────────────────────────────────────────────
    console.log("3. Seeding supplier types...");
    const supplierTypeNames = ["Raw Material", "Electronics", "Contract Manufacturing"];
    const supplierTypeIds: Record<string, string> = {};
    for (const typeName of supplierTypeNames) {
      const existing = await client.query<{ id: string }>(
        `SELECT id FROM "supplierType" WHERE name = $1 AND "companyId" = $2 LIMIT 1`,
        [typeName, companyId]
      );
      if (existing.rows.length > 0) {
        supplierTypeIds[typeName] = existing.rows[0]!.id;
      } else {
        const r = await client.query<{ id: string }>(
          `INSERT INTO "supplierType" (name, "companyId", "createdBy") VALUES ($1, $2, $3) RETURNING id`,
          [typeName, companyId, userId]
        );
        supplierTypeIds[typeName] = r.rows[0]!.id;
        console.log(`   Created supplier type "${typeName}"`);
      }
    }

    // ─── Step 4: Customer types ───────────────────────────────────────────────
    console.log("4. Seeding customer types...");
    const customerTypeNames = ["OEM", "Distributor", "End User"];
    const customerTypeIds: Record<string, string> = {};
    for (const typeName of customerTypeNames) {
      const existing = await client.query<{ id: string }>(
        `SELECT id FROM "customerType" WHERE name = $1 AND "companyId" = $2 LIMIT 1`,
        [typeName, companyId]
      );
      if (existing.rows.length > 0) {
        customerTypeIds[typeName] = existing.rows[0]!.id;
      } else {
        const r = await client.query<{ id: string }>(
          `INSERT INTO "customerType" (name, "companyId", "createdBy") VALUES ($1, $2, $3) RETURNING id`,
          [typeName, companyId, userId]
        );
        customerTypeIds[typeName] = r.rows[0]!.id;
        console.log(`   Created customer type "${typeName}"`);
      }
    }

    // ─── Step 5: Suppliers ────────────────────────────────────────────────────
    console.log("5. Seeding suppliers...");

    const suppliersData = [
      {
        name: "Acme Steel Supply",
        typeKey: "Raw Material",
        contact: { firstName: "Michael", lastName: "Torres", email: "mtorres@acmesteel.com", workPhone: "+1-312-555-0101" },
        address: { addressLine1: "4500 Industrial Blvd", city: "Chicago", state: "IL", postalCode: "60632" },
      },
      {
        name: "Pacific Electronics",
        typeKey: "Electronics",
        contact: { firstName: "Sarah", lastName: "Chen", email: "schen@pacificelectronics.com", workPhone: "+1-408-555-0202" },
        address: { addressLine1: "1200 Technology Drive", city: "San Jose", state: "CA", postalCode: "95110" },
      },
      {
        name: "FastCNC Services",
        typeKey: "Contract Manufacturing",
        contact: { firstName: "David", lastName: "Kim", email: "dkim@fastcnc.com", workPhone: "+1-469-555-0303" },
        address: { addressLine1: "890 Precision Way", city: "Dallas", state: "TX", postalCode: "75201" },
      },
    ];

    const supplierIds: Record<string, string> = {};
    for (const s of suppliersData) {
      const existingSupplier = await client.query<{ id: string }>(
        `SELECT id FROM supplier WHERE name = $1 AND "companyId" = $2 LIMIT 1`,
        [s.name, companyId]
      );
      if (existingSupplier.rows.length > 0) {
        supplierIds[s.name] = existingSupplier.rows[0]!.id;
        console.log(`   Supplier "${s.name}" already exists, skipping.`);
        continue;
      }

      const supplierRow = await client.query<{ id: string }>(
        `INSERT INTO supplier (name, "supplierTypeId", "supplierStatus", "companyId", "createdBy")
         VALUES ($1, $2, 'Active'::"supplierStatusType", $3, $4) RETURNING id`,
        [s.name, supplierTypeIds[s.typeKey], companyId, userId]
      );
      const supplierId = supplierRow.rows[0]!.id;
      supplierIds[s.name] = supplierId;

      const addrRow = await client.query<{ id: string }>(
        `INSERT INTO address ("addressLine1", city, "stateProvince", "postalCode", "companyId")
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [s.address.addressLine1, s.address.city, s.address.state, s.address.postalCode, companyId]
      );
      const addressId = addrRow.rows[0]!.id;

      await client.query(
        `INSERT INTO "supplierLocation" ("supplierId", "addressId", name) VALUES ($1, $2, $3)`,
        [supplierId, addressId, "Main Office"]
      );

      const contactRow = await client.query<{ id: string }>(
        `INSERT INTO contact ("firstName", "lastName", email, "workPhone", "companyId")
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [s.contact.firstName, s.contact.lastName, s.contact.email, s.contact.workPhone, companyId]
      );
      const contactId = contactRow.rows[0]!.id;

      await client.query(
        `INSERT INTO "supplierContact" ("supplierId", "contactId") VALUES ($1, $2)`,
        [supplierId, contactId]
      );

      console.log(`   Created supplier "${s.name}": ${supplierId}`);
    }

    // ─── Step 6: Customers ────────────────────────────────────────────────────
    console.log("6. Seeding customers...");

    const activeCustomerStatusRow = await client.query<{ id: string }>(
      `SELECT id FROM "customerStatus" WHERE name = 'Active' AND "companyId" = $1 LIMIT 1`,
      [companyId]
    );
    const activeCustomerStatusId = activeCustomerStatusRow.rows[0]?.id;

    const customersData = [
      {
        name: "Precision Motors LLC",
        typeKey: "OEM",
        contact: { firstName: "Jennifer", lastName: "Walsh", email: "jwalsh@precisionmotors.com", workPhone: "+1-614-555-0401" },
        address: { addressLine1: "750 Motor Drive", city: "Columbus", state: "OH", postalCode: "43215" },
      },
      {
        name: "West Coast Robotics",
        typeKey: "Distributor",
        contact: { firstName: "Alex", lastName: "Nguyen", email: "anguyen@wcrobotics.com", workPhone: "+1-206-555-0502" },
        address: { addressLine1: "3200 Innovation Pkwy", city: "Seattle", state: "WA", postalCode: "98101" },
      },
      {
        name: "Northern Aerospace",
        typeKey: "OEM",
        contact: { firstName: "Robert", lastName: "Patel", email: "rpatel@northernaerospace.com", workPhone: "+1-617-555-0603" },
        address: { addressLine1: "1 Aerospace Blvd", city: "Boston", state: "MA", postalCode: "02108" },
      },
    ];

    const customerIds: Record<string, string> = {};
    for (const c of customersData) {
      const existingCustomer = await client.query<{ id: string }>(
        `SELECT id FROM customer WHERE name = $1 AND "companyId" = $2 LIMIT 1`,
        [c.name, companyId]
      );
      if (existingCustomer.rows.length > 0) {
        customerIds[c.name] = existingCustomer.rows[0]!.id;
        console.log(`   Customer "${c.name}" already exists, skipping.`);
        continue;
      }

      const customerRow = await client.query<{ id: string }>(
        `INSERT INTO customer (name, "customerTypeId", "customerStatusId", "companyId", "createdBy")
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [c.name, customerTypeIds[c.typeKey], activeCustomerStatusId, companyId, userId]
      );
      const customerId = customerRow.rows[0]!.id;
      customerIds[c.name] = customerId;

      const addrRow = await client.query<{ id: string }>(
        `INSERT INTO address ("addressLine1", city, "stateProvince", "postalCode", "companyId")
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [c.address.addressLine1, c.address.city, c.address.state, c.address.postalCode, companyId]
      );
      const addressId = addrRow.rows[0]!.id;

      await client.query(
        `INSERT INTO "customerLocation" ("customerId", "addressId", name) VALUES ($1, $2, $3)`,
        [customerId, addressId, "Main Office"]
      );

      const contactRow = await client.query<{ id: string }>(
        `INSERT INTO contact ("firstName", "lastName", email, "workPhone", "companyId")
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [c.contact.firstName, c.contact.lastName, c.contact.email, c.contact.workPhone, companyId]
      );
      const contactId = contactRow.rows[0]!.id;

      await client.query(
        `INSERT INTO "customerContact" ("customerId", "contactId") VALUES ($1, $2)`,
        [customerId, contactId]
      );

      console.log(`   Created customer "${c.name}": ${customerId}`);
    }

    // ─── Step 7: Departments ──────────────────────────────────────────────────
    console.log("7. Seeding departments...");
    const departmentNames = ["Engineering", "Manufacturing", "Operations", "Quality"];
    for (const deptName of departmentNames) {
      if (!(await rowExists("department", "name", deptName))) {
        await client.query(
          `INSERT INTO department (name, "companyId", "createdBy") VALUES ($1, $2, $3)`,
          [deptName, companyId, userId]
        );
        console.log(`   Created department "${deptName}"`);
      }
    }

    // ─── Step 8: Cost centers ─────────────────────────────────────────────────
    console.log("8. Seeding cost centers...");
    const costCenterNames = [
      "Manufacturing Operations",
      "Engineering R&D",
      "General & Administrative",
    ];
    for (const ccName of costCenterNames) {
      if (!(await rowExists("costCenter", "name", ccName))) {
        await client.query(
          `INSERT INTO "costCenter" (name, "companyId", "createdBy") VALUES ($1, $2, $3)`,
          [ccName, companyId, userId]
        );
        console.log(`   Created cost center "${ccName}"`);
      }
    }

    // ─── Step 9: Warehouse ────────────────────────────────────────────────────
    console.log("9. Seeding warehouse...");
    let warehouseId: string | null = null;
    const existingWH = await client.query<{ id: string }>(
      `SELECT id FROM warehouse WHERE name = $1 AND "companyId" = $2 LIMIT 1`,
      ["Main Warehouse", companyId]
    );
    if (existingWH.rows.length > 0) {
      warehouseId = existingWH.rows[0]!.id;
      console.log("   Warehouse already exists.");
    } else {
      const whRow = await client.query<{ id: string }>(
        `INSERT INTO warehouse (name, "locationId", "companyId", "createdBy")
         VALUES ($1, $2, $3, $4) RETURNING id`,
        ["Main Warehouse", locationId, companyId, userId]
      );
      warehouseId = whRow.rows[0]!.id;
      console.log(`   Created warehouse "Main Warehouse": ${warehouseId}`);
    }

    // ─── Step 10: Shipping methods ────────────────────────────────────────────
    console.log("10. Seeding shipping methods...");
    const shippingMethods = [
      { name: "UPS Ground", carrier: "UPS" },
      { name: "FedEx 2-Day", carrier: "FedEx" },
      { name: "USPS Priority Mail", carrier: "USPS" },
    ];
    for (const sm of shippingMethods) {
      if (!(await rowExists("shippingMethod", "name", sm.name))) {
        await client.query(
          `INSERT INTO "shippingMethod" (name, carrier, "companyId", "createdBy")
           VALUES ($1, $2::"shippingCarrier", $3, $4)`,
          [sm.name, sm.carrier, companyId, userId]
        );
        console.log(`   Created shipping method "${sm.name}"`);
      }
    }

    // ─── Step 11: Shipping terms ──────────────────────────────────────────────
    console.log("11. Seeding shipping terms...");
    const shippingTerms = ["FOB Destination", "FOB Origin", "Prepaid & Add"];
    for (const st of shippingTerms) {
      if (!(await rowExists("shippingTerm", "name", st))) {
        await client.query(
          `INSERT INTO "shippingTerm" (name, "companyId", "createdBy") VALUES ($1, $2, $3)`,
          [st, companyId, userId]
        );
        console.log(`   Created shipping term "${st}"`);
      }
    }

    // ─── Step 12: Processes ───────────────────────────────────────────────────
    console.log("12. Seeding processes...");
    const processesData = [
      { name: "CNC Machining", factor: "Minutes/Piece", type: "Inside" },
      { name: "Assembly", factor: "Hours/Piece", type: "Inside" },
      { name: "Quality Inspection", factor: "Minutes/Piece", type: "Inside" },
      { name: "Welding", factor: "Minutes/Piece", type: "Inside" },
    ];
    const processIds: Record<string, string> = {};
    for (const p of processesData) {
      const existing = await client.query<{ id: string }>(
        `SELECT id FROM process WHERE name = $1 AND "companyId" = $2 LIMIT 1`,
        [p.name, companyId]
      );
      if (existing.rows.length > 0) {
        processIds[p.name] = existing.rows[0]!.id;
      } else {
        const r = await client.query<{ id: string }>(
          `INSERT INTO process (name, "defaultStandardFactor", "processType", "companyId", "createdBy")
           VALUES ($1, $2::factor, $3::"processType", $4, $5) RETURNING id`,
          [p.name, p.factor, p.type, companyId, userId]
        );
        processIds[p.name] = r.rows[0]!.id;
        console.log(`   Created process "${p.name}"`);
      }
    }

    // ─── Step 13: Work centers ────────────────────────────────────────────────
    console.log("13. Seeding work centers...");
    const workCentersData = [
      {
        name: "CNC Mill #1",
        description: "3-axis CNC milling center",
        laborRate: 50,
        machineRate: 100,
        processes: ["CNC Machining", "Quality Inspection"],
      },
      {
        name: "Assembly Station 1",
        description: "General assembly bench",
        laborRate: 40,
        machineRate: 0,
        processes: ["Assembly"],
      },
      {
        name: "Welding Cell A",
        description: "MIG/TIG welding station",
        laborRate: 55,
        machineRate: 65,
        processes: ["Welding"],
      },
    ];
    const workCenterIds: Record<string, string> = {};
    for (const wc of workCentersData) {
      const existing = await client.query<{ id: string }>(
        `SELECT id FROM "workCenter" WHERE name = $1 AND "companyId" = $2 LIMIT 1`,
        [wc.name, companyId]
      );
      if (existing.rows.length > 0) {
        workCenterIds[wc.name] = existing.rows[0]!.id;
      } else {
        const r = await client.query<{ id: string }>(
          `INSERT INTO "workCenter" (name, description, "laborRate", "machineRate", "locationId", "companyId", "createdBy")
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
          [wc.name, wc.description, wc.laborRate, wc.machineRate, locationId, companyId, userId]
        );
        workCenterIds[wc.name] = r.rows[0]!.id;
        console.log(`   Created work center "${wc.name}"`);
      }

      for (const procName of wc.processes) {
        const procId = processIds[procName];
        if (!procId) continue;
        const wcId = workCenterIds[wc.name]!;
        const existsLink = await client.query(
          `SELECT 1 FROM "workCenterProcess" WHERE "workCenterId" = $1 AND "processId" = $2 LIMIT 1`,
          [wcId, procId]
        );
        if ((existsLink.rowCount ?? 0) === 0) {
          await client.query(
            `INSERT INTO "workCenterProcess" ("workCenterId", "processId", "companyId", "createdBy") VALUES ($1, $2, $3, $4)`,
            [wcId, procId, companyId, userId]
          );
        }
      }
    }

    // ─── Step 14: Items ───────────────────────────────────────────────────────
    console.log("14. Seeding items...");
    const itemsData = [
      {
        readableId: "STEEL-ROD-01",
        name: "1020 Steel Rod 1 inch",
        description: "Cold-rolled 1020 steel rod, 1\" diameter",
        type: "Material",
        replenishmentSystem: "Buy",
        itemTrackingType: "Inventory",
        uom: "EA",
      },
      {
        readableId: "BEARING-6205",
        name: "6205 Deep Groove Bearing",
        description: "SKF 6205-2RS deep groove ball bearing",
        type: "Part",
        replenishmentSystem: "Buy",
        itemTrackingType: "Inventory",
        uom: "EA",
      },
      {
        readableId: "BRACKET-001",
        name: "Mounting Bracket A",
        description: "Machined aluminum mounting bracket, Type A",
        type: "Part",
        replenishmentSystem: "Make",
        itemTrackingType: "Inventory",
        uom: "EA",
      },
      {
        readableId: "SHAFT-ASM-001",
        name: "Drive Shaft Assembly",
        description: "Precision-machined drive shaft assembly",
        type: "Part",
        replenishmentSystem: "Make",
        itemTrackingType: "Inventory",
        uom: "EA",
      },
      {
        readableId: "CTRL-PCB-001",
        name: "Control PCB Rev2",
        description: "Motor control printed circuit board, revision 2",
        type: "Part",
        replenishmentSystem: "Buy",
        itemTrackingType: "Inventory",
        uom: "EA",
      },
      {
        readableId: "FASTENER-KIT-01",
        name: "M6 Fastener Kit",
        description: "M6 bolts, nuts, and washers kit (50 pcs)",
        type: "Consumable",
        replenishmentSystem: "Buy",
        itemTrackingType: "Inventory",
        uom: "EA",
      },
    ];
    const itemIds: Record<string, string> = {};
    for (const item of itemsData) {
      const existing = await client.query<{ id: string }>(
        `SELECT id FROM item WHERE "readableId" = $1 AND "companyId" = $2 LIMIT 1`,
        [item.readableId, companyId]
      );
      if (existing.rows.length > 0) {
        itemIds[item.readableId] = existing.rows[0]!.id;
        console.log(`   Item "${item.readableId}" already exists, skipping.`);
        continue;
      }

      const r = await client.query<{ id: string }>(
        `INSERT INTO item ("readableId", name, description, type, "replenishmentSystem", "itemTrackingType", "unitOfMeasureCode", active, "companyId", "createdBy")
         VALUES ($1, $2, $3, $4::"itemType", $5::"itemReplenishmentSystem", $6::"itemTrackingType", $7, true, $8, $9)
         RETURNING id`,
        [
          item.readableId, item.name, item.description,
          item.type, item.replenishmentSystem, item.itemTrackingType,
          item.uom, companyId, userId,
        ]
      );
      itemIds[item.readableId] = r.rows[0]!.id;
      console.log(`   Created item "${item.readableId}"`);
    }

    // ─── Step 15: Item posting groups ─────────────────────────────────────────
    console.log("15. Seeding item posting groups...");
    const postingGroups = [
      { name: "Finished Goods", description: "Manufactured finished products" },
      { name: "Raw Materials", description: "Raw material inputs" },
      { name: "Purchased Parts", description: "Bought-in components" },
      { name: "Consumables", description: "Low-value consumable items" },
    ];
    for (const pg of postingGroups) {
      if (!(await rowExists("itemPostingGroup", "name", pg.name))) {
        await client.query(
          `INSERT INTO "itemPostingGroup" (name, description, "companyId", "createdBy")
           VALUES ($1, $2, $3, $4)`,
          [pg.name, pg.description, companyId, userId]
        );
        console.log(`   Created item posting group "${pg.name}"`);
      }
    }

    // ─── Step 16: Abilities ───────────────────────────────────────────────────
    console.log("16. Seeding abilities...");
    const abilities = [
      "CNC Machining", "TIG Welding", "MIG Welding",
      "Assembly", "Quality Inspection", "Forklift Operation",
    ];
    for (const abilityName of abilities) {
      const existing = await client.query(
        `SELECT 1 FROM ability WHERE name = $1 AND "companyId" = $2 LIMIT 1`,
        [abilityName, companyId]
      );
      if ((existing.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO ability (name, "companyId", "createdBy") VALUES ($1, $2, $3)`,
          [abilityName, companyId, userId]
        );
        console.log(`   Created ability "${abilityName}"`);
      }
    }

    // ─── Step 17: Purchase orders ─────────────────────────────────────────────
    console.log("17. Seeding purchase orders...");

    // supplierInteraction is required by purchaseOrder FK
    async function getOrCreateSupplierInteraction(suppId: string): Promise<string> {
      const existing = await client.query<{ id: string }>(
        `SELECT id FROM "supplierInteraction" WHERE "supplierId" = $1 AND "companyId" = $2 LIMIT 1`,
        [suppId, companyId]
      );
      if (existing.rows.length > 0) return existing.rows[0]!.id;
      const r = await client.query<{ id: string }>(
        `INSERT INTO "supplierInteraction" ("supplierId", "companyId") VALUES ($1, $2) RETURNING id`,
        [suppId, companyId]
      );
      return r.rows[0]!.id;
    }

    const poData = [
      {
        supplierId: supplierIds["Acme Steel Supply"],
        status: "To Receive",
        lines: [
          { itemReadableId: "STEEL-ROD-01", qty: 100, unitPrice: 5.5, uom: "EA" },
        ],
      },
      {
        supplierId: supplierIds["Pacific Electronics"],
        status: "Draft",
        lines: [
          { itemReadableId: "CTRL-PCB-001", qty: 50, unitPrice: 45.0, uom: "EA" },
        ],
      },
    ];

    for (const po of poData) {
      if (!po.supplierId) continue;
      const poReadableId = await nextSeq("purchaseOrder");
      const interactionId = await getOrCreateSupplierInteraction(po.supplierId);

      const poRow = await client.query<{ id: string }>(
        `INSERT INTO "purchaseOrder" ("purchaseOrderId", "purchaseOrderType", status, "supplierId", "supplierInteractionId", "companyId", "createdBy")
         VALUES ($1, 'Purchase'::"purchaseOrderType", $2::"purchaseOrderStatus", $3, $4, $5, $6)
         RETURNING id`,
        [poReadableId, po.status, po.supplierId, interactionId, companyId, userId]
      );
      const poRowId = poRow.rows[0]!.id;

      for (const line of po.lines) {
        const itemId = itemIds[line.itemReadableId];
        if (!itemId) continue;
        await client.query(
          `INSERT INTO "purchaseOrderLine" ("purchaseOrderId", "purchaseOrderLineType", "itemId", description, "purchaseQuantity", "supplierUnitPrice", "inventoryUnitOfMeasureCode", "purchaseUnitOfMeasureCode", "companyId", "createdBy")
           VALUES ($1, 'Part'::"purchaseOrderLineType", $2, $3, $4, $5, $6, $6, $7, $8)`,
          [poRowId, itemId, line.itemReadableId, line.qty, line.unitPrice, line.uom, companyId, userId]
        );
      }
      console.log(`   Created purchase order "${poReadableId}"`);
    }

    // ─── Step 18: Sales orders ────────────────────────────────────────────────
    console.log("18. Seeding sales orders...");
    const soData = [
      {
        customerId: customerIds["Precision Motors LLC"],
        status: "Confirmed",
        lines: [
          { itemReadableId: "BRACKET-001", qty: 25, unitPrice: 125.0, uom: "EA" },
          { itemReadableId: "BEARING-6205", qty: 25, unitPrice: 18.5, uom: "EA" },
        ],
      },
      {
        customerId: customerIds["West Coast Robotics"],
        status: "Draft",
        lines: [
          { itemReadableId: "SHAFT-ASM-001", qty: 10, unitPrice: 280.0, uom: "EA" },
        ],
      },
      {
        customerId: customerIds["Northern Aerospace"],
        status: "Draft",
        lines: [
          { itemReadableId: "CTRL-PCB-001", qty: 5, unitPrice: 195.0, uom: "EA" },
          { itemReadableId: "BRACKET-001", qty: 10, unitPrice: 130.0, uom: "EA" },
        ],
      },
    ];

    for (const so of soData) {
      if (!so.customerId) continue;
      const soReadableId = await nextSeq("salesOrder");

      const soRow = await client.query<{ id: string }>(
        `INSERT INTO "salesOrder" ("salesOrderId", status, "currencyCode", "customerId", "companyId", "createdBy")
         VALUES ($1, $2::"salesOrderStatus", 'USD', $3, $4, $5)
         RETURNING id`,
        [soReadableId, so.status, so.customerId, companyId, userId]
      );
      const soRowId = soRow.rows[0]!.id;

      for (const line of so.lines) {
        const itemId = itemIds[line.itemReadableId];
        if (!itemId) continue;
        await client.query(
          `INSERT INTO "salesOrderLine" ("salesOrderId", "salesOrderLineType", "itemId", description, "saleQuantity", "unitPrice", "unitOfMeasureCode", "companyId", "createdBy")
           VALUES ($1, 'Part'::"salesOrderLineType", $2, $3, $4, $5, $6, $7, $8)`,
          [soRowId, itemId, line.itemReadableId, line.qty, line.unitPrice, line.uom, companyId, userId]
        );
      }
      console.log(`   Created sales order "${soReadableId}"`);
    }

    // ─── Step 19: Manufacturing job ───────────────────────────────────────────
    console.log("19. Seeding manufacturing job...");
    const bracketItemId = itemIds["BRACKET-001"];
    const steelRodItemId = itemIds["STEEL-ROD-01"];
    const cncProcessId = processIds["CNC Machining"];
    const cncWorkCenterId = workCenterIds["CNC Mill #1"];

    if (bracketItemId) {
      const jobReadableId = await nextSeq("job");

      const jobRow = await client.query<{ id: string }>(
        `INSERT INTO job ("jobId", "itemId", "unitOfMeasureCode", "locationId", status, quantity, "companyId", "createdBy")
         VALUES ($1, $2, 'EA', $3, 'Ready'::"jobStatus", 25, $4, $5)
         RETURNING id`,
        [jobReadableId, bracketItemId, locationId, companyId, userId]
      );
      const jobRowId = jobRow.rows[0]!.id;
      console.log(`   Created job "${jobReadableId}": ${jobRowId}`);

      if (cncProcessId) {
        const opRow = await client.query<{ id: string }>(
          `INSERT INTO "jobOperation" ("jobId", "order", "processId", "workCenterId", description, "laborTime", "laborUnit", "companyId", "createdBy")
           VALUES ($1, 1, $2, $3, 'CNC mill bracket profile', 30, 'Minutes/Piece'::factor, $4, $5)
           RETURNING id`,
          [jobRowId, cncProcessId, cncWorkCenterId ?? null, companyId, userId]
        );
        const opId = opRow.rows[0]!.id;
        console.log(`   Created job operation: ${opId}`);

        // Note: jobMaterial is skipped — it requires complex trigger/BOM logic
        // that is best managed through the application UI.
      }
    }

    // ─── Done ─────────────────────────────────────────────────────────────────
    console.log(`
========================================
Full dev seed completed successfully!
========================================

Login credentials:
  Email:    ${email}
  Password: ${DEV_PASSWORD}

Company: ${DEV_COMPANY_NAME}
Company ID: ${companyId}

Seeded:
  - 3 supplier types + 3 suppliers (with locations & contacts)
  - 3 customer types + 3 customers (with locations & contacts)
  - 4 departments, 3 cost centers
  - 1 warehouse
  - 3 shipping methods + 3 shipping terms
  - 4 processes + 3 work centers (with process links)
  - 6 items (parts, materials, consumables)
  - 4 item posting groups
  - 6 abilities
  - 2 purchase orders with lines
  - 3 sales orders with lines
  - 1 manufacturing job with operation
`);
  } catch (error) {
    console.error("\nError during full seed:");
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
    await pgPool.end();
  }
}

seed();
