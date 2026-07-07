import { error } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { flash } from "@carbon/auth/session.server";
import type { JSONContent } from "@carbon/react";
import { Menubar, VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Suspense } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Await, redirect, useLoaderData, useParams } from "react-router";
import { PanelProvider, ResizablePanels } from "~/components/Layout";
import type { ItemFile } from "~/modules/items";
import {
  getItemFiles,
  getMakeMethodById,
  getMakeMethods,
  getMethodMaterialsByMakeMethod,
  getMethodOperationsByMakeMethodId
} from "~/modules/items";
import { methodBindings } from "~/modules/items/methodBindings";
import { getStyle } from "~/modules/items/style.server";
import {
  BillOfMaterial,
  BillOfProcess,
  ItemDocuments,
  ItemNotes,
  ItemRiskRegister,
  MakeMethodTools
} from "~/modules/items/ui/Item";
import { StyleHeader, StyleProperties } from "~/modules/items/ui/Styles";
import type { MethodItemType, MethodType } from "~/modules/shared";
import { getTagsList } from "~/modules/shared";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Styles`,
  to: path.to.styles,
  module: "items"
};

const emptyConfigurationRuleBindings = {
  save: "#",
  delete: (_field: string) => "#"
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts",
    bypassRls: true
  });

  const { itemId } = params;
  if (!itemId) throw new Error("Could not find itemId");

  const [styleSummary, makeMethods, tags] = await Promise.all([
    getStyle(itemId, companyId),
    getMakeMethods(client, itemId, companyId),
    getTagsList(client, companyId, "style")
  ]);

  if (styleSummary.error || !styleSummary.data) {
    throw redirect(
      path.to.items,
      await flash(
        request,
        error(styleSummary.error, "Failed to load style summary")
      )
    );
  }

  const url = new URL(request.url);
  const requestedMethodId = url.searchParams.get("methodId");
  const activeMakeMethod = requestedMethodId
    ? (makeMethods.data?.find((m) => m.id === requestedMethodId) ??
      makeMethods.data?.find((m) => m.status === "Active") ??
      makeMethods.data?.[0])
    : (makeMethods.data?.find((m) => m.status === "Active") ??
      makeMethods.data?.[0]);

  const methodData = activeMakeMethod
    ? await (async () => {
        const fullMethod = await getMakeMethodById(
          client,
          activeMakeMethod.id,
          companyId
        );
        if (fullMethod.error || !fullMethod.data) return null;

        const [methodMaterials, methodOperations] = await Promise.all([
          getMethodMaterialsByMakeMethod(client, fullMethod.data.id),
          getMethodOperationsByMakeMethodId(client, fullMethod.data.id)
        ]);

        return {
          makeMethod: fullMethod.data,
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
            })) ?? []
        };
      })()
    : null;

  return {
    styleSummary: {
      ...styleSummary.data,
      styleColorBadges: styleSummary.data.colors ?? []
    },
    files: getItemFiles(client, itemId, companyId),
    makeMethods: Promise.resolve(makeMethods),
    tags: tags.data ?? [],
    methodData
  };
}

export default function StyleRoute() {
  const { itemId } = useParams();
  if (!itemId) throw new Error("Could not find itemId");

  const { files, makeMethods, methodData, styleSummary, tags } =
    useLoaderData<typeof loader>();

  const isManufactured = styleSummary.replenishmentSystem !== "Buy";

  return (
    <PanelProvider>
      <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
        <StyleHeader />
        <div className="flex h-[calc(100dvh-99px)] overflow-hidden w-full">
          <div className="flex flex-1 min-h-0 h-full overflow-hidden">
            <ResizablePanels
              content={
                <div className="h-full min-h-0 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent w-full">
                  <VStack spacing={2} className="p-2">
                    {methodData && (
                      <>
                        <Suspense fallback={<Menubar />}>
                          <Await resolve={makeMethods}>
                            {(resolvedMakeMethods) => (
                              <MakeMethodTools
                                itemId={methodData.makeMethod.itemId}
                                makeMethods={resolvedMakeMethods.data ?? []}
                                type="Style"
                                currentMethodId={methodData.makeMethod.id}
                              />
                            )}
                          </Await>
                        </Suspense>
                        <ItemNotes
                          id={styleSummary.id}
                          title={styleSummary.name ?? ""}
                          subTitle={styleSummary.readableIdWithRevision ?? ""}
                          notes={styleSummary.notes as unknown as JSONContent}
                        />
                        {isManufactured && (
                          <>
                            <BillOfMaterial
                              key={`bom:${itemId}`}
                              methodBindings={methodBindings(itemId)}
                              configurationRuleBindings={
                                emptyConfigurationRuleBindings
                              }
                              makeMethod={methodData.makeMethod}
                              // @ts-ignore
                              materials={methodData.methodMaterials}
                              // @ts-ignore
                              operations={methodData.methodOperations}
                              configurable={false}
                              configurationRules={[]}
                              parameters={[]}
                              replenishmentSystem={
                                styleSummary.replenishmentSystem ?? undefined
                              }
                            />
                            <BillOfProcess
                              key={`bop:${itemId}`}
                              methodBindings={methodBindings(itemId)}
                              configurationRuleBindings={
                                emptyConfigurationRuleBindings
                              }
                              makeMethod={methodData.makeMethod}
                              // @ts-ignore
                              operations={methodData.methodOperations}
                              // @ts-ignore
                              materials={methodData.methodMaterials}
                              configurable={false}
                              configurationRules={[]}
                              parameters={[]}
                              tags={tags}
                            />
                          </>
                        )}
                      </>
                    )}
                    <Suspense fallback={null}>
                      <Await resolve={files}>
                        {(resolvedFiles: ItemFile[]) => (
                          <ItemDocuments
                            files={resolvedFiles}
                            itemId={itemId}
                            type="Style"
                          />
                        )}
                      </Await>
                    </Suspense>
                    <ItemRiskRegister itemId={itemId} />
                  </VStack>
                </div>
              }
              properties={<StyleProperties key={itemId} />}
            />
          </div>
        </div>
      </div>
    </PanelProvider>
  );
}
