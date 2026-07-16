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
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var production_1 = require("~/modules/production");
var ConfigParamsTableModal_1 = require("~/modules/production/ui/Jobs/ConfigParamsTableModal");
var Deadline_1 = require("~/modules/production/ui/Jobs/Deadline");
var jobLabels_1 = require("~/modules/production/ui/Jobs/jobLabels");
var QuantityWithConfigTable_1 = require("~/modules/production/ui/Jobs/QuantityWithConfigTable");
var configTableOverlay_1 = require("../../configTableOverlay");
var MasterWorkOrderForm = function (_a) {
    var _b, _c;
    var initialValues = _a.initialValues, onDismiss = _a.onDismiss, fetcher = _a.fetcher, action = _a.action;
    var permissions = (0, hooks_1.usePermissions)();
    var _d = (0, hooks_1.useUser)(), company = _d.company, defaults = _d.defaults;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var t = (0, macro_1.useLingui)().t;
    var configModal = (0, ConfigParamsTableModal_1.useConfigTableModal)();
    var getDeadlineTypeLabel = (0, jobLabels_1.useDeadlineTypeLabel)();
    var isDisabled = !permissions.can("create", "production");
    var _e = (0, react_2.useState)((_b = initialValues.itemId) !== null && _b !== void 0 ? _b : ""), itemId = _e[0], setItemId = _e[1];
    var _f = (0, react_2.useState)((_c = initialValues.quantity) !== null && _c !== void 0 ? _c : 0), quantity = _f[0], setQuantity = _f[1];
    var _g = (0, react_2.useState)(null), configurationParameters = _g[0], setConfigurationParameters = _g[1];
    var _h = (0, react_2.useState)(null), configTableRows = _h[0], setConfigTableRows = _h[1];
    var _j = (0, react_2.useState)([]), configTablePrimaryKeys = _j[0], setConfigTablePrimaryKeys = _j[1];
    var _k = (0, react_2.useState)(0), configTableTotal = _k[0], setConfigTableTotal = _k[1];
    var onItemChange = function (nextItemId) { return __awaiter(void 0, void 0, void 0, function () {
        var manufacturing, _a, parameters, groups;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    setItemId(nextItemId);
                    setConfigTableRows(null);
                    setConfigTablePrimaryKeys([]);
                    setConfigTableTotal(0);
                    setConfigurationParameters(null);
                    if (!nextItemId || !carbon || !company.id)
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon
                            .from("itemReplenishment")
                            .select("requiresConfiguration")
                            .eq("itemId", nextItemId)
                            .single()];
                case 1:
                    manufacturing = _e.sent();
                    if (!((_b = manufacturing.data) === null || _b === void 0 ? void 0 : _b.requiresConfiguration)) return [3 /*break*/, 3];
                    return [4 /*yield*/, Promise.all([
                            carbon
                                .from("configurationParameter")
                                .select("*")
                                .eq("itemId", nextItemId)
                                .eq("companyId", company.id)
                                // Order so the derived "primary" param (Size) drives the columns.
                                .order("sortOrder", { ascending: true, nullsFirst: false }),
                            carbon
                                .from("configurationParameterGroup")
                                .select("*")
                                .eq("itemId", nextItemId)
                                .eq("companyId", company.id)
                        ])];
                case 2:
                    _a = _e.sent(), parameters = _a[0], groups = _a[1];
                    if (parameters.error || groups.error) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failed to load configuration parameters"], ["Failed to load configuration parameters"]))));
                        return [2 /*return*/];
                    }
                    setConfigurationParameters({
                        parameters: ((_c = parameters.data) !== null && _c !== void 0 ? _c : []),
                        groups: (_d = groups.data) !== null && _d !== void 0 ? _d : []
                    });
                    _e.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var applyConfig = function (data) {
        if (!(0, configTableOverlay_1.isConfigTableOverlaySuccess)(data))
            return;
        setConfigTableRows(data.configuration.configTable);
        setConfigTablePrimaryKeys(data.primaryKeys);
        setConfigTableTotal(data.total);
        if (data.total > 0)
            setQuantity(data.total);
    };
    var openConfigTable = function () {
        if (!itemId)
            return;
        configModal.open({
            itemId: itemId,
            configuration: (0, ConfigParamsTableModal_1.toConfigTableValue)(configTableRows, configTablePrimaryKeys),
            onConfirm: applyConfig
        });
    };
    return (<>
      <form_1.ValidatedForm validator={production_1.masterWorkOrderValidator} method="post" action={action} defaultValues={__assign(__assign({}, initialValues), { locationId: initialValues.locationId || (defaults === null || defaults === void 0 ? void 0 : defaults.locationId) || "" })} fetcher={fetcher} className="flex flex-col h-full">
        <react_1.DrawerHeader>
          <react_1.DrawerTitle>
            <macro_1.Trans>New Master Work Order</macro_1.Trans>
          </react_1.DrawerTitle>
        </react_1.DrawerHeader>
        <react_1.DrawerBody>
          <react_1.VStack spacing={4}>
            <Form_1.Item name="itemId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Style"], ["Style"])))} type="Style" validItemTypes={["Style"]} onChange={function (value) { var _a; return onItemChange((_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : ""); }}/>
            <QuantityWithConfigTable_1.QuantityWithConfigTable name="quantity" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Quantity"], ["Quantity"])))} value={quantity} minValue={0} isReadOnly={configTableTotal > 0} onChange={setQuantity} configTableTotal={configTableTotal} hasConfigurationParameters={!!configurationParameters} onOpenConfigTable={openConfigTable}/>
            <Form_1.Location name="locationId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Location"], ["Location"])))}/>
            <Form_1.DatePicker name="dueDate" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Due Date"], ["Due Date"])))}/>
            <Form_1.Select name="deadlineType" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Deadline Type"], ["Deadline Type"])))} options={production_1.deadlineTypes.map(function (d) { return ({
            value: d,
            label: (<div className="flex gap-1 items-center">
                    {(0, Deadline_1.getDeadlineIcon)(d)}
                    <span>{getDeadlineTypeLabel(d)}</span>
                  </div>)
        }); })}/>
            <Form_1.Hidden name="configuration" value={configTableRows
            ? JSON.stringify({
                configTable: configTableRows,
                configTablePrimaryKeys: configTablePrimaryKeys
            })
            : ""}/>
          </react_1.VStack>
        </react_1.DrawerBody>
        <react_1.DrawerFooter>
          <react_1.HStack>
            <Form_1.Submit isDisabled={isDisabled}>
              <macro_1.Trans>Save</macro_1.Trans>
            </Form_1.Submit>
            <react_1.Button variant="solid" type="button" onClick={onDismiss}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
          </react_1.HStack>
        </react_1.DrawerFooter>
      </form_1.ValidatedForm>
      {configModal.node}
    </>);
};
exports.default = MasterWorkOrderForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
