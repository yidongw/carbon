"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupJobPurchaseOrderLines = groupJobPurchaseOrderLines;
exports.JobPurchaseOrderPriceBreakdown = JobPurchaseOrderPriceBreakdown;
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var hooks_1 = require("~/hooks");
function groupJobPurchaseOrderLines(lines) {
    var grouped = new Map();
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var purchaseOrder = line.purchaseOrder;
        if (!(purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.id))
            continue;
        var existing = grouped.get(purchaseOrder.id);
        if (existing) {
            existing.lines.push(line);
            existing.total += (0, utils_1.getPurchaseOrderLineExtendedPrice)(line);
            continue;
        }
        grouped.set(purchaseOrder.id, {
            purchaseOrder: purchaseOrder,
            lines: [line],
            total: (0, utils_1.getPurchaseOrderLineExtendedPrice)(line)
        });
    }
    return Array.from(grouped.values()).sort(function (a, b) {
        var _a, _b;
        return ((_a = a.purchaseOrder.purchaseOrderId) !== null && _a !== void 0 ? _a : "").localeCompare((_b = b.purchaseOrder.purchaseOrderId) !== null && _b !== void 0 ? _b : "");
    });
}
// Min-cost surcharge lines are inserted without a jobOperation link, so they
// are the only outside-processing lines with no joined operation row.
function isMinimumCostLine(line) {
    return line.jobOperation == null;
}
function getLineBreakdown(line, allLines) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var quantity = (_a = line.purchaseQuantity) !== null && _a !== void 0 ? _a : 0;
    var unitPrice = (_c = (_b = line.supplierUnitPrice) !== null && _b !== void 0 ? _b : line.unitPrice) !== null && _c !== void 0 ? _c : 0;
    var extended = quantity * unitPrice;
    if (isMinimumCostLine(line)) {
        return {
            label: (_d = line.description) !== null && _d !== void 0 ? _d : "Minimum cost",
            detail: null,
            extended: (0, utils_1.getPurchaseOrderLineExtendedPrice)(line)
        };
    }
    var operation = line.jobOperation;
    var operationUnitCost = (_e = operation === null || operation === void 0 ? void 0 : operation.operationUnitCost) !== null && _e !== void 0 ? _e : unitPrice;
    var hasSeparateMinimumLine = allLines.some(isMinimumCostLine);
    if (hasSeparateMinimumLine) {
        return {
            label: (_g = (_f = operation === null || operation === void 0 ? void 0 : operation.description) !== null && _f !== void 0 ? _f : line.description) !== null && _g !== void 0 ? _g : "Outside processing",
            detail: {
                unitCost: operationUnitCost,
                quantity: quantity,
                unitTotal: extended,
                minimumCost: null
            },
            extended: (0, utils_1.getPurchaseOrderLineExtendedPrice)(line)
        };
    }
    var operationMinimumCost = (_h = operation === null || operation === void 0 ? void 0 : operation.operationMinimumCost) !== null && _h !== void 0 ? _h : 0;
    var unitTotal = operationUnitCost * quantity;
    var minimumApplied = Math.max(0, operationMinimumCost - unitTotal);
    return {
        label: (_k = (_j = operation === null || operation === void 0 ? void 0 : operation.description) !== null && _j !== void 0 ? _j : line.description) !== null && _k !== void 0 ? _k : "Outside processing",
        detail: minimumApplied > 0
            ? {
                unitCost: operationUnitCost,
                quantity: quantity,
                unitTotal: unitTotal,
                minimumCost: operationMinimumCost
            }
            : {
                unitCost: operationUnitCost,
                quantity: quantity,
                unitTotal: unitTotal,
                minimumCost: null
            },
        extended: (0, utils_1.getPurchaseOrderLineExtendedPrice)(line)
    };
}
function JobPurchaseOrderPriceBreakdown(_a) {
    var currencyCode = _a.currencyCode, lines = _a.lines, total = _a.total, children = _a.children;
    var formatter = (0, hooks_1.useCurrencyFormatter)({ currency: currencyCode });
    return (<react_1.Popover>
      <react_1.PopoverTrigger asChild>{children}</react_1.PopoverTrigger>
      <react_1.PopoverContent align="end" className="w-[360px] p-0">
        <react_1.VStack spacing={0} className="w-full">
          <div className="border-b px-4 py-3">
            <p className="text-sm font-medium">
              <macro_1.Trans>Price breakdown</macro_1.Trans>
            </p>
          </div>
          <react_1.Table>
            <react_1.Thead>
              <react_1.Tr>
                <react_1.Th>
                  <macro_1.Trans>Line</macro_1.Trans>
                </react_1.Th>
                <react_1.Th className="text-right">
                  <macro_1.Trans>Total</macro_1.Trans>
                </react_1.Th>
              </react_1.Tr>
            </react_1.Thead>
            <react_1.Tbody>
              {lines.map(function (line) {
            var breakdown = getLineBreakdown(line, lines);
            return (<react_1.Tr key={line.id}>
                    <react_1.Td className="align-top">
                      <react_1.VStack spacing={1} className="items-start">
                        <span className="text-sm">{breakdown.label}</span>
                        {breakdown.detail ? (<span className="text-xs text-muted-foreground">
                            {formatter.format(breakdown.detail.unitCost)} ×{" "}
                            {breakdown.detail.quantity} ={" "}
                            {formatter.format(breakdown.detail.unitTotal)}
                            {breakdown.detail.minimumCost != null ? (<>
                                {" · "}
                                <macro_1.Trans>Minimum</macro_1.Trans>{" "}
                                {formatter.format(breakdown.detail.minimumCost)}
                              </>) : null}
                          </span>) : null}
                      </react_1.VStack>
                    </react_1.Td>
                    <react_1.Td className="text-right align-top tabular-nums">
                      {formatter.format(breakdown.extended)}
                    </react_1.Td>
                  </react_1.Tr>);
        })}
              <react_1.Tr>
                <react_1.Td className="font-medium">
                  <macro_1.Trans>Total</macro_1.Trans>
                </react_1.Td>
                <react_1.Td className="text-right font-medium tabular-nums">
                  {formatter.format(total)}
                </react_1.Td>
              </react_1.Tr>
            </react_1.Tbody>
          </react_1.Table>
        </react_1.VStack>
      </react_1.PopoverContent>
    </react_1.Popover>);
}
