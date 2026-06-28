import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { inngest } from "../../client";

// Demo companies are accessible until "demoExpiresAt" (creation + 30 days). They are kept
// for another 30 days after that (so an extension or upgrade can revive them) and then
// permanently deleted. Deleting the "company" row cascades to all of its data via FKs.
const DELETE_AFTER_EXPIRY_DAYS = 30;

export const demoCleanupFunction = inngest.createFunction(
  { id: "demo-cleanup", retries: 2 },
  { cron: "0 2 * * *" }, // daily at 02:00 UTC
  async ({ step }) => {
    const serviceRole = getCarbonServiceRole();

    await step.run("delete-stale-demo-companies", async () => {
      const deleteCutoff = new Date(
        Date.now() - DELETE_AFTER_EXPIRY_DAYS * 24 * 60 * 60 * 1000
      ).toISOString();

      const stale = await serviceRole
        .from("company")
        .select("id, name")
        .eq("isDemo", true)
        .not("demoExpiresAt", "is", null)
        .lt("demoExpiresAt", deleteCutoff);

      if (stale.error) {
        console.error(
          `Error fetching stale demo companies: ${JSON.stringify(stale.error)}`
        );
        return;
      }

      if (!stale.data?.length) {
        console.log("No stale demo companies to delete");
        return;
      }

      console.log(`Deleting ${stale.data.length} stale demo companies`);
      for (const company of stale.data) {
        // Cascades to all company data via FKs (same as deleteSubsidiary).
        const { error } = await serviceRole
          .from("company")
          .delete()
          .eq("id", company.id);
        if (error) {
          console.error(
            `Failed to delete demo company ${company.name} (${company.id}): ${JSON.stringify(error)}`
          );
        }
      }
    });
  }
);
