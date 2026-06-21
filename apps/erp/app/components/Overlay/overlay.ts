import type { ConfigTableReferenceContext } from "~/modules/production/configParamsTableColumns";
import { path } from "~/utils/path";
import type { OverlayId } from "./overlay.registry";

export type OverlayTarget = {
  id: OverlayId;
  url: string;
};

export const overlay = {
  to: {
    newJobPickup(
      jobId: string,
      opts?: { jobOperationId?: string }
    ): OverlayTarget {
      const base = path.to.newJobPickup(jobId, opts);
      const sep = base.includes("?") ? "&" : "?";
      return {
        id: "newJobPickup",
        url: `${base}${sep}overlay=true`
      };
    },

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
      opts?: {
        configuration?: unknown;
        referenceContext?: ConfigTableReferenceContext;
      }
    ): OverlayTarget {
      const base = path.to.api.itemConfigTable(itemId);
      if (
        opts?.configuration === undefined &&
        opts?.referenceContext === undefined
      ) {
        return { id: "itemConfigTable", url: base };
      }
      const params = new URLSearchParams();
      if (opts?.configuration !== undefined) {
        params.set("configuration", JSON.stringify(opts.configuration));
      }
      if (opts?.referenceContext !== undefined) {
        const refContextJson = JSON.stringify(opts.referenceContext);
        console.log('[OVERLAY URL] referenceContext being serialized:', {
          hasEmployeeId: !!opts.referenceContext.employeeId,
          employeeId: opts.referenceContext.employeeId,
          hasPickupsByEmployee: !!opts.referenceContext.pickupsByEmployee,
          pickupsCount: opts.referenceContext.pickupsByEmployee ? Object.keys(opts.referenceContext.pickupsByEmployee).length : 0,
          jsonLength: refContextJson.length
        });
        params.set("referenceContext", refContextJson);
      }
      return {
        id: "itemConfigTable",
        url: `${base}?${params.toString()}`
      };
    }
  }
};
