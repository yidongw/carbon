import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { inngest } from "../../client";

/**
 * Post-release pipeline: material requirements, MRP, then initial scheduling.
 * Runs in Inngest so the ERP release action can return immediately.
 *
 * Each step logs start/finish/error so failures are visible in the Inngest
 * dashboard and server logs even though the user only sees the synchronous
 * "released" toast. Errors are rethrown so Inngest retries the step.
 */
export const releaseJobFunction = inngest.createFunction(
  { id: "release-job", retries: 3 },
  { event: "carbon/release-job" },
  async ({ event, step }) => {
    const { jobId, companyId, userId, direction = "backward" } = event.data;
    const serviceRole = getCarbonServiceRole();
    const tag = `release-job ${jobId} (company=${companyId})`;

    await step.run("recalculate-requirements", async () => {
      console.info(`${tag}: recalculating job requirements`);
      try {
        const { error } = await serviceRole.functions.invoke("recalculate", {
          body: {
            type: "jobRequirements",
            id: jobId,
            companyId,
            userId
          }
        });
        if (error) {
          throw new Error(
            error.message ?? "Failed to recalculate job requirements"
          );
        }
        console.info(`${tag}: recalculate-requirements done`);
      } catch (error) {
        console.error(
          `${tag}: recalculate-requirements failed: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        throw error;
      }
    });

    await step.run("mrp", async () => {
      console.info(`${tag}: running MRP`);
      try {
        const { error } = await serviceRole.functions.invoke("mrp", {
          body: {
            type: "job",
            id: jobId,
            companyId,
            userId
          }
        });
        if (error) {
          throw new Error(error.message ?? "Failed to run MRP for job");
        }
        console.info(`${tag}: mrp done`);
      } catch (error) {
        console.error(
          `${tag}: mrp failed: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        throw error;
      }
    });

    await step.run("schedule", async () => {
      console.info(`${tag}: scheduling (direction=${direction})`);
      try {
        const { error } = await serviceRole.functions.invoke("schedule", {
          body: {
            jobId,
            companyId,
            userId,
            mode: "initial",
            direction
          }
        });
        if (error) {
          throw new Error(error.message ?? "Failed to schedule job");
        }
        console.info(`${tag}: schedule done`);
      } catch (error) {
        console.error(
          `${tag}: schedule failed: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
        throw error;
      }
    });

    return { success: true };
  }
);
