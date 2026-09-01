import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { JSONContent } from "@carbon/react";
import { Menubar, VStack } from "@carbon/react";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, redirect, useLoaderData, useParams } from "react-router";
import { useRouteData } from "~/hooks";
import {
  getMakeMethodById,
  getMakeMethods,
  getMethodMaterialsByMakeMethod,
  getMethodOperationsByMakeMethodId,
  methodBindings
} from "~/modules/items";
import {
  BillOfMaterial,
  BillOfProcess,
  MakeMethodTools
} from "~/modules/items/ui/Item";
import type { MethodItemType, MethodType } from "~/modules/shared";
import { getTagsList } from "~/modules/shared";
import { path } from "~/utils/path";

const emptyConfigurationRuleBindings = {
  save: "#",
  delete: (_field: string) => "#"
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts",
    bypassRls: true
  });

  const { itemId, makeMethodId } = params;
  if (!itemId) throw new Error("Could not find itemId");
  if (!makeMethodId) throw new Error("Could not find makeMethodId");

  const [makeMethod, methodMaterials, methodOperations, tags] =
    await Promise.all([
      getMakeMethodById(client, makeMethodId, companyId),
      getMethodMaterialsByMakeMethod(client, makeMethodId),
      getMethodOperationsByMakeMethodId(client, makeMethodId),
      getTagsList(client, companyId, "operation")
    ]);

  if (makeMethod.error || !makeMethod.data) {
    throw redirect(
      path.to.styleDetails(itemId),
      await flash(
        request,
        error(makeMethod.error, "Failed to load make method")
      )
    );
  }

  if (methodOperations.error) {
    throw redirect(
      path.to.styleDetails(itemId),
      await flash(
        request,
        error(methodOperations.error, "Failed to load method operations")
      )
    );
  }
  if (methodMaterials.error) {
    throw redirect(
      path.to.styleDetails(itemId),
      await flash(
        request,
        error(methodMaterials.error, "Failed to load method materials")
      )
    );
  }

  return {
    makeMethod: makeMethod.data,
    methodMaterials:
      methodMaterials.data?.map((m) => ({
        ...m,
        description: m.item?.name ?? "",
        methodType: m.methodType as MethodType,
        itemType: m.itemType as MethodItemType
      })) ?? [],
    methodOperations:
      methodOperations.data?.map((operation) => ({
        ...operation,
        workCenterId: operation.workCenterId ?? undefined,
        operationSupplierProcessId:
          operation.operationSupplierProcessId ?? undefined,
        workInstruction: operation.workInstruction as JSONContent | null
      })) ?? [],
    makeMethods: getMakeMethods(client, makeMethod.data.itemId, companyId),
    tags: tags.data ?? []
  };
}

export default function StyleMakeMethodRoute() {
  const loaderData = useLoaderData<typeof loader>();
  const { makeMethod, makeMethods, methodMaterials, methodOperations, tags } =
    loaderData;

  const { itemId, makeMethodId } = useParams();
  if (!itemId) throw new Error("Could not find itemId");
  if (!makeMethodId) throw new Error("Could not find makeMethodId");

  const routeData = useRouteData<{
    styleSummary: { replenishmentSystem: string | null };
  }>(path.to.style(itemId));

  return (
    <VStack spacing={2} className="p-2">
      <Suspense fallback={<Menubar />}>
        <Await resolve={makeMethods}>
          {(resolvedMakeMethods) => (
            <MakeMethodTools
              itemId={makeMethod.itemId}
              makeMethods={resolvedMakeMethods.data ?? []}
              type="Style"
              currentMethodId={makeMethod.id}
            />
          )}
        </Await>
      </Suspense>
      <BillOfMaterial
        key={`bom:${makeMethodId}`}
        methodBindings={methodBindings(itemId)}
        configurationRuleBindings={emptyConfigurationRuleBindings}
        makeMethod={makeMethod as never}
        materials={methodMaterials as never}
        operations={methodOperations as never}
        configurable={false}
        configurationRules={[]}
        parameters={[]}
        replenishmentSystem={
          routeData?.styleSummary?.replenishmentSystem ?? undefined
        }
      />
      <BillOfProcess
        key={`bop:${makeMethodId}`}
        methodBindings={methodBindings(itemId)}
        configurationRuleBindings={emptyConfigurationRuleBindings}
        makeMethod={makeMethod as never}
        operations={methodOperations as never}
        materials={methodMaterials as never}
        configurable={false}
        configurationRules={[]}
        parameters={[]}
        tags={tags}
      />
    </VStack>
  );
}
