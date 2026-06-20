import type { Database, Json } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { DataType } from "~/modules/shared";
import type { Employee } from "~/modules/users";
import { getEmployees } from "~/modules/users/users.service";
import type { GenericQueryFilters } from "~/utils/query";
import { setGenericQueryFilters } from "~/utils/query";
import { sanitize } from "~/utils/supabase";
import {
  type departmentValidator,
  type employeeJobValidator,
  type holidayValidator,
  type ProductionPayApprovalRequestRow,
  type ProductionPayApprovalRequestStatus,
  type ProductionPayApprovalScope,
  type ProductionPayApprovalStatus,
  type salaryPaymentValidator,
  type shiftValidator
} from "./people.models";

export type {
  ProductionPayApprovalRequestRow,
  ProductionPayApprovalRequestStatus,
  ProductionPayApprovalScope,
  ProductionPayApprovalStatus
} from "./people.models";

export async function deleteAttribute(
  client: SupabaseClient<Database>,
  attributeId: string
) {
  return client
    .from("userAttribute")
    .update({ active: false })
    .eq("id", attributeId);
}

export async function deleteAttributeCategory(
  client: SupabaseClient<Database>,
  attributeCategoryId: string
) {
  return client
    .from("userAttributeCategory")
    .update({ active: false })
    .eq("id", attributeCategoryId);
}

export async function deleteDepartment(
  client: SupabaseClient<Database>,
  departmentId: string
) {
  return client.from("department").delete().eq("id", departmentId);
}

export async function deleteHoliday(
  client: SupabaseClient<Database>,
  holidayId: string
) {
  return client.from("holiday").delete().eq("id", holidayId);
}

export async function deleteShift(
  client: SupabaseClient<Database>,
  shiftId: string
) {
  // TODO: Set all employeeShifts to null
  return client.from("shift").update({ active: false }).eq("id", shiftId);
}

export async function getAttribute(
  client: SupabaseClient<Database>,
  attributeId: string
) {
  return client
    .from("userAttribute")
    .select("*, userAttributeCategory(name)")
    .eq("id", attributeId)
    .eq("active", true)
    .single();
}

async function getAttributes(
  client: SupabaseClient<Database>,
  companyId: string,
  userIds: string[]
) {
  return client
    .from("userAttributeCategory")
    .select(
      `*,
      userAttribute(id, name, listOptions, canSelfManage,
        attributeDataType(id, isBoolean, isDate, isNumeric, isText, isUser, isFile),
        userAttributeValue(
          id, userId, valueBoolean, valueDate, valueNumeric, valueText, valueUser, valueFile, user!userAttributeValue_userId_fkey(id, fullName, avatarUrl)
        )
      )`
    )
    .eq("companyId", companyId)
    .eq("userAttribute.active", true)
    .in("userAttribute.userAttributeValue.userId", userIds)
    .order("sortOrder", { foreignTable: "userAttribute", ascending: true });
}

export async function getAttributeCategories(
  client: SupabaseClient<Database>,
  companyId: string,
  args?: { search: string | null } & GenericQueryFilters
) {
  let query = client
    .from("userAttributeCategory")
    .select("*, userAttribute(id, name, attributeDataType(id))", {
      count: "exact"
    })
    .eq("companyId", companyId)
    .eq("active", true)
    .eq("userAttribute.active", true);

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

export async function getAttributeCategory(
  client: SupabaseClient<Database>,
  id: string
) {
  return client
    .from("userAttributeCategory")
    .select(
      `*,
      userAttribute(
        id, name, sortOrder,
        attributeDataType(id, label, isBoolean, isDate, isList, isNumeric, isText, isUser, isFile))
      `,
      {
        count: "exact"
      }
    )
    .eq("id", id)
    .eq("active", true)
    .eq("userAttribute.active", true)
    .single();
}

export async function getAttributeDataTypes(client: SupabaseClient<Database>) {
  return client.from("attributeDataType").select("*");
}

export async function getDepartment(
  client: SupabaseClient<Database>,
  departmentId: string
) {
  return client.from("department").select("*").eq("id", departmentId).single();
}

export async function getDepartments(
  client: SupabaseClient<Database>,
  companyId: string,
  args?: GenericQueryFilters & { search: string | null }
) {
  let query = client
    .from("department")
    .select(`*, department(id, name)`, {
      count: "exact"
    })
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

export async function getDepartmentsList(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return client
    .from("department")
    .select(`id, name`)
    .eq("companyId", companyId)
    .order("name");
}

export async function getDepartmentsTree(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return client
    .from("department")
    .select("id, name, parentDepartmentId")
    .eq("companyId", companyId)
    .order("name");
}

export async function getEmployeeJob(
  client: SupabaseClient<Database>,
  employeeId: string,
  companyId: string
) {
  return client
    .from("employeeJob")
    .select("*")
    .eq("id", employeeId)
    .eq("companyId", companyId)
    .single();
}

export async function getEmployeeSummary(
  client: SupabaseClient<Database>,
  employeeId: string,
  companyId: string
) {
  return client
    .from("employeeSummary")
    .select("*")
    .eq("id", employeeId)
    .eq("companyId", companyId)
    .single();
}

export async function getHoliday(
  client: SupabaseClient<Database>,
  holidayId: string
) {
  return client.from("holiday").select("*").eq("id", holidayId).single();
}

export async function getHolidays(
  client: SupabaseClient<Database>,
  companyId: string,
  args?: GenericQueryFilters & { search: string | null }
) {
  let query = client
    .from("holiday")
    .select("*", {
      count: "exact"
    })
    .eq("companyId", companyId);

  if (args?.search) {
    query = query.ilike("name", `%${args.search}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, [
      { column: "date", ascending: true }
    ]);
  }

  return query;
}

export function getHolidayYears(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return client.from("holidayYears").select("year").eq("companyId", companyId);
}

type UserAttributeId = string;

export type PersonAttributeValue = {
  userAttributeValueId: string;
  value: boolean | string | number;
  dataType?: DataType;
  user?: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
  } | null;
};

type PersonAttributes = Record<UserAttributeId, PersonAttributeValue>;

type Person = Employee & {
  attributes: PersonAttributes;
};

export async function getPeople(
  client: SupabaseClient<Database>,
  companyId: string,
  args: GenericQueryFilters & {
    search: string | null;
  }
) {
  const employees = await getEmployees(client, companyId, args);
  if (employees.error) return employees;

  if (!employees.data) throw new Error("Failed to get employee data");

  const userIds = employees.data.reduce<string[]>((acc, employee) => {
    if (employee.id) acc.push(employee.id);
    return acc;
  }, []);

  const attributeCategories = await getAttributes(client, companyId, userIds);
  if (attributeCategories.error) return attributeCategories;

  const people: Person[] = employees.data.map((employee) => {
    const userId = employee.id;

    const employeeAttributes =
      attributeCategories.data.reduce<PersonAttributes>((acc, category) => {
        if (!category.userAttribute || !Array.isArray(category.userAttribute))
          return acc;
        category.userAttribute.forEach(
          // @ts-ignore
          (attribute) => {
            if (
              attribute.userAttributeValue &&
              Array.isArray(attribute.userAttributeValue) &&
              !Array.isArray(attribute.attributeDataType)
            ) {
              const userAttributeId = attribute.id;
              const userAttributeValue = attribute.userAttributeValue.find(
                // @ts-ignore
                (attributeValue) => attributeValue.userId === userId
              );
              const value =
                typeof userAttributeValue?.valueBoolean === "boolean"
                  ? userAttributeValue.valueBoolean
                  : userAttributeValue?.valueDate ||
                    userAttributeValue?.valueNumeric ||
                    userAttributeValue?.valueText ||
                    userAttributeValue?.valueUser ||
                    userAttributeValue?.valueFile;

              if (value && userAttributeValue?.id) {
                acc[userAttributeId] = {
                  userAttributeValueId: userAttributeValue.id,
                  // @ts-ignore
                  dataType: attribute.attributeDataType?.id as DataType,
                  value,
                  user: !Array.isArray(userAttributeValue.user)
                    ? userAttributeValue.user
                    : undefined
                };
              }
            }
          }
        );
        return acc;
      }, {});

    return {
      ...employee,
      attributes: employeeAttributes
    };
  });

  return {
    count: employees.count,
    data: people,
    error: null
  };
}

export async function getContacts(
  client: SupabaseClient<Database>,
  companyId: string,
  args: GenericQueryFilters & {
    search: string | null;
  }
) {
  let query = client
    .from("contact")
    .select("*", { count: "exact" })
    .eq("companyId", companyId);

  if (args.search) {
    query = query.or(
      `firstName.ilike.%${args.search}%,lastName.ilike.%${args.search}%,email.ilike.%${args.search}%`
    );
  }

  query = setGenericQueryFilters(query, args, [
    { column: "lastName", ascending: true }
  ]);

  const contacts = await query;

  if (!contacts.data) throw new Error("Failed to get contacts data");

  return {
    count: contacts.count,
    data: contacts.data,
    error: null
  };
}
export async function getShift(
  client: SupabaseClient<Database>,
  shiftId: string
) {
  return client
    .from("shifts")
    .select("*")
    .eq("id", shiftId)
    .eq("active", true)
    .single();
}

export async function getShifts(
  client: SupabaseClient<Database>,
  companyId: string,
  args: GenericQueryFilters & { search: string | null }
) {
  let query = client
    .from("shifts")
    .select("*", {
      count: "exact"
    })
    .eq("companyId", companyId)
    .eq("active", true);

  if (args?.search) {
    query = query.ilike("name", `%${args.search}%`);
  }

  query = setGenericQueryFilters(query, args, [
    { column: "locationId", ascending: true }
  ]);
  return query;
}

export async function getShiftsList(
  client: SupabaseClient<Database>,
  locationId: string | null
) {
  let query = client.from("shift").select(`id, name`).eq("active", true);

  if (locationId) {
    query = query.eq("locationId", locationId);
  }

  return query.order("name");
}

export async function insertAttribute(
  client: SupabaseClient<Database>,
  attribute: {
    name: string;
    attributeDataTypeId: number;
    userAttributeCategoryId: string;
    listOptions?: string[];
    canSelfManage: boolean;
    createdBy: string;
  }
) {
  // TODO: there's got to be a better way to get the max
  const sortOrders = await client
    .from("userAttribute")
    .select("sortOrder")
    .eq("userAttributeCategoryId", attribute.userAttributeCategoryId);

  if (sortOrders.error) return sortOrders;
  const maxSortOrder = sortOrders.data.reduce((max, item) => {
    return Math.max(max, item.sortOrder);
  }, 0);

  return client
    .from("userAttribute")
    .upsert([{ ...attribute, sortOrder: maxSortOrder + 1 }])
    .select("id")
    .single();
}

export async function insertAttributeCategory(
  client: SupabaseClient<Database>,
  attributeCategory: {
    name: string;
    emoji?: string;
    public: boolean;
    companyId: string;
    createdBy: string;
  }
) {
  return client
    .from("userAttributeCategory")
    .upsert([attributeCategory])
    .select("id")
    .single();
}

export async function insertEmployeeJob(
  client: SupabaseClient<Database>,
  job: {
    id: string;
    companyId: string;
    locationId?: string;
  }
) {
  return client.from("employeeJob").insert(job).select("*").single();
}

export async function updateAttribute(
  client: SupabaseClient<Database>,
  attribute: {
    id?: string;
    name: string;
    listOptions?: string[];
    canSelfManage: boolean;
    updatedBy: string;
  }
) {
  if (!attribute.id) throw new Error("id is required");
  return client
    .from("userAttribute")
    .update(
      sanitize({
        name: attribute.name,
        listOptions: attribute.listOptions,
        canSelfManage: attribute.canSelfManage,
        updatedBy: attribute.updatedBy
      })
    )
    .eq("id", attribute.id);
}

export async function updateAttributeCategory(
  client: SupabaseClient<Database>,
  attributeCategory: {
    id: string;
    name: string;
    emoji?: string;
    public: boolean;
    updatedBy: string;
  }
) {
  const { id, ...update } = attributeCategory;
  return client
    .from("userAttributeCategory")
    .update(sanitize(update))
    .eq("id", id);
}

export async function updateAttributeSortOrder(
  client: SupabaseClient<Database>,
  updates: {
    id: string;
    sortOrder: number;
    updatedBy: string;
  }[]
) {
  const updatePromises = updates.map(({ id, sortOrder, updatedBy }) =>
    client.from("userAttribute").update({ sortOrder, updatedBy }).eq("id", id)
  );
  return Promise.all(updatePromises);
}

// Uses upsert so callers can update employee job fields without first
// ensuring insertEmployeeJob ran (e.g. legacy employees missing a row).
export async function updateEmployeeJob(
  client: SupabaseClient<Database>,
  employeeId: string,
  employeeJob: z.infer<typeof employeeJobValidator> & {
    companyId: string;
    updatedBy: string;
    customFields?: Json;
  }
) {
  const { companyId, updatedBy, customFields, ...jobFields } = employeeJob;

  return client.from("employeeJob").upsert(
    sanitize({
      id: employeeId,
      companyId,
      ...jobFields,
      customFields,
      updatedBy,
      updatedAt: new Date().toISOString()
    }),
    { onConflict: "id,companyId" }
  );
}

export async function upsertDepartment(
  client: SupabaseClient<Database>,
  department:
    | (Omit<z.infer<typeof departmentValidator>, "id"> & {
        companyId: string;
        createdBy: string;
        customFields?: Json;
      })
    | (Omit<z.infer<typeof departmentValidator>, "id"> & {
        id: string;
        updatedBy: string;
        customFields?: Json;
      })
) {
  if ("id" in department) {
    return client
      .from("department")
      .update(sanitize(department))
      .eq("id", department.id);
  }
  return client.from("department").insert(department).select("*").single();
}

export async function upsertHoliday(
  client: SupabaseClient<Database>,
  holiday:
    | (Omit<z.infer<typeof holidayValidator>, "id"> & {
        companyId: string;
        createdBy: string;
        customFields?: Json;
      })
    | (Omit<z.infer<typeof holidayValidator>, "id"> & {
        id: string;
        updatedBy: string;
        customFields?: Json;
      })
) {
  if ("createdBy" in holiday) {
    return client.from("holiday").insert(holiday).select("*").single();
  }
  return client.from("holiday").update(sanitize(holiday)).eq("id", holiday.id);
}

export async function upsertShift(
  client: SupabaseClient<Database>,
  shift:
    | (Omit<z.infer<typeof shiftValidator>, "id"> & {
        createdBy: string;
        companyId: string;
        customFields?: Json;
      })
    | (Omit<z.infer<typeof shiftValidator>, "id"> & {
        id: string;
        updatedBy: string;
        customFields?: Json;
      })
) {
  if ("createdBy" in shift) {
    return client.from("shift").insert([shift]).select("*").single();
  }
  return client.from("shift").update(sanitize(shift)).eq("id", shift.id);
}

export async function clockIn(
  client: SupabaseClient<Database>,
  args: {
    employeeId: string;
    companyId: string;
    createdBy: string;
  }
) {
  const existing = await getOpenClockEntry(
    client,
    args.employeeId,
    args.companyId
  );
  if (existing.data) {
    return { data: null, error: { message: "Already clocked in" } };
  }

  return client.from("timeCardEntry").insert({
    employeeId: args.employeeId,
    companyId: args.companyId,
    createdBy: args.createdBy
  });
}

export async function clockOut(
  client: SupabaseClient<Database>,
  args: {
    employeeId: string;
    companyId: string;
    updatedBy: string;
    clockOut?: string;
    note?: string;
  }
) {
  const open = await getOpenClockEntry(client, args.employeeId, args.companyId);
  if (!open.data) {
    return { data: null, error: { message: "Not currently clocked in" } };
  }

  return client
    .from("timeCardEntry")
    .update(
      sanitize({
        clockOut: args.clockOut ?? new Date().toISOString(),
        note: args.note,
        updatedBy: args.updatedBy,
        updatedAt: new Date().toISOString()
      })
    )
    .eq("id", open.data.id);
}

export async function createTimeCardEntry(
  client: SupabaseClient<Database>,
  entry: {
    employeeId: string;
    companyId: string;
    clockIn: string;
    clockOut?: string | null;
    note?: string | null;
    createdBy: string;
  }
) {
  return client
    .from("timeCardEntry")
    .insert(sanitize(entry))
    .select("id")
    .single();
}

export async function deleteTimeCardEntry(
  client: SupabaseClient<Database>,
  entryId: string
) {
  return client.from("timeCardEntry").delete().eq("id", entryId);
}

export async function getClockedInEmployees(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return client
    .from("timeCardEntries")
    .select("*")
    .eq("companyId", companyId)
    .is("clockOut", null)
    .order("clockIn", { ascending: true });
}

export async function getOpenClockEntry(
  client: SupabaseClient<Database>,
  employeeId: string,
  companyId: string
) {
  return client
    .from("timeCardEntry")
    .select("*")
    .eq("employeeId", employeeId)
    .eq("companyId", companyId)
    .is("clockOut", null)
    .maybeSingle();
}

export async function getRecentTimecards(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return client
    .from("timeCardEntries")
    .select("*")
    .eq("companyId", companyId)
    .order("clockIn", { ascending: false })
    .limit(100);
}

export async function getScheduledEmployeesToday(
  client: SupabaseClient<Database>,
  companyId: string
) {
  const { data } = await client
    .from("employeeJob")
    .select(
      "id, shiftId, shift:shift(id, name, startTime, endTime, sunday, monday, tuesday, wednesday, thursday, friday, saturday)"
    )
    .eq("companyId", companyId)
    .not("shiftId", "is", null);

  if (!data) return [];

  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ] as const;
  const today = dayNames[new Date().getDay()];

  return data.filter((ej) => {
    const shift = ej.shift as Record<string, unknown> | null;
    return shift && shift[today] === true;
  });
}

export async function getTimeCardEntry(
  client: SupabaseClient<Database>,
  entryId: string
) {
  return client.from("timeCardEntry").select("*").eq("id", entryId).single();
}

export async function getTimeCardEntries(
  client: SupabaseClient<Database>,
  args: {
    employeeId: string;
    companyId: string;
    from?: string;
    to?: string;
  }
) {
  let query = client
    .from("timeCardEntry")
    .select("*")
    .eq("employeeId", args.employeeId)
    .eq("companyId", args.companyId)
    .order("clockIn", { ascending: false });

  if (args.from) {
    query = query.gte("clockIn", args.from);
  }
  if (args.to) {
    query = query.lte("clockIn", args.to);
  }

  return query;
}

export async function getTimecardEntries(
  client: SupabaseClient<Database>,
  companyId: string,
  args: GenericQueryFilters & { search: string | null }
) {
  let query = client
    .from("timeCardEntries")
    .select("*", { count: "exact" })
    .eq("companyId", companyId);

  if (args.search) {
    query = query.or(
      `firstName.ilike.%${args.search}%,lastName.ilike.%${args.search}%`
    );
  }

  query = setGenericQueryFilters(query, args, [
    { column: "clockIn", ascending: false }
  ]);

  return query;
}

export async function getWeeklyHoursForEmployees(
  client: SupabaseClient<Database>,
  companyId: string,
  employeeIds: string[]
): Promise<Record<string, number>> {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const { data: entries } = await client
    .from("timeCardEntry")
    .select("employeeId, clockIn, clockOut")
    .eq("companyId", companyId)
    .in("employeeId", employeeIds)
    .gte("clockIn", monday.toISOString());

  const weeklyMs: Record<string, number> = {};
  for (const entry of entries ?? []) {
    const end = entry.clockOut
      ? new Date(entry.clockOut).getTime()
      : Date.now();
    const ms = end - new Date(entry.clockIn).getTime();
    weeklyMs[entry.employeeId] = (weeklyMs[entry.employeeId] ?? 0) + ms;
  }

  return weeklyMs;
}

export async function updateTimeCardEntry(
  client: SupabaseClient<Database>,
  args: {
    entryId: string;
    clockIn?: string;
    clockOut?: string | null;
    note?: string | null;
    updatedBy: string;
  }
) {
  return client
    .from("timeCardEntry")
    .update(
      sanitize({
        clockIn: args.clockIn,
        clockOut: args.clockOut,
        note: args.note,
        updatedBy: args.updatedBy,
        updatedAt: new Date().toISOString()
      })
    )
    .eq("id", args.entryId);
}

// ─── Salary Service ────────────────────────────────────────────────────────

type SalaryListRow = {
  employeeId: string | null;
  departmentId?: string | null;
  departmentName?: string | null;
};

async function attachDepartmentToSalaryRecords<
  T extends SalaryListRow
>(client: SupabaseClient<Database>, companyId: string, records: T[]) {
  const employeeIds = [
    ...new Set(
      records.map((row) => row.employeeId).filter((id): id is string => !!id)
    )
  ];
  if (employeeIds.length === 0) {
    return records;
  }

  const [{ data: jobs }, { data: summaries }] = await Promise.all([
    client
      .from("employeeJob")
      .select("id, departmentId")
      .eq("companyId", companyId)
      .in("id", employeeIds),
    client
      .from("employeeSummary")
      .select("id, departmentName")
      .eq("companyId", companyId)
      .in("id", employeeIds)
  ]);

  const departmentByEmployee = new Map<
    string,
    { departmentId: string | null; departmentName: string | null }
  >();

  for (const job of jobs ?? []) {
    departmentByEmployee.set(job.id, {
      departmentId: job.departmentId,
      departmentName: null
    });
  }

  for (const summary of summaries ?? []) {
    const existing = departmentByEmployee.get(summary.id);
    departmentByEmployee.set(summary.id, {
      departmentId: existing?.departmentId ?? null,
      departmentName: summary.departmentName
    });
  }

  return records.map((row) => {
    if (!row.employeeId) return row;
    const department = departmentByEmployee.get(row.employeeId);
    if (!department) return row;

    return {
      ...row,
      departmentId: row.departmentId ?? department.departmentId,
      departmentName: row.departmentName ?? department.departmentName
    };
  });
}

async function getEmployeeIdsForDepartmentFilters(
  client: SupabaseClient<Database>,
  companyId: string,
  filters: { column: string; operator: string; value?: string }[]
) {
  const departmentFilters = filters.filter(
    (f) => f.column === "departmentId" && f.value
  );
  if (departmentFilters.length === 0) {
    return { employeeIds: null as string[] | null, error: null };
  }

  const departmentIds = new Set<string>();
  for (const filter of departmentFilters) {
    const values =
      filter.operator === "in" || filter.operator === "contains"
        ? filter.value!.split(",")
        : [filter.value!];
    for (const id of values) {
      if (id) departmentIds.add(id);
    }
  }

  const { data, error } = await client
    .from("employeeJob")
    .select("id")
    .eq("companyId", companyId)
    .in("departmentId", [...departmentIds]);

  if (error) {
    return { employeeIds: [] as string[], error };
  }

  return { employeeIds: data?.map((row) => row.id) ?? [], error: null };
}

const SALARY_PAYMENT_STATUSES = ["Unpaid", "Partially Paid", "Paid"] as const;

function collectSalaryStatusValues(
  filters: { column: string; operator: string; value?: string }[]
) {
  const statuses = new Set<string>();
  for (const filter of filters) {
    if (filter.column !== "status" || !filter.value) continue;
    const values =
      filter.operator === "in" || filter.operator === "contains"
        ? filter.value.split(",").map((v) => v.trim()).filter(Boolean)
        : [filter.value];
    for (const value of values) {
      if (SALARY_PAYMENT_STATUSES.includes(value as (typeof SALARY_PAYMENT_STATUSES)[number])) {
        statuses.add(value);
      }
    }
  }
  return [...statuses];
}

function applySalaryStatusFilter(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  statuses: string[]
) {
  if (statuses.length === 0 || statuses.length >= SALARY_PAYMENT_STATUSES.length) {
    return query;
  }

  if (statuses.length === 1) {
    return query.eq("status", statuses[0]);
  }

  return query.in("status", statuses);
}

export async function getEmployeeSalaryList(
  client: SupabaseClient<Database>,
  companyId: string,
  year: number,
  month: number,
  args?: GenericQueryFilters & { search: string | null }
) {
  const filters = args?.filters ?? [];
  const { employeeIds: departmentEmployeeIds, error: departmentError } =
    await getEmployeeIdsForDepartmentFilters(client, companyId, filters);

  if (departmentError) {
    return { data: null, error: departmentError, count: null, status: 0, statusText: "" };
  }

  if (departmentEmployeeIds !== null && departmentEmployeeIds.length === 0) {
    return { data: [], error: null, count: 0, status: 200, statusText: "OK" };
  }

  const salaryStatuses = collectSalaryStatusValues(filters);
  const otherFilters = filters.filter(
    (f) => f.column !== "departmentId" && f.column !== "status"
  );

  let query = client
    .from("employeeSalaryRecords")
    .select("*", { count: "exact" })
    .eq("companyId", companyId)
    .eq("year", year)
    .eq("month", month);

  if (departmentEmployeeIds !== null) {
    query = query.in("employeeId", departmentEmployeeIds);
  }

  if (args?.search) {
    query = query.ilike("employeeName", `%${args.search}%`);
  }

  query = applySalaryStatusFilter(query, salaryStatuses);

  if (args) {
    query = setGenericQueryFilters(
      query,
      { ...args, filters: otherFilters },
      [{ column: "employeeName", ascending: true }]
    );
  } else {
    query = query.order("employeeName", { ascending: true });
  }

  const result = await query;
  if (result.error || !result.data) {
    return result;
  }

  return {
    ...result,
    data: await attachDepartmentToSalaryRecords(client, companyId, result.data)
  };
}

export async function getEmployeeSalaryRecord(
  client: SupabaseClient<Database>,
  employeeId: string,
  companyId: string,
  year: number,
  month: number
) {
  return client
    .from("employeeSalaryRecords")
    .select("*")
    .eq("employeeId", employeeId)
    .eq("companyId", companyId)
    .eq("year", year)
    .eq("month", month)
    .maybeSingle();
}

export async function getSalaryRecordBalances(
  client: SupabaseClient<Database>,
  salaryRecordId: string,
  companyId: string
) {
  return client
    .from("employeeSalaryRecord")
    .select("id, totalEarned, totalPaid")
    .eq("id", salaryRecordId)
    .eq("companyId", companyId)
    .maybeSingle();
}

export function getAmountOwed(record: {
  totalEarned?: number | null;
  totalPaid?: number | null;
}): number {
  return (record.totalEarned ?? 0) - (record.totalPaid ?? 0);
}

export async function getEmployeeSalaryCompletions(
  client: SupabaseClient<Database>,
  employeeId: string,
  companyId: string,
  year: number,
  month: number
) {
  return client
    .from("productionQuantity")
    .select(
      `id, quantity, createdAt, paymentYear, paymentMonth,
       jobOperation!inner(id, description, insideUnitCost, jobId,
         process:processId(name),
         job:jobId(jobId)
       )`
    )
    .eq("employeeId", employeeId)
    .eq("companyId", companyId)
    .eq("type", "Production")
    .eq("paymentYear", year)
    .eq("paymentMonth", month)
    .is("invalidatedAt", null)
    .order("createdAt", { ascending: false });
}

export async function getPendingSalaryCompletions(
  client: SupabaseClient<Database>,
  employeeId: string,
  companyId: string
) {
  return client
    .from("productionQuantity")
    .select(
      `id, quantity, createdAt,
       jobOperation!inner(id, description, insideUnitCost, jobId,
         process:processId(name),
         job:jobId(jobId)
       )`
    )
    .eq("employeeId", employeeId)
    .eq("companyId", companyId)
    .eq("type", "Production")
    .is("paymentYear", null)
    .is("invalidatedAt", null)
    .order("createdAt", { ascending: false });
}

export async function getCompanyPendingSalaryCompletions(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return getProductionPayApprovals(client, companyId, {
    mode: "single",
    status: "pending"
  });
}

const productionPayApprovalSelect = `
  id, quantity, createdAt, employeeId, paymentYear, paymentMonth, invalidatedAt, reportId,
  employee:user!productionQuantity_employeeId_fkey(id, firstName, lastName, fullName, avatarUrl),
  jobOperation!inner(id, description, insideUnitCost, jobId,
    process:processId(name),
    job:jobId(jobId, item:itemId(readableIdWithRevision, name))
  )
`;

const productionPayApprovalReportSelect = `
  id, employeeId, originalQuantity, jobOperationId,
  employee:user!productionQuantityReport_employeeId_fkey(id, firstName, lastName, fullName, avatarUrl),
  jobOperation!inner(id, description, insideUnitCost, jobId,
    process:processId(name),
    job:jobId(jobId, item:itemId(readableIdWithRevision, name))
  )
`;

function normalizeProductionPayApprovalStatus(
  value: string
): ProductionPayApprovalStatus | null {
  const normalized = value.trim().toLowerCase();
  if (normalized === "pending") return "pending";
  if (normalized === "approved") return "approved";
  if (normalized === "rejected") return "rejected";
  return null;
}

export function resolveProductionPayApprovalScope(
  filters: { column: string; operator: string; value?: string }[] | undefined
): ProductionPayApprovalScope {
  const statusFilters = filters?.filter((f) => f.column === "approvalStatus") ?? [];
  if (statusFilters.length === 0) {
    return { mode: "all" };
  }

  const statuses = new Set<ProductionPayApprovalStatus>();
  for (const statusFilter of statusFilters) {
    if (!statusFilter.value) continue;
    const values =
      statusFilter.operator === "in" || statusFilter.operator === "contains"
        ? statusFilter.value.split(",").map((v) => v.trim()).filter(Boolean)
        : [statusFilter.value];
    for (const value of values) {
      const normalized = normalizeProductionPayApprovalStatus(value);
      if (normalized) statuses.add(normalized);
    }
  }

  const list = [...statuses];
  if (list.length === 0 || list.length >= 3) {
    return { mode: "all" };
  }
  if (list.length === 1) {
    return { mode: "single", status: list[0]! };
  }

  return { mode: "multiple", statuses: list };
}

/** @deprecated Use resolveProductionPayApprovalScope */
export function resolveProductionPayApprovalStatus(
  filters: { column: string; value: string }[] | undefined
): ProductionPayApprovalStatus | "all" {
  const scope = resolveProductionPayApprovalScope(filters);
  if (scope.mode === "single") return scope.status;
  return "all";
}

function applyProductionPayApprovalScope(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  scope: ProductionPayApprovalScope
) {
  if (scope.mode === "all") {
    return query;
  }

  if (scope.mode === "single") {
    switch (scope.status) {
      case "pending":
        return query.is("paymentYear", null).is("invalidatedAt", null);
      case "approved":
        return query.not("paymentYear", "is", null).is("invalidatedAt", null);
      case "rejected":
        return query.not("invalidatedAt", "is", null);
    }
  }

  const hasPending = scope.statuses.includes("pending");
  const hasApproved = scope.statuses.includes("approved");
  const hasRejected = scope.statuses.includes("rejected");

  // Avoid PostgREST `.or()` when a single predicate covers the pair (also keeps
  // the query compatible with a separate search `.or()` on related tables).
  if (hasPending && hasApproved && !hasRejected) {
    return query.is("invalidatedAt", null);
  }
  if (hasPending && hasRejected && !hasApproved) {
    return query.or(
      "and(paymentYear.is.null,invalidatedAt.is.null),not.invalidatedAt.is.null"
    );
  }
  if (hasApproved && hasRejected && !hasPending) {
    return query.or(
      "and(paymentYear.not.is.null,invalidatedAt.is.null),not.invalidatedAt.is.null"
    );
  }

  return query;
}

async function getEmployeeIdsMatchingSearch(
  client: SupabaseClient<Database>,
  companyId: string,
  term: string
) {
  const pattern = `%${term}%`;
  return client
    .from("employeeSummary")
    .select("id")
    .eq("companyId", companyId)
    .or(
      `fullName.ilike.${pattern},firstName.ilike.${pattern},lastName.ilike.${pattern}`
    );
}

function getEmployeeIdsFromFilters(
  filters: GenericQueryFilters["filters"]
): string[] | null {
  if (!filters?.length) return null;

  const ids = new Set<string>();
  for (const filter of filters) {
    if (filter.column !== "employeeId" || !filter.value) continue;
    if (filter.operator === "eq") {
      ids.add(filter.value);
    } else if (filter.operator === "in") {
      for (const id of filter.value.split(",")) {
        const trimmed = id.trim();
        if (trimmed) ids.add(trimmed);
      }
    }
  }

  return ids.size > 0 ? [...ids] : null;
}

async function getProductionQuantityReportIdsForEmployees(
  client: SupabaseClient<Database>,
  companyId: string,
  employeeIds: string[]
) {
  if (employeeIds.length === 0) {
    return { data: [] as string[], error: null };
  }

  const { data, error } = await client
    .from("productionQuantityReport")
    .select("id")
    .eq("companyId", companyId)
    .in("employeeId", employeeIds);

  if (error) {
    return { data: null, error };
  }

  return { data: data?.map((row) => row.id) ?? [], error: null };
}

export async function getProductionPayApprovals(
  client: SupabaseClient<Database>,
  companyId: string,
  scope: ProductionPayApprovalScope,
  args?: GenericQueryFilters & { search: string | null }
) {
  let query = client
    .from("productionQuantity")
    .select(productionPayApprovalSelect, { count: "exact" })
    .eq("companyId", companyId)
    .eq("type", "Production");

  query = applyProductionPayApprovalScope(query, scope);

  if (args?.search) {
    const term = args.search.trim();
    if (term) {
      const { data: employees, error: searchError } =
        await getEmployeeIdsMatchingSearch(client, companyId, term);

      if (searchError) {
        return { data: null, error: searchError, count: null, status: 0, statusText: "" };
      }

      const employeeIds = employees?.map((row) => row.id) ?? [];
      if (employeeIds.length === 0) {
        return { data: [], error: null, count: 0, status: 200, statusText: "OK" };
      }

      query = query.in("employeeId", employeeIds);
    }
  }

  if (args) {
    const dbFilters = args.filters?.filter(
      (f) => f.column !== "approvalStatus"
    );
    query = setGenericQueryFilters(
      query,
      { ...args, filters: dbFilters },
      [{ column: "createdAt", ascending: false }]
    );
  } else {
    query = query.order("createdAt", { ascending: false });
  }

  return query;
}

function mapScopeToApprovalRequestStatuses(
  scope: ProductionPayApprovalScope
): ProductionPayApprovalRequestStatus[] | null {
  if (scope.mode === "all") {
    return ["Pending", "Approved", "Rejected"];
  }
  if (scope.mode === "single") {
    switch (scope.status) {
      case "pending":
        return ["Pending"];
      case "approved":
        return ["Approved"];
      case "rejected":
        return ["Rejected"];
    }
  }
  const statuses: ProductionPayApprovalRequestStatus[] = [];
  if (scope.statuses.includes("pending")) statuses.push("Pending");
  if (scope.statuses.includes("approved")) statuses.push("Approved");
  if (scope.statuses.includes("rejected")) statuses.push("Rejected");
  return statuses.length > 0 ? statuses : null;
}

export async function getProductionPayApprovalRequestRows(
  client: SupabaseClient<Database>,
  companyId: string,
  scope: ProductionPayApprovalScope,
  args?: GenericQueryFilters & { search: string | null },
  enrichmentClient?: SupabaseClient<Database>
) {
  const statuses = mapScopeToApprovalRequestStatuses(scope);

  let query = client
    .from("approvalRequest")
    .select("*", { count: "exact" })
    .eq("companyId", companyId)
    .eq("documentType", "productionQuantityReport");

  if (statuses) {
    query = query.in("status", statuses);
  }

  let filteredDocumentIds: string[] | null = null;

  const filterEmployeeIds = getEmployeeIdsFromFilters(args?.filters);
  if (filterEmployeeIds) {
    const reportsForEmployees = await getProductionQuantityReportIdsForEmployees(
      client,
      companyId,
      filterEmployeeIds
    );
    if (reportsForEmployees.error) {
      return {
        data: null,
        error: reportsForEmployees.error,
        count: null,
        status: 0,
        statusText: ""
      };
    }
    filteredDocumentIds = reportsForEmployees.data;
    if (filteredDocumentIds.length === 0) {
      return { data: [], error: null, count: 0, status: 200, statusText: "OK" };
    }
  }

  if (args?.search) {
    const term = args.search.trim();
    if (term) {
      const { data: employees, error: searchError } =
        await getEmployeeIdsMatchingSearch(client, companyId, term);
      if (searchError) {
        return {
          data: null,
          error: searchError,
          count: null,
          status: 0,
          statusText: ""
        };
      }
      const employeeIds = employees?.map((row) => row.id) ?? [];
      if (employeeIds.length === 0) {
        return { data: [], error: null, count: 0, status: 200, statusText: "OK" };
      }
      const reportsForSearch = await getProductionQuantityReportIdsForEmployees(
        client,
        companyId,
        employeeIds
      );
      if (reportsForSearch.error) {
        return {
          data: null,
          error: reportsForSearch.error,
          count: null,
          status: 0,
          statusText: ""
        };
      }
      const searchReportIds = reportsForSearch.data;
      if (searchReportIds.length === 0) {
        return { data: [], error: null, count: 0, status: 200, statusText: "OK" };
      }
      filteredDocumentIds =
        filteredDocumentIds === null
          ? searchReportIds
          : filteredDocumentIds.filter((id) => searchReportIds.includes(id));
      if (filteredDocumentIds.length === 0) {
        return { data: [], error: null, count: 0, status: 200, statusText: "OK" };
      }
    }
  }

  if (filteredDocumentIds) {
    query = query.in("documentId", filteredDocumentIds);
  }

  const dbFilters = args?.filters?.filter(
    (f) => f.column !== "approvalStatus" && f.column !== "employeeId"
  );
  if (args) {
    query = setGenericQueryFilters(
      query,
      { ...args, filters: dbFilters },
      [{ column: "requestedAt", ascending: false }]
    );
  } else {
    query = query.order("requestedAt", { ascending: false });
  }

  const requests = await query;
  if (requests.error) {
    return requests;
  }

  const list = requests.data ?? [];
  if (list.length === 0) {
    return {
      data: [],
      error: null,
      count: requests.count ?? 0,
      status: requests.status,
      statusText: requests.statusText
    };
  }

  const reportIds = list.map((r) => r.documentId);
  // Enrich with service role when provided: productionQuantity RLS (employee_role) can
  // block managers from loading line details even when approval requests are visible.
  const linesClient = enrichmentClient ?? client;
  const { data: lines, error: linesError } = await linesClient
    .from("productionQuantity")
    .select(productionPayApprovalSelect)
    .in("reportId", reportIds)
    .eq("companyId", companyId)
    .eq("type", "Production")
    .is("invalidatedAt", null);

  if (linesError) {
    return {
      data: null,
      error: linesError,
      count: null,
      status: 0,
      statusText: ""
    };
  }

  const linesByReport = new Map<string, NonNullable<typeof lines>>();
  for (const line of lines ?? []) {
    if (!line.reportId) continue;
    const bucket = linesByReport.get(line.reportId) ?? [];
    bucket.push(line);
    linesByReport.set(line.reportId, bucket);
  }

  const missingReportIds = reportIds.filter((id) => !linesByReport.has(id));
  const reportFallbackById = new Map<
    string,
    {
      employeeId: string | null;
      quantity: number;
      employee: ProductionPayApprovalRequestRow["employee"];
      jobOperation: unknown;
    }
  >();

  if (missingReportIds.length > 0) {
    const { data: reports, error: reportsError } = await linesClient
      .from("productionQuantityReport")
      .select(productionPayApprovalReportSelect)
      .in("id", missingReportIds)
      .eq("companyId", companyId);

    if (reportsError) {
      return {
        data: null,
        error: reportsError,
        count: null,
        status: 0,
        statusText: ""
      };
    }

    for (const report of reports ?? []) {
      reportFallbackById.set(report.id, {
        employeeId: report.employeeId,
        quantity: report.originalQuantity ?? 0,
        employee: report.employee,
        jobOperation: report.jobOperation
      });
    }
  }

  const rows: ProductionPayApprovalRequestRow[] = [];
  for (const req of list) {
    const reportLines = linesByReport.get(req.documentId) ?? [];
    const fallback = reportFallbackById.get(req.documentId);
    const primary = reportLines[0];
    const totalQty =
      reportLines.length > 0
        ? reportLines.reduce((sum, l) => sum + (l.quantity ?? 0), 0)
        : (fallback?.quantity ?? 0);
    const paymentYear = primary?.paymentYear ?? null;
    const paymentMonth = primary?.paymentMonth ?? null;

    rows.push({
      approvalRequestId: req.id,
      reportId: req.documentId,
      approvalStatus: req.status as ProductionPayApprovalRequestStatus,
      amount: req.amount ?? null,
      requestedBy: req.requestedBy ?? null,
      id: req.id,
      quantity: totalQty,
      createdAt: req.requestedAt ?? primary?.createdAt ?? null,
      employeeId: primary?.employeeId ?? fallback?.employeeId ?? null,
      paymentYear,
      paymentMonth,
      invalidatedAt: primary?.invalidatedAt ?? null,
      employee: primary?.employee ?? fallback?.employee ?? null,
      jobOperation: primary?.jobOperation ?? fallback?.jobOperation
    });
  }

  return {
    data: rows,
    error: null,
    count: requests.count,
    status: requests.status,
    statusText: requests.statusText
  };
}

export async function computeProductionQuantityReportEarnedAmount(
  client: SupabaseClient<Database>,
  reportId: string,
  companyId: string
): Promise<number> {
  const { data: lines, error } = await client
    .from("productionQuantity")
    .select(
      `quantity, jobOperation!inner(insideUnitCost)`,
    )
    .eq("reportId", reportId)
    .eq("companyId", companyId)
    .is("invalidatedAt", null);

  if (error || !lines) return 0;

  return lines.reduce((sum, line) => {
    const jo = line.jobOperation as { insideUnitCost?: number | null } | null;
    const unitCost = jo?.insideUnitCost ?? 0;
    return sum + (line.quantity ?? 0) * unitCost;
  }, 0);
}

export async function rejectProductionQuantity(
  client: SupabaseClient<Database>,
  productionQuantityId: string,
  updatedBy: string
) {
  const now = new Date().toISOString();
  return client
    .from("productionQuantity")
    .update({
      invalidatedAt: now,
      invalidatedBy: updatedBy,
      updatedBy,
      updatedAt: now
    })
    .eq("id", productionQuantityId)
    .is("paymentYear", null)
    .is("invalidatedAt", null)
    .select("id")
    .single();
}

export async function approveProductionQuantity(
  client: SupabaseClient<Database>,
  productionQuantityId: string,
  year: number,
  month: number,
  updatedBy: string
) {
  return client
    .from("productionQuantity")
    .update({
      paymentYear: year,
      paymentMonth: month,
      updatedBy,
      updatedAt: new Date().toISOString()
    })
    .eq("id", productionQuantityId)
    .select("id")
    .single();
}

export async function getEmployeeSalaryPayments(
  client: SupabaseClient<Database>,
  salaryRecordId: string
) {
  return client
    .from("employeeSalaryPayment")
    .select("*, paidByUser:user!paidBy(firstName, lastName, fullName)")
    .eq("salaryRecordId", salaryRecordId)
    .order("paidAt", { ascending: false });
}

export async function getCompanySalaryPayments(
  client: SupabaseClient<Database>,
  companyId: string,
  year: number,
  month: number,
  args?: GenericQueryFilters & { search: string | null }
) {
  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const monthEnd = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;

  let query = client
    .from("employeeSalaryPayment")
    .select(
      `id, amount, paidAt, notes, salaryRecordId,
       paidByUser:user!paidBy(firstName, lastName, fullName),
       salaryRecord:employeeSalaryRecords!inner(
         employeeId, employeeName, firstName, lastName, avatarUrl, year, month
       )`,
      { count: "exact" }
    )
    .eq("companyId", companyId)
    .gte("paidAt", monthStart)
    .lt("paidAt", monthEnd);

  if (args?.search) {
    query = query.ilike("salaryRecord.employeeName", `%${args.search}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, [
      { column: "paidAt", ascending: false }
    ]);
  } else {
    query = query.order("paidAt", { ascending: false });
  }

  return query;
}

export async function getSalaryReadyToPay(
  client: SupabaseClient<Database>,
  companyId: string,
  year: number,
  month: number,
  args?: GenericQueryFilters & { search: string | null }
) {
  let query = client
    .from("employeeSalaryRecords")
    .select("*", { count: "exact" })
    .eq("companyId", companyId)
    .eq("year", year)
    .eq("month", month)
    .gt("amountOwed", 0);

  if (args?.search) {
    query = query.ilike("employeeName", `%${args.search}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, [
      { column: "employeeName", ascending: true }
    ]);
  } else {
    query = query.order("employeeName", { ascending: true });
  }

  return query;
}


export async function recordSalaryPayment(
  client: SupabaseClient<Database>,
  data: z.infer<typeof salaryPaymentValidator> & { companyId: string; paidBy: string }
) {
  return client
    .from("employeeSalaryPayment")
    .insert({
      salaryRecordId: data.salaryRecordId,
      companyId: data.companyId,
      amount: data.amount,
      paidAt: data.paidAt,
      paidBy: data.paidBy,
      notes: data.notes ?? null
    })
    .select("id")
    .single();
}

export async function getEmployeeSalaryHistory(
  client: SupabaseClient<Database>,
  employeeId: string,
  companyId: string
) {
  return client
    .from("employeeSalaryRecords")
    .select("*")
    .eq("employeeId", employeeId)
    .eq("companyId", companyId)
    .order("year", { ascending: false })
    .order("month", { ascending: false })
    .limit(24);
}

// Job Assignment Rules functions have moved to ./people.jobAssignmentRules.service.ts
// (re-exported via ./index.ts).
//
// TODO: split the remaining salary and production-pay approval helpers into
// people.salary.service.ts and people.approvals.service.ts respectively.
