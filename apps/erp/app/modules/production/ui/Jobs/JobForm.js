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
var lu_1 = require("react-icons/lu");
var Form_1 = require("~/components/Form");
var Overlay_1 = require("~/components/Overlay");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var configTableOverlay_1 = require("../../configTableOverlay");
var production_models_1 = require("../../production.models");
var ConfigParamsTableModal_1 = require("./ConfigParamsTableModal");
var Deadline_1 = require("./Deadline");
var jobLabels_1 = require("./jobLabels");
var QuantityWithConfigTable_1 = require("./QuantityWithConfigTable");
var JobForm = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
    var initialValues = _a.initialValues;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var getDeadlineTypeLabel = (0, jobLabels_1.useDeadlineTypeLabel)();
    var company = (0, hooks_1.useUser)().company;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _0 = (0, react_2.useState)((_b = initialValues.itemType) !== null && _b !== void 0 ? _b : "Item"), type = _0[0], setType = _0[1];
    var isLocked = (0, production_models_1.isJobLocked)(initialValues.status);
    var isDisabled = isLocked;
    var bulkInitialValues = __assign(__assign({}, initialValues), { jobCount: 1, quantityPerJob: (_c = initialValues.quantity) !== null && _c !== void 0 ? _c : 1, scrapQuantityPerJob: (_d = initialValues.scrapQuantity) !== null && _d !== void 0 ? _d : 0, dueDateOfFirstJob: (_e = initialValues.dueDate) !== null && _e !== void 0 ? _e : "", dueDateOfLastJob: (_f = initialValues.dueDate) !== null && _f !== void 0 ? _f : "", locationId: (_g = initialValues.locationId) !== null && _g !== void 0 ? _g : "", customerId: (_h = initialValues.customerId) !== null && _h !== void 0 ? _h : "", modelUploadId: (_j = initialValues.modelUploadId) !== null && _j !== void 0 ? _j : "", configuration: (_k = initialValues.configuration) !== null && _k !== void 0 ? _k : {} });
    var _1 = (0, react_2.useState)({
        itemId: (_l = initialValues.itemId) !== null && _l !== void 0 ? _l : "",
        description: (_m = initialValues.description) !== null && _m !== void 0 ? _m : "",
        quantity: (_o = initialValues.quantity) !== null && _o !== void 0 ? _o : 0,
        jobCount: 1,
        quantityPerJob: (_p = initialValues.quantity) !== null && _p !== void 0 ? _p : 1,
        scrapQuantity: (_q = initialValues.scrapQuantity) !== null && _q !== void 0 ? _q : 0,
        scrapPercentage: ((_r = initialValues.quantity) !== null && _r !== void 0 ? _r : 0) === 0
            ? 0
            : ((_s = initialValues.scrapQuantity) !== null && _s !== void 0 ? _s : 0) / ((_t = initialValues.quantity) !== null && _t !== void 0 ? _t : 1),
        uom: (_u = initialValues.unitOfMeasureCode) !== null && _u !== void 0 ? _u : "",
        modelUploadId: (_v = initialValues.modelUploadId) !== null && _v !== void 0 ? _v : null
    }), itemData = _1[0], setItemData = _1[1];
    var openOverlay = (0, Overlay_1.useOverlay)().openOverlay;
    var _2 = (0, react_2.useState)(null), configurationParameters = _2[0], setConfigurationParameters = _2[1];
    var _3 = (0, react_2.useState)(null), configTableRows = _3[0], setConfigTableRows = _3[1];
    var _4 = (0, react_2.useState)([]), configTablePrimaryKeys = _4[0], setConfigTablePrimaryKeys = _4[1];
    var _5 = (0, react_2.useState)(0), configTableTotal = _5[0], setConfigTableTotal = _5[1];
    var _6 = (0, react_2.useState)("single"), configTableMode = _6[0], setConfigTableMode = _6[1];
    var isCustomer = permissions.is("customer");
    var isEditing = initialValues.id !== undefined;
    var onTypeChange = function (t) {
        setType(t);
        setItemData({
            itemId: "",
            description: "",
            uom: "EA",
            quantity: 1,
            jobCount: 1,
            quantityPerJob: 1,
            scrapPercentage: 0,
            scrapQuantity: 0,
            modelUploadId: null
        });
        setConfigTableRows(null);
        setConfigTablePrimaryKeys([]);
        setConfigTableTotal(0);
    };
    var handleConfigTableSubmit = function (rows, total, primaryKeys) {
        setConfigTableRows(rows);
        setConfigTablePrimaryKeys(primaryKeys);
        setConfigTableTotal(total);
        if (configTableMode === "bulk") {
            setItemData(function (prev) { return (__assign(__assign({}, prev), { quantityPerJob: total, scrapQuantity: Math.ceil(total * prev.scrapPercentage) })); });
        }
        else if (total > 0) {
            setItemData(function (prev) { return (__assign(__assign({}, prev), { quantity: total, quantityPerJob: total, scrapQuantity: Math.ceil(total * prev.scrapPercentage) })); });
        }
    };
    var onItemChange = function (itemId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, item, manufacturing, _b, parameters, groups;
        var _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    if (!itemId)
                        return [2 /*return*/];
                    if (!carbon || !company.id)
                        return [2 /*return*/];
                    setConfigTableRows(null);
                    setConfigTablePrimaryKeys([]);
                    setConfigTableTotal(0);
                    setItemData(function (prev) { return (__assign(__assign({}, prev), { jobCount: 1 })); });
                    return [4 /*yield*/, Promise.all([
                            carbon
                                .from("item")
                                .select("name, readableIdWithRevision, defaultMethodType, type, unitOfMeasureCode, modelUploadId")
                                .eq("id", itemId)
                                .eq("companyId", company.id)
                                .single(),
                            carbon
                                .from("itemReplenishment")
                                .select("lotSize, leadTime, scrapPercentage, requiresConfiguration")
                                .eq("itemId", itemId)
                                .single()
                        ])];
                case 1:
                    _a = _g.sent(), item = _a[0], manufacturing = _a[1];
                    setItemData(function (current) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                        var lotSize = (_b = (_a = manufacturing === null || manufacturing === void 0 ? void 0 : manufacturing.data) === null || _a === void 0 ? void 0 : _a.lotSize) !== null && _b !== void 0 ? _b : 0;
                        var scrapPercentage = (_d = (_c = manufacturing === null || manufacturing === void 0 ? void 0 : manufacturing.data) === null || _c === void 0 ? void 0 : _c.scrapPercentage) !== null && _d !== void 0 ? _d : 0;
                        var quantity = lotSize === 0 ? current.quantity : lotSize;
                        var quantityPerJob = lotSize === 0 ? current.quantityPerJob : lotSize;
                        return {
                            itemId: itemId,
                            description: (_f = (_e = item.data) === null || _e === void 0 ? void 0 : _e.name) !== null && _f !== void 0 ? _f : "",
                            uom: (_h = (_g = item.data) === null || _g === void 0 ? void 0 : _g.unitOfMeasureCode) !== null && _h !== void 0 ? _h : "EA",
                            quantity: quantity,
                            jobCount: current.jobCount,
                            quantityPerJob: quantityPerJob,
                            modelUploadId: (_k = (_j = item.data) === null || _j === void 0 ? void 0 : _j.modelUploadId) !== null && _k !== void 0 ? _k : null,
                            scrapPercentage: scrapPercentage,
                            scrapQuantity: Math.ceil(quantity * scrapPercentage)
                        };
                    });
                    if ((_c = item.data) === null || _c === void 0 ? void 0 : _c.type) {
                        setType(item.data.type);
                    }
                    if (!((_d = manufacturing.data) === null || _d === void 0 ? void 0 : _d.requiresConfiguration)) return [3 /*break*/, 3];
                    return [4 /*yield*/, Promise.all([
                            carbon
                                .from("configurationParameter")
                                .select("*")
                                .eq("itemId", itemId)
                                .eq("companyId", company.id),
                            carbon
                                .from("configurationParameterGroup")
                                .select("*")
                                .eq("itemId", itemId)
                                .eq("companyId", company.id)
                        ])];
                case 2:
                    _b = _g.sent(), parameters = _b[0], groups = _b[1];
                    if (parameters.error || groups.error) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failed to load configuration parameters"], ["Failed to load configuration parameters"]))));
                        return [2 /*return*/];
                    }
                    setConfigurationParameters({
                        parameters: (_e = parameters.data) !== null && _e !== void 0 ? _e : [],
                        groups: (_f = groups.data) !== null && _f !== void 0 ? _f : []
                    });
                    return [3 /*break*/, 4];
                case 3:
                    setConfigurationParameters(null);
                    _g.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var configModal = (0, ConfigParamsTableModal_1.useConfigTableModal)();
    var applyConfig = function (data) {
        if (!(0, configTableOverlay_1.isConfigTableOverlaySuccess)(data))
            return;
        handleConfigTableSubmit(data.configuration.configTable, data.total, data.primaryKeys);
    };
    var openConfigTable = function (mode) {
        if (!itemData.itemId)
            return;
        setConfigTableMode(mode);
        // Editing an existing job: the job's saved config is server-owned, so keep
        // the server-confirm jobConfigTable overlay.
        if (isEditing && initialValues.id) {
            openOverlay(Overlay_1.overlay.to.jobConfigTable({ jobId: initialValues.id }), {
                onSuccess: applyConfig
            });
            return;
        }
        // Creating: the config is an in-memory draft applied back to this form, so
        // use a local modal rather than the overlay system.
        configModal.open({
            itemId: itemData.itemId,
            configuration: (0, ConfigParamsTableModal_1.toConfigTableValue)(configTableRows, configTablePrimaryKeys),
            onConfirm: applyConfig
        });
    };
    return (<>
      <react_1.Tabs defaultValue="job">
        <react_1.VStack className="w-full items-center relative">
          {!isEditing && (<react_1.TabsList className="absolute top-6 right-4 z-50">
              <react_1.TabsTrigger value="job">
                <lu_1.LuDiamond className="mr-1"/>
                <macro_1.Trans>Single Job</macro_1.Trans>
              </react_1.TabsTrigger>
              <react_1.TabsTrigger value="bulk">
                <lu_1.LuLayers className="mr-1"/>
                <macro_1.Trans>Many Jobs</macro_1.Trans>
              </react_1.TabsTrigger>
            </react_1.TabsList>)}

          <react_1.TabsContent value="job" className="w-full">
            <react_1.Card>
              <form_1.ValidatedForm method="post" validator={production_models_1.jobValidator} defaultValues={initialValues} isDisabled={isEditing && isLocked}>
                <react_1.CardHeader>
                  <react_1.CardTitle>
                    {isEditing ? <macro_1.Trans>Job</macro_1.Trans> : <macro_1.Trans>New Job</macro_1.Trans>}
                  </react_1.CardTitle>
                  {!isEditing && (<react_1.CardDescription>
                      <macro_1.Trans>
                        A job is a set of work to be done to fulfill an order or
                        increase inventory
                      </macro_1.Trans>
                    </react_1.CardDescription>)}
                </react_1.CardHeader>
                <react_1.CardContent>
                  <Form_1.Hidden name="id"/>
                  <Form_1.Hidden name="modelUploadId" value={(_w = itemData.modelUploadId) !== null && _w !== void 0 ? _w : undefined}/>
                  <Form_1.Hidden name="unitOfMeasureCode" value={itemData.uom}/>
                  {!isEditing && configTableRows && (<Form_1.Hidden name="configuration" value={JSON.stringify({
                configTable: configTableRows,
                configTablePrimaryKeys: configTablePrimaryKeys
            })}/>)}
                  <react_1.VStack>
                    <div className={(0, react_1.cn)("grid w-full gap-x-8 gap-y-4", isEditing
            ? "grid-cols-1 lg:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2")}>
                      {isEditing ? (<Form_1.Input name="jobId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Job ID"], ["Job ID"])))} isReadOnly/>) : (<Form_1.SequenceOrCustomId name="jobId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Job ID"], ["Job ID"])))} table="job"/>)}

                      <Form_1.Item name="itemId" label={type} type={type} value={itemData.itemId} locationId={(_x = initialValues.locationId) !== null && _x !== void 0 ? _x : undefined} validItemTypes={["Part", "Tool"]} replenishmentSystem="Make" onChange={function (value) {
            onItemChange(value === null || value === void 0 ? void 0 : value.value);
        }} onTypeChange={onTypeChange}/>

                      {isEditing && (<form_1.InputControlled name="description" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Short Description"], ["Short Description"])))} value={itemData.description} isReadOnly/>)}

                      <QuantityWithConfigTable_1.QuantityWithConfigTable name="quantity" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Quantity"], ["Quantity"])))} value={itemData.quantity} isReadOnly={configTableTotal > 0} onChange={function (value) {
            return setItemData(function (prev) { return (__assign(__assign({}, prev), { quantity: value, scrapQuantity: Math.ceil(value * prev.scrapPercentage) })); });
        }} configTableTotal={configTableTotal} minValue={0} hasConfigurationParameters={!!configurationParameters} onOpenConfigTable={function () { return openConfigTable("single"); }}/>
                      <Form_1.NumberControlled name="scrapQuantity" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Estimated Scrap Quantity"], ["Estimated Scrap Quantity"])))} value={itemData.scrapQuantity} onChange={function (value) {
            return setItemData(function (prev) { return (__assign(__assign({}, prev), { scrapQuantity: value, scrapPercentage: prev.quantity > 0 ? value / prev.quantity : 1 })); });
        }} minValue={0}/>

                      <Form_1.Location name="locationId" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Location"], ["Location"])))}/>

                      <Form_1.DatePicker name="dueDate" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Due Date"], ["Due Date"])))} isDisabled={isCustomer}/>
                      <Form_1.Select name="deadlineType" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Deadline Type"], ["Deadline Type"])))} options={production_models_1.deadlineTypes.map(function (d) { return ({
            value: d,
            label: (<div className="flex gap-1 items-center">
                              {(0, Deadline_1.getDeadlineIcon)(d)}
                              <span>{getDeadlineTypeLabel(d)}</span>
                            </div>)
        }); })}/>

                      {isEditing && (<Form_1.Customer name="customerId" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Customer"], ["Customer"])))} isOptional/>)}

                      <Form_1.CustomFormFields table="job"/>
                    </div>
                  </react_1.VStack>
                </react_1.CardContent>
                <react_1.CardFooter>
                  <Form_1.Submit isDisabled={isDisabled ||
            (isEditing
                ? !permissions.can("update", "production")
                : !permissions.can("create", "production"))}>
                    <macro_1.Trans>Save</macro_1.Trans>
                  </Form_1.Submit>
                </react_1.CardFooter>
              </form_1.ValidatedForm>
            </react_1.Card>
          </react_1.TabsContent>
          {!isEditing && (<react_1.TabsContent value="bulk" className="w-full">
              <react_1.Card>
                <form_1.ValidatedForm method="post" action={path_1.path.to.newBulkJob} validator={production_models_1.bulkJobValidator} defaultValues={bulkInitialValues}>
                  <react_1.CardHeader>
                    <react_1.CardTitle>
                      <macro_1.Trans>Bulk Jobs</macro_1.Trans>
                    </react_1.CardTitle>
                    <react_1.CardDescription>
                      <macro_1.Trans>
                        The bulk jobs form creates multiple jobs for the same
                        item across multiple due dates.
                      </macro_1.Trans>
                    </react_1.CardDescription>
                  </react_1.CardHeader>
                  <react_1.CardContent>
                    <Form_1.Hidden name="id"/>
                    <Form_1.Hidden name="modelUploadId" value={(_y = itemData.modelUploadId) !== null && _y !== void 0 ? _y : undefined}/>
                    <Form_1.Hidden name="unitOfMeasureCode" value={itemData.uom}/>
                    {!isEditing && configTableRows && (<Form_1.Hidden name="configuration" value={JSON.stringify({
                    configTable: configTableRows,
                    configTablePrimaryKeys: configTablePrimaryKeys
                })}/>)}
                    <react_1.VStack>
                      <div className={(0, react_1.cn)("grid w-full gap-x-8 gap-y-4", "grid-cols-1 md:grid-cols-2")}>
                        <Form_1.Item name="itemId" label={type} type={type} value={itemData.itemId} locationId={(_z = initialValues.locationId) !== null && _z !== void 0 ? _z : undefined} validItemTypes={["Part", "Tool"]} onChange={function (value) {
                onItemChange(value === null || value === void 0 ? void 0 : value.value);
            }} onTypeChange={onTypeChange}/>

                        <Form_1.NumberControlled name="jobCount" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Total Jobs"], ["Total Jobs"])))} value={itemData.jobCount} onChange={function (value) {
                return setItemData(function (prev) { return (__assign(__assign({}, prev), { jobCount: value })); });
            }} minValue={0}/>

                        <QuantityWithConfigTable_1.QuantityWithConfigTable name="quantityPerJob" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Quantities Per Job"], ["Quantities Per Job"])))} value={itemData.quantityPerJob} onChange={function (value) {
                return setItemData(function (prev) { return (__assign(__assign({}, prev), { quantityPerJob: value })); });
            }} isReadOnly={configTableTotal > 0} configTableTotal={configTableTotal} minValue={0} hasConfigurationParameters={!!configurationParameters} onOpenConfigTable={function () { return openConfigTable("bulk"); }}/>

                        <Form_1.NumberControlled name="scrapQuantityPerJob" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Scrap Quantity Per Job"], ["Scrap Quantity Per Job"])))} value={itemData.scrapQuantity} onChange={function (value) {
                return setItemData(function (prev) { return (__assign(__assign({}, prev), { scrapQuantity: value })); });
            }} minValue={0}/>

                        <Form_1.DatePicker name="dueDateOfFirstJob" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Due Date of First Job"], ["Due Date of First Job"])))} isDisabled={isCustomer}/>

                        <Form_1.DatePicker name="dueDateOfLastJob" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Due Date of Last Job"], ["Due Date of Last Job"])))} isDisabled={isCustomer}/>

                        <Form_1.Location name="locationId" label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Location"], ["Location"])))}/>
                        <Form_1.Select name="deadlineType" label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Deadline Type"], ["Deadline Type"])))} options={production_models_1.deadlineTypes.map(function (d) { return ({
                value: d,
                label: (<div className="flex gap-1 items-center">
                                {(0, Deadline_1.getDeadlineIcon)(d)}
                                <span>{getDeadlineTypeLabel(d)}</span>
                              </div>)
            }); })}/>

                        <Form_1.CustomFormFields table="job"/>
                      </div>
                    </react_1.VStack>
                  </react_1.CardContent>
                  <react_1.CardFooter>
                    <Form_1.Submit isDisabled={isDisabled || !permissions.can("create", "production")} withBlocker={false}>
                      <macro_1.Trans>Save</macro_1.Trans>
                    </Form_1.Submit>
                  </react_1.CardFooter>
                </form_1.ValidatedForm>
              </react_1.Card>
            </react_1.TabsContent>)}
        </react_1.VStack>
      </react_1.Tabs>
      {configModal.node}
    </>);
};
exports.default = JobForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17;
