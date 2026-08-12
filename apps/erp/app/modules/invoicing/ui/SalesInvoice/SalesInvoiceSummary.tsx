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
import { Trans } from "@lingui/react/macro";
import { useLocale } from "@react-aria/i18n";
import { motion } from "framer-motion";
import { useState } from "react";
import { LuChevronRight, LuCirclePlus, LuImage } from "react-icons/lu";
import { Link, useNavigate, useParams } from "react-router";
import { CustomerAvatar, MethodIcon } from "~/components";
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
import { isSalesInvoiceLocked } from "../../invoicing.models";
import type {
  SalesInvoice,
  SalesInvoiceLine,
  SalesInvoiceShipment
} from "../../types";

const LineItems = ({
  currencyCode,
  presentationCurrencyFormatter,
  formatter,
  locale,
  salesInvoiceLines,
  shouldConvertCurrency,
  attributeValueNames,
  styleVariantByItemId
}: {
  currencyCode: string;
  presentationCurrencyFormatter: Intl.NumberFormat;
  formatter: Intl.NumberFormat;
  locale: string;
  salesInvoiceLines: SalesInvoiceLine[];
  shouldConvertCurrency: boolean;
  attributeValueNames?: Record<string, string>;
  styleVariantByItemId: Record<string, StyleVariantLineMeta>;
}) => {
  const { invoiceId } = useParams();
  if (!invoiceId) throw new Error("Could not find invoiceId");

  const [items] = useItems();
  const percentFormatter = usePercentFormatter();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const unitOfMeasures = useUnitOfMeasure();

  const toggleOpen = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const displayGroups = groupLinesForStyleDisplay(
    salesInvoiceLines,
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

        const itemReadableId =
          group.kind === "style-group"
            ? group.parentReadableId
            : line.invoiceLineType === "Fixed Asset"
              ? (line as { assetReadableId?: string }).assetReadableId ||
                "Fixed Asset"
              : (line.itemReadableId ??
                getItemReadableId(items, line.itemId) ??
                line.description ??
                "");
        const itemDescription =
          group.kind === "style-group"
            ? (group.parentName ?? line.description)
            : line.description;
        const thumbnailPath =
          group.kind === "style-group"
            ? (group.parentThumbnailPath ?? line.thumbnailPath)
            : line.thumbnailPath;

        const quantity = totalLines.reduce(
          (acc, l) => acc + (l.quantity ?? 0),
          0
        );
        const lineSubtotal = totalLines.reduce(
          (acc, l) => acc + (l.unitPrice ?? 0) * (l.quantity ?? 0),
          0
        );
        const customerSubtotal = totalLines.reduce(
          (acc, l) => acc + (l.convertedUnitPrice ?? 0) * (l.quantity ?? 0),
          0
        );
        const addOnCost = totalLines.reduce(
          (acc, l) => acc + (l.addOnCost ?? 0),
          0
        );
        const convertedAddOnCost = totalLines.reduce(
          (acc, l) => acc + (l.convertedAddOnCost ?? 0),
          0
        );
        const shippingCost = totalLines.reduce(
          (acc, l) => acc + (l.shippingCost ?? 0),
          0
        );
        const convertedShippingCost = totalLines.reduce(
          (acc, l) => acc + (l.convertedShippingCost ?? 0),
          0
        );
        const nonTaxableAddOnCost = totalLines.reduce(
          (acc, l) => acc + (l.nonTaxableAddOnCost ?? 0),
          0
        );
        const convertedNonTaxableAddOnCost = totalLines.reduce(
          (acc, l) => acc + (l.convertedNonTaxableAddOnCost ?? 0),
          0
        );
        const total =
          (lineSubtotal + addOnCost + shippingCost) *
            (1 + (line.taxPercent ?? 0)) +
          nonTaxableAddOnCost;
        const customerTotal =
          (customerSubtotal + convertedAddOnCost + convertedShippingCost) *
            (1 + (line.taxPercent ?? 0)) +
          convertedNonTaxableAddOnCost;

        const lineTaxAmount =
          (line.taxPercent ?? 0) * (lineSubtotal + addOnCost + shippingCost);
        const customerLineTaxAmount =
          (line.taxPercent ?? 0) *
          (customerSubtotal + convertedAddOnCost + convertedShippingCost);
        const unitPrice =
          quantity > 0 ? lineSubtotal / quantity : (line.unitPrice ?? 0);
        const convertedUnitPrice =
          quantity > 0
            ? customerSubtotal / quantity
            : (line.convertedUnitPrice ?? 0);

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
                  className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg"
                  src={getPrivateUrl(thumbnailPath)}
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg p-4">
                  <LuImage className="w-16 h-16 text-muted-foreground" />
                </div>
              )}

              <VStack spacing={0} className="w-full">
                <div
                  className="flex flex-col cursor-pointer w-full"
                  onClick={() => toggleOpen(group.key)}
                >
                  <div className="flex items-center justify-between w-full">
                    <VStack
                      spacing={0}
                      className="flex-shrink-0 min-w-0 w-auto"
                    >
                      <HStack
                        spacing={2}
                        className="flex min-w-0 flex-shrink-0"
                      >
                        <Heading className="truncate">{itemReadableId}</Heading>
                        <Button
                          asChild
                          variant="link"
                          size="sm"
                          className="text-muted-foreground flex-shrink-0"
                        >
                          <Link
                            to={path.to.salesInvoiceLine(invoiceId, line.id!)}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trans>Edit</Trans>
                          </Link>
                        </Button>
                      </HStack>
                      <span className="text-muted-foreground text-base truncate">
                        {itemDescription}
                      </span>
                      {variantDisplay ? (
                        <VariantChips chips={variantDisplay.chips} />
                      ) : null}
                    </VStack>
                    <VStack
                      spacing={2}
                      className="flex-shrink-0 items-end w-auto"
                    >
                      <HStack spacing={4}>
                        <VStack spacing={0}>
                          <span className="font-bold text-xl whitespace-nowrap">
                            {formatter.format(total)}
                          </span>
                          {shouldConvertCurrency && (
                            <span className="text-muted-foreground text-sm">
                              {presentationCurrencyFormatter.format(
                                customerTotal
                              )}
                            </span>
                          )}
                        </VStack>
                        <motion.div
                          animate={{
                            rotate: openItems.includes(group.key) ? 90 : 0
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <LuChevronRight size={24} />
                        </motion.div>
                      </HStack>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          {quantity}
                          {line.invoiceLineType !== "Fixed Asset" && (
                            <MethodIcon
                              type={line.methodType ?? "Pull from Inventory"}
                            />
                          )}
                        </Badge>
                        <Badge variant="green">
                          {formatter.format(unitPrice)}{" "}
                          {
                            unitOfMeasures.find(
                              (uom) => uom.value === line.unitOfMeasureCode
                            )?.label
                          }
                        </Badge>
                        {(line.taxPercent ?? 0) > 0 ? (
                          <Badge variant="red">
                            <Trans>
                              {percentFormatter.format(line.taxPercent ?? 0)}{" "}
                              Tax
                            </Trans>
                          </Badge>
                        ) : null}
                      </div>
                    </VStack>
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
                                (uom) => uom.value === line.unitOfMeasureCode
                              )?.label
                            }
                          </span>
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
                                convertedUnitPrice
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
                                convertedShippingCost
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
                          <span>{formatter.format(lineSubtotal)}</span>
                          {shouldConvertCurrency && (
                            <span className="text-muted-foreground text-xs">
                              {presentationCurrencyFormatter.format(
                                customerSubtotal
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
                          <span>{formatter.format(lineTaxAmount)}</span>
                          {shouldConvertCurrency && (
                            <span className="text-muted-foreground text-xs">
                              {presentationCurrencyFormatter.format(
                                customerLineTaxAmount
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
                                customerTotal
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
type SalesInvoiceSummaryProps = {
  onEditShippingCost: () => void;
};

const SalesInvoiceSummary = ({
  onEditShippingCost
}: SalesInvoiceSummaryProps) => {
  const { invoiceId } = useParams();
  if (!invoiceId) throw new Error("Could not find invoiceId");
  const { formatDate } = useDateFormatter();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const routeData = useRouteData<{
    salesInvoice: SalesInvoice;
    salesInvoiceLines: SalesInvoiceLine[];
    salesInvoiceShipment: SalesInvoiceShipment;
    attributeValueNames?: Record<string, string>;
    styleVariantByItemId?: Record<string, StyleVariantLineMeta>;
  }>(path.to.salesInvoice(invoiceId));

  const { locale } = useLocale();
  const { company } = useUser();

  const shouldConvertCurrency =
    routeData?.salesInvoice?.currencyCode !== company?.baseCurrencyCode;

  const formatter = useCurrencyFormatter({
    currency: company?.baseCurrencyCode ?? "USD"
  });
  const presentationCurrencyFormatter = useCurrencyFormatter({
    currency: routeData?.salesInvoice?.currencyCode ?? "USD"
  });

  const isEditable = !isSalesInvoiceLocked(routeData?.salesInvoice?.status);
  const canAddLine =
    isEditable &&
    routeData?.salesInvoice?.status === "Draft" &&
    permissions.can("create", "invoicing");

  // Calculate totals
  const subtotal =
    routeData?.salesInvoiceLines?.reduce((acc, line) => {
      const lineSubtotal =
        (line.unitPrice ?? 0) * (line.quantity ?? 0) +
        (line.shippingCost ?? 0) +
        (line.addOnCost ?? 0) +
        (line.nonTaxableAddOnCost ?? 0);
      return acc + lineSubtotal;
    }, 0) ?? 0;

  const customerSubtotal =
    routeData?.salesInvoiceLines?.reduce((acc, line) => {
      const lineSubtotal =
        (line.convertedUnitPrice ?? 0) * (line.quantity ?? 0) +
        (line.convertedShippingCost ?? 0) +
        (line.convertedAddOnCost ?? 0) +
        (line.convertedNonTaxableAddOnCost ?? 0);

      return acc + lineSubtotal;
    }, 0) ?? 0;

  const tax =
    routeData?.salesInvoiceLines?.reduce((acc, line) => {
      const lineTaxAmount =
        (line.taxPercent ?? 0) *
        ((line.unitPrice ?? 0) * (line.quantity ?? 0) +
          (line.shippingCost ?? 0) +
          (line.addOnCost ?? 0));
      return acc + lineTaxAmount;
    }, 0) ?? 0;

  const customerTax =
    routeData?.salesInvoiceLines?.reduce((acc, line) => {
      const lineTaxAmount =
        (line.taxPercent ?? 0) *
        ((line.convertedUnitPrice ?? 0) * (line.quantity ?? 0) +
          (line.convertedShippingCost ?? 0) +
          (line.convertedAddOnCost ?? 0));
      return acc + lineTaxAmount;
    }, 0) ?? 0;

  const shippingCost =
    (routeData?.salesInvoiceShipment?.shippingCost ?? 0) *
    (routeData?.salesInvoice?.exchangeRate ?? 1);

  const customerShippingCost =
    (routeData?.salesInvoiceShipment?.shippingCost ?? 0) *
    (routeData?.salesInvoice?.exchangeRate ?? 1);

  const total = subtotal + tax + shippingCost;
  const customerTotal = customerSubtotal + customerTax + customerShippingCost;

  return (
    <Card>
      <CardHeader>
        <HStack className="justify-between items-center">
          <div className="flex flex-col gap-1">
            <CardTitle>{routeData?.salesInvoice.invoiceId}</CardTitle>
            <CardDescription>
              <Trans>Sales Invoice</Trans>
            </CardDescription>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <CustomerAvatar
              customerId={routeData?.salesInvoice.customerId ?? null}
            />
            {routeData?.salesInvoice?.dateDue && (
              <span className="text-muted-foreground text-sm">
                <Trans>Due {formatDate(routeData?.salesInvoice.dateDue)}</Trans>
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
          salesInvoiceLines={routeData?.salesInvoiceLines ?? []}
          shouldConvertCurrency={shouldConvertCurrency}
          attributeValueNames={routeData?.attributeValueNames}
          styleVariantByItemId={routeData?.styleVariantByItemId ?? {}}
        />

        {canAddLine && (
          <button
            type="button"
            onClick={() => navigate(path.to.newSalesInvoiceLine(invoiceId))}
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
                  {presentationCurrencyFormatter.format(customerSubtotal)}
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
                  {presentationCurrencyFormatter.format(customerTax)}
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
                        customerShippingCost
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
                  {presentationCurrencyFormatter.format(customerTotal)}
                </span>
              )}
            </VStack>
          </HStack>
        </VStack>
      </CardContent>
    </Card>
  );
};

export default SalesInvoiceSummary;
