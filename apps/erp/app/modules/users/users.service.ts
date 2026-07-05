import type { Database } from "@carbon/database";
import { fetchAllFromTable } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import { capitalize } from "~/utils/string";
import { sanitize } from "~/utils/supabase";
import type { CompanyPermission } from "./types";

export async function deleteEmployeeType(
  client: SupabaseClient<Database>,
  employeeTypeId: string
) {
  return client
    .from("employeeType")
    .delete()
    .eq("id", employeeTypeId)
    .eq("protected", false);
}

export async function deleteGroup(
  client: SupabaseClient<Database>,
  groupId: string
) {
  return client.from("group").delete().eq("id", groupId);
}

export async function getCompaniesForUser(
  client: SupabaseClient<Database>,
  userId: string
) {
  const { data, error } = await client
    .from("userToCompany")
    .select("companyId")
    .eq("userId", userId);

  if (error) {
    console.log(`Failed to get companies for user ${userId}`, error);
    return [];
  }

  return data?.map((row) => row.companyId) ?? [];
}

export async function getCustomers(
  client: SupabaseClient<Database>,
  companyId: string,
  args: GenericQueryFilters & {
    search: string | null;
  }
) {
  // TODO: this breaks on customerType filters -- convert to view
  let query = client
    .from("customerAccount")
    .select(
      `active, user!inner(id, fullName, firstName, lastName, email, avatarUrl),
      customer!inner(name, customerType!left(name))`,
      { count: "exact" }
    )
    .eq("companyId", companyId);

  if (args.search) {
    query = query.ilike("user.fullName", `%${args.search}%`);
  }

  query = setGenericQueryFilters(query, args, [
    { column: "user(lastName)", ascending: true }
  ]);
  return query;
}

export async function getEmployee(
  client: SupabaseClient<Database>,
  id: string,
  companyId: string
) {
  return client
    .from("employees")
    .select("*")
    .eq("id", id)
    .eq("companyId", companyId)
    .single();
}

export async function getUnrevokedInviteEmails(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return client
    .from("invite")
    .select("email")
    .eq("companyId", companyId)
    .is("revokedAt", null);
}

export async function getEmployees(
  client: SupabaseClient<Database>,
  companyId: string,
  args: GenericQueryFilters & {
    search: string | null;
  }
) {
  let query = client
    .from("employees")
    .select("*", { count: "exact" })
    .eq("companyId", companyId);

  if (args.search) {
    query = query.ilike("name", `%${args.search}%`);
  }

  // Default to active employees when the user hasn't explicitly filtered on
  // active status. The status/active dropdown still works because picking
  // a value puts an `active:eq:...` or `status:eq:...` filter in the URL,
  // which overrides this default.
  const hasStatusFilter = args.filters?.some(
    (f) => f.column === "status" || f.column === "active"
  );
  if (!hasStatusFilter) {
    query = query.eq("active", true);
  }

  query = setGenericQueryFilters(query, args, [
    { column: "lastName", ascending: true }
  ]);
  return query;
}

/**
 * Gets console operators — users with @console.internal emails.
 * Uses the employees view (which joins user + employee) and filters
 * by the synthetic email pattern since there's no FK from employee to user
 * for PostgREST to use directly.
 *
 * TODO: After running db:generate, replace email pattern filter with
 * .eq("isConsoleOperator", true) once the column is in the employees view.
 */
export async function getConsoleOperators(
  client: SupabaseClient<Database>,
  companyId: string,
  args: GenericQueryFilters & {
    search: string | null;
  }
) {
  let query = client
    .from("employees")
    .select("*", { count: "exact" })
    .eq("companyId", companyId)
    .like("email", "%@console.internal");

  if (args.search) {
    query = query.ilike("name", `%${args.search}%`);
  }

  query = setGenericQueryFilters(query, args, [
    { column: "lastName", ascending: true }
  ]);
  return query;
}

export async function getEmployeeType(
  client: SupabaseClient<Database>,
  employeeTypeId: string
) {
  return client
    .from("employeeType")
    .select("*")
    .eq("id", employeeTypeId)
    .single();
}

export async function getEmployeeTypes(
  client: SupabaseClient<Database>,
  companyId: string,
  args?: GenericQueryFilters & { search: string | null }
) {
  let query = client
    .from("employeeType")
    .select("*", { count: "exact" })
    .eq("companyId", companyId);

  if (args?.search) {
    query = query.ilike("name", `%${args.search}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, [
      { column: "name", ascending: true }
    ]);
  }

  return query;
}

export async function getInvitable(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return client
    .from("employeesAcrossCompanies")
    .select("*")
    .eq("active", true)
    .not("companyId", "cs", `{"${companyId}"}`)
    .order("lastName");
}

export async function getModules(client: SupabaseClient<Database>) {
  return client.from("modules").select("name").order("name");
}

export async function getGroup(
  client: SupabaseClient<Database>,
  groupId: string
) {
  return client.from("group").select("id, name").eq("id", groupId).single();
}

export async function getGroupMembers(
  client: SupabaseClient<Database>,
  groupId: string
) {
  return client
    .from("groupMembers")
    .select("name, groupId, memberGroupId, memberUserId")
    .eq("groupId", groupId);
}

export async function getGroups(
  client: SupabaseClient<Database>,
  companyId: string,
  args?: GenericQueryFilters & {
    search: string | null;
    uid: string | null;
  }
) {
  let query = client
    .rpc("groups_query", {
      _uid: args?.uid ?? "",
      _name: args?.search ?? ""
    })
    .eq("companyId", companyId);

  if (args) query = setGenericQueryFilters(query, args);

  return query;
}

export async function getGroupEmails(
  client: SupabaseClient<Database>,
  groupIds: string[]
): Promise<string[]> {
  if (!groupIds || groupIds.length === 0) return [];

  const userIdsResult = (await client.rpc("users_for_groups", {
    groups: groupIds
  })) as { data: string[]; error: unknown };

  if (userIdsResult.error || !Array.isArray(userIdsResult.data)) return [];

  return getUserEmails(client, userIdsResult.data);
}

export async function getPermissionsByEmployeeType(
  client: SupabaseClient<Database>,
  employeeTypeId: string
) {
  return client
    .from("employeeTypePermission")
    .select("view, create, update, delete, module")
    .eq("employeeTypeId", employeeTypeId);
}

export async function getSuppliers(
  client: SupabaseClient<Database>,
  companyId: string,
  args: GenericQueryFilters & {
    search: string | null;
  }
) {
  // TODO: this breaks on supplierType filters -- convert to view
  let query = client
    .from("supplierAccount")
    .select(
      `active, user!inner(id, fullName, firstName, lastName, email, avatarUrl),
      supplier!inner(name, supplierType!left(name))`,
      { count: "exact" }
    )
    .eq("companyId", companyId);

  if (args.search) {
    query = query.ilike("user.fullName", `%${args.search}%`);
  }

  query = setGenericQueryFilters(query, args, [
    { column: "user(lastName)", ascending: true }
  ]);
  return query;
}

export async function getUsers(client: SupabaseClient<Database>) {
  return fetchAllFromTable<{
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
  }>(
    client,
    "user",
    "id, firstName, lastName, fullName, email, avatarUrl, number",
    (query) => query.eq("active", true).order("lastName")
  );
}

export async function getUserEmails(
  client: SupabaseClient<Database>,
  userIds: string[]
): Promise<string[]> {
  if (!userIds || userIds.length === 0) return [];

  const result = await client
    .from("user")
    .select("email")
    .in("id", userIds)
    .eq("active", true);

  if (result.error || !result.data) return [];

  return result.data
    .map((u) => u.email)
    .filter((email): email is string => !!email);
}

// Fixed permission set for MES-only employee types.
// Mirrors the Console Operator seeding — only modules the MES app actually uses.
// These are written to employeeTypePermission whenever a MES-only type is saved,
// regardless of what the admin submitted, so ERP modules can never be granted.
export const MES_PERMISSIONS: {
  name: string;
  permission: CompanyPermission;
}[] = [
  {
    name: "production",
    permission: { view: true, create: true, update: true, delete: false }
  },
  {
    name: "inventory",
    permission: { view: true, create: true, update: true, delete: false }
  },
  {
    name: "quality",
    permission: { view: true, create: true, update: true, delete: false }
  },
  {
    name: "items",
    permission: { view: true, create: false, update: false, delete: false }
  },
  {
    name: "resources",
    permission: { view: true, create: false, update: false, delete: false }
  },
  {
    name: "people",
    permission: { view: true, create: false, update: false, delete: false }
  },
  {
    name: "documents",
    permission: { view: true, create: false, update: false, delete: false }
  }
];

export async function insertEmployeeType(
  client: SupabaseClient<Database>,
  employeeType: { name: string; mesOnly?: boolean; companyId: string }
) {
  // Only include mesOnly when true — DB DEFAULT false covers the common case,
  // and PostgREST rejects unknown columns if the migration hasn't run yet.
  const { mesOnly, ...base } = employeeType;
  const row = mesOnly ? { ...base, mesOnly } : base;
  return client.from("employeeType").insert([row]).select("id").single();
}

export async function insertGroup(
  client: SupabaseClient<Database>,
  group: { name: string; companyId: string }
) {
  return client.from("group").insert(group).select("*").single();
}

export async function upsertEmployeeType(
  client: SupabaseClient<Database>,
  employeeType:
    | { name: string; mesOnly?: boolean; companyId: string }
    | { id: string; name: string; mesOnly?: boolean }
) {
  if ("id" in employeeType) {
    const { mesOnly, ...base } = employeeType;
    const row = mesOnly !== undefined ? { ...base, mesOnly } : base;
    return client
      .from("employeeType")
      .update(sanitize(row))
      .eq("id", employeeType.id)
      .select("id")
      .single();
  }
  const { mesOnly, ...base } = employeeType;
  const row = mesOnly ? { ...base, mesOnly } : base;
  return client.from("employeeType").insert([row]).select("id").single();
}

export async function upsertEmployeeTypePermissions(
  client: SupabaseClient<Database>,
  employeeTypeId: string,
  companyId: string,
  permissions: { name: string; permission: CompanyPermission }[]
) {
  const employeeTypePermissions = permissions.map(({ name, permission }) => ({
    employeeTypeId,
    module: capitalize(name) as "Accounting",
    view: permission.view ? [companyId] : [],
    create: permission.create ? [companyId] : [],
    update: permission.update ? [companyId] : [],
    delete: permission.delete ? [companyId] : []
  }));

  return client.from("employeeTypePermission").upsert(employeeTypePermissions);
}

export async function upsertGroup(
  client: SupabaseClient<Database>,
  {
    id,
    name,
    companyId
  }: {
    id: string;
    name: string;
    companyId: string;
  }
) {
  return client.from("group").upsert([{ id, name, companyId }]);
}

export async function upsertGroupMembers(
  client: SupabaseClient<Database>,
  groupId: string,
  selections: string[]
) {
  const deleteExisting = await client
    .from("membership")
    .delete()
    .eq("groupId", groupId);

  if (deleteExisting.error) return deleteExisting;

  // separate each id according to whether it is a group or a user
  const memberGroups = selections
    .filter((id) => id.startsWith("group_"))
    .map((id) => ({
      groupId,
      memberGroupId: id.slice(6)
    }));

  const memberUsers = selections
    .filter((id) => id.startsWith("user_"))
    .map((id) => ({
      groupId,
      memberUserId: id.slice(5)
    }));

  return client.from("membership").insert([...memberGroups, ...memberUsers]);
}
