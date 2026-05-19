import { useCarbon } from "@carbon/auth";
import { InputControlled, ValidatedForm } from "@carbon/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cn,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
  useDisclosure,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ComponentProps } from "react";
import { useState } from "react";
import { LuDiamond, LuLayers, LuTable } from "react-icons/lu";
import type { z } from "zod";
import {
  Customer,
  CustomFormFields,
  DatePicker,
  Hidden,
  Input,
  Item,
  Location,
  NumberControlled,
  Select,
  SequenceOrCustomId,
  Submit
} from "~/components/Form";
import { usePermissions, useUser } from "~/hooks";
import type {
  ConfigurationParameter,
  ConfigurationParameterGroup
} from "~/modules/items/types";
import type { MethodItemType } from "~/modules/shared";
import { path } from "~/utils/path";
import type { jobStatus } from "../../production.models";
import {
  bulkJobValidator,
  deadlineTypes,
  isJobLocked,
  jobValidator
} from "../../production.models";
import { ConfigParamsTableModal } from "./ConfigParamsTableModal";
import { getDeadlineIcon } from "./Deadline";

type QuantityFieldProps = ComponentProps<typeof NumberControlled> & {
  configTableMode: "single" | "bulk";
  hasConfigurationParameters: boolean;
  onOpenConfigTable: (mode: "single" | "bulk") => void;
};

function QuantityWithConfigTable({
  configTableMode,
  hasConfigurationParameters,
  onOpenConfigTable,
  ...props
}: QuantityFieldProps) {
  const { t } = useLingui();

  if (!hasConfigurationParameters) {
    return <NumberControlled {...props} />;
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={t`Configure quantities`}
      className="cursor-pointer [&_input]:pointer-events-none [&_input]:cursor-pointer"
      onClick={() => onOpenConfigTable(configTableMode)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenConfigTable(configTableMode);
        }
      }}
    >
      <NumberControlled {...props} />
    </div>
  );
}

type JobFormValues = z.infer<typeof jobValidator> & {
  description: string;
  status: (typeof jobStatus)[number];
  itemType: MethodItemType;
};

type JobFormProps = {
  initialValues: JobFormValues;
};

const JobForm = ({ initialValues }: JobFormProps) => {
  const permissions = usePermissions();
  const { t } = useLingui();
  const { company } = useUser();
  const { carbon } = useCarbon();
  const [type, setType] = useState<MethodItemType>(
    initialValues.itemType ?? "Item"
  );

  const isLocked = isJobLocked(initialValues.status);
  const isDisabled = isLocked;

  const bulkInitialValues = {
    ...initialValues,
    jobCount: 1,
    quantityPerJob: initialValues.quantity ?? 1,
    scrapQuantityPerJob: initialValues.scrapQuantity ?? 0,
    dueDateOfFirstJob: initialValues.dueDate ?? "",
    dueDateOfLastJob: initialValues.dueDate ?? "",
    locationId: initialValues.locationId ?? "",
    customerId: initialValues.customerId ?? "",
    modelUploadId: initialValues.modelUploadId ?? "",
    configuration: initialValues.configuration ?? {}
  };

  const [itemData, setItemData] = useState<{
    itemId: string;
    description: string;
    uom: string;
    quantity: number;
    jobCount: number;
    quantityPerJob: number;
    scrapQuantity: number;
    scrapPercentage: number;
    modelUploadId: string | null;
  }>({
    itemId: initialValues.itemId ?? "",
    description: initialValues.description ?? "",
    quantity: initialValues.quantity ?? 0,
    jobCount: 1,
    quantityPerJob: initialValues.quantity ?? 1,
    scrapQuantity: initialValues.scrapQuantity ?? 0,
    scrapPercentage:
      (initialValues.quantity ?? 0) === 0
        ? 0
        : (initialValues.scrapQuantity ?? 0) / (initialValues.quantity ?? 1),
    uom: initialValues.unitOfMeasureCode ?? "",
    modelUploadId: initialValues.modelUploadId ?? null
  });

  const configTableDisclosure = useDisclosure();
  const [configurationParameters, setConfigurationParameters] = useState<{
    parameters: ConfigurationParameter[];
    groups: ConfigurationParameterGroup[];
  } | null>(null);
  const [configTableRows, setConfigTableRows] = useState<
    Record<string, any>[] | null
  >(null);
  const [configTablePrimaryKeys, setConfigTablePrimaryKeys] = useState<
    string[]
  >([]);
  const [configTableTotal, setConfigTableTotal] = useState(0);
  const [configTableMode, setConfigTableMode] = useState<"single" | "bulk">(
    "single"
  );

  const isCustomer = permissions.is("customer");
  const isEditing = initialValues.id !== undefined;

  const onTypeChange = (t: MethodItemType | "Item") => {
    setType(t as MethodItemType);
    setItemData({
      itemId: "",
      description: "",
      uom: "EA",
      quantity: 1,
      jobCount: 1,
      quantityPerJob: 1,
      scrapPercentage: 0,
      scrapQuantity: 0,
      modelUploadId: null
    });
    setConfigTableRows(null);
    setConfigTablePrimaryKeys([]);
    setConfigTableTotal(0);
  };

  const handleConfigTableSubmit = (
    rows: Record<string, any>[],
    total: number,
    primaryKeys: string[]
  ) => {
    setConfigTableRows(rows);
    setConfigTablePrimaryKeys(primaryKeys);
    setConfigTableTotal(total);
    if (configTableMode === "bulk") {
      setItemData((prev) => ({
        ...prev,
        quantityPerJob: total,
        scrapQuantity: Math.ceil(total * prev.scrapPercentage)
      }));
    } else if (total > 0) {
      setItemData((prev) => ({
        ...prev,
        quantity: total,
        quantityPerJob: total,
        scrapQuantity: Math.ceil(total * prev.scrapPercentage)
      }));
    }
    configTableDisclosure.onClose();
  };

  const onItemChange = async (itemId: string) => {
    if (!itemId) return;
    if (!carbon || !company.id) return;
    setConfigTableRows(null);
    setConfigTablePrimaryKeys([]);
    setConfigTableTotal(0);
    setItemData((prev) => ({ ...prev, jobCount: 1 }));
    const [item, manufacturing] = await Promise.all([
      carbon
        .from("item")
        .select(
          "name, readableIdWithRevision, defaultMethodType, type, unitOfMeasureCode, modelUploadId"
        )
        .eq("id", itemId)
        .eq("companyId", company.id)
        .single(),
      carbon
        .from("itemReplenishment")
        .select("lotSize, leadTime, scrapPercentage, requiresConfiguration")
        .eq("itemId", itemId)
        .single()
    ]);

    setItemData((current) => {
      const lotSize = manufacturing?.data?.lotSize ?? 0;
      const scrapPercentage = manufacturing?.data?.scrapPercentage ?? 0;
      const quantity = lotSize === 0 ? current.quantity : lotSize;
      const quantityPerJob = lotSize === 0 ? current.quantityPerJob : lotSize;

      return {
        itemId,
        description: item.data?.name ?? "",
        uom: item.data?.unitOfMeasureCode ?? "EA",
        quantity,
        jobCount: current.jobCount,
        quantityPerJob,
        modelUploadId: item.data?.modelUploadId ?? null,
        scrapPercentage,
        scrapQuantity: Math.ceil(quantity * scrapPercentage)
      };
    });

    if (item.data?.type) {
      setType(item.data.type as MethodItemType);
    }

    if (manufacturing.data?.requiresConfiguration) {
      const [parameters, groups] = await Promise.all([
        carbon
          .from("configurationParameter")
          .select("*")
          .eq("itemId", itemId)
          .eq("companyId", company.id),
        carbon
          .from("configurationParameterGroup")
          .select("*")
          .eq("itemId", itemId)
          .eq("companyId", company.id)
      ]);

      if (parameters.error || groups.error) {
        toast.error(t`Failed to load configuration parameters`);
        return;
      }

      setConfigurationParameters({
        parameters: parameters.data ?? [],
        groups: groups.data ?? []
      });
    } else {
      setConfigurationParameters(null);
    }
  };

  const openConfigTable = (mode: "single" | "bulk") => {
    setConfigTableMode(mode);
    configTableDisclosure.onOpen();
  };

  const getQuantityAdornment = () =>
    configurationParameters ? (
      <div
        className={cn(
          "absolute right-0 top-0 z-10 m-px flex h-[calc(100%-2px)] w-10 items-center justify-center border-l border-border rounded-r-md pointer-events-none transition-colors",
          configTableTotal > 0
            ? "text-emerald-500"
            : "text-muted-foreground"
        )}
        aria-hidden
      >
        <LuTable size="1em" strokeWidth="3" />
      </div>
    ) : undefined;

  return (
    <>
      <Tabs defaultValue="job">
        <VStack className="w-full items-center relative">
          {!isEditing && (
            <TabsList className="absolute top-6 right-4 z-50">
              <TabsTrigger value="job">
                <LuDiamond className="mr-1" />
                <Trans>Single Job</Trans>
              </TabsTrigger>
              <TabsTrigger value="bulk">
                <LuLayers className="mr-1" />
                <Trans>Many Jobs</Trans>
              </TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="job" className="w-full">
            <Card>
              <ValidatedForm
                method="post"
                validator={jobValidator}
                defaultValues={initialValues}
                isDisabled={isEditing && isLocked}
              >
                <CardHeader>
                  <CardTitle>
                    {isEditing ? <Trans>Job</Trans> : <Trans>New Job</Trans>}
                  </CardTitle>
                  {!isEditing && (
                    <CardDescription>
                      <Trans>
                        A job is a set of work to be done to fulfill an order or
                        increase inventory
                      </Trans>
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <Hidden name="id" />
                  <Hidden
                    name="modelUploadId"
                    value={itemData.modelUploadId ?? undefined}
                  />
                  <Hidden name="unitOfMeasureCode" value={itemData.uom} />
                  {!isEditing && configTableRows && (
                    <Hidden
                      name="configuration"
                      value={JSON.stringify({
                        configTable: configTableRows,
                        configTablePrimaryKeys
                      })}
                    />
                  )}
                  <VStack>
                    <div
                      className={cn(
                        "grid w-full gap-x-8 gap-y-4",
                        isEditing
                          ? "grid-cols-1 lg:grid-cols-3"
                          : "grid-cols-1 md:grid-cols-2"
                      )}
                    >
                      {isEditing ? (
                        <Input name="jobId" label={t`Job ID`} isReadOnly />
                      ) : (
                        <SequenceOrCustomId
                          name="jobId"
                          label={t`Job ID`}
                          table="job"
                        />
                      )}

                      <Item
                        name="itemId"
                        label={type}
                        type={type}
                        value={itemData.itemId}
                        locationId={initialValues.locationId ?? undefined}
                        validItemTypes={["Part", "Tool"]}
                        replenishmentSystem="Make"
                        onChange={(value) => {
                          onItemChange(value?.value as string);
                        }}
                        onTypeChange={onTypeChange}
                      />

                      {isEditing && (
                        <InputControlled
                          name="description"
                          label={t`Short Description`}
                          value={itemData.description}
                          isReadOnly
                        />
                      )}

                      <QuantityWithConfigTable
                        name="quantity"
                        label={t`Quantity`}
                        value={itemData.quantity}
                        isDisabled={configTableTotal > 0}
                        onChange={(value) =>
                          setItemData((prev) => ({
                            ...prev,
                            quantity: value,
                            scrapQuantity: Math.ceil(
                              value * prev.scrapPercentage
                            )
                          }))
                        }
                        adornment={getQuantityAdornment()}
                        minValue={0}
                        configTableMode="single"
                        hasConfigurationParameters={!!configurationParameters}
                        onOpenConfigTable={openConfigTable}
                      />
                      <NumberControlled
                        name="scrapQuantity"
                        label={t`Estimated Scrap Quantity`}
                        value={itemData.scrapQuantity}
                        onChange={(value) =>
                          setItemData((prev) => ({
                            ...prev,
                            scrapQuantity: value,
                            scrapPercentage:
                              prev.quantity > 0 ? value / prev.quantity : 1
                          }))
                        }
                        minValue={0}
                      />

                      <Location name="locationId" label={t`Location`} />

                      <DatePicker
                        name="dueDate"
                        label={t`Due Date`}
                        isDisabled={isCustomer}
                      />
                      <Select
                        name="deadlineType"
                        label={t`Deadline Type`}
                        options={deadlineTypes.map((d) => ({
                          value: d,
                          label: (
                            <div className="flex gap-1 items-center">
                              {getDeadlineIcon(d)}
                              <span>{d}</span>
                            </div>
                          )
                        }))}
                      />

                      {isEditing && (
                        <Customer
                          name="customerId"
                          label={t`Customer`}
                          isOptional
                        />
                      )}

                      <CustomFormFields table="job" />
                    </div>
                  </VStack>
                </CardContent>
                <CardFooter>
                  <Submit
                    isDisabled={
                      isDisabled ||
                      (isEditing
                        ? !permissions.can("update", "production")
                        : !permissions.can("create", "production"))
                    }
                  >
                    <Trans>Save</Trans>
                  </Submit>
                </CardFooter>
              </ValidatedForm>
            </Card>
          </TabsContent>
          {!isEditing && (
            <TabsContent value="bulk" className="w-full">
              <Card>
                <ValidatedForm
                  method="post"
                  action={path.to.newBulkJob}
                  validator={bulkJobValidator}
                  defaultValues={bulkInitialValues}
                >
                  <CardHeader>
                    <CardTitle>
                      <Trans>Bulk Jobs</Trans>
                    </CardTitle>
                    <CardDescription>
                      <Trans>
                        The bulk jobs form creates multiple jobs for the same
                        item across multiple due dates.
                      </Trans>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Hidden name="id" />
                    <Hidden
                      name="modelUploadId"
                      value={itemData.modelUploadId ?? undefined}
                    />
                    <Hidden name="unitOfMeasureCode" value={itemData.uom} />
                    {!isEditing && configTableRows && (
                      <Hidden
                        name="configuration"
                        value={JSON.stringify({
                          configTable: configTableRows,
                          configTablePrimaryKeys
                        })}
                      />
                    )}
                    <VStack>
                      <div
                        className={cn(
                          "grid w-full gap-x-8 gap-y-4",
                          "grid-cols-1 md:grid-cols-2"
                        )}
                      >
                        <Item
                          name="itemId"
                          label={type}
                          type={type}
                          value={itemData.itemId}
                          locationId={initialValues.locationId ?? undefined}
                          validItemTypes={["Part", "Tool"]}
                          onChange={(value) => {
                            onItemChange(value?.value as string);
                          }}
                          onTypeChange={onTypeChange}
                        />

                        <NumberControlled
                          name="jobCount"
                          label={t`Total Jobs`}
                          value={itemData.jobCount}
                          onChange={(value) =>
                            setItemData((prev) => ({
                              ...prev,
                              jobCount: value
                            }))
                          }
                          minValue={0}
                        />

                        <QuantityWithConfigTable
                          name="quantityPerJob"
                          label={t`Quantities Per Job`}
                          value={itemData.quantityPerJob}
                          onChange={(value) =>
                            setItemData((prev) => ({
                              ...prev,
                              quantityPerJob: value
                            }))
                          }
                          isDisabled={configTableTotal > 0}
                          adornment={getQuantityAdornment()}
                          minValue={0}
                          configTableMode="bulk"
                          hasConfigurationParameters={!!configurationParameters}
                          onOpenConfigTable={openConfigTable}
                        />

                        <NumberControlled
                          name="scrapQuantityPerJob"
                          label={t`Scrap Quantity Per Job`}
                          value={itemData.scrapQuantity}
                          onChange={(value) =>
                            setItemData((prev) => ({
                              ...prev,
                              scrapQuantity: value
                            }))
                          }
                          minValue={0}
                        />

                        <DatePicker
                          name="dueDateOfFirstJob"
                          label={t`Due Date of First Job`}
                          isDisabled={isCustomer}
                        />

                        <DatePicker
                          name="dueDateOfLastJob"
                          label={t`Due Date of Last Job`}
                          isDisabled={isCustomer}
                        />

                        <Location name="locationId" label={t`Location`} />
                        <Select
                          name="deadlineType"
                          label={t`Deadline Type`}
                          options={deadlineTypes.map((d) => ({
                            value: d,
                            label: (
                              <div className="flex gap-1 items-center">
                                {getDeadlineIcon(d)}
                                <span>{d}</span>
                              </div>
                            )
                          }))}
                        />

                        <CustomFormFields table="job" />
                      </div>
                    </VStack>
                  </CardContent>
                  <CardFooter>
                    <Submit
                      isDisabled={
                        isDisabled || !permissions.can("create", "production")
                      }
                      withBlocker={false}
                    >
                      <Trans>Save</Trans>
                    </Submit>
                  </CardFooter>
                </ValidatedForm>
              </Card>
            </TabsContent>
          )}
        </VStack>
      </Tabs>

      {configTableDisclosure.isOpen && configurationParameters && (
        <ConfigParamsTableModal
          open
          parameters={configurationParameters.parameters}
          onClose={configTableDisclosure.onClose}
          onSubmit={handleConfigTableSubmit}
          initialRows={configTableRows ?? undefined}
        />
      )}
    </>
  );
};

export default JobForm;
