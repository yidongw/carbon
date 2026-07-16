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
exports.handle = void 0;
exports.loader = loader;
exports.default = CustomerRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var sales_1 = require("~/modules/sales");
var Customer_1 = require("~/modules/sales/ui/Customer");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Customers"], ["Customers"]))),
    to: path_1.path.to.customers
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, customerId, _d, customer, contacts, locations, tags, customerTax, _e, _f;
        var _g, _h, _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "sales"
                    })];
                case 1:
                    _c = _k.sent(), client = _c.client, companyId = _c.companyId;
                    customerId = params.customerId;
                    if (!customerId)
                        throw new Error("Could not find customerId");
                    return [4 /*yield*/, Promise.all([
                            (0, sales_1.getCustomer)(client, customerId),
                            (0, sales_1.getCustomerContacts)(client, customerId),
                            (0, sales_1.getCustomerLocations)(client, customerId),
                            (0, shared_1.getTagsList)(client, companyId, "customer"),
                            (0, sales_1.getCustomerTax)(client, customerId)
                        ])];
                case 2:
                    _d = _k.sent(), customer = _d[0], contacts = _d[1], locations = _d[2], tags = _d[3], customerTax = _d[4];
                    if (!customer.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.customers];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(customer.error, "Failed to load customer summary"))];
                case 3: throw _e.apply(void 0, _f.concat([_k.sent()]));
                case 4: return [2 /*return*/, {
                        customer: customer.data,
                        contacts: (_g = contacts.data) !== null && _g !== void 0 ? _g : [],
                        locations: (_h = locations.data) !== null && _h !== void 0 ? _h : [],
                        tags: (_j = tags.data) !== null && _j !== void 0 ? _j : [],
                        customerTax: customerTax.data
                    }];
            }
        });
    });
}
function CustomerRoute() {
    var permissions = (0, hooks_1.usePermissions)();
    var isEmployee = permissions.is("employee");
    return (<>
      <Customer_1.CustomerHeader />
      <div className={(0, react_1.cn)("grid grid-cols-1 h-full w-full gap-4", {
            "md:grid-cols-[1fr_4fr]": isEmployee
        })}>
        {isEmployee && <Customer_1.CustomerSidebar />}
        <react_router_1.Outlet />
      </div>
    </>);
}
var templateObject_1;
