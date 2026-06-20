/**
 * Seeds pending-only demo membership applications for local/preview testing.
 *
 * Usage:
 *   source /Users/xinjuan/preview/preview.env && npx tsx scripts/seed-membership-applications.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import type { Database } from "../packages/database/src/types.ts";

dotenv.config({ path: ".env.development" });
dotenv.config({ path: ".env.local" });
dotenv.config();

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const demoApplicants = [
  { email: "applications-demo-1@carbon.test", firstName: "Alex", lastName: "Rivera" },
  { email: "applications-demo-2@carbon.test", firstName: "Jordan", lastName: "Chen" },
  { email: "applications-demo-3@carbon.test", firstName: "Sam", lastName: "Patel" },
  { email: "applications-demo-4@carbon.test", firstName: "Taylor", lastName: "Nguyen" },
  { email: "applications-demo-5@carbon.test", firstName: "Morgan", lastName: "Brooks" },
  { email: "applications-demo-6@carbon.test", firstName: "Casey", lastName: "Wright" }
];

async function ensureUser(applicant: (typeof demoApplicants)[number]) {
  const existing = await supabase
    .from("user")
    .select("id")
    .eq("email", applicant.email)
    .maybeSingle();

  if (existing.data?.id) {
    return existing.data.id;
  }

  const authUser = await supabase.auth.admin.createUser({
    email: applicant.email,
    email_confirm: true,
    user_metadata: {
      firstName: applicant.firstName,
      lastName: applicant.lastName
    }
  });

  if (authUser.error || !authUser.data.user) {
    throw authUser.error ?? new Error(`Failed to create auth user for ${applicant.email}`);
  }

  const userId = authUser.data.user.id;
  const upsertUser = await supabase.from("user").upsert({
    id: userId,
    email: applicant.email,
    firstName: applicant.firstName,
    lastName: applicant.lastName,
    active: true
  });

  if (upsertUser.error) {
    throw upsertUser.error;
  }

  return userId;
}

async function seed() {
  const inviteLink = await supabase
    .from("inviteLink")
    .select("id, companyId, employeeTypeId, locationId, createdBy")
    .is("revokedAt", null)
    .order("createdAt", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (inviteLink.error || !inviteLink.data) {
    throw inviteLink.error ?? new Error("No invite link found to attach demo applications to");
  }

  const demoEmails = demoApplicants.map((applicant) => applicant.email);
  const demoUsers = await supabase.from("user").select("id").in("email", demoEmails);

  if (demoUsers.error) {
    throw demoUsers.error;
  }

  const demoUserIds = demoUsers.data?.map((user) => user.id) ?? [];
  if (demoUserIds.length > 0) {
    const resetQueries = [
      supabase
        .from("membershipApplication")
        .delete()
        .eq("companyId", inviteLink.data.companyId)
        .in("userId", demoUserIds),
      supabase
        .from("employeeJob")
        .delete()
        .eq("companyId", inviteLink.data.companyId)
        .in("id", demoUserIds),
      supabase
        .from("employee")
        .delete()
        .eq("companyId", inviteLink.data.companyId)
        .in("id", demoUserIds),
      supabase
        .from("userToCompany")
        .delete()
        .eq("companyId", inviteLink.data.companyId)
        .in("userId", demoUserIds)
    ];

    for (const query of resetQueries) {
      const result = await query;
      if (result.error) {
        throw result.error;
      }
    }
  }

  let created = 0;

  for (const applicant of demoApplicants) {
    const userId = await ensureUser(applicant);

    const insert = await supabase.from("membershipApplication").insert({
      companyId: inviteLink.data.companyId,
      inviteLinkId: inviteLink.data.id,
      userId,
      employeeTypeId: inviteLink.data.employeeTypeId,
      locationId: inviteLink.data.locationId,
      status: "pending"
    });

    if (insert.error) {
      throw insert.error;
    }

    created += 1;
  }

  console.log(`Seeded ${created} pending demo membership applications.`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
