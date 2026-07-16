"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScrapReasons = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var seedDataDisplayName_1 = require("~/utils/seedDataDisplayName");
var ScrapReason = function (props) {
    var _a;
    var options = (0, exports.useScrapReasons)();
    return (<form_1.Combobox options={options} {...props} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Scrap Reason"}/>);
};
ScrapReason.displayName = "ScrapReason";
exports.default = ScrapReason;
var useScrapReasons = function () {
    var _a;
    var i18n = (0, macro_1.useLingui)().i18n;
    var scrapReasonFetcher = (0, react_router_1.useFetcher)();
    var sharedProductionData = (0, hooks_1.useRouteData)(path_1.path.to.productionDashboard);
    var hasScrapReasonData = sharedProductionData === null || sharedProductionData === void 0 ? void 0 : sharedProductionData.scrapReasons;
    (0, react_1.useMount)(function () {
        if (!hasScrapReasonData)
            scrapReasonFetcher.load(path_1.path.to.api.scrapReasons);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        var dataSource = (_b = (hasScrapReasonData
            ? sharedProductionData.scrapReasons
            : (_a = scrapReasonFetcher.data) === null || _a === void 0 ? void 0 : _a.data)) !== null && _b !== void 0 ? _b : [];
        return dataSource.map(function (c) { return ({
            value: c.id,
            label: (0, seedDataDisplayName_1.translateSeedDisplayName)(c.name, i18n)
        }); });
    }, [
        (_a = scrapReasonFetcher.data) === null || _a === void 0 ? void 0 : _a.data,
        hasScrapReasonData,
        sharedProductionData === null || sharedProductionData === void 0 ? void 0 : sharedProductionData.scrapReasons,
        i18n
    ]);
    return options;
};
exports.useScrapReasons = useScrapReasons;
