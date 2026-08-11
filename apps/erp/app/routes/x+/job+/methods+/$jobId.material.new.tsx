import { assertIsPost, error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import { flash } from "@carbon/auth/session.server";
import type { Json } from "@carbon/database";
import { validationError, validator } from "@carbon/form";
import { nanoid } from "nanoid";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { resolveMaterialVariantQuantities } from "~/modules/items/styleOrderLines.server";
import {
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
  const { companyId, userId } = await requirePermissions(request, {
    create: "production"
  });

  const { jobId } = params;
  if (!jobId) {
    throw new Error("jobId not found");
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
      // Invalid JSON — create without expand.
    }
  }

  const serviceRole = getCarbonServiceRole();
  const resolved = await resolveMaterialVariantQuantities(serviceRole, {
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

  // Check if job is released (not Draft or Planned)
  const job = await serviceRole
    .from("job")
    .select("status")
    .eq("id", jobId)
    .single();
  const isReleased = !["Draft", "Planned"].includes(job.data?.status ?? "");

  const insertOne = async (args: {
    id: string;
    itemId: string;
    quantity: number;
    order: number;
  }) => {
    const insertJobMaterial = await upsertJobMaterial(serviceRole, {
      ...d,
      id: args.id,
      itemId: args.itemId,
      quantity: args.quantity,
      order: args.order,
      jobId,
      companyId,
      createdBy: userId,
      customFields: setCustomFields(formData)
    });
    if (insertJobMaterial.error) {
      return {
        ok: false as const,
        response: data(
          { id: null },
          await flash(
            request,
            error(insertJobMaterial.error, "Failed to insert job material")
          )
        )
      };
    }

    const jobMaterialId = insertJobMaterial.data?.id;
    if (!jobMaterialId) {
      return {
        ok: false as const,
        response: data(
          { id: null },
          await flash(
            request,
            error(insertJobMaterial, "Failed to insert job material")
          )
        )
      };
    }

    if (d.methodType === "Make to Order") {
      const materialMakeMethod = await serviceRole
        .from("jobMaterialWithMakeMethodId")
        .select("*")
        .eq("id", jobMaterialId)
        .single();
      if (materialMakeMethod.error) {
        return {
          ok: false as const,
          response: data(
            { id: null },
            await flash(
              request,
              error(
                materialMakeMethod.error,
                "Failed to get material make method"
              )
            )
          )
        };
      }
      const makeMethod = await upsertJobMaterialMakeMethod(serviceRole, {
        sourceId: args.itemId,
        targetId: materialMakeMethod.data?.jobMaterialMakeMethodId!,
        companyId,
        userId
      });

      if (makeMethod.error) {
        return {
          ok: false as const,
          response: data(
            { id: jobMaterialId },
            await flash(
              request,
              error(
                makeMethod.error,
                "Failed to insert job material make method"
              )
            )
          )
        };
      }
    }

    return { ok: true as const, id: jobMaterialId };
  };

  if (resolved.mode === "expand") {
    let firstId: string | null = null;
    for (let i = 0; i < resolved.variants.length; i++) {
      const variant = resolved.variants[i];
      const inserted = await insertOne({
        id: i === 0 ? d.id : nanoid(),
        itemId: variant.variantItemId,
        quantity: variant.quantity,
        order: d.order + i
      });
      if (!inserted.ok) return inserted.response;
      if (i === 0) firstId = inserted.id;
    }

    if (isReleased && firstId) {
      const promises = [
        recalculateJobMakeMethodRequirements(serviceRole, {
          id: d.jobMakeMethodId,
          companyId,
          userId
        }),
        recalculateJobOperationDependencies(serviceRole, {
          jobId,
          companyId,
          userId
        })
      ];

      const [recalculateResult, recalculateDependencies] =
        await Promise.all(promises);

      if (recalculateResult.error) {
        return data(
          { id: firstId },
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
          { id: firstId },
          await flash(
            request,
            error(
              recalculateDependencies.error,
              "Failed to recalculate job operation dependencies"
            )
          )
        );
      }
    }

    return {
      id: firstId,
      success: true,
      message: "Materials created"
    };
  }

  const inserted = await insertOne({
    id: d.id,
    itemId: d.itemId,
    quantity: resolved.quantity,
    order: d.order
  });
  if (!inserted.ok) return inserted.response;
  const jobMaterialId = inserted.id;

  // Recalculate for ALL material types if job is released
  if (isReleased) {
    const promises = [
      recalculateJobMakeMethodRequirements(serviceRole, {
        id: d.jobMakeMethodId,
        companyId,
        userId
      }),
      recalculateJobOperationDependencies(serviceRole, {
        jobId,
        companyId,
        userId
      })
    ];

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
  }

  return {
    id: jobMaterialId,
    success: true,
    message: "Material created"
  };
}
