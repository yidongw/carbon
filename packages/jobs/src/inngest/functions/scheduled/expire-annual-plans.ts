import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { inngest } from "../../client";

// One-time annual plans (paymentMode='one_time') stay Active until termEndsAt.
// Once the term passes, mark the plan Inactive so gating/banners can react and
// the customer is prompted to renew.
export const expireAnnualPlansFunction = inngest.createFunction(
  { id: "expire-annual-plans", retries: 2 },
  { cron: "0 3 * * *" }, // daily at 03:00 UTC
  async ({ step }) => {
    const serviceRole = getCarbonServiceRole();

    await step.run("mark-expired-one-time-plans-inactive", async () => {
      const now = new Date().toISOString();

      const expired = await serviceRole
        .from("companyPlan")
        .select("id")
        .eq("paymentMode", "one_time")
        .neq("stripeSubscriptionStatus", "Inactive")
        .not("termEndsAt", "is", null)
        .lt("termEndsAt", now);

      if (expired.error) {
        console.error(
          `Error fetching expired annual plans: ${JSON.stringify(expired.error)}`
        );
        return;
      }

      if (!expired.data?.length) {
        console.log("No expired annual plans to deactivate");
        return;
      }

      const ids = expired.data.map((p) => p.id);
      const { error } = await serviceRole
        .from("companyPlan")
        .update({ stripeSubscriptionStatus: "Inactive" })
        .in("id", ids);

      if (error) {
        console.error(
          `Failed to deactivate expired annual plans: ${JSON.stringify(error)}`
        );
        return;
      }

      console.log(`Deactivated ${ids.length} expired annual plan(s)`);
    });
  }
);
