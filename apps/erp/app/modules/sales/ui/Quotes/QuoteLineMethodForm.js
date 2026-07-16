"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteLineMethodForm = QuoteLineMethodForm;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
function QuoteLineMethodForm() {
    var t = (0, macro_1.useLingui)().t;
    var quoteFetcher = (0, react_router_1.useFetcher)();
    var quoteLineFetcher = (0, react_router_1.useFetcher)();
    // const quotesLoading = quoteFetcher.state === "loading";
    // const quoteLinesLoading = quoteLineFetcher.state === "loading";
    var _a = (0, react_2.useState)(null), quote = _a[0], setQuote = _a[1];
    var _b = (0, react_2.useState)(null), quoteLine = _b[0], setQuoteLine = _b[1];
    (0, react_1.useMount)(function () {
        quoteFetcher.load(path_1.path.to.api.quotes);
    });
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (quote) {
            quoteLineFetcher.load(path_1.path.to.api.quoteLines(quote));
        }
    }, [quote]);
    var quoteOptions = (0, react_2.useMemo)(function () {
        var _a, _b, _c;
        return (_c = (_b = (_a = quoteFetcher.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.map(function (quote) {
            var _a;
            return ({
                label: (<div className="flex justify-start items-center gap-0">
            <span>{quote.quoteId}</span>
            {((_a = quote.revisionId) !== null && _a !== void 0 ? _a : 0) > 0 && (<span className="text-muted-foreground">-{quote.revisionId}</span>)}
          </div>),
                value: quote.id
            });
        })) !== null && _c !== void 0 ? _c : [];
    }, [quoteFetcher.data]);
    var quoteLineOptions = (0, react_2.useMemo)(function () {
        var _a, _b, _c;
        return (_c = (_b = (_a = quoteLineFetcher.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.map(function (quoteLine) {
            var _a;
            return ({
                label: (_a = quoteLine.readableIdWithRevision) !== null && _a !== void 0 ? _a : "",
                value: quoteLine.id
            });
        })) !== null && _c !== void 0 ? _c : [];
    }, [quoteLineFetcher.data]);
    return (<>
      <react_1.VStack spacing={4} className="w-full">
        <form_1.Combobox name="quoteId" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Quote"], ["Quote"])))} options={quoteOptions} placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Select a quote"], ["Select a quote"])))} onChange={function (newValue) {
            if (newValue) {
                setQuote(newValue.value);
                setQuoteLine(null);
            }
        }}/>
        <form_1.SelectControlled name="quoteLineId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Quote Line"], ["Quote Line"])))} options={quoteLineOptions} placeholder={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Select a quote line"], ["Select a quote line"])))} isReadOnly={!quote} onChange={function (newValue) {
            if (newValue) {
                setQuoteLine(newValue.value);
            }
        }}/>
      </react_1.VStack>
      <form_1.Hidden name="sourceId" className="-my-4" value={quoteLine ? "".concat(quote, ":").concat(quoteLine) : ""}/>
    </>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
