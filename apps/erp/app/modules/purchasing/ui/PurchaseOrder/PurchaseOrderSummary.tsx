import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Heading,
  HStack,
  IconButton,
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
  LuEllipsisVertical,
  LuImage,
  LuTrash
} from "react-icons/lu";
import { Link, useParams } from "react-router";
import { MethodIcon, MethodItemTypeIcon, SupplierAvatar } from "~/components";
import { useAccounts } from "~/components/Form/Account";
import { useUnitOfMeasure } from "~/components/Form/UnitOfMeasure";
import {
  useCurrencyFormatter,
  useDateFormatter,
  usePercentFormatter,
  usePermissions,
  useRouteData,
  useUser
} from "~/hooks";
import { getLinkToItemDetails } from "~/modules/items/ui/Item/ItemForm";
import type { MethodItemType } from "~/modules/shared";
import { methodItemType } from "~/modules/shared";
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
import PurchaseOrderLineForm from "./PurchaseOrderLineForm";

const LineItems = ({
  currencyCode,
  presentationCurrencyFormatter,
  formatter,
  locale,
  lines,
  shouldConvertCurrency,
  isDisabled,
  onDelete,
  onEdit
}: {
  currencyCode: string;
  presentationCurrencyFormatter: Intl.NumberFormat;
  formatter: Intl.NumberFormat;
  locale: string;
  lines: PurchaseOrderLine[];
  shouldConvertCurrency: boolean;
  isDisabled: boolean;
  onDelete: (line: PurchaseOrderLine) => void;
  onEdit: (line: PurchaseOrderLine) => void;
}) => {
  const [items] = useItems();
  const accounts = useAccounts();
  const { orderId } = useParams();
  if (!orderId) throw new Error("Could not find orderId");

  const { t } = useLingui();
  const permissions = usePermissions();
  const percentFormatter = usePercentFormatter();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const unitOfMeasures = useUnitOfMeasure();

  const toggleOpen = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <VStack spacing={8} className="w-full overflow-hidden">
      {lines.map((line) => {
        if (!line.id) return null;

        const isGlAccount = line.purchaseOrderLineType === "G/L Account";
        const itemReadableId = isGlAccount
          ? line.description || t`Indirect Expense`
          : getItemReadableId(items, line.itemId);
        const lineTotal = (line.unitPrice ?? 0) * (line.purchaseQuantity ?? 0);
        const supplierLineTotal =
          (line.supplierUnitPrice ?? 0) * (line.purchaseQuantity ?? 0);
        const total =
          lineTotal + (line.taxAmount ?? 0) + (line.shippingCost ?? 0);
        const supplierTotal =
          supplierLineTotal +
          (line.supplierTaxAmount ?? 0) +
          (line.supplierShippingCost ?? 0);

        return (
          <motion.div
            key={line.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border-b border-input py-3 w-full"
          >
            <HStack spacing={4} className="items-start">
              {line.thumbnailPath ? (
                <img
                  alt={itemReadableId!}
                  className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg"
                  src={getPrivateUrl(line.thumbnailPath)}
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg p-4">
                  <LuImage className="w-16 h-16 text-muted-foreground" />
                </div>
              )}

              <VStack spacing={0} className="w-full">
                <div
                  className="flex flex-col cursor-pointer w-full"
                  onClick={() => toggleOpen(line.id!)}
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
                          variant="link"
                          size="sm"
                          className="text-muted-foreground flex-shrink-0"
                          onClick={(e) => { e.stopPropagation(); onEdit(line); }}
                        >
                          <Trans>Edit</Trans>
                        </Button>
                        {!isDisabled && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <IconButton
                                aria-label={t`More`}
                                icon={<LuEllipsisVertical />}
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground flex-shrink-0"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                destructive
                                disabled={
                                  !permissions.can("delete", "purchasing")
                                }
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(line);
                                }}
                              >
                                <DropdownMenuIcon icon={<LuTrash />} />
                                <Trans>Delete Line</Trans>
                              </DropdownMenuItem>
                              {/* @ts-expect-error */}
                              {methodItemType.includes(
                                line?.purchaseOrderLineType ?? ""
                              ) && (
                                <DropdownMenuItem asChild>
                                  <Link
                                    to={getLinkToItemDetails(
                                      line.purchaseOrderLineType as MethodItemType,
                                      line.itemId!
                                    )}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <DropdownMenuIcon
                                      icon={
                                        <MethodItemTypeIcon type={"Part"} />
                                      }
                                    />
                                    <Trans>View Item Master</Trans>
                                  </Link>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </HStack>
                      <span className="text-muted-foreground text-base truncate">
                        {isGlAccount
                          ? (accounts.find((a) => a.id === line.accountId)
                              ?.name ?? t`Indirect Expense`)
                          : line.description}
                      </span>
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
                            rotate: openItems.includes(line.id) ? 90 : 0
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <LuChevronRight size={24} />
                        </motion.div>
                      </HStack>
                      <div className="flex items-center gap-2">
                        {!isGlAccount && (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            {line.purchaseQuantity}
                            <MethodIcon
                              // @ts-ignore
                              type={line.methodType ?? "Pull from Inventory"}
                            />
                          </Badge>
                        )}
                        <Badge variant="green">
                          {formatter.format(line.unitPrice ?? 0)}{" "}
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
              </VStack>
            </HStack>

            <motion.div
              initial="collapsed"
              animate={openItems.includes(line.id) ? "open" : "collapsed"}
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
                    <Tr>
                      <Td><Trans>Quantity</Trans></Td>
                      <Td className="text-right">
                        <VStack spacing={0}>
                          <span>
                            {line.purchaseQuantity}{" "}
                            {
                              unitOfMeasures.find(
                                (uom) =>
                                  uom.value === line.purchaseUnitOfMeasureCode
                              )?.label
                            }
                          </span>
                          {line.conversionFactor !== 1 && (
                            <span className="text-muted-foreground text-xs">
                              {(line.purchaseQuantity ?? 0) *
                                (line.conversionFactor ?? 1)}{" "}
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
                      <Td><Trans>Unit Price</Trans></Td>
                      <Td className="text-right">
                        <VStack spacing={0}>
                          <span>{formatter.format(line.unitPrice ?? 0)}</span>
                          {shouldConvertCurrency && (
                            <span className="text-muted-foreground text-xs">
                              {presentationCurrencyFormatter.format(
                                line.supplierUnitPrice ?? 0
                              )}
                            </span>
                          )}
                        </VStack>
                      </Td>
                    </Tr>
                    <Tr className="border-b border-border">
                      <Td><Trans>Extended Price</Trans></Td>
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

                    <Tr key="tax">
                      <Td>
                        <Trans>Tax ({percentFormatter.format(line.taxPercent ?? 0)})</Trans>
                      </Td>
                      <Td className="text-right">
                        <VStack spacing={0}>
                          <span>{formatter.format(line.taxAmount ?? 0)}</span>
                          {shouldConvertCurrency && (
                            <span className="text-muted-foreground text-xs">
                              {presentationCurrencyFormatter.format(
                                line.supplierTaxAmount ?? 0
                              )}
                            </span>
                          )}
                        </VStack>
                      </Td>
                    </Tr>

                    <Tr key="shipping" className="border-b border-border">
                      <Td><Trans>Shipping</Trans></Td>
                      <Td className="text-right">
                        <VStack spacing={0}>
                          <span>
                            {formatter.format(line.shippingCost ?? 0)}
                          </span>
                          {shouldConvertCurrency && (
                            <span className="text-muted-foreground text-xs">
                              {presentationCurrencyFormatter.format(
                                line.supplierShippingCost ?? 0
                              )}
                            </span>
                          )}
                        </VStack>
                      </Td>
                    </Tr>

                    <Tr key="total" className="font-bold">
                      <Td><Trans>Total</Trans></Td>
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

type PurchaseOrderSummaryProps = {
  onEditShippingCost: () => void;
};

const PurchaseOrderSummary = ({
  onEditShippingCost
}: PurchaseOrderSummaryProps) => {
  const { orderId } = useParams();
  if (!orderId) throw new Error("Could not find orderId");
  const { formatDate } = useDateFormatter();

  const { company, defaults } = useUser();
  const permissions = usePermissions();
  const routeData = useRouteData<{
    purchaseOrder: PurchaseOrder;
    lines: PurchaseOrderLine[];
    purchaseOrderDelivery: PurchaseOrderDelivery;
    supplier: Supplier;
  }>(path.to.purchaseOrder(orderId));

  const newPurchaseOrderLineDisclosure = useDisclosure();
  const deleteLineDisclosure = useDisclosure();
  const editLineDisclosure = useDisclosure();
  const [deleteLine, setDeleteLine] = useState<PurchaseOrderLine | null>(null);
  const [editLine, setEditLine] = useState<PurchaseOrderLine | null>(null);

  const isLocked = isPurchaseOrderLocked(routeData?.purchaseOrder?.status);
  const isEditable = !isLocked;
  const isDisabled = isLocked
    ? true
    : routeData?.purchaseOrder?.status !== "Draft";

  const purchaseOrderLineInitialValues = {
    purchaseOrderId: orderId,
    purchaseOrderLineType: "Item" as MethodItemType,
    purchaseQuantity: 1,
    supplierUnitPrice: 0,
    locationId:
      routeData?.purchaseOrder?.locationId ?? defaults?.locationId ?? "",
    supplierTaxAmount: 0,
    supplierShippingCost: 0,
    exchangeRate: routeData?.purchaseOrder?.exchangeRate ?? 1
  };

  const onDeleteLine = (line: PurchaseOrderLine) => {
    setDeleteLine(line);
    deleteLineDisclosure.onOpen();
  };

  const onDeleteCancel = () => {
    setDeleteLine(null);
    deleteLineDisclosure.onClose();
  };

  const onEditLine = (line: PurchaseOrderLine) => {
    setEditLine(line);
    editLineDisclosure.onOpen();
  };

  const onEditClose = () => {
    setEditLine(null);
    editLineDisclosure.onClose();
  };

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
                  <Trans>Ordered {formatDate(routeData?.purchaseOrder.orderDate)}</Trans>
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
            isDisabled={isDisabled}
            onDelete={onDeleteLine}
            onEdit={onEditLine}
          />

          {!isDisabled && permissions.can("update", "purchasing") && (
            <button
              type="button"
              onClick={newPurchaseOrderLineDisclosure.onOpen}
              className="mt-2 w-full rounded-lg border-2 border-dashed border-input py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary flex items-center justify-center gap-2"
            >
              <LuCirclePlus className="h-4 w-4" />
              <Trans>Add Line Item</Trans>
            </button>
          )}

          <VStack spacing={2} className="mt-8">
            <HStack className="justify-between text-base text-muted-foreground w-full">
              <span className="whitespace-nowrap"><Trans>Subtotal:</Trans></span>
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
              <span className="whitespace-nowrap"><Trans>Tax:</Trans></span>
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
                    <span className="whitespace-nowrap"><Trans>Shipping:</Trans></span>
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
              <span className="whitespace-nowrap"><Trans>Total:</Trans></span>
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
      {newPurchaseOrderLineDisclosure.isOpen && (
        <PurchaseOrderLineForm
          initialValues={purchaseOrderLineInitialValues}
          type="modal"
          onClose={newPurchaseOrderLineDisclosure.onClose}
        />
      )}
      {deleteLineDisclosure.isOpen && (
        <DeletePurchaseOrderLine line={deleteLine!} onCancel={onDeleteCancel} />
      )}
      {editLineDisclosure.isOpen && editLine && (
        <PurchaseOrderLineForm
          initialValues={{
            id: editLine.id!,
            purchaseOrderId: editLine.purchaseOrderId!,
            purchaseOrderLineType: editLine.purchaseOrderLineType!,
            itemId: editLine.itemId ?? undefined,
            accountId: editLine.accountId ?? undefined,
            costCenterId: editLine.costCenterId ?? undefined,
            conversionFactor: editLine.conversionFactor ?? undefined,
            description: editLine.description ?? undefined,
            exchangeRate: editLine.exchangeRate ?? undefined,
            inventoryUnitOfMeasureCode:
              editLine.inventoryUnitOfMeasureCode ?? undefined,
            locationId: editLine.locationId ?? undefined,
            purchaseQuantity: editLine.purchaseQuantity ?? undefined,
            purchaseUnitOfMeasureCode:
              editLine.purchaseUnitOfMeasureCode ?? undefined,
            requiredDate: editLine.requiredDate ?? undefined,
            storageUnitId: editLine.storageUnitId ?? undefined,
            supplierShippingCost: editLine.supplierShippingCost ?? undefined,
            supplierTaxAmount: editLine.supplierTaxAmount ?? undefined,
            supplierUnitPrice: editLine.supplierUnitPrice ?? undefined
          }}
          type="modal"
          onClose={onEditClose}
        />
      )}
    </>
  );
};

export default PurchaseOrderSummary;
