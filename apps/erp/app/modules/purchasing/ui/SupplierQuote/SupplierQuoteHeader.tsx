import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Copy,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Status,
  useDisclosure,
  useIsomorphicLayoutEffect,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import {
  LuCheckCheck,
  LuCircleStop,
  LuEllipsisVertical,
  LuExternalLink,
  LuGitCompare,
  LuLoaderCircle,
  LuPanelLeft,
  LuPanelRight,
  LuSend,
  LuShoppingCart,
  LuTrash,
  LuTriangleAlert
} from "react-icons/lu";
import type { FetcherWithComponents } from "react-router";
import { Link, useFetcher, useParams, useRevalidator } from "react-router";
import { usePanels, useTopbarLeft } from "~/components/Layout";
import ConfirmDelete from "~/components/Modals/ConfirmDelete";
import {
  usePermissions,
  useRouteData,
  useSupplierApprovalRequired
} from "~/hooks";
import { useSuppliers } from "~/stores/suppliers";
import { path } from "~/utils/path";
import { isSupplierQuoteLocked } from "../../purchasing.models";
import type {
  SupplierInteraction,
  SupplierQuote,
  SupplierQuoteLine,
  SupplierQuoteLinePrice
} from "../../types";
import SupplierQuoteCompareDrawer from "./SupplierQuoteCompareDrawer";
import SupplierQuoteSendModal from "./SupplierQuoteSendModal";
import SupplierQuoteStatus from "./SupplierQuoteStatus";
import SupplierQuoteToOrderDrawer from "./SupplierQuoteToOrderDrawer";

function SupplierQuoteTopbarLeft({ id }: { id: string }) {
  const { t } = useLingui();
  const permissions = usePermissions();
  const revalidator = useRevalidator();
  const { hasExplorer, toggleExplorer, toggleProperties } = usePanels();

  const supplierApprovalRequired = useSupplierApprovalRequired();
  const routeData = useRouteData<{
    quote: SupplierQuote;
    lines: SupplierQuoteLine[];
    interaction: SupplierInteraction;
    prices: SupplierQuoteLinePrice[];
    siblingQuotes: (SupplierQuote & {
      supplier: { id: string; name: string };
    })[];
  }>(path.to.supplierQuote(id));

  const [suppliers] = useSuppliers();
  const isSupplierApproved = useMemo(
    () =>
      !supplierApprovalRequired ||
      suppliers.find((s) => s.id === routeData?.quote?.supplierId)
        ?.supplierStatus === "Active",
    [supplierApprovalRequired, routeData?.quote?.supplierId, suppliers]
  );

  const isOutsideProcessing =
    routeData?.quote?.supplierQuoteType === "Outside Processing";

  const convertToOrderModal = useDisclosure();
  const compareModal = useDisclosure();
  const deleteModal = useDisclosure();
  const shareModal = useDisclosure();
  const finalizeModal = useDisclosure();
  const sendModal = useDisclosure();

  const finalizeFetcher = useFetcher<{}>();
  const sendFetcher = useFetcher<{}>();
  const statusFetcher = useFetcher<{}>();

  const hasLines = routeData?.lines && routeData.lines.length > 0;
  const isLocked = isSupplierQuoteLocked(routeData?.quote?.status);
  const quoteStatus: string = routeData?.quote?.status ?? "";
  const editableStatuses = ["Draft", "Declined"];
  const isEditableStatus = editableStatuses.includes(quoteStatus);

  // Get the first linked RFQ ID for comparison
  const linkedRfqId = routeData?.interaction.purchasingRfq?.id ?? null;

  // Check if sibling quotes exist (for showing Compare option)
  const hasSiblingQuotes = (routeData?.siblingQuotes ?? []).length > 0;

  const canSend =
    isEditableStatus && permissions.can("update", "purchasing") && hasLines;

  const canFinalize = ["Draft", "Declined"].includes(quoteStatus);

  return (
    <>
      <HStack className="items-center -ml-2 w-full justify-between" spacing={1}>
        <HStack spacing={1}>
          {hasExplorer && (
            <IconButton
              aria-label={t`Toggle Explorer`}
              icon={<LuPanelLeft />}
              onClick={toggleExplorer}
              variant="ghost"
            />
          )}
          <Link to={path.to.supplierQuoteDetails(id)}>
            <span className="font-semibold text-sm">
              {routeData?.quote?.supplierQuoteId}
            </span>
          </Link>
          <Copy text={routeData?.quote?.supplierQuoteId ?? ""} />
          <SupplierQuoteStatus status={routeData?.quote?.status} />
          {isOutsideProcessing && (
          <Badge variant="default">
            {routeData?.quote?.supplierQuoteType}
          </Badge>
        )}
        {supplierApprovalRequired && !isSupplierApproved && (
          <Status color="red">
            <Trans>Unapproved Supplier</Trans>
          </Status>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              aria-label={t`More options`}
              icon={<LuEllipsisVertical />}
              size="sm"
              variant="secondary"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* Preview - Digital Quote */}
            <DropdownMenuItem asChild>
              <a
                target="_blank"
                href={path.to.externalSupplierQuote(
                  (routeData?.quote as any).externalLinkId
                )}
                rel="noreferrer"
              >
                <DropdownMenuIcon icon={<LuExternalLink />} />
                <Trans>Digital Quote</Trans>
              </a>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Send */}
            {canSend && (
              <DropdownMenuItem
                disabled={
                  quoteStatus === "Active" ||
                  sendFetcher.state !== "idle" ||
                  !permissions.can("update", "purchasing") ||
                  !hasLines
                }
                onClick={sendModal.onOpen}
              >
                <DropdownMenuIcon icon={<LuSend />} />
                <Trans>Send</Trans>
              </DropdownMenuItem>
            )}

            {/* Finalize */}
            {canFinalize && (
              <DropdownMenuItem
                disabled={
                  finalizeFetcher.state !== "idle" ||
                  !permissions.can("update", "purchasing") ||
                  !hasLines
                }
                onClick={() => {
                  revalidator.revalidate();
                  finalizeModal.onOpen();
                }}
              >
                <DropdownMenuIcon icon={<LuCheckCheck />} />
                <Trans>Finalize</Trans>
              </DropdownMenuItem>
            )}

            {/* Order / Compare and Order */}
            {routeData?.quote?.status === "Active" && (
              <>
                <DropdownMenuItem
                  disabled={
                    !permissions.can("update", "purchasing") ||
                    !isSupplierApproved
                  }
                  onClick={convertToOrderModal.onOpen}
                >
                  <DropdownMenuIcon icon={<LuShoppingCart />} />
                  <Trans>Order</Trans>
                </DropdownMenuItem>
                {hasSiblingQuotes && (
                  <DropdownMenuItem
                    disabled={
                      !permissions.can("update", "purchasing") ||
                      !isSupplierApproved
                    }
                    onClick={compareModal.onOpen}
                  >
                    <DropdownMenuIcon icon={<LuGitCompare />} />
                    <Trans>Compare and Order</Trans>
                  </DropdownMenuItem>
                )}
              </>
            )}

            {/* Cancel */}
            {routeData?.quote?.status === "Draft" && (
              <DropdownMenuItem
                disabled={
                  statusFetcher.state !== "idle" ||
                  !permissions.can("update", "purchasing")
                }
                onClick={() => {
                  statusFetcher.submit(
                    { status: "Cancelled" },
                    {
                      method: "post",
                      action: path.to.supplierQuoteStatus(id)
                    }
                  );
                }}
              >
                <DropdownMenuIcon icon={<LuCircleStop />} />
                <Trans>Cancel</Trans>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            {/* Reopen */}
            <DropdownMenuItem
              disabled={
                routeData?.quote?.status === "Draft" ||
                statusFetcher.state !== "idle" ||
                !permissions.can("update", "purchasing")
              }
              onClick={() => {
                statusFetcher.submit(
                  { status: "Draft" },
                  {
                    method: "post",
                    action: path.to.supplierQuoteStatus(id)
                  }
                );
              }}
            >
              <DropdownMenuIcon icon={<LuLoaderCircle />} />
              <Trans>Reopen</Trans>
            </DropdownMenuItem>

            {/* Delete */}
            <DropdownMenuItem
              disabled={
                isLocked ||
                !permissions.can("delete", "purchasing") ||
                !permissions.is("employee")
              }
              destructive
              onClick={deleteModal.onOpen}
            >
              <DropdownMenuIcon icon={<LuTrash />} />
              <Trans>Delete Supplier Quote</Trans>
            </DropdownMenuItem>
          </DropdownMenuContent>
          </DropdownMenu>
        </HStack>
        <IconButton
          aria-label={t`Toggle Properties`}
          icon={<LuPanelRight />}
          onClick={toggleProperties}
          variant="ghost"
        />
      </HStack>

      <SupplierQuoteToOrderDrawer
        isOpen={convertToOrderModal.isOpen}
        onClose={convertToOrderModal.onClose}
        quote={routeData?.quote!}
        lines={routeData?.lines ?? []}
        pricing={routeData?.prices ?? []}
      />
      {deleteModal.isOpen && (
        <ConfirmDelete
          action={path.to.deleteSupplierQuote(id)}
          isOpen={deleteModal.isOpen}
          name={routeData?.quote?.supplierQuoteId ?? "supplier quote"}
          text={t`Are you sure you want to delete ${routeData?.quote?.supplierQuoteId}? This cannot be undone.`}
          onCancel={() => {
            deleteModal.onClose();
          }}
          onSubmit={() => {
            deleteModal.onClose();
          }}
        />
      )}
      {finalizeModal.isOpen && (
        <SupplierQuoteFinalizeModal
          quote={routeData?.quote}
          lines={routeData?.lines ?? []}
          prices={routeData?.prices ?? []}
          onClose={finalizeModal.onClose}
          fetcher={finalizeFetcher}
        />
      )}
      {sendModal.isOpen && (
        <SupplierQuoteSendModal
          quote={routeData?.quote}
          onClose={sendModal.onClose}
          fetcher={sendFetcher}
          externalLinkId={routeData?.quote?.externalLinkId ?? ""}
          // @ts-expect-error TS2339 - TODO: fix type
          defaultCc={routeData?.defaultCc ?? []}
        />
      )}
      <ShareQuoteModal
        id={id}
        externalLinkId={routeData?.quote?.externalLinkId || ""}
        onClose={shareModal.onClose}
        isOpen={shareModal.isOpen}
      />
      {compareModal.isOpen && linkedRfqId && (
        <SupplierQuoteCompareDrawer
          isOpen={compareModal.isOpen}
          onClose={compareModal.onClose}
          purchasingRfqId={linkedRfqId}
        />
      )}
    </>
  );
}

const SupplierQuoteHeader = () => {
  const { id } = useParams();
  if (!id) throw new Error("id not found");

  const { leftSlotEl, setHasLeftContent } = useTopbarLeft();

  useIsomorphicLayoutEffect(() => {
    setHasLeftContent(true);
    return () => setHasLeftContent(false);
  }, [setHasLeftContent]);

  return (
    <>
      {leftSlotEl && createPortal(<SupplierQuoteTopbarLeft id={id} />, leftSlotEl)}
    </>
  );
};

function SupplierQuoteFinalizeModal({
  quote,
  lines,
  prices,
  onClose,
  fetcher
}: {
  quote?: SupplierQuote;
  lines: SupplierQuoteLine[];
  prices: SupplierQuoteLinePrice[];
  onClose: () => void;
  fetcher: FetcherWithComponents<{}>;
}) {
  const { id } = useParams();
  if (!id) throw new Error("id not found");

  // Validation logic: A line is valid if at least ONE quantity has both price and lead time
  // (not all quantities need them)
  const warningLineReadableIds = lines
    .filter((line) => {
      if (!line.id) return true; // Missing line ID is an error

      const linePrices = prices.filter(
        (price) => price.supplierQuoteLineId === line.id
      );

      // Check if at least one quantity has both valid price and lead time
      const hasValidPriceAndLeadTime = linePrices.some(
        (price) =>
          price.supplierUnitPrice !== null &&
          price.supplierUnitPrice !== 0 &&
          price.leadTime !== null &&
          price.leadTime !== 0
      );

      // If no valid price/lead time found, this line has a warning
      return !hasValidPriceAndLeadTime;
    })
    .map((line) => line.itemReadableId)
    .filter((id): id is string => id !== undefined);

  const hasErrors = warningLineReadableIds.length > 0;
  const submitted = useRef(false);

  useIsomorphicLayoutEffect(() => {
    if (fetcher.state === "loading" && submitted.current) {
      onClose();
      submitted.current = false;
    }
  }, [fetcher.state, onClose]);

  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <Trans>Finalize</Trans> {quote?.supplierQuoteId}
          </ModalTitle>
          <ModalDescription>
            <Trans>Are you sure you want to finalize the supplier quote?</Trans>
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            {hasErrors && (
              <Alert variant="destructive">
                <LuTriangleAlert className="h-4 w-4" />
                <AlertTitle>
                  <Trans>Lines need prices or lead times</Trans>
                </AlertTitle>
                <AlertDescription>
                  <Trans>
                    The following line items are missing prices or lead times:
                  </Trans>
                  <ul className="list-disc py-2 pl-4">
                    {warningLineReadableIds.map((readableId) => (
                      <li key={readableId}>{readableId}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={onClose}>
            <Trans>Cancel</Trans>
          </Button>
          <fetcher.Form
            method="post"
            action={path.to.supplierQuoteFinalize(id)}
            onSubmit={() => { submitted.current = true; }}
          >
            <Button
              type="submit"
              isDisabled={hasErrors || fetcher.state !== "idle"}
              isLoading={fetcher.state !== "idle"}
            >
              <Trans>Finalize</Trans>
            </Button>
          </fetcher.Form>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function ShareQuoteModal({
  id,
  externalLinkId,
  onClose,
  isOpen
}: {
  id?: string;
  externalLinkId?: string;
  onClose: () => void;
  isOpen: boolean;
}) {
  if (!externalLinkId) return null;
  if (typeof window === "undefined") return null;

  const digitalQuoteUrl = `${
    window.location.origin
  }${path.to.externalSupplierQuote(externalLinkId)}`;
  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <Trans>Share Quote</Trans>
          </ModalTitle>
          <ModalDescription>
            <Trans>Copy this link to share the quote with a supplier</Trans>
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <InputGroup>
            <Input value={digitalQuoteUrl} />
            <InputRightElement>
              <Copy text={digitalQuoteUrl} />
            </InputRightElement>
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={onClose}>
            <Trans>Close</Trans>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SupplierQuoteHeader;
