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
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var components_1 = require("~/components");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var utils_1 = require("./utils");
var MethodMaterialsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var parts = (0, stores_1.useParts)();
    var tools = (0, stores_1.useTools)();
    var items = (0, react_2.useMemo)(function () { return __spreadArray(__spreadArray([], parts, true), tools, true); }, [parts, tools]);
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "makeMethod.item.readableIdWithRevision",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Method Id"], ["Method Id"]))),
                cell: function (_a) {
                    var _b, _c, _d, _e, _f, _g, _h;
                    var row = _a.row;
                    return (<react_1.HStack className="py-1">
              <components_1.Hyperlink to={(0, utils_1.getPathToMakeMethod)(
                        // @ts-ignore
                        (_c = (_b = row.original.makeMethod) === null || _b === void 0 ? void 0 : _b.item) === null || _c === void 0 ? void 0 : _c.type, 
                        // @ts-ignore
                        (_e = (_d = row.original.makeMethod) === null || _d === void 0 ? void 0 : _d.item) === null || _e === void 0 ? void 0 : _e.id, 
                        // @ts-ignore
                        (_f = row.original.makeMethod) === null || _f === void 0 ? void 0 : _f.id)} className="max-w-[260px] truncate">
                {/* @ts-ignore */}
                {(_h = (_g = row.original.makeMethod) === null || _g === void 0 ? void 0 : _g.item) === null || _h === void 0 ? void 0 : _h.readableIdWithRevision}
              </components_1.Hyperlink>
            </react_1.HStack>);
                }
            },
            {
                accessorKey: "itemReadableIdWithRevision",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Material ID"], ["Material ID"]))),
                cell: function (item) { return item.getValue(); },
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
                accessorKey: "item.name",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Description"], ["Description"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return (_b = row.original.item) === null || _b === void 0 ? void 0 : _b.name;
                }
            },
            {
                accessorKey: "methodType",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Method Type"], ["Method Type"]))),
                cell: function (item) { return (<react_1.Badge variant="secondary">
              <components_1.MethodIcon type={item.getValue()} className="mr-2"/>
              <span>{item.getValue()}</span>
            </react_1.Badge>); },
                meta: {
                    filter: {
                        type: "static",
                        options: shared_1.methodType.map(function (value) { return ({
                            value: value,
                            label: (<react_1.Badge variant="secondary">
                    <components_1.MethodIcon type={value} className="mr-2"/>
                    <span>{value}</span>
                  </react_1.Badge>)
                        }); })
                    }
                }
            },
            {
                accessorKey: "itemType",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Type"], ["Type"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.Badge variant="secondary">
              <components_1.MethodItemTypeIcon type={row.original.itemType} className="mr-2"/>
              <span>{row.original.itemType}</span>
            </react_1.Badge>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: shared_1.methodItemType.map(function (type) { return ({
                            label: (<react_1.HStack spacing={2}>
                    <components_1.MethodItemTypeIcon type={type}/>
                    <span>{type}</span>
                  </react_1.HStack>),
                            value: type
                        }); })
                    }
                }
            },
            {
                accessorKey: "unitOfMeasureCode",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["UoM"], ["UoM"]))),
                cell: function (item) { return item.getValue(); }
            },
            {
                accessorKey: "quantity",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Qty. per Parent"], ["Qty. per Parent"]))),
                cell: function (item) { return item.getValue(); }
            }
        ];
    }, [items, t]);
    return (<components_1.Table count={count} columns={columns} data={data} title={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Method Materials"], ["Method Materials"])))}/>);
});
MethodMaterialsTable.displayName = "MethodMaterialsTable";
exports.default = MethodMaterialsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
