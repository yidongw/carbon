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
  useDisclosure,
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
  LuPencil,
  LuTrash
} from "react-icons/lu";
import { Link, useParams, useRevalidator } from "react-router";
import { MethodIcon, SupplierAvatar } from "~/components";
import { useAccounts } from "~/components/Form/Account";
import { useUnitOfMeasure } from "~/components/Form/UnitOfMeasure";
import { overlay, useOverlay } from "~/components/Overlay";
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
import { isPurchaseOrderLocked } from "../../purchasing.models";
import type {
  PurchaseOrder,
  PurchaseOrderDelivery,
  PurchaseOrderLine,
  Supplier
} from "../../types";
import DeletePurchaseOrderLine from "./DeletePurchaseOrderLine";

const LineItems = ({
  currencyCode,
  presentationCurrencyFormatter,
  formatter,
  locale,
  lines,
  shouldConvertCurrency,
  attributeValueNames,
  styleVariantByItemId,
  purchaseOrderStatus
}: {
  currencyCode: string;
  presentationCurrencyFormatter: Intl.NumberFormat;
  formatter: Intl.NumberFormat;
  locale: string;
  lines: PurchaseOrderLine[];
  shouldConvertCurrency: boolean;
  attributeValueNames: Record<string, string>;
  styleVariantByItemId: Record<string, StyleVariantLineMeta>;
  purchaseOrderStatus: PurchaseOrder["status"] | null | undefined;
}) => {
  const [items] = useItems();
  const accounts = useAccounts();
  const permissions = usePermissions();
  const { orderId } = useParams();
  if (!orderId) throw new Error("Could not find orderId");

  const { t } = useLingui();
  const percentFormatter = usePercentFormatter();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const unitOfMeasures = useUnitOfMeasure();

  const deleteLineDisclosure = useDisclosure();
  const [deleteLine, setDeleteLine] = useState<PurchaseOrderLine | null>(null);

  const isLocked = isPurchaseOrderLocked(purchaseOrderStatus);
  const isDeleteDisabled = isLocked || purchaseOrderStatus !== "Draft";

  const toggleOpen = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const onDeleteLine = (line: PurchaseOrderLine) => {
    setDeleteLine(line);
    deleteLineDisclosure.onOpen();
  };

  const onDeleteCancel = () => {
    setDeleteLine(null);
    deleteLineDisclosure.onClose();
  };

  const displayGroups = groupLinesForStyleDisplay(
    lines,
    styleVariantByItemId,
    attributeValueNames,
    (line) => Number(line.purchaseQuantity ?? 0),
    locale
  );

  return (
    <VStack spacing={8} className="w-full overflow-hidden">
      {deleteLineDisclosure.isOpen && deleteLine ? (
        <DeletePurchaseOrderLine line={deleteLine} onCancel={onDeleteCancel} />
      ) : null}
      {displayGroups.map((group) => {
        const line = group.kind === "line" ? group.line : group.primaryLine;
        if (!line.id) return null;

        const totalLines =
          group.kind === "style-group" ? group.totalLines : [line];
        const variantDisplay = group.variantDisplay;

        const isGlAccount = line.purchaseOrderLineType === "G/L Account";
        const isFixedAsset = line.purchaseOrderLineType === "Fixed Asset";
        const isIndirect = isGlAccount || isFixedAsset;
        const itemReadableId =
          group.kind === "style-group"
            ? group.parentReadableId
            : isGlAccount
              ? line.description || t`Indirect Expense`
              : isFixedAsset
                ? line.assetReadableId || t`Fixed Asset`
                : (line.itemReadableId ??
                  getItemReadableId(items, line.itemId));
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

        const lineTotal = totalLines.reduce(
          (acc, l) => acc + (l.unitPrice ?? 0) * (l.purchaseQuantity ?? 0),
          0
        );
        const supplierLineTotal = totalLines.reduce(
          (acc, l) =>
            acc + (l.supplierUnitPrice ?? 0) * (l.purchaseQuantity ?? 0),
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
        const purchaseQuantity = totalLines.reduce(
          (acc, l) => acc + (l.purchaseQuantity ?? 0),
          0
        );
        const total = lineTotal + taxAmount + shippingCost;
        const supplierTotal =
          supplierLineTotal + supplierTaxAmount + supplierShippingCost;
        // Unit price for badge: weighted average when grouped.
        const unitPrice =
          purchaseQuantity > 0
            ? lineTotal / purchaseQuantity
            : (line.unitPrice ?? 0);

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
                  alt={itemReadableId!}
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
                          className="text-blue-600 flex-shrink-0"
                        >
                          <Link
                            to={path.to.purchaseOrderLine(orderId, line.id!)}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1"
                          >
                            <LuPencil />
                            <Trans>Edit</Trans>
                          </Link>
                        </Button>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-destructive flex-shrink-0"
                          isDisabled={
                            isDeleteDisabled ||
                            !permissions.can("delete", "purchasing") ||
                            group.kind === "style-group"
                          }
                          leftIcon={<LuTrash />}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteLine(line);
                          }}
                        >
                          <Trans>Delete</Trans>
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
                                supplierTotal
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
                        {!isIndirect && (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            {purchaseQuantity}
                            <MethodIcon
                              // @ts-ignore
                              type={line.methodType ?? "Pull from Inventory"}
                            />
                          </Badge>
                        )}
                        <Badge variant="green">
                          {formatter.format(unitPrice)}{" "}
                          {
                            unitOfMeasures.find(
                              (uom) =>
                                uom.value === line.purchaseUnitOfMeasureCode
                            )?.label
                          }
                        </Badge>
                        {(line.taxPercent ?? 0) > 0 ? (
                          <Badge variant="red">
                            {percentFormatter.format(line.taxPercent ?? 0)} Tax
                          </Badge>
                        ) : null}
                      </div>
                    </VStack>
                  </div>
                </div>

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
                  <div className="w-full space-y-4">
                    <Table>
                      <Tbody>
                        <VariantExpandRows
                          chips={variantDisplay?.chips ?? []}
                        />
                        <Tr>
                          <Td className="whitespace-nowrap">
                            <Trans>Quantity</Trans>
                          </Td>
                          <Td className="text-right">
                            <VStack spacing={0} className="items-end">
                              <span>
                                {purchaseQuantity}{" "}
                                {
                                  unitOfMeasures.find(
                                    (uom) =>
                                      uom.value ===
                                      line.purchaseUnitOfMeasureCode
                                  )?.label
                                }
                              </span>
                            </VStack>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td className="whitespace-nowrap">
                            <Trans>Unit Price</Trans>
                          </Td>
                          <Td className="text-right">
                            <VStack spacing={0} className="items-end">
                              <span>{formatter.format(unitPrice)}</span>
                              {shouldConvertCurrency && (
                                <span className="text-muted-foreground text-xs">
                                  {presentationCurrencyFormatter.format(
                                    purchaseQuantity > 0
                                      ? supplierLineTotal / purchaseQuantity
                                      : (line.supplierUnitPrice ?? 0)
                                  )}
                                </span>
                              )}
                            </VStack>
                          </Td>
                        </Tr>
                        <Tr className="border-b border-border">
                          <Td className="whitespace-nowrap">
                            <Trans>Extended Price</Trans>
                          </Td>
                          <Td className="text-right">
                            <VStack spacing={0} className="items-end">
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

                        <Tr key="tax">
                          <Td className="whitespace-nowrap">
                            <Trans>
                              Tax (
                              {percentFormatter.format(line.taxPercent ?? 0)})
                            </Trans>
                          </Td>
                          <Td className="text-right">
                            <VStack spacing={0} className="items-end">
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

                        <Tr key="shipping" className="border-b border-border">
                          <Td className="whitespace-nowrap">
                            <Trans>Shipping</Trans>
                          </Td>
                          <Td className="text-right">
                            <VStack spacing={0} className="items-end">
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

                        <Tr key="total" className="font-bold">
                          <Td className="whitespace-nowrap">
                            <Trans>Total</Trans>
                          </Td>
                          <Td className="text-right">
                            <VStack spacing={0} className="items-end">
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
              </VStack>
            </HStack>
          </motion.div>
        );
      })}
    </VStack>
  );
};

type PurchaseOrderSummaryProps = {
  onEditShippingCost: () => void;
};

const PurchaseOrderSummary = ({
  onEditShippingCost
}: PurchaseOrderSummaryProps) => {
  const { orderId } = useParams();
  if (!orderId) throw new Error("Could not find orderId");
  const { formatDate } = useDateFormatter();

  const { company } = useUser();
  const permissions = usePermissions();
  const { openOverlay } = useOverlay();
  const revalidator = useRevalidator();
  const routeData = useRouteData<{
    purchaseOrder: PurchaseOrder;
    lines: PurchaseOrderLine[];
    purchaseOrderDelivery: PurchaseOrderDelivery;
    supplier: Supplier;
    attributeValueNames?: Record<string, string>;
    styleVariantByItemId?: Record<string, StyleVariantLineMeta>;
  }>(path.to.purchaseOrder(orderId));

  const isEditable = !isPurchaseOrderLocked(routeData?.purchaseOrder?.status);
  const canAddLine =
    isEditable &&
    routeData?.purchaseOrder?.status === "Draft" &&
    permissions.can("update", "purchasing");

  const onAddLine = () =>
    openOverlay(overlay.to.newPurchaseOrderLine({ orderId }), {
      onCreated: () => revalidator.revalidate()
    });

  const { locale } = useLocale();
  const formatter = useCurrencyFormatter();
  const presentationCurrencyFormatter = useCurrencyFormatter({
    currency:
      routeData?.purchaseOrder?.currencyCode ??
      company?.baseCurrencyCode ??
      "USD"
  });

  const shouldConvertCurrency =
    routeData?.purchaseOrder?.currencyCode !== company?.baseCurrencyCode;

  // Calculate totals
  const subtotal =
    routeData?.lines?.reduce((acc, line) => {
      const lineTotal =
        (line.unitPrice ?? 0) * (line.purchaseQuantity ?? 0) +
        (line.shippingCost ?? 0);

      return acc + lineTotal;
    }, 0) ?? 0;

  const supplierSubtotal =
    routeData?.lines?.reduce((acc, line) => {
      const lineTotal =
        (line.supplierUnitPrice ?? 0) * (line.purchaseQuantity ?? 0) +
        (line.supplierShippingCost ?? 0);

      return acc + lineTotal;
    }, 0) ?? 0;

  const tax =
    routeData?.lines?.reduce((acc, line) => {
      return acc + (line.taxAmount ?? 0);
    }, 0) ?? 0;

  const supplierTax =
    routeData?.lines?.reduce((acc, line) => {
      return acc + (line.supplierTaxAmount ?? 0);
    }, 0) ?? 0;

  const shippingCost =
    (routeData?.purchaseOrderDelivery?.supplierShippingCost ?? 0) *
    (routeData?.purchaseOrder?.exchangeRate ?? 1);

  const supplierShippingCost =
    routeData?.purchaseOrderDelivery?.supplierShippingCost ?? 0;

  const total = subtotal + tax + shippingCost;
  const supplierTotal = supplierSubtotal + supplierTax + supplierShippingCost;

  return (
    <>
      <Card>
        <CardHeader>
          <HStack className="justify-between items-center">
            <div className="flex flex-col gap-1">
              <CardTitle>{routeData?.purchaseOrder.purchaseOrderId}</CardTitle>
              <CardDescription>
                <Trans>Purchase Order</Trans>
              </CardDescription>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <SupplierAvatar
                supplierId={routeData?.purchaseOrder.supplierId ?? null}
              />
              {routeData?.purchaseOrder?.orderDate && (
                <span className="text-muted-foreground text-sm">
                  <Trans>
                    Ordered {formatDate(routeData?.purchaseOrder.orderDate)}
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
            lines={routeData?.lines ?? []}
            shouldConvertCurrency={shouldConvertCurrency}
            attributeValueNames={routeData?.attributeValueNames ?? {}}
            styleVariantByItemId={routeData?.styleVariantByItemId ?? {}}
            purchaseOrderStatus={routeData?.purchaseOrder?.status}
          />

          {canAddLine && (
            <button
              type="button"
              onClick={onAddLine}
              className="mt-2 w-full rounded-lg border-2 border-dashed border-input py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary flex items-center justify-center gap-2"
            >
              <LuCirclePlus className="h-4 w-4" />
              <Trans>Add Line Item</Trans>
            </button>
          )}

          <VStack spacing={2} className="mt-8">
            <HStack className="justify-between text-base text-muted-foreground w-full">
              <span className="whitespace-nowrap">
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
              <span className="whitespace-nowrap">
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
                    <span className="whitespace-nowrap">
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
              <span className="whitespace-nowrap">
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
    </>
  );
};

export default PurchaseOrderSummary;
