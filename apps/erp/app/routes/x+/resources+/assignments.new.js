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
exports.action = action;
exports.default = NewTrainingAssignmentRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var jobs_1 = require("@carbon/jobs");
var notifications_1 = require("@carbon/notifications");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var resources_1 = require("~/modules/resources");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["New Assignment"], ["New Assignment"]))),
    to: path_1.path.to.newTrainingAssignment
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, trainings, _d, _e;
        var _f;
        var request = _b.request;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        create: "resources",
                        role: "employee"
                    })];
                case 1:
                    _c = _g.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, (0, resources_1.getTrainingsList)(client, companyId)];
                case 2:
                    trainings = _g.sent();
                    if (!trainings.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.trainingAssignments];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(trainings.error, "Error loading trainings"))];
                case 3: throw _d.apply(void 0, _e.concat([_g.sent()]));
                case 4: return [2 /*return*/, {
                        trainings: ((_f = trainings.data) !== null && _f !== void 0 ? _f : [])
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, formData, validation, _d, trainingId, groupIds, result, _e, _f, err_1, _g, _h;
        var _j;
        var _k;
        var request = _b.request;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        create: "resources",
                        role: "employee"
                    })];
                case 1:
                    _c = _l.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _l.sent();
                    return [4 /*yield*/, (0, form_1.validator)(resources_1.trainingAssignmentValidator).validate(formData)];
                case 3:
                    validation = _l.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, trainingId = _d.trainingId, groupIds = _d.groupIds;
                    return [4 /*yield*/, (0, resources_1.upsertTrainingAssignment)(client, {
                            trainingId: trainingId,
                            groupIds: groupIds,
                            companyId: companyId,
                            createdBy: userId
                        })];
                case 4:
                    result = _l.sent();
                    if (!result.error) return [3 /*break*/, 6];
                    _e = react_router_1.data;
                    _f = [{ error: result.error.message }];
                    _j = {
                        status: 500
                    };
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to create assignment"))];
                case 5: return [2 /*return*/, _e.apply(void 0, _f.concat([(
                        // @ts-expect-error TS2322 - TODO: fix type
                        _j.headers = _l.sent(),
                            _j)]))];
                case 6:
                    if (!((_k = result.data) === null || _k === void 0 ? void 0 : _k.id)) return [3 /*break*/, 10];
                    _l.label = 7;
                case 7:
                    _l.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, (0, jobs_1.trigger)("notify", {
                            companyId: companyId,
                            documentId: result.data.id,
                            event: notifications_1.NotificationEvent.TrainingAssignment,
                            recipient: {
                                type: "group",
                                groupIds: groupIds
                            },
                            from: userId
                        })];
                case 8:
                    _l.sent();
                    return [3 /*break*/, 10];
                case 9:
                    err_1 = _l.sent();
                    console.error("Failed to send training assignment notifications", err_1);
                    return [3 /*break*/, 10];
                case 10:
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.trainingAssignments];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Assignment created successfully"))];
                case 11: throw _g.apply(void 0, _h.concat([_l.sent()]));
            }
        });
    });
}
function NewTrainingAssignmentRoute() {
    var trainings = (0, react_router_1.useLoaderData)().trainings;
    var navigate = (0, react_router_1.useNavigate)();
    var initialValues = {
        id: undefined,
        trainingId: "",
        groupIds: []
    };
    return (<resources_1.TrainingAssignmentForm initialValues={initialValues} trainings={trainings} onClose={function () { return navigate(path_1.path.to.trainingAssignments); }}/>);
}
var templateObject_1;
