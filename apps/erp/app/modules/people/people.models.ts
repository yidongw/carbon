import { z } from "zod";
import { zfd } from "zod-form-data";
import { DataType } from "~/modules/shared";
import { optionalRequiredStringArray } from "~/utils/zodFields";

export const attributeValidator = z
  .object({
    id: zfd.text(z.string().optional()),
    name: z.string().min(1, { message: "Name is required" }),
    userAttributeCategoryId: z.string().min(20),
    attributeDataTypeId: zfd.numeric(),
    listOptions: optionalRequiredStringArray,
    canSelfManage: zfd.checkbox()
  })
  .refine(
    (input) => {
      // allows bar to be optional only when foo is 'foo'
      if (
        input.attributeDataTypeId === DataType.List &&
        (input.listOptions === undefined ||
          input.listOptions.length === 0 ||
          input.listOptions.some((option) => option.length === 0))
      )
        return false;

      return true;
    },
    { message: "List options are required", path: ["listOptions"] }
  );

export const attributeCategoryValidator = z.object({
  id: zfd.text(z.string().optional()),
  name: z.string().min(1, { message: "Name is required" }),
  emoji: zfd.text(z.string().optional()),
  isPublic: zfd.checkbox()
});

export const departmentValidator = z.object({
  id: zfd.text(z.string().optional()),
  name: z.string().min(1, { message: "Name is required" }),
  parentDepartmentId: zfd.text(z.string().optional())
});

export const employeeJobValidator = z.object({
  title: zfd.text(z.string().optional()),
  startDate: zfd.text(z.string().optional()),
  locationId: zfd.text(z.string().optional()),
  shiftId: zfd.text(z.string().optional()),
  managerId: zfd.text(z.string().optional()),
  departmentId: zfd.text(z.string().optional())
});

export const holidayValidator = z.object({
  id: zfd.text(z.string().optional()),
  name: z.string().min(1, { message: "Name is required" }),
  date: z.string().min(1, { message: "Date is required" })
});

export const shiftValidator = z.object({
  id: zfd.text(z.string().optional()),
  name: z.string().min(1, { message: "Name is required" }),
  startTime: z.string().min(1, { message: "Start time is required" }),
  endTime: z.string().min(1, { message: "End time is required" }),
  locationId: z.string().min(1, { message: "Location is required" }),
  monday: zfd.checkbox(),
  tuesday: zfd.checkbox(),
  wednesday: zfd.checkbox(),
  thursday: zfd.checkbox(),
  friday: zfd.checkbox(),
  saturday: zfd.checkbox(),
  sunday: zfd.checkbox()
});

export const clockInValidator = z.object({
  intent: z.literal("clockIn"),
  employeeId: zfd.text(z.string().optional())
});

export const clockOutValidator = z.object({
  intent: z.literal("clockOut"),
  employeeId: zfd.text(z.string().optional()),
  note: zfd.text(z.string().optional())
});

export const timecardValidator = z.object({
  id: zfd.text(z.string().optional()),
  employeeId: z.string().min(1, { message: "Employee is required" }),
  clockIn: z.string().min(1, { message: "Clock in is required" }),
  clockOut: zfd.text(z.string().optional()),
  note: zfd.text(z.string().optional())
});

export const updateTimeCardEntryValidator = z.object({
  intent: z.literal("updateEntry"),
  entryId: z.string().min(1),
  clockIn: z.string().min(1),
  clockOut: zfd.text(z.string().optional()),
  note: zfd.text(z.string().optional())
});

export const deleteTimeCardEntryValidator = z.object({
  intent: z.literal("deleteEntry"),
  entryId: z.string().min(1)
});

// ─── Salary ────────────────────────────────────────────────────────────────

export const salaryPaymentValidator = z.object({
  salaryRecordId: z.string().min(1, { message: "Salary record is required" }),
  amount: zfd.numeric(
    z.number().positive({ message: "Amount must be greater than 0" })
  ),
  paidAt: z.string().min(1, { message: "Payment date is required" }),
  notes: zfd.text(z.string().optional())
});

// ─── Job Assignment Rules ──────────────────────────────────────────────────

export const JOB_RULE_FIELDS = [
  { value: "customerId", label: "Customer" },
  { value: "processId", label: "Process" },
  { value: "workCenterId", label: "Work Center" },
  { value: "locationId", label: "Location" },
  { value: "tags", label: "Tags" }
] as const;

export const JOB_RULE_OPERATORS = [
  { value: "eq", label: "equals" },
  { value: "neq", label: "not equals" },
  { value: "in", label: "is one of" },
  { value: "contains", label: "contains" }
] as const;

const jobRuleField = z.enum(
  JOB_RULE_FIELDS.map((f) => f.value) as [
    (typeof JOB_RULE_FIELDS)[number]["value"],
    ...(typeof JOB_RULE_FIELDS)[number]["value"][]
  ]
);
const jobRuleOperator = z.enum(
  JOB_RULE_OPERATORS.map((o) => o.value) as [
    (typeof JOB_RULE_OPERATORS)[number]["value"],
    ...(typeof JOB_RULE_OPERATORS)[number]["value"][]
  ]
);

export const jobAssignmentRuleConditionValidator = z.object({
  field: jobRuleField,
  operator: jobRuleOperator,
  value: z.union([z.string(), z.array(z.string())])
});

const jobAssignmentRuleConditionsValidator = z
  .string()
  .transform((s, ctx) => {
    try {
      return JSON.parse(s);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Conditions must be valid JSON"
      });
      return z.NEVER;
    }
  })
  .pipe(z.array(jobAssignmentRuleConditionValidator));

export const jobAssignmentRuleValidator = z.object({
  id: zfd.text(z.string().optional()),
  name: z.string().min(1, { message: "Name is required" }),
  description: zfd.text(z.string().optional()),
  conditions: jobAssignmentRuleConditionsValidator,
  targetGroupId: z.string().min(1, { message: "Target group is required" }),
  priority: zfd.numeric(z.number().int().min(0).default(0)),
  active: zfd.checkbox()
});

export type ProductionPayApprovalStatus = "pending" | "approved" | "rejected";

export type ProductionPayApprovalScope =
  | { mode: "all" }
  | { mode: "single"; status: ProductionPayApprovalStatus }
  | { mode: "multiple"; statuses: ProductionPayApprovalStatus[] };

export type ProductionPayApprovalRequestStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Cancelled";

export type ProductionPayApprovalRequestRow = {
  approvalRequestId: string;
  reportId: string;
  approvalStatus: ProductionPayApprovalRequestStatus;
  amount: number | null;
  requestedBy: string | null;
  id: string;
  quantity: number;
  createdAt: string | null;
  employeeId: string | null;
  paymentYear: number | null;
  paymentMonth: number | null;
  invalidatedAt: string | null;
  employee?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    fullName: string | null;
    avatarUrl: string | null;
  } | null;
  jobOperation?: unknown;
};
