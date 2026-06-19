import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@carbon/database";
import type { GenericQueryFilters } from "~/utils/query";

export function isInviteLinkExpired(link: {
  expiresAt: string | null;
  revokedAt: string | null;
}) {
  if (link.revokedAt) return true;
  if (link.expiresAt && new Date(link.expiresAt) <= new Date()) return true;
  return false;
}

export async function getInviteLinks(
  client: SupabaseClient<Database>,
  companyId: string,
  args: GenericQueryFilters & { search: string | null }
) {
  let query = client
    .from("inviteLink")
    .select(
      `
        *,
        employeeType:employeeTypeId(name),
        inviter:createdBy(fullName),
        location:locationId(name),
        membershipApplication(count)
      `,
      { count: "exact" }
    )
    .eq("companyId", companyId);

  if (args.search) {
    query = query.or(
      `label.ilike.%${args.search}%,code.ilike.%${args.search}%`
    );
  }

  if (args.filters) {
    query = query.match(args.filters);
  }

  if (args.sorts && args.sorts.length > 0) {
    args.sorts.forEach((sort) => {
      query = query.order(sort.id, { ascending: !sort.desc });
    });
  } else {
    query = query.order("createdAt", { ascending: false });
  }

  if (args.limit) {
    query = query.range(args.offset ?? 0, (args.offset ?? 0) + args.limit - 1);
  }

  return query;
}

export async function getMembershipApplications(
  client: SupabaseClient<Database>,
  companyId: string,
  args: GenericQueryFilters & { search: string | null; status?: string | null }
) {
  let query = client
    .from("membershipApplication")
    .select(
      `
        *,
        applicant:userId(id, email, fullName, firstName, lastName),
        employeeType:employeeTypeId(name),
        location:locationId(name),
        inviteLink:inviteLinkId(label, createdBy, inviter:createdBy(fullName))
      `,
      { count: "exact" }
    )
    .eq("companyId", companyId);

  if (args.status) {
    query = query.eq("status", args.status);
  }

  if (args.filters) {
    query = query.match(args.filters);
  }

  if (args.sorts && args.sorts.length > 0) {
    args.sorts.forEach((sort) => {
      query = query.order(sort.id, { ascending: !sort.desc });
    });
  } else {
    query = query.order("createdAt", { ascending: false });
  }

  if (args.limit) {
    query = query.range(args.offset ?? 0, (args.offset ?? 0) + args.limit - 1);
  }

  return query;
}

export async function getPendingApplicationForUser(
  client: SupabaseClient<Database>,
  userId: string,
  companyId: string
) {
  return client
    .from("membershipApplication")
    .select("id, status")
    .eq("userId", userId)
    .eq("companyId", companyId)
    .eq("status", "pending")
    .maybeSingle();
}
