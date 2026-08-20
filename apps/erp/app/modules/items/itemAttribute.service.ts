import type { Database } from "@carbon/database";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ATTRIBUTE_VALUE_CODE_LOCKED_MESSAGE,
  isAttributeValueCodeChangeBlocked
} from "./itemAttributeValue.guard";

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
export type SynthesizedVariantQuantityParameter = {
  id: string;
  itemId: string;
  companyId: string;
  key: string;
  label: string;
  dataType: "list";
  listOptions: string[];
  /**
   * `variantItemId -> display label` for each of the parent's synced variant
   * SKUs. The label is the attribute value NAMES joined in set order (e.g.
   * "Black · S"), localized at the display edge — the editor keys each saved
   * cell by the drift-proof `variantItemId` and shows this label directly, with
   * no code intermediary. Options with no synced variant yet are simply absent.
   */
  optionVariantItemLabels: Record<string, string>;
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
 * Build a pipe-joined attribute label ("Black|S") for each of a parent's variant
 * SKUs from its `itemVariantAttribute` rows (value names ordered by attribute
 * sortOrder), keyed by the stable `variantItemId`. This is the display combo,
 * localized at the render edge. The uniqueness fingerprint column is opaque and
 * DB-owned; callers that need a readable combo use this instead.
 */
export async function loadVariantCombos(
  client: Db,
  variantItemIds: string[],
  companyId: string
): Promise<Map<string, string>> {
  const db = client as any;
  const byVariantItemId = new Map<string, string>();
  const uniqueIds = [...new Set(variantItemIds.filter(Boolean))];
  if (uniqueIds.length === 0) return byVariantItemId;

  const { data: variants, error: variantsErr } = await db
    .from("itemVariant")
    .select("id, variantItemId")
    .eq("companyId", companyId)
    .in("variantItemId", uniqueIds);
  if (variantsErr) throw variantsErr;
  const rows = (variants ?? []) as Array<{
    id: string;
    variantItemId: string | null;
  }>;
  if (rows.length === 0) return byVariantItemId;

  const { data: attrs, error: attrsErr } = await db
    .from("itemVariantAttribute")
    .select(
      "itemVariantId, itemAttribute:attributeId(sortOrder), itemAttributeValue:attributeValueId(code, name)"
    )
    .eq("companyId", companyId)
    .in(
      "itemVariantId",
      rows.map((r) => r.id)
    );
  if (attrsErr) throw attrsErr;

  const partsByIvId = new Map<
    string,
    Array<{ sortOrder: number; part: string }>
  >();
  for (const a of (attrs ?? []) as Array<{
    itemVariantId: string;
    itemAttribute: { sortOrder: number | null } | null;
    itemAttributeValue: { code: string | null; name: string | null } | null;
  }>) {
    // Display name; fall back to the code so a value without a name still labels.
    const part = a.itemAttributeValue?.name ?? a.itemAttributeValue?.code;
    if (!part) continue;
    const list = partsByIvId.get(a.itemVariantId) ?? [];
    list.push({ sortOrder: a.itemAttribute?.sortOrder ?? 100, part });
    partsByIvId.set(a.itemVariantId, list);
  }
  for (const r of rows) {
    if (!r.variantItemId) continue;
    const combo = (partsByIvId.get(r.id) ?? [])
      .slice()
      .sort((x, y) => x.sortOrder - y.sortOrder)
      .map((p) => p.part)
      .join("|");
    if (combo) byVariantItemId.set(r.variantItemId, combo);
  }
  return byVariantItemId;
}

/**
 * Leaf variant SKUs usable as BOM components, company-wide.
 *
 * Default item pickers list variant PARENTS (users browse templates; inventory
 * and jobs resolve to children under the hood). The BOM component picker is the
 * exception: you consume a concrete SKU, not the abstract parent, so it needs
 * every variant child keyed by the stable `variantItemId`, with its
 * `parentItemId` (so the picker can drop the parent) and a readable `attributes`
 * combo (e.g. "Blue|M"). Parent name/readableId are read from the items store on
 * the client, so they aren't duplicated here.
 *
 * Lives here (next to loadVariantCombos) rather than in items.service so the
 * BOM-variants route and its integration test don't pull in that module's heavy
 * import graph.
 */
export type BomComponentVariant = {
  variantItemId: string;
  parentItemId: string;
  attributes: string;
};

export async function getBomComponentVariants(
  client: Db,
  companyId: string
): Promise<{ data: BomComponentVariant[] | null; error: unknown }> {
  const db = client as any;
  const variants = await db
    .from("itemVariant")
    .select("parentItemId, variantItemId")
    .eq("companyId", companyId);
  if (variants.error) return { data: null, error: variants.error };

  const rows = ((variants.data ?? []) as Array<{
    parentItemId: string | null;
    variantItemId: string | null;
  }>).filter(
    (r): r is { parentItemId: string; variantItemId: string } =>
      Boolean(r.parentItemId) && Boolean(r.variantItemId)
  );

  const combos = await loadVariantCombos(
    client,
    rows.map((r) => r.variantItemId),
    companyId
  );

  const data: BomComponentVariant[] = rows.map((r) => ({
    variantItemId: r.variantItemId,
    parentItemId: r.parentItemId,
    attributes: combos.get(r.variantItemId) ?? ""
  }));

  return { data, error: null };
}

/**
 * Build a single list parameter from the item's attribute set + selections so
 * Style qty editors work without configurationParameter dual-write.
 *
 * Returns one list param whose options are the cartesian product of selected
 * attribute codes in **set order** (pipe-joined), each mapped to its variantItemId.
 */
export async function getStyleVariantQuantityParameters(
  client: Db,
  itemId: string,
  companyId: string
): Promise<SynthesizedVariantQuantityParameter[]> {
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

  // Each variant SKU's display label = its attribute value NAMES joined in set
  // order (e.g. "Black · S"), derived directly from the variant's
  // itemVariantAttribute rows and keyed by the stable variantItemId. Localized at
  // the display edge; no code combo is ever threaded to the UI.
  const sortByAttr = new Map(
    (setAttrs as SetAttrRow[]).map((a) => [a.attributeId, a.sortOrder ?? 100])
  );
  const { data: variantRows, error: variantRowsErr } = await db
    .from("itemVariant")
    .select("id, variantItemId")
    .eq("parentItemId", itemId)
    .eq("companyId", companyId);
  if (variantRowsErr) throw variantRowsErr;
  const variantRowList = (variantRows ?? []) as Array<{
    id: string;
    variantItemId: string | null;
  }>;
  const variantItemIdByIvId = new Map(
    variantRowList.map((v) => [v.id, v.variantItemId])
  );
  const optionVariantItemLabels: Record<string, string> = {};
  if (variantRowList.length > 0) {
    const { data: vattrs, error: vattrsErr } = await db
      .from("itemVariantAttribute")
      .select(
        "itemVariantId, attributeId, itemAttributeValue:attributeValueId(name, code)"
      )
      .eq("companyId", companyId)
      .in(
        "itemVariantId",
        variantRowList.map((v) => v.id)
      );
    if (vattrsErr) throw vattrsErr;
    const partsByIvId = new Map<
      string,
      Array<{ attributeId: string; name: string }>
    >();
    for (const va of (vattrs ?? []) as Array<{
      itemVariantId: string;
      attributeId: string;
      itemAttributeValue: { name: string | null; code: string | null } | null;
    }>) {
      // Prefer the value's display name; fall back to its code only if unnamed.
      const name = va.itemAttributeValue?.name ?? va.itemAttributeValue?.code;
      if (!name) continue;
      const list = partsByIvId.get(va.itemVariantId) ?? [];
      list.push({ attributeId: va.attributeId, name });
      partsByIvId.set(va.itemVariantId, list);
    }
    for (const [ivId, parts] of partsByIvId) {
      const variantItemId = variantItemIdByIvId.get(ivId);
      if (!variantItemId) continue;
      const label = parts
        .slice()
        .sort(
          (a, b) =>
            (sortByAttr.get(a.attributeId) ?? 100) -
            (sortByAttr.get(b.attributeId) ?? 100)
        )
        .map((p) => p.name)
        .join(" · ");
      if (label) optionVariantItemLabels[variantItemId] = label;
    }
  }

  const nowIso = new Date().toISOString();
  return [
    {
      id: `synthetic-variant-combo-${itemId}`,
      itemId,
      companyId,
      key: "variantItemId",
      label: "Attributes",
      dataType: "list" as const,
      listOptions: [],
      optionVariantItemLabels,
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
 * All attribute-value `code -> name` for a company (its own values + system
 * values, company-scoped winning on code collisions). Attribute-agnostic —
 * feeds the generic config/order-line label maps so any attribute's values
 * render as names, not just Color, for any set (Garment, Shoes, ...).
 */
export async function getAttributeValueNames(
  client: Db,
  companyId: string
): Promise<{
  data: Array<{ code: string; name: string }>;
  error: Error | null;
}> {
  const db = client as any;
  try {
    const { data, error } = await db
      .from("itemAttributeValue")
      .select("code, name, companyId")
      .or(`companyId.eq.${companyId},companyId.is.null`);
    if (error) throw error;

    // Prefer company-scoped rows when the same code exists as a system value.
    const byCode = new Map<
      string,
      { name: string; companyId: string | null }
    >();
    for (const v of data ?? []) {
      if (!v.code) continue;
      const existing = byCode.get(v.code);
      if (!existing || (v.companyId && !existing.companyId)) {
        byCode.set(v.code, { name: v.name ?? v.code, companyId: v.companyId });
      }
    }
    return {
      data: [...byCode.entries()].map(([code, v]) => ({ code, name: v.name })),
      error: null
    };
  } catch (error) {
    return {
      data: [],
      error: toError(error, "Failed to load attribute value names")
    };
  }
}

/** A selected attribute value, as loaded for variant SKU generation. */
type AttrValue = {
  id: string;
  attributeId: string;
  code: string;
  name: string;
};

/**
 * Create missing child SKU items for a parent from its attribute selections.
 * Soft-deactivates (`item.active = false`) variants whose attribute combo is no
 * longer in the selected cartesian product; reactivates them if selections grow.
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
        "id, variantItemId, variant:item!itemVariant_variantItemId_fkey(id, active)"
      )
      .eq("parentItemId", parentItemId)
      .eq("companyId", companyId);
    if (existErr) throw existErr;

    type ExistingVariant = {
      id: string;
      variantItemId: string;
      variant: { id: string; active: boolean } | null;
    };
    const existingList = (existingVariants ?? []) as ExistingVariant[];

    // A variant's combo signature = its attributeValueIds sorted by attributeId
    // (byte order). This mirrors the fingerprint the DB trigger owns; the sync
    // computes it here from the attribute rows so it never reads that column.
    const sigOf = (parts: Array<{ attributeId: string; valueId: string }>) =>
      parts
        .slice()
        .sort((a, b) =>
          a.attributeId < b.attributeId
            ? -1
            : a.attributeId > b.attributeId
              ? 1
              : 0
        )
        .map((p) => p.valueId)
        .join("|");

    const existingSigById = new Map<string, string>();
    if (existingList.length > 0) {
      const { data: existingAttrs, error: existingAttrsErr } = await db
        .from("itemVariantAttribute")
        .select("itemVariantId, attributeId, attributeValueId")
        .eq("companyId", companyId)
        .in(
          "itemVariantId",
          existingList.map((v) => v.id)
        );
      if (existingAttrsErr) throw existingAttrsErr;
      const partsById = new Map<
        string,
        Array<{ attributeId: string; valueId: string }>
      >();
      for (const a of (existingAttrs ?? []) as Array<{
        itemVariantId: string;
        attributeId: string;
        attributeValueId: string;
      }>) {
        const list = partsById.get(a.itemVariantId) ?? [];
        list.push({ attributeId: a.attributeId, valueId: a.attributeValueId });
        partsById.set(a.itemVariantId, list);
      }
      for (const v of existingList) {
        existingSigById.set(v.id, sigOf(partsById.get(v.id) ?? []));
      }
    }
    const existingBySig = new Map<string, ExistingVariant>();
    for (const v of existingList) {
      existingBySig.set(existingSigById.get(v.id) ?? "", v);
    }

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

    // Freeze the item's attribute footprint to the attributes it actually has
    // values for. An attribute added to the set *after* this item was created
    // has no selections here, so it is excluded — rather than archiving every
    // existing variant or forcing a value the item was never meant to carry.
    // (Create-time completeness — a value for every set attribute — is enforced
    // upstream in syncItemVariantsFromSelections.)
    const activeAttrs = setAttrs.filter(
      (attr: { attributeId: string }) =>
        (valuesByAttr.get(attr.attributeId) ?? []).length > 0
    );
    if (activeAttrs.length === 0) {
      const archived = await archiveVariants(existingList);
      return { data: { ...empty, archived }, error: null };
    }

    // Cartesian product in set attribute order
    let combos: AttrValue[][] = [[]];
    for (const attr of activeAttrs) {
      const options = valuesByAttr.get(attr.attributeId) ?? [];
      const next: AttrValue[][] = [];
      for (const prefix of combos) {
        for (const opt of options) {
          next.push([...prefix, opt]);
        }
      }
      combos = next;
    }

    // A desired combo's signature (same formula as sigOf / the DB trigger), used
    // only in-memory to reconcile which variants to create/archive/reactivate.
    const comboSignatureOf = (combo: AttrValue[]) =>
      sigOf(combo.map((v) => ({ attributeId: v.attributeId, valueId: v.id })));

    const desiredKeys = new Set(combos.map(comboSignatureOf));

    let archived = 0;
    let reactivated = 0;
    for (const row of existingList) {
      if (desiredKeys.has(existingSigById.get(row.id) ?? "")) {
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
      const sig = comboSignatureOf(combo);
      if (existingBySig.has(sig)) continue;

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
          // The uniqueness fingerprint is set by the DB trigger from the
          // itemVariantAttribute rows inserted just below; the app never writes it.
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

      existingBySig.set(sig, {
        id: variantRow.id,
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

/**
 * Resolve a child SKU itemId for a parent variant by the stable `variantItemId`
 * (verified against the parent), falling back to the parent itemId when it
 * doesn't match.
 */
export async function resolveVariantByValuesKey(
  client: Db,
  args: {
    parentItemId: string;
    companyId: string;
    variantItemId?: string;
  }
): Promise<{ data: string; error: Error | null }> {
  const db = client as any;
  const { parentItemId, companyId, variantItemId } = args;

  // Validates the variant belongs to the parent; falls back to the parent.
  if (!variantItemId) {
    return { data: parentItemId, error: null };
  }

  try {
    const { data, error } = await db
      .from("itemVariant")
      .select("variantItemId")
      .eq("parentItemId", parentItemId)
      .eq("companyId", companyId)
      .eq("variantItemId", variantItemId)
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
    .select("*, itemAttributeValue(id, code, name, sortOrder, companyId)", {
      count: "exact"
    })
    .or(`companyId.eq.${companyId},companyId.is.null`)
    .order("sortOrder", { ascending: true })
    .order("code", { ascending: true });

  if (args?.search) {
    query = query.or(`code.ilike.%${args.search}%,name.ilike.%${args.search}%`);
  }

  const result = await query;
  if (result.error) return result;

  // Prefer company-scoped values when the same code also exists as a system
  // catalog row — matches getItemAttributeValues admin list behavior.
  const data = (
    (result.data ?? []) as Array<{
      itemAttributeValue?: Array<{
        id: string;
        code: string;
        name: string;
        sortOrder: number;
        companyId: string | null;
      }> | null;
    }>
  ).map((attr) => {
    const byCode = new Map<
      string,
      {
        id: string;
        code: string;
        name: string;
        sortOrder: number;
        companyId: string | null;
      }
    >();
    for (const row of attr.itemAttributeValue ?? []) {
      const existing = byCode.get(row.code);
      if (!existing || (row.companyId && !existing.companyId)) {
        byCode.set(row.code, row);
      }
    }
    const values = [...byCode.values()].sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return a.code.localeCompare(b.code);
    });
    return { ...attr, itemAttributeValue: values };
  });

  return { ...result, data };
}

export async function getItemAttribute(client: Db, id: string) {
  return (client as any)
    .from("itemAttribute")
    .select("*, itemAttributeValue(id, code, name, sortOrder, companyId)")
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

type ItemAttributeValueInput = {
  id?: string;
  code: string;
  name: string;
};

/**
 * Create/update an attribute and sync its ordered values.
 * System attributes (`companyId` null on the attribute row): code/name are not
 * updated; only company-scoped values are inserted/updated/deleted. System
 * catalog values are left alone (RLS blocks mutating them anyway).
 *
 * `companyId` on update is the attribute's companyId (null = system).
 * `tenantCompanyId` is always the acting company (used for value writes).
 */
export async function upsertItemAttribute(
  client: Db,
  payload:
    | {
        code: string;
        name: string;
        sortOrder?: number;
        values: ItemAttributeValueInput[];
        companyId: string;
        createdBy: string;
      }
    | {
        id: string;
        code: string;
        name: string;
        sortOrder?: number;
        values: ItemAttributeValueInput[];
        updatedBy: string;
        /** Attribute's companyId — null for system (shared) attributes. */
        companyId: string | null;
        /** Acting tenant — always set; used when writing company values. */
        tenantCompanyId: string;
      }
) {
  const db = client as any;

  if ("id" in payload) {
    const attributeId = payload.id;
    const actorId = payload.updatedBy;

    if (payload.companyId !== null) {
      const updated = await db
        .from("itemAttribute")
        .update({
          code: payload.code,
          name: payload.name,
          sortOrder: payload.sortOrder ?? 100,
          updatedBy: actorId,
          updatedAt: new Date().toISOString()
        })
        .eq("id", attributeId)
        .select("id")
        .single();
      if (updated.error) return updated;
    }

    const sync = await syncItemAttributeValues(client, {
      attributeId,
      values: payload.values,
      tenantCompanyId: payload.tenantCompanyId,
      userId: actorId
    });
    if (sync.error) return sync;
    return { data: { id: attributeId }, error: null };
  }

  const created = await db
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
    .select("id")
    .single();
  if (created.error || !created.data) return created;

  const sync = await syncItemAttributeValues(client, {
    attributeId: created.data.id,
    values: payload.values,
    tenantCompanyId: payload.companyId,
    userId: payload.createdBy
  });
  if (sync.error) return sync;
  return created;
}

/**
 * Sync ordered values for an attribute. Company-scoped rows are
 * inserted/updated/deleted with sortOrder = list index. System catalog rows
 * (`companyId` null) in the list are skipped (not updated/deleted).
 */
async function syncItemAttributeValues(
  client: Db,
  args: {
    attributeId: string;
    values: ItemAttributeValueInput[];
    tenantCompanyId: string;
    userId: string;
  }
) {
  const db = client as any;
  const { attributeId, values, tenantCompanyId, userId } = args;

  const existing = await db
    .from("itemAttributeValue")
    .select("id, code, companyId, sortOrder")
    .eq("attributeId", attributeId)
    .or(`companyId.eq.${tenantCompanyId},companyId.is.null`);
  if (existing.error) return existing;

  const existingById = new Map<
    string,
    { id: string; code: string; companyId: string | null; sortOrder: number }
  >(
    (
      (existing.data ?? []) as Array<{
        id: string;
        code: string;
        companyId: string | null;
        sortOrder: number;
      }>
    ).map((row) => [row.id, row])
  );

  const keptCompanyIds = new Set<string>();

  for (let index = 0; index < values.length; index++) {
    const value = values[index];
    const sortOrder = index;

    if (value.id) {
      const row = existingById.get(value.id);
      if (!row) {
        return {
          data: null,
          error: new Error(`Unknown attribute value: ${value.id}`)
        };
      }
      // System catalog values: leave untouched.
      if (row.companyId === null) {
        continue;
      }
      keptCompanyIds.add(row.id);
      const updated = await db
        .from("itemAttributeValue")
        .update({
          code: value.code,
          name: value.name,
          sortOrder,
          updatedBy: userId,
          updatedAt: new Date().toISOString()
        })
        .eq("id", row.id)
        .eq("companyId", tenantCompanyId);
      if (updated.error) return updated;
      continue;
    }

    const inserted = await db
      .from("itemAttributeValue")
      .insert([
        {
          attributeId,
          code: value.code,
          name: value.name,
          sortOrder,
          companyId: tenantCompanyId,
          createdBy: userId
        }
      ])
      .select("id")
      .single();
    if (inserted.error) return inserted;
    if (inserted.data?.id) keptCompanyIds.add(inserted.data.id);
  }

  const toDelete = (
    (existing.data ?? []) as Array<{ id: string; companyId: string | null }>
  ).filter(
    (row) => row.companyId === tenantCompanyId && !keptCompanyIds.has(row.id)
  );

  for (const row of toDelete) {
    const deleted = await db
      .from("itemAttributeValue")
      .delete()
      .eq("id", row.id)
      .eq("companyId", tenantCompanyId);
    if (deleted.error) {
      return {
        data: null,
        error: toError(
          deleted.error,
          "Failed to delete attribute value (it may be in use)"
        )
      };
    }
  }

  return { data: { id: attributeId }, error: null };
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
    // Freeze the identity `code` once the value is referenced by any variant SKU
    // or item selection — the code-combo labels shown on saved quantities are
    // derived from it, so renaming would rewrite history. `name`/`sortOrder` stay
    // editable.
    const existing = await db
      .from("itemAttributeValue")
      .select("code")
      .eq("id", payload.id)
      .maybeSingle();
    const currentCode = String(existing.data?.code ?? "");
    if (currentCode && payload.code.trim() !== currentCode.trim()) {
      const [variantRefs, selectionRefs] = await Promise.all([
        db
          .from("itemVariantAttribute")
          .select("itemVariantId", { count: "exact", head: true })
          .eq("attributeValueId", payload.id),
        db
          .from("itemAttributeSelection")
          .select("itemId", { count: "exact", head: true })
          .eq("attributeValueId", payload.id)
      ]);
      const referenceCount =
        (variantRefs.count ?? 0) + (selectionRefs.count ?? 0);
      if (
        isAttributeValueCodeChangeBlocked({
          currentCode,
          nextCode: payload.code,
          referenceCount
        })
      ) {
        return {
          data: null,
          error: new Error(ATTRIBUTE_VALUE_CODE_LOCKED_MESSAGE)
        };
      }
    }
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

    if (sets.length === 0) {
      return { data: [], error: null };
    }

    // Two batched queries instead of N+1 (per set × per attribute).
    const setIds = sets.map((s) => s.id);
    const { data: setAttrs, error: setAttrErr } = await db
      .from("itemAttributeSetAttribute")
      .select(
        "attributeSetId, attributeId, sortOrder, itemAttribute:attributeId(id, code, name)"
      )
      .in("attributeSetId", setIds)
      .order("sortOrder", { ascending: true });
    if (setAttrErr) throw setAttrErr;

    type SetAttrRow = {
      attributeSetId: string;
      attributeId: string;
      sortOrder: number | null;
      itemAttribute: { id: string; code: string; name: string } | null;
    };
    const rows = (setAttrs ?? []) as SetAttrRow[];
    const attributeIds = [
      ...new Set(
        rows
          .map((r) => r.itemAttribute?.id)
          .filter((id): id is string => Boolean(id))
      )
    ];

    const optionsByAttributeId = new Map<string, AttributeValueOption[]>();
    if (attributeIds.length > 0) {
      const { data: valueRows, error: valueErr } = await db
        .from("itemAttributeValue")
        .select("id, attributeId, code, name, sortOrder, companyId")
        .in("attributeId", attributeIds)
        .or(`companyId.eq.${companyId},companyId.is.null`)
        .order("sortOrder", { ascending: true })
        .order("code", { ascending: true });
      if (valueErr) throw valueErr;

      // Prefer company-specific rows over global when codes collide (same as
      // getAttributeValueOptions).
      const byAttrAndCode = new Map<
        string,
        {
          id: string;
          attributeId: string;
          code: string;
          name: string | null;
          sortOrder: number;
          companyId: string | null;
        }
      >();
      for (const v of valueRows ?? []) {
        const key = `${v.attributeId}::${v.code}`;
        const existing = byAttrAndCode.get(key);
        if (!existing || (v.companyId && !existing.companyId)) {
          byAttrAndCode.set(key, v);
        }
      }

      for (const v of byAttrAndCode.values()) {
        const list = optionsByAttributeId.get(v.attributeId) ?? [];
        list.push({
          id: v.id,
          code: v.code,
          name: v.name ?? v.code,
          sortOrder: v.sortOrder ?? 100
        });
        optionsByAttributeId.set(v.attributeId, list);
      }

      for (const [attrId, list] of optionsByAttributeId) {
        list.sort(
          (a, b) => a.sortOrder - b.sortOrder || a.code.localeCompare(b.code)
        );
        optionsByAttributeId.set(attrId, list);
      }
    }

    const attrsBySetId = new Map<string, AttributeSetFormAttribute[]>();
    for (const row of rows) {
      const attr = row.itemAttribute;
      if (!attr) continue;
      const list = attrsBySetId.get(row.attributeSetId) ?? [];
      list.push({
        id: attr.id,
        code: attr.code,
        name: attr.name,
        sortOrder: row.sortOrder ?? 100,
        options: optionsByAttributeId.get(attr.id) ?? []
      });
      attrsBySetId.set(row.attributeSetId, list);
    }

    const out: AttributeSetFormOption[] = sets.map((set) => ({
      id: set.id,
      code: set.code,
      name: set.name,
      attributes: attrsBySetId.get(set.id) ?? []
    }));

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

/**
 * Gate item creation on a complete attribute selection. Meant to run *before*
 * the item is inserted, so an incomplete item never persists.
 *
 * The attribute set is optional — an item can be created without one. But once a
 * set is chosen, the item must carry at least one value for every attribute of
 * that set, because the set + its values are frozen immediately after creation
 * (they can't be changed or completed later).
 *
 * Returns `{ field, message }` describing the first problem — `field` is the
 * form field name to attach the error to (`attributeSetId`, or `av__<attributeId>`
 * for a missing value) — or `null` when there is nothing to require (no set
 * chosen) or the chosen set is complete.
 */
export async function validateAttributeSelectionForCreate(
  client: Db,
  args: {
    itemType: string;
    companyId: string;
    attributeSetId: string;
    selections: Record<string, string[]>;
  }
): Promise<{ field: string; message: string } | null> {
  const db = client as any;

  // No set chosen — the set is optional, so nothing to require.
  if (!args.attributeSetId) return null;

  const sets = await getAttributeSetsForItemType(
    client,
    args.itemType,
    args.companyId
  );
  if (sets.error) throw sets.error;
  const available = (sets.data ?? []) as Array<{ id: string } | null>;

  if (!available.some((s) => s?.id === args.attributeSetId)) {
    return {
      field: "attributeSetId",
      message: "The selected attribute set is not available for this item type."
    };
  }

  const { data: setAttrs, error: setAttrErr } = await db
    .from("itemAttributeSetAttribute")
    .select("attributeId")
    .eq("attributeSetId", args.attributeSetId);
  if (setAttrErr) throw setAttrErr;

  const missing = ((setAttrs ?? []) as Array<{ attributeId: string }>).find(
    (a) => !(args.selections[a.attributeId]?.some(Boolean) ?? false)
  );
  if (missing) {
    return {
      field: `av__${missing.attributeId}`,
      message: "Select at least one value for this attribute."
    };
  }

  return null;
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

    // Selection rows carry no order of their own, so a bare read returns them in
    // physical row order (arbitrary). Order each attribute's selected values by
    // the catalog sortOrder (then code) so the UI lists them meaningfully — e.g.
    // sizes as L → XL → 2XL → 3XL → 4XL instead of a scrambled sequence.
    const valueIds = [
      ...new Set(
        (rows ?? []).map(
          (r: { attributeValueId: string }) => r.attributeValueId
        )
      )
    ];
    const orderByValueId = new Map<
      string,
      { sortOrder: number; code: string }
    >();
    if (valueIds.length) {
      const { data: values, error: valErr } = await db
        .from("itemAttributeValue")
        .select("id, sortOrder, code")
        .in("id", valueIds);
      if (valErr) throw valErr;
      for (const v of (values ?? []) as Array<{
        id: string;
        sortOrder: number | null;
        code: string | null;
      }>) {
        orderByValueId.set(v.id, {
          sortOrder: v.sortOrder ?? 100,
          code: v.code ?? ""
        });
      }
    }

    const sortedRows = [
      ...((rows ?? []) as Array<{
        attributeId: string;
        attributeValueId: string;
      }>)
    ].sort((a, b) => {
      const oa = orderByValueId.get(a.attributeValueId);
      const ob = orderByValueId.get(b.attributeValueId);
      const sa = oa?.sortOrder ?? 100;
      const sb = ob?.sortOrder ?? 100;
      if (sa !== sb) return sa - sb;
      return (oa?.code ?? "").localeCompare(ob?.code ?? "");
    });

    const selections: Record<string, string[]> = {};
    for (const row of sortedRows) {
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

/**
 * Write selections then create missing variant child SKUs.
 *
 * After an item is created, its attribute set and the values already assigned to
 * it are treated as immutable: the set can't be changed or added, and existing
 * values can only be added to, never removed. This protects downstream
 * production, purchase, and sales records that reference the variant SKUs those
 * selections produce. Pass `isCreate: true` from the create flow to establish
 * the initial baseline; every other caller (edits) is locked to additive-only.
 */
export async function syncItemVariantsFromSelections(
  client: Db,
  args: {
    itemId: string;
    companyId: string;
    userId: string;
    attributeSetId: string;
    selections: Record<string, string[]>;
    /** Set by the create flow to establish the initial set + selections. */
    isCreate?: boolean;
  }
): Promise<{ error: Error | null }> {
  // Validate the chosen set is actually assignable to this item's type. Routes
  // that build the request by hand (e.g. the consumable attributes action) don't
  // validate this via a form schema, so guard it here for every caller.
  const item = await client
    .from("item")
    .select("type, attributeSetId")
    .eq("id", args.itemId)
    .eq("companyId", args.companyId)
    .maybeSingle();
  if (item.error) return { error: item.error };
  if (!item.data) return { error: new Error("Item not found") };

  // Immutability guards for existing items. Skipped on create, where this call
  // establishes the baseline the guards later protect.
  if (!args.isCreate) {
    const currentSetId = (item.data as { attributeSetId: string | null })
      .attributeSetId;

    // An item created without an attribute set can never gain one.
    if (!currentSetId) {
      return {
        error: new Error(
          "An attribute set can't be added to an item that was created without one."
        )
      };
    }

    // The assigned attribute set can't be swapped for a different one.
    if (currentSetId !== args.attributeSetId) {
      return {
        error: new Error(
          "The attribute set can't be changed once it's assigned to an item."
        )
      };
    }

    // Assigned attribute values are additive-only: every value currently
    // selected must still be present. Removing one would archive its variant
    // SKU and orphan any production/purchase/sales records referencing it.
    const { data: currentSelections, error: currentErr } = await (client as any)
      .from("itemAttributeSelection")
      .select("attributeValueId")
      .eq("itemId", args.itemId)
      .eq("companyId", args.companyId);
    if (currentErr) return { error: currentErr };

    const provided = new Set<string>();
    for (const ids of Object.values(args.selections)) {
      for (const id of ids) if (id) provided.add(id);
    }
    const removed = (currentSelections ?? []).some(
      (row: { attributeValueId: string }) => !provided.has(row.attributeValueId)
    );
    if (removed) {
      return {
        error: new Error(
          "Attribute values can't be removed once assigned; you can only add new values."
        )
      };
    }
  }

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

  // An item must carry a value for every attribute of its set. Enforced only on
  // create: existing items are frozen to the attributes they were created with,
  // so an attribute added to the set later must not retroactively demand a value
  // on items that predate it.
  if (args.isCreate) {
    const { data: setAttrs, error: setAttrErr } = await (client as any)
      .from("itemAttributeSetAttribute")
      .select("attributeId")
      .eq("attributeSetId", args.attributeSetId);
    if (setAttrErr) return { error: setAttrErr };
    const missing = ((setAttrs ?? []) as Array<{ attributeId: string }>).some(
      (a) => !(args.selections[a.attributeId]?.some(Boolean) ?? false)
    );
    if (missing) {
      return {
        error: new Error(
          "Select at least one value for every attribute in the set."
        )
      };
    }
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

/**
 * Load the set of every active variant SKU `variantItemId` for a parent item,
 * used to validate that saved quantity cells point at real variants.
 */
async function loadParentVariantIds(
  client: Db,
  parentItemId: string,
  companyId: string
): Promise<Set<string>> {
  const db = client as any;
  const { data: variants, error: variantsError } = await db
    .from("itemVariant")
    .select("variantItemId")
    .eq("parentItemId", parentItemId)
    .eq("companyId", companyId);
  if (variantsError) throw variantsError;

  const ids = new Set<string>();
  for (const r of (variants ?? []) as Array<{ variantItemId: string }>) {
    if (r.variantItemId) ids.add(r.variantItemId);
  }
  return ids;
}

/**
 * Expand a Style/Consumable variantTable into { variantItemId, quantity } rows.
 * Each cell is `{ variantItemId, Quantities }`; variants are matched by the
 * stable variantItemId, validated against the parent's variants.
 */
export async function expandVariantsQuantityTable(
  client: Db,
  args: {
    parentItemId: string;
    companyId: string;
    variantQuantities: unknown;
  }
): Promise<{
  data: Array<{ variantItemId: string; quantity: number }>;
  error: Error | null;
}> {
  try {
    const raw = (args.variantQuantities ?? {}) as Record<string, unknown>;
    const table = Array.isArray(raw.variantTable)
      ? (raw.variantTable as Record<string, unknown>[])
      : [];

    const cells: Array<{ variantItemId: string; quantity: number }> = [];
    for (const row of table) {
      const variantItemId = String(row.variantItemId ?? "").trim();
      if (!variantItemId) continue;
      const qty = Number(row.Quantities ?? 0);
      if (!Number.isFinite(qty) || qty <= 0) continue;
      cells.push({ variantItemId, quantity: qty });
    }

    if (cells.length === 0) {
      return { data: [], error: null };
    }

    const validIds = await loadParentVariantIds(
      client,
      args.parentItemId,
      args.companyId
    );

    const out: Array<{ variantItemId: string; quantity: number }> = [];
    const seen = new Set<string>();
    for (const cell of cells) {
      if (!validIds.has(cell.variantItemId)) {
        throw new Error(
          `No variant SKU exists for ${cell.variantItemId}. Open the item and save its attribute selections to generate variants before shipping or receiving.`
        );
      }
      if (seen.has(cell.variantItemId)) {
        throw new Error(
          "Configuration maps more than one cell to the same variant SKU."
        );
      }
      seen.add(cell.variantItemId);
      out.push({ variantItemId: cell.variantItemId, quantity: cell.quantity });
    }

    return { data: out, error: null };
  } catch (error) {
    return {
      data: [],
      error: toError(error, "Failed to expand config table to variants")
    };
  }
}
