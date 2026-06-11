import {
  Alert,
  AlertDescription,
  AlertTitle,
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
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  useDisclosure,
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { createPortal } from "react-dom";
import {
  LuCircleX,
  LuEllipsisVertical,
  LuEye,
  LuGitCompare,
  LuLoaderCircle,
  LuPanelLeft,
  LuPanelRight,
  LuSend,
  LuShare2,
  LuTrash,
  LuTriangleAlert
} from "react-icons/lu";
import { Link, useFetcher, useParams } from "react-router";
import { usePanels, useTopbarLeft } from "~/components/Layout";
import ConfirmDelete from "~/components/Modals/ConfirmDelete";
import { usePermissions, useRouteData } from "~/hooks";
import { useIntegrations } from "~/hooks/useIntegrations";
import { path } from "~/utils/path";
import { isRfqLocked } from "../../purchasing.models";
import type { PurchasingRFQ, PurchasingRFQLine } from "../../types";
import { SupplierQuoteCompareDrawer } from "../SupplierQuote";
import FinalizeRFQModal from "./FinalizeRFQModal";
import PurchasingRFQStatus from "./PurchasingRFQStatus";

function PurchasingRFQTopbarLeft({ rfqId }: { rfqId: string }) {
  const { t } = useLingui();
  const finalizeModal = useDisclosure();
  const requiresSuppliersAlert = useDisclosure();
  const cancelReasonModal = useDisclosure();
  const deleteRFQModal = useDisclosure();
  const compareQuotesModal = useDisclosure();

  const permissions = usePermissions();
  const integrations = useIntegrations();
  const canEmail = integrations.has("email");
  const finalizeFetcher = useFetcher<{ error: string | null }>();
  const { hasExplorer, toggleExplorer, toggleProperties } = usePanels();

  const routeData = useRouteData<{
    rfqSummary: PurchasingRFQ;
    lines: PurchasingRFQLine[];
    suppliers: {
      id: string;
      supplierId: string;
      supplier: { id: string; name: string };
      quoteExternalLinkId?: string;
    }[];
    linkedQuotes: unknown[];
  }>(path.to.purchasingRfq(rfqId));

  const status = routeData?.rfqSummary?.status ?? "Draft";
  const isLocked = isRfqLocked(status);

  const statusFetcher = useFetcher<{}>();

  const hasSuppliers = (routeData?.suppliers?.length ?? 0) > 0;
  const activeLinkedQuotes = (routeData?.linkedQuotes ?? []).filter(
    (q: any) => q.status === "Active"
  );
  const canCompareQuotes = activeLinkedQuotes.length > 1;

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
          <Link to={path.to.purchasingRfqDetails(rfqId)}>
            <span className="font-semibold text-sm">
              {routeData?.rfqSummary?.rfqId}
            </span>
          </Link>
          <Copy text={routeData?.rfqSummary?.rfqId ?? ""} />
          <PurchasingRFQStatus status={routeData?.rfqSummary?.status} />
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
            {/* Preview */}
            {status === "Draft" && (
              <DropdownMenuItem asChild>
                <Link to={path.to.purchasingRfqPreview(rfqId)} target="_blank">
                  <DropdownMenuIcon icon={<LuEye />} />
                  <Trans>Preview</Trans>
                </Link>
              </DropdownMenuItem>
            )}

            {/* Share links for Requested status */}
            {status === "Requested" && hasSuppliers && (
              <>
                {routeData?.suppliers?.map((supplier) => (
                  <DropdownMenuItem
                    key={supplier.id}
                    disabled={!supplier.quoteExternalLinkId}
                    onClick={() => {
                      if (supplier.quoteExternalLinkId) {
                        window.open(
                          path.to.externalSupplierQuote(
                            supplier.quoteExternalLinkId
                          ),
                          "_blank"
                        );
                      }
                    }}
                  >
                    <DropdownMenuIcon icon={<LuShare2 />} />
                    {supplier.supplier.name}
                    {supplier.quoteExternalLinkId &&
                      typeof window !== "undefined" && (
                        <Copy
                          className="ml-2"
                          text={`${
                            window.location.origin
                          }${path.to.externalSupplierQuote(
                            supplier.quoteExternalLinkId
                          )}`}
                        />
                      )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}

            {/* Finalize */}
            {hasSuppliers ? (
              canEmail ? (
                <DropdownMenuItem
                  disabled={
                    status !== "Draft" ||
                    routeData?.lines?.length === 0 ||
                    !permissions.can("create", "purchasing")
                  }
                  onClick={finalizeModal.onOpen}
                >
                  <DropdownMenuIcon icon={<LuSend />} />
                  <Trans>Finalize</Trans>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  disabled={
                    status !== "Draft" ||
                    routeData?.lines?.length === 0 ||
                    !permissions.can("create", "purchasing") ||
                    finalizeFetcher.state !== "idle"
                  }
                  onClick={() => {
                    const formData = new FormData();
                    routeData?.suppliers?.forEach((supplier, index) => {
                      formData.append(
                        `suppliers[${index}].supplierId`,
                        supplier.supplierId
                      );
                      formData.append(
                        `suppliers[${index}].rfqSupplierId`,
                        supplier.id
                      );
                    });
                    finalizeFetcher.submit(formData, {
                      method: "post",
                      action: path.to.purchasingRfqFinalize(rfqId)
                    });
                  }}
                >
                  <DropdownMenuIcon icon={<LuSend />} />
                  <Trans>Finalize</Trans>
                </DropdownMenuItem>
              )
            ) : (
              <DropdownMenuItem
                disabled={
                  status !== "Draft" ||
                  routeData?.lines?.length === 0 ||
                  !permissions.can("create", "purchasing")
                }
                onClick={requiresSuppliersAlert.onOpen}
              >
                <DropdownMenuIcon icon={<LuSend />} />
                <Trans>Finalize</Trans>
              </DropdownMenuItem>
            )}

            {/* Cancel */}
            <DropdownMenuItem
              disabled={
                (status !== "Draft" && status !== "Requested") ||
                !permissions.can("update", "purchasing")
              }
              onClick={cancelReasonModal.onOpen}
            >
              <DropdownMenuIcon icon={<LuCircleX />} />
              <Trans>Cancel</Trans>
            </DropdownMenuItem>

            {/* Compare Quotes */}
            {canCompareQuotes && (
              <DropdownMenuItem onClick={compareQuotesModal.onOpen}>
                <DropdownMenuIcon icon={<LuGitCompare />} />
                <Trans>Compare Quotes</Trans>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            {/* Reopen */}
            <DropdownMenuItem
              disabled={
                status !== "Closed" ||
                statusFetcher.state !== "idle" ||
                !permissions.can("update", "purchasing")
              }
              onClick={() => {
                statusFetcher.submit(
                  { status: "Draft" },
                  {
                    method: "post",
                    action: path.to.purchasingRfqStatus(rfqId)
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
              onClick={deleteRFQModal.onOpen}
            >
              <DropdownMenuIcon icon={<LuTrash />} />
              <Trans>Delete RFQ</Trans>
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

      {finalizeModal.isOpen && (
        <FinalizeRFQModal
          lines={routeData?.lines ?? []}
          suppliers={routeData?.suppliers ?? []}
          rfqId={rfqId}
          onClose={finalizeModal.onClose}
        />
      )}
      {requiresSuppliersAlert.isOpen && (
        <RequiresSuppliersAlert onClose={requiresSuppliersAlert.onClose} />
      )}
      {cancelReasonModal.isOpen && (
        <ConfirmDelete
          action={path.to.cancelPurchasingRfq(rfqId)}
          isOpen={cancelReasonModal.isOpen}
          name={routeData?.rfqSummary?.rfqId!}
          text={t`Are you sure you want to cancel ${routeData?.rfqSummary
            ?.rfqId!}? This will also cancel all related supplier quotes.`}
          deleteText="Cancel"
          onCancel={() => {
            cancelReasonModal.onClose();
          }}
          onSubmit={() => {
            cancelReasonModal.onClose();
          }}
        />
      )}
      {deleteRFQModal.isOpen && (
        <ConfirmDelete
          action={path.to.deletePurchasingRfq(rfqId)}
          isOpen={deleteRFQModal.isOpen}
          name={routeData?.rfqSummary?.rfqId!}
          text={t`Are you sure you want to delete ${routeData?.rfqSummary
            ?.rfqId!}? This cannot be undone.`}
          onCancel={() => {
            deleteRFQModal.onClose();
          }}
          onSubmit={() => {
            deleteRFQModal.onClose();
          }}
        />
      )}
      {compareQuotesModal.isOpen && (
        <SupplierQuoteCompareDrawer
          isOpen={compareQuotesModal.isOpen}
          onClose={compareQuotesModal.onClose}
          purchasingRfqId={rfqId}
        />
      )}
    </>
  );
}

const PurchasingRFQHeader = () => {
  const { rfqId } = useParams();
  if (!rfqId) throw new Error("rfqId not found");

  const { leftSlotEl } = useTopbarLeft();

  return (
    <>
      {leftSlotEl && createPortal(<PurchasingRFQTopbarLeft rfqId={rfqId} />, leftSlotEl)}
    </>
  );
};

export default PurchasingRFQHeader;

function RequiresSuppliersAlert({ onClose }: { onClose: () => void }) {
  return (
    <Modal open onOpenChange={(open) => !open && onClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <Trans>Cannot send RFQ</Trans>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Alert variant="destructive">
            <LuTriangleAlert className="h-4 w-4" />
            <AlertTitle>
              <Trans>RFQ has no suppliers</Trans>
            </AlertTitle>
            <AlertDescription>
              <Trans>
                In order to send this RFQ to suppliers, you must first add
                suppliers to the RFQ.
              </Trans>
            </AlertDescription>
          </Alert>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>
            <Trans>OK</Trans>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
