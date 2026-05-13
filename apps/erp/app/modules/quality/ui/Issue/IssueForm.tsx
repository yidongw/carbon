import {
  CreatableCombobox,
  DatePicker,
  MultiSelect,
  Select,
  SelectControlled,
  TextArea,
  ValidatedForm
} from "@carbon/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  VStack
} from "@carbon/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Trans, useLingui } from "@lingui/react/macro";
import { useState } from "react";
import type { FetcherWithComponents } from "react-router";
import { useLocation, useNavigate } from "react-router";
import type { z } from "zod";
import {
  CustomFormFields,
  Hidden,
  Input,
  Location,
  Submit
} from "~/components/Form";
import { useNewEntityForm } from "~/components/NewEntityModal";
import { usePermissions, useUser } from "~/hooks";
import { useItems } from "~/stores/items";
import type { ListItem } from "~/types";
import { path } from "~/utils/path";
import {
  issueValidator,
  nonConformanceApprovalRequirement,
  nonConformancePriority,
  nonConformanceSource
} from "../../quality.models";
import type { IssueWorkflow } from "../../types";
import { getPriorityIcon, getSourceIcon } from "./IssueIcons";

type IssueFormValues = z.infer<typeof issueValidator>;

type IssueFormProps = {
  initialValues?: Partial<IssueFormValues>;
  nonConformanceWorkflows: IssueWorkflow[];
  nonConformanceTypes: ListItem[];
  requiredActions: ListItem[];
  searchParams?: URLSearchParams;
  fetcher?: FetcherWithComponents<unknown>;
};

const IssueForm = ({
  initialValues: initialValuesProp,
  nonConformanceWorkflows,
  nonConformanceTypes,
  requiredActions,
  searchParams,
  fetcher
}: IssueFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLingui();
  const modalFetcher = useNewEntityForm(path.to.newIssue);
  const submitFetcher = fetcher ?? modalFetcher;
  const permissions = usePermissions();
  const { defaults } = useUser();
  const initialValues = {
    id: undefined,
    nonConformanceId: undefined,
    approvalRequirements: [],
    customerId: "",
    items: [],
    jobId: "",
    jobOperationId: "",
    itemId: "",
    locationId: defaults?.locationId ?? "",
    name: "",
    nonConformanceTypeId: "",
    nonConformanceWorkflowId: "",
    openDate: today(getLocalTimeZone()).toString(),
    priority: "Medium" as const,
    purchaseOrderId: "",
    purchaseOrderLineId: "",
    quantity: 1,
    requiredActionIds: [],
    salesOrderId: "",
    salesOrderLineId: "",
    shipmentId: "",
    shipmentLineId: "",
    source: "Internal" as const,
    supplierId: "",
    trackedEntityId: "",
    operationSupplierProcessId: "",
    ...(searchParams?.get("customerId")
      ? { customerId: searchParams.get("customerId")! }
      : {}),
    ...(searchParams?.get("itemId")
      ? {
          itemId: searchParams.get("itemId")!,
          items: [searchParams.get("itemId")!]
        }
      : {}),
    ...(searchParams?.get("jobId")
      ? { jobId: searchParams.get("jobId")! }
      : {}),
    ...(searchParams?.get("jobOperationId")
      ? { jobOperationId: searchParams.get("jobOperationId")! }
      : {}),
    ...(searchParams?.get("purchaseOrderId")
      ? { purchaseOrderId: searchParams.get("purchaseOrderId")! }
      : {}),
    ...(searchParams?.get("purchaseOrderLineId")
      ? { purchaseOrderLineId: searchParams.get("purchaseOrderLineId")! }
      : {}),
    ...(searchParams?.get("salesOrderId")
      ? { salesOrderId: searchParams.get("salesOrderId")! }
      : {}),
    ...(searchParams?.get("salesOrderLineId")
      ? { salesOrderLineId: searchParams.get("salesOrderLineId")! }
      : {}),
    ...(searchParams?.get("shipmentId")
      ? { shipmentId: searchParams.get("shipmentId")! }
      : {}),
    ...(searchParams?.get("shipmentLineId")
      ? { shipmentLineId: searchParams.get("shipmentLineId")! }
      : {}),
    ...(searchParams?.get("supplierId")
      ? { supplierId: searchParams.get("supplierId")! }
      : {}),
    ...(searchParams?.get("operationSupplierProcessId")
      ? {
          operationSupplierProcessId: searchParams.get(
            "operationSupplierProcessId"
          )!
        }
      : {}),
    ...initialValuesProp
  };
  const isEditing = initialValues.id !== undefined;

  const [workflow, setWorkflow] = useState<{
    priority: string;
    source: string;
    requiredActionIds: string[];
    approvalRequirements: string[];
  }>({
    priority: initialValues.priority,
    source: initialValues.source,
    requiredActionIds: initialValues.requiredActionIds ?? [],
    approvalRequirements: initialValues.approvalRequirements ?? []
  });

  const [items] = useItems();

  const onWorkflowChange = (value: { value: string } | null) => {
    if (value) {
      const selectedWorkflow = nonConformanceWorkflows.find(
        (w) => w.id === value.value
      );

      if (selectedWorkflow) {
        setWorkflow({
          priority: selectedWorkflow.priority,
          source: selectedWorkflow.source,
          requiredActionIds: selectedWorkflow.requiredActionIds ?? [],
          approvalRequirements: selectedWorkflow.approvalRequirements ?? []
        });
      }
    }
  };

  return (
    <Card>
      <ValidatedForm
        method="post"
        action={isEditing ? undefined : path.to.newIssue}
        validator={issueValidator}
        defaultValues={initialValues}
        className="w-full"
        fetcher={submitFetcher}
      >
        <CardHeader>
          <CardTitle>{isEditing ? "Issue" : "New Issue"}</CardTitle>
          {!isEditing && (
            <CardDescription>
              <Trans>
                A issue record tracks quality issues and their resolution
                process.
              </Trans>
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <Hidden name="id" />
          <Hidden name="nonConformanceId" />
          <Hidden name="supplierId" />
          <Hidden name="customerId" />
          <Hidden name="jobId" />
          <Hidden name="jobOperationId" />
          <Hidden name="purchaseOrderId" />
          <Hidden name="purchaseOrderLineId" />
          <Hidden name="salesOrderId" />
          <Hidden name="salesOrderLineId" />
          <Hidden name="shipmentId" />
          <Hidden name="shipmentLineId" />
          <Hidden name="operationSupplierProcessId" />

          <VStack spacing={4}>
            <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-2">
              <Input name="name" label={t`Name`} />
              <Select
                name="nonConformanceTypeId"
                label={t`Issue Type`}
                options={nonConformanceTypes.map((type) => ({
                  label: type.name,
                  value: type.id
                }))}
              />
            </div>
            <TextArea name="description" label={t`Description`} />
            <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-2">
              <CreatableCombobox
                name="nonConformanceWorkflowId"
                label={t`Workflow`}
                options={nonConformanceWorkflows.map((workflow) => ({
                  label: workflow.name,
                  value: workflow.id
                }))}
                onChange={onWorkflowChange}
                onCreateOption={() => {
                  navigate(path.to.newIssueWorkflow, {
                    state: { from: `${location.pathname}${location.search}` }
                  });
                }}
              />

              <MultiSelect
                name="items"
                label={t`Items`}
                options={items.map((item) => ({
                  label: item.readableIdWithRevision,
                  value: item.id,
                  helper: item.name
                }))}
              />
            </div>

            <VStack spacing={4}>
              <MultiSelect
                name="requiredActionIds"
                label={t`Required Actions`}
                options={requiredActions.map((action) => ({
                  label: action.name,
                  value: action.id
                }))}
                value={workflow.requiredActionIds}
                onChange={(value) => {
                  setWorkflow({
                    ...workflow,
                    requiredActionIds: value.map((v) => v.value)
                  });
                }}
              />
              <MultiSelect
                name="approvalRequirements"
                label={t`Approval Requirements`}
                options={nonConformanceApprovalRequirement.map(
                  (requirement) => ({
                    label: requirement,
                    value: requirement
                  })
                )}
                value={workflow.approvalRequirements}
                onChange={(value) => {
                  setWorkflow({
                    ...workflow,
                    approvalRequirements: value.map((v) => v.value)
                  });
                }}
              />
            </VStack>
            <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-2">
              <SelectControlled
                name="priority"
                label={t`Priority`}
                options={nonConformancePriority.map((priority) => ({
                  label: (
                    <div className="flex gap-2 items-center">
                      {getPriorityIcon(priority, false)}
                      <span>{priority}</span>
                    </div>
                  ),
                  value: priority
                }))}
                value={workflow.priority}
                onChange={(value) => {
                  setWorkflow({
                    ...workflow,
                    priority: value?.value ?? ""
                  });
                }}
              />
              <SelectControlled
                name="source"
                label={t`Source`}
                options={nonConformanceSource.map((source) => ({
                  label: (
                    <div className="flex gap-2 items-center">
                      {getSourceIcon(source, false)}
                      <span>{source}</span>
                    </div>
                  ),
                  value: source
                }))}
                value={workflow.source}
                onChange={(value) => {
                  setWorkflow({
                    ...workflow,
                    source: value?.value ?? ""
                  });
                }}
              />

              <DatePicker name="openDate" label={t`Open Date`} />
              <Location name="locationId" label={t`Location`} />
              <CustomFormFields table="nonConformance" />
            </div>
          </VStack>
        </CardContent>
        <CardFooter>
          <Submit
            isDisabled={
              isEditing
                ? !permissions.can("update", "quality")
                : !permissions.can("create", "quality")
            }
          >
            Save
          </Submit>
        </CardFooter>
      </ValidatedForm>
    </Card>
  );
};

export default IssueForm;
