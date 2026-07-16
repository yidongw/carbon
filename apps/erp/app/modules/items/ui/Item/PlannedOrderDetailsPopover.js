"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlannedOrderDetailsPopover = PlannedOrderDetailsPopover;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var ItemReorderPolicy_1 = require("./ItemReorderPolicy");
function PlannedOrderDetailsPopover(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var order = _a.order, conversionFactor = _a.conversionFactor, children = _a.children;
    var t = (0, macro_1.useLingui)().t;
    var numberFormatter = (0, i18n_1.useNumberFormatter)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var currencyFormatter = (0, hooks_1.useCurrencyFormatter)();
    var suppliers = (0, stores_1.useSuppliers)()[0];
    var supplierLabel = order.supplierId
        ? ((_c = (_b = suppliers.find(function (s) { return s.id === order.supplierId; })) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : null)
        : null;
    var hasPolicy = !!order.policyName;
    var hasLinkedPo = !!order.existingLineId;
    var inventoryQty = ((_d = order.quantity) !== null && _d !== void 0 ? _d : 0) * conversionFactor;
    var isAsap = order.isASAP === true;
    return (<react_1.Popover>
      <react_1.PopoverTrigger asChild>{children}</react_1.PopoverTrigger>
      <react_1.PopoverContent className="w-md max-h-112 overflow-y-auto pointer-events-auto" onWheel={function (e) { return e.stopPropagation(); }}>
        <div className="flex flex-col gap-3">
          {/* Section A — Order facts */}
          <div className="flex flex-col gap-1">
            <div className="text-sm font-medium">
              <macro_1.Trans>Planned Order</macro_1.Trans>
            </div>
            <div className="text-xs text-muted-foreground">
              <macro_1.Trans>
                Planned order = MRP suggestion to cover projected demand based
                on the item's reorder policy (or manually added).
              </macro_1.Trans>
            </div>
            <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 text-sm">
              <dt className="text-muted-foreground">
                <macro_1.Trans>Supplier</macro_1.Trans>
              </dt>
              <dd>
                {supplierLabel !== null && supplierLabel !== void 0 ? supplierLabel : (<span className="text-muted-foreground">—</span>)}
              </dd>

              <dt className="text-muted-foreground">
                <macro_1.Trans>Quantity</macro_1.Trans>
              </dt>
              <dd>
                {numberFormatter.format((_e = order.quantity) !== null && _e !== void 0 ? _e : 0)}
                {conversionFactor !== 1 && (<span className="ml-1 text-xs text-muted-foreground">
                    ({numberFormatter.format(inventoryQty)} <macro_1.Trans>inv</macro_1.Trans>)
                  </span>)}
              </dd>

              {order.startDate && (<>
                  <dt className="text-muted-foreground inline-flex items-center gap-1">
                    <macro_1.Trans>Order by</macro_1.Trans>
                    <react_1.Tooltip>
                      <react_1.TooltipTrigger tabIndex={-1}>
                        <lu_1.LuInfo className="size-3 cursor-help" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["info"], ["info"])))}/>
                      </react_1.TooltipTrigger>
                      <react_1.TooltipContent className="max-w-xs">
                        <macro_1.Trans>
                          The latest date to place this PO so it arrives by the
                          need-by date, given the supplier's lead time.
                        </macro_1.Trans>
                      </react_1.TooltipContent>
                    </react_1.Tooltip>
                  </dt>
                  <dd>{formatDate(order.startDate)}</dd>
                </>)}

              {order.dueDate && (<>
                  <dt className="text-muted-foreground inline-flex items-center gap-1">
                    <macro_1.Trans>Need by</macro_1.Trans>
                    <react_1.Tooltip>
                      <react_1.TooltipTrigger tabIndex={-1}>
                        <lu_1.LuInfo className="size-3 cursor-help" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["info"], ["info"])))}/>
                      </react_1.TooltipTrigger>
                      <react_1.TooltipContent className="max-w-xs">
                        <macro_1.Trans>
                          The date the item is required on-site to cover the
                          period's projected demand.
                        </macro_1.Trans>
                      </react_1.TooltipContent>
                    </react_1.Tooltip>
                  </dt>
                  <dd>
                    {formatDate(order.dueDate)}
                    {isAsap && (<span className="ml-2 text-xs text-red-500 font-medium uppercase">
                        ASAP
                      </span>)}
                  </dd>
                </>)}

              {order.unitPrice != null && (<>
                  <dt className="text-muted-foreground">
                    <macro_1.Trans>Unit price</macro_1.Trans>
                  </dt>
                  <dd>{currencyFormatter.format(order.unitPrice)}</dd>
                </>)}
            </dl>
          </div>

          {/* Section B — Why suggested */}
          {hasPolicy && (<div className="flex flex-col gap-1 border-t pt-2">
              <div className="text-sm font-medium">
                <macro_1.Trans>Why is this included?</macro_1.Trans>
              </div>
              <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 text-sm">
                <dt className="text-muted-foreground">
                  <macro_1.Trans>Policy</macro_1.Trans>
                </dt>
                <dd>
                  {order.policyName && (<ItemReorderPolicy_1.ItemReorderPolicy reorderingPolicy={order.policyName}/>)}
                </dd>

                {((_f = order.triggerValues) === null || _f === void 0 ? void 0 : _f.projectedStock) != null && (<>
                    <dt className="text-muted-foreground">
                      <macro_1.Trans>Projected stock</macro_1.Trans>
                    </dt>
                    <dd>
                      {numberFormatter.format(order.triggerValues.projectedStock)}
                    </dd>
                  </>)}

                {((_g = order.triggerValues) === null || _g === void 0 ? void 0 : _g.safetyStock) != null && (<>
                    <dt className="text-muted-foreground">
                      <macro_1.Trans>Safety stock</macro_1.Trans>
                    </dt>
                    <dd>
                      {numberFormatter.format(order.triggerValues.safetyStock)}
                    </dd>
                  </>)}

                {((_h = order.triggerValues) === null || _h === void 0 ? void 0 : _h.lotSize) != null && (<>
                    <dt className="text-muted-foreground">
                      <macro_1.Trans>Lot size</macro_1.Trans>
                    </dt>
                    <dd>
                      {numberFormatter.format(order.triggerValues.lotSize)}
                    </dd>
                  </>)}

                {((_j = order.triggerValues) === null || _j === void 0 ? void 0 : _j.leadTime) != null && (<>
                    <dt className="text-muted-foreground">
                      <macro_1.Trans>Lead time (days)</macro_1.Trans>
                    </dt>
                    <dd>
                      {numberFormatter.format(order.triggerValues.leadTime)}
                    </dd>
                  </>)}
              </dl>
            </div>)}

          {/* Section C — Linked PO */}
          {hasLinkedPo && (<div className="flex flex-col gap-1 border-t pt-2">
              <div className="text-sm font-medium">
                <macro_1.Trans>Linked PO</macro_1.Trans>
              </div>
              <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 text-sm">
                <dt className="text-muted-foreground">
                  <macro_1.Trans>PO</macro_1.Trans>
                </dt>
                <dd>
                  {order.existingId ? (<react_router_1.Link to={path_1.path.to.purchaseOrder(order.existingId)} className="text-primary hover:underline">
                      {(_k = order.existingReadableId) !== null && _k !== void 0 ? _k : order.existingId}
                    </react_router_1.Link>) : (((_l = order.existingReadableId) !== null && _l !== void 0 ? _l : "—"))}
                </dd>

                {order.existingStatus && (<>
                    <dt className="text-muted-foreground">
                      <macro_1.Trans>Status</macro_1.Trans>
                    </dt>
                    <dd className="font-mono text-xs">
                      {order.existingStatus}
                    </dd>
                  </>)}
              </dl>
            </div>)}
        </div>
      </react_1.PopoverContent>
    </react_1.Popover>);
}
var templateObject_1, templateObject_2;
