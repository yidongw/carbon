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
exports.loader = loader;
exports.action = action;
exports.default = PurchaseFixedAssetRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var accounting_1 = require("~/modules/accounting");
var purchasing_1 = require("~/modules/purchasing");
var users_server_1 = require("~/modules/users/users.server");
var path_1 = require("~/utils/path");
var purchaseAssetValidator = zod_1.z.object({
    supplierId: zod_1.z.string().min(1, { message: "Supplier is required" })
});
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, fixedAssetId, asset, _c, _d, _e, _f;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "accounting"
                    })];
                case 1:
                    client = (_g.sent()).client;
                    fixedAssetId = params.fixedAssetId;
                    if (!fixedAssetId)
                        throw (0, auth_1.notFound)("fixedAssetId not found");
                    return [4 /*yield*/, (0, accounting_1.getFixedAsset)(client, fixedAssetId)];
                case 2:
                    asset = _g.sent();
                    if (!asset.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.fixedAssets];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(asset.error, "Failed to get fixed asset"))];
                case 3: throw _c.apply(void 0, _d.concat([_g.sent()]));
                case 4:
                    if (!(asset.data.status !== "Draft")) return [3 /*break*/, 6];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.fixedAsset(fixedAssetId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Only Draft assets can be purchased"))];
                case 5: throw _e.apply(void 0, _f.concat([_g.sent()]));
                case 6: return [2 /*return*/, null];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, companyGroupId, userId, fixedAssetId, formData, validation, supplierId, _d, asset, defaults, _e, _f, locationId, newPO, _g, _h, purchaseOrderId, _j, _k;
        var _l, _m, _o;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "purchasing"
                        })];
                case 1:
                    _c = _p.sent(), client = _c.client, companyId = _c.companyId, companyGroupId = _c.companyGroupId, userId = _c.userId;
                    fixedAssetId = params.fixedAssetId;
                    if (!fixedAssetId)
                        throw (0, auth_1.notFound)("fixedAssetId not found");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _p.sent();
                    return [4 /*yield*/, (0, form_1.validator)(purchaseAssetValidator).validate(formData)];
                case 3:
                    validation = _p.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    supplierId = validation.data.supplierId;
                    return [4 /*yield*/, Promise.all([
                            (0, accounting_1.getFixedAsset)(client, fixedAssetId),
                            (0, users_server_1.getUserDefaults)(client, userId, companyId)
                        ])];
                case 4:
                    _d = _p.sent(), asset = _d[0], defaults = _d[1];
                    if (!(asset.error || !asset.data)) return [3 /*break*/, 6];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.fixedAssets];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(asset.error, "Failed to get fixed asset"))];
                case 5: throw _e.apply(void 0, _f.concat([_p.sent()]));
                case 6:
                    locationId = (_o = (_l = asset.data.locationId) !== null && _l !== void 0 ? _l : (_m = defaults.data) === null || _m === void 0 ? void 0 : _m.locationId) !== null && _o !== void 0 ? _o : "";
                    return [4 /*yield*/, (0, purchasing_1.insertPurchaseOrder)(client, {
                            supplierId: supplierId,
                            locationId: locationId,
                            status: "Draft",
                            purchaseOrderType: "Purchase",
                            companyId: companyId,
                            companyGroupId: companyGroupId,
                            createdBy: userId
                        })];
                case 7:
                    newPO = _p.sent();
                    if (!(newPO.error || !newPO.data)) return [3 /*break*/, 9];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.fixedAsset(fixedAssetId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(newPO.error, "Failed to create purchase order"))];
                case 8: throw _g.apply(void 0, _h.concat([_p.sent()]));
                case 9:
                    purchaseOrderId = newPO.data.id;
                    return [4 /*yield*/, (0, purchasing_1.upsertPurchaseOrderLine)(client, {
                            purchaseOrderId: purchaseOrderId,
                            purchaseOrderLineType: "Fixed Asset",
                            assetId: fixedAssetId,
                            description: asset.data.name,
                            locationId: locationId,
                            purchaseQuantity: 1,
                            supplierUnitPrice: 0,
                            supplierShippingCost: 0,
                            supplierTaxAmount: 0,
                            exchangeRate: 1,
                            purchaseUnitOfMeasureCode: "EA",
                            inventoryUnitOfMeasureCode: "EA",
                            conversionFactor: 1,
                            companyId: companyId,
                            createdBy: userId
                        })];
                case 10:
                    _p.sent();
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.purchaseOrder(purchaseOrderId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Purchase order created"))];
                case 11: throw _j.apply(void 0, _k.concat([_p.sent()]));
            }
        });
    });
}
function PurchaseFixedAssetRoute() {
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open)
                navigate(-1);
        }}>
      <react_1.ModalContent>
        <form_1.ValidatedForm validator={purchaseAssetValidator} method="post">
          <react_1.ModalHeader>
            <react_1.ModalTitle>Purchase Asset</react_1.ModalTitle>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <react_1.VStack spacing={4}>
              <Form_1.Supplier name="supplierId" label="Supplier"/>
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.HStack>
              <Form_1.Submit isDisabled={!permissions.can("create", "purchasing")}>
                Create Purchase Order
              </Form_1.Submit>
              <react_1.Button size="md" variant="solid" onClick={function () { return navigate(-1); }}>
                Cancel
              </react_1.Button>
            </react_1.HStack>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
