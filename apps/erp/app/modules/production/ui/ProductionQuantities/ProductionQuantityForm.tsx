import { ValidatedForm } from "@carbon/form";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import type { z } from "zod";
import { Hidden, Select, Submit, TextArea } from "~/components/Form";
import {
  ProductionActorFields,
  selectionFromInitialValues
} from "../Jobs/ProductionActorFields";
import { ProductionQuantityLinesEditor } from "../Jobs/ProductionQuantityLinesEditor";
import { SupplierSubcontractPricingFields } from "../Jobs/SupplierSubcontractPricingFields";
import { usePermissions } from "~/hooks";
import { preventDismissOnPortaledContent } from "~/utils/dom";
import type { ConfigReferenceSource } from "../../configParamsTableColumns";
import type { ProductionQuantityLineInput } from "~/modules/production/productionQuantityReport.models";
import { path } from "~/utils/path";
import { productionQuantityCreateFormValidator } from "../../production.models";

type ConfigurationParameter = {
  key: string;
  label: string;
  dataType: string;
  listOptions?: string[] | null;
};

export type ProductionQuantityFormProps = {
  jobId?: string;
  jobOperationId: string;
  jobOptions?: { label: string; value: string }[];
  operationOptions?: { label: string; value: string }[];
  configurationParameters?: ConfigurationParameter[] | null;
  configReferenceSource?: ConfigReferenceSource | null;
  itemId?: string | null;
  processId?: string | null;
  operationType?: string | null;
  defaultActorKind?: "employee" | "supplier";
  lockActorSelection?: boolean;
  supplierId?: string;
  seededActor?: {
    kind: "employee" | "supplier";
    employeeId?: string;
    supplierProcessId?: string;
  } | null;
  onDismiss?: () => void;
  action?: string;
  fetcher?: import("react-router").FetcherWithComponents<unknown>;
};

export const ProductionQuantityForm = ({
  jobId: initialJobId,
  jobOperationId: initialJobOperationId,
  jobOptions,
  operationOptions,
  configurationParameters,
  configReferenceSource,
  itemId,
  processId,
  operationType,
  defaultActorKind,
  lockActorSelection: lockActorSelectionProp,
  supplierId,
  seededActor,
  onDismiss: onDismissProp,
  action: formAction,
  fetcher
}: ProductionQuantityFormProps) => {
  const permissions = usePermissions();
  const { t } = useLingui();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isOverlay = fetcher != null;
  const onDismiss = onDismissProp ?? (() => navigate(path.to.productionQuantities));

  const selectedJobId = searchParams.get("jobId") ?? initialJobId ?? "";
  const selectedJobOperationId =
    searchParams.get("jobOperationId") ?? initialJobOperationId ?? "";
  const hasJobSelected = Boolean(selectedJobId);
  const hasOperationSelected = Boolean(selectedJobOperationId);
  const [actorSelection, setActorSelection] = useState(() =>
    selectionFromInitialValues({
      employeeId: seededActor?.kind === "employee" ? seededActor.employeeId : undefined,
      supplierProcessId:
        seededActor?.kind === "supplier" ? seededActor.supplierProcessId : undefined
    })
  );
  const hasActorSelected = Boolean(actorSelection);

  useEffect(() => {
    setActorSelection(
      selectionFromInitialValues({
        employeeId:
          seededActor?.kind === "employee" ? seededActor.employeeId : undefined,
        supplierProcessId:
          seededActor?.kind === "supplier"
            ? seededActor.supplierProcessId
            : undefined
      })
    );
  }, [
    selectedJobId,
    selectedJobOperationId,
    seededActor?.kind,
    seededActor?.employeeId,
    seededActor?.supplierProcessId
  ]);

  const [lines, setLines] = useState<ProductionQuantityLineInput[]>([
    { type: "Production", quantity: 0, configuration: undefined }
  ]);

  const isDisabled = !permissions.can("create", "production");

  const updateSearchParams = (updates: {
    jobId?: string | null;
    jobOperationId?: string | null;
  }) => {
    const newParams = new URLSearchParams(searchParams);
    if (updates.jobId !== undefined) {
      if (updates.jobId) {
        newParams.set("jobId", updates.jobId);
      } else {
        newParams.delete("jobId");
      }
    }
    if (updates.jobOperationId !== undefined) {
      if (updates.jobOperationId) {
        newParams.set("jobOperationId", updates.jobOperationId);
      } else {
        newParams.delete("jobOperationId");
      }
    }

    const search = newParams.toString();
    navigate(
      {
        pathname: location.pathname,
        search: search ? `?${search}` : ""
      },
      { replace: true }
    );
  };

  const handleJobChange = (value: string) => {
    updateSearchParams({ jobId: value, jobOperationId: null });
  };

  const handleOperationChange = (value: string) => {
    updateSearchParams({ jobOperationId: value });
  };

  const lockActorSelection = Boolean(lockActorSelectionProp);

  const initialValues = {
    jobId: selectedJobId || undefined,
    jobOperationId: selectedJobOperationId || undefined,
    actorKind: defaultActorKind ?? "employee",
    employeeId: seededActor?.kind === "employee" ? seededActor.employeeId : undefined,
    supplierProcessId:
      seededActor?.kind === "supplier" ? seededActor.supplierProcessId : undefined,
    notes: undefined,
    lines: JSON.stringify(lines)
  };

  const form = (
    <ValidatedForm
      key={`${selectedJobId}:${selectedJobOperationId}`}
      validator={productionQuantityCreateFormValidator}
      method="post"
      defaultValues={initialValues}
      className="flex flex-col h-full"
      action={formAction}
      fetcher={fetcher}
    >
      <DrawerHeader>
        <DrawerTitle>
          <Trans>Record Production Quantity</Trans>
        </DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <VStack spacing={4}>
          <Select
            name="jobId"
            label={t`Job`}
            options={jobOptions ?? []}
            onChange={(newValue) => {
              if (newValue?.value) handleJobChange(newValue.value);
            }}
          />
          <Select
            key={selectedJobId || "no-job"}
            name="jobOperationId"
            label={t`Operation`}
            options={operationOptions ?? []}
            isDisabled={!hasJobSelected}
            onChange={(newValue) => {
              if (newValue?.value) handleOperationChange(newValue.value);
            }}
          />
          <ProductionActorFields
            processId={processId}
            operationType={operationType}
            defaultActorKind={defaultActorKind}
            lockActorSelection={lockActorSelection}
            isDisabled={!hasOperationSelected}
            employeeIdValue={initialValues.employeeId}
            supplierProcessIdValue={initialValues.supplierProcessId}
            supplierIdValue={supplierId}
            onSelectionChange={setActorSelection}
          />
          {defaultActorKind === "supplier" && (
            <SupplierSubcontractPricingFields
              jobOperationId={selectedJobOperationId}
              supplierProcessId={initialValues.supplierProcessId}
              isDisabled={!hasActorSelected}
            />
          )}
          <ProductionQuantityLinesEditor
            lines={lines}
            onChange={setLines}
            configurationParameters={configurationParameters}
            configReferenceSource={configReferenceSource}
            itemId={itemId}
            isDisabled={!hasActorSelected}
          />
          <Hidden name="lines" value={JSON.stringify(lines)} />
          <TextArea
            name="notes"
            label={t`Notes`}
            isDisabled={!hasActorSelected}
          />
        </VStack>
      </DrawerBody>
      <DrawerFooter>
        <HStack>
          <Submit
            isDisabled={isDisabled}
            className="transition-transform active:scale-[0.96]"
          >
            <Trans>Save</Trans>
          </Submit>
          <Button
            variant="solid"
            type="button"
            onClick={onDismiss}
            className="transition-transform active:scale-[0.96]"
          >
            <Trans>Cancel</Trans>
          </Button>
        </HStack>
      </DrawerFooter>
    </ValidatedForm>
  );

  if (isOverlay) {
    return form;
  }

  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onDismiss();
      }}
    >
      <DrawerContent
        onPointerDownOutside={preventDismissOnPortaledContent}
        onInteractOutside={preventDismissOnPortaledContent}
      >
        {form}
      </DrawerContent>
    </Drawer>
  );
};
