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
exports.handle = void 0;
exports.loader = loader;
exports.default = SalesRFQRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var core_1 = require("@dnd-kit/core");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var sales_1 = require("~/modules/sales");
var SalesRFQ_1 = require("~/modules/sales/ui/SalesRFQ");
var useOptimiticDocumentDrag_1 = require("~/modules/sales/ui/SalesRFQ/useOptimiticDocumentDrag");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["RFQs"], ["RFQs"]))),
    to: path_1.path.to.salesRfqs
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var companyId, rfqId, serviceRole, _c, rfqSummary, lines, _d, _e, _f, _g, opportunity, _h, _j;
        var _k, _l;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "sales"
                    })];
                case 1:
                    companyId = (_m.sent()).companyId;
                    rfqId = params.rfqId;
                    if (!rfqId)
                        throw new Error("Could not find rfqId");
                    return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
                case 2:
                    serviceRole = _m.sent();
                    return [4 /*yield*/, Promise.all([
                            (0, sales_1.getSalesRFQ)(serviceRole, rfqId),
                            (0, sales_1.getSalesRFQLines)(serviceRole, rfqId)
                        ])];
                case 3:
                    _c = _m.sent(), rfqSummary = _c[0], lines = _c[1];
                    if (!rfqSummary.error) return [3 /*break*/, 5];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.salesRfqs];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(rfqSummary.error, "Failed to load sales RFQ summary"))];
                case 4: throw _d.apply(void 0, _e.concat([_m.sent()]));
                case 5:
                    if (!lines.error) return [3 /*break*/, 7];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.salesRfqs];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(lines.error, "Failed to load RFQ lines"))];
                case 6: throw _f.apply(void 0, _g.concat([_m.sent()]));
                case 7: return [4 /*yield*/, (0, sales_1.getOrCreateOpportunityForRecord)(serviceRole, {
                        id: rfqSummary.data.id,
                        companyId: rfqSummary.data.companyId,
                        customerId: rfqSummary.data.customerId,
                        opportunityId: (_k = rfqSummary.data.opportunityId) !== null && _k !== void 0 ? _k : null,
                        table: "salesRfq"
                    })];
                case 8:
                    opportunity = _m.sent();
                    if (!opportunity.error) return [3 /*break*/, 10];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.salesRfqs];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(opportunity.error, "Failed to load sales RFQ opportunity"))];
                case 9: throw _h.apply(void 0, _j.concat([_m.sent()]));
                case 10:
                    if (!opportunity.data)
                        throw new Error("Failed to get opportunity record");
                    return [2 /*return*/, {
                            rfqSummary: rfqSummary.data,
                            lines: (_l = lines.data.map(function (line) {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                                return (__assign(__assign({}, line), { id: (_a = line.id) !== null && _a !== void 0 ? _a : "", order: (_b = line.order) !== null && _b !== void 0 ? _b : 0, unitOfMeasureCode: (_c = line.unitOfMeasureCode) !== null && _c !== void 0 ? _c : "", customerPartId: (_d = line.customerPartId) !== null && _d !== void 0 ? _d : "", customerPartRevision: (_e = line.customerPartRevision) !== null && _e !== void 0 ? _e : "", description: (_f = line.description) !== null && _f !== void 0 ? _f : "", externalNotes: ((_g = line.externalNotes) !== null && _g !== void 0 ? _g : {}), internalNotes: ((_h = line.internalNotes) !== null && _h !== void 0 ? _h : {}), itemId: (_j = line.itemId) !== null && _j !== void 0 ? _j : "", quantity: (_k = line.quantity) !== null && _k !== void 0 ? _k : [1] }));
                            })) !== null && _l !== void 0 ? _l : [],
                            files: (0, sales_1.getOpportunityDocuments)(serviceRole, companyId, opportunity.data.id),
                            opportunity: opportunity.data
                        }];
            }
        });
    });
}
function SalesRFQRoute() {
    var rfqId = (0, react_router_1.useParams)().rfqId;
    if (!rfqId)
        throw new Error("Could not find rfqId");
    var submit = (0, react_router_1.useSubmit)();
    var pendingItems = (0, useOptimiticDocumentDrag_1.useOptimisticDocumentDrag)();
    var handleDrop = function (document, targetId) {
        var _a, _b;
        if (pendingItems.find(function (item) { return item.id === document.id; }))
            return;
        var fileName = document.name.split(".").slice(0, -1).join(".");
        var fileExtension = (_a = document.name.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        var is3DModel = fileExtension
            ? utils_1.supportedModelTypes.includes(fileExtension)
            : false;
        var formData = new FormData();
        var payload = {
            id: document.id,
            customerPartId: fileName,
            is3DModel: is3DModel ? true : undefined,
            lineId: targetId.startsWith("sales-rfq-line-")
                ? targetId.replace("sales-rfq-line-", "")
                : undefined,
            path: document.path,
            size: (_b = document.metadata) === null || _b === void 0 ? void 0 : _b.size,
            salesRfqId: rfqId
        };
        formData.append("payload", JSON.stringify(payload));
        submit(formData, {
            method: "post",
            action: path_1.path.to.salesRfqDrag(rfqId),
            navigate: false,
            fetcherKey: "drag-".concat(document.id)
        });
    };
    var handleDragEnd = function (event) {
        var over = event.over, active = event.active;
        if (over) {
            handleDrop(active.data.current, over.id);
        }
    };
    return (<Layout_1.PanelProvider>
      <core_1.DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
          <SalesRFQ_1.SalesRFQHeader />
          <div className="flex flex-1 min-h-0 overflow-hidden w-full">
            <div className="flex flex-1 min-h-0 h-full overflow-hidden">
              <Layout_1.ResizablePanels explorer={<SalesRFQ_1.SalesRFQExplorer />} content={<div className="h-full min-h-0 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent w-full">
                    <react_1.VStack spacing={2} className="p-2">
                      <react_router_1.Outlet />
                    </react_1.VStack>
                  </div>} properties={<SalesRFQ_1.SalesRFQProperties key={rfqId}/>}/>
            </div>
          </div>
        </div>
      </core_1.DndContext>
    </Layout_1.PanelProvider>);
}
var templateObject_1;
