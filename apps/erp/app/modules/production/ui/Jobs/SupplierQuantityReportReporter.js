"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierQuantityReportReporter = SupplierQuantityReportReporter;
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var Avatar_1 = require("~/components/Avatar");
var stores_1 = require("~/stores");
function resolvePerson(people, userId) {
    var _a;
    if (!userId || userId === "system")
        return null;
    return (_a = people.find(function (p) { return p.id === userId; })) !== null && _a !== void 0 ? _a : null;
}
function SupplierQuantityReportReporter(_a) {
    var _b, _c, _d, _e, _f, _g;
    var supplierId = _a.supplierId, createdBy = _a.createdBy;
    var people = (0, stores_1.usePeople)()[0];
    var suppliers = (0, stores_1.useSuppliers)()[0];
    var supplier = supplierId
        ? ((_b = suppliers.find(function (s) { return s.id === supplierId; })) !== null && _b !== void 0 ? _b : null)
        : null;
    var supplierImageUrl = (supplier === null || supplier === void 0 ? void 0 : supplier.website)
        ? (0, utils_1.getFaviconUrl)(supplier.website)
        : undefined;
    var enteredById = createdBy && createdBy !== "system" ? createdBy : null;
    var enteredByIsSystem = enteredById === "system";
    var enteredBy = enteredByIsSystem
        ? null
        : resolvePerson(people, enteredById);
    var showEnteredBy = Boolean(enteredById && (enteredBy || enteredByIsSystem));
    var supplierName = ((_c = supplier === null || supplier === void 0 ? void 0 : supplier.name) === null || _c === void 0 ? void 0 : _c.trim()) ? supplier.name : null;
    var avatarStack = (<span className={(0, react_1.cn)("inline-flex shrink-0", showEnteredBy ? "-space-x-2" : undefined)}>
      {showEnteredBy ? (enteredByIsSystem ? (<Avatar_1.default size="xs" className="ring-2 ring-background"/>) : (<Avatar_1.default size="xs" path={(_d = enteredBy === null || enteredBy === void 0 ? void 0 : enteredBy.avatarUrl) !== null && _d !== void 0 ? _d : undefined} name={(_e = enteredBy === null || enteredBy === void 0 ? void 0 : enteredBy.name) !== null && _e !== void 0 ? _e : ""} className="ring-2 ring-background"/>)) : null}
      <Avatar_1.default size="xs" name={supplierName !== null && supplierName !== void 0 ? supplierName : ""} imageUrl={supplierImageUrl} className={showEnteredBy ? "ring-2 ring-background" : ""}/>
    </span>);
    var stackWithTooltip = showEnteredBy ? (<react_1.Tooltip>
      <react_1.TooltipTrigger asChild>
        <span className="inline-flex cursor-default rounded-full">
          {avatarStack}
        </span>
      </react_1.TooltipTrigger>
      <react_1.TooltipContent side="top" className="px-2.5 py-2">
        <react_1.HStack className="items-center gap-2">
          {enteredByIsSystem ? (<Avatar_1.default size="xs"/>) : (<Avatar_1.default size="xs" path={(_f = enteredBy === null || enteredBy === void 0 ? void 0 : enteredBy.avatarUrl) !== null && _f !== void 0 ? _f : undefined} name={(_g = enteredBy === null || enteredBy === void 0 ? void 0 : enteredBy.name) !== null && _g !== void 0 ? _g : ""}/>)}
          <span className="text-sm">
            {enteredByIsSystem ? (<macro_1.Trans>Entered by System</macro_1.Trans>) : (<macro_1.Trans>Entered by {enteredBy === null || enteredBy === void 0 ? void 0 : enteredBy.name}</macro_1.Trans>)}
          </span>
        </react_1.HStack>
      </react_1.TooltipContent>
    </react_1.Tooltip>) : (avatarStack);
    if (!supplierName) {
        return (<react_1.HStack className="min-w-0 items-center gap-2">
        {stackWithTooltip}
        <span className="text-sm font-medium leading-5 text-foreground">
          <macro_1.Trans>Supplier</macro_1.Trans>
        </span>
      </react_1.HStack>);
    }
    return (<react_1.HStack className="min-w-0 items-center gap-2">
      {stackWithTooltip}
      <span className="shrink-0 text-sm font-medium leading-5 text-foreground">
        {supplierName}
      </span>
    </react_1.HStack>);
}
