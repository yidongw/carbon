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
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var StockTransferPostModal = function (_a) {
    var onClose = _a.onClose;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("id not found");
    var t = (0, macro_1.useLingui)().t;
    var items = (0, stores_1.useItems)()[0];
    var routeData = (0, react_1.useRouteData)(path_1.path.to.stockTransfer(id));
    var navigation = (0, react_router_1.useNavigation)();
    var _b = (0, react_2.useState)(false), validated = _b[0], setValidated = _b[1];
    var _c = (0, react_2.useState)([]), validationErrors = _c[0], setValidationErrors = _c[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    var companyId = (0, hooks_1.useUser)().company.id;
    var validateStockTransferTracking = function () { return __awaiter(void 0, void 0, void 0, function () {
        var errors;
        return __generator(this, function (_a) {
            errors = [];
            if (!carbon) {
                react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Carbon client is not available"], ["Carbon client is not available"]))));
                return [2 /*return*/];
            }
            if ((routeData === null || routeData === void 0 ? void 0 : routeData.stockTransferLines.length) === 0 ||
                (routeData === null || routeData === void 0 ? void 0 : routeData.stockTransferLines.every(function (line) { return line.pickedQuantity === 0; }))) {
                setValidationErrors([
                    {
                        itemReadableId: null,
                        pickedQuantity: 0,
                        pickedQuantityError: "Stock transfer is empty"
                    }
                ]);
            }
            routeData === null || routeData === void 0 ? void 0 : routeData.stockTransferLines.forEach(function (line) { return __awaiter(void 0, void 0, void 0, function () {
                var trackedEntity;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (!(line.requiresBatchTracking || line.requiresSerialTracking)) return [3 /*break*/, 2];
                            if (!line.trackedEntityId) return [3 /*break*/, 2];
                            return [4 /*yield*/, carbon
                                    .from("trackedEntity")
                                    .select("*")
                                    .eq("id", line.trackedEntityId)
                                    .single()];
                        case 1:
                            trackedEntity = _d.sent();
                            if (((_a = trackedEntity.data) === null || _a === void 0 ? void 0 : _a.status) !== "Available") {
                                errors.push({
                                    itemReadableId: (_b = (0, utils_1.getItemReadableId)(items, line.itemId)) !== null && _b !== void 0 ? _b : null,
                                    pickedQuantity: (_c = line.pickedQuantity) !== null && _c !== void 0 ? _c : 0,
                                    pickedQuantityError: "Tracked entity is not available"
                                });
                            }
                            _d.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); });
            setValidationErrors(errors);
            setValidated(true);
            return [2 /*return*/];
        });
    }); };
    (0, react_1.useMount)(function () {
        validateStockTransferTracking();
    });
    var fetcher = (0, react_router_1.useFetcher)();
    var submitted = (0, react_2.useRef)(false);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (fetcher.state === "idle" && submitted.current) {
            onClose();
        }
    }, [fetcher.state]);
    return (<react_1.Modal open={true} onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.ModalOverlay />
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Complete Stock Transfer</macro_1.Trans>
          </react_1.ModalTitle>
          <react_1.ModalDescription>
            <macro_1.Trans>
              Are you sure you want to complete this stock transfer?
            </macro_1.Trans>
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
                        {error.pickedQuantity}
                      </span>
                      <span className="block mt-0.5 text-red-500 font-normal">
                        {error.pickedQuantityError}
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
            <fetcher.Form action={path_1.path.to.stockTransferComplete(id)} method="post" onSubmit={function () {
            submitted.current = true;
        }}>
              <react_1.Button isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle" ||
            navigation.state !== "idle" ||
            !validated ||
            validationErrors.length > 0} type="submit">
                Complete
              </react_1.Button>
            </fetcher.Form>
          </react_1.HStack>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
};
exports.default = StockTransferPostModal;
var templateObject_1;
