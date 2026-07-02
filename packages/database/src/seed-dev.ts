/**
 * Development seed script for Carbon
 *
 * This script creates a development user and company with all default seed data.
 * Run after `pnpm run db:build` to set up a fully functional local environment.
 *
 * Usage:
 *   pnpm run db:seed:dev -- --email your@email.com
 */

import process from "node:process";
import { parseArgs } from "node:util";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import {
  companySeedData,
  defaultLocation
} from "../supabase/functions/lib/seed.data.ts";
import { getPostgresConnectionPool } from "./client.ts";
import type { Database } from "./types.ts";

// Load environment variables
dotenv.config();

const DEV_PASSWORD = "password";
const DEV_COMPANY_NAME = "Carbon Development";

/**
 * Infers a first name from an email address.
 * Takes the local part (before @), splits on common delimiters (., +, _),
 * takes the first segment, and capitalizes it.
 */
function inferFirstNameFromEmail(email: string): string {
  const localPart = email.split("@")[0]!;
  // Split on common delimiters and take the first part
  const firstName = localPart.split(/[.+_-]/)[0]!;
  // Capitalize first letter, lowercase the rest
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
}

// Parse CLI arguments
const { values } = parseArgs({
  args: process.argv.slice(2).filter((a) => a !== "--"),
  options: {
    email: {
      type: "string",
      short: "e"
    }
  },
  strict: true
});

function printUsage() {
  console.log(`
Usage: pnpm run db:seed:dev -- --email <email>

Arguments:
  --email, -e    Required. The email address for the dev user.

Example:
  pnpm run db:seed:dev -- --email developer@example.com
  `);
}

async function seedDev() {
  const email = values.email;

  if (!email) {
    console.error("Error: --email is required\n");
    printUsage();
    process.exit(1);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error("Error: Invalid email format\n");
    process.exit(1);
  }

  console.log(`\nSeeding development environment for: ${email}\n`);

  // Initialize Supabase admin client
  const supabaseAdmin = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  // Initialize PostgreSQL connection pool
  const pgPool = getPostgresConnectionPool(1);
  const client = await pgPool.connect();

  try {
    // Step 1: Check if user already exists (via Supabase Auth API - cannot be in transaction)
    console.log("1. Checking for existing user...");
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u: any) => u.email === (email ?? "")
    );

    let userId: string;

    if (existingUser) {
      console.log(`   User ${email} already exists, using existing user.`);
      userId = existingUser.id;

      // Update password to known value
      const { error: updateError } =
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: DEV_PASSWORD
        });
      if (updateError) {
        console.warn(
          `   Warning: Could not update password: ${updateError.message}`
        );
      } else {
        console.log(`   Password updated to: ${DEV_PASSWORD}`);
      }
    } else {
      // Create new user
      console.log("   Creating new user...");
      const { data: newUser, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password: DEV_PASSWORD,
          email_confirm: true,
          app_metadata: {
            role: "employee",
            provider: "email",
            providers: ["email"]
          }
        });

      if (createError) {
        throw new Error(`Failed to create user: ${createError.message}`);
      }

      if (!newUser.user) {
        throw new Error("Failed to create user: No user returned");
      }

      userId = newUser.user.id;
      console.log(`   User created with ID: ${userId}`);
    }

    // Step 2: Update user's first name (inferred from email)
    const firstName = inferFirstNameFromEmail(email ?? "");
    console.log(`2. Updating user first name to "${firstName}"...`);
    await client.query(`UPDATE "user" SET "firstName" = $1 WHERE id = $2`, [
      firstName,
      userId
    ]);

    // Step 3: Create + seed the company in a single transaction
    console.log("3. Starting database transaction...");
    await client.query("BEGIN");

    try {
      // Create the company. No companyGroupId -> seed_company() creates the group.
      console.log("4. Creating company...");
      const companyResult = await client.query(
        `INSERT INTO company (name, "baseCurrencyCode") VALUES ($1, 'USD') RETURNING id`,
        [DEV_COMPANY_NAME]
      );
      const companyId = companyResult.rows[0].id as string;
      console.log(`   Company ID: ${companyId}`);

      // Seed all default data through the same RPC the app uses on onboarding.
      console.log("5. Seeding company via seed_company() RPC...");
      await client.query(`SELECT seed_company($1, $2, NULL, $3::jsonb)`, [
        companyId,
        userId,
        JSON.stringify(companySeedData)
      ]);

      // Default location (dev convenience; not part of seed_company). Must come
      // after seeding so the location trigger can copy from accountDefault.
      console.log("6. Creating default location...");
      const locationResult = await client.query(
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
          companyId
        ]
      );
      const locationId = locationResult.rows[0].id;

      // Link the employee to the location (employeeJob)
      await client.query(
        `INSERT INTO "employeeJob" (id, "companyId", "locationId") VALUES ($1, $2, $3)`,
        [userId, companyId, locationId]
      );

      // Commit the transaction
      await client.query("COMMIT");
      console.log("   Transaction committed successfully.");

      // Success!
      console.log(`
========================================
Dev environment seeded successfully!
========================================

Login credentials:
  Email:    ${email}
  Password: ${DEV_PASSWORD}

Company: ${DEV_COMPANY_NAME}
Company ID: ${companyId}

You can now start the app and log in!
`);
    } catch (err) {
      // Rollback on any error
      await client.query("ROLLBACK");
      console.error("   Transaction rolled back due to error.");
      throw err;
    }
  } catch (error) {
    console.error("\nError seeding development environment:");
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
    await pgPool.end();
  }
}

seedDev();
