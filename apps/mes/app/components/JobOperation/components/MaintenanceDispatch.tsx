import { useCarbon } from "@carbon/auth";
import {
  DateTimePicker,
  Hidden,
  Select,
  Submit,
  ValidatedForm
} from "@carbon/form";
import type { JSONContent } from "@carbon/react";
import {
  Button,
  HStack,
  IconButton,
  Label,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  toast,
  useDisclosure,
  VStack
} from "@carbon/react";
import { Editor } from "@carbon/react/Editor";
import type { PostgrestResponse } from "@supabase/supabase-js";
import { Trans, useLingui } from "@lingui/react/macro";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { BsExclamationSquareFill } from "react-icons/bs";
import { LuWrench } from "react-icons/lu";
import { Link, useFetcher } from "react-router";
import { HighPriorityIcon } from "~/assets/icons/HighPriorityIcon";
import { LowPriorityIcon } from "~/assets/icons/LowPriorityIcon";
import { MediumPriorityIcon } from "~/assets/icons/MediumPriorityIcon";
import { useUser } from "~/hooks";
import {
  maintenanceDispatchPriority,
  maintenanceDispatchValidator,
  maintenanceSeverity,
  oeeImpact
} from "~/services/models";
import { getPrivateUrl, path } from "~/utils/path";

function getPriorityIcon(
  priority: (typeof maintenanceDispatchPriority)[number]
) {
  switch (priority) {
    case "Critical":
      return <BsExclamationSquareFill className="text-red-500" />;
    case "High":
      return <HighPriorityIcon />;
    case "Medium":
      return <MediumPriorityIcon />;
    case "Low":
      return <LowPriorityIcon />;
  }
}

function getPriorityLabel(
  priority: (typeof maintenanceDispatchPriority)[number],
  t: ReturnType<typeof useLingui>["t"]
) {
  switch (priority) {
    case "Critical":
      return t`Critical`;
    case "High":
      return t`High`;
    case "Medium":
      return t`Medium`;
    case "Low":
      return t`Low`;
  }
}

function getSeverityLabel(
  severity: (typeof maintenanceSeverity)[number],
  t: ReturnType<typeof useLingui>["t"]
) {
  switch (severity) {
    case "Preventive":
      return t`Preventive`;
    case "Operator Performed":
      return t`Operator Performed`;
    case "Support Required":
      return t`Support Required`;
    case "OEM Required":
      return t`OEM Required`;
  }
}

export function MaintenanceDispatch({
  workCenter
}: {
  workCenter: {
    id: string;
    name: string;
    isBlocked: boolean | null;
    blockingDispatchId: string | null;
  };
}) {
  const { t } = useLingui();
  const hasActiveDispatch =
    workCenter.isBlocked && workCenter.blockingDispatchId;
  const disclosure = useDisclosure();
  const fetcher = useFetcher<{ id?: string }>();
  const failureModeFetcher =
    useFetcher<
      PostgrestResponse<{
        id: string;
        name: string;
      }>
    >();
  const {
    company: { id: companyId }
  } = useUser();
  const { carbon } = useCarbon();

  const [content, setContent] = useState<JSONContent>({});
  const [severity, setSeverity] =
    useState<(typeof maintenanceSeverity)[number]>("Operator Performed");
  const [oeeImpactValue, setOeeImpactValue] =
    useState<(typeof oeeImpact)[number]>("No Impact");

  const failureModes = failureModeFetcher.data?.data ?? [];

  const onOpen = () => {
    failureModeFetcher.load(path.to.api.failureModes);
    disclosure.onOpen();
  };

  const onClose = () => {
    setContent({});
    setSeverity("Operator Performed");
    setOeeImpactValue("No Impact");
    disclosure.onClose();
  };

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.id) {
      toast.success(t`Maintenance dispatch created`);
      onClose();
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
  }, [fetcher.state, fetcher.data, onClose]);

  const onUploadImage = async (file: File) => {
    const fileType = file.name.split(".").pop();
    const fileName = `${companyId}/maintenance/${nanoid()}.${fileType}`;

    const result = await carbon?.storage.from("private").upload(fileName, file);

    if (result?.error) {
      toast.error(t`Failed to upload image`);
      throw new Error(result.error.message);
    }

    if (!result?.data) {
      throw new Error("Failed to upload image");
    }

    return getPrivateUrl(result.data.path);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          {hasActiveDispatch ? (
            <Link
              to={path.to.maintenanceDetail(workCenter.blockingDispatchId!)}
            >
              <IconButton
                aria-label={t`View Active Maintenance`}
                variant="destructive"
                icon={<LuWrench />}
              />
            </Link>
          ) : (
            <IconButton
              aria-label={t`Maintenance`}
              variant="secondary"
              icon={<LuWrench />}
              onClick={onOpen}
            />
          )}
        </TooltipTrigger>
        <TooltipContent align="end">
          <span>
            {hasActiveDispatch
              ? t`View Active Maintenance`
              : t`Maintenance Dispatch`}
          </span>
        </TooltipContent>
      </Tooltip>
      {disclosure.isOpen && (
        <Modal
          open={disclosure.isOpen}
          onOpenChange={(open) => {
            if (!open) {
              onClose();
            }
          }}
        >
          <ModalContent size="xlarge">
            <ValidatedForm
              method="post"
              action={path.to.newMaintenanceDispatch}
              validator={maintenanceDispatchValidator}
              defaultValues={{
                workCenterId: workCenter.id,
                priority: "Medium",
                severity: "Operator Performed",
                oeeImpact: "No Impact",
                suspectedFailureModeId: undefined,
                actualStartTime: new Date().toISOString(),
                actualEndTime: undefined
              }}
              fetcher={fetcher}
            >
              <ModalHeader>
                <ModalTitle><Trans>Maintenance for {workCenter.name}</Trans></ModalTitle>
              </ModalHeader>
              <ModalBody>
                <Hidden name="workCenterId" value={workCenter.id} />
                <Hidden name="content" value={JSON.stringify(content)} />
                <VStack spacing={4}>
                  <div className="flex flex-col gap-2 w-full">
                    <Label><Trans>Description</Trans></Label>
                    <Editor
                      initialValue={content}
                      onUpload={onUploadImage}
                      onChange={(value) => {
                        setContent(value);
                      }}
                      className="[&_.is-empty]:text-muted-foreground min-h-[120px] py-3 px-4 border rounded-md w-full"
                    />
                  </div>
                  <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 md:grid-cols-2">
                    <Select
                      name="priority"
                      label={t`Priority`}
                      options={maintenanceDispatchPriority.map((priority) => ({
                        value: priority,
                        label: (
                          <div className="flex gap-1 items-center">
                            {getPriorityIcon(priority)}
                            <span>{getPriorityLabel(priority, t)}</span>
                          </div>
                        )
                      }))}
                    />
                    <Select
                      name="severity"
                      label={t`Severity`}
                      options={maintenanceSeverity.map((s) => ({
                        value: s,
                        label: getSeverityLabel(s, t)
                      }))}
                      onChange={(option) => {
                        if (option?.value) {
                          setSeverity(
                            option.value as (typeof maintenanceSeverity)[number]
                          );
                        }
                      }}
                    />
                    {severity === "Operator Performed" && (
                      <>
                        <DateTimePicker
                          name="actualStartTime"
                          label={t`Start Time`}
                        />
                        <DateTimePicker name="actualEndTime" label={t`End Time`} />
                      </>
                    )}
                    <Select
                      name="oeeImpact"
                      label={t`OEE Impact`}
                      options={oeeImpact.map((impact) => ({
                        value: impact,
                        label: impact
                      }))}
                      onChange={(option) => {
                        if (option?.value) {
                          setOeeImpactValue(
                            option.value as (typeof oeeImpact)[number]
                          );
                        }
                      }}
                    />
                    {(oeeImpactValue === "Down" ||
                      oeeImpactValue === "Impact") &&
                      failureModes.length > 0 &&
                      (severity === "Operator Performed" ? (
                        <Select
                          name="actualFailureModeId"
                          label={t`Actual Failure Mode`}
                          options={failureModes.map((mode) => ({
                            value: mode.id,
                            label: mode.name
                          }))}
                          isClearable
                        />
                      ) : (
                        <Select
                          name="suspectedFailureModeId"
                          label={t`Suspected Failure Mode`}
                          options={failureModes.map((mode) => ({
                            value: mode.id,
                            label: mode.name
                          }))}
                          isClearable
                        />
                      ))}
                  </div>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <HStack>
                  <Button variant="secondary" onClick={onClose}>
                    <Trans>Cancel</Trans>
                  </Button>
                  <Submit><Trans>Create Dispatch</Trans></Submit>
                </HStack>
              </ModalFooter>
            </ValidatedForm>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
