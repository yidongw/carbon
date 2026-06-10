import {
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
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack
} from "@carbon/react";
import { getItemReadableId } from "@carbon/utils";
import { Trans, useLingui } from "@lingui/react/macro";
import { useLocale } from "@react-aria/i18n";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { LuChevronRight, LuCirclePlus, LuImage } from "react-icons/lu";
import { useParams } from "react-router";
import { SupplierAvatar } from "~/components";
import { useAccounts } from "~/components/Form/Account";
import { useUnitOfMeasure } from "~/components/Form/UnitOfMeasure";
import {
  useCurrencyFormatter,
  useDateFormatter,
  usePermissions,
  useRouteData,
  useUser
} from "~/hooks";
import { useItems } from "~/stores";
import { getPrivateUrl, path } from "~/utils/path";
import { isSupplierQuoteLocked } from "../../purchasing.models";
import type {
  PurchaseOrderLine,
  SupplierQuote,
  SupplierQuoteLine,
  SupplierQuoteLinePrice
} from "../../types";
import DeleteSupplierQuoteLine from "./DeleteSupplierQuoteLine";
import SupplierQuoteLineForm from "./SupplierQuoteLineForm";

const LineItems = ({
  currencyCode,
  formatter,
  locale,
  onEdit
}: {
  currencyCode: string;
  formatter: Intl.NumberFormat;
  locale: string;
  onEdit: (line: SupplierQuoteLine) => void;
}) => {
  const { t } = useLingui();
  const { company } = useUser();
  const accounts = useAccounts();
  const { id } = useParams();
  if (!id) throw new Error("Could not find quote id");

  const [items] = useItems();
  const routeData = useRouteData<{
    quote: SupplierQuote;
    lines: SupplierQuoteLine[];
    prices: SupplierQuoteLinePrice[];
  }>(path.to.supplierQuote(id));

  const [openItems, setOpenItems] = useState<string[]>(
    routeData?.lines.map((line) => line.id!) ?? []
  );

  const pricingByLine = useMemo(
    () =>
      routeData?.lines?.reduce<Record<string, SupplierQuoteLinePrice[]>>(
        (acc, line) => {
          if (!line.id) {
            return acc;
          }
          acc[line.id!] =
            routeData?.prices?.filter(
              (p) => p.supplierQuoteLineId === line.id
            ) ?? [];
          return acc;
        },
        {}
      ) ?? {},
    [routeData?.lines, routeData?.prices]
  );

  const toggleOpen = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const shouldConvertCurrency =
    routeData?.quote.currencyCode !== company?.baseCurrencyCode;

  return (
    <VStack spacing={8} className="w-full overflow-hidden">
      {routeData?.lines?.map((line) => {
        const prices = pricingByLine[line.id!];

        const isGlAccount = line.supplierQuoteLineType === "G/L Account";
        const itemReadableId = isGlAccount
          ? line.description || t`Indirect Expense`
          : getItemReadableId(items, line.itemId);
        if (!line || !prices || !line.id) {
          return null;
        }

        return (
          <motion.div
            key={line.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-6 w-full"
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
                  <div className="flex items-center gap-x-4 justify-between flex-grow">
                    <HStack spacing={2} className="min-w-0 flex-shrink">
                      <Heading className="truncate">{itemReadableId}</Heading>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-muted-foreground flex-shrink-0"
                        onClick={() => onEdit(line)}
                      >
                        <Trans>Edit</Trans>
                      </Button>
                    </HStack>
                    <HStack spacing={4}>
                      <motion.div
                        animate={{
                          rotate: openItems.includes(line.id) ? 90 : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <LuChevronRight size={24} />
                      </motion.div>
                    </HStack>
                  </div>
                  <span className="text-muted-foreground text-base truncate">
                    {isGlAccount
                      ? (accounts.find((a) => a.id === line.accountId)?.name ??
                        "G/L Account")
                      : line.description}
                  </span>
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
              <LinePricingOptions
                formatter={formatter}
                line={line}
                options={pricingByLine[line.id!]}
                quoteCurrency={routeData?.quote.currencyCode ?? "USD"}
                quoteExchangeRate={routeData?.quote.exchangeRate ?? 1}
                shouldConvertCurrency={shouldConvertCurrency}
                locale={locale}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </VStack>
  );
};

type LinePricingOptionsProps = {
  line: SupplierQuoteLine;
  options: SupplierQuoteLinePrice[];
  quoteCurrency: string;
  shouldConvertCurrency: boolean;
  quoteExchangeRate: number;
  locale: string;
  formatter: Intl.NumberFormat;
};

const LinePricingOptions = ({
  line,
  options,
  locale,
  formatter
}: LinePricingOptionsProps) => {
  const { id } = useParams();
  if (!id) throw new Error("Could not find quote id");
  const unitOfMeasures = useUnitOfMeasure();

  return (
    <VStack spacing={4} className="w-full">
      <Table>
        <Thead>
          <Tr>
            <Th><Trans>Quantity</Trans></Th>
            <Th><Trans>Unit Price</Trans></Th>
            <Th><Trans>Shipping</Trans></Th>
            <Th><Trans>Tax</Trans></Th>
            <Th><Trans>Lead Time</Trans></Th>

            <Th className="text-right"><Trans>Total</Trans></Th>
          </Tr>
        </Thead>
        <Tbody>
          {!Array.isArray(options) || options.length === 0 ? (
            <Tr>
              <Td colSpan={6} className="text-center py-8">
                <Trans>No pricing options found</Trans>
              </Td>
            </Tr>
          ) : (
            options.map(
              (option, index) =>
                (line?.quantity?.includes(option.quantity) ||
                  option.quantity === 0) && (
                  <Tr key={index}>
                    <Td>
                      <div className="flex items-center gap-x-2 justify-between">
                        <VStack spacing={0}>
                          <span>
                            {option.quantity}{" "}
                            {
                              unitOfMeasures.find(
                                (uom) =>
                                  uom.value === line.purchaseUnitOfMeasureCode
                              )?.label
                            }
                          </span>
                          {line.conversionFactor !== 1 && (
                            <span className="text-muted-foreground text-xs">
                              {option.quantity * (line.conversionFactor ?? 1)}{" "}
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
                      </div>
                    </Td>
                    <Td>
                      <VStack spacing={0}>
                        <span>{formatter.format(option.unitPrice ?? 0)}</span>
                        {line.conversionFactor !== 1 && (
                          <span className="text-muted-foreground text-xs">
                            {formatter.format(
                              (option.unitPrice ?? 0) /
                                (line.conversionFactor ?? 1)
                            )}
                          </span>
                        )}
                      </VStack>
                    </Td>

                    <Td>{formatter.format(option.shippingCost ?? 0)}</Td>
                    <Td>{formatter.format(option.taxAmount ?? 0)}</Td>

                    <Td>
                      {new Intl.NumberFormat(locale, {
                        style: "unit",
                        unit: "day"
                      }).format(option.leadTime)}
                    </Td>

                    <Td className="text-right">
                      {formatter.format(
                        (option.unitPrice ?? 0) * option.quantity +
                          (option.shippingCost ?? 0) +
                          (option.supplierTaxAmount ?? 0)
                      )}
                    </Td>
                  </Tr>
                )
            )
          )}
        </Tbody>
      </Table>
    </VStack>
  );
};

const SupplierQuoteSummary = () => {
  const { id } = useParams();
  if (!id) throw new Error("Could not find quote id");
  const { formatDate } = useDateFormatter();
  const routeData = useRouteData<{
    quote: SupplierQuote;
    lines: SupplierQuoteLine[];
    prices: SupplierQuoteLinePrice[];
    purchaseOrderLines: PurchaseOrderLine[];
  }>(path.to.supplierQuote(id));

  const { locale } = useLocale();
  const formatter = useCurrencyFormatter();
  const permissions = usePermissions();

  const newSupplierQuoteLineDisclosure = useDisclosure();
  const deleteLineDisclosure = useDisclosure();
  const editLineDisclosure = useDisclosure();
  const [deleteLine, setDeleteLine] = useState<SupplierQuoteLine | null>(null);
  const [editLine, setEditLine] = useState<SupplierQuoteLine | null>(null);

  const isLocked = isSupplierQuoteLocked(routeData?.quote?.status);

  const onEditLine = (line: SupplierQuoteLine) => {
    setEditLine(line);
    editLineDisclosure.onOpen();
  };

  const onEditClose = () => {
    setEditLine(null);
    editLineDisclosure.onClose();
  };

  const onDeleteLine = (line: SupplierQuoteLine) => {
    setDeleteLine(line);
    deleteLineDisclosure.onOpen();
  };

  const onDeleteCancel = () => {
    setDeleteLine(null);
    deleteLineDisclosure.onClose();
  };

  const supplierQuoteLineInitialValues = {
    supplierQuoteId: id,
    supplierQuoteLineType: "Part" as const,
    status: "Draft" as const,
    itemType: "Part" as const,
    description: "",
    itemId: "",
    quantity: [1],
    inventoryUnitOfMeasureCode: "",
    purchaseUnitOfMeasureCode: ""
  };

  return (
    <>
    <Card>
      <CardHeader>
        <HStack className="justify-between items-center">
          <div className="flex flex-col gap-1">
            <CardTitle>{routeData?.quote.supplierQuoteId}</CardTitle>
            <CardDescription>
              <Trans>Supplier Quote</Trans>
            </CardDescription>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <SupplierAvatar supplierId={routeData?.quote.supplierId ?? null} />
            {routeData?.quote?.expirationDate && (
              <span className="text-muted-foreground text-sm">
                <Trans>Expires {formatDate(routeData?.quote.expirationDate)}</Trans>
              </span>
            )}
          </div>
        </HStack>
      </CardHeader>
      <CardContent>
        <LineItems
          currencyCode={routeData?.quote.currencyCode ?? "USD"}
          locale={locale}
          formatter={formatter}
          onEdit={onEditLine}
        />

        {!isLocked && permissions.can("update", "purchasing") && (
          <button
            type="button"
            onClick={newSupplierQuoteLineDisclosure.onOpen}
            className="mt-2 w-full rounded-lg border-2 border-dashed border-input py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary flex items-center justify-center gap-2"
          >
            <LuCirclePlus className="h-4 w-4" />
            <Trans>Add Line Item</Trans>
          </button>
        )}
      </CardContent>
    </Card>
    {newSupplierQuoteLineDisclosure.isOpen && (
      <SupplierQuoteLineForm
        initialValues={supplierQuoteLineInitialValues}
        type="modal"
        onClose={newSupplierQuoteLineDisclosure.onClose}
      />
    )}
    {deleteLineDisclosure.isOpen && deleteLine && (
      <DeleteSupplierQuoteLine line={deleteLine} onCancel={onDeleteCancel} />
    )}
    {editLineDisclosure.isOpen && editLine && (
      <SupplierQuoteLineForm
        initialValues={{
          id: editLine.id!,
          supplierQuoteId: editLine.supplierQuoteId!,
          supplierQuoteLineType: editLine.supplierQuoteLineType! as "Part" | "Material" | "Tool" | "Consumable" | "G/L Account",
          itemId: editLine.itemId ?? undefined,
          accountId: editLine.accountId ?? undefined,
          costCenterId: editLine.costCenterId ?? undefined,
          description: editLine.description ?? undefined,
          supplierPartId: editLine.supplierPartId ?? undefined,
          inventoryUnitOfMeasureCode: editLine.inventoryUnitOfMeasureCode ?? undefined,
          purchaseUnitOfMeasureCode: editLine.purchaseUnitOfMeasureCode ?? undefined,
          conversionFactor: editLine.conversionFactor ?? undefined,
          quantity: editLine.quantity ?? [1],
          itemType: (editLine.supplierQuoteLineType ?? "Part") as "Part" | "Material" | "Tool" | "Consumable"
        }}
        type="modal"
        onClose={onEditClose}
      />
    )}
    </>
  );
};

export default SupplierQuoteSummary;
