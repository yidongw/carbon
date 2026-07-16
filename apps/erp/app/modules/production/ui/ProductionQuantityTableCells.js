"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionQuantityTableJobCell = ProductionQuantityTableJobCell;
exports.ProductionQuantityTableItemCell = ProductionQuantityTableItemCell;
exports.ProductionQuantityTableQuantityCell = ProductionQuantityTableQuantityCell;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var components_1 = require("~/components");
var Overlay_1 = require("~/components/Overlay");
var productionQuantityDisplay_utils_1 = require("~/modules/production/productionQuantityDisplay.utils");
var path_1 = require("~/utils/path");
function stopRowNavigation(event) {
    event.stopPropagation();
}
function ProductionQuantityTableJobCell(_a) {
    var row = _a.row;
    var jobInternalId = (0, productionQuantityDisplay_utils_1.getJobInternalId)(row);
    var label = (0, productionQuantityDisplay_utils_1.getJobReadableId)(row);
    if (!jobInternalId) {
        return <span className="font-mono text-sm font-medium">{label}</span>;
    }
    return (<components_1.Hyperlink to={path_1.path.to.job(jobInternalId)} className="font-mono text-sm font-medium" onClick={stopRowNavigation}>
      {label}
    </components_1.Hyperlink>);
}
function ProductionQuantityTableItemCell(_a) {
    var row = _a.row;
    var itemInternalId = (0, productionQuantityDisplay_utils_1.getItemInternalId)(row);
    var readableId = (0, productionQuantityDisplay_utils_1.getItemReadableIdWithRevision)(row);
    var name = (0, productionQuantityDisplay_utils_1.getItemName)(row) || "—";
    var content = (<react_1.VStack spacing={0}>
      <span className="text-sm font-medium">{readableId}</span>
      <div className="w-full truncate text-muted-foreground text-xs">
        {name}
      </div>
    </react_1.VStack>);
    if (!itemInternalId) {
        return content;
    }
    return (<components_1.Hyperlink to={path_1.path.to.part(itemInternalId)} onClick={stopRowNavigation}>
      {content}
    </components_1.Hyperlink>);
}
function ProductionQuantityTableQuantityCell(_a) {
    var _b;
    var row = _a.row, configurableItemIds = _a.configurableItemIds, _c = _a.reportKind, reportKind = _c === void 0 ? "productionQuantity" : _c;
    var t = (0, macro_1.useLingui)().t;
    var openOverlay = (0, Overlay_1.useOverlay)().openOverlay;
    var itemId = (0, productionQuantityDisplay_utils_1.getItemInternalId)(row);
    var quantity = (_b = row.quantity) !== null && _b !== void 0 ? _b : 0;
    var showConfiguredQuantityUi = (0, productionQuantityDisplay_utils_1.hasConfigurationTable)(row.configuration) ||
        Boolean(itemId && (configurableItemIds === null || configurableItemIds === void 0 ? void 0 : configurableItemIds.has(itemId)));
    var openConfigTable = function (event) {
        event.stopPropagation();
        if (!itemId)
            return;
        openOverlay(Overlay_1.overlay.to.itemConfigTable({ itemId: itemId, recordId: row.id, reportKind: reportKind }, {
            configuration: row.configuration !== undefined && row.configuration !== null
                ? row.configuration
                : undefined
        }));
    };
    if (!showConfiguredQuantityUi) {
        return <span className="tabular-nums">{quantity}</span>;
    }
    return (<react_1.HStack spacing={1}>
      <span className="tabular-nums">{quantity}</span>
      <react_1.IconButton type="button" icon={<lu_1.LuTable size="1em" strokeWidth={3}/>} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["View configuration parameters"], ["View configuration parameters"])))} size="sm" variant="secondary" className={(0, react_1.cn)((0, productionQuantityDisplay_utils_1.hasConfigurationTable)(row.configuration) &&
            "text-emerald-500 hover:text-emerald-500")} onClick={openConfigTable}/>
    </react_1.HStack>);
}
var templateObject_1;
