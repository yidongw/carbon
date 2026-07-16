"use client";
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
exports.AdjustInventory = AdjustInventory;
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var inventory_service_1 = require("~/services/inventory.service");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
function AdjustInventory(_a) {
    var _b, _c;
    var add = _a.add;
    var t = (0, macro_1.useLingui)().t;
    var modal = (0, react_1.useDisclosure)();
    var fetcher = (0, react_router_1.useFetcher)();
    var items = (0, stores_1.useItems)()[0];
    var _d = (0, react_2.useState)(false), loading = _d[0], setLoading = _d[1];
    var _e = (0, react_2.useState)([]), storageUnits = _e[0], setStorageUnits = _e[1];
    var _f = (0, react_2.useState)(null), selectedStorageUnit = _f[0], setSelectedStorageUnit = _f[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    var routeData = (0, react_1.useRouteData)(path_1.path.to.authenticatedRoot);
    var onItemChange = function (value) {
        var _a;
        if (!value || !carbon)
            return;
        carbon
            .from("pickMethod")
            .select("defaultStorageUnitId")
            .eq("itemId", value.value)
            .eq("locationId", (_a = routeData === null || routeData === void 0 ? void 0 : routeData.location) !== null && _a !== void 0 ? _a : "")
            .maybeSingle()
            .then(function (pickMethod) {
            var _a, _b;
            setSelectedStorageUnit((_b = (_a = pickMethod === null || pickMethod === void 0 ? void 0 : pickMethod.data) === null || _a === void 0 ? void 0 : _a.defaultStorageUnitId) !== null && _b !== void 0 ? _b : null);
        });
    };
    function fetchStorageUnitsByLocationId() {
        return __awaiter(this, void 0, void 0, function () {
            var storageUnits;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!carbon) {
                            react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failed to fetch storageUnits"], ["Failed to fetch storageUnits"]))));
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, carbon
                                .from("storageUnit")
                                .select("id, name")
                                .eq("locationId", (_a = routeData === null || routeData === void 0 ? void 0 : routeData.location) !== null && _a !== void 0 ? _a : "")];
                    case 1:
                        storageUnits = _d.sent();
                        setStorageUnits((_c = (_b = storageUnits.data) === null || _b === void 0 ? void 0 : _b.map(function (storageUnit) { return ({
                            value: storageUnit.id,
                            label: storageUnit.name
                        }); })) !== null && _c !== void 0 ? _c : []);
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        });
    }
    (0, react_1.useMount)(function () {
        setLoading(true);
        fetchStorageUnitsByLocationId();
    });
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var _a, _b, _c, _d, _e, _f;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === true) {
            modal.onClose();
            react_1.toast.success((_c = (_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.message) !== null && _c !== void 0 ? _c : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Inventory adjustment completed"], ["Inventory adjustment completed"]))));
        }
        if (((_d = fetcher.data) === null || _d === void 0 ? void 0 : _d.success) === false) {
            react_1.toast.error((_f = (_e = fetcher.data) === null || _e === void 0 ? void 0 : _e.message) !== null && _f !== void 0 ? _f : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Failed to complete inventory adjustment"], ["Failed to complete inventory adjustment"]))));
        }
    }, [(_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success]);
    var itemOptions = (0, react_2.useMemo)(function () {
        return items
            .filter(function (i) { return !["Batch", "Serial"].includes(i.itemTrackingType); })
            .map(function (item) { return ({
            label: item.readableIdWithRevision,
            helper: item.name,
            value: item.id
        }); });
    }, [items]);
    return (<>
      <react_1.SidebarMenuButton tooltip={add ? t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Add Inventory"], ["Add Inventory"]))) : t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Remove Inventory"], ["Remove Inventory"])))} onClick={modal.onOpen}>
        {add ? <lu_1.LuGitPullRequestCreateArrow /> : <lu_1.LuGitBranchPlus />}
        <span>
          {add ? <macro_1.Trans>Add Inventory</macro_1.Trans> : <macro_1.Trans>Remove Inventory</macro_1.Trans>}
        </span>
      </react_1.SidebarMenuButton>
      {modal.isOpen && (<react_1.Modal open={modal.isOpen} onOpenChange={function (open) { return !open && modal.onClose(); }}>
          <react_1.ModalContent>
            <form_1.ValidatedForm method="post" action={path_1.path.to.inventoryAdjustment} validator={inventory_service_1.inventoryAdjustmentValidator} defaultValues={{
                itemId: "",
                quantity: 1,
                entryType: add ? "Positive Adjmt." : "Negative Adjmt."
            }} fetcher={fetcher}>
              <react_1.ModalHeader>
                <react_1.ModalTitle>
                  {add ? (<macro_1.Trans>Add Inventory</macro_1.Trans>) : (<macro_1.Trans>Remove Inventory</macro_1.Trans>)}
                </react_1.ModalTitle>
                <react_1.ModalDescription>
                  {add ? (<macro_1.Trans>Manually add items to inventory</macro_1.Trans>) : (<macro_1.Trans>Manually remove items from inventory</macro_1.Trans>)}
                </react_1.ModalDescription>
              </react_1.ModalHeader>
              <react_1.ModalBody>
                <form_1.Hidden name="entryType" value={add ? "Positive Adjmt." : "Negative Adjmt."}/>
                <form_1.Hidden name="locationId" value={(_c = routeData === null || routeData === void 0 ? void 0 : routeData.location) !== null && _c !== void 0 ? _c : ""}/>
                <react_1.VStack spacing={4}>
                  <react_1.Loading isLoading={loading}>
                    <form_1.Combobox label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Item"], ["Item"])))} name="itemId" onChange={onItemChange} options={itemOptions} itemHeight={44}/>
                    <form_1.Number label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Quantity"], ["Quantity"])))} name="quantity"/>
                    <form_1.Combobox label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Storage Unit"], ["Storage Unit"])))} name="storageUnitId" options={storageUnits} value={selectedStorageUnit !== null && selectedStorageUnit !== void 0 ? selectedStorageUnit : ""} onChange={function (value) { var _a; return setSelectedStorageUnit((_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null); }}/>
                  </react_1.Loading>
                </react_1.VStack>
              </react_1.ModalBody>

              <react_1.ModalFooter>
                <react_1.Button type="button" onClick={modal.onClose} variant="secondary">
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>

                <form_1.Submit>
                  {add ? (<macro_1.Trans>Add Inventory</macro_1.Trans>) : (<macro_1.Trans>Remove Inventory</macro_1.Trans>)}
                </form_1.Submit>
              </react_1.ModalFooter>
            </form_1.ValidatedForm>
          </react_1.ModalContent>
        </react_1.Modal>)}
    </>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
