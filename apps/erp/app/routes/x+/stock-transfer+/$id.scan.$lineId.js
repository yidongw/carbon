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
exports.action = action;
exports.default = StockTransferScan;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var jobs_1 = require("@carbon/jobs");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var inventory_1 = require("~/modules/inventory");
var items_1 = require("~/modules/items");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, id, viewClient, transfer, payload, validated, _d, _e, _f, lineId, stockTransferId, itemId, locationId, trackedEntityId, _g, stockTransferLine, itemStorageUnitQuantities, _h, _j, currentStorageUnitId, transferType, functionPayload, _k, transferResult, functionError, _l, _m, e_1, _o, _p;
        var _q, _r, _s, _t, _u, _v, _w;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_x) {
            switch (_x.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "inventory"
                    })];
                case 1:
                    _c = _x.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    id = params.id;
                    if (!id)
                        throw new Error("id is not found");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "inventory"
                        })];
                case 2:
                    viewClient = (_x.sent()).client;
                    return [4 /*yield*/, (0, inventory_1.getStockTransfer)(viewClient, id)];
                case 3:
                    transfer = _x.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: ((_q = transfer.data) === null || _q === void 0 ? void 0 : _q.status) === "Completed",
                            redirectTo: path_1.path.to.stockTransfer(id),
                            message: "Cannot pick from a completed stock transfer."
                        })];
                case 4:
                    _x.sent();
                    return [4 /*yield*/, request.json()];
                case 5:
                    payload = _x.sent();
                    validated = inventory_1.stockTransferLineScanValidator.safeParse(payload);
                    if (!!validated.success) return [3 /*break*/, 7];
                    _d = react_router_1.data;
                    _e = [{ success: false, message: "Invalid form data" }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(validated.error.message, "Invalid form data"))];
                case 6: return [2 /*return*/, _d.apply(void 0, _e.concat([_x.sent()]))];
                case 7:
                    _f = validated.data, lineId = _f.id, stockTransferId = _f.stockTransferId, itemId = _f.itemId, locationId = _f.locationId, trackedEntityId = _f.trackedEntityId;
                    return [4 /*yield*/, Promise.all([
                            client.from("stockTransferLines").select("*").eq("id", lineId).single(),
                            (0, items_1.getItemStorageUnitQuantities)(client, itemId, companyId, locationId)
                        ])];
                case 8:
                    _g = _x.sent(), stockTransferLine = _g[0], itemStorageUnitQuantities = _g[1];
                    if (!(stockTransferLine.error || itemStorageUnitQuantities.error)) return [3 /*break*/, 10];
                    _h = react_router_1.data;
                    _j = [{
                            success: false,
                            message: "Failed to load stock transfer line or item storage unit quantities"
                        }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(stockTransferLine.error || itemStorageUnitQuantities.error, "Failed to load stock transfer line or item storage unit quantities"))];
                case 9: return [2 /*return*/, _h.apply(void 0, _j.concat([_x.sent()]))];
                case 10:
                    currentStorageUnitId = (_t = (_s = (_r = itemStorageUnitQuantities.data) === null || _r === void 0 ? void 0 : _r.sort(function (a, b) { return b.quantity - a.quantity; }).find(function (q) { return q.trackedEntityId === trackedEntityId; })) === null || _s === void 0 ? void 0 : _s.storageUnitId) !== null && _t !== void 0 ? _t : null;
                    transferType = ((_u = stockTransferLine.data) === null || _u === void 0 ? void 0 : _u.requiresBatchTracking)
                        ? "batch"
                        : "serial";
                    functionPayload = {
                        type: transferType,
                        stockTransferId: stockTransferId,
                        stockTransferLineId: lineId,
                        trackedEntityId: trackedEntityId,
                        quantity: transferType === "batch" ? ((_w = (_v = stockTransferLine.data) === null || _v === void 0 ? void 0 : _v.quantity) !== null && _w !== void 0 ? _w : 1) : 1,
                        fromStorageUnitId: currentStorageUnitId,
                        locationId: locationId,
                        userId: userId,
                        companyId: companyId
                    };
                    return [4 /*yield*/, client.functions.invoke("post-stock-transfer", {
                            body: JSON.stringify(functionPayload)
                        })];
                case 11:
                    _k = _x.sent(), transferResult = _k.data, functionError = _k.error;
                    if (!functionError) return [3 /*break*/, 13];
                    _l = react_router_1.data;
                    _m = [{ success: false, message: "Failed to pick line" }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(functionError.message || "Failed to pick line", "Failed to pick line"))];
                case 12: return [2 /*return*/, _l.apply(void 0, _m.concat([_x.sent()]))];
                case 13:
                    if (!(transferResult === null || transferResult === void 0 ? void 0 : transferResult.splitEntityId)) return [3 /*break*/, 19];
                    _x.label = 14;
                case 14:
                    _x.trys.push([14, 18, , 19]);
                    return [4 /*yield*/, (0, jobs_1.trigger)("print-job", {
                            sourceDocument: "Split",
                            sourceDocumentId: transferResult.splitEntityId,
                            companyId: companyId,
                            userId: userId,
                            locationId: locationId || undefined
                        })];
                case 15:
                    _x.sent();
                    if (!trackedEntityId) return [3 /*break*/, 17];
                    return [4 /*yield*/, (0, jobs_1.trigger)("print-job", {
                            sourceDocument: "Entity",
                            sourceDocumentId: trackedEntityId,
                            companyId: companyId,
                            userId: userId,
                            locationId: locationId || undefined
                        })];
                case 16:
                    _x.sent();
                    _x.label = 17;
                case 17: return [3 /*break*/, 19];
                case 18:
                    e_1 = _x.sent();
                    console.error("Auto-print for split entity failed:", e_1);
                    return [3 /*break*/, 19];
                case 19:
                    _o = react_router_1.redirect;
                    _p = [path_1.path.to.stockTransfer(stockTransferId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Tracked entity scanned and transferred"))];
                case 20: throw _o.apply(void 0, _p.concat([_x.sent()]));
            }
        });
    });
}
function StockTransferScan() {
    var _this = this;
    var _a, _b, _c, _d;
    var _e = (0, react_router_1.useParams)(), id = _e.id, lineId = _e.lineId;
    if (!id)
        throw new Error("id not found");
    if (!lineId)
        throw new Error("lineId not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.stockTransfer(id));
    var stockTransferLine = routeData === null || routeData === void 0 ? void 0 : routeData.stockTransferLines.find(function (line) { return line.id === lineId; });
    if (!stockTransferLine)
        throw new Error("stock transfer line not found");
    var navigate = (0, react_router_1.useNavigate)();
    var onClose = function () {
        return navigate(path_1.path.to.stockTransfer(stockTransferLine.stockTransferId));
    };
    var carbon = (0, auth_1.useCarbon)().carbon;
    var t = (0, macro_1.useLingui)().t;
    var _f = (0, react_2.useState)(false), isLoading = _f[0], setIsLoading = _f[1];
    var _g = (0, react_2.useState)(null), validationError = _g[0], setValidationError = _g[1];
    var _h = (0, react_2.useState)(null), isValid = _h[0], setIsValid = _h[1];
    var _j = (0, react_2.useState)(""), serialNumber = _j[0], setSerialNumber = _j[1];
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === false) {
            react_1.toast.error(fetcher.data.message);
        }
    }, [(_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.message, (_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success]);
    var locationId = (_d = (_c = (0, hooks_1.useRouteData)(path_1.path.to.stockTransfer(stockTransferLine.stockTransferId))) === null || _c === void 0 ? void 0 : _c.stockTransfer.locationId) !== null && _d !== void 0 ? _d : "";
    var onPick = function (trackedEntityId) {
        fetcher.submit({
            id: stockTransferLine.id,
            stockTransferId: stockTransferLine.stockTransferId,
            trackedEntityId: trackedEntityId,
            itemId: stockTransferLine.itemId,
            locationId: locationId
        }, {
            method: "POST",
            encType: "application/json"
        });
    };
    var validateTrackedEntity = function (trackedEntityId) { return __awaiter(_this, void 0, void 0, function () {
        var result, status_1, scannedItem, expectedItem, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!trackedEntityId.trim()) {
                        setValidationError(null);
                        setIsValid(null);
                        return [2 /*return*/];
                    }
                    if (routeData === null || routeData === void 0 ? void 0 : routeData.stockTransferLines.some(function (line) { return line.trackedEntityId === trackedEntityId; })) {
                        setValidationError(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Tracked entity already picked"], ["Tracked entity already picked"]))));
                        setIsValid(false);
                        return [2 /*return*/];
                    }
                    setIsLoading(true);
                    setValidationError(null);
                    setIsValid(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("trackedEntity").select("*").eq("id", trackedEntityId).eq("companyId", stockTransferLine.companyId).single())];
                case 2:
                    result = _a.sent();
                    if ((result === null || result === void 0 ? void 0 : result.error) || !(result === null || result === void 0 ? void 0 : result.data)) {
                        setValidationError(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Serial number not found"], ["Serial number not found"]))));
                        setIsValid(false);
                    }
                    else if (result.data.status !== "Available") {
                        status_1 = result.data.status;
                        setValidationError(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Entity is ", ""], ["Entity is ", ""])), status_1));
                        setIsValid(false);
                    }
                    else if (result.data.sourceDocumentId !== stockTransferLine.itemId) {
                        scannedItem = result.data.sourceDocumentReadableId;
                        expectedItem = stockTransferLine.itemReadableId;
                        setValidationError(t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Item ", " is not the same as the item ", ""], ["Item ", " is not the same as the item ", ""])), scannedItem, expectedItem));
                        setIsValid(false);
                    }
                    else {
                        setValidationError(null);
                        setIsValid(true);
                        onPick(trackedEntityId);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    setValidationError(t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Error validating serial number"], ["Error validating serial number"]))));
                    setIsValid(false);
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleSerialNumberChange = function (value) {
        setSerialNumber(value);
        // Clear validation state when user types
        if (validationError || isValid !== null) {
            setValidationError(null);
            setIsValid(null);
        }
    };
    var handleBlur = function () {
        validateTrackedEntity(serialNumber);
    };
    var handleKeyDown = function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            validateTrackedEntity(serialNumber);
        }
    };
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <form_1.ValidatedForm method="post" validator={inventory_1.stockTransferLineScanValidator} defaultValues={{
            id: stockTransferLine.id,
            stockTransferId: stockTransferLine.stockTransferId,
            itemId: stockTransferLine.itemId,
            locationId: locationId,
            trackedEntityId: ""
        }}>
        <react_1.ModalContent>
          <react_1.ModalHeader>
            <react_1.ModalTitle>{stockTransferLine === null || stockTransferLine === void 0 ? void 0 : stockTransferLine.itemReadableId}</react_1.ModalTitle>
            <react_1.ModalDescription>
              <macro_1.Trans>Scan the tracking ID for this line</macro_1.Trans>
            </react_1.ModalDescription>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <form_1.Hidden name="id"/>
            <form_1.Hidden name="stockTransferId"/>
            <form_1.Hidden name="itemId"/>
            <form_1.Hidden name="locationId"/>

            <div className="space-y-4">
              {validationError && (<react_1.Alert variant="destructive">
                  <lu_1.LuTriangleAlert className="h-4 w-4"/>
                  <react_1.AlertTitle>{validationError}</react_1.AlertTitle>
                </react_1.Alert>)}
              <react_1.InputGroup>
                <react_1.Input name="trackedEntityId" value={serialNumber} isDisabled={fetcher.state !== "idle"} onChange={function (e) { return handleSerialNumberChange(e.target.value); }} onBlur={handleBlur} onKeyDown={handleKeyDown} autoFocus placeholder={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Enter or scan serial number"], ["Enter or scan serial number"])))} className={(0, react_1.cn)(validationError && "border-destructive", isValid && "border-emerald-500")} disabled={isLoading}/>
                <react_1.InputRightElement className="pl-2">
                  {isLoading ? (<div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full"/>) : validationError ? (<lu_1.LuX className="text-destructive"/>) : isValid ? (<lu_1.LuCheck className="text-emerald-500"/>) : (<lu_1.LuQrCode />)}
                </react_1.InputRightElement>
              </react_1.InputGroup>
            </div>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" isDisabled={fetcher.state !== "idle"} onClick={function () { return onClose(); }}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <react_1.Button leftIcon={<lu_1.LuCircleCheck />} isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"} onClick={function () { return validateTrackedEntity(serialNumber); }}>
              <macro_1.Trans>Pick</macro_1.Trans>
            </react_1.Button>
          </react_1.ModalFooter>
        </react_1.ModalContent>
      </form_1.ValidatedForm>
    </react_1.Modal>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
