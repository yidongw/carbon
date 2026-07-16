"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var DateSelect_1 = require("~/components/DateSelect");
var InventoryStorageUnits_1 = require("./InventoryStorageUnits");
var InventoryDetails = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j;
    var itemStorageUnitQuantities = _a.itemStorageUnitQuantities, itemUnitOfMeasureCode = _a.itemUnitOfMeasureCode, itemTrackingType = _a.itemTrackingType, itemShelfLife = _a.itemShelfLife, trackedEntityExpirations = _a.trackedEntityExpirations, pickMethod = _a.pickMethod, quantities = _a.quantities, storageUnits = _a.storageUnits;
    var locale = (0, i18n_1.useLocale)().locale;
    var formatter = Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        useGrouping: true
    });
    var _k = (0, react_2.useState)("30"), usageWindow = _k[0], setUsageWindow = _k[1];
    var dailyUsage = usageWindow === "30"
        ? ((_b = quantities === null || quantities === void 0 ? void 0 : quantities.usageLast30Days) !== null && _b !== void 0 ? _b : 0)
        : ((_c = quantities === null || quantities === void 0 ? void 0 : quantities.usageLast90Days) !== null && _c !== void 0 ? _c : 0);
    return (<react_1.VStack>
      <div className="w-full grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        <react_1.Card>
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Quantity on Hand</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <h3 className="text-4xl font-medium tracking-tighter">
              {formatter.format((_d = quantities === null || quantities === void 0 ? void 0 : quantities.quantityOnHand) !== null && _d !== void 0 ? _d : 0)}
            </h3>
          </react_1.CardContent>
        </react_1.Card>
        <react_1.Card>
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Days Remaining</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <h3 className="text-4xl font-medium tracking-tighter">
              {formatter.format((_e = quantities === null || quantities === void 0 ? void 0 : quantities.daysRemaining) !== null && _e !== void 0 ? _e : 0)}
            </h3>
          </react_1.CardContent>
        </react_1.Card>
        <react_1.Card>
          <react_1.CardHeader className="flex-row items-center justify-between">
            <react_1.CardTitle>
              <macro_1.Trans>Daily Usage</macro_1.Trans>
            </react_1.CardTitle>
            <DateSelect_1.DateSelect value={usageWindow} onValueChange={function (v) {
            if (v === "30" || v === "90")
                setUsageWindow(v);
        }} options={[
            { value: "30", label: "30D" },
            { value: "90", label: "90D" }
        ]} showCustom={false}/>
          </react_1.CardHeader>
          <react_1.CardContent>
            <h3 className="text-4xl font-medium tracking-tighter">
              {formatter.format(dailyUsage)}
            </h3>
          </react_1.CardContent>
        </react_1.Card>
        <react_1.Card>
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Quantity on Purchase Order</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <div className="flex justify-start items-center gap-1">
              <h3 className="text-4xl font-medium tracking-tighter">
                {formatter.format((_f = quantities === null || quantities === void 0 ? void 0 : quantities.quantityOnPurchaseOrder) !== null && _f !== void 0 ? _f : 0)}
              </h3>
              <lu_1.LuMoveUp className="text-emerald-500 text-lg"/>
            </div>
          </react_1.CardContent>
        </react_1.Card>
        <react_1.Card>
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Quantity on Sales Order</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <div className="flex justify-start items-center gap-1">
              <h3 className="text-4xl font-medium tracking-tighter">
                {formatter.format((_g = quantities === null || quantities === void 0 ? void 0 : quantities.quantityOnSalesOrder) !== null && _g !== void 0 ? _g : 0)}
              </h3>
              <lu_1.LuMoveDown className="text-red-500 text-lg"/>
            </div>
          </react_1.CardContent>
        </react_1.Card>
        <react_1.Card>
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Quantity on Jobs</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardContent>
            <div className="flex items-start justify-start gap-2">
              <div className="flex justify-start items-center gap-1">
                <h3 className="text-4xl font-medium tracking-tighter">
                  {formatter.format((_h = quantities === null || quantities === void 0 ? void 0 : quantities.quantityOnProductionOrder) !== null && _h !== void 0 ? _h : 0)}
                </h3>
                <lu_1.LuMoveUp className="text-emerald-500 text-lg"/>
              </div>
              <div className="flex justify-start items-center gap-1">
                <h3 className="text-4xl font-medium tracking-tighter">
                  {formatter.format((_j = quantities === null || quantities === void 0 ? void 0 : quantities.quantityOnProductionDemand) !== null && _j !== void 0 ? _j : 0)}
                </h3>
                <lu_1.LuMoveDown className="text-red-500 text-lg"/>
              </div>
            </div>
          </react_1.CardContent>
        </react_1.Card>
      </div>
      <InventoryStorageUnits_1.default itemStorageUnitQuantities={itemStorageUnitQuantities} itemUnitOfMeasureCode={itemUnitOfMeasureCode} itemTrackingType={itemTrackingType} itemShelfLife={itemShelfLife} trackedEntityExpirations={trackedEntityExpirations} pickMethod={pickMethod} storageUnits={storageUnits}/>
    </react_1.VStack>);
};
exports.default = InventoryDetails;
