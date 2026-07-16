"use strict";
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
exports.action = action;
exports.default = MaterialDetailsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var items_1 = require("~/modules/items");
var Item_1 = require("~/modules/items/ui/Item");
var form_2 = require("~/utils/form");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, itemId, formData, validation, updateMaterial, _d, _e, _f, _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "parts"
                        })];
                case 1:
                    _c = _h.sent(), client = _c.client, userId = _c.userId;
                    itemId = params.itemId;
                    if (!itemId)
                        throw new Error("Could not find itemId");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _h.sent();
                    return [4 /*yield*/, (0, form_1.validator)(items_1.materialValidator).validate(formData)];
                case 3:
                    validation = _h.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, items_1.upsertMaterial)(client, __assign(__assign({}, validation.data), { id: itemId, customFields: (0, form_2.setCustomFields)(formData), updatedBy: userId }))];
                case 4:
                    updateMaterial = _h.sent();
                    if (!updateMaterial.error) return [3 /*break*/, 6];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.material(itemId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateMaterial.error, "Failed to update material"))];
                case 5: throw _d.apply(void 0, _e.concat([_h.sent()]));
                case 6:
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.material(itemId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated material"))];
                case 7: throw _f.apply(void 0, _g.concat([_h.sent()]));
            }
        });
    });
}
function MaterialDetailsRoute() {
    var _a, _b, _c, _d, _e, _f, _g;
    var itemId = (0, react_router_1.useParams)().itemId;
    if (!itemId)
        throw new Error("Could not find itemId");
    var materialData = (0, hooks_1.useRouteData)(path_1.path.to.material(itemId));
    if (!materialData)
        throw new Error("Could not find material data");
    var permissions = (0, hooks_1.usePermissions)();
    return (<react_1.VStack spacing={2} className="p-2">
      <Item_1.ItemNotes id={(_b = (_a = materialData.materialSummary) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null} title={(_d = (_c = materialData.materialSummary) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : ""} subTitle={(_f = (_e = materialData.materialSummary) === null || _e === void 0 ? void 0 : _e.readableIdWithRevision) !== null && _f !== void 0 ? _f : ""} notes={(_g = materialData.materialSummary) === null || _g === void 0 ? void 0 : _g.notes}/>
      {permissions.is("employee") && (<>
          <components_1.DeferredFiles resolve={materialData === null || materialData === void 0 ? void 0 : materialData.files}>
            {function (resolvedFiles) { return (<Item_1.ItemDocuments files={resolvedFiles} itemId={itemId} type="Material"/>); }}
          </components_1.DeferredFiles>

          <Item_1.ItemRiskRegister itemId={itemId}/>
        </>)}
    </react_1.VStack>);
}
