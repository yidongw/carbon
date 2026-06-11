import { requirePermissions } from "@carbon/auth/auth.server";
import {
  Copy,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
} from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react/macro";
import { useState } from "react";
import { createPortal } from "react-dom";
import { LuPanelLeft, LuPanelRight, LuSearch } from "react-icons/lu";
import type { LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData } from "react-router";
import {
  DetailTopbarContent,
  DetailTopbarPlainId,
  usePanels,
  useTopbarLeft
} from "~/components/Layout";
import { PanelProvider, ResizablePanels } from "~/components/Layout";
import type { FlatTreeItem } from "~/components/TreeView";
import type { MakeMethod, Method } from "~/modules/items";
import { getTemplate } from "~/modules/items";
import {
  getTemplateMakeMethods,
  getTemplateMethodMaterialsByMakeMethod
} from "~/modules/items/template.service";
import { BoMExplorer } from "~/modules/items/ui/Item";
import TemplateProperties from "~/modules/items/ui/Templates/TemplateProperties";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

type TemplateRow = {
  id: string;
  name: string;
  description: string | null;
  // The template table contains more fields (companyId, timestamps, etc).
  // We only need these three for the header + right properties panel.
};

type TemplateMakeMethodRow = {
  id: string;
  version: number;
  status: string;
};

type TemplateExplorerNode = FlatTreeItem<Method>;

export const handle: Handle = {
  breadcrumb: msg`Templates`,
  to: path.to.templates,
  module: "items"
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, companyId } = await requirePermissions(request, {
    view: "parts",
    bypassRls: true
  });

  const { templateId } = params;
  if (!templateId) throw new Error("Could not find templateId");

  const [template, makeMethods] = await Promise.all([
    getTemplate(client, templateId, companyId),
    getTemplateMakeMethods(client, templateId, companyId)
  ]);

  if (template.error || !template.data) {
    throw new Response("Not found", { status: 404 });
  }

  const requestedMethodId = new URL(request.url).searchParams.get("methodId");
  const selectedMethod =
    makeMethods.data?.find((m) => m.id === requestedMethodId) ??
    makeMethods.data?.find((m) => m.status === "Draft") ??
    makeMethods.data?.[0];

  let explorerNodes: TemplateExplorerNode[] = [];
  if (selectedMethod?.id) {
    const materials = await getTemplateMethodMaterialsByMakeMethod(
      client,
      selectedMethod.id
    );
    const itemIds = (materials.data ?? []).map((m) => m.itemId);

    const items =
      itemIds.length > 0
        ? await client
            .from("item")
            .select("id, name, readableIdWithRevision")
            .in("id", itemIds)
        : {
            data: [] as {
              id: string;
              name: string;
              readableIdWithRevision: string;
            }[]
          };

    const itemById = new Map(
      (items.data ?? []).map((item) => [
        item.id,
        {
          name: item.name,
          readableIdWithRevision: item.readableIdWithRevision
        }
      ])
    );

    const rootId = `template-root-${template.data.id}`;
    const rootData = {
      methodMaterialId: selectedMethod.id,
      makeMethodId: selectedMethod.id,
      materialMakeMethodId: selectedMethod.id,
      itemId: template.data.id,
      itemReadableId: template.data.id,
      itemType: "Part",
      description: template.data.name,
      unitOfMeasureCode: "",
      unitCost: 0,
      quantity: 1,
      methodType: "Make to Order",
      itemTrackingType: "Inventory",
      parentMaterialId: null,
      order: 1,
      operationId: null,
      isRoot: true,
      kit: false,
      revision: "",
      externalId: {},
      version: selectedMethod.version,
      replenishmentSystem: "Make"
    } as unknown as Method;

    const childNodes = (materials.data ?? []).map(
      (material, index): TemplateExplorerNode => {
        const item = itemById.get(material.itemId);
        const methodType = material.methodType as
          | "Purchase to Order"
          | "Pull from Inventory"
          | "Make to Order";
        const replenishmentSystem =
          methodType === "Purchase to Order"
            ? "Buy"
            : methodType === "Make to Order"
              ? "Make"
              : "Buy and Make";

        return {
          id: material.id,
          parentId: rootId,
          children: [],
          hasChildren: false,
          level: 1,
          data: {
            methodMaterialId: material.id,
            makeMethodId: selectedMethod.id,
            materialMakeMethodId:
              material.materialMakeMethodId ?? selectedMethod.id,
            itemId: material.itemId,
            itemReadableId: item?.readableIdWithRevision ?? material.itemId,
            itemType: "Part",
            description: item?.name ?? "",
            unitOfMeasureCode: material.unitOfMeasureCode,
            unitCost: 0,
            quantity: Number(material.quantity ?? 0),
            methodType,
            itemTrackingType: "Inventory",
            parentMaterialId: selectedMethod.id,
            order: material.order ?? index + 1,
            operationId: material.methodOperationId ?? null,
            isRoot: false,
            kit: material.kit ?? false,
            revision: "",
            externalId: {},
            version: selectedMethod.version,
            replenishmentSystem
          } as unknown as Method
        };
      }
    );

    explorerNodes = [
      {
        id: rootId,
        parentId: undefined,
        children: childNodes.map((node) => node.id),
        hasChildren: childNodes.length > 0,
        level: 0,
        data: rootData
      },
      ...childNodes
    ];
  }

  return {
    template: template.data,
    selectedMakeMethodId: selectedMethod?.id ?? null,
    selectedMakeMethod:
      (selectedMethod as
        | (TemplateMakeMethodRow & { templateId: string })
        | null) ?? null,
    explorerNodes
  };
}

function TemplateTopbarLeft({ template }: { template: TemplateRow }) {
  const { t } = useLingui();
  const { hasExplorer, toggleExplorer, toggleProperties } = usePanels();

  return (
    <HStack className="items-center w-full justify-between" spacing={1}>
      <DetailTopbarContent>
        {hasExplorer && (
          <IconButton
            aria-label={t`Toggle Explorer`}
            icon={<LuPanelLeft />}
            onClick={toggleExplorer}
            variant="ghost"
          />
        )}
        <DetailTopbarPlainId>{template.name}</DetailTopbarPlainId>
        <Copy text={template.name ?? ""} />
      </DetailTopbarContent>
      <IconButton
        aria-label={t`Toggle Properties`}
        icon={<LuPanelRight />}
        onClick={toggleProperties}
        variant="ghost"
      />
    </HStack>
  );
}

function TemplateHeader({ template }: { template: TemplateRow }) {
  const { leftSlotEl } = useTopbarLeft();

  return (
    <>
      {leftSlotEl && createPortal(<TemplateTopbarLeft template={template} />, leftSlotEl)}
    </>
  );
}

export default function TemplateLayoutRoute() {
  const { t } = useLingui();
  const { template, selectedMakeMethodId, selectedMakeMethod, explorerNodes } =
    useLoaderData<typeof loader>();
  const [filterText, setFilterText] = useState("");

  const adaptedMakeMethod = {
    id: selectedMakeMethod?.id ?? selectedMakeMethodId ?? template.id,
    itemId: template.id,
    version: selectedMakeMethod?.version ?? 1,
    status: selectedMakeMethod?.status ?? "Draft"
  } as MakeMethod;

  return (
    <PanelProvider key={template.id}>
      <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
        <TemplateHeader template={template as TemplateRow} />
        <div className="flex flex-1 min-h-0 h-full overflow-hidden w-full">
          <ResizablePanels
            explorer={
              <div className="flex flex-col h-full">
                <HStack className="w-full justify-between px-2 pt-2">
                  <h3 className="text-xxs text-foreground/70 uppercase font-light tracking-wide">
                    {t`Manufacturing`}
                  </h3>
                </HStack>
                <HStack className="w-full justify-between flex-shrink-0 p-2">
                  <InputGroup size="sm" className="flex flex-grow">
                    <InputLeftElement>
                      <LuSearch className="h-4 w-4" />
                    </InputLeftElement>
                    <Input
                      placeholder={t`Search...`}
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                    />
                  </InputGroup>
                </HStack>
                <div className="flex-1 min-h-0 px-2 pb-2">
                  <BoMExplorer
                    itemType="Part"
                    itemIdOverride={template.id}
                    makeMethod={adaptedMakeMethod}
                    methodId={adaptedMakeMethod.id}
                    methods={explorerNodes}
                    filterText={filterText}
                    hideSearch
                    disableNavigation
                    disableOnshapeSync
                    hideRootPreview
                  />
                </div>
              </div>
            }
            content={
              <div className="h-full min-h-0 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent w-full">
                <div className="p-2">
                  <TemplateProperties template={template as TemplateRow} />
                </div>
                <Outlet />
              </div>
            }
          />
        </div>
      </div>
    </PanelProvider>
  );
}
