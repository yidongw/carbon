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
import { seedDemoData } from "./seedDemoData.ts";

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


    await seedDemoData(client, {
      companyId,
      userId,
      locationId,
      email,
      firstName,
    });

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
