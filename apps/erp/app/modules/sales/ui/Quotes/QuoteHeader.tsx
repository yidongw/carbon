import {
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
  toast,
  useDisclosure,
  useIsomorphicLayoutEffect
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import {
  LuCheck,
  LuCheckCheck,
  LuCircleStop,
  LuCircleX,
  LuCopy,
  LuEllipsisVertical,
  LuExternalLink,
  LuEye,
  LuFile,
  LuGitBranchPlus,
  LuLoaderCircle,
  LuPanelLeft,
  LuPanelRight,
  LuShare2,
  LuTrash,
  LuTrophy
} from "react-icons/lu";
import { Link, useFetcher, useParams } from "react-router";
import { useAuditLog } from "~/components/AuditLog";
import { usePanels, useTopbarLeft } from "~/components/Layout";
import ConfirmDelete from "~/components/Modals/ConfirmDelete";
import { usePermissions, useRouteData, useUser } from "~/hooks";
import { path } from "~/utils/path";
import { isQuoteLocked } from "../../sales.models";
import type {
  Opportunity,
  Quotation,
  QuotationLine,
  QuotationPrice,
  QuotationShipment
} from "../../types";
import QuoteFinalizeModal from "./QuoteFinalizeModal";
import QuoteStatus from "./QuoteStatus";
import QuoteToOrderDrawer from "./QuoteToOrderDrawer";

function QuoteTopbarLeft({ quoteId }: { quoteId: string }) {
  const { t } = useLingui();
  const permissions = usePermissions();
  const { company } = useUser();
  const { hasExplorer, toggleExplorer, toggleProperties } = usePanels();

  const routeData = useRouteData<{
    quote: Quotation;
    lines: QuotationLine[];
    opportunity: Opportunity;
    prices: QuotationPrice[];
    shipment: QuotationShipment;
  }>(path.to.quote(quoteId));

  const eligibleLines = routeData?.lines.filter(
    (line) => line.status !== "No Quote"
  );

  const finalizeModal = useDisclosure();
  const convertToOrderModal = useDisclosure();
  const shareModal = useDisclosure();
  const createRevisionModal = useDisclosure();
  const deleteQuoteModal = useDisclosure();
  const [asRevision, setAsRevision] = useState(false);

  const finalizeFetcher = useFetcher<{}>();
  const statusFetcher = useFetcher<{}>();

  const { trigger: auditLogTrigger, drawer: auditLogDrawer } = useAuditLog({
    entityType: "salesQuote",
    entityId: quoteId,
    companyId: company.id,
    variant: "dropdown"
  });

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
          <Link to={path.to.quoteDetails(quoteId)}>
            <span className="font-semibold text-sm flex items-center gap-0">
              <span>{routeData?.quote?.quoteId}</span>
              {(routeData?.quote?.revisionId ?? 0) > 0 && (
                <span className="text-muted-foreground">
                  -{routeData?.quote?.revisionId}
                </span>
              )}
            </span>
          </Link>
          <Copy text={routeData?.quote?.quoteId ?? ""} />
          <QuoteStatus status={routeData?.quote?.status} />
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
            {auditLogTrigger}
            <DropdownMenuSeparator />

            {/* Copy / Revision */}
            <DropdownMenuItem
              onClick={() => {
                setAsRevision(false);
                createRevisionModal.onOpen();
              }}
            >
              <DropdownMenuIcon icon={<LuCopy />} />
              <Trans>Copy Quote</Trans>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setAsRevision(true);
                createRevisionModal.onOpen();
              }}
            >
              <DropdownMenuIcon icon={<LuGitBranchPlus />} />
              <Trans>Create Quote Revision</Trans>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Preview / Share */}
            {routeData?.quote.externalLinkId &&
            routeData?.quote.status === "Sent" ? (
              <DropdownMenuItem onClick={shareModal.onOpen}>
                <DropdownMenuIcon icon={<LuShare2 />} />
                <Trans>Share</Trans>
              </DropdownMenuItem>
            ) : (
              <>
                {routeData?.quote.externalLinkId && (
                  <DropdownMenuItem asChild>
                    <a
                      target="_blank"
                      href={path.to.externalQuote(
                        routeData.quote.externalLinkId
                      )}
                      rel="noreferrer"
                    >
                      <DropdownMenuIcon icon={<LuExternalLink />} />
                      <Trans>Digital Quote</Trans>
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <a
                    target="_blank"
                    href={path.to.file.quote(quoteId)}
                    rel="noreferrer"
                  >
                    <DropdownMenuIcon icon={<LuFile />} />
                    <Trans>PDF</Trans>
                  </a>
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator />

            {/* Finalize */}
            <DropdownMenuItem
              disabled={
                routeData?.quote?.status !== "Draft" ||
                finalizeFetcher.state !== "idle" ||
                !permissions.can("update", "sales") ||
                !eligibleLines?.length
              }
              onClick={finalizeModal.onOpen}
            >
              <DropdownMenuIcon icon={<LuCheckCheck />} />
              <Trans>Finalize</Trans>
            </DropdownMenuItem>

            {/* Won */}
            <DropdownMenuItem
              disabled={
                routeData?.quote?.status !== "Sent" ||
                !permissions.can("update", "sales")
              }
              onClick={convertToOrderModal.onOpen}
            >
              <DropdownMenuIcon icon={<LuTrophy />} />
              <Trans>Won</Trans>
            </DropdownMenuItem>

            {/* Lost */}
            <DropdownMenuItem
              disabled={
                routeData?.quote?.status !== "Sent" ||
                statusFetcher.state !== "idle" ||
                !permissions.can("update", "sales")
              }
              onClick={() => {
                statusFetcher.submit(
                  { status: "Lost" },
                  {
                    method: "post",
                    action: path.to.quoteStatus(quoteId)
                  }
                );
              }}
            >
              <DropdownMenuIcon icon={<LuCircleX />} />
              <Trans>Lost</Trans>
            </DropdownMenuItem>

            {/* Cancel */}
            {routeData?.quote?.status === "Draft" && (
              <DropdownMenuItem
                disabled={
                  statusFetcher.state !== "idle" ||
                  !permissions.can("update", "sales")
                }
                onClick={() => {
                  statusFetcher.submit(
                    { status: "Cancelled" },
                    {
                      method: "post",
                      action: path.to.quoteStatus(quoteId)
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
                (routeData?.opportunity?.salesOrders.length ?? 0) > 0 ||
                statusFetcher.state !== "idle" ||
                !permissions.can("update", "sales")
              }
              onClick={() => {
                statusFetcher.submit(
                  { status: "Draft" },
                  {
                    method: "post",
                    action: path.to.quoteStatus(quoteId)
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
                !permissions.can("delete", "sales") ||
                !permissions.is("employee") ||
                isQuoteLocked(routeData?.quote?.status)
              }
              destructive
              onClick={deleteQuoteModal.onOpen}
            >
              <DropdownMenuIcon icon={<LuTrash />} />
              <Trans>Delete Quote</Trans>
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
        <QuoteFinalizeModal
          quote={routeData?.quote}
          lines={eligibleLines ?? []}
          pricing={routeData?.prices ?? []}
          shipment={routeData?.shipment ?? null}
          onClose={finalizeModal.onClose}
          fetcher={finalizeFetcher}
          // @ts-expect-error TS2339 - TODO: fix type
          defaultCc={routeData?.defaultCc ?? []}
        />
      )}
      {createRevisionModal.isOpen && (
        <CreateRevisionModal
          quote={routeData?.quote}
          asRevision={asRevision}
          onClose={createRevisionModal.onClose}
        />
      )}
      {shareModal.isOpen && (
        <ShareQuoteModal
          id={quoteId}
          externalLinkId={routeData?.quote.externalLinkId ?? undefined}
          onClose={shareModal.onClose}
        />
      )}
      {/* we use isOpen so we don't lose state */}
      <QuoteToOrderDrawer
        isOpen={convertToOrderModal.isOpen}
        onClose={convertToOrderModal.onClose}
        quote={routeData?.quote!}
        lines={eligibleLines ?? []}
        pricing={routeData?.prices ?? []}
      />
      {deleteQuoteModal.isOpen && (
        <ConfirmDelete
          action={path.to.deleteQuote(quoteId)}
          isOpen={deleteQuoteModal.isOpen}
          name={routeData?.quote?.quoteId!}
          text={t`Are you sure you want to delete ${routeData?.quote
            ?.quoteId!}? This cannot be undone.`}
          onCancel={() => {
            deleteQuoteModal.onClose();
          }}
          onSubmit={() => {
            deleteQuoteModal.onClose();
          }}
        />
      )}
      {auditLogDrawer}
    </>
  );
}

const QuoteHeader = () => {
  const { quoteId } = useParams();
  if (!quoteId) throw new Error("quoteId not found");

  const { leftSlotEl, setHasLeftContent } = useTopbarLeft();

  useIsomorphicLayoutEffect(() => {
    setHasLeftContent(true);
    return () => setHasLeftContent(false);
  }, [setHasLeftContent]);

  return (
    <>
      {leftSlotEl && createPortal(<QuoteTopbarLeft quoteId={quoteId} />, leftSlotEl)}
    </>
  );
};

export default QuoteHeader;

function CreateRevisionModal({
  quote,
  asRevision,
  onClose
}: {
  quote?: Quotation;
  asRevision: boolean;
  onClose: () => void;
}) {
  const { t } = useLingui();
  const [newQuoteId, setNewQuoteId] = useState<string | null>(null);
  const fetcher = useFetcher<
    | { success: false; message: string }
    | { success: true; data: { newQuoteId: string } }
  >();

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    if (fetcher.data?.success === false) {
      toast.error(fetcher.data?.message);
    }

    if (fetcher.data?.success === true) {
      toast.success(
        asRevision
          ? t`Successfully created a new revision`
          : t`Successfully copied quote`
      );
      setNewQuoteId(fetcher.data?.data.newQuoteId ?? null);
    }
  }, [fetcher.data?.success, t]);

  if (!quote) return null;
  return (
    <Modal open onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {asRevision ? (
              <Trans>Create Quote Revision</Trans>
            ) : (
              <Trans>Copy Quote</Trans>
            )}
          </ModalTitle>
          <ModalDescription>
            {asRevision ? (
              <Trans>The quote will be copied with a revision suffix</Trans>
            ) : (
              <Trans>Create a quote with a new quote ID</Trans>
            )}
          </ModalDescription>
        </ModalHeader>
        {newQuoteId ? (
          <>
            <ModalBody>
              <div className="flex flex-col items-center justify-center py-8">
                <div>
                  <LuCheck className="w-16 h-16 text-green-500" />
                </div>
                <h2 className="animate-fade-in">
                  <Trans>The quote has been created</Trans>
                </h2>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={onClose}>
                <Trans>Cancel</Trans>
              </Button>
              <Button asChild>
                <Link to={path.to.quoteDetails(newQuoteId)}>
                  <Trans>Open</Trans>
                </Link>
              </Button>
            </ModalFooter>
          </>
        ) : (
          <ModalFooter>
            <Button variant="secondary" onClick={onClose}>
              <Trans>Cancel</Trans>
            </Button>
            <fetcher.Form
              method="post"
              action={path.to.quoteDuplicate(quote.id!)}
            >
              <input type="hidden" name="quoteId" value={quote?.id ?? ""} />
              <input
                type="hidden"
                name="asRevision"
                value={asRevision ? "true" : "false"}
              />
              <Button
                isLoading={fetcher.state !== "idle"}
                isDisabled={fetcher.state !== "idle"}
                variant="primary"
                type="submit"
              >
                {asRevision ? (
                  <Trans>Create Revision</Trans>
                ) : (
                  <Trans>Copy Quote</Trans>
                )}
              </Button>
            </fetcher.Form>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}

function ShareQuoteModal({
  id,
  externalLinkId,
  onClose
}: {
  id?: string;
  externalLinkId?: string;
  onClose: () => void;
}) {
  if (!externalLinkId) return null;
  if (typeof window === "undefined") return null;

  const digitalQuoteUrl = `${window.location.origin}${path.to.externalQuote(
    externalLinkId
  )}`;
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
            <Trans>Share Quote</Trans>
          </ModalTitle>
          <ModalDescription>
            <Trans>Copy this link to share the quote with a customer</Trans>
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
