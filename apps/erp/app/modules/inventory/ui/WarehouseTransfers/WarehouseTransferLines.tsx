import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  Count,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
  useDisclosure,
  VStack
} from "@carbon/react";
import { getItemById, getItemReadableId } from "@carbon/utils";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useRef, useState } from "react";
import { LuArrowRight, LuCirclePlus, LuEllipsisVertical } from "react-icons/lu";
import { Link, Outlet, useFetcher, useNavigate } from "react-router";
import { EmployeeAvatar, Empty, ItemThumbnail } from "~/components";
import { useDateFormatter } from "~/hooks";
import { useItems } from "~/stores";
import { path } from "~/utils/path";
import type { WarehouseTransfer, WarehouseTransferLine } from "../../types";
import useWarehouseTransferLines from "./useWarehouseTransferLines";

type WarehouseTransferLinesProps = {
  warehouseTransferLines: WarehouseTransferLine[];
  transferId: string;
  warehouseTransfer: WarehouseTransfer;
  compact?: boolean;
};

const WarehouseTransferLines = ({
  warehouseTransferLines,
  transferId,
  warehouseTransfer,
  compact = false
}: WarehouseTransferLinesProps) => {
  const [items] = useItems();
  const { canEdit } = useWarehouseTransferLines(warehouseTransfer);

  const sortedLines = warehouseTransferLines.sort((a, b) => {
    const aReadableId = getItemReadableId(items, a.itemId) ?? "";
    const bReadableId = getItemReadableId(items, b.itemId) ?? "";
    return aReadableId.localeCompare(bReadableId);
  });

  return (
    <>
      <Card className={cn(compact && "border-none p-0 dark:shadow-none")}>
        <HStack className="justify-between">
          <CardHeader className={cn(compact && "px-0")}>
            <CardTitle className="flex flex-row items-center gap-2">
              <Trans>Transfer Lines</Trans>
              {sortedLines.length > 0 && <Count count={sortedLines.length} />}
            </CardTitle>
          </CardHeader>
          {canEdit && (
            <CardAction>
              <Button
                variant="secondary"
                leftIcon={<LuCirclePlus />}
                asChild
                disabled={!canEdit}
              >
                <Link to={path.to.newWarehouseTransferLine(transferId)}>
                  Add Line
                </Link>
              </Button>
            </CardAction>
          )}
        </HStack>
        <CardContent className={cn(compact && "px-0")}>
          <div className="flex flex-col gap-6">
            {sortedLines.length > 0 && (
              <div className="border rounded-lg">
                {sortedLines.map((line, index) => (
                  <WarehouseTransferLineListItem
                    key={line.id}
                    line={line}
                    warehouseTransfer={warehouseTransfer}
                    isDisabled={!canEdit}
                    className={
                      index === sortedLines.length - 1 ? "border-none" : ""
                    }
                  />
                ))}
              </div>
            )}

            {sortedLines.length === 0 && (
              <div className="flex flex-1 py-24 justify-center items-center w-full">
                <Empty />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Outlet />
    </>
  );
};

function WarehouseTransferLineListItem({
  line,
  warehouseTransfer,
  isDisabled,
  className
}: {
  line: WarehouseTransferLine;
  warehouseTransfer: WarehouseTransfer;
  isDisabled: boolean;
  className?: string;
}) {
  const { t } = useLingui();
  const { formatRelativeTime } = useDateFormatter();
  const deleteModalDisclosure = useDisclosure();

  const [items] = useItems();
  const navigate = useNavigate();

  // Show the right-edge scroll fade only while there is genuinely more content
  // to the right. Otherwise (row not overflowing, or already scrolled to the
  // end) the gradient just sits over the last column and makes it look
  // faded/cut off.
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () =>
      setCanScrollRight(el.scrollWidth - el.clientWidth - el.scrollLeft > 1);
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  // Fall back to the line's embedded item row for hidden item types (e.g.
  // samples) that aren't in the shared item list — otherwise the row silently
  // returns null while the header count still includes it.
  const item = getItemById(items, line.itemId) ?? line.item;
  if (!item || !line.id) return null;
  const itemReadableId =
    (item as { readableIdWithRevision?: string }).readableIdWithRevision ??
    (item as { readableId?: string }).readableId ??
    "";

  const isUpdated = line.updatedBy !== null;
  const person = isUpdated ? line.updatedBy : line.createdBy;
  const date = line.updatedAt ?? line.createdAt;

  return (
    <div className={cn("flex flex-col border-b p-6 gap-6 relative", className)}>
      {!isDisabled && (
        <div className="absolute top-6 right-6 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                aria-label={t`Open menu`}
                icon={<LuEllipsisVertical />}
                variant="secondary"
                size="md"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() =>
                  navigate(
                    path.to.warehouseTransferLine(warehouseTransfer.id, line.id)
                  )
                }
              >
                <Trans>Edit</Trans>
              </DropdownMenuItem>
              <DropdownMenuItem
                destructive
                onClick={deleteModalDisclosure.onOpen}
              >
                <Trans>Delete</Trans>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <div className={cn("relative w-full", !isDisabled && "pr-10")}>
        <div
          ref={scrollRef}
          className="flex flex-1 items-center w-full justify-between gap-4 overflow-x-auto scrollbar-hide md:gap-0 md:overflow-visible"
        >
          <HStack spacing={4} className="shrink-0 md:w-1/2">
            <ItemThumbnail
              size="sm"
              thumbnailPath={line.item?.thumbnailPath}
              // @ts-expect-error TS2339 - TODO: fix type
              type={(item.type as "Part") ?? "Part"}
            />
            <VStack
              spacing={0}
              className="max-w-[220px] md:max-w-[380px] w-full"
            >
              <span className="text-sm font-medium truncate block w-full">
                {/* @ts-expect-error TS2339 */}
                {item.name}
              </span>
              <span className="text-xs text-muted-foreground truncate block w-full">
                {itemReadableId}
              </span>
            </VStack>
          </HStack>
          <div className="flex shrink-0 items-center gap-4 md:flex-grow md:justify-between md:pl-4 md:w-1/2">
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="secondary">
                {Number(line.quantity).toLocaleString()}
              </Badge>
              {line.fromStorageUnit && (
                <Badge variant="outline">{line.fromStorageUnit.name}</Badge>
              )}
              <LuArrowRight className="size-4" />
              {line.toStorageUnit && (
                <Badge variant="outline">{line.toStorageUnit.name}</Badge>
              )}
            </div>
            <HStack spacing={2} className="shrink-0">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {isUpdated ? t`Updated` : t`Created`} {formatRelativeTime(date)}
              </span>
              <EmployeeAvatar employeeId={person} withName={false} />
            </HStack>
          </div>
        </div>
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 w-12 bg-gradient-to-l from-card dark:from-muted to-transparent transition-opacity duration-150 md:hidden",
            isDisabled ? "right-0" : "right-10",
            canScrollRight ? "opacity-100" : "opacity-0"
          )}
        />
      </div>

      {deleteModalDisclosure.isOpen && (
        <DeleteWarehouseTransferLine
          lineId={line.id}
          warehouseTransferId={warehouseTransfer.id}
          itemName={itemReadableId}
          onCancel={() => {
            deleteModalDisclosure.onClose();
          }}
          onSubmit={() => {
            deleteModalDisclosure.onClose();
          }}
        />
      )}
    </div>
  );
}

function DeleteWarehouseTransferLine({
  lineId,
  warehouseTransferId,
  itemName,
  onCancel,
  onSubmit
}: {
  lineId: string;
  warehouseTransferId: string;
  itemName: string;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const fetcher = useFetcher<{ success: boolean }>();
  const submitted = useRef(false);

  useEffect(() => {
    if (submitted.current && fetcher.state === "idle") {
      onSubmit();
      submitted.current = false;
    }
  }, [fetcher.state, onSubmit]);

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <Trans>Delete Transfer Line</Trans>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete this transfer line for {itemName}?
          This cannot be undone.
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={onCancel}>
            <Trans>Cancel</Trans>
          </Button>
          <fetcher.Form
            method="post"
            action={path.to.warehouseTransferLine(warehouseTransferId, lineId)}
            onSubmit={() => (submitted.current = true)}
          >
            <input type="hidden" name="type" value="delete" />
            <input type="hidden" name="id" value={lineId} />
            <Button
              variant="destructive"
              isLoading={fetcher.state !== "idle"}
              isDisabled={fetcher.state !== "idle"}
              type="submit"
            >
              Delete
            </Button>
          </fetcher.Form>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default WarehouseTransferLines;
