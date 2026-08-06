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

/**
 * Ensure company-scoped Color attribute values exist for the given styleColor ids,
 * then write itemAttributeSelection rows for the parent Style item.
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

    // Replace selections for this item
    await db
      .from("itemAttributeSelection")
      .delete()
      .eq("itemId", itemId)
      .eq("companyId", companyId);

    if (styleColorIds.length > 0) {
      const { data: colors, error: colorErr } = await db
        .from("styleColor")
        .select("id, colorCode, colorName")
        .in("id", styleColorIds)
        .eq("companyId", companyId);
      if (colorErr) throw colorErr;

      for (const color of colors ?? []) {
        const { data: existing } = await db
          .from("itemAttributeValue")
          .select("id")
          .eq("attributeId", SYSTEM_ATTRIBUTE.color)
          .eq("code", color.colorCode)
          .eq("companyId", companyId)
          .maybeSingle();

        let valueId = existing?.id as string | undefined;
        if (!valueId) {
          const { data: inserted, error: insertErr } = await db
            .from("itemAttributeValue")
            .insert({
              attributeId: SYSTEM_ATTRIBUTE.color,
              code: color.colorCode,
              name: color.colorName,
              companyId,
              createdBy: userId
            })
            .select("id")
            .single();
          if (insertErr) throw insertErr;
          valueId = inserted.id;
        }

        const { error: selErr } = await db
          .from("itemAttributeSelection")
          .insert({
            itemId,
            attributeId: SYSTEM_ATTRIBUTE.color,
            attributeValueId: valueId,
            companyId,
            createdBy: userId
          });
        if (selErr) throw selErr;
      }
    }

    if (styleSizeIds.length > 0) {
      const { data: sizes, error: sizeErr } = await db
        .from("styleSize")
        .select("id, sizeCode, sizeName, sortOrder")
        .in("id", styleSizeIds);
      if (sizeErr) throw sizeErr;

      for (const size of sizes ?? []) {
        // Prefer global system size value, else company-scoped
        const { data: globalVal } = await db
          .from("itemAttributeValue")
          .select("id")
          .eq("attributeId", SYSTEM_ATTRIBUTE.size)
          .eq("code", size.sizeCode)
          .is("companyId", null)
          .maybeSingle();

        let valueId = globalVal?.id as string | undefined;
        if (!valueId) {
          const { data: companyVal } = await db
            .from("itemAttributeValue")
            .select("id")
            .eq("attributeId", SYSTEM_ATTRIBUTE.size)
            .eq("code", size.sizeCode)
            .eq("companyId", companyId)
            .maybeSingle();
          valueId = companyVal?.id;
        }
        if (!valueId) {
          const { data: inserted, error: insertErr } = await db
            .from("itemAttributeValue")
            .insert({
              attributeId: SYSTEM_ATTRIBUTE.size,
              code: size.sizeCode,
              name: size.sizeName,
              sortOrder: size.sortOrder ?? 100,
              companyId,
              createdBy: userId
            })
            .select("id")
            .single();
          if (insertErr) throw insertErr;
          valueId = inserted.id;
        }

        const { error: selErr } = await db
          .from("itemAttributeSelection")
          .insert({
            itemId,
            attributeId: SYSTEM_ATTRIBUTE.size,
            attributeValueId: valueId,
            companyId,
            createdBy: userId
          });
        if (selErr) throw selErr;
      }
    }

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
 * Does not delete existing variants (archive/removal is a later concern).
 */
export async function syncItemVariants(
  client: Db,
  args: {
    parentItemId: string;
    companyId: string;
    userId: string;
  }
): Promise<{ data: { created: number }; error: Error | null }> {
  const db = client as any;
  const { parentItemId, companyId, userId } = args;

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
      return { data: { created: 0 }, error: null };
    }

    const { data: setAttrs, error: setAttrErr } = await db
      .from("itemAttributeSetAttribute")
      .select("attributeId, sortOrder")
      .eq("attributeSetId", parent.attributeSetId)
      .order("sortOrder", { ascending: true });
    if (setAttrErr) throw setAttrErr;
    if (!setAttrs?.length) {
      return { data: { created: 0 }, error: null };
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
    if (valueIds.length === 0) {
      return { data: { created: 0 }, error: null };
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
        return { data: { created: 0 }, error: null };
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

    const { data: existingVariants, error: existErr } = await db
      .from("itemVariant")
      .select("valuesKey")
      .eq("parentItemId", parentItemId)
      .eq("companyId", companyId);
    if (existErr) throw existErr;
    const existingKeys = new Set(
      (existingVariants ?? []).map((v: { valuesKey: string }) => v.valuesKey)
    );

    let created = 0;
    for (const combo of combos) {
      const valuesKey = combo.map((v) => v.code).join("|");
      if (existingKeys.has(valuesKey)) continue;

      const variantReadableId = [
        parent.readableId,
        ...combo.map((v) => v.code)
      ].join("-");
      const variantName = [parent.name, ...combo.map((v) => v.name)].join(
        " / "
      );

      const { data: existingItem } = await db
        .from("item")
        .select("id")
        .eq("readableId", variantReadableId)
        .eq("companyId", companyId)
        .eq("type", parent.type)
        .eq("revision", parent.revision ?? "0")
        .maybeSingle();
      if (existingItem) continue;

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

      await db
        .from("itemReplenishment")
        .update({ requiresConfiguration: false })
        .eq("itemId", variantItem.id);

      const { data: variantRow, error: varErr } = await db
        .from("itemVariant")
        .insert({
          parentItemId,
          variantItemId: variantItem.id,
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

      // Style insert interceptor creates a style row per readableId; remove it
      // so variant SKUs don't appear as top-level Styles.
      await db
        .from("style")
        .delete()
        .eq("id", variantReadableId)
        .eq("companyId", companyId);

      created += 1;
      existingKeys.add(valuesKey);
    }

    return { data: { created }, error: null };
  } catch (error) {
    return {
      data: { created: 0 },
      error: toError(error, "Failed to sync item variants")
    };
  }
}

/** Dual-write Style color/size assignments into attribute selections + SKUs */
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
  const db = client as any;
  const { parentItemId, companyId, colorCode, sizeCode } = args;

  if (!colorCode && !sizeCode) {
    return { data: parentItemId, error: null };
  }

  const valuesKey = [colorCode, sizeCode].filter(Boolean).join("|");

  try {
    const { data, error } = await db
      .from("itemVariant")
      .select("variantItemId")
      .eq("parentItemId", parentItemId)
      .eq("companyId", companyId)
      .eq("valuesKey", valuesKey)
      .maybeSingle();

    if (error) throw error;
    return { data: data?.variantItemId ?? parentItemId, error: null };
  } catch (error) {
    return {
      data: parentItemId,
      error: toError(error, "Failed to resolve variant item")
    };
  }
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
    .select("*, itemAttributeSetAttribute(attributeId, sortOrder)")
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
    .select("*, itemAttributeSetAttribute(attributeId, sortOrder)", {
      count: "exact"
    })
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
        companyId: string;
      }
) {
  const db = client as any;
  if ("id" in payload) {
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
    return updated;
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
  return query;
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

/**
 * Expand a Style-style configTable into { variantItemId, quantity } rows.
 * valuesKey is built as color|size from row descriptor + size column keys.
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
    const table = Array.isArray(raw.configTable) ? raw.configTable : [];
    const primaryKeys = Array.isArray(raw.configTablePrimaryKeys)
      ? (raw.configTablePrimaryKeys as string[])
      : [];

    const out: Array<{
      variantItemId: string;
      quantity: number;
      valuesKey: string;
    }> = [];

    for (const row of table as Record<string, unknown>[]) {
      const color =
        (row.color as string) ??
        (row.Color as string) ??
        (row.colorCode as string) ??
        "";
      for (const size of primaryKeys) {
        const qty = Number(row[size] ?? 0);
        if (!qty || qty <= 0) continue;
        const valuesKey = color ? `${color}|${size}` : size;
        const resolved = await resolveVariantItemId(client, {
          parentItemId: args.parentItemId,
          companyId: args.companyId,
          colorCode: color || null,
          sizeCode: size
        });
        out.push({
          variantItemId: resolved.data,
          quantity: qty,
          valuesKey
        });
      }
    }

    return { data: out, error: null };
  } catch (error) {
    return {
      data: [],
      error: toError(error, "Failed to expand config table to variants")
    };
  }
}
