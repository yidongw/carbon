import type { Database, Json } from "@carbon/database";
import { getLocalTimeZone, now } from "@internationalized/date";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { z } from "zod";
import { sanitize } from "~/utils/supabase";
import type {
  operationParameterValidator,
  operationStepValidator,
  operationToolValidator
} from "../shared";
import type {
  configurationParameterGroupOrderValidator,
  configurationParameterGroupValidator,
  configurationParameterOrderValidator,
  configurationRuleValidator,
  methodMaterialValidator,
  methodOperationValidator,
  templateConfigurationParameterValidator,
  templateCreateValidator
} from "./items.models";
import type { ConfigurationParameter } from "./types";

async function resolveTemplateMethodMaterialStorageUnitIds(
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

export async function insertTemplate(
  client: SupabaseClient<Database>,
  args: z.infer<typeof templateCreateValidator> & {
    companyId: string;
    createdBy: string;
  }
) {
  const templateRow = await client
    .from("template")
    .insert({
      name: args.name,
      description: args.description ?? null,
      companyId: args.companyId,
      createdBy: args.createdBy
    })
    .select("id")
    .single();

  if (templateRow.error || !templateRow.data) return templateRow;

  const methodRow = await client
    .from("templateMakeMethod")
    .insert({
      templateId: templateRow.data.id,
      companyId: args.companyId,
      createdBy: args.createdBy,
      status: "Draft",
      version: 1
    })
    .select("id")
    .single();

  if (methodRow.error) return methodRow;

  return templateRow;
}

export async function getTemplate(
  client: SupabaseClient<Database>,
  templateId: string,
  companyId: string
) {
  return client
    .from("template")
    .select("*")
    .eq("id", templateId)
    .eq("companyId", companyId)
    .single();
}

export async function getTemplatesList(
  client: SupabaseClient<Database>,
  companyId: string
) {
  return client
    .from("template")
    .select("id, name, description, updatedAt")
    .eq("companyId", companyId)
    .order("name", { ascending: true });
}

export async function deleteTemplate(
  client: SupabaseClient<Database>,
  templateId: string,
  companyId: string
) {
  return client
    .from("template")
    .delete()
    .eq("id", templateId)
    .eq("companyId", companyId);
}

export async function getTemplateConfigurationParameters(
  client: SupabaseClient<Database>,
  templateId: string,
  companyId: string
) {
  const [parameters, groups] = await Promise.all([
    client
      .from("templateConfigurationParameter")
      .select("*")
      .eq("templateId", templateId)
      .eq("companyId", companyId),
    client
      .from("templateConfigurationParameterGroup")
      .select("*")
      .eq("templateId", templateId)
      .eq("companyId", companyId)
  ]);

  if (parameters.error || groups.error) {
    return { groups: [], parameters: [] };
  }

  return {
    groups: groups.data ?? [],
    parameters: parameters.data ?? []
  };
}

export function mapTemplateConfigurationParametersForForm(
  parameters: {
    id: string;
    companyId: string;
    templateConfigurationParameterGroupId: string | null;
    createdAt: string;
    createdBy: string;
    dataType: Database["public"]["Enums"]["configurationParameterDataType"];
    templateId: string;
    key: string;
    label: string;
    listOptions: string[] | null;
    materialFormFilterId: string | null;
    sortOrder: number;
    updatedAt: string | null;
    updatedBy: string | null;
  }[]
): ConfigurationParameter[] {
  return parameters.map((p) => ({
    id: p.id,
    companyId: p.companyId,
    configurationParameterGroupId: p.templateConfigurationParameterGroupId,
    createdAt: p.createdAt,
    createdBy: p.createdBy,
    dataType: p.dataType,
    itemId: p.templateId,
    key: p.key,
    label: p.label,
    listOptions: p.listOptions,
    materialFormFilterId: p.materialFormFilterId,
    sortOrder: p.sortOrder,
    updatedAt: p.updatedAt,
    updatedBy: p.updatedBy
  })) as ConfigurationParameter[];
}

export async function getTemplateConfigurationRules(
  client: SupabaseClient<Database>,
  templateId: string,
  companyId: string
) {
  const result = await client
    .from("templateConfigurationRule")
    .select("*")
    .eq("templateId", templateId)
    .eq("companyId", companyId);

  if (result.error) return [];
  return result.data ?? [];
}

export async function upsertTemplateConfigurationParameter(
  client: SupabaseClient<Database>,
  configurationParameter: z.infer<
    typeof templateConfigurationParameterValidator
  > & {
    companyId: string;
    userId: string;
  }
) {
  const { userId, ...data } = configurationParameter;
  if (configurationParameter.id) {
    const { configurationParameterGroupId, ...updateFields } = data;
    return client
      .from("templateConfigurationParameter")
      .update(
        sanitize({
          ...updateFields,
          templateConfigurationParameterGroupId:
            configurationParameterGroupId ?? null,
          updatedBy: userId,
          updatedAt: now(getLocalTimeZone()).toAbsoluteString()
        })
      )
      .eq("id", configurationParameter.id);
  }

  let ungroupedGroupId: string | null = null;
  const existingGroups = await client
    .from("templateConfigurationParameterGroup")
    .select("id, isUngrouped, sortOrder")
    .eq("templateId", data.templateId);

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
      .from("templateConfigurationParameterGroup")
      .insert({
        templateId: data.templateId,
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

  return client.from("templateConfigurationParameter").insert({
    templateId: data.templateId,
    key: data.key ?? "",
    label: data.label,
    dataType: data.dataType,
    sortOrder: 1,
    listOptions: data.dataType === "list" ? (data.listOptions ?? []) : null,
    companyId: data.companyId,
    createdBy: userId,
    templateConfigurationParameterGroupId: ungroupedGroupId,
    materialFormFilterId: data.materialFormFilterId || null
  });
}

export async function upsertTemplateConfigurationParameterGroup(
  client: SupabaseClient<Database>,
  configurationParameterGroup: z.infer<
    typeof configurationParameterGroupValidator
  > & {
    companyId: string;
    templateId: string;
  }
) {
  const { templateId, ...data } = configurationParameterGroup;
  if (configurationParameterGroup.id) {
    return client
      .from("templateConfigurationParameterGroup")
      .update({
        name: data.name
      })
      .eq("id", configurationParameterGroup.id);
  }

  const existingGroups = await client
    .from("templateConfigurationParameterGroup")
    .select("id, isUngrouped, sortOrder")
    .eq("templateId", templateId);

  const maxSortOrder =
    existingGroups.data?.reduce(
      (max, group) => Math.max(max, group.sortOrder ?? 1),
      1
    ) ?? 0;

  return client.from("templateConfigurationParameterGroup").insert({
    ...data,
    templateId,
    name: data.name,
    sortOrder: maxSortOrder + 1,
    companyId: configurationParameterGroup.companyId
  });
}

export async function deleteTemplateConfigurationParameter(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("templateConfigurationParameter").delete().eq("id", id);
}

export async function deleteTemplateConfigurationParameterGroup(
  client: SupabaseClient<Database>,
  id: string
) {
  const groupMeta = await client
    .from("templateConfigurationParameterGroup")
    .select("templateId")
    .eq("id", id)
    .single();

  const { data: parameters } = await client
    .from("templateConfigurationParameter")
    .select("id")
    .eq("templateConfigurationParameterGroupId", id);

  if (parameters && parameters.length > 0 && groupMeta.data?.templateId) {
    const { data: ungrouped } = await client
      .from("templateConfigurationParameterGroup")
      .select("id")
      .eq("isUngrouped", true)
      .eq("templateId", groupMeta.data.templateId)
      .single();

    if (ungrouped) {
      await client
        .from("templateConfigurationParameter")
        .update({ templateConfigurationParameterGroupId: ungrouped.id })
        .eq("templateConfigurationParameterGroupId", id);
    }
  }
  return client
    .from("templateConfigurationParameterGroup")
    .delete()
    .eq("id", id);
}

export async function updateTemplateConfigurationParameterGroupOrder(
  client: SupabaseClient<Database>,
  data: z.infer<typeof configurationParameterGroupOrderValidator>
) {
  return client
    .from("templateConfigurationParameterGroup")
    .update(sanitize(data))
    .eq("id", data.id);
}

export async function updateTemplateConfigurationParameterOrder(
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
    .from("templateConfigurationParameter")
    .update(
      sanitize({
        ...data,
        templateConfigurationParameterGroupId:
          data.configurationParameterGroupId
      })
    )
    .eq("id", data.id);
}

export async function upsertTemplateConfigurationRule(
  client: SupabaseClient<Database>,
  configurationRule: z.infer<typeof configurationRuleValidator> & {
    templateId: string;
    companyId: string;
    updatedBy: string;
  }
) {
  return client.from("templateConfigurationRule").upsert(
    {
      ...configurationRule,
      updatedAt: now(getLocalTimeZone()).toAbsoluteString()
    },
    { onConflict: "templateId,field" }
  );
}

export async function deleteTemplateConfigurationRule(
  client: SupabaseClient<Database>,
  field: string,
  templateId: string
) {
  return client
    .from("templateConfigurationRule")
    .delete()
    .eq("field", field)
    .eq("templateId", templateId);
}

export async function getTemplateMakeMethods(
  client: SupabaseClient<Database>,
  templateId: string,
  companyId: string
) {
  return client
    .from("templateMakeMethod")
    .select("*")
    .eq("templateId", templateId)
    .eq("companyId", companyId);
}

export async function getTemplateMakeMethodById(
  client: SupabaseClient<Database>,
  makeMethodId: string,
  companyId: string
) {
  return client
    .from("templateMakeMethod")
    .select("*")
    .eq("id", makeMethodId)
    .eq("companyId", companyId)
    .single();
}

export async function getTemplateMethodMaterialsByMakeMethod(
  client: SupabaseClient<Database>,
  templateMakeMethodId: string
) {
  return client
    .from("templateMethodMaterial")
    .select("*")
    .eq("templateMakeMethodId", templateMakeMethodId)
    .order("order", { ascending: true });
}

export async function getTemplateMethodOperationsByMakeMethodId(
  client: SupabaseClient<Database>,
  templateMakeMethodId: string
) {
  return (client as unknown as { from: (t: string) => any })
    .from("templateMethodOperation")
    .select(
      "*, templateMethodOperationTool(*), templateMethodOperationParameter(*), templateMethodOperationStep(*)"
    )
    .eq("templateMakeMethodId", templateMakeMethodId)
    .order("order", { ascending: true });
}

export async function upsertTemplateMethodMaterial(
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
  let materialMakeMethodId: string | null = null;
  if (methodMaterial.methodType === "Make to Order") {
    const makeMethod = await client
      .from("activeMakeMethods")
      .select("id, version")
      .eq("itemId", methodMaterial.itemId!)
      .single();

    if (makeMethod.error) return makeMethod;
    materialMakeMethodId = makeMethod.data?.id ?? null;
  }

  if ("createdBy" in methodMaterial) {
    const seededStorageUnitIds =
      await resolveTemplateMethodMaterialStorageUnitIds(client, {
        itemId: methodMaterial.itemId,
        current: methodMaterial.storageUnitIds as
          | Record<string, string>
          | undefined
      });
    const { makeMethodId, ...rest } = methodMaterial;
    return client
      .from("templateMethodMaterial")
      .insert([
        {
          ...rest,
          templateMakeMethodId: makeMethodId,
          itemId: methodMaterial.itemId!,
          storageUnitIds: seededStorageUnitIds,
          materialMakeMethodId,
          scrapQuantity: 0
        }
      ])
      .select("id")
      .single();
  }
  const { makeMethodId: _makeMethodId, ...rest } = methodMaterial;
  return client
    .from("templateMethodMaterial")
    .update(sanitize({ ...rest, materialMakeMethodId }))
    .eq("id", methodMaterial.id)
    .select("id")
    .single();
}

export async function deleteTemplateMethodMaterial(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("templateMethodMaterial").delete().eq("id", id);
}

export async function updateTemplateMaterialOrder(
  client: SupabaseClient<Database>,
  updates: {
    id: string;
    order: number;
    updatedBy: string;
  }[]
) {
  const updatePromises = updates.map(({ id, order, updatedBy }) =>
    client
      .from("templateMethodMaterial")
      .update({ order, updatedBy })
      .eq("id", id)
  );
  return Promise.all(updatePromises);
}

export async function upsertTemplateMethodOperation(
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
  const toRow = (row: Record<string, unknown>) => {
    const { makeMethodId, ...rest } = row;
    return { ...rest, templateMakeMethodId: makeMethodId as string };
  };

  if ("createdBy" in methodOperation && !("updatedBy" in methodOperation)) {
    return client
      .from("templateMethodOperation")
      .insert([
        toRow({
          ...(methodOperation as unknown as Record<string, unknown>)
        }) as never
      ])
      .select("id")
      .single();
  }
  return client
    .from("templateMethodOperation")
    .update(
      sanitize(
        toRow({ ...(methodOperation as unknown as Record<string, unknown>) })
      )
    )
    .eq("id", (methodOperation as { id: string }).id)
    .select("id")
    .single();
}

export async function deleteTemplateMethodOperation(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("templateMethodOperation").delete().eq("id", id);
}

export async function updateTemplateOperationOrder(
  client: SupabaseClient<Database>,
  updates: {
    id: string;
    order: number;
    updatedBy: string;
  }[]
) {
  const updatePromises = updates.map(({ id, order, updatedBy }) =>
    client
      .from("templateMethodOperation")
      .update({ order, updatedBy })
      .eq("id", id)
  );
  return Promise.all(updatePromises);
}

export async function assertTemplateMethodOperationIsDraft(
  client: SupabaseClient<Database>,
  operationId: string
) {
  const op = await client
    .from("templateMethodOperation")
    .select("templateMakeMethodId")
    .eq("id", operationId)
    .single();

  if (op.error || !op.data) {
    throw new Error("Failed to find template method operation");
  }

  const mm = await client
    .from("templateMakeMethod")
    .select("status")
    .eq("id", op.data.templateMakeMethodId)
    .single();

  if (mm.error || !mm.data) {
    throw new Error("Failed to find template make method");
  }

  if (mm.data.status !== "Draft") {
    throw new Error(
      `Cannot modify steps on a method version with status "${mm.data.status}". Only Draft versions can be modified.`
    );
  }
}

export async function upsertTemplateMethodOperationStep(
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
      .from("templateMethodOperationStep")
      .insert(methodOperationStep)
      .select("id")
      .single();
  }

  return client
    .from("templateMethodOperationStep")
    .update(sanitize(methodOperationStep))
    .eq("id", methodOperationStep.id)
    .select("id")
    .single();
}

export async function deleteTemplateMethodOperationStep(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("templateMethodOperationStep").delete().eq("id", id);
}

export async function upsertTemplateMethodOperationParameter(
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
      .from("templateMethodOperationParameter")
      .insert(methodOperationParameter)
      .select("id")
      .single();
  }

  return client
    .from("templateMethodOperationParameter")
    .update(sanitize(methodOperationParameter))
    .eq("id", methodOperationParameter.id)
    .select("id")
    .single();
}

export async function deleteTemplateMethodOperationParameter(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("templateMethodOperationParameter").delete().eq("id", id);
}

export async function upsertTemplateMethodOperationTool(
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
      .from("templateMethodOperationTool")
      .insert(methodOperationTool)
      .select("id")
      .single();
  }

  return client
    .from("templateMethodOperationTool")
    .update(sanitize(methodOperationTool))
    .eq("id", methodOperationTool.id)
    .select("id")
    .single();
}

export async function deleteTemplateMethodOperationTool(
  client: SupabaseClient<Database>,
  id: string
) {
  return client.from("templateMethodOperationTool").delete().eq("id", id);
}

export async function updateTemplateMethodOperationStepOrder(
  client: SupabaseClient<Database>,
  updates: {
    id: string;
    sortOrder: number;
    updatedBy: string;
  }[]
) {
  const updatePromises = updates.map(({ id, sortOrder, updatedBy }) =>
    client
      .from("templateMethodOperationStep")
      .update({ sortOrder, updatedBy })
      .eq("id", id)
  );
  return Promise.all(updatePromises);
}

export async function applyTemplateToItem(
  client: SupabaseClient<Database>,
  args: {
    templateId: string;
    itemId: string;
    companyId: string;
    userId: string;
  }
) {
  const { templateId, itemId, companyId, userId } = args;

  const [paramGroups, params, rules, templateMakeMethod, itemRow] =
    await Promise.all([
      client
        .from("templateConfigurationParameterGroup")
        .select("*")
        .eq("templateId", templateId)
        .eq("companyId", companyId),
      client
        .from("templateConfigurationParameter")
        .select("*")
        .eq("templateId", templateId)
        .eq("companyId", companyId),
      client
        .from("templateConfigurationRule")
        .select("*")
        .eq("templateId", templateId)
        .eq("companyId", companyId),
      client
        .from("templateMakeMethod")
        .select("id")
        .eq("templateId", templateId)
        .eq("companyId", companyId)
        .single(),
      client.from("item").select("readableId").eq("id", itemId).single()
    ]);

  // Store the templateId on the part record
  if (itemRow.data?.readableId) {
    await (client as unknown as { from: (t: string) => any })
      .from("part")
      .update({ templateId })
      .eq("id", itemRow.data.readableId)
      .eq("companyId", companyId);
  }

  // Copy configuration parameter groups and build old-id → new-id map
  const groupIdMap: Record<string, string> = {};
  if (paramGroups.data && paramGroups.data.length > 0) {
    const groupInsert = await client
      .from("configurationParameterGroup")
      .insert(
        paramGroups.data.map(({ id: _id, templateId: _tid, ...group }) => ({
          ...group,
          itemId
        }))
      )
      .select("id");

    if (!groupInsert.error && groupInsert.data) {
      paramGroups.data.forEach((oldGroup, i) => {
        if (groupInsert.data[i]) {
          groupIdMap[oldGroup.id] = groupInsert.data[i].id;
        }
      });
    }
  }

  // Copy configuration parameters
  if (params.data && params.data.length > 0) {
    await client.from("configurationParameter").insert(
      params.data.map(
        ({
          id: _id,
          templateId: _tid,
          templateConfigurationParameterGroupId,
          ...param
        }) => ({
          ...param,
          itemId,
          configurationParameterGroupId: templateConfigurationParameterGroupId
            ? (groupIdMap[templateConfigurationParameterGroupId] ?? null)
            : null
        })
      )
    );

    // Auto-enable "configured for manufacturing" when template has config params
    await client
      .from("itemReplenishment")
      .update({ requiresConfiguration: true })
      .eq("itemId", itemId)
      .eq("companyId", companyId);
  }

  // Copy configuration rules
  if (rules.data && rules.data.length > 0) {
    await client.from("configurationRule").insert(
      rules.data.map(({ templateId: _tid, ...rule }) => ({
        ...rule,
        itemId
      }))
    );
  }

  // Copy make method operations and materials
  if (!templateMakeMethod.data?.id) return;

  const templateMakeMethodId = templateMakeMethod.data.id;

  const [materials, operations, itemMakeMethod] = await Promise.all([
    client
      .from("templateMethodMaterial")
      .select("*")
      .eq("templateMakeMethodId", templateMakeMethodId)
      .order("order", { ascending: true }),
    (client as unknown as { from: (t: string) => any })
      .from("templateMethodOperation")
      .select(
        "*, templateMethodOperationTool(*), templateMethodOperationParameter(*), templateMethodOperationStep(*)"
      )
      .eq("templateMakeMethodId", templateMakeMethodId)
      .order("order", { ascending: true }),
    client
      .from("activeMakeMethods")
      .select("id")
      .eq("itemId", itemId)
      .eq("companyId", companyId)
      .single()
  ]);

  if (!itemMakeMethod.data?.id) return;
  const targetMakeMethodId = itemMakeMethod.data.id;

  if (materials.data && materials.data.length > 0) {
    await client.from("methodMaterial").insert(
      materials.data.map(
        ({
          id: _id,
          templateMakeMethodId: _tmid,
          productionQuantity: _pq,
          ...material
        }) => ({
          ...material,
          makeMethodId: targetMakeMethodId,
          methodOperationId: null,
          createdBy: userId
        })
      )
    );
  }

  if (!operations.data || operations.data.length === 0) return;

  for (const op of operations.data) {
    const {
      id: _id,
      templateMakeMethodId: _tmid,
      templateMethodOperationTool,
      templateMethodOperationParameter,
      templateMethodOperationStep,
      ...operationFields
    } = op;

    const newOperation = await client
      .from("methodOperation")
      .insert({
        ...operationFields,
        makeMethodId: targetMakeMethodId,
        createdBy: userId
      })
      .select("id")
      .single();

    if (newOperation.error || !newOperation.data?.id) continue;
    const newOperationId = newOperation.data.id;

    if (
      Array.isArray(templateMethodOperationTool) &&
      templateMethodOperationTool.length > 0
    ) {
      await client.from("methodOperationTool").insert(
        templateMethodOperationTool.map(
          ({ id: _id, operationId: _opId, updatedAt: _ua, ...tool }) => ({
            ...tool,
            operationId: newOperationId,
            companyId,
            createdBy: userId
          })
        )
      );
    }

    if (
      Array.isArray(templateMethodOperationParameter) &&
      templateMethodOperationParameter.length > 0
    ) {
      await client.from("methodOperationParameter").insert(
        templateMethodOperationParameter.map(
          ({ id: _id, operationId: _opId, ...param }) => ({
            ...param,
            operationId: newOperationId,
            companyId,
            createdBy: userId
          })
        )
      );
    }

    if (
      Array.isArray(templateMethodOperationStep) &&
      templateMethodOperationStep.length > 0
    ) {
      await client.from("methodOperationStep").insert(
        templateMethodOperationStep.map(
          ({ id: _id, operationId: _opId, ...step }) => ({
            ...step,
            operationId: newOperationId,
            companyId,
            createdBy: userId
          })
        )
      );
    }
  }
}

export function mapTemplateMethodOperationForBillOfProcess<
  T extends Record<string, unknown>
>(op: T) {
  const {
    templateMakeMethodId,
    templateMethodOperationTool,
    templateMethodOperationParameter,
    templateMethodOperationStep,
    ...rest
  } = op;

  return {
    ...rest,
    makeMethodId: templateMakeMethodId as string,
    methodOperationTool: templateMethodOperationTool ?? [],
    methodOperationParameter: templateMethodOperationParameter ?? [],
    methodOperationStep: templateMethodOperationStep ?? []
  };
}
