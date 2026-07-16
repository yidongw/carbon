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
exports.default = ResetPinRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
function generatePin() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, operatorId, user, _c, _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, { update: "users" })];
                case 1:
                    client = (_e.sent()).client;
                    operatorId = params.operatorId;
                    if (!operatorId)
                        throw new Error("Operator ID is required");
                    return [4 /*yield*/, client
                            .from("user")
                            .select("id, firstName, lastName")
                            .eq("id", operatorId)
                            .single()];
                case 2:
                    user = _e.sent();
                    if (!(user.error || !user.data)) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.operators];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(user.error, "Operator not found"))];
                case 3: throw _c.apply(void 0, _d.concat([_e.sent()]));
                case 4: return [2 /*return*/, { operator: user.data }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var companyId, operatorId, formData, newPin, serviceRole, update, _c, _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "users"
                        })];
                case 1:
                    companyId = (_e.sent()).companyId;
                    operatorId = params.operatorId;
                    if (!operatorId)
                        throw new Error("Operator ID is required");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _e.sent();
                    newPin = formData.get("pin");
                    if (!newPin || !/^\d{4}$/.test(newPin)) {
                        return [2 /*return*/, { success: false, message: "PIN must be 4 digits" }];
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("employee")
                            .update({ pin: newPin })
                            .eq("id", operatorId)
                            .eq("companyId", companyId)];
                case 3:
                    update = _e.sent();
                    if (update.error) {
                        return [2 /*return*/, { success: false, message: update.error.message }];
                    }
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.operators];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("PIN reset successfully"))];
                case 4: throw _c.apply(void 0, _d.concat([_e.sent()]));
            }
        });
    });
}
function ResetPinRoute() {
    var operator = (0, react_router_1.useLoaderData)().operator;
    var navigate = (0, react_router_1.useNavigate)();
    var formFetcher = (0, react_router_1.useFetcher)();
    var _a = (0, react_2.useState)(generatePin), pinValue = _a[0], setPinValue = _a[1];
    var t = (0, macro_1.useLingui)().t;
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open)
                navigate(-1);
        }}>
      <react_1.ModalOverlay />
      <react_1.ModalContent>
        <formFetcher.Form method="post" className="flex flex-col h-full">
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              <macro_1.Trans>
                Reset PIN for {operator.firstName} {operator.lastName}
              </macro_1.Trans>
            </react_1.ModalTitle>
          </react_1.ModalHeader>

          <react_1.ModalBody>
            <react_1.VStack spacing={4}>
              <p className="text-sm text-muted-foreground">
                <macro_1.Trans>
                  Generate a new 4-digit PIN. Share it with the operator so they
                  can pin in at MES terminals.
                </macro_1.Trans>
              </p>
              <div className="space-y-2 w-full">
                <react_1.Label>
                  <macro_1.Trans>New PIN</macro_1.Trans>
                </react_1.Label>
                <div className="flex items-center justify-center gap-3">
                  <input type="hidden" name="pin" value={pinValue}/>
                  <react_1.InputOTP maxLength={4} value={pinValue} onChange={function (value) { return setPinValue(value); }} autoFocus={false}>
                    <react_1.InputOTPGroup>
                      <react_1.InputOTPSlot index={0}/>
                      <react_1.InputOTPSlot index={1}/>
                      <react_1.InputOTPSlot index={2}/>
                      <react_1.InputOTPSlot index={3}/>
                    </react_1.InputOTPGroup>
                  </react_1.InputOTP>
                  <react_1.Copy text={pinValue} size="sm"/>
                  <react_1.IconButton type="button" variant="outline" size="sm" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Generate new PIN"], ["Generate new PIN"])))} icon={<lu_1.LuRefreshCw />} onClick={function () {
            var newPin = generatePin();
            setPinValue(newPin);
        }}/>
                </div>
              </div>
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.HStack>
              <react_1.Button type="submit" isLoading={formFetcher.state !== "idle"} isDisabled={formFetcher.state !== "idle" || pinValue.length < 4}>
                <macro_1.Trans>Reset PIN</macro_1.Trans>
              </react_1.Button>
            </react_1.HStack>
          </react_1.ModalFooter>
        </formFetcher.Form>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1;
