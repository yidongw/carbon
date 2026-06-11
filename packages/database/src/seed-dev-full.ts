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

    // ─── Step 20: Second location ─────────────────────────────────────────────
    console.log("20. Seeding second location...");
    let location2Id: string;
    const existingLoc2 = await client.query<{ id: string }>(
      `SELECT id FROM location WHERE name = 'Remote Warehouse' AND "companyId" = $1 LIMIT 1`,
      [companyId]
    );
    if (existingLoc2.rows.length > 0) {
      location2Id = existingLoc2.rows[0]!.id;
    } else {
      const loc2Row = await client.query<{ id: string }>(
        `INSERT INTO location (name, "addressLine1", city, "stateProvince", "postalCode", "countryCode", timezone, "companyId", "createdBy")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        ["Remote Warehouse", "500 Storage Ave", "Detroit", "MI", "48201", "US", "America/Detroit", companyId, userId]
      );
      location2Id = loc2Row.rows[0]!.id;
      console.log(`   Created location "Remote Warehouse": ${location2Id}`);
    }

    // ─── Step 21: storageType + storageUnit ───────────────────────────────────
    console.log("21. Seeding storage types and units...");
    const storageTypeNames = ["Pallet Rack", "Bin", "Shelf"];
    const storageTypeIds: Record<string, string> = {};
    for (const stName of storageTypeNames) {
      const existing = await client.query<{ id: string }>(
        `SELECT id FROM "storageType" WHERE name = $1 AND "companyId" = $2 LIMIT 1`,
        [stName, companyId]
      );
      if (existing.rows.length > 0) {
        storageTypeIds[stName] = existing.rows[0]!.id;
      } else {
        const r = await client.query<{ id: string }>(
          `INSERT INTO "storageType" (name, "companyId", "createdBy") VALUES ($1, $2, $3) RETURNING id`,
          [stName, companyId, userId]
        );
        storageTypeIds[stName] = r.rows[0]!.id;
        console.log(`   Created storage type "${stName}"`);
      }
    }

    const storageUnits = [
      { name: "Rack A-01", warehouseId: warehouseId! },
      { name: "Rack A-02", warehouseId: warehouseId! },
      { name: "Bin B-01", warehouseId: warehouseId! },
    ];
    const storageUnitIds: string[] = [];
    for (const su of storageUnits) {
      const existing = await client.query<{ id: string }>(
        `SELECT id FROM "storageUnit" WHERE name = $1 AND "locationId" = $2 LIMIT 1`,
        [su.name, locationId]
      );
      if (existing.rows.length > 0) {
        storageUnitIds.push(existing.rows[0]!.id);
      } else {
        const r = await client.query<{ id: string }>(
          `INSERT INTO "storageUnit" (name, "locationId", "warehouseId", "companyId", "createdBy")
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [su.name, locationId, su.warehouseId, companyId, userId]
        );
        storageUnitIds.push(r.rows[0]!.id);
        console.log(`   Created storage unit "${su.name}"`);
      }
    }

    // ─── Step 22: shift + employeeShift ──────────────────────────────────────
    console.log("22. Seeding shifts...");
    const shiftsData = [
      { name: "Day Shift", start: "07:00:00", end: "15:00:00", mon: true, tue: true, wed: true, thu: true, fri: true },
      { name: "Night Shift", start: "15:00:00", end: "23:00:00", mon: true, tue: true, wed: true, thu: true, fri: true },
    ];
    const shiftIds: Record<string, string> = {};
    for (const sh of shiftsData) {
      const existing = await client.query<{ id: string }>(
        `SELECT id FROM shift WHERE name = $1 AND "companyId" = $2 LIMIT 1`,
        [sh.name, companyId]
      );
      if (existing.rows.length > 0) {
        shiftIds[sh.name] = existing.rows[0]!.id;
      } else {
        const r = await client.query<{ id: string }>(
          `INSERT INTO shift (name, "startTime", "endTime", "locationId", monday, tuesday, wednesday, thursday, friday, "companyId", "createdBy")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
          [sh.name, sh.start, sh.end, locationId, sh.mon, sh.tue, sh.wed, sh.thu, sh.fri, companyId, userId]
        );
        shiftIds[sh.name] = r.rows[0]!.id;
        console.log(`   Created shift "${sh.name}"`);
      }
    }

    const employeeRow = await client.query<{ id: string }>(
      `SELECT id FROM employee WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    const employeeId = employeeRow.rows[0]?.id ?? userId;
    const dayShiftId = shiftIds["Day Shift"];
    if (dayShiftId) {
      const existingES = await client.query(
        `SELECT 1 FROM "employeeShift" WHERE "employeeId" = $1 AND "shiftId" = $2 LIMIT 1`,
        [employeeId, dayShiftId]
      );
      if ((existingES.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO "employeeShift" ("employeeId", "shiftId") VALUES ($1, $2)`,
          [employeeId, dayShiftId]
        );
        console.log(`   Created employee shift assignment`);
      }
    }

    // ─── Step 23: material reference tables ───────────────────────────────────
    console.log("23. Seeding material reference data...");
    let steelSubstanceId: string | null = null;
    let aluminumSubstanceId: string | null = null;
    const substances = [
      { code: "STL", name: "Steel" },
      { code: "ALU", name: "Aluminum" },
    ];
    const substanceIds: Record<string, string> = {};
    for (const sub of substances) {
      const existing = await client.query<{ id: string }>(
        `SELECT id FROM "materialSubstance" WHERE name = $1 LIMIT 1`, [sub.name]
      );
      if (existing.rows.length > 0) {
        substanceIds[sub.name] = existing.rows[0]!.id;
      } else {
        const r = await client.query<{ id: string }>(
          `INSERT INTO "materialSubstance" (code, name, "companyId", "createdBy") VALUES ($1, $2, $3, $4) RETURNING id`,
          [sub.code, sub.name, companyId, userId]
        );
        substanceIds[sub.name] = r.rows[0]!.id;
        console.log(`   Created material substance "${sub.name}"`);
      }
    }
    steelSubstanceId = substanceIds["Steel"] ?? null;
    aluminumSubstanceId = substanceIds["Aluminum"] ?? null;

    let barFormId: string | null = null;
    const forms = [
      { code: "BAR", name: "Bar" },
      { code: "SHT", name: "Sheet" },
      { code: "TUB", name: "Tube" },
    ];
    const formIds: Record<string, string> = {};
    for (const form of forms) {
      const existing = await client.query<{ id: string }>(
        `SELECT id FROM "materialForm" WHERE name = $1 LIMIT 1`, [form.name]
      );
      if (existing.rows.length > 0) {
        formIds[form.name] = existing.rows[0]!.id;
      } else {
        const r = await client.query<{ id: string }>(
          `INSERT INTO "materialForm" (code, name, "createdBy") VALUES ($1, $2, $3) RETURNING id`,
          [form.code, form.name, userId]
        );
        formIds[form.name] = r.rows[0]!.id;
        console.log(`   Created material form "${form.name}"`);
      }
    }
    barFormId = formIds["Bar"] ?? null;

    let gradeId1020: string | null = null;
    if (steelSubstanceId) {
      const gradePairs = [
        { substanceId: steelSubstanceId, name: "1020" },
        { substanceId: steelSubstanceId, name: "4140" },
      ];
      if (aluminumSubstanceId) gradePairs.push({ substanceId: aluminumSubstanceId, name: "6061-T6" });
      for (const gp of gradePairs) {
        const existing = await client.query<{ id: string }>(
          `SELECT id FROM "materialGrade" WHERE name = $1 AND "materialSubstanceId" = $2 LIMIT 1`,
          [gp.name, gp.substanceId]
        );
        if (existing.rows.length > 0) {
          if (gp.name === "1020") gradeId1020 = existing.rows[0]!.id;
        } else {
          const r = await client.query<{ id: string }>(
            `INSERT INTO "materialGrade" ("materialSubstanceId", name) VALUES ($1, $2) RETURNING id`,
            [gp.substanceId, gp.name]
          );
          if (gp.name === "1020") gradeId1020 = r.rows[0]!.id;
          console.log(`   Created material grade "${gp.name}"`);
        }
      }
    }

    if (steelSubstanceId) {
      const finishes = [{ substanceId: steelSubstanceId, name: "Raw" }, { substanceId: steelSubstanceId, name: "Galvanized" }];
      for (const f of finishes) {
        const existing = await client.query(
          `SELECT 1 FROM "materialFinish" WHERE name = $1 AND "materialSubstanceId" = $2 LIMIT 1`,
          [f.name, f.substanceId]
        );
        if ((existing.rowCount ?? 0) === 0) {
          await client.query(
            `INSERT INTO "materialFinish" ("materialSubstanceId", name) VALUES ($1, $2)`,
            [f.substanceId, f.name]
          );
          console.log(`   Created material finish "${f.name}"`);
        }
      }
    }

    if (steelSubstanceId && barFormId) {
      const existing = await client.query<{ id: string }>(
        `SELECT id FROM "materialType" WHERE name = $1 LIMIT 1`, ["Carbon Steel Bar"]
      );
      if (existing.rows.length === 0) {
        await client.query(
          `INSERT INTO "materialType" (code, name, "materialSubstanceId", "materialFormId") VALUES ($1, $2, $3, $4)`,
          ["CSB", "Carbon Steel Bar", steelSubstanceId, barFormId]
        );
        console.log(`   Created material type "Carbon Steel Bar"`);
      }
    }

    // ─── Step 24: material + part + consumable + fixture + tool + service ──────
    console.log("24. Seeding item subtype records...");
    // Material record (standalone, not linked to item by FK)
    const existingMat = await client.query(
      `SELECT 1 FROM material WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    let materialId: string | null = null;
    if ((existingMat.rowCount ?? 0) === 0) {
      const r = await client.query<{ id: string }>(
        `INSERT INTO material ("materialSubstanceId", "materialFormId", "gradeId", "companyId", "createdBy")
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [steelSubstanceId, barFormId, gradeId1020, companyId, userId]
      );
      materialId = r.rows[0]!.id;
      console.log(`   Created material record: ${materialId}`);
    } else {
      materialId = (await client.query<{id: string}>(`SELECT id FROM material WHERE "companyId" = $1 LIMIT 1`, [companyId])).rows[0]!.id;
    }

    // Part records
    for (const readableId of ["BEARING-6205", "BRACKET-001", "SHAFT-ASM-001", "CTRL-PCB-001"]) {
      const itemIdForPart = itemIds[readableId];
      if (!itemIdForPart) continue;
      const existing = await client.query(
        `SELECT 1 FROM part WHERE "companyId" = $1 LIMIT 1`, [companyId]
      );
      // Create one part record per item type
      const existingPart = await client.query(
        `SELECT 1 FROM part WHERE id = (SELECT id FROM part WHERE "companyId" = $1 ORDER BY "createdAt" LIMIT 1) LIMIT 1`,
        [companyId]
      );
      break; // Just check if any part exists
    }
    const existingPartCount = await client.query<{count: string}>(
      `SELECT COUNT(*) AS count FROM part WHERE "companyId" = $1`, [companyId]
    );
    if (parseInt(existingPartCount.rows[0]!.count) === 0) {
      for (const readableId of ["BEARING-6205", "BRACKET-001", "SHAFT-ASM-001", "CTRL-PCB-001"]) {
        await client.query(
          `INSERT INTO part ("companyId", "createdBy") VALUES ($1, $2)`,
          [companyId, userId]
        );
      }
      console.log(`   Created 4 part records`);
    }

    // Consumable record
    const existingCons = await client.query(
      `SELECT 1 FROM consumable WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    if ((existingCons.rowCount ?? 0) === 0) {
      const consIdResult = await client.query<{ id: string }>(
        `SELECT id('cons'::text) AS id`
      );
      await client.query(
        `INSERT INTO consumable (id, "companyId", "createdBy") VALUES ($1, $2, $3)`,
        [consIdResult.rows[0]!.id, companyId, userId]
      );
      console.log(`   Created consumable record`);
    }

    // Tool record + new tool item
    const existingTool = await client.query(
      `SELECT 1 FROM tool WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    let toolItemId: string | null = null;
    if ((existingTool.rowCount ?? 0) === 0) {
      const toolItem = await client.query<{ id: string }>(
        `INSERT INTO item ("readableId", name, description, type, "replenishmentSystem", "itemTrackingType", "unitOfMeasureCode", active, "companyId", "createdBy")
         VALUES ('DRILL-JIG-01', 'Drill Jig Fixture', 'Custom drill jig for bracket machining', 'Tool'::"itemType", 'Buy'::"itemReplenishmentSystem", 'Inventory'::"itemTrackingType", 'EA', true, $1, $2)
         ON CONFLICT DO NOTHING RETURNING id`,
        [companyId, userId]
      );
      if (toolItem.rows.length > 0) toolItemId = toolItem.rows[0]!.id;
      const toolIdResult = await client.query<{ id: string }>(`SELECT id('tool'::text) AS id`);
      await client.query(
        `INSERT INTO tool (id, "companyId", "createdBy") VALUES ($1, $2, $3)`,
        [toolIdResult.rows[0]!.id, companyId, userId]
      );
      console.log(`   Created tool record`);
    }

    // Fixture record
    const existingFix = await client.query(
      `SELECT 1 FROM fixture WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    let toolRecordId: string | null = null;
    const toolRow = await client.query<{id: string}>(
      `SELECT id FROM tool WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    toolRecordId = toolRow.rows[0]?.id ?? null;

    if ((existingFix.rowCount ?? 0) === 0) {
      const fixIdResult = await client.query<{ id: string }>(`SELECT id('fix'::text) AS id`);
      await client.query(
        `INSERT INTO fixture (id, "companyId", "createdBy") VALUES ($1, $2, $3)`,
        [fixIdResult.rows[0]!.id, companyId, userId]
      );
      console.log(`   Created fixture record`);
    }

    // Service record
    const existingSvc = await client.query(
      `SELECT 1 FROM service WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    if ((existingSvc.rowCount ?? 0) === 0) {
      await client.query(
        `INSERT INTO service ("serviceType", "companyId", "createdBy") VALUES ('External'::"serviceType", $1, $2)`,
        [companyId, userId]
      );
      console.log(`   Created service record`);
    }

    // ─── Step 25: supplier extensions ────────────────────────────────────────
    console.log("25. Seeding supplier extensions...");
    const acmeSupplierId = supplierIds["Acme Steel Supply"]!;
    const pacificSupplierId = supplierIds["Pacific Electronics"]!;

    // supplierPart
    const existingSupplierPart = await client.query(
      `SELECT 1 FROM "supplierPart" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    if ((existingSupplierPart.rowCount ?? 0) === 0) {
      const steelItemId = itemIds["STEEL-ROD-01"];
      const pcbItemId = itemIds["CTRL-PCB-001"];
      if (steelItemId && acmeSupplierId) {
        await client.query(
          `INSERT INTO "supplierPart" ("itemId", "supplierId", "unitPrice", "companyId", "createdBy")
           VALUES ($1, $2, 5.50, $3, $4)`,
          [steelItemId, acmeSupplierId, companyId, userId]
        );
        console.log(`   Created supplier part (steel rod / Acme)`);
      }
      if (pcbItemId && pacificSupplierId) {
        const sp = await client.query<{id: string}>(
          `INSERT INTO "supplierPart" ("itemId", "supplierId", "unitPrice", "companyId", "createdBy")
           VALUES ($1, $2, 45.00, $3, $4) RETURNING id`,
          [pcbItemId, pacificSupplierId, companyId, userId]
        );
        // supplierPartPrice
        await client.query(
          `INSERT INTO "supplierPartPrice" ("supplierPartId", quantity, "unitPrice", "companyId", "createdBy")
           VALUES ($1, 1, 45.00, $2, $3)`,
          [sp.rows[0]!.id, companyId, userId]
        );
        console.log(`   Created supplier part + price (PCB / Pacific)`);
      }
    }

    // supplierProcess
    const fastCNCSupplierId = supplierIds["FastCNC Services"]!;
    const cncProcId = processIds["CNC Machining"];
    if (fastCNCSupplierId && cncProcId) {
      const existingSP = await client.query(
        `SELECT 1 FROM "supplierProcess" WHERE "supplierId" = $1 AND "companyId" = $2 LIMIT 1`,
        [fastCNCSupplierId, companyId]
      );
      if ((existingSP.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO "supplierProcess" ("supplierId", "processId", "minimumCost", "unitCost", "leadTime", "companyId", "createdBy")
           VALUES ($1, $2, 50.00, 2.50, 5, $3, $4)`,
          [fastCNCSupplierId, cncProcId, companyId, userId]
        );
        console.log(`   Created supplier process`);
      }
    }

    // supplierAccount: id is a FK to user.id; use the seed user mapped to first supplier
    const existingSupplierAccount = await client.query(
      `SELECT 1 FROM "supplierAccount" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    if ((existingSupplierAccount.rowCount ?? 0) === 0 && acmeSupplierId) {
      await client.query(
        `INSERT INTO "supplierAccount" (id, "supplierId", "companyId") VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
        [userId, acmeSupplierId, companyId]
      );
      console.log(`   Created supplier account`);
    }

    // customerAccount: id is a FK to user.id; use the seed user mapped to first customer
    const firstCustId = customerIds["Precision Motors LLC"];
    const existingCustomerAccount = await client.query(
      `SELECT 1 FROM "customerAccount" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    if ((existingCustomerAccount.rowCount ?? 0) === 0 && firstCustId) {
      await client.query(
        `INSERT INTO "customerAccount" (id, "customerId", "companyId") VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
        [userId, firstCustId, companyId]
      );
      console.log(`   Created customer account`);
    }

    // ─── Step 26: makeMethod + methodOperation + methodMaterial ──────────────
    console.log("26. Seeding make methods...");
    const bracketItemId2 = itemIds["BRACKET-001"];
    let makeMethodId: string | null = null;
    let methodOpId: string | null = null;
    if (bracketItemId2) {
      const existingMM = await client.query<{ id: string }>(
        `SELECT id FROM "makeMethod" WHERE "itemId" = $1 AND "companyId" = $2 LIMIT 1`,
        [bracketItemId2, companyId]
      );
      if (existingMM.rows.length > 0) {
        makeMethodId = existingMM.rows[0]!.id;
      } else {
        const r = await client.query<{ id: string }>(
          `INSERT INTO "makeMethod" ("itemId", "companyId", "createdBy") VALUES ($1, $2, $3) RETURNING id`,
          [bracketItemId2, companyId, userId]
        );
        makeMethodId = r.rows[0]!.id;
        console.log(`   Created make method for BRACKET-001`);
      }

      if (makeMethodId && cncProcId) {
        const existingMO = await client.query<{ id: string }>(
          `SELECT id FROM "methodOperation" WHERE "makeMethodId" = $1 LIMIT 1`, [makeMethodId]
        );
        if (existingMO.rows.length > 0) {
          methodOpId = existingMO.rows[0]!.id;
        } else {
          const r = await client.query<{ id: string }>(
            `INSERT INTO "methodOperation" ("makeMethodId", "processId", "workCenterId", description, "laborTime", "laborUnit", "machineTime", "machineUnit", "companyId", "createdBy")
             VALUES ($1, $2, $3, 'CNC mill profile', 30, 'Minutes/Piece'::factor, 30, 'Minutes/Piece'::factor, $4, $5) RETURNING id`,
            [makeMethodId, cncProcId, workCenterIds["CNC Mill #1"] ?? null, companyId, userId]
          );
          methodOpId = r.rows[0]!.id;
          console.log(`   Created method operation`);
        }

        // methodOperationStep
        if (methodOpId) {
          const existingMOS = await client.query(
            `SELECT 1 FROM "methodOperationStep" WHERE "operationId" = $1 LIMIT 1`, [methodOpId]
          );
          if ((existingMOS.rowCount ?? 0) === 0) {
            await client.query(
              `INSERT INTO "methodOperationStep" (name, "operationId", "type", required, "sortOrder", "companyId", "createdBy")
               VALUES ('Verify part dimensions', $1, 'Measurement'::"procedureStepType", true, 1, $2, $3)`,
              [methodOpId, companyId, userId]
            );
            console.log(`   Created method operation step`);
          }
        }

        // methodMaterial (steel rod → bracket operation)
        if (makeMethodId && methodOpId) {
          const steelItemId2 = itemIds["STEEL-ROD-01"];
          if (steelItemId2) {
            const existingMM2 = await client.query(
              `SELECT 1 FROM "methodMaterial" WHERE "makeMethodId" = $1 LIMIT 1`, [makeMethodId]
            );
            if ((existingMM2.rowCount ?? 0) === 0) {
              await client.query(
                `INSERT INTO "methodMaterial" ("makeMethodId", "methodOperationId", "itemId", quantity, "unitOfMeasureCode", "companyId", "createdBy")
                 VALUES ($1, $2, $3, 1.2, 'EA', $4, $5)`,
                [makeMethodId, methodOpId, steelItemId2, companyId, userId]
              );
              console.log(`   Created method material`);
            }
          }
        }
      }
    }

    // ─── Step 27: template + templateMakeMethod + templateMethodOperation ──────
    console.log("27. Seeding templates...");
    let templateId: string | null = null;
    const existingTemplate = await client.query<{ id: string }>(
      `SELECT id FROM template WHERE name = $1 AND "companyId" = $2 LIMIT 1`,
      ["Standard Manufacturing Template", companyId]
    );
    if (existingTemplate.rows.length > 0) {
      templateId = existingTemplate.rows[0]!.id;
    } else {
      const r = await client.query<{ id: string }>(
        `INSERT INTO template (name, description, "companyId") VALUES ($1, $2, $3) RETURNING id`,
        ["Standard Manufacturing Template", "Reusable template for CNC machined parts", companyId]
      );
      templateId = r.rows[0]!.id;
      console.log(`   Created template`);
    }

    let tmMakeMethodId: string | null = null;
    if (templateId && cncProcId) {
      const existingTMM = await client.query<{ id: string }>(
        `SELECT id FROM "templateMakeMethod" WHERE "templateId" = $1 LIMIT 1`, [templateId]
      );
      if (existingTMM.rows.length > 0) {
        tmMakeMethodId = existingTMM.rows[0]!.id;
      } else {
        const r = await client.query<{ id: string }>(
          `INSERT INTO "templateMakeMethod" ("templateId", "companyId", "createdBy") VALUES ($1, $2, $3) RETURNING id`,
          [templateId, companyId, userId]
        );
        tmMakeMethodId = r.rows[0]!.id;
        console.log(`   Created template make method`);
      }

      if (tmMakeMethodId) {
        const existingTMO = await client.query(
          `SELECT 1 FROM "templateMethodOperation" WHERE "templateMakeMethodId" = $1 LIMIT 1`, [tmMakeMethodId]
        );
        if ((existingTMO.rowCount ?? 0) === 0) {
          const tmoRow = await client.query<{id: string}>(
            `INSERT INTO "templateMethodOperation" ("templateMakeMethodId", "processId", description, "companyId", "createdBy")
             VALUES ($1, $2, 'Standard CNC operation', $3, $4) RETURNING id`,
            [tmMakeMethodId, cncProcId, companyId, userId]
          );
          const tmoId = tmoRow.rows[0]!.id;
          console.log(`   Created template method operation`);

          // templateMethodMaterial
          const steelItemId3 = itemIds["STEEL-ROD-01"];
          if (steelItemId3) {
            await client.query(
              `INSERT INTO "templateMethodMaterial" ("templateMakeMethodId", "itemId", quantity, "unitOfMeasureCode", "methodOperationId", "sourcingType", "companyId", "createdBy")
               VALUES ($1, $2, 1.0, 'EA', $3, 'Specified'::"sourcingType", $4, $5)`,
              [tmMakeMethodId, steelItemId3, tmoId, companyId, userId]
            );
            console.log(`   Created template method material`);
          }
        }
      }
    }

    // ─── Step 28: procedure + procedureStep ───────────────────────────────────
    console.log("28. Seeding procedures...");
    let procedureId: string | null = null;
    const existingProc = await client.query<{ id: string }>(
      `SELECT id FROM procedure WHERE name = $1 AND "companyId" = $2 LIMIT 1`,
      ["CNC Setup Procedure", companyId]
    );
    if (existingProc.rows.length > 0) {
      procedureId = existingProc.rows[0]!.id;
    } else {
      const r = await client.query<{ id: string }>(
        `INSERT INTO procedure (name, "processId", description, "companyId", "createdBy")
         VALUES ($1, $2, 'Standard procedure for CNC machine setup and inspection', $3, $4) RETURNING id`,
        ["CNC Setup Procedure", cncProcId ?? null, companyId, userId]
      );
      procedureId = r.rows[0]!.id;
      console.log(`   Created procedure "CNC Setup Procedure"`);
    }

    if (procedureId) {
      const existingPS = await client.query(
        `SELECT 1 FROM "procedureStep" WHERE "procedureId" = $1 LIMIT 1`, [procedureId]
      );
      if ((existingPS.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO "procedureStep" ("procedureId", name, required, "sortOrder", type, "companyId", "createdBy")
           VALUES ($1, 'Verify cutting tool condition', true, 1, 'Checkbox'::"procedureStepType", $2, $3)`,
          [procedureId, companyId, userId]
        );
        await client.query(
          `INSERT INTO "procedureStep" ("procedureId", name, required, "sortOrder", type, "minValue", "maxValue", "companyId", "createdBy")
           VALUES ($1, 'Measure part thickness', true, 2, 'Measurement'::"procedureStepType", 9.8, 10.2, $2, $3)`,
          [procedureId, companyId, userId]
        );
        console.log(`   Created 2 procedure steps`);
      }
    }

    // ─── Step 29: qualityDocument ─────────────────────────────────────────────
    console.log("29. Seeding quality documents...");
    const existingQD = await client.query(
      `SELECT 1 FROM "qualityDocument" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    if ((existingQD.rowCount ?? 0) === 0) {
      await client.query(
        `INSERT INTO "qualityDocument" (name, description, "companyId", "createdBy")
         VALUES ('ISO 9001 Quality Manual', 'Company quality management system documentation', $1, $2)`,
        [companyId, userId]
      );
      console.log(`   Created quality document`);
    }

    // ─── Step 30: training + trainingQuestion + trainingAssignment ─────────────
    console.log("30. Seeding training...");
    let trainingId: string | null = null;
    let trainingAssignmentId: string | null = null;
    const existingTrain = await client.query<{ id: string }>(
      `SELECT id FROM training WHERE name = $1 AND "companyId" = $2 LIMIT 1`,
      ["CNC Machine Safety Training", companyId]
    );
    if (existingTrain.rows.length > 0) {
      trainingId = existingTrain.rows[0]!.id;
    } else {
      const r = await client.query<{ id: string }>(
        `INSERT INTO training (name, description, status, frequency, type, "processId", "companyId", "createdBy")
         VALUES ($1, $2, 'Active'::"trainingStatus", 'Annual'::"trainingFrequency", 'Mandatory'::"trainingType", $3, $4, $5) RETURNING id`,
        ["CNC Machine Safety Training", "Annual safety training for CNC machine operators", cncProcId ?? null, companyId, userId]
      );
      trainingId = r.rows[0]!.id;
      console.log(`   Created training "CNC Machine Safety Training"`);
    }

    if (trainingId) {
      const existingTQ = await client.query(
        `SELECT 1 FROM "trainingQuestion" WHERE "trainingId" = $1 LIMIT 1`, [trainingId]
      );
      if ((existingTQ.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO "trainingQuestion" ("trainingId", question, type, "sortOrder", required, options, "correctAnswers", "companyId", "createdBy")
           VALUES ($1, 'What is the minimum safe distance from a running CNC machine?', 'MultipleChoice'::"trainingQuestionType", 1, true,
                   ARRAY['1 foot', '3 feet', '6 feet', '10 feet'], ARRAY['3 feet'], $2, $3)`,
          [trainingId, companyId, userId]
        );
        await client.query(
          `INSERT INTO "trainingQuestion" ("trainingId", question, type, "sortOrder", required, "correctBoolean", "companyId", "createdBy")
           VALUES ($1, 'You must wear safety glasses when operating a CNC machine.', 'TrueFalse'::"trainingQuestionType", 2, true, true, $2, $3)`,
          [trainingId, companyId, userId]
        );
        console.log(`   Created 2 training questions`);
      }

      const existingTA = await client.query<{ id: string }>(
        `SELECT id FROM "trainingAssignment" WHERE "trainingId" = $1 LIMIT 1`, [trainingId]
      );
      if (existingTA.rows.length > 0) {
        trainingAssignmentId = existingTA.rows[0]!.id;
      } else {
        const r = await client.query<{ id: string }>(
          `INSERT INTO "trainingAssignment" ("trainingId", "companyId", "createdBy") VALUES ($1, $2, $3) RETURNING id`,
          [trainingId, companyId, userId]
        );
        trainingAssignmentId = r.rows[0]!.id;
        console.log(`   Created training assignment`);
      }

      // trainingCompletion
      if (trainingAssignmentId) {
        const existingTC = await client.query(
          `SELECT 1 FROM "trainingCompletion" WHERE "trainingAssignmentId" = $1 LIMIT 1`, [trainingAssignmentId]
        );
        if ((existingTC.rowCount ?? 0) === 0) {
          await client.query(
            `INSERT INTO "trainingCompletion" ("trainingAssignmentId", "employeeId", "companyId", "completedBy", "createdBy")
             VALUES ($1, $2, $3, $4, $5)`,
            [trainingAssignmentId, employeeId, companyId, userId, userId]
          );
          console.log(`   Created training completion`);
        }
      }
    }

    // ─── Step 31: nonConformanceWorkflow + nonConformance ─────────────────────
    console.log("31. Seeding non-conformances...");
    let ncWorkflowId: string | null = null;
    const existingNCW = await client.query<{ id: string }>(
      `SELECT id FROM "nonConformanceWorkflow" WHERE name = $1 AND "companyId" = $2 LIMIT 1`,
      ["Standard NC Workflow", companyId]
    );
    if (existingNCW.rows.length > 0) {
      ncWorkflowId = existingNCW.rows[0]!.id;
    } else {
      const r = await client.query<{ id: string }>(
        `INSERT INTO "nonConformanceWorkflow" (name, description, "companyId", "createdBy")
         VALUES ($1, $2, $3, $4) RETURNING id`,
        ["Standard NC Workflow", "Default workflow for handling non-conformances", companyId, userId]
      );
      ncWorkflowId = r.rows[0]!.id;
      console.log(`   Created non-conformance workflow`);
    }

    const ncTypeRow = await client.query<{ id: string }>(
      `SELECT id FROM "nonConformanceType" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    const ncTypeId = ncTypeRow.rows[0]?.id;
    if (ncTypeId) {
      const existingNC = await client.query(
        `SELECT 1 FROM "nonConformance" WHERE "companyId" = $1 LIMIT 1`, [companyId]
      );
      if ((existingNC.rowCount ?? 0) === 0) {
        const ncReadableId = await nextSeq("nonConformance");
        const ncRow = await client.query<{ id: string }>(
          `INSERT INTO "nonConformance" ("nonConformanceId", name, source, "nonConformanceTypeId", "locationId", "openDate", "companyId", "createdBy")
           VALUES ($1, 'Dimension out of tolerance on bracket', 'Internal'::"nonConformanceSource", $2, $3, CURRENT_DATE, $4, $5) RETURNING id`,
          [ncReadableId, ncTypeId, locationId, companyId, userId]
        );
        const ncId = ncRow.rows[0]!.id;
        console.log(`   Created non-conformance "${ncReadableId}"`);

        // nonConformanceItem
        const bracketId = itemIds["BRACKET-001"];
        if (bracketId) {
          await client.query(
            `INSERT INTO "nonConformanceItem" ("nonConformanceId", "itemId", "companyId", "createdBy")
             VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
            [ncId, bracketId, companyId, userId]
          );
        }

        // nonConformanceSupplier
        if (acmeSupplierId) {
          await client.query(
            `INSERT INTO "nonConformanceSupplier" ("nonConformanceId", "supplierId", "companyId", "createdBy")
             VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
            [ncId, acmeSupplierId, companyId, userId]
          );
        }
      }
    }

    // ─── Step 32: maintenanceSchedule + maintenanceDispatch ──────────────────
    console.log("32. Seeding maintenance...");
    const cncWCId = workCenterIds["CNC Mill #1"];
    let maintenanceScheduleId: string | null = null;
    if (cncWCId) {
      const existingMS = await client.query<{ id: string }>(
        `SELECT id FROM "maintenanceSchedule" WHERE name = $1 AND "companyId" = $2 LIMIT 1`,
        ["CNC Mill Monthly PM", companyId]
      );
      if (existingMS.rows.length > 0) {
        maintenanceScheduleId = existingMS.rows[0]!.id;
      } else {
        const r = await client.query<{ id: string }>(
          `INSERT INTO "maintenanceSchedule" (name, description, "workCenterId", frequency, priority, "estimatedDuration", "locationId", "companyId", "createdBy")
           VALUES ($1, $2, $3, 'Monthly'::"maintenanceFrequency", 'Medium'::"maintenanceDispatchPriority", 120, $4, $5, $6) RETURNING id`,
          ["CNC Mill Monthly PM", "Monthly preventive maintenance for CNC Mill #1", cncWCId, locationId, companyId, userId]
        );
        maintenanceScheduleId = r.rows[0]!.id;
        console.log(`   Created maintenance schedule`);
      }

      const existingMD = await client.query(
        `SELECT 1 FROM "maintenanceDispatch" WHERE "companyId" = $1 LIMIT 1`, [companyId]
      );
      if ((existingMD.rowCount ?? 0) === 0) {
        const mdReadableId = await nextSeq("maintenanceDispatch");
        const mdRow = await client.query<{ id: string }>(
          `INSERT INTO "maintenanceDispatch" ("maintenanceDispatchId", "workCenterId", "maintenanceScheduleId", status, priority, severity, "locationId", "companyId", "createdBy")
           VALUES ($1, $2, $3, 'Open'::"maintenanceDispatchStatus", 'Medium'::"maintenanceDispatchPriority", 'Support Required'::"maintenanceSeverity", $4, $5, $6) RETURNING id`,
          [mdReadableId, cncWCId, maintenanceScheduleId, locationId, companyId, userId]
        );
        const mdId = mdRow.rows[0]!.id;
        console.log(`   Created maintenance dispatch "${mdReadableId}"`);

        // maintenanceDispatchWorkCenter
        await client.query(
          `INSERT INTO "maintenanceDispatchWorkCenter" ("maintenanceDispatchId", "workCenterId", "companyId", "createdBy")
           VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
          [mdId, cncWCId, companyId, userId]
        );

        // maintenanceScheduleItem
        if (maintenanceScheduleId) {
          const existingMSI = await client.query(
            `SELECT 1 FROM "maintenanceScheduleItem" WHERE "maintenanceScheduleId" = $1 LIMIT 1`, [maintenanceScheduleId]
          );
          if ((existingMSI.rowCount ?? 0) === 0) {
            await client.query(
              `INSERT INTO "maintenanceScheduleItem" ("maintenanceScheduleId", name, "sortOrder", "companyId", "createdBy")
               VALUES ($1, 'Check spindle oil level', 1, $2, $3)`,
              [maintenanceScheduleId, companyId, userId]
            );
          }
        }

        // maintenanceDispatchComment
        await client.query(
          `INSERT INTO "maintenanceDispatchComment" ("maintenanceDispatchId", "companyId", "createdBy", comment)
           VALUES ($1, $2, $3, 'Scheduled monthly maintenance initiated') ON CONFLICT DO NOTHING`,
          [mdId, companyId, userId]
        );
      }
    }

    // ─── Step 33: gauge + gaugeCalibrationRecord ──────────────────────────────
    console.log("33. Seeding gauges...");
    const gaugeTypeRow = await client.query<{ id: string }>(
      `SELECT id FROM "gaugeType" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    const gaugeTypeId = gaugeTypeRow.rows[0]?.id;
    let gaugeRecordId: string | null = null;
    if (gaugeTypeId) {
      const existingGauge = await client.query<{ id: string }>(
        `SELECT id FROM gauge WHERE "companyId" = $1 LIMIT 1`, [companyId]
      );
      if (existingGauge.rows.length > 0) {
        gaugeRecordId = existingGauge.rows[0]!.id;
      } else {
        const gReadableId = await nextSeq("gauge");
        const r = await client.query<{ id: string }>(
          `INSERT INTO gauge ("gaugeId", "gaugeTypeId", description, "locationId", "companyId", "createdBy")
           VALUES ($1, $2, 'Digital caliper for part measurement', $3, $4, $5) RETURNING id`,
          [gReadableId, gaugeTypeId, locationId, companyId, userId]
        );
        gaugeRecordId = r.rows[0]!.id;
        console.log(`   Created gauge "${gReadableId}"`);
      }

      if (gaugeRecordId) {
        const existingGCR = await client.query(
          `SELECT 1 FROM "gaugeCalibrationRecord" WHERE "gaugeId" = $1 LIMIT 1`, [gaugeRecordId]
        );
        if ((existingGCR.rowCount ?? 0) === 0) {
          await client.query(
            `INSERT INTO "gaugeCalibrationRecord" ("gaugeId", "dateCalibrated", "inspectionStatus", "companyId", "createdBy")
             VALUES ($1, CURRENT_DATE - INTERVAL '30 days', 'Pass'::"inspectionStatus", $2, $3)`,
            [gaugeRecordId, companyId, userId]
          );
          console.log(`   Created gauge calibration record`);
        }
      }
    }

    // ─── Step 34: riskRegister ────────────────────────────────────────────────
    console.log("34. Seeding risk register...");
    const existingRR = await client.query(
      `SELECT 1 FROM "riskRegister" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    if ((existingRR.rowCount ?? 0) === 0) {
      await client.query(
        `INSERT INTO "riskRegister" ("companyId", title, description, source, severity, likelihood, status, "createdBy")
         VALUES ($1, 'Single-source supplier risk', 'Reliance on one supplier for critical PCB components', 'Supplier'::"riskSource", 4, 3, 'Open'::"riskStatus", $2)`,
        [companyId, userId]
      );
      await client.query(
        `INSERT INTO "riskRegister" ("companyId", title, description, source, severity, likelihood, status, "createdBy")
         VALUES ($1, 'Machine downtime impact', 'CNC Mill #1 has no backup machine available', 'Work Center'::"riskSource", 3, 2, 'In Review'::"riskStatus", $2)`,
        [companyId, userId]
      );
      console.log(`   Created 2 risk register entries`);
    }

    // ─── Step 35: document + note ─────────────────────────────────────────────
    console.log("35. Seeding documents and notes...");
    let documentId: string | null = null;
    const existingDoc = await client.query<{ id: string }>(
      `SELECT id FROM document WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    if (existingDoc.rows.length > 0) {
      documentId = existingDoc.rows[0]!.id;
    } else {
      const r = await client.query<{ id: string }>(
        `INSERT INTO document (path, name, description, size, type, "companyId", "createdBy")
         VALUES ($1, $2, $3, $4, 'PDF'::"documentType", $5, $6) RETURNING id`,
        ["/documents/bracket-drawing-rev2.pdf", "Bracket Drawing Rev2", "Engineering drawing for Mounting Bracket A", 245000, companyId, userId]
      );
      documentId = r.rows[0]!.id;
      console.log(`   Created document`);
    }

    if (documentId) {
      const existingNote = await client.query(
        `SELECT 1 FROM note WHERE "documentId" = $1 LIMIT 1`, [documentId]
      );
      if ((existingNote.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO note ("documentId", note, "companyId", "createdBy")
           VALUES ($1, 'Updated dimension tolerances in section 3.2 per ECO-2024-001', $2, $3)`,
          [documentId, companyId, userId]
        );
        console.log(`   Created note`);
      }
    }

    // ─── Step 36: tag ─────────────────────────────────────────────────────────
    console.log("36. Seeding tags...");
    const tagsData = [
      { name: "Critical", table: "item" },
      { name: "Preferred", table: "supplier" },
      { name: "Urgent", table: "purchaseOrder" },
      { name: "Review", table: "nonConformance" },
    ];
    for (const tag of tagsData) {
      const existing = await client.query(
        `SELECT 1 FROM tag WHERE name = $1 AND "table" = $2 AND "companyId" = $3 LIMIT 1`,
        [tag.name, tag.table, companyId]
      );
      if ((existing.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO tag (name, "table", "companyId", "createdBy") VALUES ($1, $2, $3, $4)`,
          [tag.name, tag.table, companyId, userId]
        );
      }
    }
    console.log(`   Created 4 tags`);

    // ─── Step 37: opportunity ─────────────────────────────────────────────────
    console.log("37. Seeding opportunities...");
    const existingOpp = await client.query(
      `SELECT 1 FROM opportunity WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    if ((existingOpp.rowCount ?? 0) === 0) {
      const custId = customerIds["Precision Motors LLC"];
      await client.query(
        `INSERT INTO opportunity ("customerId", "companyId") VALUES ($1, $2)`,
        [custId ?? null, companyId]
      );
      console.log(`   Created opportunity`);
    }

    // ─── Step 38: suggestion ──────────────────────────────────────────────────
    console.log("38. Seeding suggestions...");
    const existingSugg = await client.query(
      `SELECT 1 FROM suggestion WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    if ((existingSugg.rowCount ?? 0) === 0) {
      await client.query(
        `INSERT INTO suggestion (suggestion, path, "companyId", "userId") VALUES ($1, $2, $3, $4)`,
        ["Add barcode scanning to the receipt posting flow for faster processing", "/purchasing/receipts", companyId, userId]
      );
      console.log(`   Created suggestion`);
    }

    // ─── Step 39: noQuoteReason + pricingRule + webhook ───────────────────────
    console.log("39. Seeding no-quote reasons, pricing rules, and webhooks...");
    const existingNQR = await client.query(
      `SELECT 1 FROM "noQuoteReason" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    if ((existingNQR.rowCount ?? 0) === 0) {
      for (const reason of ["Capacity Constraints", "Outside Capabilities", "Price Too Low"]) {
        await client.query(
          `INSERT INTO "noQuoteReason" (name, "companyId", "createdBy") VALUES ($1, $2, $3)`,
          [reason, companyId, userId]
        );
      }
      console.log(`   Created 3 no-quote reasons`);
    }

    const existingPR = await client.query(
      `SELECT 1 FROM "pricingRule" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    if ((existingPR.rowCount ?? 0) === 0) {
      await client.query(
        `INSERT INTO "pricingRule" (name, "ruleType", "amountType", amount, priority, "companyId", "createdBy")
         VALUES ('OEM Volume Discount', 'Discount'::"pricingRuleType", 'Percentage'::"pricingRuleAmountType", 5.0, 1, $1, $2)`,
        [companyId, userId]
      );
      console.log(`   Created pricing rule`);
    }

    const existingWH2 = await client.query(
      `SELECT 1 FROM webhook WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    if ((existingWH2.rowCount ?? 0) === 0) {
      const whTableRow = await client.query<{table: string}>(
        `SELECT "table" FROM "webhookTable" LIMIT 1`
      );
      const whTableId = whTableRow.rows[0]?.table;
      if (whTableId) {
        await client.query(
          `INSERT INTO webhook (name, "table", url, "onInsert", "companyId", "createdBy")
           VALUES ('New Record Notification', $1, 'https://hooks.example.com/new-record', true, $2, $3)`,
          [whTableId, companyId, userId]
        );
        console.log(`   Created webhook`);
      }
    }

    // ─── Step 40: attributeDataType + customField + userAttributeCategory ──────
    console.log("40. Seeding attribute data types, custom fields, user attribute categories...");
    const adtExisting = await client.query<{ id: number }>(
      `SELECT id FROM "attributeDataType" LIMIT 1`
    );
    let textDataTypeId: number | null = null;
    if (adtExisting.rows.length === 0) {
      const adt1 = await client.query<{ id: number }>(
        `INSERT INTO "attributeDataType" (label, "isText") VALUES ('Text', true) RETURNING id`
      );
      textDataTypeId = adt1.rows[0]!.id;
      const adt2 = await client.query<{ id: number }>(
        `INSERT INTO "attributeDataType" (label, "isNumeric") VALUES ('Number', true) RETURNING id`
      );
      await client.query(`INSERT INTO "attributeDataType" (label, "isBoolean") VALUES ('Boolean', true)`);
      await client.query(`INSERT INTO "attributeDataType" (label, "isDate") VALUES ('Date', true)`);
      await client.query(`INSERT INTO "attributeDataType" (label, "isList") VALUES ('List', true)`);
      console.log(`   Created 5 attribute data types`);
    } else {
      textDataTypeId = (await client.query<{id: number}>(`SELECT id FROM "attributeDataType" LIMIT 1`)).rows[0]!.id;
    }

    const existingCF = await client.query(
      `SELECT 1 FROM "customField" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    if ((existingCF.rowCount ?? 0) === 0 && textDataTypeId !== null) {
      const cfTableRow = await client.query<{table: string}>(
        `SELECT "table" FROM "customFieldTable" LIMIT 1`
      );
      const cfTableName = cfTableRow.rows[0]?.table;
      if (cfTableName) {
        await client.query(
          `INSERT INTO "customField" (name, "table", "dataTypeId", "sortOrder", "companyId", "createdBy")
           VALUES ('Reference Number', $1, $2, 1, $3, $4)`,
          [cfTableName, textDataTypeId, companyId, userId]
        );
        console.log(`   Created 1 custom field`);
      }
    }

    const existingUAC = await client.query(
      `SELECT 1 FROM "userAttributeCategory" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    if ((existingUAC.rowCount ?? 0) === 0) {
      const uacRow = await client.query<{id: string}>(
        `INSERT INTO "userAttributeCategory" (name, "companyId", "createdBy") VALUES ('Employee Details', $1, $2) RETURNING id`,
        [companyId, userId]
      );
      const uacId = uacRow.rows[0]!.id;
      if (textDataTypeId !== null) {
        await client.query(
          `INSERT INTO "userAttribute" (name, "userAttributeCategoryId", "attributeDataTypeId", "sortOrder", "createdBy")
           VALUES ('Department', $1, $2, 1, $3)`,
          [uacId, textDataTypeId, userId]
        );
        await client.query(
          `INSERT INTO "userAttribute" (name, "userAttributeCategoryId", "attributeDataTypeId", "sortOrder", "createdBy")
           VALUES ('Employee ID', $1, $2, 2, $3)`,
          [uacId, textDataTypeId, userId]
        );
      }
      console.log(`   Created user attribute category and attributes`);
    }

    // ─── Step 41: accountingPeriod + journal + journalLine ────────────────────
    console.log("41. Seeding accounting periods and journals...");
    const existingAP = await client.query(
      `SELECT 1 FROM "accountingPeriod" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    let accountingPeriodId: string | null = null;
    if ((existingAP.rowCount ?? 0) === 0) {
      const r = await client.query<{id: string}>(
        `INSERT INTO "accountingPeriod" ("startDate", "endDate", status, "companyId", "createdBy")
         VALUES ('2026-01-01', '2026-03-31', 'Active'::"accountingPeriodStatus", $1, $2) RETURNING id`,
        [companyId, userId]
      );
      accountingPeriodId = r.rows[0]!.id;
      await client.query(
        `INSERT INTO "accountingPeriod" ("startDate", "endDate", status, "companyId", "createdBy")
         VALUES ('2026-04-01', '2026-06-30', 'Active'::"accountingPeriodStatus", $1, $2)`,
        [companyId, userId]
      );
      console.log(`   Created 2 accounting periods`);
    } else {
      accountingPeriodId = (await client.query<{id: string}>(
        `SELECT id FROM "accountingPeriod" WHERE "companyId" = $1 LIMIT 1`, [companyId]
      )).rows[0]!.id;
    }

    const existingJournal = await client.query(
      `SELECT 1 FROM journal WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    if ((existingJournal.rowCount ?? 0) === 0) {
      const jeId = await nextSeq("journalEntry");
      const journalRow = await client.query<{id: string}>(
        `INSERT INTO journal ("journalEntryId", description, "accountingPeriodId", "companyId", "createdBy")
         VALUES ($1, 'Opening balance entry', $2, $3, $4) RETURNING id`,
        [jeId, accountingPeriodId, companyId, userId]
      );
      const journalId = journalRow.rows[0]!.id;
      console.log(`   Created journal entry "${jeId}"`);

      // journalLine (needs accountId - use first account)
      const accountRow = await client.query<{id: string}>(
        `SELECT id FROM account WHERE "isGroup" = false LIMIT 1`
      );
      const accountId = accountRow.rows[0]?.id;
      if (accountId) {
        await client.query(
          `INSERT INTO "journalLine" ("journalId", "journalLineReference", amount, "accountId", "companyId")
           VALUES ($1, $2, 10000.00, $3, $4)`,
          [journalId, jeId + "-L1", accountId, companyId]
        );
        await client.query(
          `INSERT INTO "journalLine" ("journalId", "journalLineReference", amount, "accountId", "companyId")
           VALUES ($1, $2, -10000.00, $3, $4)`,
          [journalId, jeId + "-L2", accountId, companyId]
        );
        console.log(`   Created 2 journal lines`);
      }
    }

    // ─── Step 42: holiday ─────────────────────────────────────────────────────
    console.log("42. Seeding holidays...");
    const existingHoliday = await client.query(
      `SELECT 1 FROM holiday WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    if ((existingHoliday.rowCount ?? 0) === 0) {
      const holidays = [
        { name: "New Year's Day", date: "2026-01-01" },
        { name: "Independence Day", date: "2026-07-04" },
        { name: "Thanksgiving", date: "2026-11-26" },
        { name: "Christmas Day", date: "2026-12-25" },
      ];
      for (const h of holidays) {
        await client.query(
          `INSERT INTO holiday (name, date, "companyId", "createdBy") VALUES ($1, $2, $3, $4)`,
          [h.name, h.date, companyId, userId]
        );
      }
      console.log(`   Created 4 holidays`);
    }

    // ─── Step 43: itemSamplingPlan + itemShelfLife + itemRule + batchProperty ─
    console.log("43. Seeding item rules and properties...");
    const steelItemId4 = itemIds["STEEL-ROD-01"];
    const bracketItemId3 = itemIds["BRACKET-001"];

    if (steelItemId4) {
      const existingSP2 = await client.query(
        `SELECT 1 FROM "itemSamplingPlan" WHERE "itemId" = $1 LIMIT 1`, [steelItemId4]
      );
      if ((existingSP2.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO "itemSamplingPlan" ("itemId", type, "sampleSize", "inspectionLevel", severity, "companyId", "createdBy")
           VALUES ($1, 'AQL'::"samplingPlanType", 5, 'II'::"inspectionLevel", 'Normal'::"inspectionSeverity", $2, $3)`,
          [steelItemId4, companyId, userId]
        );
        console.log(`   Created item sampling plan`);
      }

      const existingBP = await client.query(
        `SELECT 1 FROM "batchProperty" WHERE "itemId" = $1 LIMIT 1`, [steelItemId4]
      );
      if ((existingBP.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO "batchProperty" ("itemId", label, "dataType", "companyId", "createdBy")
           VALUES ($1, 'Heat Number', 'text'::"configurationParameterDataType", $2, $3)`,
          [steelItemId4, companyId, userId]
        );
        console.log(`   Created batch property`);
      }
    }

    if (bracketItemId3) {
      const existingISL = await client.query(
        `SELECT 1 FROM "itemShelfLife" WHERE "itemId" = $1 LIMIT 1`, [bracketItemId3]
      );
      if ((existingISL.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO "itemShelfLife" ("itemId", mode, days, "triggerTiming", "companyId", "createdBy")
           VALUES ($1, 'Fixed Duration'::"shelfLifeMode", 365, 'After'::"shelfLifeTriggerTiming", $2, $3)`,
          [bracketItemId3, companyId, userId]
        );
        console.log(`   Created item shelf life`);
      }
    }

    // itemRule + itemRuleAssignment
    const existingIR = await client.query(
      `SELECT 1 FROM "itemRule" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    let itemRuleId: string | null = null;
    if ((existingIR.rowCount ?? 0) === 0) {
      const r = await client.query<{id: string}>(
        `INSERT INTO "itemRule" (name, message, severity, "conditionAst", "companyId", "createdBy")
         VALUES ('Low Stock Warning', 'Item quantity below safety stock', 'warn', '[]'::jsonb, $1, $2) RETURNING id`,
        [companyId, userId]
      );
      itemRuleId = r.rows[0]!.id;
      console.log(`   Created item rule`);
    } else {
      itemRuleId = (await client.query<{id:string}>(`SELECT id FROM "itemRule" WHERE "companyId" = $1 LIMIT 1`, [companyId])).rows[0]!.id;
    }

    if (itemRuleId && steelItemId4) {
      const existingIRA = await client.query(
        `SELECT 1 FROM "itemRuleAssignment" WHERE "itemId" = $1 AND "ruleId" = $2 LIMIT 1`,
        [steelItemId4, itemRuleId]
      );
      if ((existingIRA.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO "itemRuleAssignment" ("itemId", "ruleId", "companyId", "createdBy") VALUES ($1, $2, $3, $4)`,
          [steelItemId4, itemRuleId, companyId, userId]
        );
        console.log(`   Created item rule assignment`);
      }
    }

    // ─── Step 44: pickMethod + kanban ─────────────────────────────────────────
    console.log("44. Seeding pick methods and kanban...");
    if (bracketItemId3) {
      const existingPM = await client.query(
        `SELECT 1 FROM "pickMethod" WHERE "itemId" = $1 AND "locationId" = $2 LIMIT 1`,
        [bracketItemId3, locationId]
      );
      if ((existingPM.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO "pickMethod" ("itemId", "locationId", "companyId", "createdBy") VALUES ($1, $2, $3, $4)`,
          [bracketItemId3, locationId, companyId, userId]
        );
        console.log(`   Created pick method`);
      }

      const existingKB = await client.query(
        `SELECT 1 FROM kanban WHERE "itemId" = $1 AND "locationId" = $2 LIMIT 1`,
        [bracketItemId3, locationId]
      );
      if ((existingKB.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO kanban ("itemId", "replenishmentSystem", quantity, "locationId", "companyId", "createdBy")
           VALUES ($1, 'Make'::"itemReplenishmentSystem", 10, $2, $3, $4)`,
          [bracketItemId3, locationId, companyId, userId]
        );
        console.log(`   Created kanban`);
      }
    }

    // ─── Step 45: partner + contractor + contractorAbility ────────────────────
    console.log("45. Seeding partners and contractors...");

    // Get first supplier location and contact IDs
    const suppLocRow = await client.query<{id: string}>(
      `SELECT id FROM "supplierLocation" WHERE "supplierId" = $1 LIMIT 1`, [acmeSupplierId]
    );
    const suppContactRow = await client.query<{id: string}>(
      `SELECT id FROM "supplierContact" WHERE "supplierId" = $1 LIMIT 1`, [acmeSupplierId]
    );
    const suppLocId2 = suppLocRow.rows[0]?.id;
    const suppContactId = suppContactRow.rows[0]?.id;

    const abilityRow = await client.query<{id: string}>(
      `SELECT id FROM ability WHERE name = $1 AND "companyId" = $2 LIMIT 1`,
      ["CNC Machining", companyId]
    );
    const cncAbilityId = abilityRow.rows[0]?.id;

    if (suppLocId2 && cncAbilityId) {
      const existingPartner = await client.query(
        `SELECT 1 FROM partner WHERE id = $1 LIMIT 1`, [suppLocId2]
      );
      if ((existingPartner.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO partner (id, "abilityId", "companyId", "createdBy") VALUES ($1, $2, $3, $4)`,
          [suppLocId2, cncAbilityId, companyId, userId]
        );
        console.log(`   Created partner`);
      }
    }

    if (suppContactId) {
      const existingContractor = await client.query(
        `SELECT 1 FROM contractor WHERE id = $1 LIMIT 1`, [suppContactId]
      );
      if ((existingContractor.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO contractor (id, "companyId", "createdBy") VALUES ($1, $2, $3)`,
          [suppContactId, companyId, userId]
        );
        console.log(`   Created contractor`);

        if (cncAbilityId) {
          await client.query(
            `INSERT INTO "contractorAbility" ("contractorId", "abilityId", "createdBy") VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
            [suppContactId, cncAbilityId, userId]
          );
          console.log(`   Created contractor ability`);
        }
      }
    }

    // ─── Step 46: employeeAbility + employeeSalaryRecord + employeeSalaryPayment
    console.log("46. Seeding employee data...");
    if (cncAbilityId) {
      const existingEA = await client.query(
        `SELECT 1 FROM "employeeAbility" WHERE "employeeId" = $1 AND "abilityId" = $2 LIMIT 1`,
        [employeeId, cncAbilityId]
      );
      if ((existingEA.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO "employeeAbility" ("employeeId", "abilityId", "companyId")
           VALUES ($1, $2, $3)`,
          [employeeId, cncAbilityId, companyId]
        );
        console.log(`   Created employee ability`);
      }
    }

    const existingESR = await client.query<{id: string}>(
      `SELECT id FROM "employeeSalaryRecord" WHERE "employeeId" = $1 AND "companyId" = $2 LIMIT 1`,
      [employeeId, companyId]
    );
    let salaryRecordId: string | null = null;
    if (existingESR.rows.length === 0) {
      const r = await client.query<{id: string}>(
        `INSERT INTO "employeeSalaryRecord" ("employeeId", year, month, "totalEarned", "totalPaid", status, "companyId", "createdBy")
         VALUES ($1, 2026, 5, 7500.00, 7500.00, 'Paid'::"salaryRecordStatus", $2, $3) RETURNING id`,
        [employeeId, companyId, userId]
      );
      salaryRecordId = r.rows[0]!.id;
      console.log(`   Created salary record`);
    } else {
      salaryRecordId = existingESR.rows[0]!.id;
    }

    if (salaryRecordId) {
      const existingESP = await client.query(
        `SELECT 1 FROM "employeeSalaryPayment" WHERE "salaryRecordId" = $1 LIMIT 1`, [salaryRecordId]
      );
      if ((existingESP.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO "employeeSalaryPayment" ("salaryRecordId", amount, "paidBy", "companyId")
           VALUES ($1, 7500.00, $2, $3)`,
          [salaryRecordId, userId, companyId]
        );
        console.log(`   Created salary payment`);
      }
    }

    // ─── Step 47: jobAssignmentRule + jobGroupAssignment + jobOperationStep ───
    console.log("47. Seeding job rules and operation steps...");
    const allEmployeesGroupRow = await client.query<{id: string}>(
      `SELECT id FROM "group" WHERE name = 'All Employees' AND "companyId" = $1 LIMIT 1`,
      [companyId]
    );
    const allEmployeesGroupId = allEmployeesGroupRow.rows[0]?.id;

    if (allEmployeesGroupId) {
      const existingJAR = await client.query(
        `SELECT 1 FROM "jobAssignmentRule" WHERE "companyId" = $1 LIMIT 1`, [companyId]
      );
      let jobRuleId: string | null = null;
      if ((existingJAR.rowCount ?? 0) === 0) {
        const r = await client.query<{id: string}>(
          `INSERT INTO "jobAssignmentRule" (name, "targetGroupId", "companyId", "createdBy")
           VALUES ('Auto-assign all jobs', $1, $2, $3) RETURNING id`,
          [allEmployeesGroupId, companyId, userId]
        );
        jobRuleId = r.rows[0]!.id;
        console.log(`   Created job assignment rule`);
      }

      // Get existing job ID
      const jobRow = await client.query<{id: string}>(
        `SELECT id FROM job WHERE "companyId" = $1 LIMIT 1`, [companyId]
      );
      const existingJobId = jobRow.rows[0]?.id;
      if (existingJobId) {
        const existingJGA = await client.query(
          `SELECT 1 FROM "jobGroupAssignment" WHERE "jobId" = $1 LIMIT 1`, [existingJobId]
        );
        if ((existingJGA.rowCount ?? 0) === 0) {
          await client.query(
            `INSERT INTO "jobGroupAssignment" ("jobId", "groupId", "companyId", "assignedBy")
             VALUES ($1, $2, $3, $4)`,
            [existingJobId, allEmployeesGroupId, companyId, userId]
          );
          console.log(`   Created job group assignment`);
        }
      }
    }

    // jobOperationStep + jobOperationParameter + jobOperationTool
    const jobOpRow = await client.query<{id: string}>(
      `SELECT id FROM "jobOperation" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    const jobOpId = jobOpRow.rows[0]?.id;
    if (jobOpId) {
      const existingJOS = await client.query(
        `SELECT 1 FROM "jobOperationStep" WHERE "operationId" = $1 LIMIT 1`, [jobOpId]
      );
      if ((existingJOS.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO "jobOperationStep" (name, "operationId", type, required, "sortOrder", "companyId", "createdBy")
           VALUES ('Verify setup dimensions', $1, 'Measurement'::"procedureStepType", true, 1, $2, $3)`,
          [jobOpId, companyId, userId]
        );
        console.log(`   Created job operation step`);
      }

      const existingJOP = await client.query(
        `SELECT 1 FROM "jobOperationParameter" WHERE "operationId" = $1 LIMIT 1`, [jobOpId]
      );
      if ((existingJOP.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO "jobOperationParameter" (key, value, "operationId", "companyId", "createdBy")
           VALUES ('Feed Rate', '1200 mm/min', $1, $2, $3)`,
          [jobOpId, companyId, userId]
        );
        console.log(`   Created job operation parameter`);
      }

      // jobOperationTool - toolId is a FK to item.id (where item.type = 'Tool')
      const toolItemRow = await client.query<{id: string}>(
        `SELECT id FROM item WHERE type = 'Tool'::"itemType" AND "companyId" = $1 LIMIT 1`, [companyId]
      );
      const toolItemIdForOp = toolItemRow.rows[0]?.id;
      if (toolItemIdForOp) {
        const existingJOT = await client.query(
          `SELECT 1 FROM "jobOperationTool" WHERE "operationId" = $1 LIMIT 1`, [jobOpId]
        );
        if ((existingJOT.rowCount ?? 0) === 0) {
          await client.query(
            `INSERT INTO "jobOperationTool" ("operationId", "toolId", quantity, "companyId", "createdBy")
             VALUES ($1, $2, 1, $3, $4)`,
            [jobOpId, toolItemIdForOp, companyId, userId]
          );
          console.log(`   Created job operation tool`);
        }
      }
    }

    // ─── Step 48: purchasingRfq + lines + suppliers ───────────────────────────
    console.log("48. Seeding purchasing RFQs...");
    const existingPRFQ = await client.query(
      `SELECT 1 FROM "purchasingRfq" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    let purchasingRfqId: string | null = null;
    if ((existingPRFQ.rowCount ?? 0) === 0) {
      const rfqReadableId = await nextSeq("purchasingRfq");
      const rfqRow = await client.query<{id: string}>(
        `INSERT INTO "purchasingRfq" ("rfqId", "rfqDate", status, "locationId", "companyId", "createdBy")
         VALUES ($1, CURRENT_DATE, 'Draft'::"purchasingRfqStatus", $2, $3, $4) RETURNING id`,
        [rfqReadableId, locationId, companyId, userId]
      );
      purchasingRfqId = rfqRow.rows[0]!.id;
      console.log(`   Created purchasing RFQ "${rfqReadableId}"`);

      const pcbItemId = itemIds["CTRL-PCB-001"];
      if (pcbItemId) {
        await client.query(
          `INSERT INTO "purchasingRfqLine" ("purchasingRfqId", "itemId", "purchaseUnitOfMeasureCode", "inventoryUnitOfMeasureCode", "companyId", "createdBy")
           VALUES ($1, $2, 'EA', 'EA', $3, $4)`,
          [purchasingRfqId, pcbItemId, companyId, userId]
        );
        console.log(`   Created purchasing RFQ line`);
      }

      if (pacificSupplierId) {
        await client.query(
          `INSERT INTO "purchasingRfqSupplier" ("purchasingRfqId", "supplierId", "companyId")
           VALUES ($1, $2, $3)`,
          [purchasingRfqId, pacificSupplierId, companyId]
        );
        console.log(`   Created purchasing RFQ supplier`);
      }
    }

    // ─── Step 49: supplierQuote + lines ──────────────────────────────────────
    console.log("49. Seeding supplier quotes...");
    const existingSQ = await client.query(
      `SELECT 1 FROM "supplierQuote" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    let supplierQuoteId: string | null = null;
    if ((existingSQ.rowCount ?? 0) === 0 && pacificSupplierId) {
      const sqReadableId = await nextSeq("supplierQuote");
      const sqInteractionId = await getOrCreateSupplierInteraction(pacificSupplierId);
      const sqRow = await client.query<{id: string}>(
        `INSERT INTO "supplierQuote" ("supplierQuoteId", "supplierId", "supplierInteractionId", "companyId", "createdBy")
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [sqReadableId, pacificSupplierId, sqInteractionId, companyId, userId]
      );
      supplierQuoteId = sqRow.rows[0]!.id;
      console.log(`   Created supplier quote "${sqReadableId}"`);

      const pcbItemId = itemIds["CTRL-PCB-001"];
      if (pcbItemId) {
        await client.query(
          `INSERT INTO "supplierQuoteLine" ("supplierQuoteId", "itemId", description, "companyId", "createdBy")
           VALUES ($1, $2, 'Control PCB Rev2', $3, $4)`,
          [supplierQuoteId, pcbItemId, companyId, userId]
        );
        console.log(`   Created supplier quote line`);
      }
    }

    // ─── Step 50: salesRfq + lines ───────────────────────────────────────────
    console.log("50. Seeding sales RFQs...");
    const existingSRFQ = await client.query(
      `SELECT 1 FROM "salesRfq" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    let salesRfqId: string | null = null;
    const precisionCustomerId = customerIds["Precision Motors LLC"];
    if ((existingSRFQ.rowCount ?? 0) === 0 && precisionCustomerId) {
      const srfqReadableId = await nextSeq("salesRfq");
      const srfqRow = await client.query<{id: string}>(
        `INSERT INTO "salesRfq" ("rfqId", "customerId", "rfqDate", "locationId", "companyId", "createdBy")
         VALUES ($1, $2, CURRENT_DATE, $3, $4, $5) RETURNING id`,
        [srfqReadableId, precisionCustomerId, locationId, companyId, userId]
      );
      salesRfqId = srfqRow.rows[0]!.id;
      console.log(`   Created sales RFQ "${srfqReadableId}"`);

      const bracketItemId4 = itemIds["BRACKET-001"];
      if (bracketItemId4) {
        await client.query(
          `INSERT INTO "salesRfqLine" ("salesRfqId", "itemId", "unitOfMeasureCode", "customerPartId", "companyId", "createdBy")
           VALUES ($1, $2, 'EA', 'PM-BRACKET-A', $3, $4)`,
          [salesRfqId, bracketItemId4, companyId, userId]
        );
        console.log(`   Created sales RFQ line`);
      }
    }

    // ─── Step 51: quote + quoteLine + quoteMakeMethod + quoteOperation + quoteMaterial
    console.log("51. Seeding quotes...");
    const existingQuote = await client.query(
      `SELECT 1 FROM quote WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    let quoteId: string | null = null;
    let quoteLineId: string | null = null;
    let quoteMakeMethodId: string | null = null;
    if ((existingQuote.rowCount ?? 0) === 0 && precisionCustomerId) {
      const qReadableId = await nextSeq("quote");
      const qRow = await client.query<{id: string}>(
        `INSERT INTO quote ("quoteId", "customerId", status, "locationId", "companyId", "createdBy")
         VALUES ($1, $2, 'Draft'::"quoteStatus", $3, $4, $5) RETURNING id`,
        [qReadableId, precisionCustomerId, locationId, companyId, userId]
      );
      quoteId = qRow.rows[0]!.id;
      console.log(`   Created quote "${qReadableId}"`);

      const bracketItemId5 = itemIds["BRACKET-001"];
      if (bracketItemId5 && quoteId) {
        const qlRow = await client.query<{id: string}>(
          `INSERT INTO "quoteLine" ("quoteId", "itemId", "itemType", description, "companyId", "createdBy")
           VALUES ($1, $2, 'Part', 'Mounting Bracket A', $3, $4) RETURNING id`,
          [quoteId, bracketItemId5, companyId, userId]
        );
        quoteLineId = qlRow.rows[0]!.id;
        console.log(`   Created quote line`);

        // quoteMakeMethod
        const qmmRow = await client.query<{id: string}>(
          `INSERT INTO "quoteMakeMethod" ("quoteId", "quoteLineId", "itemId", "companyId", "createdBy")
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [quoteId, quoteLineId, bracketItemId5, companyId, userId]
        );
        quoteMakeMethodId = qmmRow.rows[0]!.id;
        console.log(`   Created quote make method`);

        // quoteOperation
        if (cncProcId) {
          const qoRow = await client.query<{id: string}>(
            `INSERT INTO "quoteOperation" ("quoteId", "quoteLineId", "quoteMakeMethodId", "processId", "laborTime", "laborUnit", "companyId", "createdBy")
             VALUES ($1, $2, $3, $4, 30, 'Minutes/Piece'::factor, $5, $6) RETURNING id`,
            [quoteId, quoteLineId, quoteMakeMethodId, cncProcId, companyId, userId]
          );
          console.log(`   Created quote operation`);

          // quoteMaterial - use methodType='Buy' to avoid 'Make to Order' trigger
          const steelItemId5 = itemIds["STEEL-ROD-01"];
          if (steelItemId5) {
            await client.query(
              `INSERT INTO "quoteMaterial" ("quoteId", "quoteLineId", "quoteMakeMethodId", "itemId", "itemReadableId", "methodType", description, quantity, "unitOfMeasureCode", "companyId", "createdBy")
               VALUES ($1, $2, $3, $4, 'STEEL-ROD-01', 'Buy'::"methodType", '1020 Steel Rod', 1.2, 'EA', $5, $6)`,
              [quoteId, quoteLineId, quoteMakeMethodId, steelItemId5, companyId, userId]
            );
            console.log(`   Created quote material`);
          }
        }

        // quotePayment (1:1 with quote)
        await client.query(
          `INSERT INTO "quotePayment" (id, "companyId") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [quoteId, companyId]
        );

        // quoteShipment (1:1 with quote)
        await client.query(
          `INSERT INTO "quoteShipment" (id, "companyId") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [quoteId, companyId]
        );
      }
    }

    // ─── Step 52: receipt + receiptLine ──────────────────────────────────────
    console.log("52. Seeding receipts...");
    const existingReceipt = await client.query(
      `SELECT 1 FROM receipt WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    let receiptId: string | null = null;
    if ((existingReceipt.rowCount ?? 0) === 0 && acmeSupplierId) {
      const recReadableId = await nextSeq("receipt");
      const recRow = await client.query<{id: string}>(
        `INSERT INTO receipt ("receiptId", "supplierId", status, "locationId", "companyId", "createdBy")
         VALUES ($1, $2, 'Draft'::"receiptStatus", $3, $4, $5) RETURNING id`,
        [recReadableId, acmeSupplierId, locationId, companyId, userId]
      );
      receiptId = recRow.rows[0]!.id;
      console.log(`   Created receipt "${recReadableId}"`);

      const steelItemId6 = itemIds["STEEL-ROD-01"];
      if (steelItemId6) {
        await client.query(
          `INSERT INTO "receiptLine" ("receiptId", "itemId", "orderQuantity", "receivedQuantity", "unitOfMeasure", "unitPrice", "companyId", "createdBy")
           VALUES ($1, $2, 100, 100, 'EA', 5.50, $3, $4)`,
          [receiptId, steelItemId6, companyId, userId]
        );
        console.log(`   Created receipt line`);
      }
    }

    // ─── Step 53: shipment + shipmentLine ────────────────────────────────────
    console.log("53. Seeding shipments...");
    const existingShipment = await client.query(
      `SELECT 1 FROM shipment WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    let shipmentId: string | null = null;
    if ((existingShipment.rowCount ?? 0) === 0 && precisionCustomerId) {
      const shipReadableId = await nextSeq("shipment");
      const shipRow = await client.query<{id: string}>(
        `INSERT INTO shipment ("shipmentId", "customerId", status, "locationId", "companyId", "createdBy")
         VALUES ($1, $2, 'Draft'::"shipmentStatus", $3, $4, $5) RETURNING id`,
        [shipReadableId, precisionCustomerId, locationId, companyId, userId]
      );
      shipmentId = shipRow.rows[0]!.id;
      console.log(`   Created shipment "${shipReadableId}"`);

      const bracketItemId6 = itemIds["BRACKET-001"];
      if (bracketItemId6) {
        await client.query(
          `INSERT INTO "shipmentLine" ("shipmentId", "itemId", "orderQuantity", "shippedQuantity", "unitOfMeasure", "unitPrice", "companyId", "createdBy")
           VALUES ($1, $2, 25, 0, 'EA', 125.00, $3, $4)`,
          [shipmentId, bracketItemId6, companyId, userId]
        );
        console.log(`   Created shipment line`);
      }
    }

    // ─── Step 54: salesInvoice + salesInvoiceLine ─────────────────────────────
    console.log("54. Seeding sales invoices...");
    const existingSI = await client.query(
      `SELECT 1 FROM "salesInvoice" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    let salesInvoiceId: string | null = null;
    if ((existingSI.rowCount ?? 0) === 0 && precisionCustomerId) {
      const siReadableId = await nextSeq("salesInvoice");
      const siRow = await client.query<{id: string}>(
        `INSERT INTO "salesInvoice" ("invoiceId", "customerId", "currencyCode", status, "locationId", "companyId", "createdBy")
         VALUES ($1, $2, 'USD', 'Draft'::"salesInvoiceStatus", $3, $4, $5) RETURNING id`,
        [siReadableId, precisionCustomerId, locationId, companyId, userId]
      );
      salesInvoiceId = siRow.rows[0]!.id;
      console.log(`   Created sales invoice "${siReadableId}"`);

      const bracketItemId7 = itemIds["BRACKET-001"];
      if (bracketItemId7) {
        await client.query(
          `INSERT INTO "salesInvoiceLine" ("invoiceId", "invoiceLineType", "itemId", description, quantity, "unitOfMeasureCode", "unitPrice", "companyId", "createdBy")
           VALUES ($1, 'Part'::"salesInvoiceLineType", $2, 'Mounting Bracket A', 25, 'EA', 125.00, $3, $4)`,
          [salesInvoiceId, bracketItemId7, companyId, userId]
        );
        console.log(`   Created sales invoice line`);
      }

      // salesInvoiceShipment (1:1 with salesInvoice)
      if (salesInvoiceId) {
        await client.query(
          `INSERT INTO "salesInvoiceShipment" (id, "companyId", "createdBy") VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
          [salesInvoiceId, companyId, userId]
        );
      }
    }

    // ─── Step 55: purchaseInvoice + purchaseInvoiceLine ───────────────────────
    console.log("55. Seeding purchase invoices...");
    const existingPI = await client.query(
      `SELECT 1 FROM "purchaseInvoice" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    let purchaseInvoiceId: string | null = null;
    if ((existingPI.rowCount ?? 0) === 0 && acmeSupplierId) {
      const piReadableId = await nextSeq("purchaseInvoice");
      const piInteractionId = await getOrCreateSupplierInteraction(acmeSupplierId);
      const piRow = await client.query<{id: string}>(
        `INSERT INTO "purchaseInvoice" ("invoiceId", "supplierId", "supplierInteractionId", "currencyCode", status, "locationId", "companyId", "createdBy")
         VALUES ($1, $2, $3, 'USD', 'Draft'::"purchaseInvoiceStatus", $4, $5, $6) RETURNING id`,
        [piReadableId, acmeSupplierId, piInteractionId, locationId, companyId, userId]
      );
      purchaseInvoiceId = piRow.rows[0]!.id;
      console.log(`   Created purchase invoice "${piReadableId}"`);

      const steelItemId7 = itemIds["STEEL-ROD-01"];
      if (steelItemId7) {
        await client.query(
          `INSERT INTO "purchaseInvoiceLine" ("invoiceId", "invoiceLineType", "itemId", description, quantity, "supplierUnitPrice", "inventoryUnitOfMeasureCode", "purchaseUnitOfMeasureCode", "companyId", "createdBy")
           VALUES ($1, 'Part'::"payableLineType", $2, '1020 Steel Rod', 100, 5.50, 'EA', 'EA', $3, $4)`,
          [purchaseInvoiceId, steelItemId7, companyId, userId]
        );
        console.log(`   Created purchase invoice line`);
      }
    }

    // ─── Step 56: stockTransfer + stockTransferLine ───────────────────────────
    console.log("56. Seeding stock transfers...");
    const existingST = await client.query(
      `SELECT 1 FROM "stockTransfer" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    let stockTransferId: string | null = null;
    if ((existingST.rowCount ?? 0) === 0) {
      const stReadableId = await nextSeq("stockTransfer");
      const stRow = await client.query<{id: string}>(
        `INSERT INTO "stockTransfer" ("stockTransferId", "locationId", status, "companyId", "createdBy")
         VALUES ($1, $2, 'Draft'::"stockTransferStatus", $3, $4) RETURNING id`,
        [stReadableId, locationId, companyId, userId]
      );
      stockTransferId = stRow.rows[0]!.id;
      console.log(`   Created stock transfer "${stReadableId}"`);

      const steelItemId8 = itemIds["STEEL-ROD-01"];
      if (steelItemId8) {
        await client.query(
          `INSERT INTO "stockTransferLine" ("stockTransferId", "itemId", quantity, "companyId", "createdBy")
           VALUES ($1, $2, 20, $3, $4)`,
          [stockTransferId, steelItemId8, companyId, userId]
        );
        console.log(`   Created stock transfer line`);
      }
    }

    // ─── Step 57: warehouseTransfer + warehouseTransferLine ──────────────────
    console.log("57. Seeding warehouse transfers...");
    const existingWT = await client.query(
      `SELECT 1 FROM "warehouseTransfer" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    if ((existingWT.rowCount ?? 0) === 0) {
      const wtReadableId = await nextSeq("warehouseTransfer");
      const wtRow = await client.query<{id: string}>(
        `INSERT INTO "warehouseTransfer" ("transferId", "fromLocationId", "toLocationId", status, "companyId", "createdBy")
         VALUES ($1, $2, $3, 'Draft'::"warehouseTransferStatus", $4, $5) RETURNING id`,
        [wtReadableId, locationId, location2Id, companyId, userId]
      );
      const warehouseTransferId = wtRow.rows[0]!.id;
      console.log(`   Created warehouse transfer "${wtReadableId}"`);

      const steelItemId9 = itemIds["STEEL-ROD-01"];
      if (steelItemId9) {
        await client.query(
          `INSERT INTO "warehouseTransferLine" ("transferId", "itemId", quantity, "fromLocationId", "toLocationId", "companyId", "createdBy")
           VALUES ($1, $2, 50, $3, $4, $5, $6)`,
          [warehouseTransferId, steelItemId9, locationId, location2Id, companyId, userId]
        );
        console.log(`   Created warehouse transfer line`);
      }
    }

    // ─── Step 58: fulfillment + timeCardEntry ─────────────────────────────────
    console.log("58. Seeding fulfillment and time cards...");
    // Get a salesOrderLine ID
    const soLineRow = await client.query<{id: string}>(
      `SELECT id FROM "salesOrderLine" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    const soLineId = soLineRow.rows[0]?.id;
    if (soLineId) {
      const existingFul = await client.query(
        `SELECT 1 FROM fulfillment WHERE "salesOrderLineId" = $1 LIMIT 1`, [soLineId]
      );
      if ((existingFul.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO fulfillment ("salesOrderLineId", type, quantity, "companyId", "createdBy")
           VALUES ($1, 'Inventory'::"fulfillmentType", 10, $2, $3)`,
          [soLineId, companyId, userId]
        );
        console.log(`   Created fulfillment`);
      }
    }

    const existingTCE = await client.query(
      `SELECT 1 FROM "timeCardEntry" WHERE "employeeId" = $1 AND "companyId" = $2 LIMIT 1`,
      [employeeId, companyId]
    );
    if ((existingTCE.rowCount ?? 0) === 0) {
      await client.query(
        `INSERT INTO "timeCardEntry" ("employeeId", "clockIn", "clockOut", note, "companyId", "createdBy")
         VALUES ($1, NOW() - INTERVAL '8 hours', NOW(), 'Regular shift', $2, $3)`,
        [employeeId, companyId, userId]
      );
      console.log(`   Created time card entry`);
    }

    // ─── Step 59: productionEvent + productionQuantityReport + productionQuantity
    console.log("59. Seeding production events...");
    if (jobOpId) {
      const existingPE = await client.query(
        `SELECT 1 FROM "productionEvent" WHERE "jobOperationId" = $1 LIMIT 1`, [jobOpId]
      );
      let prodEventId: string | null = null;
      if ((existingPE.rowCount ?? 0) === 0) {
        const peRow = await client.query<{id: string}>(
          `INSERT INTO "productionEvent" ("jobOperationId", type, "startTime", "endTime", "employeeId", "workCenterId", "companyId", "createdBy")
           VALUES ($1, 'Labor'::"productionEventType", NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour', $2, $3, $4, $5) RETURNING id`,
          [jobOpId, employeeId, cncWCId ?? null, companyId, userId]
        );
        prodEventId = peRow.rows[0]!.id;
        console.log(`   Created production event`);
      } else {
        prodEventId = (await client.query<{id: string}>(
          `SELECT id FROM "productionEvent" WHERE "jobOperationId" = $1 LIMIT 1`, [jobOpId]
        )).rows[0]!.id;
      }

      // productionQuantityReport - get the job id for this operation
      const jobForOpRow = await client.query<{id: string; "jobId": string}>(
        `SELECT "jobId" FROM "jobOperation" WHERE id = $1 LIMIT 1`, [jobOpId]
      );
      const jobIdForOp = (jobForOpRow.rows[0] as any)?.jobId;

      if (jobIdForOp) {
        const existingPQR = await client.query(
          `SELECT 1 FROM "productionQuantityReport" WHERE "jobOperationId" = $1 LIMIT 1`, [jobOpId]
        );
        let pqrId: string | null = null;
        if ((existingPQR.rowCount ?? 0) === 0) {
          const pqrRow = await client.query<{id: string}>(
            `INSERT INTO "productionQuantityReport" ("jobId", "jobOperationId", "employeeId", "originalQuantity", "companyId", "createdBy")
             VALUES ($1, $2, $3, 25, $4, $5) RETURNING id`,
            [jobIdForOp, jobOpId, employeeId, companyId, userId]
          );
          pqrId = pqrRow.rows[0]!.id;
          console.log(`   Created production quantity report`);
        } else {
          pqrId = (await client.query<{id: string}>(
            `SELECT id FROM "productionQuantityReport" WHERE "jobOperationId" = $1 LIMIT 1`, [jobOpId]
          )).rows[0]!.id;
        }

        if (pqrId) {
          const existingPQ = await client.query(
            `SELECT 1 FROM "productionQuantity" WHERE "jobOperationId" = $1 LIMIT 1`, [jobOpId]
          );
          if ((existingPQ.rowCount ?? 0) === 0) {
            await client.query(
              `INSERT INTO "productionQuantity" ("reportId", "jobOperationId", type, quantity, "laborProductionEventId", "employeeId", "companyId", "createdBy")
               VALUES ($1, $2, 'Production'::"productionQuantityType", 25, $3, $4, $5, $6)`,
              [pqrId, jobOpId, prodEventId, employeeId, companyId, userId]
            );
            console.log(`   Created production quantity`);
          }
        }
      }
    }

    // ─── Step 60: purchaseOrderPayment + salesOrderPayment + salesOrderShipment
    console.log("60. Seeding PO/SO payment and shipment settings...");
    // Get first PO and SO IDs
    const firstPORow = await client.query<{id: string}>(
      `SELECT id FROM "purchaseOrder" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    const firstPOId = firstPORow.rows[0]?.id;
    if (firstPOId) {
      const existingPOP = await client.query(
        `SELECT 1 FROM "purchaseOrderPayment" WHERE id = $1 LIMIT 1`, [firstPOId]
      );
      if ((existingPOP.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO "purchaseOrderPayment" (id, "companyId") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [firstPOId, companyId]
        );
      }
    }

    const firstSORow = await client.query<{id: string}>(
      `SELECT id FROM "salesOrder" WHERE "companyId" = $1 LIMIT 1`, [companyId]
    );
    const firstSOId = firstSORow.rows[0]?.id;
    if (firstSOId) {
      const existingSOP = await client.query(
        `SELECT 1 FROM "salesOrderPayment" WHERE id = $1 LIMIT 1`, [firstSOId]
      );
      if ((existingSOP.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO "salesOrderPayment" (id, "companyId") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [firstSOId, companyId]
        );
      }

      const existingSOShip = await client.query(
        `SELECT 1 FROM "salesOrderShipment" WHERE id = $1 LIMIT 1`, [firstSOId]
      );
      if ((existingSOShip.rowCount ?? 0) === 0) {
        await client.query(
          `INSERT INTO "salesOrderShipment" (id, "companyId") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [firstSOId, companyId]
        );
      }
    }
    console.log(`   Created PO/SO payment and shipment settings`);

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
  - 1 warehouse + 2 locations + storage types & units
  - 3 shipping methods + 3 shipping terms
  - 4 processes + 3 work centers (with process links)
  - 6 items + item subtypes (part, material, consumable, tool, fixture, service)
  - 4 item posting groups + 6 abilities
  - 2 purchase orders, 3 sales orders, 1 manufacturing job
  - Material reference data (substances, forms, grades, finishes)
  - Supplier extensions (parts, processes, accounts)
  - Make methods + method operations/materials/steps
  - Templates + template make methods/operations/materials
  - Procedures + steps
  - Quality documents
  - Training + questions + assignments + completions
  - Non-conformance workflow + non-conformances
  - Maintenance schedules + dispatches
  - Gauges + calibration records
  - Risk register
  - Documents + notes
  - Tags, opportunities, suggestions
  - No-quote reasons, pricing rules, webhooks
  - Attribute data types, custom fields, user attribute categories
  - Accounting periods, journals, journal lines
  - Holidays
  - Item sampling plans, shelf life, rules, batch properties
  - Pick methods, kanban
  - Partners, contractors, contractor abilities
  - Employee abilities, salary records, salary payments
  - Job assignment rules, group assignments, operation steps/parameters/tools
  - Purchasing RFQs, supplier quotes, sales RFQs
  - Quotes + lines + make methods + operations + materials
  - Receipts + lines
  - Shipments + lines
  - Sales invoices + lines
  - Purchase invoices + lines
  - Stock transfers + lines
  - Warehouse transfers + lines
  - Fulfillments, time card entries
  - Production events, quantity reports, quantities
  - PO/SO payment and shipment settings
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
