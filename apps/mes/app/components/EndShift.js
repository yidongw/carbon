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
exports.EndShift = EndShift;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var operations_service_1 = require("~/services/operations.service");
var path_1 = require("~/utils/path");
function EndShift() {
    var _this = this;
    var _a;
    var t = (0, macro_1.useLingui)().t;
    var confirmModal = (0, react_1.useDisclosure)();
    var fetcher = (0, react_router_1.useFetcher)();
    var user = (0, hooks_1.useUser)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _b = (0, react_2.useState)([]), operations = _b[0], setOperations = _b[1];
    var _c = (0, react_2.useState)(false), loading = _c[0], setLoading = _c[1];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var _a, _b, _c, _d, _e, _f;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === true) {
            confirmModal.onClose();
            react_1.toast.success((_c = (_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.message) !== null && _c !== void 0 ? _c : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Operations ended"], ["Operations ended"]))));
        }
        if (((_d = fetcher.data) === null || _d === void 0 ? void 0 : _d.success) === false) {
            react_1.toast.error((_f = (_e = fetcher.data) === null || _e === void 0 ? void 0 : _e.message) !== null && _f !== void 0 ? _f : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to end operations"], ["Failed to end operations"]))));
        }
    }, [(_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success]);
    var openModal = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    (0, react_dom_1.flushSync)(function () {
                        setLoading(true);
                        confirmModal.onOpen();
                    });
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, operations_service_1.getActiveJobOperationsByEmployee)(carbon, {
                            employeeId: user.id,
                            companyId: user.company.id
                        })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        react_1.toast.error(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Failed to fetch active operations"], ["Failed to fetch active operations"]))));
                    }
                    setOperations((data !== null && data !== void 0 ? data : []));
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return (<>
      <react_1.SidebarMenuButton tooltip={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["End Operations"], ["End Operations"])))} onClick={openModal}>
        <lu_1.LuCircleStop />
        <span>
          <macro_1.Trans>End Operations</macro_1.Trans>
        </span>
      </react_1.SidebarMenuButton>
      {confirmModal.isOpen && (<react_1.Modal open={confirmModal.isOpen} onOpenChange={function (open) { return !open && confirmModal.onClose(); }}>
          <react_1.ModalContent>
            <react_1.ModalHeader>
              <react_1.ModalTitle>
                <macro_1.Trans>End Operations</macro_1.Trans>
              </react_1.ModalTitle>
              <react_1.ModalDescription>
                <macro_1.Trans>
                  Are you sure you want to end all production events? This will
                  end all active operations without completing or finishing
                  them.
                </macro_1.Trans>
              </react_1.ModalDescription>
            </react_1.ModalHeader>
            <react_1.ModalBody>
              {loading ? (<div className="flex items-center justify-center w-full h-24">
                  <react_1.Spinner />
                </div>) : (operations === null || operations === void 0 ? void 0 : operations.length) === 0 ? (<div className="flex items-center justify-center w-full h-24 text-muted-foreground">
                  <macro_1.Trans>No active operations</macro_1.Trans>
                </div>) : (<div className="flex flex-col gap-4">
                  {operations.map(function (operation) { return (<div key={operation.id} className="flex items-start justify-between p-4 rounded-lg border">
                      <div className="flex flex-col gap-1">
                        <div className="font-medium">
                          {operation.jobReadableId}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {operation.description}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="text-sm text-muted-foreground">
                          {operation.itemReadableId}
                        </div>
                      </div>
                    </div>); })}
                </div>)}
            </react_1.ModalBody>
            <fetcher.Form method="post" action={path_1.path.to.endShift} className="w-full">
              <react_1.ModalFooter>
                <react_1.Button type="button" onClick={confirmModal.onClose} variant="secondary">
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
                <input type="hidden" name="timezone" value={(0, date_1.getLocalTimeZone)()}/>
                <react_1.Button type="submit" isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"} variant="destructive">
                  <macro_1.Trans>End Operations</macro_1.Trans>
                </react_1.Button>
              </react_1.ModalFooter>
            </fetcher.Form>
          </react_1.ModalContent>
        </react_1.Modal>)}
    </>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
