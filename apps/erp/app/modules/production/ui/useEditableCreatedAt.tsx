import { useCarbon } from "@carbon/auth";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { useCallback } from "react";
import { usePermissions, useUser } from "~/hooks";

type CreatedAtRow = { id: string };

type ProductionQuantityLineRow = CreatedAtRow & {
  actorKind?: "employee" | "supplier";
};

type ProductionQuantityReportRow = CreatedAtRow & {
  reportId: string;
  approvalRequestId?: string;
};

function useCreatedAtMutationContext() {
  const { carbon } = useCarbon();
  const { id: userId, company } = useUser();

  return {
    carbon,
    userId,
    companyId: company.id
  };
}

export function usePickupCreatedAtSave() {
  const permissions = usePermissions();
  const { carbon, userId, companyId } = useCreatedAtMutationContext();

  const saveCreatedAt = useCallback(
    async (_newValue: string, row: CreatedAtRow) => {
      if (!carbon) throw new Error("Carbon client not found");

      return carbon
        .from("jobOperationPickup")
        .update({
          createdAt: _newValue,
          updatedBy: userId,
          updatedAt: new Date().toISOString()
        })
        .eq("id", row.id)
        .eq("companyId", companyId);
    },
    [carbon, companyId, userId]
  );

  return {
    saveCreatedAt,
    canEdit: permissions.can("update", "production")
  };
}

export function useProductionQuantityLineCreatedAtSave() {
  const permissions = usePermissions();
  const { carbon, userId, companyId } = useCreatedAtMutationContext();

  const saveCreatedAt = useCallback(
    async (newValue: string, row: ProductionQuantityLineRow) => {
      if (!carbon) throw new Error("Carbon client not found");

      if (row.actorKind === "supplier") {
        return carbon
          .from("jobOperationSupplierQuantity")
          .update({ createdAt: newValue })
          .eq("id", row.id)
          .eq("companyId", companyId);
      }

      return carbon
        .from("productionQuantity")
        .update({
          createdAt: newValue,
          updatedBy: userId,
          updatedAt: new Date().toISOString()
        })
        .eq("id", row.id)
        .eq("companyId", companyId);
    },
    [carbon, companyId, userId]
  );

  return {
    saveCreatedAt,
    canEdit: permissions.can("update", "production")
  };
}

export function useProductionQuantityReportCreatedAtSave() {
  const permissions = usePermissions();
  const { carbon, userId, companyId } = useCreatedAtMutationContext();

  const saveCreatedAt = useCallback(
    async (
      newValue: string,
      row: ProductionQuantityReportRow
    ): Promise<PostgrestSingleResponse<unknown>> => {
      if (!carbon) throw new Error("Carbon client not found");

      const reportUpdate = await carbon
        .from("productionQuantityReport")
        .update({
          createdAt: newValue,
          updatedBy: userId,
          updatedAt: new Date().toISOString()
        })
        .eq("id", row.reportId)
        .eq("companyId", companyId);

      if (reportUpdate.error) return reportUpdate;

      const linesUpdate = await carbon
        .from("productionQuantity")
        .update({
          createdAt: newValue,
          updatedBy: userId,
          updatedAt: new Date().toISOString()
        })
        .eq("reportId", row.reportId)
        .eq("companyId", companyId);

      if (linesUpdate.error) return linesUpdate;

      if (row.approvalRequestId) {
        const approvalUpdate = await carbon
          .from("approvalRequest")
          .update({ requestedAt: newValue })
          .eq("id", row.approvalRequestId)
          .eq("companyId", companyId);

        if (approvalUpdate.error) return approvalUpdate;
      }

      return reportUpdate;
    },
    [carbon, companyId, userId]
  );

  return {
    saveCreatedAt,
    canEdit: permissions.can("update", "production")
  };
}
