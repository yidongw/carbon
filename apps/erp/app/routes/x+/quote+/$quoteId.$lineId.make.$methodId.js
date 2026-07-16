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
exports.loader = loader;
exports.default = QuoteMakeMethodRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var sales_1 = require("~/modules/sales");
var Quotes_1 = require("~/modules/sales/ui/Quotes");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, quoteId, lineId, methodId, _d, makeMethod, materials, operations, tags, _e, _f, _g, _h, _j, _k;
        var _l, _m, _o, _p;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "sales"
                    })];
                case 1:
                    _c = _q.sent(), client = _c.client, companyId = _c.companyId;
                    quoteId = params.quoteId, lineId = params.lineId, methodId = params.methodId;
                    if (!quoteId)
                        throw new Error("Could not find quoteId");
                    if (!lineId)
                        throw new Error("Could not find lineId");
                    if (!methodId)
                        throw new Error("Could not find methodId");
                    return [4 /*yield*/, Promise.all([
                            (0, sales_1.getQuoteMakeMethod)(client, methodId),
                            (0, sales_1.getQuoteMaterialsByMethodId)(client, methodId),
                            (0, sales_1.getQuoteOperationsByMethodId)(client, methodId),
                            (0, shared_1.getTagsList)(client, companyId, "operation")
                        ])];
                case 2:
                    _d = _q.sent(), makeMethod = _d[0], materials = _d[1], operations = _d[2], tags = _d[3];
                    if (!makeMethod.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.quoteLine(quoteId, lineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(makeMethod.error, "Failed to load quote make method"))];
                case 3: throw _e.apply(void 0, _f.concat([_q.sent()]));
                case 4:
                    if (!materials.error) return [3 /*break*/, 6];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.quoteLine(quoteId, lineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(materials.error, "Failed to load quote materials"))];
                case 5: throw _g.apply(void 0, _h.concat([_q.sent()]));
                case 6:
                    if (!operations.error) return [3 /*break*/, 8];
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.quoteLine(quoteId, lineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(operations.error, "Failed to load quote operations"))];
                case 7: throw _j.apply(void 0, _k.concat([_q.sent()]));
                case 8: return [2 /*return*/, {
                        makeMethod: makeMethod.data,
                        materials: (_l = materials === null || materials === void 0 ? void 0 : materials.data.map(function (m) {
                            var _a, _b, _c;
                            return (__assign(__assign({}, m), { description: (_a = m.description) !== null && _a !== void 0 ? _a : "", itemType: m.itemType, unitOfMeasureCode: (_b = m.unitOfMeasureCode) !== null && _b !== void 0 ? _b : "", quoteOperationId: (_c = m.quoteOperationId) !== null && _c !== void 0 ? _c : undefined }));
                        })) !== null && _l !== void 0 ? _l : [],
                        operations: (_o = (_m = operations.data) === null || _m === void 0 ? void 0 : _m.map(function (o) {
                            var _a, _b, _c, _d, _e, _f, _g, _h;
                            return (__assign(__assign({}, o), { description: (_a = o.description) !== null && _a !== void 0 ? _a : "", procedureId: (_b = o.procedureId) !== null && _b !== void 0 ? _b : undefined, workCenterId: (_c = o.workCenterId) !== null && _c !== void 0 ? _c : undefined, laborRate: (_d = o.laborRate) !== null && _d !== void 0 ? _d : 0, machineRate: (_e = o.machineRate) !== null && _e !== void 0 ? _e : 0, operationSupplierProcessId: (_f = o.operationSupplierProcessId) !== null && _f !== void 0 ? _f : undefined, quoteMakeMethodId: (_g = o.quoteMakeMethodId) !== null && _g !== void 0 ? _g : methodId, workInstruction: o.workInstruction, tags: (_h = o.tags) !== null && _h !== void 0 ? _h : [] }));
                        })) !== null && _o !== void 0 ? _o : [],
                        tags: (_p = tags.data) !== null && _p !== void 0 ? _p : [],
                        model: (0, shared_1.getModelByItemId)(client, makeMethod.data.itemId)
                    }];
            }
        });
    });
}
function QuoteMakeMethodRoute() {
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var methodId = (0, react_router_1.useParams)().methodId;
    if (!methodId)
        throw new Error("Could not find methodId");
    var loaderData = (0, react_router_1.useLoaderData)();
    var materials = loaderData.materials, operations = loaderData.operations, tags = loaderData.tags;
    return (<react_1.VStack spacing={2}>
      <Quotes_1.QuoteMakeMethodTools />

      <Quotes_1.QuoteBillOfMaterial key={"bom:".concat(methodId)} quoteMakeMethodId={methodId} 
    // @ts-expect-error TS2322 - TODO: fix type
    materials={materials} operations={operations}/>
      <Quotes_1.QuoteBillOfProcess key={"bop:".concat(methodId)} quoteMakeMethodId={methodId} materials={materials} 
    // @ts-expect-error
    operations={operations} tags={tags}/>
      <react_2.Suspense fallback={null}>
        <react_router_1.Await resolve={loaderData.model}>
          {function (model) {
            var _a, _b;
            return (<components_1.CadModel key={"cad:".concat(model.itemId)} isReadOnly={!permissions.can("update", "sales")} metadata={{
                    itemId: (_a = model === null || model === void 0 ? void 0 : model.itemId) !== null && _a !== void 0 ? _a : undefined
                }} modelPath={(_b = model === null || model === void 0 ? void 0 : model.modelPath) !== null && _b !== void 0 ? _b : null} title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["CAD Model"], ["CAD Model"])))} uploadClassName="aspect-square min-h-[420px] max-h-[70vh]" viewerClassName="aspect-square min-h-[420px] max-h-[70vh]"/>);
        }}
        </react_router_1.Await>
      </react_2.Suspense>
    </react_1.VStack>);
}
var templateObject_1;
