"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Icons_1 = require("~/components/Icons");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var duration_1 = require("~/utils/duration");
var path_1 = require("~/utils/path");
var JobOperationStatus_1 = require("./JobOperationStatus");
var timeTypes = ["Setup", "Labor", "Machine"];
var JobEstimatesVsActuals = function (_a) {
    var operations = _a.operations, materials = _a.materials, productionEvents = _a.productionEvents, productionQuantities = _a.productionQuantities, notes = _a.notes;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var jobId = (0, react_router_1.useParams)().jobId;
    var t = (0, macro_1.useLingui)().t;
    var user = (0, hooks_1.useUser)();
    if (!jobId)
        throw new Error("Could not find jobId");
    var items = (0, stores_1.useItems)()[0];
    var currencyFormatter = (0, hooks_1.useCurrencyFormatter)();
    var percentFormatter = (0, hooks_1.usePercentFormatter)();
    var _b = (0, react_2.useState)({}), currentUnitCosts = _b[0], setCurrentUnitCosts = _b[1];
    var getCurrentUnitCosts = function (itemIds) { return __awaiter(void 0, void 0, void 0, function () {
        var itemCosts;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("itemCost").select("itemId, unitCost").in("itemId", itemIds))];
                case 1:
                    itemCosts = _b.sent();
                    if (!(itemCosts === null || itemCosts === void 0 ? void 0 : itemCosts.data)) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failed to fetch item costs"], ["Failed to fetch item costs"]))));
                        return [2 /*return*/];
                    }
                    setCurrentUnitCosts((_a = itemCosts === null || itemCosts === void 0 ? void 0 : itemCosts.data) === null || _a === void 0 ? void 0 : _a.reduce(function (acc, itemCost) {
                        // @ts-expect-error TS2322 - TODO: fix type
                        acc[itemCost.itemId] = itemCost.unitCost;
                        return acc;
                    }, {}));
                    return [2 /*return*/];
            }
        });
    }); };
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        getCurrentUnitCosts(materials.map(function (m) { return m.itemId; }));
    }, [materials]);
    var getEstimatedTime = function (operation) {
        var op = (0, duration_1.makeDurations)(operation);
        return {
            total: op.duration,
            setup: op.setupDuration,
            labor: op.laborDuration,
            machine: op.machineDuration
        };
    };
    var getActualTime = function (operation) {
        var operationEvents = productionEvents.filter(function (pe) { return pe.jobOperationId === operation.id; });
        var timeNow = (0, date_1.now)((0, date_1.getLocalTimeZone)());
        var actualTimes = operationEvents.reduce(function (acc, event) {
            var _a;
            if (event.endTime && event.type) {
                acc[event.type.toLowerCase()] +=
                    ((_a = event.duration) !== null && _a !== void 0 ? _a : 0) * 1000;
            }
            else if (event.startTime && event.type) {
                var startTime = (0, date_1.toZoned)((0, date_1.parseAbsolute)(event.startTime, (0, date_1.getLocalTimeZone)()), (0, date_1.getLocalTimeZone)());
                var difference = timeNow.compare(startTime);
                if (difference > 0) {
                    acc[event.type.toLowerCase()] += difference;
                }
            }
            return acc;
        }, {
            setup: 0,
            labor: 0,
            machine: 0
        });
        return __assign({ total: actualTimes.setup + actualTimes.labor + actualTimes.machine }, actualTimes);
    };
    var getCompleteQuantity = function (operation) {
        var quantity = productionQuantities
            .filter(function (pq) { return pq.jobOperationId === operation.id && pq.type === "Production"; })
            .reduce(function (acc, pq) { return acc + pq.quantity; }, 0);
        return quantity !== null && quantity !== void 0 ? quantity : 0;
    };
    var getScrapQuantity = function (operation) {
        var quantity = productionQuantities
            .filter(function (pq) { return pq.jobOperationId === operation.id && pq.type === "Scrap"; })
            .reduce(function (acc, pq) { return acc + pq.quantity; }, 0);
        return quantity !== null && quantity !== void 0 ? quantity : 0;
    };
    var getEmployeeIds = function (operation, type) {
        var operationEvents = productionEvents.filter(function (pe) { return pe.jobOperationId === operation.id && pe.type === type; });
        var employeeIds = operationEvents.reduce(function (acc, pe) {
            if (pe.employeeId) {
                acc.add(pe.employeeId);
            }
            return acc;
        }, new Set());
        return Array.from(employeeIds);
    };
    var getJobOperationNotes = function (operation) {
        return notes.filter(function (n) { return n.jobOperationId === operation.id; });
    };
    var getNotes = function (operation, type) {
        var eventNotes = productionEvents
            .filter(function (pe) {
            return pe.jobOperationId === operation.id &&
                (type === undefined || pe.type === type);
        })
            .map(function (pe) { return ({
            employeeId: pe.employeeId,
            notes: pe.notes,
            createdAt: pe.createdAt,
            productionEventId: pe.id
        }); });
        var quantityNotes = productionQuantities
            .filter(function (pq) { return pq.jobOperationId === operation.id && type === undefined; })
            .map(function (pq) {
            var _a, _b;
            return ({
                employeeId: pq.createdBy,
                notes: pq.notes,
                createdAt: pq.createdAt,
                productionEventId: (_b = (_a = pq.setupProductionEventId) !== null && _a !== void 0 ? _a : pq.laborProductionEventId) !== null && _b !== void 0 ? _b : pq.machineProductionEventId
            });
        });
        var notes = __spreadArray(__spreadArray([], eventNotes, true), quantityNotes, true).filter(function (n) { return n.notes; });
        if (notes.length === 0)
            return null;
        return notes;
    };
    return (<react_1.Tabs defaultValue="processes" className="w-full">
      <react_1.Card>
        <react_1.HStack className="justify-between items-start">
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Estimates vs Actual</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardAction className="flex flex-col gap-2">
            <react_1.TabsList className="grid grid-cols-2">
              <react_1.TabsTrigger value="processes">
                <macro_1.Trans>Processes</macro_1.Trans>
              </react_1.TabsTrigger>
              <react_1.TabsTrigger value="materials">
                <macro_1.Trans>Material</macro_1.Trans>
              </react_1.TabsTrigger>
            </react_1.TabsList>
          </react_1.CardAction>
        </react_1.HStack>
        <react_1.CardContent>
          <react_1.TabsContent value="processes">
            <react_1.Table>
              <react_1.Thead>
                <react_1.Tr>
                  <react_1.Th className="px-2"/>
                  <react_1.Th className="px-2">
                    <macro_1.Trans>Estimated</macro_1.Trans>
                  </react_1.Th>
                  <react_1.Th className="px-2">
                    <macro_1.Trans>Actual</macro_1.Trans>
                  </react_1.Th>
                  <react_1.Th className="px-2">
                    <macro_1.Trans>%</macro_1.Trans>
                  </react_1.Th>
                  <react_1.Th className="px-2">
                    <macro_1.Trans>Complete</macro_1.Trans>
                  </react_1.Th>
                  <react_1.Th className="px-2">
                    <macro_1.Trans>Scrap</macro_1.Trans>
                  </react_1.Th>
                  <react_1.Th className="px-2"/>
                </react_1.Tr>
              </react_1.Thead>
              <react_1.Tbody>
                {operations.map(function (operation) {
            var _a, _b;
            var estimated = getEstimatedTime(operation);
            var actual = getActualTime(operation);
            var notes = getJobOperationNotes(operation);
            var isOutside = operation.operationType === "Outside";
            if (isOutside)
                return null;
            return (<react_2.Fragment key={operation.id}>
                      <react_1.Tr className="border-b border-border">
                        <react_1.Td className="border-r border-border px-2">
                          <react_1.HStack className="w-full justify-between ">
                            <react_1.HStack spacing={2}>
                              <span>{operation.description}</span>
                              {operation.reworkId && (<react_1.Badge variant="red">Rework</react_1.Badge>)}
                            </react_1.HStack>
                            <JobOperationStatus_1.JobOperationStatus operation={operation}/>
                          </react_1.HStack>
                        </react_1.Td>
                        <react_1.Td className="px-2">
                          <span className="flex-shrink-0">
                            {(0, utils_1.formatDurationMilliseconds)(estimated.total)}
                          </span>
                        </react_1.Td>
                        <react_1.Td className="px-2">
                          <span className={(0, react_1.cn)("flex-shrink-0", actual.total > estimated.total && "text-red-500")}>
                            {(0, utils_1.formatDurationMilliseconds)(actual.total)}
                          </span>
                        </react_1.Td>
                        <react_1.Td className="px-2">
                          <span className={(0, react_1.cn)("line-clamp-1", actual.total > estimated.total && "text-red-500")}>
                            {estimated.total
                    ? percentFormatter.format(actual.total / estimated.total)
                    : null}
                          </span>
                        </react_1.Td>
                        <react_1.Td className="px-2">
                          {"".concat(getCompleteQuantity(operation), "/").concat((_b = (_a = operation.targetQuantity) !== null && _a !== void 0 ? _a : operation.operationQuantity) !== null && _b !== void 0 ? _b : 0)}
                        </react_1.Td>
                        <react_1.Td className="px-2">{getScrapQuantity(operation)}</react_1.Td>
                        <react_1.Td className="px-2">
                          <react_1.HStack spacing={0} className="justify-end">
                            {notes && notes.length > 0 && (<react_1.Popover>
                                <react_1.PopoverTrigger asChild>
                                  <react_1.IconButton variant="ghost" icon={<lu_1.LuNotebook />} aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Notes"], ["Notes"])))}/>
                                </react_1.PopoverTrigger>
                                <react_1.PopoverContent className="w-96 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-300">
                                  <div className="flex flex-col gap-3 p-2">
                                    {notes.map(function (note, index) { return (<div key={index} className="flex gap-2 items-center">
                                        <div className="flex-shrink-0">
                                          <components_1.EmployeeAvatar employeeId={note.createdBy} size="sm" withName={false}/>
                                        </div>
                                        <div className={(0, react_1.cn)("flex-1 rounded-lg p-2 text-sm", note.createdBy === user.id
                            ? "bg-blue-500 text-white"
                            : "bg-muted")}>
                                          {note.note}
                                        </div>
                                      </div>); })}
                                  </div>
                                </react_1.PopoverContent>
                              </react_1.Popover>)}
                            <react_router_1.Link to={"".concat(path_1.path.to.jobProductionEvents(jobId), "?filter=jobOperationId:eq:").concat(operation.id)}>
                              <react_1.IconButton variant="ghost" icon={<lu_1.LuCircleChevronRight />} aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["View Production Events"], ["View Production Events"])))}/>
                            </react_router_1.Link>
                          </react_1.HStack>
                        </react_1.Td>
                      </react_1.Tr>

                      {timeTypes.map(function (type) {
                    if (estimated[type.toLowerCase()] === 0) {
                        return null;
                    }
                    var employeeIds = getEmployeeIds(operation, type);
                    var notes = getNotes(operation, type);
                    return (<react_1.Tr key={type} className="border-b border-border">
                            <react_1.Td className="border-r border-border pl-10">
                              <react_1.HStack className="justify-between w-full">
                                <react_1.HStack>
                                  <Icons_1.TimeTypeIcon type={type}/>
                                  <span>{type}</span>
                                </react_1.HStack>
                                {employeeIds.length > 0 && (<components_1.EmployeeAvatarGroup employeeIds={employeeIds} size="xs" limit={3}/>)}
                              </react_1.HStack>
                            </react_1.Td>
                            <react_1.Td className="px-2">
                              {(0, utils_1.formatDurationMilliseconds)(estimated[type.toLowerCase()])}
                            </react_1.Td>
                            <react_1.Td className="px-2">
                              {(0, utils_1.formatDurationMilliseconds)(actual[type.toLowerCase()])}
                            </react_1.Td>
                            <react_1.Td className="px-2">
                              {percentFormatter.format(actual[type.toLowerCase()] /
                            estimated[type.toLowerCase()])}
                            </react_1.Td>
                            <react_1.Td className="px-2"/>
                            <react_1.Td className="px-2"/>
                            <react_1.Td className="px-2">
                              <react_1.HStack spacing={0} className="justify-end">
                                {notes && notes.length > 0 && (<react_1.Popover>
                                    <react_1.PopoverTrigger asChild>
                                      <react_1.IconButton variant="ghost" icon={<lu_1.LuNotebook />} aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Notes"], ["Notes"])))}/>
                                    </react_1.PopoverTrigger>
                                    <react_1.PopoverContent className="w-96 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-300">
                                      <div className="flex flex-col gap-3 p-2">
                                        {notes.map(function (note, index) { return (<div key={index} className="flex gap-2 items-center">
                                            <div className="flex-shrink-0">
                                              <components_1.EmployeeAvatar employeeId={note.employeeId} size="sm" withName={false}/>
                                            </div>
                                            <div className="flex-1 rounded-lg bg-muted p-2 text-sm">
                                              {note.notes}
                                            </div>
                                          </div>); })}
                                      </div>
                                    </react_1.PopoverContent>
                                  </react_1.Popover>)}
                                <react_router_1.Link to={"".concat(path_1.path.to.jobProductionEvents(jobId), "?filter=jobOperationId:eq:").concat(operation.id, "&filter=type:eq:").concat(type)}>
                                  <react_1.IconButton variant="ghost" icon={<lu_1.LuCircleChevronRight />} aria-label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["View Production Events"], ["View Production Events"])))}/>
                                </react_router_1.Link>
                              </react_1.HStack>
                            </react_1.Td>
                          </react_1.Tr>);
                })}
                    </react_2.Fragment>);
        })}
              </react_1.Tbody>
              <react_1.Tfoot>
                {/* <Tr className="font-bold">
      <Td className="border-r border-border" />
      {types.map((type) => (
        <Td key={type}>
          <Button variant="secondary"><Trans>Add</Trans></Button>
        </Td>
      ))}
    </Tr> */}
              </react_1.Tfoot>
            </react_1.Table>
          </react_1.TabsContent>
          <react_1.TabsContent value="materials">
            <react_1.Table>
              <react_1.Thead>
                <react_1.Tr>
                  <react_1.Th>
                    <macro_1.Trans>Material</macro_1.Trans>
                  </react_1.Th>
                  <react_1.Th>
                    <macro_1.Trans>Estimated</macro_1.Trans>
                  </react_1.Th>
                  <react_1.Th>
                    <macro_1.Trans>Actual</macro_1.Trans>
                  </react_1.Th>
                  <react_1.Th>
                    <macro_1.Trans>%</macro_1.Trans>
                  </react_1.Th>

                  <react_1.Th>
                    <macro_1.Trans>Estimated</macro_1.Trans>
                  </react_1.Th>
                  <react_1.Th>
                    <macro_1.Trans>Actual</macro_1.Trans>
                  </react_1.Th>
                </react_1.Tr>
              </react_1.Thead>
              <react_1.Tbody>
                {materials === null || materials === void 0 ? void 0 : materials.map(function (material) {
            var _a, _b, _c, _d, _e, _f;
            var exceedsEstimate = material.quantityIssued &&
                material.quantityIssued > ((_a = material.estimatedQuantity) !== null && _a !== void 0 ? _a : 0);
            var currentUnitCost = (_b = currentUnitCosts[material.itemId]) !== null && _b !== void 0 ? _b : 0;
            var estimatedTotalCost = ((_c = material.estimatedQuantity) !== null && _c !== void 0 ? _c : 0) *
                ((_d = material.unitCost) !== null && _d !== void 0 ? _d : 0);
            var actualTotalCost = ((_e = material.quantityIssued) !== null && _e !== void 0 ? _e : 0) * currentUnitCost;
            return (<react_1.Tr key={material.id} className="border-b border-border">
                      <react_1.Td className="border-r border-border">
                        <react_1.HStack className="w-full justify-start">
                          <react_1.Tooltip>
                            <react_1.TooltipTrigger>
                              <Icons_1.MethodIcon type={material.methodType}/>
                            </react_1.TooltipTrigger>
                            <react_1.TooltipContent>
                              {material.methodType}
                            </react_1.TooltipContent>
                          </react_1.Tooltip>
                          <span>
                            {(0, utils_1.getItemReadableId)(items, material.itemId)}
                          </span>
                        </react_1.HStack>
                      </react_1.Td>
                      <react_1.Td>{material.estimatedQuantity}</react_1.Td>
                      <react_1.Td className={(0, react_1.cn)(exceedsEstimate && "text-red-500")}>
                        {material.methodType === "Make to Order" ? (<Icons_1.MethodIcon type="Make to Order"/>) : (material.quantityIssued)}
                      </react_1.Td>

                      <react_1.Td className={(0, react_1.cn)(exceedsEstimate && "text-red-500")}>
                        {material.methodType !== "Make to Order" &&
                    material.estimatedQuantity &&
                    material.quantityIssued
                    ? percentFormatter.format(material.quantityIssued /
                        material.estimatedQuantity)
                    : null}
                      </react_1.Td>
                      <react_1.Td>
                        {material.methodType === "Make to Order" ? null : (<react_1.VStack spacing={0} className="py-1">
                            <span className="text-sm">
                              {currencyFormatter.format(estimatedTotalCost)}
                            </span>
                            <span className="text-xxs">
                              {currencyFormatter.format((_f = material.unitCost) !== null && _f !== void 0 ? _f : 0)}
                            </span>
                          </react_1.VStack>)}
                      </react_1.Td>
                      <react_1.Td>
                        {material.methodType === "Make to Order" ? null : (<react_1.VStack spacing={0} className="py-1">
                            <span className={(0, react_1.cn)("text-sm", actualTotalCost > estimatedTotalCost &&
                        "text-red-500")}>
                              {currencyFormatter.format(actualTotalCost)}
                            </span>
                            <span className={(0, react_1.cn)("text-xxs", currentUnitCost > material.unitCost &&
                        "text-red-500")}>
                              {currencyFormatter.format(currentUnitCost)}
                            </span>
                          </react_1.VStack>)}
                      </react_1.Td>
                    </react_1.Tr>);
        })}
              </react_1.Tbody>
            </react_1.Table>
          </react_1.TabsContent>
        </react_1.CardContent>
      </react_1.Card>
    </react_1.Tabs>);
};
exports.default = JobEstimatesVsActuals;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
