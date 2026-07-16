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
exports.SalesOrderLineJobs = SalesOrderLineJobs;
exports.SalesOrderJobItem = SalesOrderJobItem;
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var SupplierProcess_1 = require("~/components/Form/SupplierProcess");
var hooks_1 = require("~/hooks");
var production_models_1 = require("~/modules/production/production.models");
var Deadline_1 = require("~/modules/production/ui/Jobs/Deadline");
var JobHeader_1 = require("~/modules/production/ui/Jobs/JobHeader");
var JobOperationStatus_1 = require("~/modules/production/ui/Jobs/JobOperationStatus");
var JobStatus_1 = require("~/modules/production/ui/Jobs/JobStatus");
var OperationDueDatePicker_1 = require("~/modules/production/ui/Jobs/OperationDueDatePicker");
var path_1 = require("~/utils/path");
function SalesOrderLineJobs(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    var salesOrder = _a.salesOrder, line = _a.line, opportunity = _a.opportunity, jobs = _a.jobs, itemReplenishment = _a.itemReplenishment;
    var t = (0, macro_1.useLingui)().t;
    var _r = (0, react_router_1.useParams)(), orderId = _r.orderId, lineId = _r.lineId;
    if (!orderId)
        throw new Error("orderId not found");
    if (!lineId)
        throw new Error("lineId not found");
    var newJobDisclosure = (0, react_1.useDisclosure)();
    var hasJobs = jobs.length > 0;
    var scrapPercentage = (_b = itemReplenishment.scrapPercentage) !== null && _b !== void 0 ? _b : 0;
    var totalJobQuantity = jobs.reduce(function (sum, job) { var _a; return sum + ((_a = job.quantity) !== null && _a !== void 0 ? _a : 0); }, 0);
    var quantityRequired = ((_c = line.saleQuantity) !== null && _c !== void 0 ? _c : 0) - totalJobQuantity;
    var _s = (0, react_2.useState)(function () {
        var quantity = itemReplenishment.lotSize
            ? Math.min(quantityRequired, itemReplenishment.lotSize)
            : quantityRequired;
        return {
            quantity: quantity,
            scrapQuantity: Math.ceil(quantity * scrapPercentage)
        };
    }), quantities = _s[0], setQuantities = _s[1];
    return (<>
      <react_1.Card>
        <react_1.HStack className="w-full justify-between">
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Jobs</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardAction>
            {hasJobs && (<react_1.Button leftIcon={<lu_1.LuCirclePlay />} onClick={newJobDisclosure.onOpen}>
                Make to Order
              </react_1.Button>)}
          </react_1.CardAction>
        </react_1.HStack>

        <react_1.CardContent>
          {jobs.length > 0 ? (<div className="border rounded-lg">
              {jobs
                .sort(function (a, b) { var _a, _b; return ((_a = a.jobId) !== null && _a !== void 0 ? _a : "").localeCompare((_b = b.jobId) !== null && _b !== void 0 ? _b : ""); })
                .map(function (job, index) { return (<div key={job.id} className={(0, react_1.cn)("border-b p-6", index === jobs.length - 1 && "border-b-0")}>
                    <SalesOrderJobItem job={job}/>
                  </div>); })}
            </div>) : (<components_1.Empty className="pb-12">
              <react_1.Button leftIcon={<lu_1.LuCirclePlus />} onClick={newJobDisclosure.onOpen}>
                Make to Order
              </react_1.Button>
            </components_1.Empty>)}
        </react_1.CardContent>
      </react_1.Card>
      {newJobDisclosure.isOpen && (<react_1.Modal open onOpenChange={function (open) {
                if (!open)
                    newJobDisclosure.onClose();
            }}>
          <react_1.ModalContent size="large">
            <form_1.ValidatedForm validator={production_models_1.salesOrderToJobValidator} method="post" action={path_1.path.to.salesOrderLineToJob(orderId, lineId)} defaultValues={{
                customerId: (_d = salesOrder.customerId) !== null && _d !== void 0 ? _d : undefined,
                deadlineType: "Hard Deadline",
                dueDate: (_e = line.promisedDate) !== null && _e !== void 0 ? _e : "",
                itemId: (_f = line.itemId) !== null && _f !== void 0 ? _f : undefined,
                locationId: (_g = line.locationId) !== null && _g !== void 0 ? _g : "",
                modelUploadId: (_h = line.modelUploadId) !== null && _h !== void 0 ? _h : undefined,
                quantity: (_j = line.saleQuantity) !== null && _j !== void 0 ? _j : undefined,
                quoteId: (_l = (_k = opportunity.quotes[0]) === null || _k === void 0 ? void 0 : _k.id) !== null && _l !== void 0 ? _l : undefined,
                quoteLineId: ((_m = opportunity.quotes[0]) === null || _m === void 0 ? void 0 : _m.id) ? lineId : undefined,
                salesOrderId: (_p = (_o = opportunity.salesOrders[0]) === null || _o === void 0 ? void 0 : _o.id) !== null && _p !== void 0 ? _p : undefined,
                salesOrderLineId: lineId,
                scrapQuantity: 0,
                unitOfMeasureCode: (_q = line.unitOfMeasureCode) !== null && _q !== void 0 ? _q : undefined
            }} className="flex flex-col h-full" onSuccess={newJobDisclosure.onClose}>
              <react_1.ModalHeader>
                <react_1.ModalTitle>
                  <macro_1.Trans>Convert Line to Job</macro_1.Trans>
                </react_1.ModalTitle>
                <react_1.ModalDescription>
                  <macro_1.Trans>
                    Create a new production job to fulfill the sales order
                  </macro_1.Trans>
                </react_1.ModalDescription>
              </react_1.ModalHeader>
              <react_1.ModalBody>
                <Form_1.Hidden name="modelUploadId"/>
                <Form_1.Hidden name="customerId"/>
                <Form_1.Hidden name="itemId"/>
                <Form_1.Hidden name="salesOrderId"/>
                <Form_1.Hidden name="salesOrderLineId"/>
                <Form_1.Hidden name="quoteId"/>
                <Form_1.Hidden name="quoteLineId"/>
                <Form_1.Hidden name="unitOfMeasureCode"/>
                <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 md:grid-cols-2">
                  <Form_1.SequenceOrCustomId name="jobId" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Job ID"], ["Job ID"])))} table="job"/>
                  <Form_1.Location name="locationId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Location"], ["Location"])))}/>
                  <Form_1.NumberControlled name="quantity" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Quantity"], ["Quantity"])))} value={quantities.quantity} onChange={function (value) {
                setQuantities(function (prev) { return (__assign(__assign({}, prev), { quantity: value, scrapQuantity: Math.ceil(value * scrapPercentage) })); });
            }} minValue={0}/>
                  <Form_1.NumberControlled name="scrapQuantity" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Scrap Quantity"], ["Scrap Quantity"])))} value={quantities.scrapQuantity} onChange={function (value) {
                return setQuantities(function (prev) { return (__assign(__assign({}, prev), { scrapQuantity: value })); });
            }} minValue={0}/>
                  <form_1.DatePicker name="dueDate" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Due Date"], ["Due Date"])))}/>
                  <Form_1.Select name="deadlineType" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Deadline Type"], ["Deadline Type"])))} options={production_models_1.deadlineTypes.map(function (d) { return ({
                value: d,
                label: (<div className="flex gap-1 items-center">
                          {(0, Deadline_1.getDeadlineIcon)(d)}
                          <span>{d}</span>
                        </div>)
            }); })}/>
                </div>
              </react_1.ModalBody>
              <react_1.ModalFooter>
                <react_1.Button variant="secondary" onClick={newJobDisclosure.onClose}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
                <Form_1.Submit>Create</Form_1.Submit>
              </react_1.ModalFooter>
            </form_1.ValidatedForm>
          </react_1.ModalContent>
        </react_1.Modal>)}
    </>);
}
function SalesOrderJobItem(_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var job = _a.job;
    var disclosure = (0, react_1.useDisclosure)();
    var permissions = (0, hooks_1.usePermissions)();
    var releaseModal = (0, react_1.useDisclosure)();
    var statusFetcher = (0, react_router_1.useFetcher)();
    var todaysDate = (0, react_2.useMemo)(function () { return (0, date_1.today)((0, date_1.getLocalTimeZone)()); }, []);
    return (<react_1.VStack>
      <react_1.HStack className="w-full justify-between">
        <react_1.HStack>
          <components_1.Hyperlink to={path_1.path.to.job(job.id)}>
            <div className="flex flex-col gap-0">
              {job.jobId}
              <react_1.HStack spacing={1}>
                <JobStatus_1.default status={job.status}/>
                {[
            "Draft",
            "Planned",
            "In Progress",
            "Ready",
            "Paused"
        ].includes((_b = job.status) !== null && _b !== void 0 ? _b : "") && (<>
                    {job.dueDate &&
                (0, date_1.isSameDay)((0, date_1.parseDate)(job.dueDate), todaysDate) && (<JobStatus_1.default status="Due Today"/>)}
                    {job.dueDate && (0, date_1.parseDate)(job.dueDate) < todaysDate && (<JobStatus_1.default status="Overdue"/>)}
                  </>)}
              </react_1.HStack>
            </div>
          </components_1.Hyperlink>
          <components_1.Assignee id={job.id} table="job" size="sm" value={(_c = job.assignee) !== null && _c !== void 0 ? _c : ""} isReadOnly={!permissions.can("update", "production")}/>
        </react_1.HStack>
        <react_1.HStack className="justify-between items-center" spacing={8}>
          <div>
            <label className="text-xs text-muted-foreground">Complete</label>
            <p className="text-sm">
              {(_d = job.quantityComplete) !== null && _d !== void 0 ? _d : 0}/{(_e = job.quantity) !== null && _e !== void 0 ? _e : 0}
            </p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Shipped</label>
            <p className="text-sm">
              {(_f = job.quantityShipped) !== null && _f !== void 0 ? _f : 0}/{(_g = job.quantity) !== null && _g !== void 0 ? _g : 0}
            </p>
          </div>
        </react_1.HStack>
        <react_1.HStack>
          <react_1.Button onClick={releaseModal.onOpen} isLoading={statusFetcher.state !== "idle" &&
            ((_h = statusFetcher.formData) === null || _h === void 0 ? void 0 : _h.get("status")) === "Ready"} isDisabled={job.status !== "Draft" ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "production") ||
            ((job === null || job === void 0 ? void 0 : job.quantity) === 0 && (job === null || job === void 0 ? void 0 : job.scrapQuantity) === 0)} leftIcon={<lu_1.LuCirclePlay />} variant="secondary" size="sm">
            Release
          </react_1.Button>
          <react_1.IconButton aria-label={disclosure.isOpen ? "Collapse" : "Expand"} icon={disclosure.isOpen ? <lu_1.LuChevronDown /> : <lu_1.LuChevronRight />} variant="ghost" onClick={function (e) {
            e.stopPropagation();
            disclosure.onToggle();
        }}/>
        </react_1.HStack>
      </react_1.HStack>

      {disclosure.isOpen && <JobDetails job={job}/>}
      {releaseModal.isOpen && (<JobHeader_1.JobStartModal job={job} onClose={releaseModal.onClose} fetcher={statusFetcher}/>)}
    </react_1.VStack>);
}
function JobDetails(_a) {
    var _this = this;
    var job = _a.job;
    var t = (0, macro_1.useLingui)().t;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var navigate = (0, react_router_1.useNavigate)();
    var _b = (0, react_2.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_2.useState)([]), jobOperations = _c[0], setJobOperations = _c[1];
    var getJobOperations = function () { return __awaiter(_this, void 0, void 0, function () {
        var operations;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon) {
                        react_1.toast.error(t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Failed to load job operations"], ["Failed to load job operations"]))));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Promise.all([
                            carbon
                                .from("jobOperation")
                                .select("*, jobMakeMethod(parentMaterialId, item(readableIdWithRevision))")
                                .eq("jobId", job.id)
                        ])];
                case 1:
                    operations = (_a.sent())[0];
                    if (operations.error) {
                        react_1.toast.error("Failed to load job operations");
                        return [2 /*return*/];
                    }
                    (0, react_dom_1.flushSync)(function () {
                        setJobOperations(operations.data);
                        setIsLoading(false);
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useMount)(function () {
        getJobOperations();
    });
    if (jobOperations.length === 0 && !isLoading) {
        return <components_1.Empty>No operations found</components_1.Empty>;
    }
    return (<react_1.Loading isLoading={isLoading} className="min-h-[200px]">
      <react_1.VStack spacing={2} className="pt-4">
        {jobOperations
            .sort(function (a, b) { var _a, _b; return ((_a = a.order) !== null && _a !== void 0 ? _a : 0) - ((_b = b.order) !== null && _b !== void 0 ? _b : 0); })
            .map(function (operation) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            return (<div className="flex w-full items-center" key={operation.id}>
              <div className="grow h-full bg-muted/30 border border-border rounded-lg w-full">
                <div className="grid items-center justify-between grid-cols-[1fr_auto] w-full gap-2 px-3 md:px-4 py-2 md:py-3">
                  <react_1.VStack spacing={0}>
                    <react_1.HStack className="w-full justify-between">
                      <h3 className="font-semibold truncate">
                        {operation.description}
                      </h3>
                      <react_1.HStack spacing={1}>
                        {operation.operationType === "Outside" ? (<react_1.Badge>Outside</react_1.Badge>) : (<>
                            {((_a = operation === null || operation === void 0 ? void 0 : operation.setupTime) !== null && _a !== void 0 ? _a : 0) > 0 && (<react_1.Badge variant="secondary">
                                <components_1.TimeTypeIcon type="Setup" className="h-3 w-3 mr-1"/>
                                {operation.setupTime} {operation.setupUnit}
                              </react_1.Badge>)}
                            {((_b = operation === null || operation === void 0 ? void 0 : operation.laborTime) !== null && _b !== void 0 ? _b : 0) > 0 && (<react_1.Badge variant="secondary">
                                <components_1.TimeTypeIcon type="Labor" className="h-3 w-3 mr-1"/>
                                {operation.laborTime} {operation.laborUnit}
                              </react_1.Badge>)}

                            {((_c = operation === null || operation === void 0 ? void 0 : operation.machineTime) !== null && _c !== void 0 ? _c : 0) > 0 && (<react_1.Badge variant="secondary">
                                <components_1.TimeTypeIcon type="Machine" className="h-3 w-3 mr-1"/>
                                {operation.machineTime} {operation.machineUnit}
                              </react_1.Badge>)}
                          </>)}
                      </react_1.HStack>
                    </react_1.HStack>
                    {operation.operationType === "Outside" ? (<SupplierProcess_1.SupplierProcessPreview processId={operation.processId} supplierProcessId={(_d = operation.operationSupplierProcessId) !== null && _d !== void 0 ? _d : undefined}/>) : (<div className="py-2 w-full">
                        <react_1.BarProgress segments={[
                        {
                            value: (_e = operation.quantityComplete) !== null && _e !== void 0 ? _e : 0,
                            className: "bg-emerald-500"
                        },
                        {
                            value: (_f = operation.quantityReworked) !== null && _f !== void 0 ? _f : 0,
                            className: "bg-yellow-500"
                        },
                        {
                            value: (_g = operation.quantityScrapped) !== null && _g !== void 0 ? _g : 0,
                            className: "bg-red-500"
                        }
                    ]} max={((_h = operation.targetQuantity) !== null && _h !== void 0 ? _h : operation.operationQuantity) ||
                        1} progress={Math.min((((_j = operation.quantityComplete) !== null && _j !== void 0 ? _j : 0) /
                        ((_l = (_k = operation.targetQuantity) !== null && _k !== void 0 ? _k : operation.operationQuantity) !== null && _l !== void 0 ? _l : 0)) *
                        100, 100)} value={"".concat((_m = operation.quantityComplete) !== null && _m !== void 0 ? _m : 0, "/").concat((_p = (_o = operation.targetQuantity) !== null && _o !== void 0 ? _o : operation.operationQuantity) !== null && _p !== void 0 ? _p : 0)}/>
                      </div>)}
                  </react_1.VStack>

                  <react_1.IconButton aria-label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Edit"], ["Edit"])))} icon={<lu_1.LuSettings2 />} variant="ghost" onClick={function () {
                    var _a, _b, _c;
                    navigate("".concat(((_a = operation.jobMakeMethod) === null || _a === void 0 ? void 0 : _a.parentMaterialId)
                        ? path_1.path.to.jobMakeMethod(operation.jobId, (_b = operation.jobMakeMethodId) !== null && _b !== void 0 ? _b : "")
                        : path_1.path.to.jobMethod(operation.jobId, (_c = operation.jobMakeMethodId) !== null && _c !== void 0 ? _c : ""), "?selectedOperation=").concat(operation.id));
                }}/>
                </div>
                <div className="flex w-full items-center justify-between border-t border-border px-3 md:px-4 py-2 md:py-3">
                  <react_1.HStack>
                    <JobOperationStatus_1.JobOperationStatus operation={operation} onChange={function (status) {
                    setJobOperations(function (prev) {
                        return prev.map(function (op) {
                            return op.id === operation.id ? __assign(__assign({}, op), { status: status }) : op;
                        });
                    });
                }}/>

                    <components_1.Assignee id={operation.id} table="jobOperation" size="sm" onChange={function (selected) {
                    setJobOperations(function (prev) {
                        return prev.map(function (op) {
                            return op.id === operation.id
                                ? __assign(__assign({}, op), { assignee: selected }) : op;
                        });
                    });
                }} value={(_q = operation.assignee) !== null && _q !== void 0 ? _q : undefined}/>
                    <OperationDueDatePicker_1.OperationDueDatePicker operationId={operation.id} dueDate={operation.dueDate} onChange={function (dueDate) {
                    return setJobOperations(function (prev) {
                        return prev.map(function (op) {
                            return op.id === operation.id ? __assign(__assign({}, op), { dueDate: dueDate }) : op;
                        });
                    });
                }}/>
                  </react_1.HStack>
                </div>
              </div>
            </div>);
        })}
      </react_1.VStack>
    </react_1.Loading>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
