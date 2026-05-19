import { path } from "~/utils/path";
import type { OverlayId } from "./overlay.registry";

export type OverlayTarget = {
  id: OverlayId;
  url: string;
};

export const overlay = {
  to: {
    newJobProductionQuantity(
      jobId: string,
      opts?: { jobOperationId?: string }
    ): OverlayTarget {
      const base = path.to.newJobProductionQuantity(jobId, opts);
      const sep = base.includes("?") ? "&" : "?";
      return {
        id: "newJobProductionQuantity",
        url: `${base}${sep}overlay=true`
      };
    },

    editJobProductionQuantity(
      jobId: string,
      quantityId: string
    ): OverlayTarget {
      return {
        id: "editJobProductionQuantity",
        url: `${path.to.jobProductionQuantity(jobId, quantityId)}?overlay=true`
      };
    },

    jobBillOfProcessPreview(jobId: string): OverlayTarget {
      return {
        id: "jobBillOfProcessPreview",
        url: path.to.api.jobBillOfProcessPreview(jobId)
      };
    },

    jobConfigTable(jobId: string): OverlayTarget {
      return {
        id: "jobConfigTable",
        url: path.to.api.jobConfigTable(jobId)
      };
    },

    itemConfigTable(
      itemId: string,
      opts?: { configuration?: unknown }
    ): OverlayTarget {
      const base = path.to.api.itemConfigTable(itemId);
      if (opts?.configuration === undefined) {
        return { id: "itemConfigTable", url: base };
      }
      const params = new URLSearchParams({
        configuration: JSON.stringify(opts.configuration)
      });
      return {
        id: "itemConfigTable",
        url: `${base}?${params.toString()}`
      };
    }
  }
};
