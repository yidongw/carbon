import { CarbonEdition, getPermissionCacheKey } from "@carbon/auth";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { redis } from "@carbon/kv";
import { updateSubscriptionQuantityForCompany } from "@carbon/stripe/stripe.server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@carbon/database";
import { nanoid } from "nanoid";
import { Edition } from "@carbon/utils";
import {
  getPendingApplicationForUser,
  isInviteLinkExpired
} from "./invite-links.service";
import { grantEmployeeAccess } from "./users.server";

export type PublicInviteLinkDetails = {
  code: string;
  companyId: string;
  companyName: string;
  inviterName: string;
  roleName: string;
  label: string | null;
  expired: boolean;
  alreadyApplied: boolean;
  alreadyMember: boolean;
};

export async function getPublicInviteLinkByCode(
  serviceRole: SupabaseClient<Database>,
  code: string,
  userId?: string
): Promise<
  | { success: false; message: string }
  | { success: true; data: PublicInviteLinkDetails }
> {
  const inviteLink = await serviceRole
    .from("inviteLink")
    .select(
      `
        code,
        companyId,
        label,
        expiresAt,
        revokedAt,
        company:companyId(name),
        employeeType:employeeTypeId(name),
        inviter:createdBy(fullName)
      `
    )
    .eq("code", code)
    .maybeSingle();

  if (inviteLink.error) {
    console.error(
      "[getPublicInviteLinkByCode] Database error:",
      inviteLink.error
    );
    return {
      success: false,
      message: `Database error: ${inviteLink.error.message}`
    };
  }

  if (!inviteLink.data) {
    return { success: false, message: "Invite link not found" };
  }

  const expired = isInviteLinkExpired(inviteLink.data);

  let alreadyApplied = false;
  let alreadyMember = false;

  if (userId) {
    const [pendingApplication, employee] = await Promise.all([
      getPendingApplicationForUser(
        serviceRole,
        userId,
        inviteLink.data.companyId
      ),
      serviceRole
        .from("employee")
        .select("active")
        .eq("id", userId)
        .eq("companyId", inviteLink.data.companyId)
        .maybeSingle()
    ]);

    alreadyApplied = !!pendingApplication.data;
    alreadyMember = employee.data?.active === true;
  }

  const company = inviteLink.data.company as { name: string } | null;
  const employeeType = inviteLink.data.employeeType as { name: string } | null;
  const inviter = inviteLink.data.inviter as { fullName: string | null } | null;

  return {
    success: true,
    data: {
      code: inviteLink.data.code,
      companyId: inviteLink.data.companyId,
      companyName: company?.name ?? "Company",
      inviterName: inviter?.fullName ?? "A team member",
      roleName: employeeType?.name ?? "Employee",
      label: inviteLink.data.label,
      expired,
      alreadyApplied,
      alreadyMember
    }
  };
}

export async function createInviteLink(
  client: SupabaseClient<Database>,
  {
    companyId,
    createdBy,
    employeeTypeId,
    locationId,
    label,
    expiresAt
  }: {
    companyId: string;
    createdBy: string;
    employeeTypeId: string;
    locationId: string;
    label?: string | null;
    expiresAt?: string | null;
  }
) {
  return client
    .from("inviteLink")
    .insert({
      code: nanoid(12),
      companyId,
      createdBy,
      employeeTypeId,
      locationId,
      label: label || null,
      expiresAt: expiresAt || null
    })
    .select("*")
    .single();
}

export async function revokeInviteLink(
  client: SupabaseClient<Database>,
  {
    id,
    companyId
  }: {
    id: string;
    companyId: string;
  }
) {
  return client
    .from("inviteLink")
    .update({ revokedAt: new Date().toISOString() })
    .eq("id", id)
    .eq("companyId", companyId)
    .select("*")
    .single();
}

export async function updateInviteLinkExpiry(
  client: SupabaseClient<Database>,
  {
    id,
    companyId,
    expiresAt
  }: {
    id: string;
    companyId: string;
    expiresAt: string | null;
  }
) {
  return client
    .from("inviteLink")
    .update({ expiresAt })
    .eq("id", id)
    .eq("companyId", companyId)
    .select("*")
    .single();
}

export async function submitMembershipApplication(
  serviceRole: SupabaseClient<Database>,
  code: string,
  userId: string
): Promise<{ success: false; message: string } | { success: true }> {
  const inviteLink = await serviceRole
    .from("inviteLink")
    .select("*")
    .eq("code", code)
    .maybeSingle();

  if (inviteLink.error || !inviteLink.data) {
    return { success: false, message: "Invite link not found" };
  }

  if (isInviteLinkExpired(inviteLink.data)) {
    return { success: false, message: "This invite link is no longer valid" };
  }

  const existingEmployee = await serviceRole
    .from("employee")
    .select("active")
    .eq("id", userId)
    .eq("companyId", inviteLink.data.companyId)
    .maybeSingle();

  if (existingEmployee.data?.active) {
    return {
      success: false,
      message: "You are already a member of this company"
    };
  }

  const pendingApplication = await getPendingApplicationForUser(
    serviceRole,
    userId,
    inviteLink.data.companyId
  );

  if (pendingApplication.data) {
    return {
      success: false,
      message: "You already have a pending application for this company"
    };
  }

  const application = await serviceRole.from("membershipApplication").insert({
    companyId: inviteLink.data.companyId,
    inviteLinkId: inviteLink.data.id,
    userId,
    employeeTypeId: inviteLink.data.employeeTypeId,
    locationId: inviteLink.data.locationId,
    status: "pending"
  });

  if (application.error) {
    return { success: false, message: application.error.message };
  }

  return { success: true };
}

export async function approveMembershipApplication(
  client: SupabaseClient<Database>,
  {
    id,
    companyId,
    reviewerId,
    locationId
  }: {
    id: string;
    companyId: string;
    reviewerId: string;
    locationId?: string;
  }
): Promise<{ success: false; message: string } | { success: true }> {
  const application = await client
    .from("membershipApplication")
    .select("*")
    .eq("id", id)
    .eq("companyId", companyId)
    .maybeSingle();

  if (application.error || !application.data) {
    return { success: false, message: "Application not found" };
  }

  if (application.data.status !== "pending") {
    return { success: false, message: "Application has already been reviewed" };
  }

  const serviceRole = getCarbonServiceRole();
  const grant = await grantEmployeeAccess(serviceRole, {
    userId: application.data.userId,
    companyId,
    employeeTypeId: application.data.employeeTypeId,
    locationId: locationId ?? application.data.locationId
  });

  if (!grant.success) {
    return grant;
  }

  const update = await client
    .from("membershipApplication")
    .update({
      status: "approved",
      reviewedBy: reviewerId,
      reviewedAt: new Date().toISOString(),
      ...(locationId ? { locationId } : {})
    })
    .eq("id", id)
    .eq("companyId", companyId);

  if (update.error) {
    return { success: false, message: update.error.message };
  }

  await redis.del(getPermissionCacheKey(application.data.userId));

  if (CarbonEdition === Edition.Cloud) {
    await updateSubscriptionQuantityForCompany(companyId);
  }

  return { success: true };
}

export async function rejectMembershipApplication(
  client: SupabaseClient<Database>,
  {
    id,
    companyId,
    reviewerId
  }: {
    id: string;
    companyId: string;
    reviewerId: string;
  }
): Promise<{ success: false; message: string } | { success: true }> {
  const update = await client
    .from("membershipApplication")
    .update({
      status: "rejected",
      reviewedBy: reviewerId,
      reviewedAt: new Date().toISOString()
    })
    .eq("id", id)
    .eq("companyId", companyId)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();

  if (update.error) {
    return { success: false, message: update.error.message };
  }

  if (!update.data) {
    return { success: false, message: "Application not found or already reviewed" };
  }

  return { success: true };
}
