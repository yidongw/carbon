"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierSubcontractPricingFields = SupplierSubcontractPricingFields;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
function SupplierSubcontractPricingFields(_a) {
    var _this = this;
    var _b;
    var jobOperationId = _a.jobOperationId, supplierProcessId = _a.supplierProcessId, isDisabled = _a.isDisabled;
    var t = (0, macro_1.useLingui)().t;
    var currencyFormatter = (0, hooks_1.useCurrencyFormatter)();
    var baseCurrency = (_b = currencyFormatter.resolvedOptions().currency) !== null && _b !== void 0 ? _b : "USD";
    var _c = (0, react_2.useState)(null), pricing = _c[0], setPricing = _c[1];
    var _d = (0, react_2.useState)(false), loading = _d[0], setLoading = _d[1];
    var _e = (0, react_2.useState)(null), error = _e[0], setError = _e[1];
    var _f = (0, react_2.useState)(false), edited = _f[0], setEdited = _f[1];
    var loadIdRef = (0, react_2.useRef)(0);
    var _g = (0, react_2.useState)(0), operationUnitCost = _g[0], setOperationUnitCost = _g[1];
    var _h = (0, react_2.useState)(0), operationMinimumCost = _h[0], setOperationMinimumCost = _h[1];
    (0, react_2.useEffect)(function () {
        if (!jobOperationId || !supplierProcessId) {
            setPricing(null);
            setEdited(false);
            return;
        }
        var loadId = ++loadIdRef.current;
        setLoading(true);
        setError(null);
        setEdited(false);
        void fetch(path_1.path.to.api.operationSubcontractPricing(jobOperationId, supplierProcessId))
            .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
            var body;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!res.ok) return [3 /*break*/, 2];
                        return [4 /*yield*/, res.json()];
                    case 1:
                        body = (_b.sent());
                        throw new Error((_a = body.error) !== null && _a !== void 0 ? _a : "Failed to load pricing");
                    case 2: return [2 /*return*/, res.json()];
                }
            });
        }); })
            .then(function (data) {
            if (loadId !== loadIdRef.current)
                return;
            var next = data.pricing;
            setPricing(next);
            setOperationUnitCost(next.operationUnitCost);
            setOperationMinimumCost(next.operationMinimumCost);
        })
            .catch(function (err) {
            if (loadId !== loadIdRef.current)
                return;
            setError(err.message);
            setPricing(null);
        })
            .finally(function () {
            if (loadId === loadIdRef.current) {
                setLoading(false);
            }
        });
    }, [jobOperationId, supplierProcessId]);
    if (!supplierProcessId) {
        return null;
    }
    if (loading) {
        return (<p className="text-sm text-muted-foreground">
        <macro_1.Trans>Loading subcontract pricing…</macro_1.Trans>
      </p>);
    }
    if (error) {
        return <p className="text-sm text-destructive">{error}</p>;
    }
    if (!pricing) {
        return null;
    }
    var markEdited = function () { return setEdited(true); };
    return (<react_1.VStack spacing={3} className="w-full rounded-lg border border-border/70 p-3">
      <p className="text-xs text-muted-foreground">
        {pricing.source === "snapshot" ? (<macro_1.Trans>
            Using saved subcontract pricing for this supplier on this job.
          </macro_1.Trans>) : (<macro_1.Trans>
            Pricing from the supplier process (first quantity on this job).
          </macro_1.Trans>)}
      </p>
      <div className="grid w-full grid-cols-2 gap-x-8 gap-y-4 items-start">
        <div className="min-w-0">
          <Form_1.NumberControlled name="operationUnitCost" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Unit Price"], ["Unit Price"])))} isOptional={false} minValue={0} value={operationUnitCost} isDisabled={isDisabled} formatOptions={{
            style: "currency",
            currency: baseCurrency
        }} onChange={function (value) {
            markEdited();
            setOperationUnitCost(value);
        }}/>
        </div>
        <div className="min-w-0">
          <Form_1.NumberControlled name="operationMinimumCost" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Minimum Cost"], ["Minimum Cost"])))} isOptional={false} minValue={0} value={operationMinimumCost} isDisabled={isDisabled} formatOptions={{
            style: "currency",
            currency: baseCurrency
        }} onChange={function (value) {
            markEdited();
            setOperationMinimumCost(value);
        }}/>
        </div>
      </div>
      <Form_1.Hidden name="snapshotPricingEdited" value={edited ? "1" : "0"}/>
    </react_1.VStack>);
}
var templateObject_1, templateObject_2;
