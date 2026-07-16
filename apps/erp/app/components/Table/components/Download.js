"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var json_2_csv_1 = require("json-2-csv");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var stores_1 = require("~/stores");
var Download = function (_a) {
    var data = _a.data, columnAccessors = _a.columnAccessors, columnOrder = _a.columnOrder, columnVisibility = _a.columnVisibility;
    var t = (0, macro_1.useLingui)().t;
    var items = (0, stores_1.useItems)()[0];
    var suppliers = (0, stores_1.useSuppliers)()[0];
    var people = (0, stores_1.usePeople)()[0];
    var customers = (0, stores_1.useCustomers)()[0];
    // Maps an id column's accessor key -> a lookup of record id -> name, so the
    // CSV can show the human-readable name instead of the raw id.
    var idNameMaps = (0, react_2.useMemo)(function () { return ({
        itemId: new Map(items.map(function (i) { return [i.id, i.name]; })),
        supplierId: new Map(suppliers.map(function (s) { return [s.id, s.name]; })),
        employeeId: new Map(people.map(function (p) { return [p.id, p.name]; })),
        customerId: new Map(customers.map(function (c) { return [c.id, c.name]; }))
    }); }, [items, suppliers, people, customers]);
    // The visible columns, in the current view's order. The column id doubles as
    // the data accessor key; columns absent from columnAccessors (selection,
    // expand, actions) are dropped.
    var exportColumns = (0, react_2.useMemo)(function () {
        var order = columnOrder.length
            ? columnOrder
            : Object.keys(columnAccessors);
        return order.filter(function (id) { return id in columnAccessors && columnVisibility[id] !== false; });
    }, [columnOrder, columnVisibility, columnAccessors]);
    var onClick = (0, react_2.useCallback)(function () {
        if (!(data === null || data === void 0 ? void 0 : data.length)) {
            return;
        }
        // Build label-keyed rows so json2csv emits the view's header labels, in the
        // view's column order, substituting names for id columns.
        var rows = data.map(function (row) {
            var _a;
            var out = {};
            for (var _i = 0, exportColumns_1 = exportColumns; _i < exportColumns_1.length; _i++) {
                var key = exportColumns_1[_i];
                var raw = row[key];
                var map = idNameMaps[key];
                out[columnAccessors[key]] =
                    map && raw != null ? ((_a = map.get(String(raw))) !== null && _a !== void 0 ? _a : raw) : raw;
            }
            return out;
        });
        var csvData = (0, json_2_csv_1.json2csv)(rows, { emptyFieldValue: "" });
        // Create a CSV file and allow the user to download it
        var blob = new Blob([csvData], { type: "text/csv" });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "data.csv";
        document.body.appendChild(a);
        a.click();
    }, [data, exportColumns, idNameMaps, columnAccessors]);
    if (!(data === null || data === void 0 ? void 0 : data.length)) {
        return null;
    }
    return (<react_1.Tooltip>
      <react_1.TooltipTrigger asChild>
        <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Download CSV"], ["Download CSV"])))} title={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Download CSV"], ["Download CSV"])))} variant={"ghost"} icon={<lu_1.LuDownload />} className={"!border-dashed border-border"} onClick={onClick}/>
      </react_1.TooltipTrigger>
      <react_1.TooltipContent>
        <p>
          <macro_1.Trans>Download CSV</macro_1.Trans>
        </p>
      </react_1.TooltipContent>
    </react_1.Tooltip>);
};
exports.default = Download;
var templateObject_1, templateObject_2;
