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
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var ai_1 = require("react-icons/ai");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Editable_1 = require("~/components/Editable");
var Icons_1 = require("~/components/Icons");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var jobLabels_1 = require("~/modules/production/ui/Jobs/jobLabels");
var productionQuantityLabels_1 = require("~/modules/production/ui/Jobs/productionQuantityLabels");
var styleMethod_service_1 = require("~/modules/items/styleMethod.service");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var production_models_1 = require("../../production.models");
var JobOperationsTable = (0, react_2.memo)(function (_a) {
    var _b;
    var data = _a.data, count = _a.count, jobIdProp = _a.jobId, isPausedProp = _a.isPaused, title = _a.title, disableNavigation = _a.disableNavigation, primaryAction = _a.primaryAction, hideMes = _a.hideMes, showAssignee = _a.showAssignee, disableInlineEditing = _a.disableInlineEditing, quantitiesPath = _a.quantitiesPath, _c = _a.withHeader, withHeader = _c === void 0 ? true : _c;
    var params = (0, react_router_1.useParams)();
    var navigate = (0, react_router_1.useNavigate)();
    var jobId = jobIdProp !== null && jobIdProp !== void 0 ? jobIdProp : params.jobId;
    var t = (0, macro_1.useLingui)().t;
    var people = (0, stores_1.usePeople)()[0];
    var dateFormatter = (0, i18n_1.useDateFormatter)({
        dateStyle: "medium",
        timeStyle: "short"
    });
    var operationTypeLabel = (0, productionQuantityLabels_1.useOperationTypeLabel)();
    var getJobOperationStatusLabel = (0, jobLabels_1.useJobOperationStatusLabel)();
    var styleProcessLabel = (0, jobLabels_1.useStyleProcessLabel)();
    if (!jobId)
        throw new Error("Job ID is required");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.job(jobId));
    var isPaused = isPausedProp !== null && isPausedProp !== void 0 ? isPausedProp : ((_b = routeData === null || routeData === void 0 ? void 0 : routeData.job) === null || _b === void 0 ? void 0 : _b.status) === "Paused";
    var fetcher = (0, react_router_1.useFetcher)();
    var submit = (0, react_router_1.useSubmit)();
    var permissions = (0, hooks_1.usePermissions)();
    // Renders a quantity value with a trigger that jumps to the Process
    // Completions tab, pre-filtered to the given type + this operation.
    var renderQuantityCell = (0, react_2.useCallback)(function (value, type, operationId) {
        if (!quantitiesPath)
            return value;
        return (<react_1.HStack spacing={1}>
          <span className="tabular-nums">{value}</span>
          <react_1.IconButton type="button" size="sm" variant="ghost" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["View process completions"], ["View process completions"])))} icon={<lu_1.LuArrowUpRight />} onClick={function (e) {
                e.stopPropagation();
                navigate("".concat(quantitiesPath, "?filter=type:eq:").concat(type, "&filter=jobOperationId:eq:").concat(operationId));
            }}/>
        </react_1.HStack>);
    }, [navigate, quantitiesPath, t]);
    var onOperationStatusChange = (0, react_2.useCallback)(function (id, status) {
        submit({
            id: id,
            status: status
        }, {
            method: "post",
            action: path_1.path.to.jobOperationStatus,
            navigate: false,
            fetcherKey: "jobOperation:".concat(id)
        });
    }, [submit]);
    var columns = (0, react_2.useMemo)(function () {
        var cols = [
            {
                accessorKey: "description",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Description"], ["Description"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.HStack className="py-1">
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton size="sm" variant="ghost" aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Change status"], ["Change status"])))} icon={<Icons_1.OperationStatusIcon status={isPaused ? "Paused" : row.original.status}/>}/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent align="start">
                <react_1.DropdownMenuRadioGroup value={row.original.status} onValueChange={function (status) {
                            return onOperationStatusChange(row.original.id, status);
                        }}>
                  {production_models_1.jobOperationStatus.map(function (status) { return (<react_1.DropdownMenuRadioItem key={status} value={status}>
                      <react_1.DropdownMenuIcon icon={<Icons_1.OperationStatusIcon status={status}/>}/>
                      <span>{getJobOperationStatusLabel(status)}</span>
                    </react_1.DropdownMenuRadioItem>); })}
                </react_1.DropdownMenuRadioGroup>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
            {disableNavigation ? (<span className="max-w-[260px] truncate">
                {styleProcessLabel(row.original.description, (0, styleMethod_service_1.isStyleCuttingOperation)({
                                tags: row.original.tags,
                                customFields: row.original.customFields
                            }))}
              </span>) : (<components_1.Hyperlink to={"".concat(path_1.path.to.jobProductionEvents(jobId), "?filter=jobOperationId:eq:").concat(row.original.id)} className="max-w-[260px] truncate">
                {styleProcessLabel(row.original.description, (0, styleMethod_service_1.isStyleCuttingOperation)({
                                tags: row.original.tags,
                                customFields: row.original.customFields
                            }))}
              </components_1.Hyperlink>)}
          </react_1.HStack>);
                },
                meta: {
                    icon: <lu_1.LuClipboardList />
                }
            },
            {
                id: "mes",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["MES"], ["MES"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.Button size="sm" variant="secondary" leftIcon={<lu_1.LuPlay />} asChild>
            <a href={path_1.path.to.external.mesJobOperation(row.original.id)}>
              {t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Open"], ["Open"])))}
            </a>
          </react_1.Button>);
                },
                meta: {
                    icon: <lu_1.LuPlay />
                }
            },
            {
                id: "item",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Item"], ["Item"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (_c = (_b = row.original.jobMakeMethod) === null || _b === void 0 ? void 0 : _b.item) === null || _c === void 0 ? void 0 : _c.readableIdWithRevision;
                },
                meta: {
                    icon: <ai_1.AiOutlinePartition />
                }
            },
            {
                accessorKey: "operationType",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Operation Type"], ["Operation Type"]))),
                cell: function (item) { var _a; return operationTypeLabel((_a = item.getValue()) !== null && _a !== void 0 ? _a : ""); },
                meta: {
                    filter: {
                        type: "static",
                        options: shared_1.operationTypes.map(function (value) { return ({
                            value: value,
                            label: operationTypeLabel(value)
                        }); })
                    },
                    icon: <lu_1.LuWrench />
                }
            },
            {
                accessorKey: "targetQuantity",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Quantity"], ["Quantity"]))),
                cell: function (item) { var _a, _b; return (_b = (_a = item.getValue()) !== null && _a !== void 0 ? _a : item.row.original.operationQuantity) !== null && _b !== void 0 ? _b : 0; },
                meta: {
                    icon: <lu_1.LuHash />
                }
            },
            {
                accessorKey: "quantityComplete",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Qty. Complete"], ["Qty. Complete"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return renderQuantityCell((_b = row.original.quantityComplete) !== null && _b !== void 0 ? _b : 0, "Production", row.original.id);
                },
                meta: {
                    icon: <lu_1.LuCircleCheckBig />
                }
            },
            {
                accessorKey: "quantityReworked",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Qty. Reworked"], ["Qty. Reworked"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return renderQuantityCell((_b = row.original.quantityReworked) !== null && _b !== void 0 ? _b : 0, "Rework", row.original.id);
                },
                meta: {
                    icon: <lu_1.LuRotateCcw />
                }
            },
            {
                accessorKey: "quantityScrapped",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Qty. Scrapped"], ["Qty. Scrapped"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return renderQuantityCell((_b = row.original.quantityScrapped) !== null && _b !== void 0 ? _b : 0, "Scrap", row.original.id);
                },
                meta: {
                    icon: <lu_1.LuTriangleAlert />
                }
            }
        ];
        var withoutMes = hideMes ? cols.filter(function (c) { return c.id !== "mes"; }) : cols;
        if (!showAssignee)
            return withoutMes;
        return __spreadArray(__spreadArray([], withoutMes, true), [
            {
                id: "assignee",
                header: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Assignee"], ["Assignee"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<components_1.Assignee id={(_b = row.original.id) !== null && _b !== void 0 ? _b : ""} table="jobOperation" value={(_c = row.original.assignee) !== null && _c !== void 0 ? _c : ""} variant="button" size="sm"/>);
                },
                meta: {
                    icon: <lu_1.LuUser />,
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: employee.name
                        }); })
                    }
                }
            },
            {
                accessorKey: "assignedAt",
                header: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Assigned At"], ["Assigned At"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return row.original.assignedAt
                        ? dateFormatter.format(new Date(row.original.assignedAt))
                        : "—";
                },
                meta: {
                    icon: <lu_1.LuClock />
                }
            }
        ], false);
    }, [
        dateFormatter,
        disableNavigation,
        getJobOperationStatusLabel,
        hideMes,
        isPaused,
        jobId,
        onOperationStatusChange,
        operationTypeLabel,
        people,
        renderQuantityCell,
        showAssignee,
        styleProcessLabel,
        t
    ]);
    var carbon = (0, auth_1.useCarbon)().carbon;
    var userId = (0, hooks_1.useUser)().id;
    var onCellEdit = (0, react_2.useCallback)(function (id, value, row) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!carbon)
                        throw new Error("Carbon client not found");
                    return [4 /*yield*/, carbon
                            .from("jobOperation")
                            .update((_a = {},
                            _a[id] = value,
                            _a.updatedBy = userId,
                            _a))
                            .eq("id", row.id)];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    }); }, [carbon, userId]);
    var editableComponents = (0, react_2.useMemo)(function () {
        return {
            operationQuantity: (0, Editable_1.EditableNumber)(onCellEdit),
            quantityScrapped: (0, Editable_1.EditableNumber)(onCellEdit),
            quantityComplete: (0, Editable_1.EditableNumber)(onCellEdit),
            quantityReworked: (0, Editable_1.EditableNumber)(onCellEdit)
        };
    }, [onCellEdit]);
    var pendingItems = usePendingItems();
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var optimisticData = (0, react_2.useMemo)(function () {
        if (pendingItems.length === 0)
            return data;
        return data.map(function (item) {
            var pendingItem = pendingItems.find(function (pendingItem) { return pendingItem.id === item.id; });
            if (pendingItem) {
                return __assign(__assign({}, item), { status: pendingItem.status });
            }
            return item;
        });
    }, [pendingItems.length]);
    return (<components_1.Table compact count={count} columns={columns} data={optimisticData} primaryAction={primaryAction !== null && primaryAction !== void 0 ? primaryAction : (data.length > 0 && permissions.can("update", "production") ? (<fetcher.Form action={path_1.path.to.jobRecalculate(jobId)} method="post">
            <react_1.Button leftIcon={<lu_1.LuRefreshCcwDot />} isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"} type="submit" variant="secondary">
              Recalculate
            </react_1.Button>
          </fetcher.Form>) : undefined)} editableComponents={editableComponents} title={title !== null && title !== void 0 ? title : t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Operations"], ["Operations"])))} withHeader={withHeader} withInlineEditing={!disableInlineEditing && permissions.can("update", "production")}/>);
});
JobOperationsTable.displayName = "JobOperationsTable";
exports.default = JobOperationsTable;
var usePendingItems = function () {
    return (0, react_router_1.useFetchers)()
        .filter(function (fetcher) {
        return fetcher.formAction === path_1.path.to.jobOperationStatus;
    })
        .reduce(function (acc, fetcher) {
        var id = fetcher.formData.get("id");
        var status = fetcher.formData.get("status");
        if (id && status) {
            var newItem = {
                id: id,
                status: status
            };
            return __spreadArray(__spreadArray([], acc, true), [newItem], false);
        }
        return acc;
    }, []);
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14;
