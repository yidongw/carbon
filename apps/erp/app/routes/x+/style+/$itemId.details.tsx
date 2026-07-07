import type { JSONContent } from "@carbon/react";
import { Menubar, VStack } from "@carbon/react";
import type { PostgrestResponse } from "@supabase/supabase-js";
import { Suspense } from "react";
import { Await, useParams } from "react-router";
import { useRouteData } from "~/hooks";
import type { ItemFile, MakeMethod } from "~/modules/items";
import { methodBindings } from "~/modules/items/methodBindings";
import {
  BillOfMaterial,
  BillOfProcess,
  ItemDocuments,
  ItemNotes,
  ItemRiskRegister,
  MakeMethodTools
} from "~/modules/items/ui/Item";
import type { MethodItemType, MethodType } from "~/modules/shared";
import { path } from "~/utils/path";

const emptyConfigurationRuleBindings = {
  save: "#",
  delete: (_field: string) => "#"
};

type StyleRouteData = {
  files: Promise<ItemFile[]>;
  makeMethods: Promise<PostgrestResponse<MakeMethod>>;
  methodData: {
    makeMethod: {
      id: string;
      itemId: string;
    };
    methodMaterials: Array<{
      description: string;
      itemType: MethodItemType;
      methodType: MethodType;
    }>;
    methodOperations: Array<{
      operationSupplierProcessId?: string;
      workCenterId?: string;
      workInstruction: JSONContent | null;
    }>;
  } | null;
  styleSummary: {
    id: string;
    name: string | null;
    notes: JSONContent | null;
    readableIdWithRevision: string | null;
    replenishmentSystem: string | null;
  };
  tags: { name: string }[];
};

export default function StyleDetailsRoute() {
  const { itemId } = useParams();
  if (!itemId) throw new Error("Could not find itemId");

  const routeData = useRouteData<StyleRouteData>(path.to.style(itemId));
  if (!routeData) throw new Error("Could not find style data");

  const { files, makeMethods, methodData, styleSummary, tags } = routeData;
  const isManufactured = styleSummary.replenishmentSystem !== "Buy";

  return (
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
            notes={styleSummary.notes ?? undefined}
          />
          {isManufactured && (
            <>
              <BillOfMaterial
                key={`bom:${itemId}`}
                methodBindings={methodBindings(itemId)}
                configurationRuleBindings={emptyConfigurationRuleBindings}
                makeMethod={methodData.makeMethod as never}
                materials={methodData.methodMaterials as never}
                operations={methodData.methodOperations as never}
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
                configurationRuleBindings={emptyConfigurationRuleBindings}
                makeMethod={methodData.makeMethod as never}
                operations={methodData.methodOperations as never}
                materials={methodData.methodMaterials as never}
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
            <ItemDocuments files={resolvedFiles} itemId={itemId} type="Style" />
          )}
        </Await>
      </Suspense>
      <ItemRiskRegister itemId={itemId} />
    </VStack>
  );
}
