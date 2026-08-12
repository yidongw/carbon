import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { validationError, validator } from "@carbon/form";
import { nanoid } from "nanoid";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { resolveMaterialVariantQuantities } from "~/modules/items/styleOrderLines.server";
import {
  deleteJobMaterial,
  jobMaterialValidator,
  recalculateJobMakeMethodRequirements,
  recalculateJobOperationDependencies,
  upsertJobMaterial,
  upsertJobMaterialMakeMethod
} from "~/modules/production";
import {
  readVariantQuantitiesFormRaw,
  variantTableUpdateFields
} from "~/modules/production/variantsQuantityOverlay.server";
import { setCustomFields } from "~/utils/form";

export async function action({ request, params }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, companyId, userId } = await requirePermissions(request, {
    create: "production",
    bypassRls: true
  });

  const { jobId, id } = params;
  if (!jobId) {
    throw new Error("jobId not found");
  }

  if (!id) {
    throw new Error("id not found");
  }

  const formData = await request.formData();
  const validation = await validator(jobMaterialValidator).validate(formData);

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    variantQuantities: variantQuantitiesFromValidator,
    quantity: rawQuantity,
    ...d
  } = validation.data;

  let quantity = rawQuantity;
  let variantQuantities: Json | undefined;
  const variantQuantitiesRaw = readVariantQuantitiesFormRaw(
    formData,
    variantQuantitiesFromValidator
  );
  if (variantQuantitiesRaw) {
    try {
      const parsed = JSON.parse(variantQuantitiesRaw) as Record<
        string,
        unknown
      >;
      const fields = variantTableUpdateFields(parsed);
      variantQuantities = fields.variantQuantities;
      quantity = fields.quantity;
    } catch {
      // Invalid JSON — update without expand.
    }
  }

  const resolved = await resolveMaterialVariantQuantities(client, {
    companyId,
    itemId: d.itemId,
    quantity,
    variantQuantities
  });
  if (!resolved.ok) {
    return data(
      { id: null },
      await flash(request, error(resolved.error, resolved.error))
    );
  }

  const recalculateAfterWrite = async (jobMaterialId: string) => {
    if (d.methodType === "Make to Order") {
      const promises = [
        recalculateJobMakeMethodRequirements(client, {
          id: d.jobMakeMethodId,
          companyId,
          userId
        })
      ];

      if (d.jobOperationId) {
        promises.push(
          recalculateJobOperationDependencies(client, {
            jobId,
            companyId,
            userId
          })
        );
      }

      const [recalculateResult, recalculateDependencies] =
        await Promise.all(promises);

      if (recalculateResult.error) {
        return data(
          { id: jobMaterialId },
          await flash(
            request,
            error(
              recalculateResult.error,
              "Failed to recalculate job make method requirements"
            )
          )
        );
      }

      if (recalculateDependencies?.error) {
        return data(
          { id: jobMaterialId },
          await flash(
            request,
            error(
              recalculateDependencies.error,
              "Failed to recalculate job operation dependencies"
            )
          )
        );
      }
    } else {
      const recalculateResult = await recalculateJobMakeMethodRequirements(
        client,
        {
          id: d.jobMakeMethodId,
          companyId,
          userId
        }
      );

      if (recalculateResult.error) {
        return data(
          { id: jobMaterialId },
          await flash(
            request,
            error(
              recalculateResult.error,
              "Failed to recalculate job make method requirements"
            )
          )
        );
      }
    }

    return null;
  };

  if (resolved.mode === "expand") {
    // Replace this material with one row per variant SKU.
    await deleteJobMaterial(client, id);

    let firstId: string | null = null;
    let firstMethodType: string | null = null;

    for (let i = 0; i < resolved.variants.length; i++) {
      const variant = resolved.variants[i];
      const insertJobMaterial = await upsertJobMaterial(client, {
        ...d,
        id: nanoid(),
        itemId: variant.variantItemId,
        quantity: variant.quantity,
        order: d.order + i,
        jobId,
        companyId,
        createdBy: userId,
        customFields: setCustomFields(formData)
      });
      if (insertJobMaterial.error) {
        return data(
          { id: null },
          await flash(
            request,
            error(insertJobMaterial.error, "Failed to update job materials")
          )
        );
      }

      const jobMaterialId = insertJobMaterial.data?.id;
      if (!jobMaterialId) {
        return data(
          { id: null },
          await flash(
            request,
            error(insertJobMaterial, "Failed to update job materials")
          )
        );
      }

      if (i === 0) {
        firstId = jobMaterialId;
        firstMethodType = insertJobMaterial.data.methodType;
      }

      if (d.methodType === "Make to Order") {
        const materialMakeMethod = await client
          .from("jobMaterialWithMakeMethodId")
          .select("*")
          .eq("id", jobMaterialId)
          .single();
        if (materialMakeMethod.error) {
          return data(
            { id: firstId },
            await flash(
              request,
              error(
                materialMakeMethod.error,
                "Failed to get material make method"
              )
            )
          );
        }
        const makeMethod = await upsertJobMaterialMakeMethod(client, {
          sourceId: variant.variantItemId,
          targetId: materialMakeMethod.data?.jobMaterialMakeMethodId!,
          companyId,
          userId
        });
        if (makeMethod.error) {
          return data(
            { id: firstId },
            await flash(
              request,
              error(
                makeMethod.error,
                "Failed to insert job material make method"
              )
            )
          );
        }
      }
    }

    if (firstId) {
      const recalcError = await recalculateAfterWrite(firstId);
      if (recalcError) return recalcError;
    }

    return {
      id: firstId,
      methodType: firstMethodType,
      success: true,
      message: "Materials updated"
    };
  }

  const updateJobMaterial = await upsertJobMaterial(client, {
    jobId,
    ...d,
    id: id,
    quantity: resolved.quantity,
    companyId,
    updatedBy: userId,
    customFields: setCustomFields(formData)
  });
  if (updateJobMaterial.error) {
    return data(
      {
        id: null
      },
      await flash(
        request,
        error(updateJobMaterial.error, "Failed to update job material")
      )
    );
  }

  const jobMaterialId = updateJobMaterial.data?.id;
  if (!jobMaterialId) {
    return data(
      {
        id: null
      },
      await flash(
        request,
        error(updateJobMaterial, "Failed to update job material")
      )
    );
  }

  const recalcError = await recalculateAfterWrite(jobMaterialId);
  if (recalcError) return recalcError;

  return {
    id: jobMaterialId,
    methodType: updateJobMaterial.data.methodType,
    success: true,
    message: "Material updated"
  };
}
