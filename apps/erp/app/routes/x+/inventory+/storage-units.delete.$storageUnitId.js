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
exports.clientAction = clientAction;
exports.default = DeleteStorageUnitRoute;
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
var react_query_1 = require("~/utils/react-query");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, storageUnitId, _c, storageUnit, children, _d, _e, childCount;
        var _f, _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "inventory"
                    })];
                case 1:
                    client = (_h.sent()).client;
                    storageUnitId = params.storageUnitId;
                    if (!storageUnitId)
                        throw (0, auth_1.notFound)("storageUnitId not found");
                    return [4 /*yield*/, Promise.all([
                            (0, inventory_1.getStorageUnit)(client, storageUnitId),
                            client.from("storageUnit").select("id").eq("parentId", storageUnitId)
                        ])];
                case 2:
                    _c = _h.sent(), storageUnit = _c[0], children = _c[1];
                    if (!storageUnit.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.storageUnits];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(storageUnit.error, "Failed to get storageUnit"))];
                case 3: throw _d.apply(void 0, _e.concat([_h.sent()]));
                case 4:
                    childCount = (_g = (_f = children.data) === null || _f === void 0 ? void 0 : _f.length) !== null && _g !== void 0 ? _g : 0;
                    return [2 /*return*/, { storageUnit: storageUnit.data, childCount: childCount }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, storageUnitId, _c, _d, formData, cascade, deleteResult, _e, _f, _g, _h, _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        delete: "inventory"
                    })];
                case 1:
                    client = (_k.sent()).client;
                    storageUnitId = params.storageUnitId;
                    if (!!storageUnitId) return [3 /*break*/, 3];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.storageUnits];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(params, "Failed to get a storageUnit id"))];
                case 2: throw _c.apply(void 0, _d.concat([_k.sent()]));
                case 3: return [4 /*yield*/, request.formData()];
                case 4:
                    formData = _k.sent();
                    cascade = formData.get("cascade") === "true";
                    if (!cascade) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, inventory_1.deleteStorageUnitCascade)(client, storageUnitId)];
                case 5:
                    _e = _k.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, (0, inventory_1.deleteStorageUnit)(client, storageUnitId)];
                case 7:
                    _e = _k.sent();
                    _k.label = 8;
                case 8:
                    deleteResult = _e;
                    if (!deleteResult.error) return [3 /*break*/, 10];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.storageUnits];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(deleteResult.error, "Failed to delete storage unit"))];
                case 9: throw _f.apply(void 0, _g.concat([_k.sent()]));
                case 10:
                    _h = react_router_1.redirect;
                    _j = ["".concat(path_1.path.to.storageUnits, "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)(cascade
                            ? "Successfully deleted storage unit and nested units"
                            : "Successfully deleted storage unit"))];
                case 11: throw _h.apply(void 0, _j.concat([_k.sent()]));
            }
        });
    });
}
function clientAction(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var companyId;
        var _c;
        var serverAction = _b.serverAction;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    companyId = (0, react_query_1.getCompanyId)();
                    (_c = window.clientCache) === null || _c === void 0 ? void 0 : _c.invalidateQueries({
                        predicate: function (query) {
                            var queryKey = query.queryKey;
                            return queryKey[0] === "storageUnits" && queryKey[1] === companyId;
                        }
                    });
                    return [4 /*yield*/, serverAction()];
                case 1: return [2 /*return*/, _d.sent()];
            }
        });
    });
}
function DeleteStorageUnitRoute() {
    var storageUnitId = (0, react_router_1.useParams)().storageUnitId;
    if (!storageUnitId)
        throw (0, auth_1.notFound)("storageUnitId not found");
    var _a = (0, react_router_1.useLoaderData)(), storageUnit = _a.storageUnit, childCount = _a.childCount;
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    if (!storageUnit)
        return null;
    var onCancel = function () { return navigate(path_1.path.to.storageUnits); };
    // When the unit has no children, reuse the standard ConfirmDelete — it
    // posts nothing special and the server path goes through the non-cascade
    // branch.
    if (childCount === 0) {
        return (<Modals_1.ConfirmDelete action={path_1.path.to.deleteStorageUnit(storageUnitId)} name={storageUnit.name} text={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Are you sure you want to delete the storage unit: ", "? This cannot be undone."], ["Are you sure you want to delete the storage unit: ", "? This cannot be undone."])), storageUnit.name)} onCancel={onCancel}/>);
    }
    return (<DeleteWithCascadeModal storageUnitId={storageUnitId} storageUnitName={storageUnit.name} childCount={childCount} onCancel={onCancel}/>);
}
function DeleteWithCascadeModal(_a) {
    var storageUnitId = _a.storageUnitId, storageUnitName = _a.storageUnitName, childCount = _a.childCount, onCancel = _a.onCancel;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var _b = (0, react_2.useState)(false), cascade = _b[0], setCascade = _b[1];
    var submitted = (0, react_2.useRef)(false);
    (0, react_2.useEffect)(function () {
        if (fetcher.state === "idle" && submitted.current) {
            submitted.current = false;
        }
    }, [fetcher.state]);
    var disabled = !cascade;
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open)
                onCancel();
        }}>
      <react_1.ModalOverlay />
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>{t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Delete ", ""], ["Delete ", ""])), storageUnitName)}</react_1.ModalTitle>
        </react_1.ModalHeader>

        <react_1.ModalBody>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              {childCount === 1
            ? t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\"", "\" has 1 direct nested storage unit. Deleting it will also delete that unit and anything underneath it. This cannot be undone."], ["\"", "\" has 1 direct nested storage unit. Deleting it will also delete that unit and anything underneath it. This cannot be undone."])), storageUnitName) : t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\"", "\" has ", " direct nested storage units. Deleting it will also delete them and anything underneath them. This cannot be undone."], ["\"", "\" has ", " direct nested storage units. Deleting it will also delete them and anything underneath them. This cannot be undone."])), storageUnitName, childCount)}
            </p>
            <label className="flex items-start gap-2 bg-muted/20 pt-3 text-sm">
              <react_1.Checkbox isChecked={cascade} onCheckedChange={function (v) { return setCascade(v === true); }} className="mt-0.5"/>
              <span className="leading-snug">
                <macro_1.Trans>Yes, also delete every nested storage unit.</macro_1.Trans>
              </span>
            </label>
          </div>
        </react_1.ModalBody>

        <react_1.ModalFooter>
          <react_1.Button variant="secondary" onClick={onCancel}>
            <macro_1.Trans>Cancel</macro_1.Trans>
          </react_1.Button>
          <fetcher.Form method="post" action={path_1.path.to.deleteStorageUnit(storageUnitId)} onSubmit={function () { return (submitted.current = true); }}>
            <input type="hidden" name="cascade" value="true"/>
            <react_1.Button type="submit" variant="destructive" isDisabled={disabled || fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
              <macro_1.Trans>Delete</macro_1.Trans>
            </react_1.Button>
          </fetcher.Form>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
