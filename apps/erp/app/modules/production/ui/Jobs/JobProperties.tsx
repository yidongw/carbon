import { useCarbon } from "@carbon/auth";
import type { Json } from "@carbon/database";
import {
  DatePicker,
  InputControlled,
  NumberControlled,
  Select,
  ValidatedForm
} from "@carbon/form";
import {
  Badge,
  Button,
  cn,
  HStack,
  IconButton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  toast,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { PostgrestResponse } from "@supabase/supabase-js";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { LuCopy, LuLink, LuTable, LuUnlink2 } from "react-icons/lu";
import { RiProgress8Line } from "react-icons/ri";
import { Await, useFetcher, useParams, useRevalidator } from "react-router";
import { z } from "zod";
import { zfd } from "zod-form-data";
import {
  Assignee,
  EmployeeAvatar,
  Hyperlink,
  useOptimisticAssignment
} from "~/components";
import {
  Customer,
  Item,
  Location,
  StorageUnit,
  Tags,
  UnitOfMeasure
} from "~/components/Form";
import CustomFormInlineFields from "~/components/Form/CustomFormInlineFields";
import { overlay, useOverlay } from "~/components/Overlay";
import { usePermissions, useRouteData, useUser } from "~/hooks";
import type { TrackedEntity } from "~/modules/inventory/types";
import type {
  ConfigurationParameter,
  ConfigurationParameterGroup
} from "~/modules/items/types";
import type { MethodItemType } from "~/modules/shared";
import type { action } from "~/routes/x+/items+/update";
import { path } from "~/utils/path";
import { copyToClipboard } from "~/utils/string";
import { deadlineTypes, isJobLocked } from "../../production.models";
import type { Job } from "../../types";
import { getDeadlineIcon } from "./Deadline";
import { useDeadlineTypeLabel } from "./jobLabels";

const JobProperties = () => {
  const { jobId } = useParams();
  const { t } = useLingui();
  const getDeadlineTypeLabel = useDeadlineTypeLabel();
  if (!jobId) throw new Error("jobId not found");

  const routeData = useRouteData<{
    job: Job;
    tags: { name: string }[];
    trackedEntities: Promise<PostgrestResponse<TrackedEntity>>;
  }>(path.to.job(jobId));

  const { carbon } = useCarbon();
  const { company } = useUser();

  const { openOverlay } = useOverlay();
  const { revalidate } = useRevalidator();
  const [configurationParameters, setConfigurationParameters] = useState<{
    parameters: ConfigurationParameter[];
    groups: ConfigurationParameterGroup[];
  } | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    const itemId = routeData?.job?.itemId;
    if (!itemId || !carbon || !company?.id) return;
    Promise.all([
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
    ]).then(([parameters, groups]) => {
      const params = parameters.data ?? [];
      if (params.length > 0) {
        setConfigurationParameters({
          parameters: params,
          groups: groups.data ?? []
        });
      }
    });
  }, [routeData?.job?.itemId]);

  const fetcher = useFetcher<typeof action>();
  const prevFetcherState = useRef(fetcher.state);
  useEffect(() => {
    const finishedSubmitting =
      prevFetcherState.current !== "idle" && fetcher.state === "idle";
    prevFetcherState.current = fetcher.state;

    if (!finishedSubmitting || !fetcher.data) return;

    if (fetcher.data?.error) {
      toast.error(fetcher.data.error.message);
      return;
    }

    revalidate();
  }, [fetcher.state, fetcher.data, revalidate]);

  const [type, setType] = useState<MethodItemType>(
    (routeData?.job?.itemType ?? "Part") as MethodItemType
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  const onUpdate = useCallback(
    (field: keyof Job, value: string | number | null) => {
      if (value === routeData?.job[field]) {
        return;
      }
      const formData = new FormData();

      formData.append("ids", jobId);
      formData.append("field", field);
      formData.append("value", value?.toString() ?? "");
      fetcher.submit(formData, {
        method: "post",
        action: path.to.bulkUpdateJob
      });
    },

    [jobId, routeData?.job]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  const onUpdateCustomFields = useCallback(
    (value: string) => {
      const formData = new FormData();

      formData.append("ids", jobId);
      formData.append("table", "job");
      formData.append("value", value);

      fetcher.submit(formData, {
        method: "post",
        action: path.to.customFields
      });
    },

    [jobId]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  const onUpdateTags = useCallback(
    (value: string[]) => {
      const formData = new FormData();

      formData.append("ids", jobId);
      formData.append("table", "job");
      value.forEach((v) => {
        formData.append("value", v);
      });

      fetcher.submit(formData, {
        method: "post",
        action: path.to.tags
      });
    },

    [jobId]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  const onUpdateBatchNumber = useCallback(
    (trackedEntityId: string, value: string) => {
      const formData = new FormData();

      if (!trackedEntityId) {
        toast.error(t`Tracked entity ID is required but none was found`);
        return;
      }

      formData.append("id", trackedEntityId);
      formData.append("value", value);
      fetcher.submit(formData, {
        method: "post",
        action: path.to.jobBatchNumber(jobId)
      });
    },

    []
  );

  const permissions = usePermissions();
  const optimisticAssignment = useOptimisticAssignment({
    id: jobId,
    table: "job"
  });
  const assignee =
    optimisticAssignment !== undefined
      ? optimisticAssignment
      : routeData?.job?.assignee;

  const canUpdate = permissions.can("update", "production");
  const isLocked = isJobLocked(routeData?.job?.status);
  const isDisabled = !canUpdate || isLocked;

  const quantity = routeData?.job?.quantity ?? 0;

  return (
    <VStack
      spacing={4}
      className="w-full bg-card h-full overflow-y-auto overflow-x-hidden overscroll-y-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent px-4 py-2 text-sm"
    >
      <VStack spacing={4}>
        <HStack className="w-full justify-between">
          <h3 className="text-xxs text-foreground/70 uppercase font-light tracking-wide">
            <Trans>Properties</Trans>
          </h3>
          <HStack spacing={1}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  aria-label={t`Link`}
                  size="sm"
                  className="p-1"
                  onClick={() =>
                    copyToClipboard(
                      window.location.origin + path.to.jobDetails(jobId)
                    )
                  }
                >
                  <LuLink className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span>
                  <Trans>Copy link to Job</Trans>
                </span>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  aria-label={t`Copy`}
                  size="sm"
                  className="p-1"
                  onClick={() => copyToClipboard(routeData?.job?.jobId ?? "")}
                >
                  <LuCopy className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span>
                  <Trans>Copy Job number</Trans>
                </span>
              </TooltipContent>
            </Tooltip>
          </HStack>
        </HStack>
        <span className="text-sm">{routeData?.job?.jobId}</span>
      </VStack>

      <VStack spacing={2}>
        <Suspense fallback={null}>
          <Await resolve={routeData?.trackedEntities}>
            {(entities) => {
              const trackingType = routeData?.job?.itemTrackingType ?? "";

              if (!["Batch", "Serial"].includes(trackingType)) {
                return null;
              }

              const trackedEntities = entities?.data ?? [];

              return (
                <>
                  {trackedEntities.map((entity, index) => {
                    const trackingNumber: string = entity?.readableId ?? "";

                    const label =
                      trackedEntities.length > 1
                        ? `${trackingType} ${index + 1}`
                        : `${trackingType} Number`;

                    return (
                      <ValidatedForm
                        key={entity.id}
                        defaultValues={{
                          trackingNumber
                        }}
                        validator={z.object({
                          trackingNumber: zfd.text(z.string().optional())
                        })}
                        className="w-full"
                      >
                        <InputControlled
                          name="trackingNumber"
                          label={label}
                          value={trackingNumber}
                          size="sm"
                          inline
                          onBlur={(e) => {
                            const next = e.target.value.trim();
                            if (next === (trackingNumber ?? "").trim()) return;
                            onUpdateBatchNumber(entity.id, next);
                          }}
                        />
                      </ValidatedForm>
                    );
                  })}
                </>
              );
            }}
          </Await>
        </Suspense>

        <span className="text-xs text-muted-foreground">
          <Trans>Target</Trans>
        </span>
        {routeData?.job?.customerId &&
        routeData?.job?.salesOrderId &&
        routeData?.job?.salesOrderLineId ? (
          <HStack className="group" spacing={1}>
            <Hyperlink
              to={path.to.salesOrderLine(
                routeData.job.salesOrderId,
                routeData?.job.salesOrderLineId
              )}
            >
              <Badge variant="secondary">
                <RiProgress8Line className="w-3 h-3 mr-1" />
                {routeData?.job.salesOrderReadableId ?? "Make to Order"}
              </Badge>
            </Hyperlink>
            <Button
              className="group-hover:opacity-100 opacity-0 transition-opacity duration-200"
              variant="ghost"
              size="sm"
              leftIcon={<LuUnlink2 className="w-3 h-3" />}
              onClick={() => {
                onUpdate("salesOrderLineId", null);
              }}
            >
              Unlink
            </Button>
          </HStack>
        ) : (
          <ValidatedForm
            defaultValues={{
              storageUnitId: routeData?.job?.storageUnitId ?? undefined
            }}
            validator={z.object({
              storageUnitId: zfd.text(z.string().optional())
            })}
            className="w-full"
          >
            <StorageUnit
              label=""
              name="storageUnitId"
              inline
              locationId={routeData?.job?.locationId ?? undefined}
              isReadOnly={isDisabled}
              onChange={(value) => {
                onUpdate("storageUnitId", value?.id ?? null);
              }}
            />
          </ValidatedForm>
        )}
      </VStack>

      <Assignee
        id={jobId}
        table="job"
        value={assignee ?? ""}
        variant="inline"
        isReadOnly={!canUpdate}
      />

      <ValidatedForm
        defaultValues={{ itemId: routeData?.job?.itemId ?? undefined }}
        validator={z.object({
          itemId: z.string().min(1, { message: "Item is required" })
        })}
        className="w-full"
      >
        <Item
          name="itemId"
          inline
          isReadOnly={isDisabled}
          type={type}
          locationId={routeData?.job?.locationId ?? undefined}
          validItemTypes={["Part", "Tool"]}
          onChange={(value) => {
            onUpdate("itemId", value?.value ?? null);
          }}
          onTypeChange={(value) => {
            setType(value as MethodItemType);
          }}
        />
      </ValidatedForm>
      {configurationParameters ? (
        <VStack className="w-full">
          <span className="text-xs text-muted-foreground">{t`Quantity`}</span>
          <HStack spacing={0} className="w-full justify-between">
            <span className="flex flex-grow line-clamp-1 items-center">
              {quantity}
            </span>
            <IconButton
              icon={<LuTable size="1em" strokeWidth="3" />}
              aria-label={t`Configure quantities`}
              size="sm"
              variant="secondary"
              className={cn(
                quantity > 0 && "text-emerald-500 hover:text-emerald-500"
              )}
              isDisabled={isDisabled}
              onClick={() =>
                openOverlay(overlay.to.jobConfigTable(jobId), {
                  onCreated: revalidate
                })
              }
            />
          </HStack>
        </VStack>
      ) : (
        <ValidatedForm
          defaultValues={{ quantity: routeData?.job?.quantity ?? undefined }}
          validator={z.object({
            quantity: zfd.numeric(
              z.number().min(0, { message: "Quantity is required" })
            )
          })}
          className="w-full"
        >
          <NumberControlled
            label={t`Quantity`}
            name="quantity"
            inline
            isReadOnly={isDisabled}
            value={routeData?.job?.quantity ?? 0}
            onChange={(value) => {
              onUpdate("quantity", value);
            }}
          />
        </ValidatedForm>
      )}
      <ValidatedForm
        defaultValues={{
          scrapQuantity: routeData?.job?.scrapQuantity ?? undefined
        }}
        validator={z.object({
          scrapQuantity: zfd.numeric(
            z.number().min(0, { message: "Quantity is required" })
          )
        })}
        className="w-full"
      >
        <NumberControlled
          label={t`Estimated Scrap Quantity`}
          name="scrapQuantity"
          inline
          isReadOnly={isDisabled}
          value={routeData?.job?.scrapQuantity ?? 0}
          onChange={(value) => {
            onUpdate("scrapQuantity", value);
          }}
        />
      </ValidatedForm>

      <ValidatedForm
        defaultValues={{
          startDate: routeData?.job?.startDate ?? ""
        }}
        validator={z.object({
          startDate: zfd.text(z.string().optional())
        })}
        className="w-full"
      >
        <DatePicker
          name="startDate"
          label={t`Start Date`}
          inline
          isDisabled={isDisabled}
          onChange={(date) => {
            onUpdate("startDate", date);
          }}
        />
      </ValidatedForm>

      <ValidatedForm
        defaultValues={{
          dueDate: routeData?.job?.dueDate ?? ""
        }}
        validator={z.object({
          dueDate: zfd.text(z.string().optional())
        })}
        className="w-full"
      >
        <DatePicker
          name="dueDate"
          label={t`Due Date`}
          inline
          isDisabled={isDisabled}
          onChange={(date) => {
            onUpdate("dueDate", date);
          }}
        />
      </ValidatedForm>

      <ValidatedForm
        defaultValues={{
          deadlineType: routeData?.job?.deadlineType ?? ""
        }}
        validator={z.object({
          deadlineType: z
            .string()
            .min(1, { message: "Deadline Type is required" })
        })}
        className="w-full"
      >
        <Select
          name="deadlineType"
          label={t`Deadline Type`}
          inline={(value, options) => {
            const deadlineType = value as (typeof deadlineTypes)[number];
            return (
              <div className="flex gap-1 items-center">
                {getDeadlineIcon(deadlineType)}
                <span>{getDeadlineTypeLabel(deadlineType)}</span>
              </div>
            );
          }}
          isReadOnly={isDisabled}
          options={deadlineTypes.map((d) => ({
            value: d,
            label: getDeadlineTypeLabel(d)
          }))}
          onChange={(value) => {
            onUpdate("deadlineType", value?.value ?? null);
          }}
        />
      </ValidatedForm>

      <ValidatedForm
        defaultValues={{ customerId: routeData?.job?.customerId ?? undefined }}
        validator={z.object({
          customerId: zfd.text(z.string().optional())
        })}
        className="w-full"
      >
        <Customer
          name="customerId"
          inline
          isOptional
          isReadOnly={isDisabled || !!routeData?.job?.salesOrderId}
          onChange={(value) => {
            onUpdate("customerId", value?.value ?? null);
          }}
        />
      </ValidatedForm>

      <ValidatedForm
        defaultValues={{
          unitOfMeasureCode: routeData?.job?.unitOfMeasureCode ?? undefined
        }}
        validator={z.object({
          unitOfMeasureCode: z
            .string()
            .min(1, { message: "Unit of Measure is required" })
        })}
        className="w-full"
      >
        <UnitOfMeasure
          label={t`Unit of Measure`}
          name="unitOfMeasureCode"
          inline
          isReadOnly={isDisabled}
          onChange={(value) => {
            onUpdate("unitOfMeasureCode", value?.value ?? null);
          }}
        />
      </ValidatedForm>

      <ValidatedForm
        defaultValues={{ locationId: routeData?.job?.locationId ?? undefined }}
        validator={z.object({
          locationId: z.string().min(1, { message: "Location is required" })
        })}
        className="w-full"
      >
        <Location
          label={t`Job Location`}
          name="locationId"
          inline
          isReadOnly={isDisabled}
          onChange={(value) => {
            if (value?.value) {
              onUpdate("locationId", value.value);
            }
          }}
        />
      </ValidatedForm>

      <ValidatedForm
        defaultValues={{
          tags: routeData?.job.tags ?? []
        }}
        validator={z.object({
          tags: z.array(z.string()).optional()
        })}
        className="w-full"
      >
        <Tags
          availableTags={routeData?.tags ?? []}
          label={t`Tags`}
          name="tags"
          table="job"
          inline
          onChange={onUpdateTags}
        />
      </ValidatedForm>

      <VStack spacing={2}>
        <span className="text-xs font-medium text-muted-foreground">
          Created By
        </span>
        <EmployeeAvatar employeeId={routeData?.job?.createdBy ?? null} />
      </VStack>

      <CustomFormInlineFields
        customFields={
          (routeData?.job?.customFields ?? {}) as Record<string, Json>
        }
        table="job"
        tags={routeData?.job.tags ?? []}
        onUpdate={onUpdateCustomFields}
      />

    </VStack>
  );
};

export default JobProperties;
