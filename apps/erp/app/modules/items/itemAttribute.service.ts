import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Stable system ids seeded in item_attributes_and_variants migration */
export const SYSTEM_ATTRIBUTE = {
  color: "iat_color",
  size: "iat_size"
} as const;

export const SYSTEM_ATTRIBUTE_SET = {
  garment: "ias_garment",
  fabric: "ias_fabric",
  trim: "ias_trim"
} as const;

type Db = SupabaseClient<Database>;

function toError(error: unknown, fallback: string) {
  if (error instanceof Error) return error;
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.length > 0) {
      return new Error(message);
    }
  }
  return new Error(fallback);
}

/** Synthetic configurationParameter-shaped rows for Style qty editors. */
export type SynthesizedConfigurationParameter = {
  id: string;
  itemId: string;
  companyId: string;
  key: string;
  label: string;
  dataType: "list";
  listOptions: string[];
  sortOrder: number;
  configurationParameterGroupId: null;
  createdAt: string;
  createdBy: string;
  updatedAt: null;
  updatedBy: null;
  deletedAt: null;
  deletedBy: null;
  materialFormFilterId: null;
};

/**
 * Build a single list parameter from the item's attribute set + selections so
 * Style qty editors work without configurationParameter dual-write.
 *
 * Returns one list param with key `valuesKey` whose options are the cartesian
 * product of selected attribute codes in **set order** (pipe-joined), matching
 * `itemVariant.valuesKey`. Expand dual-reads legacy Color×Size matrices.
 */
export async function getStyleConfigurationParametersFromAttributes(
  client: Db,
  itemId: string,
  companyId: string
): Promise<SynthesizedConfigurationParameter[]> {
  const db = client as any;

  const { data: item, error: itemErr } = await db
    .from("item")
    .select("attributeSetId")
    .eq("id", itemId)
    .eq("companyId", companyId)
    .maybeSingle();
  if (itemErr) throw itemErr;
  const attributeSetId = item?.attributeSetId as string | null;
  if (!attributeSetId) return [];

  const { data: setAttrs, error: setAttrErr } = await db
    .from("itemAttributeSetAttribute")
    .select("attributeId, sortOrder, itemAttribute:attributeId(id, code, name)")
    .eq("attributeSetId", attributeSetId)
    .order("sortOrder", { ascending: true });
  if (setAttrErr) throw setAttrErr;
  if (!setAttrs?.length) return [];

  const { data: selections, error: selErr } = await db
    .from("itemAttributeSelection")
    .select("attributeId, attributeValueId")
    .eq("itemId", itemId)
    .eq("companyId", companyId);
  if (selErr) throw selErr;
  if (!selections?.length) return [];

  const valueIds = [
    ...new Set(
      (selections as Array<{ attributeValueId: string }>).map(
        (s) => s.attributeValueId
      )
    )
  ];
  const { data: values, error: valErr } = await db
    .from("itemAttributeValue")
    .select("id, attributeId, code, sortOrder")
    .in("id", valueIds)
    .order("sortOrder", { ascending: true })
    .order("code", { ascending: true });
  if (valErr) throw valErr;

  const codesByAttr = new Map<string, string[]>();
  for (const v of values ?? []) {
    if (!v.code) continue;
    const list = codesByAttr.get(v.attributeId) ?? [];
    list.push(v.code);
    codesByAttr.set(v.attributeId, list);
  }

  type SetAttrRow = {
    attributeId: string;
    sortOrder: number;
    itemAttribute: { id: string; code: string; name: string } | null;
  };
  const attrs = (setAttrs as SetAttrRow[])
    .map((row) => ({
      id: row.attributeId,
      code: row.itemAttribute?.code ?? row.attributeId,
      name:
        row.itemAttribute?.name ?? row.itemAttribute?.code ?? row.attributeId,
      codes: codesByAttr.get(row.attributeId) ?? []
    }))
    .filter((a) => a.codes.length > 0);
  if (attrs.length === 0) return [];

  // Cartesian product in set attribute order (do not reverse for matrix).
  let combos: string[][] = [[]];
  for (const attr of attrs) {
    const next: string[][] = [];
    for (const prefix of combos) {
      for (const code of attr.codes) {
        next.push([...prefix, code]);
      }
    }
    combos = next;
  }
  const listOptions = combos.map((parts) => parts.join("|"));

  const nowIso = new Date().toISOString();
  return [
    {
      id: `synthetic-valuesKey-${itemId}`,
      itemId,
      companyId,
      key: "valuesKey",
      label: "Attributes",
      dataType: "list" as const,
      listOptions,
      sortOrder: 0,
      configurationParameterGroupId: null,
      createdAt: nowIso,
      createdBy: "system",
      updatedAt: null,
      updatedBy: null,
      deletedAt: null,
      deletedBy: null,
      materialFormFilterId: null
    }
  ];
}

/**
 * List Color or Size attribute values for Style pickers (system + company).
 * Shape mirrors legacy styleColor / styleSize list rows so form components
 * keep working with the same MultiSelect mapping.
 */
export async function getGarmentAttributeValueList(
  client: Db,
  args: {
    attributeId: typeof SYSTEM_ATTRIBUTE.color | typeof SYSTEM_ATTRIBUTE.size;
    companyId: string;
  }
): Promise<{
  data: Array<{
    id: string;
    colorCode?: string;
    colorName?: string;
    sizeCode?: string;
    sizeName?: string;
    sortOrder: number;
  }> | null;
  error: Error | null;
}> {
  const db = client as any;
  try {
    const { data, error } = await db
      .from("itemAttributeValue")
      .select("id, code, name, sortOrder, companyId")
      .eq("attributeId", args.attributeId)
      .or(`companyId.eq.${args.companyId},companyId.is.null`)
      .order("sortOrder", { ascending: true })
      .order("code", { ascending: true });
    if (error) throw error;

    // Prefer company-scoped rows when the same code exists as a system value.
    const byCode = new Map<
      string,
      {
        id: string;
        code: string;
        name: string | null;
        sortOrder: number;
        companyId: string | null;
      }
    >();
    for (const v of data ?? []) {
      const existing = byCode.get(v.code);
      if (!existing || (v.companyId && !existing.companyId)) {
        byCode.set(v.code, v);
      }
    }

    const rows = [...byCode.values()].map((v) =>
      args.attributeId === SYSTEM_ATTRIBUTE.color
        ? {
            id: v.id,
            colorCode: v.code,
            colorName: v.name ?? v.code,
            sortOrder: v.sortOrder ?? 100
          }
        : {
            id: v.id,
            sizeCode: v.code,
            sizeName: v.name ?? v.code,
            sortOrder: v.sortOrder ?? 100
          }
    );
    rows.sort(
      (a, b) =>
        (a.sortOrder ?? 100) - (b.sortOrder ?? 100) ||
        (a.colorCode ?? a.sizeCode ?? "").localeCompare(
          b.colorCode ?? b.sizeCode ?? ""
        )
    );
    return { data: rows, error: null };
  } catch (error) {
    return {
      data: null,
      error: toError(error, "Failed to load attribute values")
    };
  }
}

/**
 * Write itemAttributeSelection rows for a Style from Color/Size attribute
 * value ids (styleColorIds/styleSizeIds form fields now carry value ids).
 */
export async function syncStyleAttributeSelections(
  client: Db,
  args: {
    itemId: string;
    companyId: string;
    userId: string;
    styleColorIds: string[];
    styleSizeIds: string[];
  }
): Promise<{ error: Error | null }> {
  const db = client as any;
  const { itemId, companyId, userId, styleColorIds, styleSizeIds } = args;

  try {
    await db
      .from("item")
      .update({ attributeSetId: SYSTEM_ATTRIBUTE_SET.garment })
      .eq("id", itemId)
      .eq("companyId", companyId);

    await db
      .from("itemAttributeSelection")
      .delete()
      .eq("itemId", itemId)
      .eq("companyId", companyId);

    const insertSelections = async (
      attributeId: string,
      valueIds: string[]
    ) => {
      if (valueIds.length === 0) return;
      const { data: values, error: valErr } = await db
        .from("itemAttributeValue")
        .select("id, attributeId")
        .in("id", valueIds)
        .eq("attributeId", attributeId);
      if (valErr) throw valErr;
      for (const v of values ?? []) {
        const { error: selErr } = await db
          .from("itemAttributeSelection")
          .insert({
            itemId,
            attributeId,
            attributeValueId: v.id,
            companyId,
            createdBy: userId
          });
        if (selErr) throw selErr;
      }
    };

    await insertSelections(SYSTEM_ATTRIBUTE.color, styleColorIds);
    await insertSelections(SYSTEM_ATTRIBUTE.size, styleSizeIds);

    return { error: null };
  } catch (error) {
    return {
      error: toError(error, "Failed to sync style attribute selections")
    };
  }
}

type AttrValue = {
  id: string;
  attributeId: string;
  code: string;
  name: string;
};

/**
 * Create missing child SKU items for a parent from its attribute selections.
 * Soft-deactivates (`item.active = false`) variants whose valuesKey is no longer
 * in the selected cartesian product; reactivates them if selections grow again.
 */
export async function syncItemVariants(
  client: Db,
  args: {
    parentItemId: string;
    companyId: string;
    userId: string;
  }
): Promise<{
  data: { created: number; archived: number; reactivated: number };
  error: Error | null;
}> {
  const db = client as any;
  const { parentItemId, companyId, userId } = args;
  const empty = { created: 0, archived: 0, reactivated: 0 };

  try {
    const { data: parent, error: parentErr } = await db
      .from("item")
      .select(
        "id, readableId, revision, name, description, type, replenishmentSystem, defaultMethodType, itemTrackingType, unitOfMeasureCode, active, requiresInspection, sourcingType, thumbnailPath, notes, attributeSetId, companyId, createdBy"
      )
      .eq("id", parentItemId)
      .eq("companyId", companyId)
      .single();
    if (parentErr) throw parentErr;
    if (!parent?.attributeSetId) {
      return { data: empty, error: null };
    }

    const { data: setAttrs, error: setAttrErr } = await db
      .from("itemAttributeSetAttribute")
      .select("attributeId, sortOrder")
      .eq("attributeSetId", parent.attributeSetId)
      .order("sortOrder", { ascending: true });
    if (setAttrErr) throw setAttrErr;
    if (!setAttrs?.length) {
      return { data: empty, error: null };
    }

    const { data: selections, error: selErr } = await db
      .from("itemAttributeSelection")
      .select("attributeId, attributeValueId")
      .eq("itemId", parentItemId)
      .eq("companyId", companyId);
    if (selErr) throw selErr;

    const valueIds = (selections ?? []).map(
      (s: { attributeValueId: string }) => s.attributeValueId
    );

    const { data: existingVariants, error: existErr } = await db
      .from("itemVariant")
      .select(
        "id, valuesKey, variantItemId, variant:item!itemVariant_variantItemId_fkey(id, active)"
      )
      .eq("parentItemId", parentItemId)
      .eq("companyId", companyId);
    if (existErr) throw existErr;

    type ExistingVariant = {
      id: string;
      valuesKey: string;
      variantItemId: string;
      variant: { id: string; active: boolean } | null;
    };
    const existingList = (existingVariants ?? []) as ExistingVariant[];
    const existingByKey = new Map(
      existingList.map((v) => [v.valuesKey, v] as const)
    );

    const archiveVariants = async (rows: ExistingVariant[]) => {
      let archived = 0;
      for (const row of rows) {
        if (row.variant?.active === false) continue;
        const { error: updErr } = await db
          .from("item")
          .update({
            active: false,
            updatedBy: userId,
            updatedAt: new Date().toISOString()
          })
          .eq("id", row.variantItemId)
          .eq("companyId", companyId);
        if (updErr) throw updErr;
        archived += 1;
      }
      return archived;
    };

    // No complete selection set → archive all existing variant SKUs.
    if (valueIds.length === 0) {
      const archived = await archiveVariants(existingList);
      return { data: { ...empty, archived }, error: null };
    }

    const { data: values, error: valErr } = await db
      .from("itemAttributeValue")
      .select("id, attributeId, code, name")
      .in("id", valueIds);
    if (valErr) throw valErr;

    const valuesByAttr = new Map<string, AttrValue[]>();
    for (const attr of setAttrs) {
      valuesByAttr.set(attr.attributeId, []);
    }
    for (const v of (values ?? []) as AttrValue[]) {
      const list = valuesByAttr.get(v.attributeId);
      if (list) list.push(v);
    }

    // Every attribute in the set must have ≥1 selected value
    for (const attr of setAttrs) {
      if ((valuesByAttr.get(attr.attributeId) ?? []).length === 0) {
        const archived = await archiveVariants(existingList);
        return { data: { ...empty, archived }, error: null };
      }
    }

    // Cartesian product in set attribute order
    let combos: AttrValue[][] = [[]];
    for (const attr of setAttrs) {
      const options = valuesByAttr.get(attr.attributeId) ?? [];
      const next: AttrValue[][] = [];
      for (const prefix of combos) {
        for (const opt of options) {
          next.push([...prefix, opt]);
        }
      }
      combos = next;
    }

    const desiredKeys = new Set(
      combos.map((combo) => combo.map((v) => v.code).join("|"))
    );

    let archived = 0;
    let reactivated = 0;
    for (const row of existingList) {
      if (desiredKeys.has(row.valuesKey)) {
        if (row.variant?.active === false) {
          const { error: updErr } = await db
            .from("item")
            .update({
              active: true,
              updatedBy: userId,
              updatedAt: new Date().toISOString()
            })
            .eq("id", row.variantItemId)
            .eq("companyId", companyId);
          if (updErr) throw updErr;
          reactivated += 1;
        }
      } else if (row.variant?.active !== false) {
        const { error: updErr } = await db
          .from("item")
          .update({
            active: false,
            updatedBy: userId,
            updatedAt: new Date().toISOString()
          })
          .eq("id", row.variantItemId)
          .eq("companyId", companyId);
        if (updErr) throw updErr;
        archived += 1;
      }
    }

    let created = 0;
    for (const combo of combos) {
      const valuesKey = combo.map((v) => v.code).join("|");
      if (existingByKey.has(valuesKey)) continue;

      const variantReadableId = [
        parent.readableId,
        ...combo.map((v) => v.code)
      ].join("-");
      const variantName = [parent.name, ...combo.map((v) => v.name)].join(
        " / "
      );

      const { data: existingItem } = await db
        .from("item")
        .select("id, active")
        .eq("readableId", variantReadableId)
        .eq("companyId", companyId)
        .eq("type", parent.type)
        .eq("revision", parent.revision ?? "0")
        .maybeSingle();

      let variantItemId: string;
      if (existingItem?.id) {
        variantItemId = existingItem.id;
        if (existingItem.active === false) {
          const { error: updErr } = await db
            .from("item")
            .update({
              active: true,
              updatedBy: userId,
              updatedAt: new Date().toISOString()
            })
            .eq("id", variantItemId)
            .eq("companyId", companyId);
          if (updErr) throw updErr;
          reactivated += 1;
        }
      } else {
        const { data: variantItem, error: itemErr } = await db
          .from("item")
          .insert({
            readableId: variantReadableId,
            revision: parent.revision ?? "0",
            name: variantName,
            description: parent.description,
            type: parent.type,
            replenishmentSystem: parent.replenishmentSystem,
            defaultMethodType: parent.defaultMethodType,
            itemTrackingType: parent.itemTrackingType,
            unitOfMeasureCode: parent.unitOfMeasureCode,
            active: parent.active,
            requiresInspection: parent.requiresInspection,
            sourcingType: parent.sourcingType,
            thumbnailPath: parent.thumbnailPath,
            notes: parent.notes,
            attributeSetId: null,
            companyId,
            createdBy: userId
          })
          .select("id")
          .single();
        if (itemErr) throw itemErr;
        variantItemId = variantItem.id;
        created += 1;

        await db
          .from("itemReplenishment")
          .update({ requiresConfiguration: false })
          .eq("itemId", variantItemId);

        // Style insert interceptor creates a style row per readableId; remove it
        // so variant SKUs don't appear as top-level Styles.
        await db
          .from("style")
          .delete()
          .eq("id", variantReadableId)
          .eq("companyId", companyId);
      }

      const { data: variantRow, error: varErr } = await db
        .from("itemVariant")
        .insert({
          parentItemId,
          variantItemId,
          valuesKey,
          companyId,
          createdBy: userId
        })
        .select("id")
        .single();
      if (varErr) throw varErr;

      const attrRows = combo.map((v) => ({
        itemVariantId: variantRow.id,
        attributeId: v.attributeId,
        attributeValueId: v.id,
        companyId,
        createdBy: userId
      }));
      const { error: attrErr } = await db
        .from("itemVariantAttribute")
        .insert(attrRows);
      if (attrErr) throw attrErr;

      existingByKey.set(valuesKey, {
        id: variantRow.id,
        valuesKey,
        variantItemId,
        variant: { id: variantItemId, active: true }
      });
    }

    return { data: { created, archived, reactivated }, error: null };
  } catch (error) {
    return {
      data: empty,
      error: toError(error, "Failed to sync item variants")
    };
  }
}

/** Sync Style Color/Size attribute value ids into selections + child SKUs */
export async function syncStyleVariantsFromAssignments(
  client: Db,
  args: {
    itemId: string;
    companyId: string;
    userId: string;
    styleColorIds: string[];
    styleSizeIds: string[];
  }
): Promise<{ error: Error | null }> {
  const sel = await syncStyleAttributeSelections(client, args);
  if (sel.error) return sel;
  const variants = await syncItemVariants(client, {
    parentItemId: args.itemId,
    companyId: args.companyId,
    userId: args.userId
  });
  return { error: variants.error };
}

/**
 * Resolve a child SKU itemId for a parent + valuesKey (attribute codes joined by `|`
 * in set attribute order). Prefers an active variant; falls back to inactive,
 * then to the parent itemId when no match exists.
 */
export async function resolveVariantByValuesKey(
  client: Db,
  args: {
    parentItemId: string;
    companyId: string;
    valuesKey: string;
  }
): Promise<{ data: string; error: Error | null }> {
  const db = client as any;
  const { parentItemId, companyId, valuesKey } = args;

  if (!valuesKey) {
    return { data: parentItemId, error: null };
  }

  try {
    const { data, error } = await db
      .from("itemVariant")
      .select(
        "variantItemId, variant:item!itemVariant_variantItemId_fkey(id, active)"
      )
      .eq("parentItemId", parentItemId)
      .eq("companyId", companyId)
      .eq("valuesKey", valuesKey)
      .maybeSingle();

    if (error) throw error;
    if (!data?.variantItemId) {
      return { data: parentItemId, error: null };
    }
    return { data: data.variantItemId, error: null };
  } catch (error) {
    return {
      data: parentItemId,
      error: toError(error, "Failed to resolve variant item")
    };
  }
}

/**
 * Resolve a child SKU itemId for a parent + color/size codes.
 * Returns the parent itemId when no matching variant exists (legacy fallback).
 */
export async function resolveVariantItemId(
  client: Db,
  args: {
    parentItemId: string;
    companyId: string;
    colorCode?: string | null;
    sizeCode?: string | null;
  }
): Promise<{ data: string; error: Error | null }> {
  const { parentItemId, companyId, colorCode, sizeCode } = args;

  if (!colorCode && !sizeCode) {
    return { data: parentItemId, error: null };
  }

  const valuesKey = [colorCode, sizeCode].filter(Boolean).join("|");
  return resolveVariantByValuesKey(client, {
    parentItemId,
    companyId,
    valuesKey
  });
}

export async function getItemAttributes(
  client: Db,
  companyId: string,
  args?: { search?: string | null }
) {
  const db = client as any;
  let query = db
    .from("itemAttribute")
    .select("*", { count: "exact" })
    .or(`companyId.eq.${companyId},companyId.is.null`)
    .order("sortOrder", { ascending: true })
    .order("code", { ascending: true });

  if (args?.search) {
    query = query.or(`code.ilike.%${args.search}%,name.ilike.%${args.search}%`);
  }
  return query;
}

export async function getItemAttribute(client: Db, id: string) {
  return (client as any)
    .from("itemAttribute")
    .select("*")
    .eq("id", id)
    .single();
}

export async function getItemAttributeSet(client: Db, id: string) {
  return (client as any)
    .from("itemAttributeSet")
    .select(
      "*, itemAttributeSetAttribute(attributeId, sortOrder, itemAttribute(id, code, name))"
    )
    .eq("id", id)
    .single();
}

export async function upsertItemAttribute(
  client: Db,
  payload:
    | {
        code: string;
        name: string;
        sortOrder?: number;
        companyId: string;
        createdBy: string;
      }
    | {
        id: string;
        code: string;
        name: string;
        sortOrder?: number;
        updatedBy: string;
      }
) {
  const db = client as any;
  if ("id" in payload) {
    return db
      .from("itemAttribute")
      .update({
        code: payload.code,
        name: payload.name,
        sortOrder: payload.sortOrder ?? 100,
        updatedBy: payload.updatedBy,
        updatedAt: new Date().toISOString()
      })
      .eq("id", payload.id)
      .select("id")
      .single();
  }
  return db
    .from("itemAttribute")
    .insert([
      {
        code: payload.code,
        name: payload.name,
        sortOrder: payload.sortOrder ?? 100,
        companyId: payload.companyId,
        createdBy: payload.createdBy
      }
    ])
    .select("*")
    .single();
}

export async function deleteItemAttribute(client: Db, id: string) {
  return (client as any).from("itemAttribute").delete().eq("id", id);
}

export async function getItemAttributeSets(
  client: Db,
  companyId: string,
  args?: { search?: string | null }
) {
  const db = client as any;
  let query = db
    .from("itemAttributeSet")
    .select(
      "*, itemAttributeSetAttribute(attributeId, sortOrder, itemAttribute(id, code, name))",
      { count: "exact" }
    )
    .or(`companyId.eq.${companyId},companyId.is.null`)
    .order("code", { ascending: true });

  if (args?.search) {
    query = query.or(`code.ilike.%${args.search}%,name.ilike.%${args.search}%`);
  }
  return query;
}

export async function upsertItemAttributeSet(
  client: Db,
  payload:
    | {
        code: string;
        name: string;
        attributeIds: string[];
        companyId: string;
        createdBy: string;
      }
    | {
        id: string;
        code: string;
        name: string;
        attributeIds: string[];
        updatedBy: string;
        /** Null when updating a system (shared) attribute set. */
        companyId: string | null;
      }
) {
  const db = client as any;
  if ("id" in payload) {
    // System sets (companyId null) can't be UPDATEd under RLS — only refresh
    // their attribute membership. Company sets update code/name as usual.
    if (payload.companyId !== null) {
      const updated = await db
        .from("itemAttributeSet")
        .update({
          code: payload.code,
          name: payload.name,
          updatedBy: payload.updatedBy,
          updatedAt: new Date().toISOString()
        })
        .eq("id", payload.id)
        .select("id")
        .single();
      if (updated.error) return updated;
    }

    await db
      .from("itemAttributeSetAttribute")
      .delete()
      .eq("attributeSetId", payload.id);

    if (payload.attributeIds.length > 0) {
      const rows = payload.attributeIds.map((attributeId, index) => ({
        attributeSetId: payload.id,
        attributeId,
        sortOrder: index,
        companyId: payload.companyId,
        createdBy: payload.updatedBy
      }));
      const inserted = await db.from("itemAttributeSetAttribute").insert(rows);
      if (inserted.error) return inserted;
    }
    return { data: { id: payload.id }, error: null };
  }

  const created = await db
    .from("itemAttributeSet")
    .insert([
      {
        code: payload.code,
        name: payload.name,
        companyId: payload.companyId,
        createdBy: payload.createdBy
      }
    ])
    .select("id")
    .single();
  if (created.error || !created.data) return created;

  if (payload.attributeIds.length > 0) {
    const rows = payload.attributeIds.map((attributeId, index) => ({
      attributeSetId: created.data.id,
      attributeId,
      sortOrder: index,
      companyId: payload.companyId,
      createdBy: payload.createdBy
    }));
    const inserted = await db.from("itemAttributeSetAttribute").insert(rows);
    if (inserted.error) return inserted;
  }
  return created;
}

export async function deleteItemAttributeSet(client: Db, id: string) {
  return (client as any).from("itemAttributeSet").delete().eq("id", id);
}

export async function getItemAttributeValues(
  client: Db,
  attributeId: string,
  companyId: string,
  args?: { search?: string | null }
) {
  const db = client as any;
  let query = db
    .from("itemAttributeValue")
    .select("*", { count: "exact" })
    .eq("attributeId", attributeId)
    .or(`companyId.eq.${companyId},companyId.is.null`)
    .order("sortOrder", { ascending: true })
    .order("code", { ascending: true });

  if (args?.search) {
    query = query.or(`code.ilike.%${args.search}%,name.ilike.%${args.search}%`);
  }

  const result = await query;
  if (result.error) return result;

  // Prefer company-scoped rows when the same code also exists as a system
  // catalog value — otherwise admin lists show XS/S/… twice after backfill.
  const byCode = new Map<string, Record<string, unknown>>();
  for (const row of (result.data ?? []) as Array<
    Record<string, unknown> & { code: string; companyId: string | null }
  >) {
    const existing = byCode.get(row.code);
    if (!existing || (row.companyId && !existing.companyId)) {
      byCode.set(row.code, row);
    }
  }
  const data = [...byCode.values()].sort((a, b) => {
    const sortA = Number(a.sortOrder ?? 100);
    const sortB = Number(b.sortOrder ?? 100);
    if (sortA !== sortB) return sortA - sortB;
    return String(a.code).localeCompare(String(b.code));
  });

  return { ...result, data, count: data.length };
}

export async function getItemAttributeValue(client: Db, id: string) {
  return (client as any)
    .from("itemAttributeValue")
    .select("*")
    .eq("id", id)
    .single();
}

export async function upsertItemAttributeValue(
  client: Db,
  payload:
    | {
        attributeId: string;
        code: string;
        name: string;
        sortOrder?: number;
        companyId: string;
        createdBy: string;
      }
    | {
        id: string;
        attributeId: string;
        code: string;
        name: string;
        sortOrder?: number;
        updatedBy: string;
      }
) {
  const db = client as any;
  if ("id" in payload) {
    return db
      .from("itemAttributeValue")
      .update({
        code: payload.code,
        name: payload.name,
        sortOrder: payload.sortOrder ?? 100,
        updatedBy: payload.updatedBy,
        updatedAt: new Date().toISOString()
      })
      .eq("id", payload.id)
      .select("id")
      .single();
  }
  return db
    .from("itemAttributeValue")
    .insert([
      {
        attributeId: payload.attributeId,
        code: payload.code,
        name: payload.name,
        sortOrder: payload.sortOrder ?? 100,
        companyId: payload.companyId,
        createdBy: payload.createdBy
      }
    ])
    .select("*")
    .single();
}

export async function deleteItemAttributeValue(client: Db, id: string) {
  return (client as any).from("itemAttributeValue").delete().eq("id", id);
}

export async function getItemAttributeSetAssignments(
  client: Db,
  companyId: string,
  args?: { search?: string | null }
) {
  const db = client as any;
  let query = db
    .from("itemAttributeSetAssignment")
    .select("*, itemAttributeSet:attributeSetId(id, code, name)", {
      count: "exact"
    })
    .or(`companyId.eq.${companyId},companyId.is.null`)
    .order("itemType", { ascending: true });

  if (args?.search) {
    query = query.or(`itemType.ilike.%${args.search}%`);
  }
  return query;
}

export async function getItemAttributeSetAssignment(client: Db, id: string) {
  return (client as any)
    .from("itemAttributeSetAssignment")
    .select("*, itemAttributeSet:attributeSetId(id, code, name)")
    .eq("id", id)
    .single();
}

export async function upsertItemAttributeSetAssignment(
  client: Db,
  payload:
    | {
        itemType: string;
        attributeSetId: string;
        companyId: string;
        createdBy: string;
      }
    | {
        id: string;
        itemType: string;
        attributeSetId: string;
        companyId: string | null;
      }
) {
  const db = client as any;
  if ("id" in payload) {
    return db
      .from("itemAttributeSetAssignment")
      .update({
        itemType: payload.itemType,
        attributeSetId: payload.attributeSetId
      })
      .eq("id", payload.id)
      .select("id")
      .single();
  }
  return db
    .from("itemAttributeSetAssignment")
    .insert([
      {
        itemType: payload.itemType,
        attributeSetId: payload.attributeSetId,
        companyId: payload.companyId,
        createdBy: payload.createdBy
      }
    ])
    .select("*")
    .single();
}

export async function deleteItemAttributeSetAssignment(client: Db, id: string) {
  return (client as any)
    .from("itemAttributeSetAssignment")
    .delete()
    .eq("id", id);
}

/** Attribute sets allowed for an item type (system + company). */
export async function getAttributeSetsForItemType(
  client: Db,
  itemType: string,
  companyId: string
) {
  const db = client as any;
  const assignments = await db
    .from("itemAttributeSetAssignment")
    .select("attributeSetId, itemAttributeSet:attributeSetId(id, code, name)")
    .eq("itemType", itemType)
    .or(`companyId.eq.${companyId},companyId.is.null`);

  if (assignments.error) return assignments;

  const sets = (assignments.data ?? [])
    .map(
      (row: {
        itemAttributeSet: { id: string; code: string; name: string } | null;
      }) => row.itemAttributeSet
    )
    .filter(Boolean);

  return { data: sets, error: null };
}

export type AttributeValueOption = {
  id: string;
  code: string;
  name: string;
  sortOrder: number;
};

export type AttributeSetFormAttribute = {
  id: string;
  code: string;
  name: string;
  sortOrder: number;
  options: AttributeValueOption[];
};

export type AttributeSetFormOption = {
  id: string;
  code: string;
  name: string;
  attributes: AttributeSetFormAttribute[];
};

/** Deduped attribute values (company over system) for any attribute. */
export async function getAttributeValueOptions(
  client: Db,
  args: { attributeId: string; companyId: string }
): Promise<{ data: AttributeValueOption[]; error: Error | null }> {
  const db = client as any;
  try {
    const { data, error } = await db
      .from("itemAttributeValue")
      .select("id, code, name, sortOrder, companyId")
      .eq("attributeId", args.attributeId)
      .or(`companyId.eq.${args.companyId},companyId.is.null`)
      .order("sortOrder", { ascending: true })
      .order("code", { ascending: true });
    if (error) throw error;

    const byCode = new Map<
      string,
      {
        id: string;
        code: string;
        name: string | null;
        sortOrder: number;
        companyId: string | null;
      }
    >();
    for (const v of data ?? []) {
      const existing = byCode.get(v.code);
      if (!existing || (v.companyId && !existing.companyId)) {
        byCode.set(v.code, v);
      }
    }

    const rows = [...byCode.values()]
      .map((v) => ({
        id: v.id,
        code: v.code,
        name: v.name ?? v.code,
        sortOrder: v.sortOrder ?? 100
      }))
      .sort(
        (a, b) => a.sortOrder - b.sortOrder || a.code.localeCompare(b.code)
      );

    return { data: rows, error: null };
  } catch (error) {
    return {
      data: [],
      error: toError(error, "Failed to load attribute values")
    };
  }
}

/**
 * Sets allowed for an item type, each with ordered attributes and value options.
 * Used by Consumable (and future) create forms for set + value pickers.
 */
export async function getAttributeSetFormOptionsForItemType(
  client: Db,
  itemType: string,
  companyId: string
): Promise<{ data: AttributeSetFormOption[]; error: Error | null }> {
  const db = client as any;
  try {
    const setsResult = await getAttributeSetsForItemType(
      client,
      itemType,
      companyId
    );
    if (setsResult.error) throw setsResult.error;
    const sets = (setsResult.data ?? []) as Array<{
      id: string;
      code: string;
      name: string;
    }>;

    const out: AttributeSetFormOption[] = [];
    for (const set of sets) {
      const { data: setAttrs, error: setAttrErr } = await db
        .from("itemAttributeSetAttribute")
        .select(
          "attributeId, sortOrder, itemAttribute:attributeId(id, code, name)"
        )
        .eq("attributeSetId", set.id)
        .order("sortOrder", { ascending: true });
      if (setAttrErr) throw setAttrErr;

      const attributes: AttributeSetFormAttribute[] = [];
      for (const row of setAttrs ?? []) {
        const attr = row.itemAttribute as {
          id: string;
          code: string;
          name: string;
        } | null;
        if (!attr) continue;
        const values = await getAttributeValueOptions(client, {
          attributeId: attr.id,
          companyId
        });
        if (values.error) throw values.error;
        attributes.push({
          id: attr.id,
          code: attr.code,
          name: attr.name,
          sortOrder: row.sortOrder ?? 100,
          options: values.data
        });
      }

      out.push({
        id: set.id,
        code: set.code,
        name: set.name,
        attributes
      });
    }

    return { data: out, error: null };
  } catch (error) {
    return {
      data: [],
      error: toError(error, "Failed to load attribute set form options")
    };
  }
}

/**
 * Parse MultiSelect fields named `av__<attributeId>` (submits as av__id[0]…).
 */
export function parseAttributeValueSelectionsFromFormData(
  formData: FormData
): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const [key, value] of formData.entries()) {
    const match = /^av__([^[]+)\[/.exec(key);
    if (!match || typeof value !== "string" || !value) continue;
    (out[match[1]] ??= []).push(value);
  }
  return out;
}

/** Current attribute set + selected value ids for a parent item. */
export async function getItemAttributeSelectionsForItem(
  client: Db,
  args: { itemId: string; companyId: string }
): Promise<{
  data: {
    attributeSetId: string | null;
    selections: Record<string, string[]>;
  };
  error: Error | null;
}> {
  const db = client as any;
  try {
    const { data: item, error: itemErr } = await db
      .from("item")
      .select("attributeSetId")
      .eq("id", args.itemId)
      .eq("companyId", args.companyId)
      .single();
    if (itemErr) throw itemErr;

    const { data: rows, error: selErr } = await db
      .from("itemAttributeSelection")
      .select("attributeId, attributeValueId")
      .eq("itemId", args.itemId)
      .eq("companyId", args.companyId);
    if (selErr) throw selErr;

    const selections: Record<string, string[]> = {};
    for (const row of rows ?? []) {
      (selections[row.attributeId] ??= []).push(row.attributeValueId);
    }

    return {
      data: {
        attributeSetId: item?.attributeSetId ?? null,
        selections
      },
      error: null
    };
  } catch (error) {
    return {
      data: { attributeSetId: null, selections: {} },
      error: toError(error, "Failed to load item attribute selections")
    };
  }
}

/**
 * Replace itemAttributeSelection rows for a parent from attributeId → valueIds.
 * Also sets item.attributeSetId when provided.
 */
export async function syncItemAttributeSelections(
  client: Db,
  args: {
    itemId: string;
    companyId: string;
    userId: string;
    attributeSetId: string;
    selections: Record<string, string[]>;
  }
): Promise<{ error: Error | null }> {
  const db = client as any;
  const { itemId, companyId, userId, attributeSetId, selections } = args;

  try {
    await db
      .from("item")
      .update({ attributeSetId })
      .eq("id", itemId)
      .eq("companyId", companyId);

    await db
      .from("itemAttributeSelection")
      .delete()
      .eq("itemId", itemId)
      .eq("companyId", companyId);

    for (const [attributeId, valueIds] of Object.entries(selections)) {
      const uniqueIds = [...new Set(valueIds.filter(Boolean))];
      if (uniqueIds.length === 0) continue;

      const { data: values, error: valErr } = await db
        .from("itemAttributeValue")
        .select("id, attributeId")
        .in("id", uniqueIds)
        .eq("attributeId", attributeId);
      if (valErr) throw valErr;

      for (const v of values ?? []) {
        const { error: selErr } = await db
          .from("itemAttributeSelection")
          .insert({
            itemId,
            attributeId,
            attributeValueId: v.id,
            companyId,
            createdBy: userId
          });
        if (selErr) throw selErr;
      }
    }

    return { error: null };
  } catch (error) {
    return {
      error: toError(error, "Failed to sync item attribute selections")
    };
  }
}

/** Write selections then create missing variant child SKUs. */
export async function syncItemVariantsFromSelections(
  client: Db,
  args: {
    itemId: string;
    companyId: string;
    userId: string;
    attributeSetId: string;
    selections: Record<string, string[]>;
  }
): Promise<{ error: Error | null }> {
  // Validate the chosen set is actually assignable to this item's type. Routes
  // that build the request by hand (e.g. the consumable attributes action) don't
  // validate this via a form schema, so guard it here for every caller.
  const item = await client
    .from("item")
    .select("type")
    .eq("id", args.itemId)
    .eq("companyId", args.companyId)
    .maybeSingle();
  if (item.error) return { error: item.error };
  if (!item.data) return { error: new Error("Item not found") };

  const validSets = await getAttributeSetsForItemType(
    client,
    item.data.type as string,
    args.companyId
  );
  if (validSets.error) return { error: validSets.error };
  const allowed = (validSets.data ?? []).some(
    (s: { id: string } | null) => s?.id === args.attributeSetId
  );
  if (!allowed) {
    return {
      error: new Error(
        "The selected attribute set is not available for this item type."
      )
    };
  }

  const sel = await syncItemAttributeSelections(client, args);
  if (sel.error) return sel;
  const variants = await syncItemVariants(client, {
    parentItemId: args.itemId,
    companyId: args.companyId,
    userId: args.userId
  });
  return { error: variants.error };
}

function firstAttributeCode(...vals: unknown[]): string | null {
  for (const v of vals) {
    if (typeof v === "string" && v.length > 0) return v;
  }
  return null;
}

function rowValueForAttrKey(
  row: Record<string, unknown>,
  attrCode: string
): string | null {
  const lower = attrCode.toLowerCase();
  return firstAttributeCode(
    row[attrCode],
    row[lower],
    row[`${lower}Code`],
    // Legacy Style config tables used lowercase "color" even when the
    // attribute code is "Color".
    lower === "color" ? row.colorCode : null
  );
}

/**
 * Load every variant SKU of a parent, keyed by valuesKey (codes joined by `|`
 * in attribute-set order).
 */
async function loadVariantsByValuesKey(
  client: Db,
  parentItemId: string,
  companyId: string
): Promise<Map<string, { variantItemId: string; valuesKey: string }>> {
  const db = client as any;
  const { data: variants, error: variantsError } = await db
    .from("itemVariant")
    .select("id, variantItemId, valuesKey")
    .eq("parentItemId", parentItemId)
    .eq("companyId", companyId);
  if (variantsError) throw variantsError;

  const map = new Map<string, { variantItemId: string; valuesKey: string }>();
  for (const r of (variants ?? []) as Array<{
    variantItemId: string;
    valuesKey: string;
  }>) {
    if (!r.valuesKey) continue;
    map.set(r.valuesKey, {
      variantItemId: r.variantItemId,
      valuesKey: r.valuesKey
    });
  }
  return map;
}

async function getParentSetAttributeCodes(
  client: Db,
  parentItemId: string,
  companyId: string
): Promise<string[]> {
  const db = client as any;
  const { data: item, error: itemErr } = await db
    .from("item")
    .select("attributeSetId")
    .eq("id", parentItemId)
    .eq("companyId", companyId)
    .maybeSingle();
  if (itemErr) throw itemErr;
  if (!item?.attributeSetId) return [];

  const { data: setAttrs, error: setAttrErr } = await db
    .from("itemAttributeSetAttribute")
    .select("sortOrder, itemAttribute:attributeId(code)")
    .eq("attributeSetId", item.attributeSetId)
    .order("sortOrder", { ascending: true });
  if (setAttrErr) throw setAttrErr;

  return ((setAttrs ?? []) as Array<{ itemAttribute: { code: string } | null }>)
    .map((r) => r.itemAttribute?.code)
    .filter((c): c is string => !!c);
}

/**
 * Expand a Style/Consumable configTable into { variantItemId, quantity } rows.
 * Matches variants by valuesKey (attribute codes in set order).
 *
 * Dual-read:
 * - Combo editor: primaryKeys `["Quantities"]` + row `valuesKey` → use directly.
 * - Legacy matrix: last set attribute = qty columns; earlier = row descriptors.
 */
export async function expandConfigTableToVariantQuantities(
  client: Db,
  args: {
    parentItemId: string;
    companyId: string;
    configuration: unknown;
  }
): Promise<{
  data: Array<{ variantItemId: string; quantity: number; valuesKey: string }>;
  error: Error | null;
}> {
  try {
    const raw = (args.configuration ?? {}) as Record<string, unknown>;
    const table = Array.isArray(raw.configTable)
      ? (raw.configTable as Record<string, unknown>[])
      : [];
    const primaryKeys = Array.isArray(raw.configTablePrimaryKeys)
      ? (raw.configTablePrimaryKeys as string[])
      : [];

    const cells: Array<{ valuesKey: string; quantity: number }> = [];

    const isComboFlat =
      primaryKeys.length === 1 &&
      primaryKeys[0] === "Quantities" &&
      table.some(
        (row) =>
          typeof row.valuesKey === "string" &&
          String(row.valuesKey).trim().length > 0
      );

    if (isComboFlat) {
      for (const row of table) {
        const valuesKey = String(row.valuesKey ?? "").trim();
        if (!valuesKey) continue;
        const qty = Number(row.Quantities ?? 0);
        if (!Number.isFinite(qty) || qty <= 0) continue;
        cells.push({ valuesKey, quantity: qty });
      }
    } else {
      const attrCodes = await getParentSetAttributeCodes(
        client,
        args.parentItemId,
        args.companyId
      );
      // Fallback for legacy Garment-shaped tables when set is missing.
      const codes =
        attrCodes.length > 0 ? attrCodes : (["Color", "Size"] as string[]);
      const primaryAttrCode = codes[codes.length - 1]!;
      const descriptorCodes = codes.slice(0, -1);

      for (const row of table) {
        for (const primaryValue of primaryKeys) {
          const qty = Number(row[primaryValue] ?? 0);
          if (!Number.isFinite(qty) || qty <= 0) continue;

          const parts: string[] = [];
          for (const code of descriptorCodes) {
            const v = rowValueForAttrKey(row, code);
            if (!v) {
              throw new Error(
                `Configuration row is missing ${code} for quantity column ${primaryValue}.`
              );
            }
            parts.push(v);
          }
          // Single-attribute sets use the primary column value as the only code.
          if (descriptorCodes.length === 0 && primaryAttrCode) {
            parts.push(primaryValue);
          } else {
            parts.push(primaryValue);
          }
          cells.push({ valuesKey: parts.join("|"), quantity: qty });
        }
      }
    }

    if (cells.length === 0) {
      return { data: [], error: null };
    }

    const variantsByKey = await loadVariantsByValuesKey(
      client,
      args.parentItemId,
      args.companyId
    );

    const out: Array<{
      variantItemId: string;
      quantity: number;
      valuesKey: string;
    }> = [];
    const seen = new Set<string>();
    for (const cell of cells) {
      const match = variantsByKey.get(cell.valuesKey);
      if (!match) {
        throw new Error(
          `No variant SKU exists for ${cell.valuesKey}. Open the item and save its attribute selections to generate variants before shipping or receiving.`
        );
      }
      if (seen.has(match.variantItemId)) {
        throw new Error(
          "Configuration maps more than one cell to the same variant SKU."
        );
      }
      seen.add(match.variantItemId);
      out.push({
        variantItemId: match.variantItemId,
        quantity: cell.quantity,
        valuesKey: match.valuesKey
      });
    }

    return { data: out, error: null };
  } catch (error) {
    return {
      data: [],
      error: toError(error, "Failed to expand config table to variants")
    };
  }
}
