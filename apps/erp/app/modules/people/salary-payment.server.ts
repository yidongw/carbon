import { error, success } from "@carbon/auth";
import { flash } from "@carbon/auth/session.server";
import type { Database } from "@carbon/database";
import { validationError, validator } from "@carbon/form";
import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "react-router";
import { path } from "~/utils/path";
import { salaryPaymentValidator } from "./people.models";
import {
  getAmountOwed,
  getSalaryRecordBalances,
  recordSalaryPayment
} from "./people.service";

export type RecordSalaryPaymentResult = { ok: true } | { error: string };

export async function processRecordSalaryPayment(
  client: SupabaseClient<Database>,
  companyId: string,
  paidBy: string,
  formData: FormData
): Promise<RecordSalaryPaymentResult | ReturnType<typeof validationError>> {
  const validation = await validator(salaryPaymentValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error, validation.submittedData);
  }

  const record = await getSalaryRecordBalances(
    client,
    validation.data.salaryRecordId,
    companyId
  );

  if (record.error || !record.data) {
    return { error: "Salary record not found" };
  }

  const amountOwed = getAmountOwed(record.data);
  if (amountOwed <= 0) {
    return { error: "Nothing outstanding to pay" };
  }

  if (validation.data.amount > amountOwed) {
    return validationError(
      {
        fieldErrors: {
          amount: `Amount cannot exceed outstanding balance (${amountOwed})`
        },
        formId: validation.formId
      },
      validation.submittedData
    );
  }

  const result = await recordSalaryPayment(client, {
    ...validation.data,
    companyId,
    paidBy
  });

  if (result.error) {
    return { error: result.error.message };
  }

  return { ok: true };
}

/** Document navigation: redirect back with flash on success or business error. */
export async function handleRecordSalaryPaymentAction(
  request: Request,
  client: SupabaseClient<Database>,
  companyId: string,
  paidBy: string,
  formData: FormData
) {
  const returnTo =
    (formData.get("returnTo") as string | null) ?? path.to.accountingSalary;
  const result = await processRecordSalaryPayment(
    client,
    companyId,
    paidBy,
    formData
  );

  if ("ok" in result && result.ok) {
    throw redirect(
      returnTo,
      await flash(request, success("Payment recorded successfully"))
    );
  }

  if ("error" in result && result.error) {
    throw redirect(
      returnTo,
      await flash(request, error(null, result.error))
    );
  }

  return result;
}
