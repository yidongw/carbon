"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var components_1 = require("~/components");
var productionQuantityLabels_1 = require("~/modules/production/ui/Jobs/productionQuantityLabels");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var utils_1 = require("./utils");
var MethodOperationsTable = (0, react_1.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var operationTypeLabel = (0, productionQuantityLabels_1.useOperationTypeLabel)();
    var parts = (0, stores_1.useParts)();
    var tools = (0, stores_1.useTools)();
    var items = (0, react_1.useMemo)(function () { return __spreadArray(__spreadArray([], parts, true), tools, true); }, [parts, tools]);
    var columns = (0, react_1.useMemo)(function () {
        return [
            {
                accessorKey: "description",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Description"], ["Description"]))),
                cell: function (_a) {
                    var _b, _c, _d, _e, _f;
                    var row = _a.row;
                    return (<components_1.Hyperlink to={(0, utils_1.getPathToMakeMethod)(
                        // @ts-ignore
                        (_c = (_b = row.original.makeMethod) === null || _b === void 0 ? void 0 : _b.item) === null || _c === void 0 ? void 0 : _c.type, 
                        // @ts-ignore
                        (_e = (_d = row.original.makeMethod) === null || _d === void 0 ? void 0 : _d.item) === null || _e === void 0 ? void 0 : _e.id, 
                        // @ts-ignore
                        (_f = row.original.makeMethod) === null || _f === void 0 ? void 0 : _f.id)} className="max-w-[260px] truncate">
              {row.original.description}
            </components_1.Hyperlink>);
                }
            },
            {
                accessorKey: "makeMethod.item.readableIdWithRevision",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Item ID"], ["Item ID"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    // @ts-ignore
                    return (_c = (_b = row.original.makeMethod) === null || _b === void 0 ? void 0 : _b.item) === null || _c === void 0 ? void 0 : _c.readableIdWithRevision;
                },
                meta: {
                    filter: {
                        type: "static",
                        options: items === null || items === void 0 ? void 0 : items.map(function (item) { return ({
                            value: item.readableIdWithRevision,
                            label: item.readableIdWithRevision
                        }); })
                    }
                }
            },
            {
                accessorKey: "operationType",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Operation Type"], ["Operation Type"]))),
                cell: function (item) { var _a; return operationTypeLabel((_a = item.getValue()) !== null && _a !== void 0 ? _a : ""); },
                meta: {
                    filter: {
                        type: "static",
                        options: shared_1.operationTypes.map(function (value) { return ({
                            value: value,
                            label: operationTypeLabel(value)
                        }); })
                    }
                }
            },
            {
                accessorKey: "setupTime",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Setup Time"], ["Setup Time"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return "".concat(row.original.setupTime, " ").concat(row.original.setupUnit);
                }
            },
            {
                accessorKey: "laborTime",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Labor Time"], ["Labor Time"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return "".concat(row.original.laborTime, " ").concat(row.original.laborUnit);
                }
            },
            {
                accessorKey: "machineTime",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Machine Time"], ["Machine Time"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return "".concat(row.original.machineTime, " ").concat(row.original.machineUnit);
                }
            }
        ];
    }, [items, operationTypeLabel, t]);
    return (<components_1.Table count={count} columns={columns} data={data} title={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Method Operations"], ["Method Operations"])))}/>);
});
MethodOperationsTable.displayName = "MethodOperationsTable";
exports.default = MethodOperationsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
