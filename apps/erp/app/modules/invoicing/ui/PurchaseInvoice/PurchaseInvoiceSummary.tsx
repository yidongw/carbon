import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Heading,
  HStack,
  Table,
  Tbody,
  Td,
  Tr,
  VStack
} from "@carbon/react";
import { getItemReadableId } from "@carbon/utils";
import { Trans, useLingui } from "@lingui/react/macro";
import { useLocale } from "@react-aria/i18n";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  LuChevronRight,
  LuCirclePlus,
  LuImage,
  LuPencil
} from "react-icons/lu";
import { Link, useNavigate, useParams } from "react-router";
import { MethodIcon, SupplierAvatar } from "~/components";
import { useAccounts } from "~/components/Form/Account";
import { useUnitOfMeasure } from "~/components/Form/UnitOfMeasure";
import { VariantChips, VariantExpandRows } from "~/components/VariantChips";
import {
  useCurrencyFormatter,
  useDateFormatter,
  usePercentFormatter,
  usePermissions,
  useRouteData,
  useUser
} from "~/hooks";
import {
  groupLinesForStyleDisplay,
  type StyleVariantLineMeta
} from "~/modules/shared/variantDisplay";
import { useItems } from "~/stores";
import { getPrivateUrl, path } from "~/utils/path";
import { isPurchaseInvoiceLocked } from "../../invoicing.models";
import type {
  PurchaseInvoice,
  PurchaseInvoiceDelivery,
  PurchaseInvoiceLine
} from "../../types";

const LineItems = ({
  currencyCode,
  presentationCurrencyFormatter,
  formatter,
  locale,
  purchaseInvoiceLines,
  shouldConvertCurrency,
  attributeValueNames,
  styleVariantByItemId
}: {
  currencyCode: string;
  presentationCurrencyFormatter: Intl.NumberFormat;
  formatter: Intl.NumberFormat;
  locale: string;
  purchaseInvoiceLines: PurchaseInvoiceLine[];
  shouldConvertCurrency: boolean;
  attributeValueNames?: Record<string, string>;
  styleVariantByItemId: Record<string, StyleVariantLineMeta>;
}) => {
  const { t } = useLingui();
  const [items] = useItems();
  const accounts = useAccounts();
  const { invoiceId } = useParams();
  if (!invoiceId) throw new Error("Could not find invoiceId");

  const percentFormatter = usePercentFormatter();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const unitOfMeasures = useUnitOfMeasure();

  const toggleOpen = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const displayGroups = groupLinesForStyleDisplay(
    purchaseInvoiceLines,
    styleVariantByItemId,
    attributeValueNames,
    (line) => Number(line.quantity ?? 0),
    locale
  );

  return (
    <VStack spacing={8} className="w-full overflow-hidden">
      {displayGroups.map((group) => {
        const line = group.kind === "line" ? group.line : group.primaryLine;
        if (!line.id) return null;

        const totalLines =
          group.kind === "style-group" ? group.totalLines : [line];
        const variantDisplay = group.variantDisplay;

        const isGlAccount = line.invoiceLineType === "G/L Account";
        const isFixedAsset = line.invoiceLineType === "Fixed Asset";
        const isIndirect = isGlAccount || isFixedAsset;

        const itemReadableId =
          group.kind === "style-group"
            ? group.parentReadableId
            : isGlAccount
              ? line.description || t`Indirect Expense`
              : isFixedAsset
                ? line.assetReadableId || t`Fixed Asset`
                : (line.itemReadableId ??
                  getItemReadableId(items, line.itemId) ??
                  line.description ??
                  "");

        const itemDescription =
          group.kind === "style-group"
            ? (group.parentName ?? line.description)
            : isGlAccount
              ? (accounts.find((a) => a.id === line.accountId)?.name ??
                t`Indirect Expense`)
              : isFixedAsset
                ? line.description || t`Fixed Asset`
                : line.description;

        const thumbnailPath =
          group.kind === "style-group"
            ? (group.parentThumbnailPath ?? line.thumbnailPath)
            : line.thumbnailPath;

        const quantity = totalLines.reduce(
          (acc, l) => acc + (l.quantity ?? 0),
          0
        );
        const lineTotal = totalLines.reduce(
          (acc, l) => acc + (l.unitPrice ?? 0) * (l.quantity ?? 0),
          0
        );
        const supplierLineTotal = totalLines.reduce(
          (acc, l) => acc + (l.supplierUnitPrice ?? 0) * (l.quantity ?? 0),
          0
        );
        const taxAmount = totalLines.reduce(
          (acc, l) => acc + (l.taxAmount ?? 0),
          0
        );
        const supplierTaxAmount = totalLines.reduce(
          (acc, l) => acc + (l.supplierTaxAmount ?? 0),
          0
        );
        const shippingCost = totalLines.reduce(
          (acc, l) => acc + (l.shippingCost ?? 0),
          0
        );
        const supplierShippingCost = totalLines.reduce(
          (acc, l) => acc + (l.supplierShippingCost ?? 0),
          0
        );
        const total = lineTotal + taxAmount + shippingCost;
        const supplierTotal =
          supplierLineTotal + supplierTaxAmount + supplierShippingCost;
        const unitPrice =
          quantity > 0 ? lineTotal / quantity : (line.unitPrice ?? 0);
        const supplierUnitPrice =
          quantity > 0
            ? supplierLineTotal / quantity
            : (line.supplierUnitPrice ?? 0);

        return (
          <motion.div
            key={group.key}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border-b border-input py-6 w-full"
          >
            <HStack spacing={4} className="items-start">
              {thumbnailPath ? (
                <img
                  alt={itemReadableId ?? ""}
                  className="w-14 h-14 sm:w-24 sm:h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg"
                  src={getPrivateUrl(thumbnailPath)}
                />
              ) : (
                <div className="w-14 h-14 sm:w-24 sm:h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg p-2 sm:p-4">
                  <LuImage className="w-8 h-8 sm:w-16 sm:h-16 text-muted-foreground" />
                </div>
              )}

              <VStack spacing={0} className="w-full min-w-0">
                <div
                  className="flex flex-col cursor-pointer w-full"
                  onClick={() => toggleOpen(group.key)}
                >
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-start justify-between gap-2">
                      <HStack spacing={2} className="flex-wrap min-w-0">
                        <Heading className="text-lg sm:text-xl min-w-0">
                          {itemReadableId}
                        </Heading>
                        <Button
                          asChild
                          variant="link"
                          size="sm"
                          className="text-blue-600 flex-shrink-0"
                        >
                          <Link
                            to={path.to.purchaseInvoiceLine(
                              invoiceId,
                              line.id!
                            )}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1"
                          >
                            <LuPencil />
                            <span className="hidden sm:inline">
                              <Trans>Edit</Trans>
                            </span>
                          </Link>
                        </Button>
                      </HStack>
                      <motion.div
                        className="flex-shrink-0 text-muted-foreground"
                        animate={{
                          rotate: openItems.includes(group.key) ? 90 : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <LuChevronRight size={24} />
                      </motion.div>
                    </div>
                    <span className="text-muted-foreground text-sm sm:text-base truncate">
                      {itemDescription}
                    </span>
                    <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1.5 mt-0.5">
                      <span className="font-bold text-sm sm:text-lg whitespace-nowrap">
                        {formatter.format(total)}
                      </span>
                      {shouldConvertCurrency && (
                        <span className="text-muted-foreground text-xs whitespace-nowrap">
                          {presentationCurrencyFormatter.format(supplierTotal)}
                        </span>
                      )}
                      {!isIndirect && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-2 text-[10px] sm:text-xs"
                        >
                          {quantity}
                          <MethodIcon
                            // @ts-ignore
                            type={line.methodType ?? "Pull from Inventory"}
                          />
                        </Badge>
                      )}
                      <Badge variant="green" className="text-[10px] sm:text-xs">
                        {formatter.format(unitPrice)}{" "}
                        {
                          unitOfMeasures.find(
                            (uom) =>
                              uom.value === line.purchaseUnitOfMeasureCode
                          )?.label
                        }
                      </Badge>
                      {(line.taxPercent ?? 0) > 0 ? (
                        <Badge variant="red" className="text-[10px] sm:text-xs">
                          <Trans>
                            {percentFormatter.format(line.taxPercent ?? 0)} Tax
                          </Trans>
                        </Badge>
                      ) : null}
                      {variantDisplay ? (
                        <VariantChips
                          chips={variantDisplay.chips}
                          className="mt-0"
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </VStack>
            </HStack>

            <motion.div
              initial="collapsed"
              animate={openItems.includes(group.key) ? "open" : "collapsed"}
              variants={{
                open: { opacity: 1, height: "auto", marginTop: 16 },
                collapsed: { opacity: 0, height: 0, marginTop: 0 }
              }}
              transition={{ duration: 0.3 }}
              className="w-full overflow-hidden"
            >
              <div className="w-full">
                <Table>
                  <Tbody>
                    <VariantExpandRows chips={variantDisplay?.chips ?? []} />
                    <Tr>
                      <Td>
                        <Trans>Quantity</Trans>
                      </Td>
                      <Td className="text-right">
                        <VStack spacing={0}>
                          <span>
                            {quantity}{" "}
                            {
                              unitOfMeasures.find(
                                (uom) =>
                                  uom.value === line.purchaseUnitOfMeasureCode
                              )?.label
                            }
                          </span>
                          {line.conversionFactor !== 1 && (
                            <span className="text-muted-foreground text-xs">
                              {quantity * (line.conversionFactor ?? 1)}{" "}
                              {
                                unitOfMeasures.find(
                                  (uom) =>
                                    uom.value ===
                                    line.inventoryUnitOfMeasureCode
                                )?.label
                              }
                            </span>
                          )}
                        </VStack>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Trans>Unit Price</Trans>
                      </Td>
                      <Td className="text-right">
                        <VStack spacing={0}>
                          <span>{formatter.format(unitPrice)}</span>
                          {shouldConvertCurrency && (
                            <span className="text-muted-foreground text-xs">
                              {presentationCurrencyFormatter.format(
                                supplierUnitPrice
                              )}
                            </span>
                          )}
                        </VStack>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Trans>Shipping Cost</Trans>
                      </Td>
                      <Td className="text-right">
                        <VStack spacing={0}>
                          <span>{formatter.format(shippingCost)}</span>
                          {shouldConvertCurrency && (
                            <span className="text-muted-foreground text-xs">
                              {presentationCurrencyFormatter.format(
                                supplierShippingCost
                              )}
                            </span>
                          )}
                        </VStack>
                      </Td>
                    </Tr>
                    <Tr className="border-b border-border">
                      <Td>
                        <Trans>Extended Price</Trans>
                      </Td>
                      <Td className="text-right">
                        <VStack spacing={0}>
                          <span>{formatter.format(lineTotal)}</span>
                          {shouldConvertCurrency && (
                            <span className="text-muted-foreground text-xs">
                              {presentationCurrencyFormatter.format(
                                supplierLineTotal
                              )}
                            </span>
                          )}
                        </VStack>
                      </Td>
                    </Tr>

                    <Tr key="tax" className="border-b border-border">
                      <Td>
                        <Trans>
                          Tax ({percentFormatter.format(line.taxPercent ?? 0)})
                        </Trans>
                      </Td>
                      <Td className="text-right">
                        <VStack spacing={0}>
                          <span>{formatter.format(taxAmount)}</span>
                          {shouldConvertCurrency && (
                            <span className="text-muted-foreground text-xs">
                              {presentationCurrencyFormatter.format(
                                supplierTaxAmount
                              )}
                            </span>
                          )}
                        </VStack>
                      </Td>
                    </Tr>

                    <Tr key="total" className="font-bold">
                      <Td>
                        <Trans>Total</Trans>
                      </Td>
                      <Td className="text-right">
                        <VStack spacing={0}>
                          <span>{formatter.format(total)}</span>
                          {shouldConvertCurrency && (
                            <span className="text-muted-foreground text-xs">
                              {presentationCurrencyFormatter.format(
                                supplierTotal
                              )}
                            </span>
                          )}
                        </VStack>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </VStack>
  );
};
type PurchaseInvoiceSummaryProps = {
  onEditShippingCost: () => void;
};

const PurchaseInvoiceSummary = ({
  onEditShippingCost
}: PurchaseInvoiceSummaryProps) => {
  const { invoiceId } = useParams();
  if (!invoiceId) throw new Error("Could not find invoiceId");
  const { formatDate } = useDateFormatter();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const routeData = useRouteData<{
    purchaseInvoice: PurchaseInvoice;
    purchaseInvoiceLines: PurchaseInvoiceLine[];
    purchaseInvoiceDelivery: PurchaseInvoiceDelivery;
    attributeValueNames?: Record<string, string>;
    styleVariantByItemId?: Record<string, StyleVariantLineMeta>;
  }>(path.to.purchaseInvoice(invoiceId));

  const { locale } = useLocale();
  const { company } = useUser();

  const shouldConvertCurrency =
    routeData?.purchaseInvoice?.currencyCode !== company?.baseCurrencyCode;

  const formatter = useCurrencyFormatter({
    currency: company?.baseCurrencyCode ?? "USD"
  });
  const presentationCurrencyFormatter = useCurrencyFormatter({
    currency: routeData?.purchaseInvoice?.currencyCode ?? "USD"
  });

  const isEditable = !isPurchaseInvoiceLocked(
    routeData?.purchaseInvoice?.status
  );
  const canAddLine =
    isEditable &&
    routeData?.purchaseInvoice?.status === "Draft" &&
    permissions.can("create", "invoicing");

  // Calculate totals
  const subtotal =
    routeData?.purchaseInvoiceLines?.reduce((acc, line) => {
      const lineTotal =
        (line.unitPrice ?? 0) * (line.quantity ?? 0) + (line.shippingCost ?? 0);
      return acc + lineTotal;
    }, 0) ?? 0;

  const supplierSubtotal =
    routeData?.purchaseInvoiceLines?.reduce((acc, line) => {
      const lineTotal =
        (line.supplierUnitPrice ?? 0) * (line.quantity ?? 0) +
        (line.supplierShippingCost ?? 0);
      return acc + lineTotal;
    }, 0) ?? 0;

  const tax =
    routeData?.purchaseInvoiceLines?.reduce((acc, line) => {
      return acc + (line.taxAmount ?? 0);
    }, 0) ?? 0;

  const supplierTax =
    routeData?.purchaseInvoiceLines?.reduce((acc, line) => {
      return acc + (line.supplierTaxAmount ?? 0);
    }, 0) ?? 0;

  const shippingCost =
    (routeData?.purchaseInvoiceDelivery?.supplierShippingCost ?? 0) *
    (routeData?.purchaseInvoice?.exchangeRate ?? 1);

  const supplierShippingCost =
    routeData?.purchaseInvoiceDelivery?.supplierShippingCost ?? 0;

  const total = subtotal + tax + shippingCost;
  const supplierTotal = supplierSubtotal + supplierTax + supplierShippingCost;

  return (
    <Card>
      <CardHeader>
        <HStack className="justify-between items-center">
          <div className="flex flex-col gap-1">
            <CardTitle>{routeData?.purchaseInvoice.invoiceId}</CardTitle>
            <CardDescription>
              <Trans>Purchase Invoice</Trans>
            </CardDescription>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <SupplierAvatar
              supplierId={routeData?.purchaseInvoice.supplierId ?? null}
            />
            {routeData?.purchaseInvoice?.dateDue && (
              <span className="text-muted-foreground text-sm">
                <Trans>
                  Due {formatDate(routeData?.purchaseInvoice.dateDue)}
                </Trans>
              </span>
            )}
          </div>
        </HStack>
      </CardHeader>
      <CardContent>
        <LineItems
          currencyCode={company?.baseCurrencyCode ?? "USD"}
          presentationCurrencyFormatter={presentationCurrencyFormatter}
          formatter={formatter}
          locale={locale}
          purchaseInvoiceLines={routeData?.purchaseInvoiceLines ?? []}
          shouldConvertCurrency={shouldConvertCurrency}
          attributeValueNames={routeData?.attributeValueNames}
          styleVariantByItemId={routeData?.styleVariantByItemId ?? {}}
        />

        {canAddLine && (
          <button
            type="button"
            onClick={() => navigate(path.to.newPurchaseInvoiceLine(invoiceId))}
            className="mt-2 w-full rounded-lg border-2 border-dashed border-input py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary flex items-center justify-center gap-2"
          >
            <LuCirclePlus className="h-4 w-4" />
            <Trans>Add Line Item</Trans>
          </button>
        )}

        <VStack spacing={2} className="mt-8">
          <HStack className="justify-between text-base text-muted-foreground w-full">
            <span>
              <Trans>Subtotal:</Trans>
            </span>
            <VStack spacing={0} className="items-end">
              <span>{formatter.format(subtotal)}</span>
              {shouldConvertCurrency && (
                <span className="text-sm">
                  {presentationCurrencyFormatter.format(supplierSubtotal)}
                </span>
              )}
            </VStack>
          </HStack>

          <HStack className="justify-between text-base text-muted-foreground w-full">
            <span>
              <Trans>Tax:</Trans>
            </span>
            <VStack spacing={0} className="items-end">
              <span>{formatter.format(tax)}</span>
              {shouldConvertCurrency && (
                <span className="text-sm">
                  {presentationCurrencyFormatter.format(supplierTax)}
                </span>
              )}
            </VStack>
          </HStack>

          <HStack className="justify-between text-base text-muted-foreground w-full">
            {shippingCost > 0 ? (
              <>
                <VStack spacing={0}>
                  <span>
                    <Trans>Shipping:</Trans>
                  </span>
                  {isEditable && (
                    <Button
                      variant="link"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={onEditShippingCost}
                    >
                      <Trans>Edit Shipping</Trans>
                    </Button>
                  )}
                </VStack>
                <VStack spacing={0} className="items-end">
                  <span>{formatter.format(shippingCost)}</span>
                  {shouldConvertCurrency && (
                    <span className="text-sm">
                      {presentationCurrencyFormatter.format(
                        supplierShippingCost
                      )}
                    </span>
                  )}
                </VStack>
              </>
            ) : isEditable ? (
              <Button
                variant="link"
                size="sm"
                className="text-muted-foreground"
                onClick={onEditShippingCost}
              >
                <Trans>Add Shipping</Trans>
              </Button>
            ) : null}
          </HStack>

          <HStack className="justify-between text-xl font-bold w-full">
            <span>
              <Trans>Total:</Trans>
            </span>
            <VStack spacing={0} className="items-end">
              <span>{formatter.format(total)}</span>
              {shouldConvertCurrency && (
                <span className="text-sm">
                  {presentationCurrencyFormatter.format(supplierTotal)}
                </span>
              )}
            </VStack>
          </HStack>
        </VStack>
      </CardContent>
    </Card>
  );
};

export default PurchaseInvoiceSummary;
