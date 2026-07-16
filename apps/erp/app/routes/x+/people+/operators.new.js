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
exports.default = NewOperatorRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var stripe_server_1 = require("@carbon/stripe/stripe.server");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var settings_1 = require("~/modules/settings");
var users_models_1 = require("~/modules/users/users.models");
var users_server_1 = require("~/modules/users/users.server");
function generatePin() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var request = _b.request;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, { create: "users" })];
                case 1:
                    _c.sent();
                    return [2 /*return*/, null];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, validation, _d, _e, _f, firstName, lastName, locationId, pin, serviceRole, operatorType, _g, _h, seat, _j, _k, result, _l, _m, pinUpdate, _o, _p;
        var _q;
        var request = _b.request;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "users"
                        })];
                case 1:
                    _c = _r.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    _e = (_d = (0, form_1.validator)(users_models_1.createOperatorValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 2: return [4 /*yield*/, _e.apply(_d, [_r.sent()])];
                case 3:
                    validation = _r.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _f = validation.data, firstName = _f.firstName, lastName = _f.lastName, locationId = _f.locationId, pin = _f.pin;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("employeeType")
                            .select("id")
                            .eq("companyId", companyId)
                            .eq("systemType", "Console Operator")
                            .single()];
                case 4:
                    operatorType = _r.sent();
                    if (!(operatorType.error || !operatorType.data)) return [3 /*break*/, 6];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.operators];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Console Operator employee type not found. Run the migration."))];
                case 5: throw _g.apply(void 0, _h.concat([_r.sent()]));
                case 6: return [4 /*yield*/, (0, settings_1.checkSeatAvailability)(client, companyId, 1)];
                case 7:
                    seat = _r.sent();
                    if (!!seat.ok) return [3 /*break*/, 9];
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.operators];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, seat.message))];
                case 8: throw _j.apply(void 0, _k.concat([_r.sent()]));
                case 9: return [4 /*yield*/, (0, users_server_1.createConsoleOperator)(client, {
                        firstName: firstName,
                        lastName: lastName,
                        employeeType: operatorType.data.id,
                        locationId: locationId,
                        companyId: companyId,
                        createdBy: userId
                    })];
                case 10:
                    result = _r.sent();
                    if (!!result.success) return [3 /*break*/, 12];
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.operators];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result, (_q = result.message) !== null && _q !== void 0 ? _q : "Failed to create console operator"))];
                case 11: throw _l.apply(void 0, _m.concat([_r.sent()]));
                case 12:
                    if (!pin) return [3 /*break*/, 14];
                    return [4 /*yield*/, serviceRole
                            .from("employee")
                            .update({ pin: pin })
                            .eq("id", result.userId)
                            .eq("companyId", companyId)];
                case 13:
                    pinUpdate = _r.sent();
                    if (pinUpdate.error) {
                        console.error("Failed to set PIN for operator:", pinUpdate.error);
                    }
                    _r.label = 14;
                case 14: return [4 /*yield*/, (0, stripe_server_1.updateSubscriptionQuantityForCompany)(companyId)];
                case 15:
                    _r.sent();
                    _o = react_router_1.redirect;
                    _p = [path_1.path.to.operators];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Console operator created successfully"))];
                case 16: throw _o.apply(void 0, _p.concat([_r.sent()]));
            }
        });
    });
}
function NewOperatorRoute() {
    var _a;
    var t = (0, macro_1.useLingui)().t;
    var defaults = (0, hooks_1.useUser)().defaults;
    var navigate = (0, react_router_1.useNavigate)();
    var formFetcher = (0, react_router_1.useFetcher)();
    var _b = (0, react_2.useState)(generatePin), pinValue = _b[0], setPinValue = _b[1];
    var _c = (0, react_2.useState)(false), copied = _c[0], setCopied = _c[1];
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open)
                navigate(-1);
        }}>
      <react_1.ModalOverlay />
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" action={path_1.path.to.newOperator} validator={users_models_1.createOperatorValidator} defaultValues={{
            locationId: (_a = defaults === null || defaults === void 0 ? void 0 : defaults.locationId) !== null && _a !== void 0 ? _a : undefined,
            pin: pinValue
        }} fetcher={formFetcher} className="flex flex-col h-full">
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              <macro_1.Trans>Add Console Operator</macro_1.Trans>
            </react_1.ModalTitle>
          </react_1.ModalHeader>

          <react_1.ModalBody>
            <react_1.VStack spacing={4}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <Form_1.Input name="firstName" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["First Name"], ["First Name"])))}/>
                <Form_1.Input name="lastName" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Last Name"], ["Last Name"])))}/>
              </div>
              <Form_1.Location name="locationId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Location"], ["Location"])))}/>
              <div className="space-y-2 w-full">
                <react_1.Label htmlFor="pin">
                  <macro_1.Trans>PIN</macro_1.Trans>
                </react_1.Label>
                <react_1.HStack>
                  <Form_1.Input name="pin" value={pinValue} onChange={function (e) {
            var val = e.target.value.replace(/\D/g, "").slice(0, 4);
            setPinValue(val);
        }} maxLength={4} inputMode="numeric" className="font-mono text-lg tracking-[0.3em] text-center"/>
                  <react_1.IconButton type="button" variant="outline" size="sm" aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Copy PIN"], ["Copy PIN"])))} icon={copied ? (<lu_1.LuCheck className="text-emerald-500"/>) : (<lu_1.LuCopy />)} onClick={function () {
            navigator.clipboard.writeText(pinValue);
            setCopied(true);
            setTimeout(function () { return setCopied(false); }, 2000);
        }}/>
                  <react_1.IconButton type="button" variant="outline" size="sm" aria-label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Generate new PIN"], ["Generate new PIN"])))} icon={<lu_1.LuRefreshCw />} onClick={function () {
            var newPin = generatePin();
            setPinValue(newPin);
            setCopied(false);
        }}/>
                </react_1.HStack>
                <p className="text-xs text-muted-foreground">
                  <macro_1.Trans>
                    Share this PIN with the operator so they can pin in at MES
                    terminals.
                  </macro_1.Trans>
                </p>
              </div>
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.HStack>
              <Form_1.Submit isLoading={formFetcher.state !== "idle"}>
                <macro_1.Trans>Create Operator</macro_1.Trans>
              </Form_1.Submit>
            </react_1.HStack>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
