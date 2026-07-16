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
var auth_1 = require("@carbon/auth");
var storage_rules_1 = require("@carbon/ee/storage-rules");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var __1 = require("../..");
var ShipmentPostModal = function (_a) {
    var _b, _c, _d;
    var onClose = _a.onClose;
    var shipmentId = (0, react_router_1.useParams)().shipmentId;
    if (!shipmentId)
        throw new Error("shipmentId not found");
    var t = (0, macro_1.useLingui)().t;
    var items = (0, stores_1.useItems)()[0];
    var routeData = (0, react_1.useRouteData)(path_1.path.to.shipment(shipmentId));
    var navigation = (0, react_router_1.useNavigation)();
    var _e = (0, react_2.useState)(false), validated = _e[0], setValidated = _e[1];
    var _f = (0, react_2.useState)([]), validationErrors = _f[0], setValidationErrors = _f[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    var companyId = (0, hooks_1.useUser)().company.id;
    var settings = (0, hooks_1.useSettings)();
    var expiredPolicy = (_d = (_c = ((_b = settings.inventoryShelfLife) !== null && _b !== void 0 ? _b : null)) === null || _c === void 0 ? void 0 : _c.expiredEntityPolicy) !== null && _d !== void 0 ? _d : "Block";
    var _g = (0, react_2.useState)([]), expiredWarnings = _g[0], setExpiredWarnings = _g[1];
    var _h = (0, react_2.useState)([]), expiredErrors = _h[0], setExpiredErrors = _h[1];
    var validateShipmentTracking = function () { return __awaiter(void 0, void 0, void 0, function () {
        var errors, shipmentLineTracking, hasShipmentLines, hasFaLines, todayLocal, isExpired, expiredCollected, expiredBlocked;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    errors = [];
                    if (!carbon) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Carbon client is not available"], ["Carbon client is not available"]))));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, __1.getShipmentTracking)(carbon, shipmentId, companyId)];
                case 1:
                    shipmentLineTracking = _b.sent();
                    hasShipmentLines = routeData === null || routeData === void 0 ? void 0 : routeData.shipmentLines.some(function (line) { var _a; return ((_a = line.shippedQuantity) !== null && _a !== void 0 ? _a : 0) > 0; });
                    hasFaLines = ((_a = routeData === null || routeData === void 0 ? void 0 : routeData.fixedAssetLines) !== null && _a !== void 0 ? _a : []).some(function (line) { return line.shipped; });
                    if (!hasShipmentLines && !hasFaLines) {
                        setValidationErrors([
                            {
                                itemReadableId: null,
                                shippedQuantity: 0,
                                shippedQuantityError: "Shipment is empty"
                            }
                        ]);
                    }
                    todayLocal = (0, date_1.today)((0, date_1.getLocalTimeZone)());
                    isExpired = function (expirationDate) {
                        if (!expirationDate)
                            return false;
                        try {
                            return (0, date_1.parseDate)(expirationDate).compare(todayLocal) < 0;
                        }
                        catch (_a) {
                            return false;
                        }
                    };
                    expiredCollected = [];
                    expiredBlocked = [];
                    routeData === null || routeData === void 0 ? void 0 : routeData.shipmentLines.forEach(function (line) {
                        var _a, _b, _c, _d, _e, _f, _g, _h;
                        if (line.requiresBatchTracking) {
                            var trackedEntity = (_a = shipmentLineTracking.data) === null || _a === void 0 ? void 0 : _a.find(function (tracking) {
                                var attributes = tracking.attributes;
                                return attributes["Shipment Line"] === line.id;
                            });
                            if ((trackedEntity === null || trackedEntity === void 0 ? void 0 : trackedEntity.status) !== "Available") {
                                errors.push({
                                    itemReadableId: (_b = (0, utils_1.getItemReadableId)(items, line.itemId)) !== null && _b !== void 0 ? _b : null,
                                    shippedQuantity: (_c = line.shippedQuantity) !== null && _c !== void 0 ? _c : 0,
                                    shippedQuantityError: "Tracked entity is not available"
                                });
                            }
                            if (trackedEntity && isExpired(trackedEntity.expirationDate)) {
                                var itemReadableId = (_d = (0, utils_1.getItemReadableId)(items, line.itemId)) !== null && _d !== void 0 ? _d : null;
                                var readableId = (_e = trackedEntity.readableId) !== null && _e !== void 0 ? _e : trackedEntity.id;
                                var entry = {
                                    itemReadableId: itemReadableId,
                                    readableId: readableId,
                                    expirationDate: trackedEntity.expirationDate
                                };
                                if (expiredPolicy === "Block" ||
                                    expiredPolicy === "BlockWithOverride") {
                                    expiredBlocked.push(entry);
                                }
                                else {
                                    expiredCollected.push(entry);
                                }
                            }
                        }
                        if (line.requiresSerialTracking) {
                            var trackedEntities = (_f = shipmentLineTracking.data) === null || _f === void 0 ? void 0 : _f.filter(function (tracking) {
                                var attributes = tracking.attributes;
                                return attributes["Shipment Line"] === line.id;
                            });
                            var quantityAvailable = trackedEntities === null || trackedEntities === void 0 ? void 0 : trackedEntities.reduce(function (acc, tracking) {
                                var trackingQuantity = Number(tracking.quantity);
                                return acc + (tracking.status === "Available" ? trackingQuantity : 0);
                            }, 0);
                            if (quantityAvailable !== line.shippedQuantity) {
                                errors.push({
                                    itemReadableId: (_g = (0, utils_1.getItemReadableId)(items, line.itemId)) !== null && _g !== void 0 ? _g : null,
                                    shippedQuantity: (_h = line.shippedQuantity) !== null && _h !== void 0 ? _h : 0,
                                    shippedQuantityError: "Serial numbers are missing or unavailable"
                                });
                            }
                            trackedEntities === null || trackedEntities === void 0 ? void 0 : trackedEntities.forEach(function (trackedEntity) {
                                var _a, _b;
                                if (!isExpired(trackedEntity.expirationDate))
                                    return;
                                var itemReadableId = (_a = (0, utils_1.getItemReadableId)(items, line.itemId)) !== null && _a !== void 0 ? _a : null;
                                var readableId = (_b = trackedEntity.readableId) !== null && _b !== void 0 ? _b : trackedEntity.id;
                                var entry = {
                                    itemReadableId: itemReadableId,
                                    readableId: readableId,
                                    expirationDate: trackedEntity.expirationDate
                                };
                                if (expiredPolicy === "Block" ||
                                    expiredPolicy === "BlockWithOverride") {
                                    expiredBlocked.push(entry);
                                }
                                else {
                                    expiredCollected.push(entry);
                                }
                            });
                        }
                    });
                    setValidationErrors(errors);
                    setExpiredWarnings(expiredCollected);
                    setExpiredErrors(expiredBlocked);
                    setValidated(true);
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useMount)(function () {
        validateShipmentTracking();
    });
    var ruleViolations = (0, storage_rules_1.useStorageRuleViolations)({
        action: path_1.path.to.shipmentPost(shipmentId),
        onSuccess: onClose
    });
    var fetcher = ruleViolations.fetcher;
    return (<react_1.Modal open={true} onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.ModalOverlay />
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Post Shipment</macro_1.Trans>
          </react_1.ModalTitle>
          <react_1.ModalDescription>
            <macro_1.Trans>Are you sure you want to post this shipment?</macro_1.Trans>
          </react_1.ModalDescription>
        </react_1.ModalHeader>
        <react_1.ModalBody>
          {validationErrors.length > 0 && (<react_1.Alert variant="destructive">
              <lu_1.LuTriangleAlert className="h-4 w-4"/>
              <react_1.AlertTitle>
                <macro_1.Trans>Missing Information</macro_1.Trans>
              </react_1.AlertTitle>
              <react_1.AlertDescription>
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  {validationErrors.map(function (error, index) { return (<li key={index} className="text-sm font-medium">
                      <span className="font-mono">{error.itemReadableId}</span>
                      <span className="text-muted-foreground ml-2">
                        {error.shippedQuantity}
                      </span>
                      <span className="block mt-0.5 text-red-500 font-normal">
                        {error.shippedQuantityError}
                      </span>
                    </li>); })}
                </ul>
              </react_1.AlertDescription>
            </react_1.Alert>)}
          {expiredErrors.length > 0 && (<react_1.Alert variant="destructive" className="mt-4">
              <lu_1.LuTriangleAlert className="h-4 w-4"/>
              <react_1.AlertTitle>
                <macro_1.Trans>Expired Batches</macro_1.Trans>
              </react_1.AlertTitle>
              <react_1.AlertDescription>
                <macro_1.Trans>
                  Cannot post — shipment contains expired tracked entities.
                </macro_1.Trans>
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  {expiredErrors.map(function (w, index) { return (<li key={index} className="text-sm font-medium">
                      <span className="font-mono">{w.itemReadableId}</span>
                      <span className="text-muted-foreground ml-2">
                        {w.readableId}
                      </span>
                      <span className="block mt-0.5 text-red-500 font-normal">
                        Expired on {w.expirationDate}
                      </span>
                    </li>); })}
                </ul>
              </react_1.AlertDescription>
            </react_1.Alert>)}
          {expiredWarnings.length > 0 && (<react_1.Alert variant="warning" className="mt-4">
              <lu_1.LuTriangleAlert className="h-4 w-4"/>
              <react_1.AlertTitle>
                <macro_1.Trans>Expired Batches</macro_1.Trans>
              </react_1.AlertTitle>
              <react_1.AlertDescription>
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  {expiredWarnings.map(function (w, index) { return (<li key={index} className="text-sm font-medium">
                      <span className="font-mono">{w.itemReadableId}</span>
                      <span className="text-muted-foreground ml-2">
                        {w.readableId}
                      </span>
                      <span className="block mt-0.5 text-amber-600 font-normal">
                        Expired on {w.expirationDate}
                      </span>
                    </li>); })}
                </ul>
              </react_1.AlertDescription>
            </react_1.Alert>)}
        </react_1.ModalBody>
        <react_1.ModalFooter>
          <react_1.HStack>
            <react_1.Button variant="solid" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <form onSubmit={function (e) {
            e.preventDefault();
            ruleViolations.submit(new FormData());
        }}>
              <react_1.Button isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle" ||
            navigation.state !== "idle" ||
            !validated ||
            validationErrors.length > 0 ||
            expiredErrors.length > 0} type="submit">
                Post Shipment
              </react_1.Button>
            </form>
          </react_1.HStack>
        </react_1.ModalFooter>
      </react_1.ModalContent>
      <ruleViolations.ViolationModal />
    </react_1.Modal>);
};
exports.default = ShipmentPostModal;
var templateObject_1;
