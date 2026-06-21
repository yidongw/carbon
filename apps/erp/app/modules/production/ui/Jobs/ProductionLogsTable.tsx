import {
  Badge,
  Button,
  Card,
  CardContent,
  Heading,
  HStack,
  MenuIcon,
  MenuItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useDisclosure,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { memo, useMemo, useState } from "react";
import { LuCirclePlus, LuHardHat, LuTrash } from "react-icons/lu";
import { useParams } from "react-router";
import { EmployeeAvatar, New } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import { useDateFormatter, useFormatPersonName, usePermissions } from "~/hooks";
import { path } from "~/utils/path";
import type { JobPickup, ScrapReason } from "../../types";
import { useProductionQuantityTypeLabel } from "./productionQuantityLabels";
import type { UnifiedProductionQuantityListItem } from "./unifiedQuantityFeeds";

type ProductionLogsTableProps = {
  pickups: JobPickup[];
  quantities: UnifiedProductionQuantityListItem[];
  count: number;
  operations: { id: string; description: string | null }[];
  scrapReasons: ScrapReason[];
};

type EmployeeProductionLog = {
  employeeId: string;
  employeeName: string;
  pickups: JobPickup[];
  production: UnifiedProductionQuantityListItem[];
  rework: UnifiedProductionQuantityListItem[];
  scrap: UnifiedProductionQuantityListItem[];
};

const ProductionLogsTable = memo(
  ({
    pickups,
    quantities,
    count,
    operations,
    scrapReasons
  }: ProductionLogsTableProps) => {
    const { jobId } = useParams();
    const { t } = useLingui();
    const typeLabel = useProductionQuantityTypeLabel();
    if (!jobId) throw new Error("Job ID is required");
    const { formatDateTime } = useDateFormatter();
    const formatPersonName = useFormatPersonName();
    const permissions = usePermissions();

    // Group data by employee
    const employeeLogs = useMemo(() => {
      const employeeMap = new Map<string, EmployeeProductionLog>();

      // Add pickups
      pickups.forEach((pickup) => {
        const employeeName = pickup.employee
          ? formatPersonName(pickup.employee)
          : pickup.employeeId;

        if (!employeeMap.has(pickup.employeeId)) {
          employeeMap.set(pickup.employeeId, {
            employeeId: pickup.employeeId,
            employeeName,
            pickups: [],
            production: [],
            rework: [],
            scrap: []
          });
        }
        employeeMap.get(pickup.employeeId)!.pickups.push(pickup);
      });

      // Add quantities (only employee quantities, not supplier)
      quantities.forEach((quantity) => {
        if (quantity.actorKind === "supplier") return;

        const employeeName = quantity.employee
          ? formatPersonName(quantity.employee)
          : quantity.createdBy;

        if (!employeeMap.has(quantity.createdBy)) {
          employeeMap.set(quantity.createdBy, {
            employeeId: quantity.createdBy,
            employeeName,
            pickups: [],
            production: [],
            rework: [],
            scrap: []
          });
        }

        const emp = employeeMap.get(quantity.createdBy)!;
        if (quantity.type === "Production") {
          emp.production.push(quantity);
        } else if (quantity.type === "Rework") {
          emp.rework.push(quantity);
        } else if (quantity.type === "Scrap") {
          emp.scrap.push(quantity);
        }
      });

      return Array.from(employeeMap.values());
    }, [pickups, quantities, formatPersonName]);

    // Calculate totals
    const totals = useMemo(() => {
      const totalPickups = pickups.reduce(
        (sum, p) => sum + Number(p.quantity),
        0
      );
      const totalProduction = quantities
        .filter((q) => q.type === "Production")
        .reduce((sum, q) => sum + Number(q.quantity), 0);
      const totalRework = quantities
        .filter((q) => q.type === "Rework")
        .reduce((sum, q) => sum + Number(q.quantity), 0);
      const totalScrap = quantities
        .filter((q) => q.type === "Scrap")
        .reduce((sum, q) => sum + Number(q.quantity), 0);

      return { totalPickups, totalProduction, totalRework, totalScrap };
    }, [pickups, quantities]);

    const deletePickupModal = useDisclosure();
    const [selectedPickup, setSelectedPickup] = useState<JobPickup | null>(
      null
    );

    const onDeletePickup = (data: JobPickup) => {
      setSelectedPickup(data);
      deletePickupModal.onOpen();
    };

    const onDeletePickupCancel = () => {
      setSelectedPickup(null);
      deletePickupModal.onClose();
    };

    return (
      <div className="flex flex-col gap-4 p-4 lg:p-6 w-full">
        {/* Header */}
        <HStack className="justify-between w-full">
          <Heading size="h3">
            <Trans>Production Logs</Trans>
          </Heading>
          <HStack>
            {permissions.can("create", "production") && (
              <>
                <New
                  label={t`Pickup`}
                  to={path.to.newJobPickup(jobId)}
                  leftIcon={<LuHardHat />}
                />
                <New
                  label={t`Quantity`}
                  to={path.to.newJobProductionQuantity(jobId)}
                  leftIcon={<LuCirclePlus />}
                />
              </>
            )}
          </HStack>
        </HStack>

        {/* Summary Badges */}
        <HStack className="gap-2 flex-wrap">
          <Badge variant="outline">
            <Trans>Total Pickups</Trans>: {totals.totalPickups}
          </Badge>
          <Badge variant="outline">
            <Trans>Total Production</Trans>: {totals.totalProduction}
          </Badge>
          <Badge variant="outline">
            <Trans>Total Rework</Trans>: {totals.totalRework}
          </Badge>
          <Badge variant="outline">
            <Trans>Total Scrap</Trans>: {totals.totalScrap}
          </Badge>
        </HStack>

        {/* Employee Groups */}
        <VStack spacing={2} className="w-full">
          {employeeLogs.length === 0 ? (
            <div className="py-8 text-muted-foreground text-center">
              <Trans>No production logs</Trans>
            </div>
          ) : (
            employeeLogs.map((emp) => {
              const totalPickups = emp.pickups.reduce(
                (sum, p) => sum + Number(p.quantity),
                0
              );
              const totalProduction = emp.production.reduce(
                (sum, q) => sum + Number(q.quantity),
                0
              );
              const remaining = totalPickups - totalProduction;

              return (
                <Card key={emp.employeeId} className="w-full">
                  <CardContent className="p-4">
                    <VStack spacing={2}>
                      {/* Employee Header with Remaining */}
                      <HStack className="justify-between items-center">
                        <HStack spacing={2}>
                          <EmployeeAvatar employeeId={emp.employeeId} />
                        </HStack>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-sm text-muted-foreground cursor-help">
                              {remaining} <Trans>remaining</Trans>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs">
                              <div>
                                <Trans>Pickups</Trans>: {totalPickups}
                              </div>
                              <div>
                                <Trans>Production</Trans>: {totalProduction}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </HStack>

                      {/* Pickups */}
                      {emp.pickups.map((pickup) => (
                        <div key={pickup.id} className="flex flex-col gap-1">
                          <HStack className="justify-between items-center bg-background">
                            <div className="text-sm">
                              {pickup.createdBy !== pickup.employeeId &&
                                pickup.createdByUser && (
                                  <span className="text-muted-foreground mr-2">
                                    ({formatPersonName(pickup.createdByUser)})
                                  </span>
                                )}
                              <span className="font-medium">
                                {pickup.quantity}
                              </span>{" "}
                              | {formatDateTime(pickup.createdAt)}
                              {pickup.jobOperation?.description && (
                                <span className="text-muted-foreground ml-2">
                                  - {pickup.jobOperation.description}
                                </span>
                              )}
                            </div>
                            <HStack spacing={2}>
                              <span className="text-xs">
                                <Trans>pickup</Trans>
                              </span>
                              {permissions.can("delete", "production") && (
                                <button
                                  onClick={() => onDeletePickup(pickup)}
                                  className="text-destructive hover:text-destructive/80"
                                >
                                  <LuTrash className="h-4 w-4" />
                                </button>
                              )}
                            </HStack>
                          </HStack>
                          {pickup.configuration && (
                            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {JSON.stringify(pickup.configuration)}
                            </div>
                          )}
                          {pickup.notes && (
                            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {pickup.notes}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Production Quantities */}
                      {emp.production.map((quantity) => (
                        <div key={quantity.id} className="flex flex-col gap-1">
                          <HStack className="justify-between items-center bg-background">
                            <div className="text-sm">
                              <span className="font-medium">
                                {quantity.quantity}
                              </span>{" "}
                              | {formatDateTime(quantity.createdAt)}
                              {quantity.jobOperation?.description && (
                                <span className="text-muted-foreground ml-2">
                                  - {quantity.jobOperation.description}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-right">
                              <Badge variant="green">
                                {typeLabel("Production")}
                              </Badge>
                            </span>
                          </HStack>
                          {quantity.configuration && (
                            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {JSON.stringify(quantity.configuration)}
                            </div>
                          )}
                          {quantity.notes && (
                            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {quantity.notes}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Rework */}
                      {emp.rework.map((quantity) => (
                        <div key={quantity.id} className="flex flex-col gap-1">
                          <HStack className="justify-between items-center bg-background">
                            <div className="text-sm">
                              <span className="font-medium">
                                {quantity.quantity}
                              </span>{" "}
                              | {formatDateTime(quantity.createdAt)}
                              {quantity.jobOperation?.description && (
                                <span className="text-muted-foreground ml-2">
                                  - {quantity.jobOperation.description}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-right">
                              <Badge variant="orange">
                                {typeLabel("Rework")}
                              </Badge>
                            </span>
                          </HStack>
                          {quantity.configuration && (
                            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {JSON.stringify(quantity.configuration)}
                            </div>
                          )}
                          {quantity.notes && (
                            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {quantity.notes}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Scrap */}
                      {emp.scrap.map((quantity) => (
                        <div key={quantity.id} className="flex flex-col gap-1">
                          <HStack className="justify-between items-center bg-background">
                            <div className="text-sm">
                              <span className="font-medium">
                                {quantity.quantity}
                              </span>{" "}
                              | {formatDateTime(quantity.createdAt)}
                              {quantity.jobOperation?.description && (
                                <span className="text-muted-foreground ml-2">
                                  - {quantity.jobOperation.description}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-right">
                              <Badge variant="red">{typeLabel("Scrap")}</Badge>
                            </span>
                          </HStack>
                          {quantity.scrapReasonId && (
                            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {scrapReasons.find(
                                (r) => r.id === quantity.scrapReasonId
                              )?.name ?? ""}
                            </div>
                          )}
                          {quantity.configuration && (
                            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {JSON.stringify(quantity.configuration)}
                            </div>
                          )}
                          {quantity.notes && (
                            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {quantity.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </VStack>
                  </CardContent>
                </Card>
              );
            })
          )}
        </VStack>

        {deletePickupModal.isOpen && selectedPickup && (
          <ConfirmDelete
            action={path.to.deleteJobPickup(selectedPickup.id)}
            isOpen
            name={t`pickup by ${selectedPickup.employeeId}`}
            text={t`Are you sure you want to delete this pickup? This action cannot be undone.`}
            onCancel={onDeletePickupCancel}
            onSubmit={onDeletePickupCancel}
          />
        )}
      </div>
    );
  }
);

ProductionLogsTable.displayName = "ProductionLogsTable";

export default ProductionLogsTable;
