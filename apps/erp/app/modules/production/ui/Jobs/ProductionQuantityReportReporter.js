"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionQuantityReportReporter = ProductionQuantityReportReporter;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var Avatar_1 = require("~/components/Avatar");
var stores_1 = require("~/stores");
function resolvePerson(people, userId) {
    var _a;
    if (!userId || userId === "system")
        return null;
    return (_a = people.find(function (p) { return p.id === userId; })) !== null && _a !== void 0 ? _a : null;
}
function ProductionQuantityReportReporter(_a) {
    var _b, _c, _d, _e, _f, _g;
    var employeeId = _a.employeeId, createdBy = _a.createdBy;
    var people = (0, stores_1.usePeople)()[0];
    var isSystem = employeeId === "system";
    var employee = resolvePerson(people, employeeId);
    var enteredById = createdBy && createdBy !== employeeId ? createdBy : null;
    var enteredByIsSystem = enteredById === "system";
    var enteredBy = enteredByIsSystem
        ? null
        : resolvePerson(people, enteredById);
    var showEnteredBy = Boolean(enteredById && (enteredBy || enteredByIsSystem));
    var employeeName = isSystem ? <macro_1.Trans>System</macro_1.Trans> : employee === null || employee === void 0 ? void 0 : employee.name;
    var avatarStack = (<span className={(0, react_1.cn)("inline-flex shrink-0", showEnteredBy ? "-space-x-2" : undefined)}>
      {showEnteredBy ? (enteredByIsSystem ? (<Avatar_1.default size="xs" className="ring-2 ring-background"/>) : (<Avatar_1.default size="xs" path={(_b = enteredBy === null || enteredBy === void 0 ? void 0 : enteredBy.avatarUrl) !== null && _b !== void 0 ? _b : undefined} name={(_c = enteredBy === null || enteredBy === void 0 ? void 0 : enteredBy.name) !== null && _c !== void 0 ? _c : ""} className="ring-2 ring-background"/>)) : null}
      {isSystem ? (<Avatar_1.default size="xs" className={showEnteredBy ? "ring-2 ring-background" : ""}/>) : (<Avatar_1.default size="xs" path={(_d = employee === null || employee === void 0 ? void 0 : employee.avatarUrl) !== null && _d !== void 0 ? _d : undefined} name={(_e = employee === null || employee === void 0 ? void 0 : employee.name) !== null && _e !== void 0 ? _e : ""} className={showEnteredBy ? "ring-2 ring-background" : ""}/>)}
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
    if (!employeeName && isSystem) {
        return (<react_1.HStack className="min-w-0 items-center gap-2">
        {stackWithTooltip}
        <span className="text-sm font-medium leading-5 text-foreground">
          <macro_1.Trans>System</macro_1.Trans>
        </span>
      </react_1.HStack>);
    }
    if (!employeeName) {
        return stackWithTooltip;
    }
    return (<react_1.HStack className="min-w-0 items-center gap-2">
      {stackWithTooltip}
      <span className="shrink-0 text-sm font-medium leading-5 text-foreground">
        {employeeName}
      </span>
    </react_1.HStack>);
}
