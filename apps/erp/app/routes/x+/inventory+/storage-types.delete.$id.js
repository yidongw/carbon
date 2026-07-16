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
exports.loader = loader;
exports.action = action;
exports.default = DeleteStorageTypeRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Modals_1 = require("~/components/Modals");
var inventory_1 = require("~/modules/inventory");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, id, storageType, _d, _e, usage;
        var _f, _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "parts"
                    })];
                case 1:
                    _c = _h.sent(), client = _c.client, companyId = _c.companyId;
                    id = params.id;
                    if (!id)
                        throw (0, auth_1.notFound)("id not found");
                    return [4 /*yield*/, (0, inventory_1.getStorageType)(client, id)];
                case 2:
                    storageType = _h.sent();
                    if (!storageType.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.storageTypes];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(storageType.error, "Failed to get storage type"))];
                case 3: throw _d.apply(void 0, _e.concat([_h.sent()]));
                case 4: return [4 /*yield*/, (0, inventory_1.getStorageTypeUsage)(client, id, companyId)];
                case 5:
                    usage = _h.sent();
                    return [2 /*return*/, {
                            storageType: storageType.data,
                            usageCount: (_f = usage.count) !== null && _f !== void 0 ? _f : 0,
                            sampleUnits: (_g = usage.data) !== null && _g !== void 0 ? _g : []
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, id, _d, _e, formData, cascade, usage, usageCount, _f, _g, deleteTypeError, _h, _j, _k, _l;
        var _m;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        delete: "parts"
                    })];
                case 1:
                    _c = _o.sent(), client = _c.client, companyId = _c.companyId;
                    id = params.id;
                    if (!!id) return [3 /*break*/, 3];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.storageTypes];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(params, "Failed to get a storage type id"))];
                case 2: throw _d.apply(void 0, _e.concat([_o.sent()]));
                case 3: return [4 /*yield*/, request.formData()];
                case 4:
                    formData = _o.sent();
                    cascade = formData.get("cascade") === "true";
                    return [4 /*yield*/, (0, inventory_1.getStorageTypeUsage)(client, id, companyId)];
                case 5:
                    usage = _o.sent();
                    usageCount = (_m = usage.count) !== null && _m !== void 0 ? _m : 0;
                    if (!(usageCount > 0 && !cascade)) return [3 /*break*/, 7];
                    _f = react_router_1.redirect;
                    _g = ["".concat(path_1.path.to.storageTypes, "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)({ usageCount: usageCount }, "Storage type is in use; confirm cascade to delete"))];
                case 6: throw _f.apply(void 0, _g.concat([_o.sent()]));
                case 7: return [4 /*yield*/, (0, inventory_1.deleteStorageTypeWithCascade)(client, id, companyId)];
                case 8:
                    deleteTypeError = (_o.sent()).error;
                    if (!deleteTypeError) return [3 /*break*/, 10];
                    _h = react_router_1.redirect;
                    _j = ["".concat(path_1.path.to.storageTypes, "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(deleteTypeError, "Failed to delete storage type"))];
                case 9: throw _h.apply(void 0, _j.concat([_o.sent()]));
                case 10:
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.storageTypes];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Successfully deleted storage type"))];
                case 11: throw _k.apply(void 0, _l.concat([_o.sent()]));
            }
        });
    });
}
function DeleteStorageTypeRoute() {
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("id not found");
    var _a = (0, react_router_1.useLoaderData)(), storageType = _a.storageType, usageCount = _a.usageCount, sampleUnits = _a.sampleUnits;
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    if (!storageType)
        return null;
    var onCancel = function () { return navigate(-1); };
    if (usageCount === 0) {
        return (<Modals_1.ConfirmDelete action={path_1.path.to.deleteStorageType(id)} name={storageType.name} text={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Are you sure you want to delete the storage type: ", "? This cannot be undone."], ["Are you sure you want to delete the storage type: ", "? This cannot be undone."])), storageType.name)} onCancel={onCancel}/>);
    }
    return (<CascadeConfirmDelete action={path_1.path.to.deleteStorageType(id)} name={storageType.name} usageCount={usageCount} sampleUnits={sampleUnits} onCancel={onCancel}/>);
}
function CascadeConfirmDelete(_a) {
    var action = _a.action, name = _a.name, usageCount = _a.usageCount, sampleUnits = _a.sampleUnits, onCancel = _a.onCancel;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var _b = (0, react_2.useState)(false), cascade = _b[0], setCascade = _b[1];
    var remaining = usageCount - sampleUnits.length;
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open)
                onCancel();
        }}>
      <react_1.ModalOverlay />
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>{t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Delete ", ""], ["Delete ", ""])), name)}</react_1.ModalTitle>
        </react_1.ModalHeader>

        <react_1.ModalBody>
          <div className="flex flex-col gap-3 text-sm">
            <p className="text-muted-foreground">
              <macro_1.Trans>
                This storage type is currently used by {usageCount} storage unit
                {usageCount === 1 ? "" : "s"}.
              </macro_1.Trans>
            </p>
            {sampleUnits.length > 0 && (<ul className="list-disc pl-5 text-muted-foreground">
                {sampleUnits.map(function (u) { return (<li key={u.id}>{u.name}</li>); })}
                {remaining > 0 && (<li>
                    <macro_1.Trans>and {remaining} more</macro_1.Trans>
                  </li>)}
              </ul>)}
            <fetcher.Form id="cascade-delete-form" method="post" action={action}>
              <label className="flex items-start gap-2 cursor-pointer">
                <react_1.Checkbox name="cascade" value="true" isChecked={cascade} onCheckedChange={function (c) { return setCascade(c === true); }} className="mt-0.5"/>
                <span>
                  <macro_1.Trans>
                    Remove this storage type from all referencing storage units
                    and delete it. This cannot be undone.
                  </macro_1.Trans>
                </span>
              </label>
            </fetcher.Form>
          </div>
        </react_1.ModalBody>

        <react_1.ModalFooter>
          <react_1.Button variant="secondary" onClick={onCancel}>
            <macro_1.Trans>Cancel</macro_1.Trans>
          </react_1.Button>
          <react_1.Button variant="destructive" type="submit" form="cascade-delete-form" isDisabled={!cascade || fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
            <macro_1.Trans>Delete</macro_1.Trans>
          </react_1.Button>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1, templateObject_2;
