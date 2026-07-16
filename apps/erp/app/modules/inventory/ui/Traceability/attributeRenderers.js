"use strict";
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
exports.hasRenderedAttributes = hasRenderedAttributes;
exports.AttributeList = AttributeList;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var WorkCenter_1 = require("~/components/Form/WorkCenter");
var path_1 = require("~/utils/path");
function InlineLink(_a) {
    var to = _a.to, children = _a.children, className = _a.className;
    return (<react_router_1.Link to={to} prefetch="intent" className={(0, react_1.cn)("text-sm font-medium text-foreground hover:underline truncate", className)} onClick={function (e) { return e.stopPropagation(); }}>
      {children}
    </react_router_1.Link>);
}
var SKIPPED_ATTRIBUTE_KEYS = new Set([
    "Job Material",
    "Purchase Order Line",
    "Receipt Line",
    "Sales Order Line",
    "Shipment Line",
    "Inventory Adjustment",
    "expiryOverrides"
]);
function hasRenderedAttributes(attrs) {
    for (var _i = 0, _a = Object.entries(attrs); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (SKIPPED_ATTRIBUTE_KEYS.has(key))
            continue;
        if (key.startsWith("Operation "))
            continue;
        if (value === null || value === undefined)
            continue;
        return true;
    }
    return false;
}
function AttributeList(_a) {
    var attrs = _a.attrs;
    return (<dl className="divide-y divide-border/30">
      {Object.entries(attrs)
            .sort(function (a, b) { return a[0].localeCompare(b[0]); })
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            if (key.startsWith("Operation "))
                return null;
            switch (key) {
                case "Customer":
                    return (<Row key={key} label="Customer">
                  <components_1.CustomerAvatar customerId={value}/>
                </Row>);
                case "Employee":
                    return (<Row key={key} label="Employee">
                  <components_1.EmployeeAvatar employeeId={value}/>
                </Row>);
                case "Inspector":
                    return (<Row key={key} label="Inspector">
                  <components_1.EmployeeAvatar employeeId={value}/>
                </Row>);
                case "Job":
                    return <JobAttribute key={key} jobId={value}/>;
                case "Job Material":
                    return null;
                case "Job Make Method":
                    return (<JobMakeMethodAttribute key={key} jobId={attrs.Job} makeMethodId={value} materialId={attrs["Job Material"]}/>);
                case "Job Operation":
                    return (<JobOperationAttribute key={key} jobId={attrs.Job} operationId={value}/>);
                case "Purchase Order":
                    return (<PurchaseOrderAttribute key={key} purchaseOrderId={value}/>);
                case "Purchase Order Line":
                    return null;
                case "Receipt":
                    return <ReceiptAttribute key={key} receiptId={value}/>;
                case "Receipt Line":
                    return null;
                case "Sales Order":
                    return <SalesOrderAttribute key={key} salesOrderId={value}/>;
                case "Sales Order Line":
                    return null;
                case "Shipment":
                    return <ShipmentAttribute key={key} shipmentId={value}/>;
                case "Shipment Line":
                    return null;
                case "Production Event":
                    return (<JobProductionEvent key={key} jobId={attrs.Job} eventId={value}/>);
                case "Supplier":
                    return (<Row key={key} label="Supplier">
                  <components_1.SupplierAvatar supplierId={value}/>
                </Row>);
                case "Work Center":
                case "WorkCenter":
                    return <WorkCenterAttribute key={key} value={value}/>;
                case "Consumed Quantity":
                case "Original Quantity":
                case "Remaining Quantity":
                case "Receipt Line Index":
                case "Shipment Line Index":
                default: {
                    if (SKIPPED_ATTRIBUTE_KEYS.has(key))
                        return null;
                    if (value === null || value === undefined)
                        return null;
                    if (typeof value === "object") {
                        return (<Row key={key} label={key}>
                    <span className="text-[11px] font-mono break-all">
                      {JSON.stringify(value)}
                    </span>
                  </Row>);
                    }
                    return (<Row key={key} label={key}>
                  <span className="text-sm truncate">{String(value)}</span>
                </Row>);
                }
            }
        })}
    </dl>);
}
function Row(_a) {
    var label = _a.label, children = _a.children;
    return (<div className="grid grid-cols-[8rem_1fr] items-center gap-3 py-1.5 first:pt-0 last:pb-0">
      <dt className="text-xs text-muted-foreground truncate">{label}</dt>
      <dd className="min-w-0 text-sm flex items-center justify-end gap-2 truncate">
        {children}
      </dd>
    </div>);
}
function JobAttribute(_a) {
    var _this = this;
    var jobId = _a.jobId;
    var _b = (0, react_2.useState)(null), job = _b[0], setJob = _b[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    var getJob = function () { return __awaiter(_this, void 0, void 0, function () {
        var response;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("job").select("jobId").eq("id", jobId).single())];
                case 1:
                    response = _c.sent();
                    setJob((_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.jobId) !== null && _b !== void 0 ? _b : null);
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useMount)(function () {
        getJob();
    });
    return (<Row label="Job">
      <InlineLink to={path_1.path.to.jobDetails(jobId)}>{job !== null && job !== void 0 ? job : jobId}</InlineLink>
    </Row>);
}
function JobProductionEvent(_a) {
    var jobId = _a.jobId, eventId = _a.eventId;
    return (<Row label="Production Event">
      {jobId && eventId ? (<InlineLink to={path_1.path.to.jobProductionEvent(jobId, eventId)}>
          {eventId}
        </InlineLink>) : (<span className="text-sm text-muted-foreground">{eventId}</span>)}
    </Row>);
}
function JobOperationAttribute(_a) {
    var jobId = _a.jobId, operationId = _a.operationId;
    return (<Row label="Job Operation">
      {jobId && operationId ? (<InlineLink to={"".concat(path_1.path.to.jobProductionEvents(jobId), "?filter=jobOperationId:eq:").concat(operationId)}>
          {operationId}
        </InlineLink>) : (<span className="text-sm text-muted-foreground truncate">
          {operationId}
        </span>)}
    </Row>);
}
function JobMakeMethodAttribute(_a) {
    var jobId = _a.jobId, makeMethodId = _a.makeMethodId, materialId = _a.materialId;
    return (<Row label="Job Make Method">
      <InlineLink to={materialId
            ? path_1.path.to.jobMakeMethod(jobId, makeMethodId)
            : path_1.path.to.jobMethod(jobId, makeMethodId)}>
        {makeMethodId}
      </InlineLink>
    </Row>);
}
function PurchaseOrderAttribute(_a) {
    var _this = this;
    var purchaseOrderId = _a.purchaseOrderId;
    var _b = (0, react_2.useState)(null), poNumber = _b[0], setPoNumber = _b[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    var getPurchaseOrder = function () { return __awaiter(_this, void 0, void 0, function () {
        var response;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("purchaseOrder").select("purchaseOrderId").eq("id", purchaseOrderId).single())];
                case 1:
                    response = _c.sent();
                    setPoNumber((_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.purchaseOrderId) !== null && _b !== void 0 ? _b : null);
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useMount)(function () {
        getPurchaseOrder();
    });
    return (<Row label="Purchase Order">
      <InlineLink to={path_1.path.to.purchaseOrderDetails(purchaseOrderId)}>
        {poNumber !== null && poNumber !== void 0 ? poNumber : purchaseOrderId}
      </InlineLink>
    </Row>);
}
function SalesOrderAttribute(_a) {
    var _this = this;
    var salesOrderId = _a.salesOrderId;
    var _b = (0, react_2.useState)(null), soNumber = _b[0], setSoNumber = _b[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    var getSalesOrder = function () { return __awaiter(_this, void 0, void 0, function () {
        var response;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("salesOrder").select("salesOrderId").eq("id", salesOrderId).single())];
                case 1:
                    response = _c.sent();
                    setSoNumber((_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.salesOrderId) !== null && _b !== void 0 ? _b : null);
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useMount)(function () {
        getSalesOrder();
    });
    return (<Row label="Sales Order">
      <InlineLink to={path_1.path.to.salesOrderDetails(salesOrderId)}>
        {soNumber !== null && soNumber !== void 0 ? soNumber : salesOrderId}
      </InlineLink>
    </Row>);
}
function ReceiptAttribute(_a) {
    var _this = this;
    var receiptId = _a.receiptId;
    var _b = (0, react_2.useState)(null), receiptNumber = _b[0], setReceiptNumber = _b[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    var getReceipt = function () { return __awaiter(_this, void 0, void 0, function () {
        var response;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("receipt").select("receiptId").eq("id", receiptId).single())];
                case 1:
                    response = _c.sent();
                    setReceiptNumber((_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.receiptId) !== null && _b !== void 0 ? _b : null);
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useMount)(function () {
        getReceipt();
    });
    return (<Row label="Receipt">
      <InlineLink to={path_1.path.to.receiptDetails(receiptId)}>
        {receiptNumber !== null && receiptNumber !== void 0 ? receiptNumber : receiptId}
      </InlineLink>
    </Row>);
}
function ShipmentAttribute(_a) {
    var _this = this;
    var shipmentId = _a.shipmentId;
    var _b = (0, react_2.useState)(null), shipmentNumber = _b[0], setShipmentNumber = _b[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    var getShipment = function () { return __awaiter(_this, void 0, void 0, function () {
        var response;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("shipment").select("shipmentId").eq("id", shipmentId).single())];
                case 1:
                    response = _c.sent();
                    setShipmentNumber((_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.shipmentId) !== null && _b !== void 0 ? _b : null);
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useMount)(function () {
        getShipment();
    });
    return (<Row label="Shipment">
      <InlineLink to={path_1.path.to.shipmentDetails(shipmentId)}>
        {shipmentNumber !== null && shipmentNumber !== void 0 ? shipmentNumber : shipmentId}
      </InlineLink>
    </Row>);
}
function WorkCenterAttribute(_a) {
    var _b;
    var value = _a.value;
    var workCenters = (0, WorkCenter_1.useWorkCenters)({});
    var workCenter = workCenters.options.find(function (wc) { return wc.value === value; });
    return (<Row label="Work Center">
      <span className="text-sm truncate">{(_b = workCenter === null || workCenter === void 0 ? void 0 : workCenter.label) !== null && _b !== void 0 ? _b : value}</span>
    </Row>);
}
