import type { ConfigTableReferenceContext } from "~/modules/production/configParamsTableColumns";
import { path } from "~/utils/path";
import type { OverlayId } from "./overlay.registry";

export type OverlayTarget = {
  id: OverlayId;
  url: string;
};

/**
 * Helper to add overlay parameter to URL
 */
function addOverlayParam(url: string, overlayId: OverlayId): string {
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}overlay=${overlayId}`;
}

export const overlay = {
  to: {
    newJobPickup(
      jobId: string,
      opts?: { jobOperationId?: string }
    ): OverlayTarget {
      const base = path.to.newJobPickup(jobId, opts);
      return {
        id: "newJobPickup",
        url: addOverlayParam(base, "newJobPickup")
      };
    },

    newJobProductionQuantity(
      jobId: string,
      opts?: { jobOperationId?: string }
    ): OverlayTarget {
      const base = path.to.newJobProductionQuantity(jobId, opts);
      return {
        id: "newJobProductionQuantity",
        url: addOverlayParam(base, "newJobProductionQuantity")
      };
    },

    editJobProductionQuantity(
      jobId: string,
      quantityId: string
    ): OverlayTarget {
      const base = path.to.jobProductionQuantity(jobId, quantityId);
      return {
        id: "editJobProductionQuantity",
        url: addOverlayParam(base, "editJobProductionQuantity")
      };
    },

    jobBillOfProcessPreview(jobId: string): OverlayTarget {
      const base = path.to.api.jobBillOfProcessPreview(jobId);
      return {
        id: "jobBillOfProcessPreview",
        url: addOverlayParam(base, "jobBillOfProcessPreview")
      };
    },

    jobConfigTable(jobId: string): OverlayTarget {
      const base = path.to.api.jobConfigTable(jobId);
      return {
        id: "jobConfigTable",
        url: addOverlayParam(base, "jobConfigTable")
      };
    },

    itemConfigTable(
      itemId: string,
      opts?: {
        configuration?: unknown;
        referenceContext?: ConfigTableReferenceContext;
      }
    ): OverlayTarget {
      const base = path.to.api.itemConfigTable(itemId);
      let url = base;

      if (
        opts?.configuration !== undefined ||
        opts?.referenceContext !== undefined
      ) {
        const params = new URLSearchParams();
        if (opts?.configuration !== undefined) {
          params.set("configuration", JSON.stringify(opts.configuration));
        }
        if (opts?.referenceContext !== undefined) {
          params.set("referenceContext", JSON.stringify(opts.referenceContext));
        }
        url = `${base}?${params.toString()}`;
      }

      return {
        id: "itemConfigTable",
        url: addOverlayParam(url, "itemConfigTable")
      };
    }
  }
};
