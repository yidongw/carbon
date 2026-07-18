import type { Database, Json } from "@carbon/database";
import { redis } from "@carbon/kv";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getCarbonServiceRole } from "../lib/supabase/client.server";
import type { Permission, Result } from "../types";
import { error, success } from "../utils/result";
import {
  getClaims,
  getPermissionCacheKey,
  isValidCachedClaims,
  makePermissionsFromClaims
} from "./users";

export async function getUserByEmail(email: string) {
  return getCarbonServiceRole()
    .from("user")
    .select("*")
    .eq("email", email.toLowerCase())
    .single();
}

export async function getUserById(id: string) {
  return getCarbonServiceRole().from("user").select("*").eq("id", id).single();
}

export async function getUserClaims(userId: string, companyId: string) {
  let claims: {
    permissions: Record<string, Permission>;
    role: string | null;
  } | null = null;

  try {
    const cachedClaims = await redis.get(getPermissionCacheKey(userId));
    if (cachedClaims) {
      const parsed = JSON.parse(cachedClaims) as {
        permissions: Record<string, Permission>;
        role: string | null;
      };
      if (isValidCachedClaims(parsed)) {
        claims = parsed;
      }
    }
  } catch (e) {
    console.error("Failed to get claims from redis", e);
  } finally {
    // if we don't have permissions from redis, get them from the database
    if (!claims) {
      // TODO: remove service role from here, and move it up a level
      const rawClaims = await getClaims(
        getCarbonServiceRole(),
        userId,
        companyId
      );
      if (rawClaims.error) {
        console.error(rawClaims);
        throw new Error("Failed to get claims");
      }

      // convert rawClaims to permissions
      claims =
        rawClaims.data === null
          ? { permissions: {}, role: null }
          : makePermissionsFromClaims(rawClaims.data as Json[]);

      if (!claims) {
        claims = { permissions: {}, role: null };
      }

      // store claims in redis
      await redis.set(getPermissionCacheKey(userId), JSON.stringify(claims));
    }

    return claims;
  }
}

export async function deactivateCustomer(
  serviceRole: SupabaseClient<Database>,
  userId: string,
  companyId: string
): Promise<Result> {
  const currentPermissions = await serviceRole
    .from("userPermission")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (currentPermissions.error) {
    return error(currentPermissions.error, "Failed to get user permissions");
  }

  const permissions = Object.entries(
    (currentPermissions.data?.permissions ?? {}) as Record<string, string[]>
  ).reduce<Record<string, string[]>>((acc, [key, value]) => {
    acc[key] = value.filter((id) => id !== companyId);
    return acc;
  }, {});

  const companyGroups = await serviceRole
    .from("group")
    .select("id")
    .eq("companyId", companyId);

  const groupIds = companyGroups.data?.map((g) => g.id) ?? [];

  const [updatePermissions, userToCompanyDelete, customerAccountDelete] =
    await Promise.all([
      serviceRole
        .from("userPermission")
        .update({ permissions })
        .eq("id", userId),
      serviceRole
        .from("userToCompany")
        .delete()
        .eq("userId", userId)
        .eq("companyId", companyId),
      serviceRole
        .from("customerAccount")
        .delete()
        .eq("id", userId)
        .eq("companyId", companyId),
      ...(groupIds.length > 0
        ? [
            serviceRole
              .from("membership")
              .delete()
              .eq("memberUserId", userId)
              .in("groupId", groupIds)
          ]
        : [])
    ]);

  if (updatePermissions.error) {
    return error(updatePermissions.error, "Failed to update user permissions");
  }

  if (userToCompanyDelete.error) {
    return error(
      userToCompanyDelete.error,
      "Failed to remove user from company"
    );
  }

  if (customerAccountDelete.error) {
    return error(
      customerAccountDelete.error,
      "Failed to remove customer account"
    );
  }

  return success("Sucessfully deactivated customer");
}

export async function deactivateEmployee(
  serviceRole: SupabaseClient<Database>,
  userId: string,
  companyId: string
): Promise<Result> {
  const currentPermissions = await serviceRole
    .from("userPermission")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (currentPermissions.error) {
    return error(currentPermissions.error, "Failed to get user permissions");
  }

  const permissions = Object.entries(
    (currentPermissions.data?.permissions ?? {}) as Record<string, string[]>
  ).reduce<Record<string, string[]>>((acc, [key, value]) => {
    acc[key] = value.filter((id) => id !== companyId);
    return acc;
  }, {});

  const companyGroups = await serviceRole
    .from("group")
    .select("id")
    .eq("companyId", companyId);

  const groupIds = companyGroups.data?.map((g) => g.id) ?? [];

  const [updatePermissions, userToCompanyDelete, employeeDeactivate] =
    await Promise.all([
      serviceRole
        .from("userPermission")
        .update({ permissions })
        .eq("id", userId),
      serviceRole
        .from("userToCompany")
        .delete()
        .eq("userId", userId)
        .eq("companyId", companyId),
      serviceRole
        .from("employee")
        .update({ active: false })
        .eq("id", userId)
        .eq("companyId", companyId),
      serviceRole
        .from("employeeJob")
        .delete()
        .eq("id", userId)
        .eq("companyId", companyId),
      ...(groupIds.length > 0
        ? [
            serviceRole
              .from("membership")
              .delete()
              .eq("memberUserId", userId)
              .in("groupId", groupIds)
          ]
        : [])
    ]);

  if (updatePermissions.error) {
    return error(updatePermissions.error, "Failed to update user permissions");
  }

  if (userToCompanyDelete.error) {
    return error(
      userToCompanyDelete.error,
      "Failed to remove user from company"
    );
  }

  if (employeeDeactivate.error) {
    return error(employeeDeactivate.error, "Failed to deactivate employee");
  }

  return success("Sucessfully deactivated employee");
}

export async function deactivateUser(
  serviceRole: SupabaseClient<Database>,
  userId: string,
  companyId: string
) {
  const userToCompany = await serviceRole
    .from("userToCompany")
    .select("role")
    .eq("userId", userId)
    .eq("companyId", companyId)
    .single();

  let result: Result;

  if (userToCompany.error) {
    // No userToCompany row — either pending invite, or already deactivated.
    const user = await serviceRole
      .from("user")
      .select("*")
      .eq("id", userId)
      .single();
    if (user.error) {
      return error(user.error, "Failed to get user");
    }

    const userEmail = user.data?.email;
    if (!userEmail) {
      return success("User already deactivated");
    }
    const invite = await serviceRole
      .from("invite")
      .select("*")
      .eq("email", userEmail)
      .eq("companyId", companyId)
      .maybeSingle();

    if (!invite.data) {
      // No userToCompany and no invite — already fully deactivated.
      return success("User already deactivated");
    }

    if (invite.data.role === "customer") {
      result = await deactivateCustomer(serviceRole, userId, companyId);
    } else if (invite.data.role === "employee") {
      result = await deactivateEmployee(serviceRole, userId, companyId);
    } else if (invite.data.role === "supplier") {
      result = await deactivateSupplier(serviceRole, userId, companyId);
    } else {
      throw new Error("Invalid user role");
    }
  } else {
    if (userToCompany.data?.role === "customer") {
      result = await deactivateCustomer(serviceRole, userId, companyId);
    } else if (userToCompany.data?.role === "employee") {
      result = await deactivateEmployee(serviceRole, userId, companyId);
    } else if (userToCompany.data?.role === "supplier") {
      result = await deactivateSupplier(serviceRole, userId, companyId);
    } else {
      throw new Error("Invalid user role");
    }
  }

  // Clear stale permission cache
  if (result && result.success) {
    await redis.del(getPermissionCacheKey(userId));
  }

  // Mark any invite for this user/company as revoked so the link cannot be
  // redeemed and the UI no longer surfaces resend/revoke actions on it.
  if (result && result.success) {
    const userRecord = await serviceRole
      .from("user")
      .select("email")
      .eq("id", userId)
      .single();
    if (!userRecord.error && userRecord.data?.email) {
      await serviceRole
        .from("invite")
        .update({ revokedAt: new Date().toISOString() })
        .eq("email", userRecord.data.email)
        .eq("companyId", companyId)
        .is("revokedAt", null);
    }
  }

  return result;
}

export async function deactivateSupplier(
  serviceRole: SupabaseClient<Database>,
  userId: string,
  companyId: string
): Promise<Result> {
  const currentPermissions = await serviceRole
    .from("userPermission")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (currentPermissions.error) {
    return error(currentPermissions.error, "Failed to get user permissions");
  }

  const permissions = Object.entries(
    (currentPermissions.data?.permissions ?? {}) as Record<string, string[]>
  ).reduce<Record<string, string[]>>((acc, [key, value]) => {
    acc[key] = value.filter((id) => id !== companyId);
    return acc;
  }, {});

  const companyGroups = await serviceRole
    .from("group")
    .select("id")
    .eq("companyId", companyId);

  const groupIds = companyGroups.data?.map((g) => g.id) ?? [];

  const [updatePermissions, userToCompanyDelete, supplierAccountDelete] =
    await Promise.all([
      serviceRole
        .from("userPermission")
        .update({ permissions })
        .eq("id", userId),
      serviceRole
        .from("userToCompany")
        .delete()
        .eq("userId", userId)
        .eq("companyId", companyId),
      serviceRole
        .from("supplierAccount")
        .delete()
        .eq("id", userId)
        .eq("companyId", companyId),
      ...(groupIds.length > 0
        ? [
            serviceRole
              .from("membership")
              .delete()
              .eq("memberUserId", userId)
              .in("groupId", groupIds)
          ]
        : [])
    ]);

  if (updatePermissions.error) {
    return error(updatePermissions.error, "Failed to update user permissions");
  }

  if (userToCompanyDelete.error) {
    return error(
      userToCompanyDelete.error,
      "Failed to remove user from company"
    );
  }

  if (supplierAccountDelete.error) {
    return error(
      supplierAccountDelete.error,
      "Failed to remove supplier account"
    );
  }

  return success("Sucessfully deactivated supplier");
}

/**
 * List a user's pending (unaccepted, unrevoked) invites across companies, matched by
 * their email and/or phone, with the inviting company's name for display. Shared by the
 * ERP and MES select-company screens.
 */
export async function getPendingInvitesForUser(
  serviceRole: SupabaseClient<Database>,
  userId: string
) {
  const user = await serviceRole
    .from("user")
    .select("email, phone")
    .eq("id", userId)
    .single();

  if (user.error || (!user.data.email && !user.data.phone)) {
    return { data: [], error: null };
  }

  // Values are validated upstream (email / E.164 phone), but only interpolate ones
  // free of PostgREST `.or()` metacharacters so a stray value can't break or widen
  // the query.
  const safe = (value: string) => !/[,()]/.test(value);
  const orFilters: string[] = [];
  if (user.data.email && safe(user.data.email)) {
    orFilters.push(`email.eq.${user.data.email}`);
  }
  // `phone` isn't in the generated types until db:types runs.
  if (user.data.phone && safe(user.data.phone)) {
    orFilters.push(`phone.eq.${user.data.phone}`);
  }
  if (orFilters.length === 0) return { data: [], error: null };

  const [invites, memberships] = await Promise.all([
    serviceRole
      .from("invite")
      .select("id, role, companyId, company(name)")
      .is("acceptedAt", null)
      .is("revokedAt", null)
      .or(orFilters.join(",")),
    serviceRole.from("userToCompany").select("companyId").eq("userId", userId)
  ]);

  if (invites.error) return { data: [], error: invites.error };

  // Hide invites to companies the user already belongs to (stale/duplicate rows).
  const memberCompanyIds = new Set(
    (memberships.data ?? []).map((m) => m.companyId)
  );

  const data = (invites.data ?? [])
    .filter((invite) => !memberCompanyIds.has(invite.companyId))
    .map((invite) => {
      const company = invite.company as
        | { name: string | null }
        | { name: string | null }[]
        | null;
      const companyName = Array.isArray(company)
        ? (company[0]?.name ?? null)
        : (company?.name ?? null);
      return {
        id: invite.id,
        companyId: invite.companyId,
        role: invite.role,
        companyName
      };
    });

  return { data, error: null };
}

/**
 * Accept a specific pending invite for an already-signed-in user, keyed by the invite
 * id + the user's id (works for phone and email invites). Guards that the invite targets
 * this user's email or phone, activates the role-specific account, adds the company
 * membership, merges permissions, and stamps acceptedAt. Returns the companyId so the
 * caller can switch the active company. Shared by the ERP and MES select-company "Join".
 */
export async function acceptInviteForUser(
  serviceRole: SupabaseClient<Database>,
  userId: string,
  inviteId: string
): Promise<
  { success: false; message: string } | { success: true; companyId: string }
> {
  const invite = await serviceRole
    .from("invite")
    .select("*")
    .eq("id", inviteId)
    .is("acceptedAt", null)
    .is("revokedAt", null)
    .single();

  if (invite.error) {
    return { success: false, message: "Invitation not found or already used" };
  }

  const user = await serviceRole
    .from("user")
    .select("email, phone")
    .eq("id", userId)
    .single();
  if (user.error) {
    return { success: false, message: user.error.message };
  }

  const invitePhone = (invite.data as { phone?: string | null }).phone ?? null;
  const matchesUser =
    (!!invite.data.email && invite.data.email === user.data.email) ||
    (!!invitePhone && invitePhone === user.data.phone);
  if (!matchesUser) {
    return {
      success: false,
      message: "This invitation does not belong to your account"
    };
  }

  const companyId = invite.data.companyId;
  const role = invite.data.role;
  if (role !== "employee" && role !== "customer" && role !== "supplier") {
    return { success: false, message: "Invalid invite role" };
  }

  // Activate the role-specific account. `.select("id")` lets us detect a missing
  // account (0 rows updated) — mirrors ERP's activate* helpers' 0-row guard.
  const setAccountActive = (active: boolean) => {
    if (role === "employee") {
      return serviceRole
        .from("employee")
        .update({ active })
        .eq("id", userId)
        .eq("companyId", companyId)
        .select("id");
    }
    if (role === "customer") {
      return serviceRole
        .from("customerAccount")
        .update({ active })
        .eq("id", userId)
        .eq("companyId", companyId)
        .select("id");
    }
    return serviceRole
      .from("supplierAccount")
      .update({ active })
      .eq("id", userId)
      .eq("companyId", companyId)
      .select("id");
  };

  // Merge the invite's permissions into any existing set (mirrors setUserPermissions).
  const current = await serviceRole
    .from("userPermission")
    .select("permissions")
    .eq("id", userId)
    .maybeSingle();
  const merged: Record<string, string[]> = {
    ...((current.data?.permissions ?? {}) as Record<string, string[]>)
  };
  for (const [key, value] of Object.entries(
    (invite.data.permissions ?? {}) as Record<string, string[]>
  )) {
    const existing = merged[key];
    merged[key] = existing ? [...existing, ...value] : value;
  }

  // Membership is inserted only once — re-accept must not create duplicates.
  const existingMembership = await serviceRole
    .from("userToCompany")
    .select("userId")
    .eq("userId", userId)
    .eq("companyId", companyId)
    .maybeSingle();

  // Undo a partial accept so the invite stays pending and can be retried.
  const rollback = async () => {
    await Promise.all([
      setAccountActive(false),
      existingMembership.data
        ? Promise.resolve()
        : serviceRole
            .from("userToCompany")
            .delete()
            .eq("userId", userId)
            .eq("companyId", companyId)
    ]);
  };

  // Do the activation + membership + permission writes; stamp acceptedAt LAST, only
  // after they all succeed, so a partial failure leaves the invite pending.
  const [activate, permissions, membership] = await Promise.all([
    setAccountActive(true),
    serviceRole
      .from("userPermission")
      .upsert({ id: userId, permissions: merged as unknown as Json }),
    existingMembership.data
      ? Promise.resolve({ error: null })
      : serviceRole.from("userToCompany").insert({ userId, companyId, role })
  ]);

  const writeError = activate.error || permissions.error || membership.error;
  const activateMissing = !activate.error && (activate.data?.length ?? 0) === 0;
  if (writeError || activateMissing) {
    if (writeError) console.error("[invite accept] write failed", writeError);
    await rollback();
    return {
      success: false,
      message:
        writeError?.message ??
        "Could not activate your account for this company"
    };
  }

  const stamp = await serviceRole
    .from("invite")
    .update({ acceptedAt: new Date().toISOString() })
    .eq("id", inviteId);
  if (stamp.error) {
    await rollback();
    return { success: false, message: stamp.error.message };
  }

  await redis.del(getPermissionCacheKey(userId));
  return { success: true, companyId };
}
