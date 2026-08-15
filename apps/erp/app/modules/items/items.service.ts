import type { Database, Json } from "@carbon/database";
import { fetchAllFromTable } from "@carbon/database";
import type {
  ExpressionBuilder,
  Kysely,
  KyselyDatabase,
  KyselyTx
} from "@carbon/database/client";
import { styleReferenceRows } from "@carbon/database/style-reference";
import { getLocalTimeZone, now, today } from "@internationalized/date";
import type { SupabaseClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import type { z } from "zod";
import {
  getStyleVariantQuantityParameters,
  loadVariantCombos,
  SYSTEM_ATTRIBUTE
} from "~/modules/items/itemAttribute.service";
import type { GenericQueryFilters } from "~/utils/query";
import {
  ITEM_SEARCH_COLUMNS_WITH_SUPPLIER,
  setGenericQueryFilters,
  setSearchFilter
} from "~/utils/query";
import { sanitize } from "~/utils/supabase";
import type {
  operationParameterValidator,
  operationStepValidator,
  operationToolValidator
} from "../shared";
import {
  lookupBuyPriceFromMap,
  type MethodType,
  type PriceBreak,
  type SourcingType,
  type SupplierPriceMap
} from "../shared";
import {
  type configurationParameterGroupOrderValidator,
  type configurationParameterGroupValidator,
  type configurationParameterOrderValidator,
  type configurationParameterValidator,
  type configurationRuleValidator,
  type consumableValidator,
  type customerPartValidator,
  type getMethodValidator,
  ItemTrackingType,
  type itemCostValidator,
  type itemManufacturingValidator,
  type itemPlanningValidator,
  type itemPostingGroupValidator,
  type itemPurchasingValidator,
  type itemUnitSalePriceValidator,
  type itemValidator,
  type makeMethodVersionValidator,
  type materialDimensionValidator,
  type materialFinishValidator,
  type materialFormValidator,
  type materialGradeValidator,
  type materialSubstanceValidator,
  type materialTypeValidator,
  type materialValidator,
  type methodMaterialValidator,
  type methodOperationValidator,
  type partValidator,
  type pickMethodSortMethods,
  type pickMethodValidator,
  type serviceValidator,
  type shelfLifeModes,
  type shelfLifeTriggerTimings,
  type supplierPartValidator,
  type toolValidator,
  type unitOfMeasureValidator
} from "./items.models";
import type { styleValidator } from "./style.models";
import {
  ensureStyleMethodScaffold,
  isStyleCuttingOperationFirst,
  isStyleSystemOwnedOperation
} from "./styleMethod.service";
import {
  omitPlanningVariantMixCustomFields,
  type StyleVariantQuantity,
  scalePlanningQuantityFieldsForVariant
} from "./styleOrderLines";
import type { InventoryItemType } from "./types";

export async function activateMethodVersion(
  client: SupabaseClient<Database>,
  payload: {
    id: string;
    companyId: string;
    userId: string;
  }
) {
  return client.functions.invoke<{ convertedId: string }>("convert", {
    body: {
      type: "methodVersionToActive",
      ...payload
    }
  });
}

export async function copyItem(
  client: SupabaseClient<Database>,
  args: z.infer<typeof getMethodValidator> & {
    companyId: string;
    userId: string;
  }
) {
  return client.functions.invoke("get-method", {
    body: {
      type: "itemToItem",
      sourceId: args.sourceId,
      targetId: args.targetId,
      companyId: args.companyId,
      userId: args.userId,
      parts: {
        billOfMaterial: args.billOfMaterial,
        billOfProcess: args.billOfProcess,
        parameters: args.parameters,
        tools: args.tools,
        steps: args.steps,
        workInstructions: args.workInstructions
      }
    }
  });
}

export async function copyMakeMethod(
  client: SupabaseClient<Database>,
  args: z.infer<typeof getMethodValidator> & {
    companyId: string;
    userId: string;
  }
) {
  return client.functions.invoke("get-method", {
    body: {
      type: "makeMethodToMakeMethod",
      sourceId: args.sourceId,
      targetId: args.targetId,
      companyId: args.companyId,
      userId: args.userId,
      parts: {
        billOfMaterial: args.billOfMaterial,
        billOfProcess: args.billOfProcess,
        parameters: args.parameters,
        tools: args.tools,
        steps: args.steps,
        workInstructions: args.workInstructions
      }
    }
  });
}

export async function createRevision(
  client: SupabaseClient<Database>,
  args: {
    item: NonNullable<Awaited<ReturnType<typeof getItem>>["data"]>;
    revision: string;
    createdBy: string;
  }
) {
  const { item, revision, createdBy } = args;
  const itemInsert = await client
    .from("item")
    .insert({
      readableId: item.readableId,
      revision: revision,
      name: item.name,
      type: item.type,
      replenishmentSystem: item.replenishmentSystem,
      defaultMethodType: item.defaultMethodType,
      itemTrackingType: item.itemTrackingType,
      unitOfMeasureCode: item.unitOfMeasureCode,
      active: true,
      modelUploadId: item.modelUploadId,
      companyId: item.companyId,
      createdBy: createdBy
    })
    .select("id")
    .single();

  if (itemInsert.error) {
    return itemInsert;
  }

  if (item.replenishmentSystem !== "Buy") {
    await client.functions.invoke("get-method", {
      body: {
        type: "itemToItem",
        sourceId: item.id,
        targetId: itemInsert.data.id,
        companyId: item.companyId,
        userId: createdBy
      }
    });
  }

  return itemInsert;
}

export async function deleteConfigurationParameter(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("configurationParameter").delete().eq("id", id);
}

export async function deleteConfigurationRule(
  client: SupabaseClient<Database>,
  field: string,
  itemId: string
) {
  return client
    .from("configurationRule")
    .delete()
    .eq("field", field)
    .eq("itemId", itemId);
}

export async function deleteItemCustomerPart(
  client: SupabaseClient<Database>,
  id: string,
  companyId: string
) {
  return client
    .from("customerPartToItem")
    .delete()
    .eq("id", id)
    .eq("companyId", companyId);
}

export async function deleteConfigurationParameterGroup(
  client: SupabaseClient<Database>,
  id: string
) {
  // Get any parameters that belong to this group
  const { data: parameters } = await client
    .from("configurationParameter")
    .select("id")
    .eq("configurationParameterGroupId", id);

  if (parameters && parameters.length > 0) {
    // Get the ungrouped group
    const { data: ungrouped } = await client
      .from("configurationParameterGroup")
      .select("id")
      .eq("isUngrouped", true)
      .single();

    if (ungrouped) {
      // Update all parameters to use the ungrouped group
      await client
        .from("configurationParameter")
        .update({ configurationParameterGroupId: ungrouped.id })
        .eq("configurationParameterGroupId", id);
    }
  }
  return client.from("configurationParameterGroup").delete().eq("id", id);
}

export async function deleteItem(client: SupabaseClient<Database>, id: string) {
  return client.from("item").delete().eq("id", id);
}

export async function deleteItemPostingGroup(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("itemPostingGroup").delete().eq("id", id);
}

export async function deleteMaterialDimension(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("materialDimension").delete().eq("id", id);
}

export async function deleteMaterialFinish(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("materialFinish").delete().eq("id", id);
}

export async function deleteMaterialForm(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("materialForm").delete().eq("id", id);
}

export async function deleteMaterialGrade(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("materialGrade").delete().eq("id", id);
}

export async function deleteMaterialSubstance(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("materialSubstance").delete().eq("id", id);
}

export async function deleteMethodMaterial(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("methodMaterial").delete().eq("id", id);
}

export async function assertMethodOperationIsDraft(
  client: SupabaseClient<Database>,
  operationId: string
) {
  const result = await client
    .from("methodOperation")
    .select("makeMethodId, makeMethod!inner(status)")
    .eq("id", operationId)
    .single();

  if (result.error || !result.data) {
    throw new Error("Failed to find method operation");
  }

  const status = (result.data.makeMethod as { status: string }).status;
  if (status !== "Draft") {
    throw new Error(
      `Cannot modify steps on a method version with status "${status}". Only Draft versions can be modified.`
    );
  }
}

export async function deleteMethodOperation(
  client: SupabaseClient<Database>,
  methodOperationId: string
) {
  const operation = await client
    .from("methodOperation")
    .select("id, tags, customFields")
    .eq("id", methodOperationId)
    .single();

  if (operation.error) return operation;
  if (isStyleSystemOwnedOperation(operation.data)) {
    return {
      data: null,
      error: {
        message:
          "System-owned Style cutting operations cannot be deleted from the bill of process."
      }
    };
  }

  return client.from("methodOperation").delete().eq("id", methodOperationId);
}

export async function deleteMethodOperationStep(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("methodOperationStep").delete().eq("id", id);
}

export async function deleteMethodOperationParameter(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("methodOperationParameter").delete().eq("id", id);
}

export async function deleteMethodOperationTool(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("methodOperationTool").delete().eq("id", id);
}

export async function deleteUnitOfMeasure(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("unitOfMeasure").delete().eq("id", id);
}

export async function getConfigurationParameters(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
) {
  const item = await client
    .from("item")
    .select("type")
    .eq("id", itemId)
    .eq("companyId", companyId)
    .maybeSingle();

  // Any item that carries Color/Size variant attributes derives its list params
  // from those selections: Styles always do (garment set), and Consumables do
  // when assigned a Fabric/Trim color set. Styles never fall back to legacy
  // configurationParameter rows (dual-read retired); other types fall back only
  // when they have no attribute selections.
  try {
    const synthesized = await getStyleVariantQuantityParameters(
      client,
      itemId,
      companyId
    );
    if (synthesized.length > 0 || item.data?.type === "Style") {
      return { groups: [], parameters: synthesized };
    }
  } catch (error) {
    console.error(error);
    if (item.data?.type === "Style") {
      return { groups: [], parameters: [] };
    }
  }

  const [parameters, groups] = await Promise.all([
    // Order by sortOrder so the derived "primary" parameter (the first
    // list-typed param, used to build job/quote quantity columns) is
    // deterministic and follows the user-defined order rather than the
    // arbitrary order PostgREST returns without an explicit sort.
    client
      .from("configurationParameter")
      .select("*")
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .order("sortOrder", { ascending: true })
      .order("createdAt", { ascending: true }),
    client
      .from("configurationParameterGroup")
      .select("*")
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .order("sortOrder", { ascending: true })
  ]);

  if (parameters.error) {
    console.error(parameters.error);
    return { groups: [], parameters: [] };
  }

  if (groups.error) {
    console.error(groups.error);
    return { groups: [], parameters: [] };
  }

  return {
    groups: groups.data ?? [],
    parameters: parameters.data ?? []
  };
}

/**
 * Quantity-grid parameters only. Unlike getConfigurationParameters — which also
 * serves config *definitions* (the Part parameter editor, BOM/BOP formulas, and
 * the make-method configurator modal) — this drives ONLY the per-variant
 * quantity grid, which is attribute/combo-driven. Attribute items (Styles, and
 * Consumables with a variant set) get the synthetic single variant-combo param;
 * everything else (Parts/Templates) gets no params, so they never produce the
 * legacy Color×Size matrix grid.
 */
export async function getQuantityGridParameters(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
) {
  try {
    const synthesized = await getStyleVariantQuantityParameters(
      client,
      itemId,
      companyId
    );
    return { groups: [], parameters: synthesized };
  } catch (error) {
    console.error(error);
    return { groups: [], parameters: [] };
  }
}

export async function getConfigurationRules(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
) {
  const result = await client
    .from("configurationRule")
    .select("*")
    .eq("itemId", itemId)
    .eq("companyId", companyId);
  if (result.error) {
    console.error(result.error);
    return [];
  }
  return result.data ?? [];
}

export async function getConsumable(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
) {
  return client
    .rpc("get_consumable_details", {
      item_id: itemId
    })
    .single();
}

// Explicit consumables-view projection. The heavy per-row aggregates the list
// never selects are pruned: `supplierIds` (string_agg; the supplier `.contains`
// filter still works without selecting it), `externalId` (jsonb_object_agg),
// and `revisions` (json_agg; no revision switcher on Consumables). `attributes`
// is fetched per-page via itemAttributes and merged in (see attachItemAttributes).
const CONSUMABLE_LIST_COLUMNS =
  "active, assignee, defaultMethodType, description, itemTrackingType, name, replenishmentSystem, unitOfMeasureCode, notes, revision, readableId, readableIdWithRevision, id, companyId, thumbnailPath, modelUploadId, modelPath, modelName, modelSize, attributeSetId, unitOfMeasure, customFields, tags, itemPostingGroupId, createdBy, createdAt, updatedBy, updatedAt";

export async function getConsumables(
  client: SupabaseClient<Database>,
  companyId: string,
  args: GenericQueryFilters & {
    search: string | null;
    supplierId: string | null;
  }
) {
  let query = client
    .from("consumables")
    .select(CONSUMABLE_LIST_COLUMNS, {
      count: "estimated"
    })
    .eq("companyId", companyId);

  query = setSearchFilter(
    query,
    args.search,
    ITEM_SEARCH_COLUMNS_WITH_SUPPLIER
  );

  if (args.supplierId) {
    query = query.contains("supplierIds", [args.supplierId]);
  }

  const result = await setGenericQueryFilters(query, args, [
    { column: "readableIdWithRevision", ascending: true }
  ]);

  if (result.error || !result.data) return result;
  return {
    ...result,
    data: await attachItemAttributes(
      client as SupabaseClient<any>,
      companyId,
      result.data
    )
  };
}

export async function getConsumablesList(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return fetchAllFromTable<{
    id: string;
    name: string;
    readableIdWithRevision: string;
  }>(client, "item", "id, name, readableIdWithRevision", (query) =>
    query
      .eq("type", "Consumable")
      .eq("companyId", companyId)
      .eq("active", true)
      .order("name")
  );
}
export async function getItem(client: SupabaseClient<Database>, id: string) {
  return client.from("item").select("*").eq("id", id).single();
}

export async function getItemCost(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
) {
  return client
    .from("itemCost")
    .select("*, ...item(readableIdWithRevision)")
    .eq("itemId", itemId)
    .eq("companyId", companyId)
    .single();
}

export async function getItemCostHistory(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
) {
  const dateOneYearAgo = today(getLocalTimeZone())
    .subtract({ years: 1 })
    .toString();

  return client
    .from("costLedger")
    .select("*")
    .eq("itemId", itemId)
    .eq("companyId", companyId)
    .gte("postingDate", dateOneYearAgo)
    .order("postingDate", { ascending: false });
}

export async function getItemCustomerPart(
  client: SupabaseClient<Database>,
  id: string,
  companyId: string
) {
  return client
    .from("customerPartToItem")
    .select("*, customer(id, name)")
    .eq("id", id)
    .eq("companyId", companyId)
    .single();
}

export async function getItemCustomerParts(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
) {
  return client
    .from("customerPartToItem")
    .select("*, customer(id, name)")
    .eq("itemId", itemId)
    .eq("companyId", companyId);
}

export async function getItemDemand(
  client: SupabaseClient<Database>,
  {
    itemId,
    locationId,
    periods,
    companyId
  }: {
    itemId: string | string[];
    locationId: string;
    periods: string[];
    companyId: string;
  }
) {
  const itemIds = Array.isArray(itemId) ? itemId : [itemId];
  const [actuals, forecasts] = await Promise.all([
    client
      .from("demandActual")
      .select("*")
      .in("itemId", itemIds)
      .eq("locationId", locationId)
      .eq("companyId", companyId)
      .in("periodId", periods),
    client
      .from("demandForecast")
      .select("*")
      .in("itemId", itemIds)
      .eq("locationId", locationId)
      .eq("companyId", companyId)
      .in("periodId", periods)
      .order("periodId")
  ]);

  return {
    actuals: actuals.data ?? [],
    forecasts: forecasts.data ?? [],
    error: actuals.error ?? forecasts.error ?? null
  };
}

export type DemandForecastSourceRow = {
  itemId: string;
  locationId: string | null;
  periodId: string;
  sourceType: "Job Material" | "Sales Order" | "Demand Projection";
  quantity: number;
  jobId: string | null;
  salesOrderLineId: string | null;
  demandProjectionId: string | null;
  parentItemId: string;
  parentItem: { id: string; readableId: string; name: string } | null;
  job: {
    id: string;
    jobId: string;
    dueDate: string | null;
    status: string | null;
  } | null;
  salesOrderLine: {
    id: string;
    salesOrderId: string;
    promisedDate: string | null;
    salesOrder: { id: string; salesOrderId: string } | null;
  } | null;
  demandProjection: {
    id: string;
    forecastQuantity: number;
    forecastMethod: string | null;
    confidence: number | null;
    notes: string | null;
    createdBy: string;
    createdAt: string;
    period: { startDate: string } | null;
  } | null;
};

export async function getDemandForecastSources(
  client: SupabaseClient<Database>,
  {
    itemId,
    locationId,
    periods,
    companyId
  }: {
    itemId: string | string[];
    locationId: string;
    periods: string[];
    companyId: string;
  }
) {
  const itemIds = Array.isArray(itemId) ? itemId : [itemId];
  const result = await client
    .from("demandForecastSource")
    .select(
      `
        itemId,
        locationId,
        periodId,
        sourceType,
        quantity,
        jobId,
        salesOrderLineId,
        demandProjectionId,
        parentItemId,
        parentItem:item!demandForecastSource_parentItemId_fkey(id, readableId, name),
        job:job!demandForecastSource_jobId_fkey(id, jobId, dueDate, status),
        salesOrderLine:salesOrderLine!demandForecastSource_salesOrderLineId_fkey(
          id,
          salesOrderId,
          promisedDate,
          salesOrder:salesOrder(id, salesOrderId)
        ),
        demandProjection:demandProjection!demandForecastSource_demandProjectionId_fkey(
          id,
          forecastQuantity,
          forecastMethod,
          confidence,
          notes,
          period(startDate),
          createdBy,
          createdAt
        )
      `
    )
    .in("itemId", itemIds)
    .eq("locationId", locationId)
    .eq("companyId", companyId)
    .in("periodId", periods);

  return {
    data: result.data ?? [],
    error: result.error
  };
}

/** Parent item plus variant SKUs (parent-only when there are no children). */
export async function getVariantFamilyItemIds(
  client: SupabaseClient<Database>,
  parentItemId: string,
  companyId: string
): Promise<string[]> {
  const variants = await client
    .from("itemVariant")
    .select("variantItemId")
    .eq("parentItemId", parentItemId)
    .eq("companyId", companyId);
  if (variants.error || !variants.data?.length) {
    return [parentItemId];
  }
  const childIds = variants.data
    .map((row) => row.variantItemId)
    .filter((id): id is string => typeof id === "string" && id.length > 0);
  return childIds.length > 0 ? [parentItemId, ...childIds] : [parentItemId];
}

export async function getItemFiles(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
) {
  const result = await client.storage
    .from("private")
    .list(`${companyId}/parts/${itemId}`);
  return result.data || [];
}

export async function getItemPostingGroup(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("itemPostingGroup").select("*").eq("id", id).single();
}

export async function getItemPostingGroups(
  client: SupabaseClient<Database>,
  companyId: string,
  args?: GenericQueryFilters & { search: string | null }
) {
  let query = client
    .from("itemPostingGroup")
    .select("*", {
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

export async function getItemPostingGroupsList(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return client
    .from("itemPostingGroup")
    .select("id, name", { count: "exact" })
    .eq("companyId", companyId)
    .order("name");
}

export async function getItemManufacturing(
  client: SupabaseClient<Database>,
  id: string,
  companyId: string
) {
  return client
    .from("itemReplenishment")
    .select("*")
    .eq("itemId", id)
    .eq("companyId", companyId)
    .single();
}

export async function getItemPlanning(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string,
  locationId: string
) {
  return client
    .from("itemPlanning")
    .select("*")
    .eq("itemId", itemId)
    .eq("companyId", companyId)
    .eq("locationId", locationId)
    .maybeSingle();
}

export async function getItemQuantities(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string,
  locationId: string
) {
  // Parent rows in get_inventory_quantities already roll up child SKU qty when
  // variants exist; variant children themselves are excluded from that RPC.
  return client
    .rpc("get_inventory_quantities", {
      location_id: locationId,
      company_id: companyId
    })
    .eq("id", itemId)
    .maybeSingle();
}

/** Per-SKU inventory breakdown for a parent item (empty if no variants). */
export async function getItemVariantQuantities(
  client: SupabaseClient<Database>,
  parentItemId: string,
  companyId: string,
  locationId: string
) {
  const db = client as SupabaseClient<any>;
  const variants = await db
    .from("itemVariant")
    .select(
      "id, variantItemId, variant:item!itemVariant_variantItemId_fkey(id, readableId, name, active)"
    )
    .eq("parentItemId", parentItemId)
    .eq("companyId", companyId)
    // `variant` is a to-one FK embed, but with an untyped client PostgREST's
    // select parser assumes to-many (array); override to the real shape.
    .returns<
      Array<{
        variantItemId: string;
        variant: {
          readableId: string;
          name: string;
          active: boolean | null;
        } | null;
      }>
    >();

  if (variants.error) return variants;
  const list = variants.data ?? [];
  if (list.length === 0) return { data: [], error: null };

  const ids = list.map((v: { variantItemId: string }) => v.variantItemId);
  // Variant children are excluded from get_inventory_quantities (list rollup);
  // fetch them explicitly for SKU breakdown tables.
  const qtys = await (client as SupabaseClient<any>).rpc(
    "get_inventory_quantities_for_items",
    {
      location_id: locationId,
      company_id: companyId,
      item_ids: ids
    }
  );

  if (qtys.error) return qtys;
  const byId = new Map(
    ((qtys.data ?? []) as { id: string }[]).map((q) => [q.id, q])
  );

  return {
    data: list.map(
      (v: {
        variantItemId: string;
        variant: {
          readableId: string;
          name: string;
          active: boolean | null;
        } | null;
      }) => {
        const q = byId.get(v.variantItemId) as
          | {
              quantityOnHand?: number;
              quantityOnSalesOrder?: number;
              quantityOnPurchaseOrder?: number;
              quantityOnProductionOrder?: number;
            }
          | undefined;
        const onHand = Number(q?.quantityOnHand ?? 0);
        const onSales = Number(q?.quantityOnSalesOrder ?? 0);
        return {
          variantItemId: v.variantItemId,
          readableId: v.variant?.readableId ?? v.variantItemId,
          name: v.variant?.name ?? v.variant?.readableId ?? v.variantItemId,
          active: v.variant?.active !== false,
          quantities: {
            ...(q ?? {}),
            quantityOnHand: onHand,
            // Approximate available for display (same spirit as legacy views).
            quantityAvailable: onHand - onSales
          }
        };
      }
    ),
    error: null
  };
}

export async function getItemReplenishment(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
) {
  return client
    .from("itemReplenishment")
    .select("*")
    .eq("itemId", itemId)
    .eq("companyId", companyId)
    .single();
}

export async function getItemStorageUnitQuantities(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string,
  locationId: string
) {
  return client.rpc("get_item_quantities_by_tracking_id", {
    item_id: itemId,
    company_id: companyId,
    location_id: locationId
  });
}

/**
 * Storage-unit quantities for a Style item: on this model stock lives on the
 * variant SKUs, so aggregate the per-storage-unit rows across the parent and
 * all its variants (one query per SKU, concatenated). Same row shape as
 * getItemStorageUnitQuantities.
 */
export async function getStyleStorageUnitQuantities(
  client: SupabaseClient<Database>,
  parentItemId: string,
  companyId: string,
  locationId: string
) {
  const db = client as SupabaseClient<Database & { public: any }>;
  const variants = await db
    .from("itemVariant")
    .select("variantItemId")
    .eq("parentItemId", parentItemId)
    .eq("companyId", companyId);
  const variantList = (variants.data ?? []) as {
    variantItemId: string;
  }[];
  // The per-SKU descriptor/label comes from the attribute join.
  const comboByVariant = await loadVariantCombos(
    client,
    variantList.map((v) => v.variantItemId),
    companyId
  );
  const ids = [parentItemId, ...variantList.map((v) => v.variantItemId)];
  const results = await Promise.all(
    ids.map((id) =>
      client.rpc("get_item_quantities_by_tracking_id", {
        item_id: id,
        company_id: companyId,
        location_id: locationId
      })
    )
  );
  // Keep the concrete RPC row shape so this stays assignable everywhere
  // getItemStorageUnitQuantities is (same base fields + the SKU descriptor).
  type StorageUnitQtyRow = NonNullable<
    (typeof results)[number]["data"]
  >[number];
  const data = results.flatMap((r, i) => {
    const variantItemId = ids[i];
    const combo = comboByVariant.get(variantItemId) ?? null;
    const skuLabel = combo ? combo.replaceAll("|", " · ") : null;
    return ((r.data ?? []) as StorageUnitQtyRow[]).map((row) => ({
      ...row,
      variantItemId,
      skuLabel
    }));
  });
  return { data, error: null };
}

export async function getItemSupply(
  client: SupabaseClient<Database>,
  {
    itemId,
    locationId,
    periods,
    companyId
  }: {
    itemId: string | string[];
    locationId: string;
    periods: string[];
    companyId: string;
  }
) {
  const itemIds = Array.isArray(itemId) ? itemId : [itemId];
  const [actuals, forecasts] = await Promise.all([
    client
      .from("supplyActual")
      .select("*")
      .in("itemId", itemIds)
      .eq("locationId", locationId)
      .eq("companyId", companyId)
      .in("periodId", periods)
      .order("periodId"),
    client
      .from("supplyForecast")
      .select("*")
      .in("itemId", itemIds)
      .eq("locationId", locationId)
      .eq("companyId", companyId)
      .in("periodId", periods)
      .order("periodId")
  ]);

  return {
    actuals: actuals.data ?? [],
    forecasts: forecasts.data ?? [],
    error: actuals.error ?? forecasts.error ?? null
  };
}

export async function getItemUnitSalePrice(
  client: SupabaseClient<Database>,
  id: string,
  companyId: string
) {
  return client
    .from("itemUnitSalePrice")
    .select("*")
    .eq("itemId", id)
    .eq("companyId", companyId)
    .single();
}

export async function getJobMaterialUsageForItem(
  client: SupabaseClient<Database>,
  { itemId, companyId }: { itemId: string; companyId: string }
): Promise<{
  byMaterialId: Record<string, number>;
  byJobId: Record<string, number>;
}> {
  const [materials, jobs] = await Promise.all([
    client
      .from("jobMaterial")
      .select("id, estimatedQuantity")
      .eq("itemId", itemId)
      .eq("companyId", companyId),
    client
      .from("job")
      .select("id, quantity")
      .eq("itemId", itemId)
      .eq("companyId", companyId)
  ]);

  const byMaterialId: Record<string, number> = {};
  for (const row of materials.data ?? []) {
    if (row.id) byMaterialId[row.id] = row.estimatedQuantity ?? 0;
  }

  const byJobId: Record<string, number> = {};
  for (const row of jobs.data ?? []) {
    if (row.id) byJobId[row.id] = row.quantity ?? 0;
  }

  return { byMaterialId, byJobId };
}

export async function getMaterialUsedIn(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
) {
  const [
    issues,
    jobMaterials,
    maintenanceDispatchItems,
    methodMaterials,
    purchaseOrderLines,
    receiptLines,
    quoteMaterials,
    salesOrderLines,
    shipmentLines,
    supplierQuotes,
    jobMaterialUsage
  ] = await Promise.all([
    client
      .from("nonConformanceItem")
      .select(
        "id, ...nonConformance(documentReadableId:nonConformanceId, documentId:id)"
      )
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .limit(100)
      .order("createdAt", { ascending: false }),
    client
      .from("jobMaterial")
      .select("id, methodType, ...job(documentReadableId:jobId, documentId:id)")
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .limit(100)
      .order("createdAt", { ascending: false }),
    client
      .from("maintenanceDispatchItem")
      .select(
        "id, ...maintenanceDispatch!maintenanceDispatchId(documentReadableId:maintenanceDispatchId, documentId:id)"
      )
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .limit(100)
      .order("createdAt", { ascending: false }),
    client
      .from("methodMaterial")
      .select(
        "id, methodType, ...makeMethod!makeMethodId(documentId:id, version, ...item(documentReadableId:readableIdWithRevision, documentParentId:id, itemType:type))"
      )
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .limit(100)
      .order("createdAt", { ascending: false }),
    client
      .from("purchaseOrderLine")
      .select(
        "id, ...purchaseOrder(documentReadableId:purchaseOrderId, documentId:id)"
      )
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .limit(100)
      .order("createdAt", { ascending: false }),
    client
      .from("receiptLine")
      .select("id, ...receipt(documentReadableId:receiptId, documentId:id)")
      .eq("itemId", itemId)
      .eq("companyId", companyId),
    client
      .from("quoteMaterial")
      .select(
        "id, methodType, documentParentId:quoteId, documentId:quoteLineId, ...quoteLine(...item(documentReadableId:readableIdWithRevision))"
      )
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .limit(100)
      .order("createdAt", { ascending: false }),
    client
      .from("salesOrderLine")
      .select(
        "id, methodType, ...salesOrder(documentReadableId:salesOrderId, documentId:id)"
      )
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .limit(100)
      .order("createdAt", { ascending: false }),
    client
      .from("shipmentLine")
      .select("id, ...shipment(documentReadableId:shipmentId, documentId:id)")
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .limit(100)
      .order("createdAt", { ascending: false }),
    client
      .from("supplierQuoteLine")
      .select(
        "id, ...supplierQuote(documentReadableId:supplierQuoteId, documentId:id)"
      )
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .limit(100),
    getJobMaterialUsageForItem(client, { itemId, companyId })
  ]);

  return {
    issues: issues.data ?? [],
    jobMaterials: jobMaterials.data ?? [],
    maintenanceDispatchItems: maintenanceDispatchItems.data ?? [],
    methodMaterials: methodMaterials.data ?? [],
    purchaseOrderLines: purchaseOrderLines.data ?? [],
    receiptLines: receiptLines.data ?? [],
    quoteMaterials: quoteMaterials.data ?? [],
    salesOrderLines: salesOrderLines.data ?? [],
    shipmentLines: shipmentLines.data ?? [],
    supplierQuotes: supplierQuotes.data ?? [],
    jobMaterialUsage
  };
}

export async function getMakeMethods(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
) {
  return client
    .from("makeMethod")
    .select("*")
    .eq("itemId", itemId)
    .eq("companyId", companyId);
}

export async function getMakeMethodById(
  client: SupabaseClient<Database>,
  makeMethodId: string,
  companyId: string
) {
  return client
    .from("makeMethod")
    .select("*")
    .eq("id", makeMethodId)
    .eq("companyId", companyId)
    .single();
}

export async function getMaterial(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
) {
  return client
    .rpc("get_material_details", {
      item_id: itemId
    })
    .single();
}

// materials-view projection: heavy per-row aggregates pruned (`supplierIds` kept
// in the view for the supplier filter, `externalId`), and `revisions` fetched
// per-page via itemRevisions (Materials shows a revision switcher).
const MATERIAL_LIST_COLUMNS =
  "active, assignee, defaultMethodType, description, itemTrackingType, name, replenishmentSystem, unitOfMeasureCode, notes, revision, readableId, readableIdWithRevision, id, companyId, thumbnailPath, modelUploadId, modelPath, modelName, modelSize, unitOfMeasure, materialForm, materialSubstance, dimensions, finish, grade, materialType, materialSubstanceId, materialFormId, customFields, tags, itemPostingGroupId, createdBy, createdAt, updatedBy, updatedAt, gradeId, dimensionId, finishId, materialTypeId";

export async function getMaterials(
  client: SupabaseClient<Database>,
  companyId: string,
  args: GenericQueryFilters & {
    search: string | null;
    supplierId: string | null;
  }
) {
  let query = client
    .from("materials")
    .select(MATERIAL_LIST_COLUMNS, {
      count: "estimated"
    })
    .or(`companyId.eq.${companyId},companyId.is.null`);

  query = setSearchFilter(
    query,
    args.search,
    ITEM_SEARCH_COLUMNS_WITH_SUPPLIER
  );

  if (args.supplierId) {
    query = query.contains("supplierIds", [args.supplierId]);
  }

  const result = await setGenericQueryFilters(query, args, [
    { column: "readableIdWithRevision", ascending: true }
  ]);

  if (result.error || !result.data) return result;
  return {
    ...result,
    data: await attachItemRevisions(
      client as SupabaseClient<any>,
      companyId,
      "Material",
      result.data
    )
  };
}

export async function getMaterialsList(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return fetchAllFromTable<{
    id: string;
    name: string;
    readableIdWithRevision: string;
  }>(client, "item", "id, name, readableIdWithRevision", (query) =>
    query
      .eq("type", "Material")
      .or(`companyId.eq.${companyId},companyId.is.null`)
      .eq("active", true)
      .order("name")
  );
}

export async function getMaterialDimension(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("materialDimension").select("*").eq("id", id).single();
}

export async function getMaterialDimensions(
  client: SupabaseClient<Database>,
  companyId: string,
  args?: GenericQueryFilters & { search: string | null; isMetric: boolean }
) {
  let query = client
    .from("materialDimensions")
    .select("*", {
      count: "exact"
    })
    .eq("isMetric", args?.isMetric ?? false)
    .or(`companyId.eq.${companyId},companyId.is.null`);

  if (args?.search) {
    query = query.ilike("name", `%${args.search}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, [
      { column: "formName", ascending: true },
      { column: "name", ascending: true }
    ]);
  }

  return query;
}

export async function getMaterialDimensionList(
  client: SupabaseClient<Database>,
  materialFormId: string,
  isMetric: boolean,
  companyId: string
) {
  return client
    .from("materialDimension")
    .select("*")
    .eq("materialFormId", materialFormId)
    .eq("isMetric", isMetric)
    .or(`companyId.eq.${companyId},companyId.is.null`);
}

export async function getMaterialFinish(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("materialFinish").select("*").eq("id", id).single();
}

export async function getMaterialFinishes(
  client: SupabaseClient<Database>,
  companyId: string,
  args?: GenericQueryFilters & { search: string | null }
) {
  let query = client
    .from("materialFinishes")
    .select("*", {
      count: "exact"
    })
    .or(`companyId.eq.${companyId},companyId.is.null`);

  if (args?.search) {
    query = query.ilike("name", `%${args.search}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, [
      { column: "substanceName", ascending: true },
      { column: "name", ascending: true }
    ]);
  }

  return query;
}

export async function getMaterialFinishList(
  client: SupabaseClient<Database>,
  materialSubstanceId: string,
  companyId: string
) {
  return client
    .from("materialFinish")
    .select("*")
    .eq("materialSubstanceId", materialSubstanceId)
    .or(`companyId.eq.${companyId},companyId.is.null`);
}

export async function getMaterialForm(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("materialForm").select("*").eq("id", id).single();
}

export async function getMaterialForms(
  client: SupabaseClient<Database>,
  companyId: string,
  args?: GenericQueryFilters & { search: string | null }
) {
  let query = client
    .from("materialForm")
    .select("*", {
      count: "exact"
    })
    .or(`companyId.eq.${companyId},companyId.is.null`);

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

export async function getMaterialFormsList(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return client
    .from("materialForm")
    .select("id, name, code, companyId")
    .or(`companyId.eq.${companyId},companyId.is.null`)
    .order("name");
}

export async function getMaterialGrades(
  client: SupabaseClient<Database>,
  companyId: string,
  args?: GenericQueryFilters & { search: string | null }
) {
  let query = client
    .from("materialGrades")
    .select("*", {
      count: "exact"
    })
    .or(`companyId.eq.${companyId},companyId.is.null`);

  if (args?.search) {
    query = query.ilike("name", `%${args.search}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, [
      { column: "substanceName", ascending: true },
      { column: "name", ascending: true }
    ]);
  }

  return query;
}

export async function getMaterialGrade(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("materialGrade").select("*").eq("id", id).single();
}

export async function getMaterialGradeList(
  client: SupabaseClient<Database>,
  materialSubstanceId: string,
  companyId: string
) {
  return client
    .from("materialGrade")
    .select("*")
    .eq("materialSubstanceId", materialSubstanceId)
    .or(`companyId.eq.${companyId},companyId.is.null`);
}

export async function getMaterialSubstance(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("materialSubstance").select("*").eq("id", id).single();
}

export async function getMaterialSubstances(
  client: SupabaseClient<Database>,
  companyId: string,
  args?: GenericQueryFilters & { search: string | null }
) {
  let query = client
    .from("materialSubstance")
    .select("*", {
      count: "exact"
    })
    .or(`companyId.eq.${companyId},companyId.is.null`);

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

export async function getMaterialSubstancesList(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return client
    .from("materialSubstance")
    .select("id, name, code, companyId")
    .or(`companyId.eq.${companyId},companyId.is.null`)
    .order("name");
}

export async function getMethodMaterial(
  client: SupabaseClient<Database>,
  materialId: string
) {
  return client
    .from("methodMaterial")
    .select("*, item(name)")
    .eq("id", materialId)
    .single();
}

export async function getMethodMaterials(
  client: SupabaseClient<Database>,
  companyId: string,
  args?: GenericQueryFilters & { search: string | null }
) {
  let query = client
    .from("methodMaterial")
    .select(
      "*, item(name, readableIdWithRevision), makeMethod!makeMethodId(item(id, type, name, readableIdWithRevision))",
      {
        count: "exact"
      }
    )
    .eq("companyId", companyId);

  if (args?.search) {
    query = query.ilike("item.readableIdWithRevision", `%${args.search}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, []);
  }

  return query;
}

export async function getMethodMaterialsByMakeMethod(
  client: SupabaseClient<Database>,
  makeMethodId: string
) {
  return client
    .from("methodMaterial")
    .select(
      "*, item(name, readableIdWithRevision, itemTrackingType, replenishmentSystem, defaultMethodType, sourcingType)"
    )
    .eq("makeMethodId", makeMethodId)
    .order("order", { ascending: true });
}

export async function getMethodOperations(
  client: SupabaseClient<Database>,
  companyId: string,
  args?: GenericQueryFilters & { search: string | null }
) {
  let query = client
    .from("methodOperation")
    .select(
      "*, makeMethod!makeMethodId(item(id, type, name, readableIdWithRevision))",
      {
        count: "exact"
      }
    )
    .eq("companyId", companyId);

  if (args?.search) {
    query = query.ilike("description", `%${args.search}%`);
  }

  if (args) {
    query = setGenericQueryFilters(query, args, [
      { column: "order", ascending: true }
    ]);
  }

  return query;
}

export async function getMethodOperationsByMakeMethodId(
  client: SupabaseClient<Database>,
  makeMethodId: string
) {
  return client
    .from("methodOperation")
    .select(
      "*, methodOperationTool(*), methodOperationParameter(*), methodOperationStep(*)"
    )
    .eq("makeMethodId", makeMethodId)
    .order("order", { ascending: true });
}

type Method = NonNullable<
  Awaited<ReturnType<typeof getMethodTreeArray>>["data"]
>[number];
type MethodTreeItem = {
  id: string;
  data: Method;
  children: MethodTreeItem[];
};

export async function getMethodTree(
  client: SupabaseClient<Database>,
  makeMethodId: string
) {
  const items = await getMethodTreeArray(client, makeMethodId);
  if (items.error) return items;

  const tree = getMethodTreeArrayToTree(items.data);

  return {
    data: tree,
    error: null
  };
}

export async function getMethodTreeArray(
  client: SupabaseClient<Database>,
  makeMethodId: string
) {
  return client.rpc("get_method_tree", {
    uid: makeMethodId
  });
}

function getMethodTreeArrayToTree(items: Method[]): MethodTreeItem[] {
  function traverseAndRenameIds(node: MethodTreeItem) {
    const clone = structuredClone(node);
    clone.id = nanoid();
    clone.children = clone.children.map((n) => traverseAndRenameIds(n));
    return clone;
  }

  const rootItems: MethodTreeItem[] = [];
  const lookup: { [id: string]: MethodTreeItem } = {};

  for (const item of items) {
    const itemId = item.methodMaterialId;
    const parentId = item.parentMaterialId;

    if (!Object.prototype.hasOwnProperty.call(lookup, itemId)) {
      // @ts-ignore
      lookup[itemId] = { id: itemId, children: [] };
    }

    // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
    lookup[itemId]["data"] = item;

    const treeItem = lookup[itemId];

    if (parentId === null || parentId === undefined) {
      rootItems.push(treeItem);
    } else {
      if (!Object.prototype.hasOwnProperty.call(lookup, parentId)) {
        // @ts-ignore
        lookup[parentId] = { id: parentId, children: [] };
      }

      // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
      lookup[parentId]["children"].push(treeItem);
    }
  }

  return rootItems.map((item) => traverseAndRenameIds(item));
}

export async function getOpenJobMaterials(
  client: SupabaseClient<Database>,
  {
    itemId,
    companyId,
    locationId
  }: { itemId: string | string[]; companyId: string; locationId: string }
) {
  const itemIds = Array.isArray(itemId) ? itemId : [itemId];
  return client
    .from("openJobMaterialLines")
    .select(
      "id, parentMaterialId, jobMakeMethodId, jobId, quantity:quantityToIssue, documentReadableId:jobReadableId, documentId:jobId, dueDate"
    )
    .in("itemId", itemIds)
    .eq("locationId", locationId)
    .eq("companyId", companyId);
}

export async function getOpenProductionOrders(
  client: SupabaseClient<Database>,
  {
    itemId,
    companyId,
    locationId
  }: { itemId: string | string[]; companyId: string; locationId: string }
) {
  const itemIds = Array.isArray(itemId) ? itemId : [itemId];
  return client
    .from("openProductionOrders")
    .select(
      "id, quantity:quantityToReceive, documentReadableId:jobId, documentId:id, dueDate"
    )
    .in("itemId", itemIds)
    .eq("locationId", locationId)
    .eq("companyId", companyId);
}

export async function getOpenPurchaseOrderLines(
  client: SupabaseClient<Database>,
  {
    itemId,
    companyId,
    locationId
  }: { itemId: string | string[]; companyId: string; locationId: string }
) {
  const itemIds = Array.isArray(itemId) ? itemId : [itemId];
  return client
    .from("openPurchaseOrderLines")
    .select(
      "id, quantity:quantityToReceive, dueDate:promisedDate, ...purchaseOrder(documentReadableId:purchaseOrderId, documentId:id)"
    )
    .in("itemId", itemIds)
    .eq("locationId", locationId)
    .eq("companyId", companyId);
}

export async function getOpenSalesOrderLines(
  client: SupabaseClient<Database>,
  {
    itemId,
    companyId,
    locationId
  }: { itemId: string | string[]; companyId: string; locationId: string }
) {
  const itemIds = Array.isArray(itemId) ? itemId : [itemId];
  return client
    .from("openSalesOrderLines")
    .select(
      "id, quantity:quantityToSend, dueDate:promisedDate, ...salesOrder(documentReadableId:salesOrderId, documentId:id)"
    )
    .in("itemId", itemIds)
    .eq("companyId", companyId)
    .eq("locationId", locationId);
}

export async function getPart(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
) {
  return client
    .rpc("get_part_details", {
      item_id: itemId
    })
    .single();
}

export async function getStyle(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
) {
  const styleClient = client as SupabaseClient<any>;

  return styleClient
    .from("styles")
    .select("*")
    .eq("id", itemId)
    .eq("companyId", companyId)
    .single();
}

// parts-view projection: heavy per-row aggregates pruned (`supplierIds` kept in
// the view for the supplier filter, `externalId`), and `revisions` fetched
// per-page via itemRevisions (Parts shows a revision switcher).
const PART_LIST_COLUMNS =
  "active, assignee, defaultMethodType, sourcingType, description, itemTrackingType, name, replenishmentSystem, unitOfMeasureCode, notes, revision, readableId, readableIdWithRevision, id, companyId, thumbnailPath, modelPath, modelName, modelSize, unitOfMeasure, customFields, tags, itemPostingGroupId, createdBy, createdAt, updatedBy, updatedAt, templateId, templateName";

export async function getParts(
  client: SupabaseClient<Database>,
  companyId: string,
  args: GenericQueryFilters & {
    search: string | null;
    supplierId: string | null;
  }
) {
  let query = client
    .from("parts")
    .select(PART_LIST_COLUMNS, {
      count: "estimated"
    })
    .eq("companyId", companyId);

  query = setSearchFilter(
    query,
    args.search,
    ITEM_SEARCH_COLUMNS_WITH_SUPPLIER
  );

  if (args.supplierId) {
    query = query.contains("supplierIds", [args.supplierId]);
  }

  const result = await setGenericQueryFilters(query, args, [
    { column: "readableIdWithRevision", ascending: true }
  ]);

  if (result.error || !result.data) return result;
  return {
    ...result,
    data: await attachItemRevisions(
      client as SupabaseClient<any>,
      companyId,
      "Part",
      result.data
    )
  };
}

// Styles-view projection for the list. The `styles`/`styleSamples` views no
// longer carry the heavy per-row aggregates the list never displays
// (`attributeCodes` string_agg, `revisions` json_agg) — they were dropped from
// the view bodies. `attributes` is NOT selected here either; it's fetched only
// for the current page's rows via `itemAttributes` and merged in (see
// attachItemAttributes). This keeps the list query at the DISTINCT-ON floor
// instead of computing per-row JSON for the whole tenant before LIMIT.
const STYLE_LIST_COLUMNS =
  "active, assignee, defaultMethodType, sourcingType, description, itemTrackingType, name, replenishmentSystem, unitOfMeasureCode, notes, revision, readableId, readableIdWithRevision, id, companyId, thumbnailPath, attributeSetId, customFields, tags, itemPostingGroupId, createdBy, createdAt, updatedBy, updatedAt";

// styleSamples = styles view + per-style sample columns.
const STYLE_SAMPLE_LIST_COLUMNS = `${STYLE_LIST_COLUMNS}, sampleItemId, sampleCount, sampledVariantCount, samples`;

// Fetch the `attributes` JSON for just this page's item ids (via the
// itemAttributes view — keyed by itemId, no DISTINCT ON) and merge onto each
// row, reproducing the shape the tables expect. No-op for an empty page.
async function attachItemAttributes<T extends { id: string }>(
  client: SupabaseClient<any>,
  companyId: string,
  rows: T[]
): Promise<(T & { attributes: unknown })[]> {
  if (rows.length === 0) return rows as (T & { attributes: unknown })[];
  const { data } = await client
    .from("itemAttributes")
    .select("itemId, attributes")
    .eq("companyId", companyId)
    .in(
      "itemId",
      rows.map((row) => row.id)
    );
  const byItemId = new Map<string, unknown>(
    ((data ?? []) as { itemId: string; attributes: unknown }[]).map((row) => [
      row.itemId,
      row.attributes
    ])
  );
  return rows.map((row) => ({
    ...row,
    attributes: byItemId.get(row.id) ?? []
  }));
}

// Fetch the `revisions` list for just this page's rows (via the itemRevisions
// view — keyed by readableId+type, no per-tenant CTE) and merge onto each row.
// Used by Parts/Tools/Materials, which render a revision switcher. No-op for an
// empty page.
async function attachItemRevisions<T extends { readableId: string | null }>(
  client: SupabaseClient<any>,
  companyId: string,
  type: string,
  rows: T[]
): Promise<(T & { revisions: unknown })[]> {
  if (rows.length === 0) return rows as (T & { revisions: unknown })[];
  const { data } = await client
    .from("itemRevisions")
    .select("readableId, revisions")
    .eq("companyId", companyId)
    .eq("type", type)
    .in(
      "readableId",
      rows.map((row) => row.readableId)
    );
  const byReadableId = new Map<string, unknown>(
    ((data ?? []) as { readableId: string; revisions: unknown }[]).map(
      (row) => [row.readableId, row.revisions]
    )
  );
  return rows.map((row) => ({
    ...row,
    revisions: (row.readableId && byReadableId.get(row.readableId)) || []
  }));
}

export async function getStyles(
  client: SupabaseClient<Database>,
  companyId: string,
  args: GenericQueryFilters & {
    search: string | null;
    supplierId: string | null;
  }
) {
  const styleClient = client as SupabaseClient<any>;
  let query = styleClient
    .from("styles")
    .select(STYLE_LIST_COLUMNS, {
      count: "estimated"
    })
    .eq("companyId", companyId);

  query = setSearchFilter(
    query,
    args.search,
    ITEM_SEARCH_COLUMNS_WITH_SUPPLIER
  );

  if (args.supplierId) {
    query = query.contains("supplierIds", [args.supplierId]);
  }

  const result = await setGenericQueryFilters(query, args, [
    { column: "readableIdWithRevision", ascending: true }
  ]);

  if (result.error || !result.data) return result;
  return {
    ...result,
    data: await attachItemAttributes(styleClient, companyId, result.data)
  };
}

export async function getStyleSamples(
  client: SupabaseClient<Database>,
  companyId: string,
  args: GenericQueryFilters & {
    search: string | null;
    supplierId: string | null;
  }
) {
  // "styleSamples" is the styles view + per-style sample count.
  const sampleClient = client as SupabaseClient<any>;
  let query = sampleClient
    .from("styleSamples")
    .select(STYLE_SAMPLE_LIST_COLUMNS, {
      count: "estimated"
    })
    .eq("companyId", companyId);

  query = setSearchFilter(
    query,
    args.search,
    ITEM_SEARCH_COLUMNS_WITH_SUPPLIER
  );

  if (args.supplierId) {
    query = query.contains("supplierIds", [args.supplierId]);
  }

  const result = await setGenericQueryFilters(query, args, [
    { column: "readableIdWithRevision", ascending: true }
  ]);

  if (result.error || !result.data) return result;
  return {
    ...result,
    data: await attachItemAttributes(sampleClient, companyId, result.data)
  };
}

export async function ensureStyleSampleItem(
  client: SupabaseClient<Database>,
  args: { styleId: string; companyId: string; userId: string }
) {
  const { styleId, companyId, userId } = args;
  const sampleClient = client as SupabaseClient<any>;

  // Already have a companion sample item for this style?
  const existing = await sampleClient
    .from("styleSample")
    .select("itemId")
    .eq("styleId", styleId)
    .eq("companyId", companyId)
    .maybeSingle();
  if (existing.error) return existing;
  if (existing.data?.itemId) {
    return { data: { itemId: existing.data.itemId as string }, error: null };
  }

  // style.id === item.readableId; fetch the style's item for name + UoM.
  const styleItem = await sampleClient
    .from("item")
    .select("name, unitOfMeasureCode")
    .eq("readableId", styleId)
    .eq("type", "Style")
    .eq("companyId", companyId)
    .order("revision", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (styleItem.error) return styleItem;

  const itemInsert = await client
    .from("item")
    .insert({
      readableId: `${styleId}-SAMPLE`,
      revision: "0",
      name: `${styleItem.data?.name ?? styleId} Sample`,
      type: "Sample",
      replenishmentSystem: "Make",
      defaultMethodType: "Make to Order",
      itemTrackingType: "Serial",
      unitOfMeasureCode: styleItem.data?.unitOfMeasureCode ?? "EA",
      active: true,
      companyId,
      createdBy: userId
    })
    .select("id")
    .single();
  if (itemInsert.error) return itemInsert;

  const itemId = itemInsert.data.id;
  const linkInsert = await sampleClient.from("styleSample").insert({
    itemId,
    styleId,
    companyId,
    createdBy: userId
  });
  if (linkInsert.error) return linkInsert;

  return { data: { itemId }, error: null };
}

export async function createStyleSamples(
  client: SupabaseClient<Database>,
  args: {
    styleId: string;
    lines: {
      selections: Record<string, string>;
      quantity: number;
    }[];
    locationId: string;
    storageUnitId?: string | null;
    companyId: string;
    userId: string;
  }
) {
  const { styleId, lines, locationId, storageUnitId, companyId, userId } = args;
  const sampleClient = client as SupabaseClient<any>;

  const ensured = await ensureStyleSampleItem(client, {
    styleId,
    companyId,
    userId
  });
  if (ensured.error) return ensured;
  const sampleItemId = (ensured.data as { itemId: string }).itemId;

  const allValueIds = Array.from(
    new Set(lines.flatMap((l) => Object.values(l.selections)))
  );
  const values = allValueIds.length
    ? await sampleClient
        .from("itemAttributeValue")
        .select("id, code, attributeId, itemAttribute:attributeId(code, name)")
        .in("id", allValueIds)
    : { data: [], error: null };
  if (values.error) return values;

  type ValueRow = {
    id: string;
    code: string;
    attributeId: string;
    itemAttribute: { code: string; name: string } | null;
  };
  const valueById = new Map(
    ((values.data ?? []) as ValueRow[]).map((v) => [v.id, v])
  );

  const existing = await sampleClient
    .from("trackedEntity")
    .select("attributes")
    .eq("sourceDocument", "Item")
    .eq("sourceDocumentId", sampleItemId)
    .eq("companyId", companyId);
  if (existing.error) return existing;
  const seqByKey = new Map<string, number>();
  for (const e of (existing.data ?? []) as { attributes: any }[]) {
    const attrs = e.attributes ?? {};
    const key = Object.keys(attrs)
      .sort()
      .map((k) => `${k}=${attrs[k]}`)
      .join("|");
    seqByKey.set(key, (seqByKey.get(key) ?? 0) + 1);
  }

  const trackedEntities: Record<string, unknown>[] = [];
  const ledgerRows: Record<string, unknown>[] = [];

  for (const line of lines) {
    const attrPairs: Array<{ attrCode: string; valueCode: string }> = [];
    for (const valueId of Object.values(line.selections)) {
      const row = valueById.get(valueId);
      if (!row) {
        return {
          data: null,
          error: new Error(`Unknown attribute value: ${valueId}`)
        };
      }
      attrPairs.push({
        attrCode: row.itemAttribute?.code ?? row.attributeId,
        valueCode: row.code
      });
    }
    attrPairs.sort((a, b) => a.attrCode.localeCompare(b.attrCode));
    const attributes = Object.fromEntries(
      attrPairs.map((p) => [p.attrCode, p.valueCode])
    );
    const key = attrPairs.map((p) => `${p.attrCode}=${p.valueCode}`).join("|");
    const codeSuffix = attrPairs.map((p) => p.valueCode).join("-");

    for (let n = 1; n <= line.quantity; n++) {
      const trackedEntityId = nanoid();
      const seq = (seqByKey.get(key) ?? 0) + 1;
      seqByKey.set(key, seq);
      const serial = `${styleId}-${codeSuffix}-${seq}`;
      trackedEntities.push({
        id: trackedEntityId,
        quantity: 1,
        status: "Available",
        sourceDocument: "Item",
        sourceDocumentId: sampleItemId,
        sourceDocumentReadableId: `${styleId}-SAMPLE`,
        readableId: serial,
        itemId: sampleItemId,
        attributes,
        companyId,
        createdBy: userId
      });
      ledgerRows.push({
        itemId: sampleItemId,
        locationId,
        storageUnitId: storageUnitId || null,
        trackedEntityId,
        entryType: "Positive Adjmt.",
        quantity: 1,
        companyId,
        createdBy: userId
      });
    }
  }

  if (trackedEntities.length === 0) {
    return { data: { count: 0 }, error: null };
  }

  const entityInsert = await sampleClient
    .from("trackedEntity")
    .insert(trackedEntities);
  if (entityInsert.error) return entityInsert;

  const ledgerInsert = await sampleClient.from("itemLedger").insert(ledgerRows);
  if (ledgerInsert.error) return ledgerInsert;

  return { data: { count: trackedEntities.length }, error: null };
}

/**
 * Seeds the standard apparel colors + sizes for a freshly created company, with
 * names localized to the company's language. Idempotent — re-running skips rows
 * whose (attributeId, code, companyId) already exists. Called from company
 * onboarding. Writes company-scoped itemAttributeValue only (Colors/Sizes
 * admin + Style pickers share that catalog).
 */
export async function seedStyleReference(
  client: SupabaseClient<Database>,
  companyId: string,
  userId: string,
  language?: string
) {
  const styleClient = client as SupabaseClient<any>;
  const { colors, sizes } = styleReferenceRows(language);
  const colorAttributeValues = colors.map((c) => ({
    attributeId: SYSTEM_ATTRIBUTE.color,
    code: c.colorCode,
    name: c.colorName,
    companyId,
    createdBy: userId,
    sortOrder: 100
  }));
  const sizeAttributeValues = sizes.map((s) => ({
    attributeId: SYSTEM_ATTRIBUTE.size,
    code: s.sizeCode,
    name: s.sizeName,
    companyId,
    createdBy: userId,
    sortOrder: s.sortOrder ?? 100
  }));

  return Promise.all([
    styleClient.from("itemAttributeValue").upsert(colorAttributeValues, {
      onConflict: "attributeId,code,companyId",
      ignoreDuplicates: true
    }),
    styleClient.from("itemAttributeValue").upsert(sizeAttributeValues, {
      onConflict: "attributeId,code,companyId",
      ignoreDuplicates: true
    })
  ]);
}

export async function getPartsList(
  client: SupabaseClient<Database>,
  companyId: string
) {
  // Source from the `parts` view (one row per part, latest revision) — the same
  // source as the Parts list page — so this lists parent parts, not every
  // revision. Unlike the `styles` view, `parts` does not drop variant SKUs, so
  // exclude any item that is a variant child (present in `itemVariant`).
  const parts = await fetchAllFromTable<{
    id: string;
    name: string;
    readableIdWithRevision: string;
  }>(client, "parts", "id, name, readableIdWithRevision", (query) =>
    query.eq("companyId", companyId).order("readableId")
  );
  if (parts.error || !parts.data) return parts;

  const variants = await client
    .from("itemVariant")
    .select("variantItemId")
    .eq("companyId", companyId);
  const variantItemIds = new Set(
    (variants.data ?? []).map((variant) => variant.variantItemId)
  );

  return {
    ...parts,
    data: parts.data.filter((part) => !variantItemIds.has(part.id))
  };
}

export async function getStylesList(
  client: SupabaseClient<Database>,
  companyId: string
) {
  // The `styles` view yields one row per parent style (latest revision, variant
  // SKUs already excluded) — the same source as the Styles list page.
  return fetchAllFromTable<{
    id: string;
    name: string;
    readableIdWithRevision: string;
  }>(client, "styles", "id, name, readableIdWithRevision", (query) =>
    query.eq("companyId", companyId).order("readableId")
  );
}

export async function getPartUsedIn(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
) {
  const [
    issues,
    jobMaterials,
    jobs,
    maintenanceDispatchItems,
    methodMaterials,
    purchaseOrderLines,
    receiptLines,
    quoteLines,
    quoteMaterials,
    salesOrderLines,
    shipmentLines,
    supplierQuotes,
    jobMaterialUsage
  ] = await Promise.all([
    client
      .from("nonConformanceItem")
      .select(
        "id, ...nonConformance(documentReadableId:nonConformanceId, documentId:id)"
      )
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .limit(100)
      .order("createdAt", { ascending: false }),
    client
      .from("jobMaterial")
      .select("id, methodType, ...job(documentReadableId:jobId, documentId:id)")
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .limit(100)
      .order("createdAt", { ascending: false }),
    client
      .from("job")
      .select("id, documentReadableId:jobId")
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .limit(100)
      .order("createdAt", { ascending: false }),
    client
      .from("maintenanceDispatchItem")
      .select(
        "id, ...maintenanceDispatch!maintenanceDispatchId(documentReadableId:maintenanceDispatchId, documentId:id)"
      )
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .limit(100)
      .order("createdAt", { ascending: false }),
    client
      .from("methodMaterial")
      .select(
        "id, methodType, ...makeMethod!makeMethodId(documentId:id, version, ...item(documentReadableId:readableIdWithRevision, documentParentId:id, itemType:type))"
      )
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .limit(100)
      .order("createdAt", { ascending: false }),
    client
      .from("purchaseOrderLine")
      .select(
        "id, ...purchaseOrder(documentReadableId:purchaseOrderId, documentId:id)"
      )
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .limit(100)
      .order("createdAt", { ascending: false }),
    client
      .from("receiptLine")
      .select("id, ...receipt(documentReadableId:receiptId, documentId:id)")
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .limit(100)
      .order("createdAt", { ascending: false }),
    client
      .from("quoteLine")
      .select(
        "id, methodType, ...quote(documentReadableId:quoteId, documentId:id)"
      )
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .limit(100),

    client
      .from("quoteMaterial")
      .select(
        "id, methodType, documentParentId:quoteId, documentId:quoteLineId, ...quoteLine(...item(documentReadableId:readableIdWithRevision))"
      )
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .limit(100)
      .order("createdAt", { ascending: false }),
    client
      .from("salesOrderLine")
      .select(
        "id, methodType, ...salesOrder(documentReadableId:salesOrderId, documentId:id)"
      )
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .limit(100)
      .order("createdAt", { ascending: false }),
    client
      .from("shipmentLine")
      .select("id, ...shipment(documentReadableId:shipmentId, documentId:id)")
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .limit(100)
      .order("createdAt", { ascending: false }),
    client
      .from("supplierQuoteLine")
      .select(
        "id, ...supplierQuote(documentReadableId:supplierQuoteId, documentId:id)"
      )
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .limit(100),
    getJobMaterialUsageForItem(client, { itemId, companyId })
  ]);

  return {
    issues: issues.data ?? [],
    jobMaterials: jobMaterials.data ?? [],
    jobs: jobs.data ?? [],
    maintenanceDispatchItems: maintenanceDispatchItems.data ?? [],
    methodMaterials: methodMaterials.data ?? [],
    purchaseOrderLines: purchaseOrderLines.data ?? [],
    receiptLines: receiptLines.data ?? [],
    quoteLines: quoteLines.data ?? [],
    quoteMaterials: quoteMaterials.data ?? [],
    salesOrderLines: salesOrderLines.data ?? [],
    shipmentLines: shipmentLines.data ?? [],
    supplierQuotes: supplierQuotes.data ?? [],
    jobMaterialUsage
  };
}

export async function getPickMethod(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string,
  locationId: string
) {
  return client
    .from("pickMethod")
    .select("*")
    .eq("itemId", itemId)
    .eq("companyId", companyId)
    .eq("locationId", locationId)
    .maybeSingle();
}

export async function getPickMethods(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
) {
  return client
    .from("pickMethod")
    .select("*")
    .eq("itemId", itemId)
    .eq("companyId", companyId);
}

export async function getServices(
  client: SupabaseClient<Database>,
  companyId: string,
  args: GenericQueryFilters & {
    search: string | null;
    type: string | null;
    group: string | null;
    supplierId: string | null;
  }
) {
  let query = client
    .from("service")
    .select("*", {
      count: "estimated"
    })
    .eq("companyId", companyId);

  query = setSearchFilter(query, args.search);

  if (args.type) {
    query = query.eq(
      "serviceType",
      args.type as NonNullable<"Internal" | "External">
    );
  }

  if (args.group) {
    query = query.eq("itemPostingGroupId", args.group);
  }

  if (args.supplierId) {
    query = query.contains("supplierIds", [args.supplierId]);
  }

  query = setGenericQueryFilters(query, args, [
    { column: "readableIdWithRevision", ascending: true }
  ]);
  return query;
}

export async function getService(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
) {
  return client
    .from("service")
    .select("*")
    .eq("itemId", itemId)
    .eq("companyId", companyId)
    .single();
}

export async function getServicesList(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return fetchAllFromTable<{
    id: string;
    name: string;
  }>(client, "item", "id, name", (query) =>
    query
      .eq("type", "Service")
      .eq("companyId", companyId)
      .eq("active", true)
      .order("name")
  );
}

export async function getSupplierParts(
  client: SupabaseClient<Database>,
  id: string,
  companyId: string
) {
  return client
    .from("supplierPart")
    .select("*")
    .eq("active", true)
    .eq("itemId", id)
    .eq("companyId", companyId);
}

export async function getTool(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
) {
  return client
    .rpc("get_tool_details", {
      item_id: itemId
    })
    .single();
}

// tools-view projection: heavy per-row aggregates pruned (`supplierIds` kept in
// the view for the supplier filter, `externalId`), and `revisions` fetched
// per-page via itemRevisions (Tools shows a revision switcher).
const TOOL_LIST_COLUMNS =
  "active, assignee, defaultMethodType, sourcingType, description, itemTrackingType, name, replenishmentSystem, unitOfMeasureCode, notes, revision, readableId, readableIdWithRevision, id, companyId, thumbnailPath, modelPath, modelName, modelSize, unitOfMeasure, customFields, tags, itemPostingGroupId, createdBy, createdAt, updatedBy, updatedAt";

export async function getTools(
  client: SupabaseClient<Database>,
  companyId: string,
  args: GenericQueryFilters & {
    search: string | null;
    supplierId: string | null;
  }
) {
  let query = client
    .from("tools")
    .select(TOOL_LIST_COLUMNS, {
      count: "estimated"
    })
    .eq("companyId", companyId);

  query = setSearchFilter(
    query,
    args.search,
    ITEM_SEARCH_COLUMNS_WITH_SUPPLIER
  );

  if (args.supplierId) {
    query = query.contains("supplierIds", [args.supplierId]);
  }

  const result = await setGenericQueryFilters(query, args, [
    { column: "readableIdWithRevision", ascending: true }
  ]);

  if (result.error || !result.data) return result;
  return {
    ...result,
    data: await attachItemRevisions(
      client as SupabaseClient<any>,
      companyId,
      "Tool",
      result.data
    )
  };
}

export async function getToolsList(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return fetchAllFromTable<{
    id: string;
    name: string;
    readableIdWithRevision: string;
  }>(client, "item", "id, name, readableIdWithRevision", (query) =>
    query
      .eq("type", "Tool")
      .eq("companyId", companyId)
      .eq("active", true)
      .order("name")
  );
}

export async function getUnitOfMeasure(
  client: SupabaseClient<Database>,
  id: string,
  companyId: string
) {
  return client
    .from("unitOfMeasure")
    .select("*")
    .eq("id", id)
    .eq("companyId", companyId)
    .single();
}

export async function getUnitOfMeasures(
  client: SupabaseClient<Database>,
  companyId: string,
  args: GenericQueryFilters & { search: string | null }
) {
  let query = client
    .from("unitOfMeasure")
    .select("*", {
      count: "exact"
    })
    .eq("companyId", companyId);

  if (args.search) {
    query = query.or(`name.ilike.%${args.search}%,code.ilike.%${args.search}%`);
  }

  query = setGenericQueryFilters(query, args, [
    { column: "name", ascending: true }
  ]);
  return query;
}

export async function getUnitOfMeasuresList(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return client
    .from("unitOfMeasure")
    .select("name, code")
    .eq("companyId", companyId)
    .order("name");
}

export async function updateConfigurationParameterGroupOrder(
  client: SupabaseClient<Database>,
  data: z.infer<typeof configurationParameterGroupOrderValidator>
) {
  return client
    .from("configurationParameterGroup")
    .update(sanitize(data))
    .eq("id", data.id);
}

export async function updateDefaultRevision(
  client: SupabaseClient<Database>,
  data: {
    id: string;
    updatedBy: string;
  }
) {
  const [item, makeMethod] = await Promise.all([
    client
      .from("item")
      .select("id,readableId, readableIdWithRevision, type, companyId")
      .eq("id", data.id)
      .single(),
    client
      .from("activeMakeMethods")
      .select("id, version")
      .eq("itemId", data.id)
      .maybeSingle()
  ]);
  if (item.error) return item;
  const { readableId, type, companyId } = item.data;
  if (!companyId) return item;
  const relatedItems = await client
    .from("item")
    .select("id")
    .eq("readableId", readableId)
    .eq("type", type)
    .eq("companyId", companyId);

  const itemIds = relatedItems.data?.map((item) => item.id) ?? [];

  return client
    .from("methodMaterial")
    .update({
      itemId: item.data.id,
      materialMakeMethodId: makeMethod.data?.id
    })
    .in("itemId", itemIds);
}

export async function updateConfigurationParameterOrder(
  client: SupabaseClient<Database>,
  data: Omit<
    z.infer<typeof configurationParameterOrderValidator>,
    "configurationParameterGroupId"
  > & {
    configurationParameterGroupId?: string | null;
    updatedBy: string;
  }
) {
  return client
    .from("configurationParameter")
    .update(sanitize(data))
    .eq("id", data.id);
}

export async function updateItemCost(
  client: SupabaseClient<Database>,
  itemId: string,
  cost: {
    unitCost: number;
    updatedBy: string;
  }
) {
  return client
    .from("itemCost")
    .update({
      ...cost,
      costIsAdjusted: true,
      updatedAt: today(getLocalTimeZone()).toString()
    })
    .eq("itemId", itemId)
    .single();
}

export async function updateMaterialOrder(
  client: SupabaseClient<Database>,
  updates: {
    id: string;
    order: number;
    updatedBy: string;
  }[]
) {
  const updatePromises = updates.map(({ id, order, updatedBy }) =>
    client.from("methodMaterial").update({ order, updatedBy }).eq("id", id)
  );
  return Promise.all(updatePromises);
}

export async function updateOperationOrder(
  client: SupabaseClient<Database>,
  updates: {
    id: string;
    order: number;
    updatedBy: string;
  }[]
) {
  if (updates.length === 0) return [];

  const operationClient = client as SupabaseClient<any>;
  const updatedOperations = await operationClient
    .from("methodOperation")
    .select("id, makeMethodId, order, tags, customFields")
    .in(
      "id",
      updates.map(({ id }) => id)
    );

  if (updatedOperations.error) return [updatedOperations];

  const makeMethodIds = Array.from(
    new Set(
      (updatedOperations.data ?? [])
        .map(
          (operation: { makeMethodId?: string | null }) =>
            operation.makeMethodId
        )
        .filter(Boolean)
    )
  );

  if (makeMethodIds.length > 0) {
    const methodOperations = await operationClient
      .from("methodOperation")
      .select("id, makeMethodId, order, tags, customFields")
      .in("makeMethodId", makeMethodIds);

    if (methodOperations.error) return [methodOperations];

    const updatesById = new Map(
      updates.map((update) => [update.id, update.order] as const)
    );
    const operationsByMethod = new Map<string, any[]>();

    for (const operation of methodOperations.data ?? []) {
      const makeMethodId = operation.makeMethodId;
      if (!makeMethodId) continue;

      const nextOperation = updatesById.has(operation.id)
        ? {
            ...operation,
            order: updatesById.get(operation.id) ?? operation.order
          }
        : operation;

      const operations = operationsByMethod.get(makeMethodId) ?? [];
      operations.push(nextOperation);
      operationsByMethod.set(makeMethodId, operations);
    }

    const violatesStyleCuttingOrder = Array.from(
      operationsByMethod.values()
    ).some((operations) => !isStyleCuttingOperationFirst(operations));

    if (violatesStyleCuttingOrder) {
      return [
        {
          data: null,
          error: {
            message:
              "System-owned Style cutting operations must remain the first process in the bill of process."
          },
          count: null,
          status: 400,
          statusText: "Bad Request"
        }
      ];
    }
  }

  const updatePromises = updates.map(({ id, order, updatedBy }) =>
    client.from("methodOperation").update({ order, updatedBy }).eq("id", id)
  );
  return Promise.all(updatePromises);
}

export async function updateRevision(
  client: SupabaseClient<Database>,
  revision: {
    id: string;
    revision: string;
    updatedBy: string;
  }
) {
  return client
    .from("item")
    .update({
      ...revision,
      updatedAt: today(getLocalTimeZone()).toString()
    })
    .eq("id", revision.id);
}

export async function upsertConfigurationParameter(
  client: SupabaseClient<Database>,
  configurationParameter: z.infer<typeof configurationParameterValidator> & {
    companyId: string;
    userId: string;
  }
) {
  const { userId, ...data } = configurationParameter;
  if (configurationParameter.id) {
    return client
      .from("configurationParameter")
      .update(
        sanitize({
          ...data,
          updatedBy: userId,
          updatedAt: now(getLocalTimeZone()).toAbsoluteString()
        })
      )
      .eq("id", configurationParameter.id);
  }

  let ungroupedGroupId: string | null = null;
  const existingGroups = await client
    .from("configurationParameterGroup")
    .select("id, isUngrouped, sortOrder")
    .eq("itemId", data.itemId);

  const ungroupedGroup = existingGroups.data?.find(
    (group) => group.isUngrouped
  );

  if (ungroupedGroup) {
    ungroupedGroupId = ungroupedGroup.id;
  } else {
    const maxSortOrder =
      existingGroups.data?.reduce(
        (max, group) => Math.max(max, group.sortOrder ?? 1),
        1
      ) ?? 0;
    const ungroupedGroupInsert = await client
      .from("configurationParameterGroup")
      .insert({
        itemId: data.itemId,
        name: "Ungrouped",
        isUngrouped: true,
        sortOrder: maxSortOrder + 1,
        companyId: data.companyId
      })
      .select("id")
      .single();
    if (ungroupedGroupInsert.error) return ungroupedGroupInsert;
    ungroupedGroupId = ungroupedGroupInsert.data.id;
  }

  return client.from("configurationParameter").insert({
    ...data,
    key: data.key ?? "",
    createdBy: userId,
    configurationParameterGroupId: ungroupedGroupId
  });
}

export async function upsertConfigurationParameterGroup(
  client: SupabaseClient<Database>,
  configurationParameterGroup: z.infer<
    typeof configurationParameterGroupValidator
  > & {
    companyId: string;
    itemId: string;
  }
) {
  const { itemId, ...data } = configurationParameterGroup;
  if (configurationParameterGroup.id) {
    return client
      .from("configurationParameterGroup")
      .update({
        name: data.name
      })
      .eq("id", configurationParameterGroup.id);
  }

  const existingGroups = await client
    .from("configurationParameterGroup")
    .select("id, isUngrouped, sortOrder")
    .eq("itemId", itemId);

  const maxSortOrder =
    existingGroups.data?.reduce(
      (max, group) => Math.max(max, group.sortOrder ?? 1),
      1
    ) ?? 0;

  return client.from("configurationParameterGroup").insert({
    ...data,
    itemId,
    name: data.name,
    sortOrder: maxSortOrder + 1
  });
}

export async function upsertConfigurationRule(
  client: SupabaseClient<Database>,
  configurationRule: z.infer<typeof configurationRuleValidator> & {
    itemId: string;
    companyId: string;
    updatedBy: string;
  }
) {
  return client.from("configurationRule").upsert(configurationRule, {
    onConflict: "itemId,field"
  });
}

/**
 * Persist (or clear) the per-item shelf-life policy. Shelf life lives on the
 * "itemShelfLife" table, keyed by itemId. Absence of a row = not managed.
 *
 * Three-way mode handling so this helper can be called from any upsert path
 * safely, including forms that don't surface the shelf-life fields:
 *   - mode undefined         -> no-op. The caller's form didn't opine on
 *                               shelf life; leave whatever row exists alone.
 *   - mode 'NotManaged'      -> explicit opt-out. DELETE any existing row.
 *   - mode 'Fixed Duration' or
 *     'Calculated'           -> UPSERT, clearing fields that don't apply to
 *                               the selected mode so stale values never leak
 *                               between modes.
 *
 * Callers on an item INSERT path should pass companyId so the helper can
 * seed a fresh row without a round-trip; on an UPDATE path where we know
 * the row already exists, companyId is optional.
 */
/**
 * Persist the user's "default storage unit" pick from the item form as a
 * row in the "pickMethod" table. Items are company-wide in Carbon;
 * per-location stocking facts live on pickMethod keyed by
 * (itemId, locationId). Writing the form pick here (rather than as
 * columns on "item") respects that boundary and lets a single item
 * accumulate multiple location defaults over time.
 *
 * The locationId for the pickMethod row is derived from the chosen
 * storageUnit (every storageUnit belongs to exactly one location), so
 * the caller only needs to pass the storageUnitId. This keeps the item
 * form to a single "Default Storage Unit" field - the location is
 * implicit.
 *
 * Semantics:
 *   - storageUnitId undefined -> no-op. Forms that don't surface this
 *     field (e.g. the manufacturing sub-form) can share an action
 *     without accidentally creating or clobbering a pickMethod row.
 *   - storageUnitId set -> UPSERT on (itemId, storageUnit.locationId).
 *     Existing defaultStorageUnit for that location is overwritten with
 *     the new pick.
 */
export async function upsertItemDefaultPickMethod(
  client: SupabaseClient<Database>,
  args: {
    itemId: string;
    userId: string;
    storageUnitId?: string;
  }
) {
  if (!args.storageUnitId) {
    return { data: null, error: null };
  }

  const storageUnit = await client
    .from("storageUnit")
    .select("locationId, companyId")
    .eq("id", args.storageUnitId)
    .single();
  if (storageUnit.error || !storageUnit.data) return storageUnit;

  return client.from("pickMethod").upsert(
    {
      itemId: args.itemId,
      locationId: storageUnit.data.locationId,
      defaultStorageUnitId: args.storageUnitId,
      companyId: storageUnit.data.companyId,
      createdBy: args.userId,
      updatedBy: args.userId,
      updatedAt: today(getLocalTimeZone()).toString()
    },
    { onConflict: "itemId,locationId" }
  );
}

/**
 * Return the distinct processIds referenced by methodOperation rows on the
 * item's active makeMethod. Used to scope the shelf-life trigger-process
 * picker to processes the recipe will actually run, so users can't pick a
 * process the trigger never matches against (the set-shelf-life helper short-circuits
 * on processId mismatch). Empty array when the item has no active recipe.
 */
export async function getRecipeProcessIdsForItem(
  client: SupabaseClient<Database>,
  itemId: string
) {
  const makeMethod = await client
    .from("activeMakeMethods")
    .select("id")
    .eq("itemId", itemId)
    .maybeSingle();
  if (makeMethod.error || !makeMethod.data?.id) {
    return { data: [] as string[], error: makeMethod.error ?? null };
  }
  const operations = await client
    .from("methodOperation")
    .select("processId")
    .eq("makeMethodId", makeMethod.data.id);
  if (operations.error) {
    return { data: [] as string[], error: operations.error };
  }
  const ids = Array.from(
    new Set(
      (operations.data ?? [])
        .map((o) => o.processId)
        .filter((id): id is string => !!id)
    )
  );
  return { data: ids, error: null };
}

/**
 * Fetch the shelf-life policy for an item. Returns `data: null` (without
 * an error) when the item has no row, since absence = "not managed" and
 * that's a valid state we don't want to treat as an error path.
 */
export async function getItemShelfLife(
  client: SupabaseClient<Database>,
  itemId: string
) {
  return client
    .from("itemShelfLife")
    .select("mode, days, triggerProcessId, triggerTiming, calculateFromBom")
    .eq("itemId", itemId)
    .maybeSingle();
}

/**
 * Returns true when the item's active make-method has at least one BOM
 * input with a managed shelf-life policy. Used to surface a warning when
 * the user picks a BOM-driven shelf-life mode (Calculated, or Fixed
 * Duration with calculateFromBom) but no input would actually contribute
 * an expiry date.
 *
 * Returns false when there is no make-method, no materials, or every
 * material has shelf-life NotManaged. Errors are coerced to false — this
 * is a UI hint, not a correctness gate.
 */
export async function getBomHasShelfLifeManagedInput(
  client: SupabaseClient<Database>,
  itemId: string,
  companyId: string
): Promise<boolean> {
  const makeMethods = await getMakeMethods(client, itemId, companyId);
  if (makeMethods.error || !makeMethods.data?.length) return false;

  const active =
    makeMethods.data.find((m) => m.status === "Active") ?? makeMethods.data[0];

  const materials = await getMethodMaterialsByMakeMethod(client, active.id);
  const inputItemIds = (materials.data ?? [])
    .map((m) => m.itemId)
    .filter((id): id is string => !!id);
  if (inputItemIds.length === 0) return false;

  // Any row in itemShelfLife is by definition managed - the upsert path
  // deletes the row when mode = 'NotManaged' and the column enum has no
  // such value, so presence is sufficient.
  const managed = await client
    .from("itemShelfLife")
    .select("itemId")
    .in("itemId", inputItemIds)
    .limit(1);

  return !managed.error && (managed.data?.length ?? 0) > 0;
}

export async function upsertItemShelfLife(
  client: SupabaseClient<Database>,
  args: {
    itemId: string;
    userId: string;
    companyId?: string;
    mode?: (typeof shelfLifeModes)[number];
    days?: number;
    triggerProcessId?: string;
    triggerTiming?: (typeof shelfLifeTriggerTimings)[number];
    calculateFromBom?: boolean;
  }
) {
  if (args.mode === undefined) {
    return { data: null, error: null };
  }

  if (args.mode === "NotManaged") {
    return client.from("itemShelfLife").delete().eq("itemId", args.itemId);
  }

  const days = args.mode === "Fixed Duration" ? (args.days ?? null) : null;
  const triggerProcessId =
    args.mode === "Fixed Duration" ? (args.triggerProcessId ?? null) : null;
  // triggerTiming only matters when there's a trigger process. Reset to the
  // default 'After' otherwise so the column never carries a stale value
  // from a prior config.
  const triggerTiming = triggerProcessId
    ? (args.triggerTiming ?? "After")
    : "After";
  // Calculate-from-BOM is meaningful only on Fixed Duration; the table
  // CHECK enforces the same rule. Coerce any stale flag back to false on
  // mode switches so the row never carries an inconsistent combo.
  const calculateFromBom =
    args.mode === "Fixed Duration" ? (args.calculateFromBom ?? false) : false;

  // Reject trigger processes that aren't on the item's active recipe.
  // The set-shelf-life helper gates on processId equality, so a process
  // outside the recipe would never match and the expiry start date would
  // silently never get set. Mirrors the guard inside
  // upsertPickMethodWithShelfLife.
  if (triggerProcessId) {
    const recipe = await getRecipeProcessIdsForItem(client, args.itemId);
    if (recipe.error) {
      return { data: null, error: recipe.error } as any;
    }
    if (!recipe.data.includes(triggerProcessId)) {
      return {
        data: null,
        error: {
          message:
            "Shelf-life trigger process must be one of the operations on this item's recipe",
          details: "",
          hint: "",
          code: "shelf_life_trigger_process_not_in_recipe"
        }
      } as any;
    }
  }

  const existing = await client
    .from("itemShelfLife")
    .select("itemId")
    .eq("itemId", args.itemId)
    .maybeSingle();

  if (existing.error) return existing;

  if (existing.data) {
    return client
      .from("itemShelfLife")
      .update({
        mode: args.mode,
        days,
        triggerProcessId,
        triggerTiming,
        calculateFromBom,
        updatedBy: args.userId,
        updatedAt: new Date().toISOString()
      })
      .eq("itemId", args.itemId);
  }

  let companyId = args.companyId;
  if (!companyId) {
    const itemRow = await client
      .from("item")
      .select("companyId")
      .eq("id", args.itemId)
      .single();
    if (itemRow.error || !itemRow.data) return itemRow;
    companyId = itemRow.data.companyId ?? undefined;
  }

  return client.from("itemShelfLife").insert({
    itemId: args.itemId,
    mode: args.mode!,
    days,
    triggerProcessId,
    triggerTiming,
    calculateFromBom,
    companyId: companyId!,
    createdBy: args.userId
  });
}

/**
 * Atomic counterpart to {@link upsertPickMethod} + {@link upsertItemShelfLife}.
 *
 * The inventory form card submits pickMethod fields and shelf-life fields in
 * the same POST (see pickMethodWithShelfLifeValidator). Writing them through
 * two independent Supabase calls means a failure between the two leaves a
 * partial update committed. This helper runs both writes inside a single
 * Postgres transaction via Kysely.
 */
export async function upsertPickMethodWithShelfLife(
  db: Kysely<KyselyDatabase>,
  args: {
    itemId: string;
    locationId: string;
    defaultStorageUnitId?: string | null;
    sortMethod?: (typeof pickMethodSortMethods)[number];
    customFields?: Json;
    userId: string;
    shelfLife: {
      mode?: (typeof shelfLifeModes)[number];
      days?: number;
      triggerProcessId?: string;
      triggerTiming?: (typeof shelfLifeTriggerTimings)[number];
      calculateFromBom?: boolean;
    };
  }
) {
  const updatedAt = now(getLocalTimeZone()).toAbsoluteString();

  return db.transaction().execute(async (trx) => {
    await trx
      .updateTable("pickMethod")
      .set({
        defaultStorageUnitId: args.defaultStorageUnitId ?? null,
        // Only overwrite when the caller surfaced the field; the column is
        // NOT NULL DEFAULT 'Default' so we never set it null.
        ...(args.sortMethod ? { sortMethod: args.sortMethod } : {}),
        customFields: args.customFields ?? null,
        updatedBy: args.userId,
        updatedAt
      })
      .where("itemId", "=", args.itemId)
      .where("locationId", "=", args.locationId)
      .execute();

    const { mode, days, triggerProcessId, triggerTiming, calculateFromBom } =
      args.shelfLife;

    // mode undefined = caller didn't surface the field; leave any existing
    // row alone (matches upsertItemShelfLife semantics).
    if (mode === undefined) return;

    if (mode === "NotManaged") {
      await trx
        .deleteFrom("itemShelfLife")
        .where("itemId", "=", args.itemId)
        .execute();
      return;
    }

    const normalizedDays = mode === "Fixed Duration" ? (days ?? null) : null;
    const normalizedTriggerProcess =
      mode === "Fixed Duration" ? (triggerProcessId ?? null) : null;
    const normalizedTriggerTiming = normalizedTriggerProcess
      ? (triggerTiming ?? "After")
      : "After";
    const normalizedCalcFromBom =
      mode === "Fixed Duration" ? (calculateFromBom ?? false) : false;

    // Reject trigger processes that aren't on the item's active recipe.
    // The set-shelf-life helper gates on processId equality, so picking a
    // process the recipe never runs would silently never set the expiry.
    if (normalizedTriggerProcess) {
      const recipeProcessIds = await trx
        .selectFrom("methodOperation as mo")
        .innerJoin("activeMakeMethods as amm", "amm.id", "mo.makeMethodId")
        .select("mo.processId")
        .where("amm.itemId", "=", args.itemId)
        .where("mo.processId", "is not", null)
        .execute();
      const allowed = new Set(
        recipeProcessIds
          .map((r) => r.processId)
          .filter((id): id is string => !!id)
      );
      if (!allowed.has(normalizedTriggerProcess)) {
        throw new Error(
          "Shelf-life trigger process must be one of the operations on this item's recipe"
        );
      }
    }

    const existing = await trx
      .selectFrom("itemShelfLife")
      .select("itemId")
      .where("itemId", "=", args.itemId)
      .executeTakeFirst();

    if (existing) {
      await trx
        .updateTable("itemShelfLife")
        .set({
          mode,
          days: normalizedDays,
          triggerProcessId: normalizedTriggerProcess,
          triggerTiming: normalizedTriggerTiming,
          calculateFromBom: normalizedCalcFromBom,
          updatedBy: args.userId,
          updatedAt
        })
        .where("itemId", "=", args.itemId)
        .execute();
      return;
    }

    const itemRow = await trx
      .selectFrom("item")
      .select("companyId")
      .where("id", "=", args.itemId)
      .executeTakeFirstOrThrow();

    if (!itemRow.companyId) {
      throw new Error(`Item ${args.itemId} has no companyId`);
    }

    await trx
      .insertInto("itemShelfLife")
      .values({
        itemId: args.itemId,
        mode,
        days: normalizedDays,
        triggerProcessId: normalizedTriggerProcess,
        triggerTiming: normalizedTriggerTiming,
        calculateFromBom: normalizedCalcFromBom,
        companyId: itemRow.companyId,
        createdBy: args.userId
      })
      .execute();
  });
}

/**
 * Cascades a change to item.itemTrackingType onto the snapshot columns
 * `requiresSerialTracking` and `requiresBatchTracking` on child rows that
 * belong to OPEN parents (jobs, receipts, shipments, stock transfers).
 *
 * Without this, snapshot flags drift from the live item value and leave the
 * UI reading stale (often sticky-true) tracking flags after an item is
 * flipped back to Inventory / Non-Inventory.
 */
export async function cascadeItemTrackingType(
  db: Kysely<KyselyDatabase>,
  args: {
    itemIds: string[];
    companyId: string;
    newType: InventoryItemType;
    userId: string;
  }
) {
  if (args.itemIds.length === 0) return;

  const requiresSerialTracking = args.newType === ItemTrackingType.Serial;
  const requiresBatchTracking = args.newType === ItemTrackingType.Batch;
  const updatedAt = now(getLocalTimeZone()).toAbsoluteString();

  return db.transaction().execute(async (trx) => {
    await trx
      .updateTable("jobMakeMethod")
      .set({
        requiresSerialTracking,
        requiresBatchTracking,
        updatedBy: args.userId,
        updatedAt
      })
      .where("itemId", "in", args.itemIds)
      .where("companyId", "=", args.companyId)
      .where((eb) =>
        eb(
          "jobId",
          "in",
          eb
            .selectFrom("job")
            .select("id")
            .where("companyId", "=", args.companyId)
            .where("status", "in", ["Draft", "Planned"])
        )
      )
      .execute();

    await trx
      .updateTable("jobMaterial")
      .set({
        requiresSerialTracking,
        requiresBatchTracking,
        updatedBy: args.userId,
        updatedAt
      })
      .where("itemId", "in", args.itemIds)
      .where("companyId", "=", args.companyId)
      .where((eb) =>
        eb(
          "jobId",
          "in",
          eb
            .selectFrom("job")
            .select("id")
            .where("companyId", "=", args.companyId)
            .where("status", "in", ["Draft", "Planned"])
        )
      )
      .execute();

    await trx
      .updateTable("receiptLine")
      .set({
        requiresSerialTracking,
        requiresBatchTracking,
        updatedBy: args.userId,
        updatedAt
      })
      .where("itemId", "in", args.itemIds)
      .where("companyId", "=", args.companyId)
      .where((eb) =>
        eb(
          "receiptId",
          "in",
          eb
            .selectFrom("receipt")
            .select("id")
            .where("companyId", "=", args.companyId)
            .where("status", "=", "Draft")
        )
      )
      .execute();

    await trx
      .updateTable("shipmentLine")
      .set({
        requiresSerialTracking,
        requiresBatchTracking,
        updatedBy: args.userId,
        updatedAt
      })
      .where("itemId", "in", args.itemIds)
      .where("companyId", "=", args.companyId)
      .where((eb) =>
        eb(
          "shipmentId",
          "in",
          eb
            .selectFrom("shipment")
            .select("id")
            .where("companyId", "=", args.companyId)
            .where("status", "=", "Draft")
        )
      )
      .execute();

    await trx
      .updateTable("stockTransferLine")
      .set({
        requiresSerialTracking,
        requiresBatchTracking,
        updatedBy: args.userId,
        updatedAt
      })
      .where("itemId", "in", args.itemIds)
      .where("companyId", "=", args.companyId)
      .where((eb) =>
        eb(
          "stockTransferId",
          "in",
          eb
            .selectFrom("stockTransfer")
            .select("id")
            .where("companyId", "=", args.companyId)
            .where("status", "=", "Draft")
        )
      )
      .execute();
  });
}

/**
 * Updates item-level method/sourcing columns and mirrors the change down to
 * every methodMaterial that references the item — in a single transaction, so
 * the item and its mirrors can never be left half-applied.
 *
 * sourcingType and defaultMethodType are item-level properties; method
 * materials are read-only mirrors. Only mirrors on Draft make methods are
 * touched — Active and Archived methods are frozen.
 */
export async function updateItemMethodAndSourcing(
  db: Kysely<KyselyDatabase>,
  args: {
    itemIds: string[];
    companyId: string;
    userId: string;
    itemUpdate: {
      replenishmentSystem?: Database["public"]["Enums"]["itemReplenishmentSystem"];
      defaultMethodType?: MethodType;
      sourcingType?: SourcingType;
    };
    cascade: {
      sourcingType?: SourcingType;
      methodType?: MethodType;
    };
  }
) {
  if (args.itemIds.length === 0) return;

  const updatedAt = now(getLocalTimeZone()).toAbsoluteString();

  return db.transaction().execute(async (trx) => {
    await trx
      .updateTable("item")
      .set({ ...args.itemUpdate, updatedBy: args.userId, updatedAt })
      .where("id", "in", args.itemIds)
      .where("companyId", "=", args.companyId)
      .execute();

    await cascadeSourcingAndMethodTypeToMethodMaterials(trx, {
      itemIds: args.itemIds,
      companyId: args.companyId,
      userId: args.userId,
      newSourcingType: args.cascade.sourcingType,
      newMethodType: args.cascade.methodType
    });
  });
}

/**
 * Mirrors an item's sourcingType/methodType onto every methodMaterial that
 * references it. Operates on a caller-supplied transaction so it composes with
 * the item update above. Only method materials on Draft make methods are
 * touched.
 */
async function cascadeSourcingAndMethodTypeToMethodMaterials(
  trx: KyselyTx,
  args: {
    itemIds: string[];
    companyId: string;
    userId: string;
    newSourcingType?: SourcingType;
    newMethodType?: MethodType;
  }
) {
  if (args.itemIds.length === 0) return;
  if (!args.newSourcingType && !args.newMethodType) return;

  const updatedAt = now(getLocalTimeZone()).toAbsoluteString();

  // Restrict to method materials whose make method is still Draft.
  const onDraftMakeMethod = (
    eb: ExpressionBuilder<KyselyDatabase, "methodMaterial">
  ) =>
    eb(
      "makeMethodId",
      "in",
      eb
        .selectFrom("makeMethod")
        .select("id")
        .where("companyId", "=", args.companyId)
        .where("status", "=", "Draft")
    );

  const baseSet: {
    updatedBy: string;
    updatedAt: string;
    sourcingType?: SourcingType;
  } = {
    updatedBy: args.userId,
    updatedAt
  };
  if (args.newSourcingType) baseSet.sourcingType = args.newSourcingType;

  await trx
    .updateTable("methodMaterial")
    .set((eb) => ({
      ...baseSet,
      ...(args.newMethodType === "Make to Order"
        ? {
            methodType: "Make to Order" as const,
            // materialMakeMethodId points at the component item's active make
            // method (mirrors upsertMethodMaterial). Resolved with a correlated
            // subquery so a single statement covers every item; null when the
            // component has no active make method.
            materialMakeMethodId: eb
              .selectFrom("activeMakeMethods")
              .select("id")
              .whereRef(
                "activeMakeMethods.itemId",
                "=",
                "methodMaterial.itemId"
              )
              .where("activeMakeMethods.companyId", "=", args.companyId)
              .limit(1)
          }
        : args.newMethodType
          ? { methodType: args.newMethodType, materialMakeMethodId: null }
          : {})
    }))
    .where("itemId", "in", args.itemIds)
    .where("companyId", "=", args.companyId)
    .where(onDraftMakeMethod)
    .execute();
}

export async function upsertConsumable(
  client: SupabaseClient<Database>,
  consumable:
    | (z.infer<typeof consumableValidator> & {
        companyId: string;
        createdBy: string;
        customFields?: Json;
      })
    | (z.infer<typeof consumableValidator> & {
        updatedBy: string;
        customFields?: Json;
      })
) {
  if ("createdBy" in consumable) {
    const itemInsert = await client
      .from("item")
      .insert({
        readableId: consumable.id,
        name: consumable.name,
        description: consumable.description,
        type: "Consumable",
        replenishmentSystem: consumable.replenishmentSystem,
        defaultMethodType: consumable.defaultMethodType,
        itemTrackingType: consumable.itemTrackingType,
        unitOfMeasureCode: consumable.unitOfMeasureCode,
        active: true,
        thumbnailPath: consumable.thumbnailPath,
        attributeSetId: consumable.attributeSetId || null,
        companyId: consumable.companyId,
        createdBy: consumable.createdBy
      } as any)
      .select("id")
      .single();
    if (itemInsert.error) return itemInsert;
    const itemId = itemInsert.data?.id;

    const [consumableInsert, itemCostUpdate] = await Promise.all([
      client.from("consumable").upsert({
        id: consumable.id,
        companyId: consumable.companyId,
        createdBy: consumable.createdBy,
        customFields: consumable.customFields
      }),
      client
        .from("itemCost")
        .update(
          sanitize({
            itemPostingGroupId: consumable.postingGroupId,
            unitCost: consumable.unitCost
          })
        )
        .eq("itemId", itemId)
    ]);

    if (consumableInsert.error) return consumableInsert;
    if (itemCostUpdate.error) return itemCostUpdate;

    if (itemId) {
      const pickMethod = await upsertItemDefaultPickMethod(client, {
        itemId,
        userId: consumable.createdBy,
        storageUnitId: consumable.defaultStorageUnitId
      });
      if (pickMethod.error) return pickMethod;

      const shelfLife = await upsertItemShelfLife(client, {
        itemId,
        userId: consumable.createdBy,
        companyId: consumable.companyId,
        mode: consumable.shelfLifeMode,
        days: consumable.shelfLifeDays,
        triggerProcessId: consumable.shelfLifeTriggerProcessId,
        triggerTiming: consumable.shelfLifeTriggerTiming,
        calculateFromBom: consumable.shelfLifeCalculateFromBom
      });
      if (shelfLife.error) return shelfLife;
    }

    const newConsumable = await client
      .from("consumables")
      .select("id")
      .eq("readableId", consumable.id)
      .eq("companyId", consumable.companyId)
      .single();

    return newConsumable;
  }

  const itemUpdate = {
    id: consumable.id,
    name: consumable.name,
    description: consumable.description,
    replenishmentSystem: consumable.replenishmentSystem,
    defaultMethodType: consumable.defaultMethodType,
    itemTrackingType: consumable.itemTrackingType,
    unitOfMeasureCode: consumable.unitOfMeasureCode,
    active: true
  };

  const consumableUpdate = {
    customFields: consumable.customFields
  };

  const [updateItem, updateConsumable] = await Promise.all([
    client
      .from("item")
      .update({
        ...sanitize(itemUpdate),
        updatedAt: today(getLocalTimeZone()).toString()
      })
      .eq("id", consumable.id),
    client
      .from("consumable")
      .update({
        ...sanitize(consumableUpdate),
        updatedAt: today(getLocalTimeZone()).toString()
      })
      .eq("id", consumable.id)
  ]);

  if (updateItem.error) return updateItem;

  const pickMethod = await upsertItemDefaultPickMethod(client, {
    itemId: consumable.id,
    userId: consumable.updatedBy,
    storageUnitId: consumable.defaultStorageUnitId
  });
  if (pickMethod.error) return pickMethod;

  const shelfLife = await upsertItemShelfLife(client, {
    itemId: consumable.id,
    userId: consumable.updatedBy,
    mode: consumable.shelfLifeMode,
    days: consumable.shelfLifeDays,
    triggerProcessId: consumable.shelfLifeTriggerProcessId,
    triggerTiming: consumable.shelfLifeTriggerTiming,
    calculateFromBom: consumable.shelfLifeCalculateFromBom
  });
  if (shelfLife.error) return shelfLife;

  return updateConsumable;
}

export async function upsertPart(
  client: SupabaseClient<Database>,
  part:
    | (z.infer<typeof partValidator> & {
        companyId: string;
        createdBy: string;
        customFields?: Json;
      })
    | (z.infer<typeof partValidator> & {
        updatedBy: string;
        customFields?: Json;
      })
) {
  if ("createdBy" in part) {
    const itemInsert = await client
      .from("item")
      .insert({
        readableId: part.id,
        revision: part.revision ?? "0",
        name: part.name,
        description: part.description,
        type: "Part",
        replenishmentSystem: part.replenishmentSystem,
        defaultMethodType: part.defaultMethodType,
        itemTrackingType: part.itemTrackingType,
        unitOfMeasureCode: part.unitOfMeasureCode,
        active: true,
        modelUploadId: part.modelUploadId,
        thumbnailPath: part.thumbnailPath,
        companyId: part.companyId,
        createdBy: part.createdBy
      })
      .select("id")
      .single();
    if (itemInsert.error) return itemInsert;
    const itemId = itemInsert.data?.id;

    const [partInsert, itemCostUpdate] = await Promise.all([
      client.from("part").upsert({
        id: part.id,
        companyId: part.companyId,
        createdBy: part.createdBy,
        customFields: part.customFields
      }),
      client
        .from("itemCost")
        .update(
          sanitize({
            itemPostingGroupId: part.postingGroupId,
            unitCost:
              part.replenishmentSystem !== "Make" ? part.unitCost : undefined
          })
        )
        .eq("itemId", itemId)
    ]);

    if (partInsert.error) return partInsert;
    if (itemCostUpdate.error) {
      console.error(itemCostUpdate.error);
    }

    if (part.replenishmentSystem !== "Buy") {
      const itemReplenishmentInsert = await client
        .from("itemReplenishment")
        .update({ lotSize: part.lotSize })
        .eq("itemId", itemId);

      if (itemReplenishmentInsert.error) return itemReplenishmentInsert;
    }

    if (itemId) {
      const pickMethod = await upsertItemDefaultPickMethod(client, {
        itemId,
        userId: part.createdBy,
        storageUnitId: part.defaultStorageUnitId
      });
      if (pickMethod.error) return pickMethod;

      const shelfLife = await upsertItemShelfLife(client, {
        itemId,
        userId: part.createdBy,
        companyId: part.companyId,
        mode: part.shelfLifeMode,
        days: part.shelfLifeDays,
        triggerProcessId: part.shelfLifeTriggerProcessId,
        triggerTiming: part.shelfLifeTriggerTiming,
        calculateFromBom: part.shelfLifeCalculateFromBom
      });
      if (shelfLife.error) return shelfLife;
    }

    const newPart = await client
      .from("parts")
      .select("id")
      .eq("readableId", part.id)
      .eq("companyId", part.companyId)
      .single();

    return newPart;
  }

  const itemUpdate = {
    id: part.id,
    name: part.name,
    description: part.description,
    replenishmentSystem: part.replenishmentSystem,
    defaultMethodType: part.defaultMethodType,
    itemTrackingType: part.itemTrackingType,
    unitOfMeasureCode: part.unitOfMeasureCode,
    active: true
  };

  const partUpdate = {
    customFields: part.customFields
  };

  const [updateItem, updatePart] = await Promise.all([
    client
      .from("item")
      .update({
        ...sanitize(itemUpdate),
        updatedAt: today(getLocalTimeZone()).toString()
      })
      .eq("id", part.id),
    client
      .from("part")
      .update({
        ...sanitize(partUpdate),
        updatedAt: today(getLocalTimeZone()).toString()
      })
      .eq("id", part.id)
  ]);

  if (updateItem.error) return updateItem;

  const pickMethod = await upsertItemDefaultPickMethod(client, {
    itemId: part.id,
    userId: part.updatedBy,
    storageUnitId: part.defaultStorageUnitId
  });
  if (pickMethod.error) return pickMethod;

  const shelfLife = await upsertItemShelfLife(client, {
    itemId: part.id,
    userId: part.updatedBy,
    mode: part.shelfLifeMode,
    days: part.shelfLifeDays,
    triggerProcessId: part.shelfLifeTriggerProcessId,
    triggerTiming: part.shelfLifeTriggerTiming,
    calculateFromBom: part.shelfLifeCalculateFromBom
  });
  if (shelfLife.error) return shelfLife;

  return updatePart;
}

export async function upsertStyle(
  client: SupabaseClient<Database>,
  style:
    | (z.infer<typeof styleValidator> & {
        companyId: string;
        createdBy: string;
        customFields?: Json;
      })
    | (z.infer<typeof styleValidator> & {
        updatedBy: string;
        customFields?: Json;
      })
) {
  const styleClient = client as SupabaseClient<any>;

  if ("createdBy" in style) {
    const itemInsert = await client
      .from("item")
      .insert({
        readableId: style.id,
        revision: style.revision ?? "0",
        name: style.name,
        description: style.description,
        type: "Style",
        replenishmentSystem: style.replenishmentSystem,
        defaultMethodType: style.defaultMethodType,
        itemTrackingType: style.itemTrackingType,
        unitOfMeasureCode: style.unitOfMeasureCode,
        active: true,
        modelUploadId: style.modelUploadId,
        thumbnailPath: style.thumbnailPath,
        companyId: style.companyId,
        createdBy: style.createdBy
      })
      .select("id")
      .single();

    if (itemInsert.error) return itemInsert;
    const itemId = itemInsert.data?.id;

    const [styleInsert, itemCostUpdate] = await Promise.all([
      styleClient.from("style").upsert({
        id: style.id,
        companyId: style.companyId,
        createdBy: style.createdBy,
        customFields: style.customFields
      }),
      client
        .from("itemCost")
        .update(
          sanitize({
            itemPostingGroupId: style.postingGroupId,
            unitCost:
              style.replenishmentSystem !== "Make" ? style.unitCost : undefined
          })
        )
        .eq("itemId", itemId)
    ]);

    if (styleInsert.error) return styleInsert;
    if (itemCostUpdate.error) {
      console.error(itemCostUpdate.error);
    }

    if (style.replenishmentSystem !== "Buy") {
      const itemReplenishmentInsert = await client
        .from("itemReplenishment")
        .update({ lotSize: style.lotSize })
        .eq("itemId", itemId);

      if (itemReplenishmentInsert.error) return itemReplenishmentInsert;
    }

    if (itemId) {
      const pickMethod = await upsertItemDefaultPickMethod(client, {
        itemId,
        userId: style.createdBy,
        storageUnitId: style.defaultStorageUnitId
      });
      if (pickMethod.error) return pickMethod;

      const shelfLife = await upsertItemShelfLife(client, {
        itemId,
        userId: style.createdBy,
        companyId: style.companyId,
        mode: style.shelfLifeMode,
        days: style.shelfLifeDays,
        triggerProcessId: style.shelfLifeTriggerProcessId,
        triggerTiming: style.shelfLifeTriggerTiming,
        calculateFromBom: style.shelfLifeCalculateFromBom
      });
      if (shelfLife.error) return shelfLife;

      const styleMethod = await ensureStyleMethodScaffold(client, {
        itemId,
        companyId: style.companyId,
        userId: style.createdBy
      });
      if (styleMethod.error) return styleMethod;
    }

    const newStyle = await styleClient
      .from("styles")
      .select("id")
      .eq("readableId", style.id)
      .eq("companyId", style.companyId)
      .single();

    return newStyle;
  }

  const itemUpdate = {
    id: style.id,
    name: style.name,
    description: style.description,
    replenishmentSystem: style.replenishmentSystem,
    defaultMethodType: style.defaultMethodType,
    itemTrackingType: style.itemTrackingType,
    unitOfMeasureCode: style.unitOfMeasureCode,
    active: true,
    modelUploadId: style.modelUploadId,
    thumbnailPath: style.thumbnailPath
  };

  const styleUpdate = {
    customFields: style.customFields
  };

  const [updateItem, updateStyle] = await Promise.all([
    client
      .from("item")
      .update({
        ...sanitize(itemUpdate),
        updatedAt: today(getLocalTimeZone()).toString()
      })
      .eq("id", style.id),
    styleClient
      .from("style")
      .update({
        ...sanitize(styleUpdate),
        updatedAt: today(getLocalTimeZone()).toString()
      })
      .eq("id", style.id)
  ]);

  if (updateItem.error) return updateItem;

  const [pickMethod, shelfLife] = await Promise.all([
    upsertItemDefaultPickMethod(client, {
      itemId: style.id,
      userId: style.updatedBy,
      storageUnitId: style.defaultStorageUnitId
    }),
    upsertItemShelfLife(client, {
      itemId: style.id,
      userId: style.updatedBy,
      mode: style.shelfLifeMode,
      days: style.shelfLifeDays,
      triggerProcessId: style.shelfLifeTriggerProcessId,
      triggerTiming: style.shelfLifeTriggerTiming,
      calculateFromBom: style.shelfLifeCalculateFromBom
    })
  ]);

  if (pickMethod.error) return pickMethod;
  if (shelfLife.error) return shelfLife;

  const styleCompany = await styleClient
    .from("item")
    .select("companyId")
    .eq("id", style.id)
    .single();
  if (styleCompany.error) return styleCompany;

  const styleMethod = await ensureStyleMethodScaffold(client, {
    itemId: style.id,
    companyId: styleCompany.data.companyId,
    userId: style.updatedBy
  });
  if (styleMethod.error) return styleMethod;

  if (style.replenishmentSystem !== "Buy") {
    const itemReplenishmentUpdate = await client
      .from("itemReplenishment")
      .update({ lotSize: style.lotSize })
      .eq("itemId", style.id);

    if (itemReplenishmentUpdate.error) return itemReplenishmentUpdate;
  }

  const itemCostUpdate = await client
    .from("itemCost")
    .update(
      sanitize({
        itemPostingGroupId: style.postingGroupId,
        unitCost:
          style.replenishmentSystem !== "Make" ? style.unitCost : undefined
      })
    )
    .eq("itemId", style.id);

  if (itemCostUpdate.error) {
    console.error(itemCostUpdate.error);
  }

  return updateStyle;
}

export async function updateItem(
  client: SupabaseClient<Database>,
  item: z.infer<typeof itemValidator> & {
    companyId: string;
    type: Database["public"]["Enums"]["itemType"];
  }
) {
  return client
    .from("item")
    .update(sanitize(item))
    .eq("id", item.id)
    .eq("companyId", item.companyId);
}

export async function upsertItemCost(
  client: SupabaseClient<Database>,
  itemCost: z.infer<typeof itemCostValidator> & {
    updatedBy: string;
    customFields?: Json;
  }
) {
  return client
    .from("itemCost")
    .update(sanitize(itemCost))
    .eq("itemId", itemCost.itemId);
}

export async function upsertPickMethod(
  client: SupabaseClient<Database>,
  pickMethod:
    | (z.infer<typeof pickMethodValidator> & {
        companyId: string;
        createdBy: string;
        customFields?: Json;
      })
    | (z.infer<typeof pickMethodValidator> & {
        updatedBy: string;
        customFields?: Json;
      })
) {
  if ("createdBy" in pickMethod) {
    return client.from("pickMethod").upsert(pickMethod, {
      onConflict: "itemId,locationId"
    });
  }

  return client
    .from("pickMethod")
    .update(sanitize(pickMethod))
    .eq("itemId", pickMethod.itemId)
    .eq("locationId", pickMethod.locationId);
}

export async function upsertItemManufacturing(
  client: SupabaseClient<Database>,
  partManufacturing: z.infer<typeof itemManufacturingValidator> & {
    updatedBy: string;
    customFields?: Json;
  }
) {
  return client
    .from("itemReplenishment")
    .update(sanitize(partManufacturing))
    .eq("itemId", partManufacturing.itemId);
}

export function itemPlanningSaveErrorMessage(
  err: unknown,
  fallback: string
): string {
  if (err instanceof Error && err.message) return err.message;
  if (
    err &&
    typeof err === "object" &&
    "message" in err &&
    typeof (err as { message: unknown }).message === "string" &&
    (err as { message: string }).message
  ) {
    return (err as { message: string }).message;
  }
  return fallback;
}

export async function upsertItemPlanning(
  client: SupabaseClient<Database>,
  partPlanning:
    | {
        companyId: string;
        itemId: string;
        locationId: string;
        createdBy: string;
      }
    | (z.infer<typeof itemPlanningValidator> & {
        updatedBy: string;
        customFields?: Json;
      }),
  fanOut?: {
    db: Kysely<KyselyDatabase>;
    companyId: string;
    mix?: StyleVariantQuantity[];
  }
) {
  if ("createdBy" in partPlanning) {
    return client.from("itemPlanning").insert(partPlanning);
  }

  const { variantQuantities: _variantQuantities, ...planning } = partPlanning;
  const planningRow = sanitize(planning);

  if (!fanOut) {
    return client
      .from("itemPlanning")
      .update(planningRow)
      .eq("itemId", planning.itemId)
      .eq("locationId", planning.locationId);
  }

  try {
    await copyItemPlanningToVariantChildren(fanOut.db, {
      parentItemId: planning.itemId,
      locationId: planning.locationId,
      companyId: fanOut.companyId,
      updatedBy: planning.updatedBy,
      values: planningRow,
      mix: fanOut.mix
    });
  } catch (copyError) {
    return { data: null, error: copyError };
  }

  return { data: null, error: null };
}

/**
 * Write a parent itemPlanning row onto every variant child SKU at the same
 * location. Mix ratios split stock-target quantities; policy and lot size copy
 * as-is. Inventory/MRP live on children — parent-only saves would no-op.
 */
export async function copyItemPlanningToVariantChildren(
  db: Kysely<KyselyDatabase>,
  args: {
    parentItemId: string;
    locationId: string;
    companyId: string;
    updatedBy: string;
    values: Record<string, unknown>;
    mix?: StyleVariantQuantity[];
  }
) {
  const planningFields = {
    reorderingPolicy: args.values.reorderingPolicy as
      | Database["public"]["Enums"]["itemReorderingPolicy"]
      | undefined,
    demandAccumulationPeriod: args.values.demandAccumulationPeriod as
      | number
      | undefined,
    demandAccumulationSafetyStock: args.values.demandAccumulationSafetyStock as
      | number
      | undefined,
    demandAccumulationIncludesInventory: args.values
      .demandAccumulationIncludesInventory as boolean | undefined,
    reorderPoint: args.values.reorderPoint as number | undefined,
    reorderQuantity: args.values.reorderQuantity as number | undefined,
    maximumInventoryQuantity: args.values.maximumInventoryQuantity as
      | number
      | undefined,
    minimumOrderQuantity: args.values.minimumOrderQuantity as
      | number
      | undefined,
    maximumOrderQuantity: args.values.maximumOrderQuantity as
      | number
      | undefined,
    orderMultiple: args.values.orderMultiple as number | undefined
  };
  const parentCustomFields = (args.values.customFields ?? null) as Json | null;
  const childCustomFields = omitPlanningVariantMixCustomFields(
    args.values.customFields
  ) as Json | null;
  const updatedAt = new Date().toISOString();

  return db.transaction().execute(async (trx) => {
    await trx
      .updateTable("itemPlanning")
      .set({
        ...planningFields,
        customFields: parentCustomFields,
        updatedBy: args.updatedBy,
        updatedAt
      })
      .where("itemId", "=", args.parentItemId)
      .where("locationId", "=", args.locationId)
      .where("companyId", "=", args.companyId)
      .execute();

    const children = await trx
      .selectFrom("itemVariant")
      .select("variantItemId")
      .where("parentItemId", "=", args.parentItemId)
      .where("companyId", "=", args.companyId)
      .execute();

    for (const child of children) {
      if (!child.variantItemId) continue;
      const scaledFields = args.mix?.length
        ? scalePlanningQuantityFieldsForVariant(
            args.values,
            args.mix,
            child.variantItemId
          )
        : {};
      const childFields = {
        ...planningFields,
        ...scaledFields,
        customFields: childCustomFields
      };
      await trx
        .insertInto("itemPlanning")
        .values({
          itemId: child.variantItemId,
          locationId: args.locationId,
          companyId: args.companyId,
          createdBy: args.updatedBy,
          updatedBy: args.updatedBy,
          updatedAt,
          ...childFields
        })
        .onConflict((oc) =>
          oc.columns(["itemId", "locationId"]).doUpdateSet({
            ...childFields,
            updatedBy: args.updatedBy,
            updatedAt
          })
        )
        .execute();
    }
  });
}

export async function upsertItemPurchasing(
  client: SupabaseClient<Database>,
  itemPurchasing: z.infer<typeof itemPurchasingValidator> & {
    updatedBy: string;
  }
) {
  return client
    .from("itemReplenishment")
    .update(sanitize(itemPurchasing))
    .eq("itemId", itemPurchasing.itemId);
}

export async function upsertItemPostingGroup(
  client: SupabaseClient<Database>,
  itemPostingGroup:
    | (Omit<z.infer<typeof itemPostingGroupValidator>, "id"> & {
        companyId: string;
        createdBy: string;
        customFields?: Json;
      })
    | (Omit<z.infer<typeof itemPostingGroupValidator>, "id"> & {
        id: string;
        updatedBy: string;
        customFields?: Json;
      })
) {
  if ("createdBy" in itemPostingGroup) {
    return client
      .from("itemPostingGroup")
      .insert([itemPostingGroup])
      .select("*")
      .single();
  }
  return (
    client
      .from("itemPostingGroup")
      .update(sanitize(itemPostingGroup))
      // @ts-ignore
      .eq("id", itemPostingGroup.id)
      .select("id")
      .single()
  );
}

export async function upsertSupplierPart(
  client: SupabaseClient<Database>,
  supplierPart:
    | (Omit<z.infer<typeof supplierPartValidator>, "id"> & {
        companyId: string;
        createdBy: string;
        customFields?: Json;
      })
    | (Omit<z.infer<typeof supplierPartValidator>, "id"> & {
        id: string;
        updatedBy: string;
        customFields?: Json;
      })
) {
  if ("createdBy" in supplierPart) {
    return client
      .from("supplierPart")
      .insert([supplierPart])
      .select("id")
      .single();
  }
  return client
    .from("supplierPart")
    .update(sanitize(supplierPart))
    .eq("id", supplierPart.id)
    .select("id")
    .single();
}

export async function upsertItemCustomerPart(
  client: SupabaseClient<Database>,
  customerPart:
    | (Omit<z.infer<typeof customerPartValidator>, "id"> & {
        companyId: string;
      })
    | (Omit<z.infer<typeof customerPartValidator>, "id"> & {
        id: string;
      })
) {
  if ("id" in customerPart) {
    return client
      .from("customerPartToItem")
      .update(sanitize(customerPart))
      .eq("id", customerPart.id)
      .select("id")
      .single();
  }
  return client
    .from("customerPartToItem")
    .insert([customerPart])
    .select("id")
    .single();
}

export async function upsertItemUnitSalePrice(
  client: SupabaseClient<Database>,
  itemUnitSalePrice: z.infer<typeof itemUnitSalePriceValidator> & {
    updatedBy: string;
    customFields?: Json;
  }
) {
  return client
    .from("itemUnitSalePrice")
    .update(sanitize(itemUnitSalePrice))
    .eq("itemId", itemUnitSalePrice.itemId);
}

export async function upsertMakeMethodVersion(
  client: SupabaseClient<Database>,
  makeMethodVersion: z.infer<typeof makeMethodVersionValidator> & {
    companyId: string;
    createdBy: string;
  }
) {
  const currentMakeMethod = await client
    .from("makeMethod")
    .select("*")
    .eq("id", makeMethodVersion.copyFromId)
    .eq("companyId", makeMethodVersion.companyId)
    .single();

  if (currentMakeMethod.error) return currentMakeMethod;

  // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
  const { id, version, ...data } = currentMakeMethod.data;

  const insert = await client
    .from("makeMethod")
    .insert({
      ...data,
      status: "Draft",
      version: makeMethodVersion.version,
      createdBy: makeMethodVersion.createdBy
    })
    .select("id, ...item(itemId:id, type)")
    .single();

  if (insert.error) return insert;

  if (makeMethodVersion.activeVersionId) {
    await client
      .from("makeMethod")
      .update({ status: "Active" })
      .eq("id", makeMethodVersion.activeVersionId);
  }

  return insert;
}

/**
 * On BoM material add, seed `methodMaterial.storageUnitIds` with every
 * (locationId -> defaultStorageUnitId) pair configured for the child item
 * in "pickMethod". Values set by the caller win so downstream BoMs
 * constructed with explicit picks are untouched.
 *
 * The JSONB is modelled as Record<locationId, storageUnitId>. Reading all
 * pickMethods (rather than a single "default") matches Carbon's model
 * where an item can be stocked across multiple locations, each with its
 * own preferred bin.
 */
async function resolveMethodMaterialStorageUnitIds(
  client: SupabaseClient<Database>,
  args: {
    itemId?: string | null;
    current?: Record<string, string>;
  }
): Promise<Record<string, string>> {
  const current = { ...(args.current ?? {}) };
  if (!args.itemId) return current;

  const pickMethods = await client
    .from("pickMethod")
    .select("locationId, defaultStorageUnitId")
    .eq("itemId", args.itemId);

  for (const row of pickMethods.data ?? []) {
    if (
      row.locationId &&
      row.defaultStorageUnitId &&
      !current[row.locationId]
    ) {
      current[row.locationId] = row.defaultStorageUnitId;
    }
  }

  return current;
}

export async function upsertMethodMaterial(
  client: SupabaseClient<Database>,

  methodMaterial:
    | (z.infer<typeof methodMaterialValidator> & {
        companyId: string;
        createdBy: string;
        customFields?: Json;
      })
    | (z.infer<typeof methodMaterialValidator> & {
        id: string;
        updatedBy: string;
        customFields?: Json;
      })
) {
  // sourcingType and methodType are item-level properties (edited in the
  // item's Properties sidebar). A methodMaterial is a read-only mirror of its
  // component item, so derive both from the item rather than trusting the
  // submitted form values.
  if (methodMaterial.itemId) {
    const item = await client
      .from("item")
      .select("defaultMethodType, sourcingType")
      .eq("id", methodMaterial.itemId)
      .single();

    if (item.error) return item;
    methodMaterial.methodType =
      item.data.defaultMethodType ?? methodMaterial.methodType;
    methodMaterial.sourcingType = item.data.sourcingType;
  }

  let materialMakeMethodId: string | null = null;
  if (methodMaterial.methodType === "Make to Order") {
    const makeMethod = await client
      .from("activeMakeMethods")
      .select("id, version")
      .eq("itemId", methodMaterial.itemId!)
      .single();

    if (makeMethod.error) return makeMethod;
    materialMakeMethodId = makeMethod.data?.id;
  }

  if ("createdBy" in methodMaterial) {
    // Seed storageUnitIds from the child item's default location/storage-unit
    // if the caller didn't already provide one for that location. Respects
    // the form value when supplied, adds a sensible default otherwise.
    const seededStorageUnitIds = await resolveMethodMaterialStorageUnitIds(
      client,
      {
        itemId: methodMaterial.itemId,
        current: methodMaterial.storageUnitIds as
          | Record<string, string>
          | undefined
      }
    );
    return client
      .from("methodMaterial")
      .insert([
        {
          ...methodMaterial,
          itemId: methodMaterial.itemId!,
          storageUnitIds: seededStorageUnitIds,
          materialMakeMethodId
        }
      ])
      .select("id")
      .single();
  }
  return client
    .from("methodMaterial")
    .update(sanitize({ ...methodMaterial, materialMakeMethodId }))
    .eq("id", methodMaterial.id)
    .select("id")
    .single();
}

/**
 * Insert one methodMaterial per Style/attribute variant SKU (BOM expand).
 * First row keeps the submitted id so temporary BOM rows still clear on success.
 */
export async function insertMethodMaterialsFromVariants(
  client: SupabaseClient<Database>,
  args: {
    base: z.infer<typeof methodMaterialValidator> & {
      companyId: string;
      createdBy: string;
      customFields?: Json;
    };
    variants: Array<{ variantItemId: string; quantity: number }>;
  }
) {
  const { variantQuantities: _vq, ...baseWithoutGrid } =
    args.base as typeof args.base & {
      variantQuantities?: string;
    };
  const ids: string[] = [];
  for (let i = 0; i < args.variants.length; i++) {
    const variant = args.variants[i];
    const result = await upsertMethodMaterial(client, {
      ...baseWithoutGrid,
      id: i === 0 ? args.base.id : nanoid(),
      itemId: variant.variantItemId,
      quantity: variant.quantity,
      order: args.base.order + i,
      companyId: args.base.companyId,
      createdBy: args.base.createdBy,
      customFields: args.base.customFields
    });
    if (result.error) return result;
    if (result.data?.id) ids.push(result.data.id);
  }
  return { data: { ids }, error: null };
}

export async function upsertMethodOperation(
  client: SupabaseClient<Database>,

  methodOperation:
    | (Omit<z.infer<typeof methodOperationValidator>, "id"> & {
        companyId: string;
        createdBy: string;
        customFields?: Json;
      })
    | (z.infer<typeof methodOperationValidator> & {
        companyId: string;
        createdBy: string;
        customFields?: Json;
      })
    | (Omit<z.infer<typeof methodOperationValidator>, "id"> & {
        id: string;
        updatedBy: string;
        customFields?: Json;
      })
) {
  if ("createdBy" in methodOperation) {
    return client
      .from("methodOperation")
      .insert([methodOperation])
      .select("id")
      .single();
  }

  const currentOperation = await client
    .from("methodOperation")
    .select("id, tags, customFields")
    .eq("id", methodOperation.id)
    .single();

  if (currentOperation.error) return currentOperation;
  if (isStyleSystemOwnedOperation(currentOperation.data)) {
    return {
      data: null,
      error: {
        message:
          "System-owned Style cutting operations cannot be edited from the bill of process."
      }
    };
  }

  return client
    .from("methodOperation")
    .update(sanitize(methodOperation))
    .eq("id", methodOperation.id)
    .select("id")
    .single();
}

export async function upsertMethodOperationStep(
  client: SupabaseClient<Database>,
  methodOperationStep:
    | (Omit<z.infer<typeof operationStepValidator>, "id"> & {
        companyId: string;
        createdBy: string;
      })
    | (Omit<
        z.infer<typeof operationStepValidator>,
        "id" | "minValue" | "maxValue"
      > & {
        id: string;
        minValue: number | null;
        maxValue: number | null;
        updatedBy: string;
        updatedAt: string;
      })
) {
  if ("createdBy" in methodOperationStep) {
    return client
      .from("methodOperationStep")
      .insert(methodOperationStep)
      .select("id")
      .single();
  }

  return client
    .from("methodOperationStep")
    .update(sanitize(methodOperationStep))
    .eq("id", methodOperationStep.id)
    .select("id")
    .single();
}

export async function upsertMethodOperationParameter(
  client: SupabaseClient<Database>,
  methodOperationParameter:
    | (Omit<z.infer<typeof operationParameterValidator>, "id"> & {
        companyId: string;
        createdBy: string;
      })
    | (Omit<z.infer<typeof operationParameterValidator>, "id"> & {
        id: string;
        updatedBy: string;
        updatedAt: string;
      })
) {
  if ("createdBy" in methodOperationParameter) {
    return client
      .from("methodOperationParameter")
      .insert(methodOperationParameter)
      .select("id")
      .single();
  }

  return client
    .from("methodOperationParameter")
    .update(sanitize(methodOperationParameter))
    .eq("id", methodOperationParameter.id)
    .select("id")
    .single();
}

export async function upsertMethodOperationTool(
  client: SupabaseClient<Database>,
  methodOperationTool:
    | (Omit<z.infer<typeof operationToolValidator>, "id"> & {
        companyId: string;
        createdBy: string;
      })
    | (Omit<z.infer<typeof operationToolValidator>, "id"> & {
        id: string;
        updatedBy: string;
        updatedAt: string;
      })
) {
  if ("createdBy" in methodOperationTool) {
    return client
      .from("methodOperationTool")
      .insert(methodOperationTool)
      .select("id")
      .single();
  }

  return client
    .from("methodOperationTool")
    .update(sanitize(methodOperationTool))
    .eq("id", methodOperationTool.id)
    .select("id")
    .single();
}

export async function upsertMaterial(
  client: SupabaseClient<Database>,
  material:
    | (z.infer<typeof materialValidator> & {
        companyId: string;
        createdBy: string;
        customFields?: Json;
        sizes?: string[];
      })
    | (z.infer<typeof materialValidator> & {
        updatedBy: string;
        customFields?: Json;
      })
) {
  if ("createdBy" in material) {
    // Collect every newly-created item id across the sizes / no-sizes
    // branches so the shelf-life policy can be applied uniformly.
    const newItemIds: string[] = [];

    if (material.sizes) {
      const itemInserts = await Promise.all(
        material.sizes.map((size) =>
          client
            .from("item")
            .insert({
              readableId: material.id,
              name: material.name,
              description: material.description,
              type: "Material",
              replenishmentSystem: material.replenishmentSystem,
              defaultMethodType: material.defaultMethodType,
              itemTrackingType: material.itemTrackingType,
              unitOfMeasureCode: material.unitOfMeasureCode,
              active: true,
              thumbnailPath: material.thumbnailPath,
              revision: size,
              companyId: material.companyId,
              createdBy: material.createdBy
            })
            .select("id")
            .single()
        )
      );

      const hasErrors = itemInserts.some((insert) => insert.error);
      if (hasErrors) {
        const firstError = itemInserts.find((insert) => insert.error);
        return firstError!;
      }
      for (const insert of itemInserts) {
        if (insert.data?.id) newItemIds.push(insert.data.id);
      }
      const itemCostUpdate = await Promise.all(
        itemInserts.map((insert) =>
          client
            .from("itemCost")
            .update(
              sanitize({
                itemPostingGroupId: material.postingGroupId,
                unitCost: material.unitCost
              })
            )
            .eq("itemId", insert.data?.id ?? "")
        )
      );
      if (itemCostUpdate.some((update) => update.error)) {
        console.error(itemCostUpdate.find((update) => update.error));
      }
    } else {
      const itemInsert = await client
        .from("item")
        .insert({
          readableId: material.id,
          name: material.name,
          description: material.description,
          type: "Material",
          replenishmentSystem: material.replenishmentSystem,
          defaultMethodType: material.defaultMethodType,
          itemTrackingType: material.itemTrackingType,
          unitOfMeasureCode: material.unitOfMeasureCode,
          active: true,
          thumbnailPath: material.thumbnailPath,
          companyId: material.companyId,
          createdBy: material.createdBy
        })
        .select("id")
        .single();
      if (itemInsert.error) return itemInsert;
      const itemId = itemInsert.data?.id;
      if (itemId) newItemIds.push(itemId);
      const itemCostUpdate = await client
        .from("itemCost")
        .update(
          sanitize({
            itemPostingGroupId: material.postingGroupId,
            unitCost: material.unitCost
          })
        )
        .eq("itemId", itemId);
      if (itemCostUpdate.error) {
        console.error(itemCostUpdate.error);
      }
    }

    for (const itemId of newItemIds) {
      const pickMethod = await upsertItemDefaultPickMethod(client, {
        itemId,
        userId: material.createdBy,
        storageUnitId: material.defaultStorageUnitId
      });
      if (pickMethod.error) return pickMethod;

      const shelfLife = await upsertItemShelfLife(client, {
        itemId,
        userId: material.createdBy,
        companyId: material.companyId,
        mode: material.shelfLifeMode,
        days: material.shelfLifeDays,
        triggerProcessId: material.shelfLifeTriggerProcessId,
        triggerTiming: material.shelfLifeTriggerTiming,
        calculateFromBom: material.shelfLifeCalculateFromBom
      });
      if (shelfLife.error) return shelfLife;
    }

    const materialInsert = await client.from("material").upsert({
      id: material.id,
      materialFormId: material.materialFormId,
      materialSubstanceId: material.materialSubstanceId,
      finishId: material.finishId,
      gradeId: material.gradeId,
      dimensionId: material.dimensionId,
      materialTypeId: material.materialTypeId,
      companyId: material.companyId,
      createdBy: material.createdBy,
      customFields: material.customFields
    });

    if (materialInsert.error) return materialInsert;

    const newMaterial = await client
      .from("materials")
      .select("*")
      .eq("readableId", material.id)
      .eq("companyId", material.companyId);

    return {
      data: newMaterial.data?.[0] ?? null,
      error: newMaterial.error
    };
  }

  const itemUpdate = {
    id: material.id,
    name: material.name,
    description: material.description,
    replenishmentSystem: material.replenishmentSystem,
    defaultMethodType: material.defaultMethodType,
    itemTrackingType: material.itemTrackingType,
    unitOfMeasureCode: material.unitOfMeasureCode,
    active: true
  };

  const materialUpdate = {
    materialFormId: material.materialFormId,
    materialSubstanceId: material.materialSubstanceId,
    finishId: material.finishId,
    gradeId: material.gradeId,
    dimensionId: material.dimensionId,
    materialTypeId: material.materialTypeId,
    customFields: material.customFields
  };

  const [updateItem, updateMaterial] = await Promise.all([
    client
      .from("item")
      .update({
        ...sanitize(itemUpdate),
        updatedAt: today(getLocalTimeZone()).toString()
      })
      .eq("id", material.id),
    client
      .from("material")
      .update({
        ...sanitize(materialUpdate),
        updatedAt: today(getLocalTimeZone()).toString()
      })
      .eq("id", material.id)
  ]);

  if (updateItem.error) return updateItem;

  const pickMethod = await upsertItemDefaultPickMethod(client, {
    itemId: material.id,
    userId: material.updatedBy,
    storageUnitId: material.defaultStorageUnitId
  });
  if (pickMethod.error) return pickMethod;

  const shelfLife = await upsertItemShelfLife(client, {
    itemId: material.id,
    userId: material.updatedBy,
    mode: material.shelfLifeMode,
    days: material.shelfLifeDays,
    triggerProcessId: material.shelfLifeTriggerProcessId,
    triggerTiming: material.shelfLifeTriggerTiming,
    calculateFromBom: material.shelfLifeCalculateFromBom
  });
  if (shelfLife.error) return shelfLife;

  return updateMaterial;
}

export async function upsertMaterialDimension(
  client: SupabaseClient<Database>,
  materialDimension:
    | (Omit<z.infer<typeof materialDimensionValidator>, "id"> & {
        companyId: string;
        isMetric: boolean;
      })
    | (Omit<z.infer<typeof materialDimensionValidator>, "id"> & {
        id: string;
      })
) {
  if ("id" in materialDimension) {
    return (
      client
        .from("materialDimension")
        .update(sanitize(materialDimension))
        // @ts-ignore
        .eq("id", materialDimension.id)
        .select("id")
        .single()
    );
  }

  return client
    .from("materialDimension")
    .insert([materialDimension])
    .select("*")
    .single();
}

export async function upsertMaterialFinish(
  client: SupabaseClient<Database>,
  materialFinish:
    | (Omit<z.infer<typeof materialFinishValidator>, "id"> & {
        companyId: string;
      })
    | (Omit<z.infer<typeof materialFinishValidator>, "id"> & {
        id: string;
      })
) {
  if ("id" in materialFinish) {
    return (
      client
        .from("materialFinish")
        .update(sanitize(materialFinish))
        // @ts-ignore
        .eq("id", materialFinish.id)
        .select("id")
        .single()
    );
  }
  return client
    .from("materialFinish")
    .insert([materialFinish])
    .select("*")
    .single();
}

export async function upsertMaterialForm(
  client: SupabaseClient<Database>,
  materialForm:
    | (Omit<z.infer<typeof materialFormValidator>, "id"> & {
        companyId: string;
        createdBy: string;
        customFields?: Json;
      })
    | (Omit<z.infer<typeof materialFormValidator>, "id"> & {
        id: string;
        updatedBy: string;
        customFields?: Json;
      })
) {
  if ("createdBy" in materialForm) {
    return client
      .from("materialForm")
      .insert([materialForm])
      .select("*")
      .single();
  }
  return (
    client
      .from("materialForm")
      .update(sanitize(materialForm))
      // @ts-ignore
      .eq("id", materialForm.id)
      .select("id")
      .single()
  );
}

export async function upsertMaterialGrade(
  client: SupabaseClient<Database>,
  materialGrade:
    | (Omit<z.infer<typeof materialGradeValidator>, "id"> & {
        companyId: string;
      })
    | (Omit<z.infer<typeof materialGradeValidator>, "id"> & {
        id: string;
      })
) {
  if ("id" in materialGrade) {
    return (
      client
        .from("materialGrade")
        .update(sanitize(materialGrade))
        // @ts-ignore
        .eq("id", materialGrade.id)
        .select("id")
        .single()
    );
  }
  return client
    .from("materialGrade")
    .insert([materialGrade])
    .select("*")
    .single();
}

export async function deleteMaterialType(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("materialType").delete().eq("id", id);
}

export async function getMaterialTypes(
  client: SupabaseClient<Database>,
  companyId: string,
  args?: GenericQueryFilters & { search: string | null }
) {
  let query = client
    .from("materialTypes")
    .select("*", { count: "exact" })
    .or(`companyId.eq.${companyId},companyId.is.null`);

  if (args?.search) {
    query = query.ilike("name", `%${args.search}%`);
  }

  query = setGenericQueryFilters(query, args ?? {});
  return query;
}

export async function getMaterialType(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("materialType").select("*").eq("id", id).single();
}

export async function getMaterialTypeList(
  client: SupabaseClient<Database>,
  materialSubstanceId: string,
  materialFormId: string,
  companyId: string
) {
  return client
    .from("materialType")
    .select("*")
    .eq("materialSubstanceId", materialSubstanceId)
    .eq("materialFormId", materialFormId)
    .or(`companyId.eq.${companyId},companyId.is.null`);
}

export async function upsertMaterialType(
  client: SupabaseClient<Database>,
  materialType:
    | (Omit<z.infer<typeof materialTypeValidator>, "id"> & {
        companyId: string;
      })
    | (Omit<z.infer<typeof materialTypeValidator>, "id"> & {
        id: string;
      })
) {
  if ("id" in materialType) {
    return (
      client
        .from("materialType")
        .update(sanitize(materialType))
        // @ts-ignore
        .eq("id", materialType.id)
        .select("id")
        .single()
    );
  }
  return client
    .from("materialType")
    .insert([materialType])
    .select("*")
    .single();
}

export async function upsertMaterialSubstance(
  client: SupabaseClient<Database>,
  materialSubstance:
    | (Omit<z.infer<typeof materialSubstanceValidator>, "id"> & {
        companyId: string;
        createdBy: string;
        customFields?: Json;
      })
    | (Omit<z.infer<typeof materialSubstanceValidator>, "id"> & {
        id: string;
        updatedBy: string;
        customFields?: Json;
      })
) {
  if ("createdBy" in materialSubstance) {
    return client
      .from("materialSubstance")
      .insert([materialSubstance])
      .select("*")
      .single();
  }
  return (
    client
      .from("materialSubstance")
      .update(sanitize(materialSubstance))
      // @ts-ignore
      .eq("id", materialSubstance.id)
      .select("id")
      .single()
  );
}

export async function upsertService(
  client: SupabaseClient<Database>,
  service:
    | (z.infer<typeof serviceValidator> & {
        companyId: string;
        createdBy: string;
        customFields?: Json;
      })
    | (Omit<z.infer<typeof serviceValidator>, "id"> & {
        id: string;
        updatedBy: string;
        customFields?: Json;
      })
) {
  if ("createdBy" in service) {
    const itemInsert = await client
      .from("item")
      .insert({
        readableId: service.id,
        name: service.name,
        type: "Service",
        replenishmentSystem:
          service.serviceType === "External" ? "Buy" : "Make",
        defaultMethodType:
          service.serviceType === "External"
            ? "Purchase to Order"
            : "Make to Order",
        itemTrackingType: service.itemTrackingType,
        unitOfMeasureCode: "EA",
        active: true,
        companyId: service.companyId,
        createdBy: service.createdBy
      })
      .select("id")
      .single();
    if (itemInsert.error) return itemInsert;
    const itemId = itemInsert.data?.id;

    const serviceInsert = await client
      .from("service")
      .insert({
        id: service.id,
        serviceType: service.serviceType,
        companyId: service.companyId,
        createdBy: service.createdBy,
        customFields: service.customFields
      })
      .select("*")
      .single();

    if (serviceInsert.error) return serviceInsert;

    const costUpdate = await client
      .from("itemCost")
      .update({ unitCost: service.unitCost })
      .eq("itemId", itemId)
      .select("*")
      .single();

    if (costUpdate.error) return costUpdate;

    const newService = await client
      .from("service")
      .select("*")
      .eq("readableId", service.id)
      .single();

    return newService;
  }
  const itemUpdate = {
    id: service.id,
    name: service.name,
    description: service.description,
    replenishmentSystem:
      service.serviceType === "External" ? "Buy" : ("Make" as "Buy"),
    defaultMethodType:
      service.serviceType === "External"
        ? "Purchase to Order"
        : ("Make to Order" as "Purchase to Order"),
    itemTrackingType: service.itemTrackingType,
    unitOfMeasureCode: null,
    active: true
  };

  const serviceUpdate = {
    serviceType: service.serviceType
  };

  const [updateItem, updateService] = await Promise.all([
    client
      .from("item")
      .update({
        ...sanitize(itemUpdate),
        updatedAt: today(getLocalTimeZone()).toString()
      })
      .eq("id", service.id),
    client
      .from("service")
      .update({
        ...sanitize(serviceUpdate),
        updatedAt: today(getLocalTimeZone()).toString()
      })
      .eq("itemId", service.id)
  ]);

  if (updateItem.error) return updateItem;
  return updateService;
}

export async function upsertUnitOfMeasure(
  client: SupabaseClient<Database>,
  unitOfMeasure:
    | (Omit<z.infer<typeof unitOfMeasureValidator>, "id"> & {
        companyId: string;
        createdBy: string;
        customFields?: Json;
      })
    | (Omit<z.infer<typeof unitOfMeasureValidator>, "id"> & {
        id: string;
        updatedBy: string;
        customFields?: Json;
      })
) {
  if ("id" in unitOfMeasure) {
    return client
      .from("unitOfMeasure")
      .update(sanitize(unitOfMeasure))
      .eq("id", unitOfMeasure.id)
      .select("id")
      .single();
  }

  return client
    .from("unitOfMeasure")
    .insert([unitOfMeasure])
    .select("id")
    .single();
}

export async function upsertTool(
  client: SupabaseClient<Database>,
  tool:
    | (z.infer<typeof toolValidator> & {
        companyId: string;
        createdBy: string;
        customFields?: Json;
      })
    | (z.infer<typeof toolValidator> & {
        updatedBy: string;
        customFields?: Json;
      })
) {
  if ("createdBy" in tool) {
    const itemInsert = await client
      .from("item")
      .insert({
        readableId: tool.id,
        revision: tool.revision ?? "0",
        name: tool.name,
        description: tool.description,
        type: "Tool",
        replenishmentSystem: tool.replenishmentSystem,
        defaultMethodType: tool.defaultMethodType,
        itemTrackingType: tool.itemTrackingType,
        unitOfMeasureCode: tool.unitOfMeasureCode,
        active: true,
        modelUploadId: tool.modelUploadId,
        thumbnailPath: tool.thumbnailPath,
        companyId: tool.companyId,
        createdBy: tool.createdBy
      })
      .select("id")
      .single();
    if (itemInsert.error) return itemInsert;
    const itemId = itemInsert.data?.id;

    const [toolInsert, itemCostUpdate] = await Promise.all([
      client.from("tool").upsert({
        id: tool.id,
        companyId: tool.companyId,
        createdBy: tool.createdBy,
        customFields: tool.customFields
      }),
      client
        .from("itemCost")
        .update(
          sanitize({
            itemPostingGroupId: tool.postingGroupId,
            unitCost: tool.unitCost
          })
        )
        .eq("itemId", itemId)
    ]);

    if (toolInsert.error) return toolInsert;
    if (itemCostUpdate.error) return itemCostUpdate;

    if (itemId) {
      const pickMethod = await upsertItemDefaultPickMethod(client, {
        itemId,
        userId: tool.createdBy,
        storageUnitId: tool.defaultStorageUnitId
      });
      if (pickMethod.error) return pickMethod;

      const shelfLife = await upsertItemShelfLife(client, {
        itemId,
        userId: tool.createdBy,
        companyId: tool.companyId,
        mode: tool.shelfLifeMode,
        days: tool.shelfLifeDays,
        triggerProcessId: tool.shelfLifeTriggerProcessId,
        triggerTiming: tool.shelfLifeTriggerTiming,
        calculateFromBom: tool.shelfLifeCalculateFromBom
      });
      if (shelfLife.error) return shelfLife;
    }

    const newTool = await client
      .from("tools")
      .select("*")
      .eq("readableId", tool.id)
      .eq("companyId", tool.companyId)
      .single();

    return newTool;
  }

  const itemUpdate = {
    id: tool.id,
    name: tool.name,
    description: tool.description,
    replenishmentSystem: tool.replenishmentSystem,
    defaultMethodType: tool.defaultMethodType,
    itemTrackingType: tool.itemTrackingType,
    unitOfMeasureCode: tool.unitOfMeasureCode,
    active: true
  };

  const toolUpdate = {
    customFields: tool.customFields
  };

  const [updateItem, updateTool] = await Promise.all([
    client
      .from("item")
      .update({
        ...sanitize(itemUpdate),
        updatedAt: today(getLocalTimeZone()).toString()
      })
      .eq("id", tool.id),
    client
      .from("tool")
      .update({
        ...sanitize(toolUpdate),
        updatedAt: today(getLocalTimeZone()).toString()
      })
      .eq("id", tool.id)
  ]);

  if (updateItem.error) return updateItem;

  const pickMethod = await upsertItemDefaultPickMethod(client, {
    itemId: tool.id,
    userId: tool.updatedBy,
    storageUnitId: tool.defaultStorageUnitId
  });
  if (pickMethod.error) return pickMethod;

  const shelfLife = await upsertItemShelfLife(client, {
    itemId: tool.id,
    userId: tool.updatedBy,
    mode: tool.shelfLifeMode,
    days: tool.shelfLifeDays,
    triggerProcessId: tool.shelfLifeTriggerProcessId,
    triggerTiming: tool.shelfLifeTriggerTiming,
    calculateFromBom: tool.shelfLifeCalculateFromBom
  });
  if (shelfLife.error) return shelfLife;

  return updateTool;
}

/**
 * Batch pre-fetch supplier price breaks for multiple items.
 * Builds a SupplierPriceMap keyed by itemId, pooling price break
 * tiers from ALL suppliers for each item.
 *
 * Used by the quote loader to pre-load pricing data for BOM costing.
 */
export async function getSupplierPriceBreaksForItems(
  client: SupabaseClient<Database>,
  itemIds: string[]
): Promise<SupplierPriceMap> {
  if (!itemIds.length) return {};

  const supplierParts = await client
    .from("supplierPart")
    .select("id, itemId, unitPrice")
    .in("itemId", itemIds);

  if (!supplierParts.data?.length) return {};

  const supplierPartIds = supplierParts.data.map((sp) => sp.id);

  const prices = await client
    .from("supplierPartPrice")
    .select("supplierPartId, quantity, unitPrice")
    .in("supplierPartId", supplierPartIds)
    .order("quantity", { ascending: true });

  // Build a lookup from supplierPartId → itemId
  const spToItem = new Map<string, string>();
  for (const sp of supplierParts.data) {
    spToItem.set(sp.id, sp.itemId);
  }

  const result: SupplierPriceMap = {};

  // Initialize entries with fallback prices
  for (const sp of supplierParts.data) {
    if (!result[sp.itemId]) {
      result[sp.itemId] = { priceBreaks: [], fallbackUnitPrice: null };
    }
    const current = result[sp.itemId].fallbackUnitPrice;
    if (sp.unitPrice != null && (current === null || sp.unitPrice < current)) {
      result[sp.itemId].fallbackUnitPrice = sp.unitPrice;
    }
  }

  // Add price breaks
  for (const price of prices.data ?? []) {
    const itemId = spToItem.get(price.supplierPartId);
    if (itemId && result[itemId]) {
      result[itemId].priceBreaks.push({
        quantity: price.quantity,
        unitPrice: price.unitPrice
      });
    }
  }

  return result;
}

/**
 * Async price lookup across ALL suppliers for an item.
 * Delegates to getSupplierPriceBreaksForItems + lookupBuyPriceFromMap.
 *
 * Used in quote creation where the specific supplier isn't known.
 */
export async function lookupBuyPrice(
  client: SupabaseClient<Database>,
  itemId: string,
  qty: number,
  fallbackCost: number
): Promise<number> {
  const map = await getSupplierPriceBreaksForItems(client, [itemId]);
  return lookupBuyPriceFromMap(itemId, qty, map, fallbackCost);
}

/**
 * Fetch price breaks array for a specific supplier part.
 * Used by PO and Invoice forms to cache breaks in state.
 */
export async function getSupplierPartPriceBreaks(
  client: SupabaseClient<Database>,
  supplierPartId: string
): Promise<PriceBreak[]> {
  const result = await client
    .from("supplierPartPrice")
    .select("quantity, unitPrice")
    .eq("supplierPartId", supplierPartId)
    .order("quantity", { ascending: true });

  return (result.data ?? []).map((pb) => ({
    quantity: pb.quantity,
    unitPrice: pb.unitPrice
  }));
}
