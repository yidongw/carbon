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
exports.default = ConvertOperatorRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var users_models_1 = require("~/modules/users/users.models");
var users_server_1 = require("~/modules/users/users.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, operatorId, user, _c, _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "users"
                    })];
                case 1:
                    client = (_e.sent()).client;
                    operatorId = params.operatorId;
                    if (!operatorId)
                        throw new Error("Operator ID is required");
                    return [4 /*yield*/, client
                            .from("user")
                            .select("id, firstName, lastName, email")
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
        var _c, client, companyId, userId, operatorId, validation, _d, _e, result, _f, _g, _h, _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "users"
                        })];
                case 1:
                    _c = _k.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    operatorId = params.operatorId;
                    if (!operatorId)
                        throw new Error("Operator ID is required");
                    _e = (_d = (0, form_1.validator)(users_models_1.convertOperatorValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 2: return [4 /*yield*/, _e.apply(_d, [_k.sent()])];
                case 3:
                    validation = _k.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, users_server_1.convertConsoleOperatorToUser)(client, {
                            userId: operatorId,
                            email: validation.data.email,
                            employeeType: validation.data.employeeType,
                            companyId: companyId,
                            createdBy: userId
                        })];
                case 4:
                    result = _k.sent();
                    if (!!result.success) return [3 /*break*/, 6];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.operators];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result, result.message))];
                case 5: throw _f.apply(void 0, _g.concat([_k.sent()]));
                case 6:
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.employeeAccounts];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Operator converted to full user. Invite email sent."))];
                case 7: throw _h.apply(void 0, _j.concat([_k.sent()]));
            }
        });
    });
}
function ConvertOperatorRoute() {
    var _a, _b, _c;
    var t = (0, macro_1.useLingui)().t;
    var operator = (0, react_router_1.useLoaderData)().operator;
    var navigate = (0, react_router_1.useNavigate)();
    var formFetcher = (0, react_router_1.useFetcher)();
    var employeeTypeFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        employeeTypeFetcher.load(path_1.path.to.api.employeeTypes);
    });
    var employeeTypeOptions = (_c = (_b = (_a = employeeTypeFetcher.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.filter(function (et) { return et.systemType !== "Console Operator"; }).map(function (et) { return ({
        value: et.id,
        label: et.name
    }); })) !== null && _c !== void 0 ? _c : [];
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open)
                navigate(-1);
        }}>
      <react_1.ModalOverlay />
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" validator={users_models_1.convertOperatorValidator} fetcher={formFetcher} className="flex flex-col h-full">
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              <macro_1.Trans>Convert to Full User</macro_1.Trans>
            </react_1.ModalTitle>
          </react_1.ModalHeader>

          <react_1.ModalBody>
            <react_1.VStack spacing={4}>
              <p className="text-sm text-muted-foreground">
                <macro_1.Trans>
                  Convert{" "}
                  <strong>
                    {operator.firstName} {operator.lastName}
                  </strong>{" "}
                  from a console operator to a full user. They will receive an
                  email invitation and be able to log in independently.
                </macro_1.Trans>
              </p>
              <Form_1.Input name="email" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Email Address"], ["Email Address"])))} placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["operator@company.com"], ["operator@company.com"])))}/>
              <Form_1.Select name="employeeType" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Employee Type"], ["Employee Type"])))} options={employeeTypeOptions} placeholder={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Select Employee Type"], ["Select Employee Type"])))}/>
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.HStack>
              <Form_1.Submit isLoading={formFetcher.state !== "idle"}>
                <macro_1.Trans>Convert & Send Invite</macro_1.Trans>
              </Form_1.Submit>
            </react_1.HStack>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
