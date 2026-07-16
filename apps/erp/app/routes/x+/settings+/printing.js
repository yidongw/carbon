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
exports.handle = void 0;
exports.loader = loader;
exports.action = action;
exports.default = PrintingSettingsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var printing_1 = require("@carbon/printing");
var printing_server_1 = require("@carbon/printing/printing.server");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var resources_1 = require("~/modules/resources");
var settings_1 = require("~/modules/settings");
var Printing_1 = require("~/modules/settings/ui/Printing");
var users_server_1 = require("~/modules/users/users.server");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: "Printing",
    to: path_1.path.to.printingSettings
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, _d, companySettings, printerRoutes, workCenters, locations, userDefaults, _e, _f;
        var _g, _h, _j, _k, _l, _m;
        var request = _b.request;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "settings"
                    })];
                case 1:
                    _c = _o.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.getCompanySettings)(client, companyId),
                            (0, printing_1.getPrinterRoutes)(client, companyId),
                            (0, resources_1.getWorkCentersList)(client, companyId),
                            (0, resources_1.getLocationsList)(client, companyId),
                            (0, users_server_1.getUserDefaults)(client, userId, companyId)
                        ])];
                case 2:
                    _d = _o.sent(), companySettings = _d[0], printerRoutes = _d[1], workCenters = _d[2], locations = _d[3], userDefaults = _d[4];
                    if (!!companySettings.data) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.settings];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(companySettings.error, "Failed to get company settings"))];
                case 3: throw _e.apply(void 0, _f.concat([_o.sent()]));
                case 4: return [2 /*return*/, {
                        printing: (_g = companySettings.data.printing) !== null && _g !== void 0 ? _g : null,
                        printerRoutes: (_h = printerRoutes.data) !== null && _h !== void 0 ? _h : [],
                        workCenters: (_j = workCenters.data) !== null && _j !== void 0 ? _j : [],
                        locations: (_k = locations.data) !== null && _k !== void 0 ? _k : [],
                        defaultLocationId: (_m = (_l = userDefaults.data) === null || _l === void 0 ? void 0 : _l.locationId) !== null && _m !== void 0 ? _m : null
                    }];
            }
        });
    });
}
function generateTestLabel(format, mediaSizeId) {
    if (format !== "zpl" || !mediaSizeId)
        return null;
    var labelSize = utils_1.labelSizes.find(function (s) { return s.id === mediaSizeId; });
    if (!(labelSize === null || labelSize === void 0 ? void 0 : labelSize.zpl))
        return null;
    var _a = labelSize.zpl, width = _a.width, height = _a.height;
    var dpi = labelSize.zpl.dpi || 203;
    var widthDots = Math.round(width * dpi);
    var heightDots = Math.round(height * dpi);
    var now = new Date();
    var timestamp = "".concat(now.toLocaleDateString(), " ").concat(now.toLocaleTimeString());
    return [
        "^XA",
        "^PW".concat(widthDots),
        "^LL".concat(heightDots),
        "^MNW",
        "^FO20,20^A0N,30,30^FDTest Print^FS",
        "^FO20,60^A0N,20,20^FD".concat(mediaSizeId, " \u2014 ").concat(width, "x").concat(height, "\"^FS"),
        "^FO20,90^A0N,16,16^FD".concat(timestamp, "^FS"),
        "^XZ"
    ].join("\n");
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, formData, intent, _d, validation, result, routeId, route, headers, testLabel, response, err_1, validation, _e, locationId, context, contextId, printerRouteId, autoPrint, existing, current, updated, result;
        var _f;
        var request = _b.request;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "settings"
                    })];
                case 1:
                    _c = _g.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _g.sent();
                    intent = formData.get("intent");
                    _d = intent;
                    switch (_d) {
                        case "upsertRoute": return [3 /*break*/, 3];
                        case "testPrint": return [3 /*break*/, 7];
                        case "updateAssignment": return [3 /*break*/, 12];
                    }
                    return [3 /*break*/, 17];
                case 3: return [4 /*yield*/, (0, form_1.validator)(settings_1.printerRouteValidator).validate(formData)];
                case 4:
                    validation = _g.sent();
                    if (validation.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    return [4 /*yield*/, (0, printing_1.upsertPrinterRoute)(client, {
                            id: validation.data.id || undefined,
                            companyId: companyId,
                            name: validation.data.name,
                            format: validation.data.format,
                            mediaSizeId: validation.data.mediaSizeId || null,
                            printerUrl: validation.data.printerUrl,
                            apiKey: validation.data.apiKey || null,
                            locationId: validation.data.locationId || null,
                            templateId: validation.data.templateId || null
                        })];
                case 5:
                    result = _g.sent();
                    if (result.error)
                        return [2 /*return*/, { success: false, message: result.error.message }];
                    return [4 /*yield*/, (0, printing_server_1.invalidatePrinterCache)(companyId)];
                case 6:
                    _g.sent();
                    return [2 /*return*/, {
                            success: true,
                            message: validation.data.id
                                ? "Printer route updated"
                                : "Printer route created"
                        }];
                case 7:
                    routeId = formData.get("routeId");
                    if (!routeId)
                        return [2 /*return*/, { success: false, message: "Route ID required" }];
                    return [4 /*yield*/, client
                            .from("printerRoute")
                            .select("printerUrl, format, mediaSizeId, apiKey")
                            .eq("id", routeId)
                            .eq("companyId", companyId)
                            .single()];
                case 8:
                    route = (_g.sent()).data;
                    if (!route)
                        return [2 /*return*/, { success: false, message: "Printer route not found" }];
                    _g.label = 9;
                case 9:
                    _g.trys.push([9, 11, , 12]);
                    headers = {
                        "Content-Type": "application/octet-stream"
                    };
                    if (route.apiKey)
                        headers["X-API-Key"] = route.apiKey;
                    testLabel = generateTestLabel(route.format, route.mediaSizeId);
                    if (!testLabel) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Test print is only supported for ZPL label printers with a media size configured."
                            }];
                    }
                    return [4 /*yield*/, fetch(route.printerUrl, {
                            method: "POST",
                            headers: headers,
                            body: testLabel,
                            signal: AbortSignal.timeout(10000)
                        })];
                case 10:
                    response = _g.sent();
                    if (!response.ok) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Print failed (".concat(response.status, " ").concat(response.statusText, ")")
                            }];
                    }
                    return [2 /*return*/, { success: true, message: "Test label sent to printer" }];
                case 11:
                    err_1 = _g.sent();
                    return [2 /*return*/, {
                            success: false,
                            message: "Print failed: ".concat(err_1 instanceof Error ? err_1.message : "Unknown error")
                        }];
                case 12: return [4 /*yield*/, (0, form_1.validator)(printing_1.updateAssignmentValidator).validate(formData)];
                case 13:
                    validation = _g.sent();
                    if (validation.error) {
                        return [2 /*return*/, { success: false, message: "Invalid form data" }];
                    }
                    _e = validation.data, locationId = _e.locationId, context = _e.context, contextId = _e.contextId, printerRouteId = _e.printerRouteId, autoPrint = _e.autoPrint;
                    return [4 /*yield*/, (0, printing_1.getPrintingSettings)(client, companyId)];
                case 14:
                    existing = (_g.sent()).data;
                    current = (_f = existing === null || existing === void 0 ? void 0 : existing.printing) !== null && _f !== void 0 ? _f : {
                        assignments: {}
                    };
                    updated = (0, printing_1.setContextAssignment)(current, locationId, context, { printerRouteId: printerRouteId || null, autoPrint: autoPrint }, contextId);
                    return [4 /*yield*/, (0, printing_1.updatePrintingSettings)(client, companyId, updated)];
                case 15:
                    result = _g.sent();
                    if (result.error)
                        return [2 /*return*/, { success: false, message: result.error.message }];
                    return [4 /*yield*/, (0, printing_server_1.invalidatePrinterCache)(companyId)];
                case 16:
                    _g.sent();
                    return [2 /*return*/, { success: true, message: "Assignment updated" }];
                case 17: return [2 /*return*/, { success: false, message: "Unknown intent" }];
            }
        });
    });
}
function PrintingSettingsRoute() {
    var _a = (0, react_router_1.useLoaderData)(), printing = _a.printing, printerRoutes = _a.printerRoutes, workCenters = _a.workCenters, locations = _a.locations;
    return (<react_1.ScrollArea className="w-full h-[calc(100dvh-49px)]">
      <react_1.VStack spacing={4} className="py-12 px-4 max-w-[60rem] h-full mx-auto gap-4">
        <div className="flex items-center justify-between w-full">
          <react_1.Heading size="h3">
            <macro_1.Trans>Printing</macro_1.Trans>
          </react_1.Heading>
          <react_1.Button variant="secondary" leftIcon={<lu_1.LuPrinter />} asChild>
            <react_router_1.Link to={path_1.path.to.printingSettingsJobs}>
              <macro_1.Trans>View Prints</macro_1.Trans>
            </react_router_1.Link>
          </react_1.Button>
        </div>

        <Printing_1.PrintersCard printerRoutes={printerRoutes}/>

        <Printing_1.AssignmentsCard printing={printing} printerRoutes={printerRoutes} locations={locations} workCenters={workCenters}/>
      </react_1.VStack>
      <react_router_1.Outlet />
    </react_1.ScrollArea>);
}
