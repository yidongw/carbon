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
exports.default = EditTrainingAssignmentRoute;
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
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Edit Assignment"], ["Edit Assignment"]))),
    to: path_1.path.to.trainingAssignments
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, assignmentId, _d, _e, _f, assignment, trainings, assignmentStatus, _g, _h, _j, _k, filteredStatus, currentPeriod;
        var _l, _m;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "resources",
                        role: "employee"
                    })];
                case 1:
                    _c = _o.sent(), client = _c.client, companyId = _c.companyId;
                    assignmentId = params.assignmentId;
                    if (!!assignmentId) return [3 /*break*/, 3];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.trainingAssignments];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(null, "Assignment ID is required"))];
                case 2: throw _d.apply(void 0, _e.concat([_o.sent()]));
                case 3: return [4 /*yield*/, Promise.all([
                        (0, resources_1.getTrainingAssignment)(client, assignmentId),
                        (0, resources_1.getTrainingsList)(client, companyId),
                        // @ts-expect-error TS2345 - TODO: fix type
                        (0, resources_1.getTrainingAssignmentStatus)(client, companyId, {
                        // We'll filter by trainingId which we'll get from the assignment
                        })
                    ])];
                case 4:
                    _f = _o.sent(), assignment = _f[0], trainings = _f[1], assignmentStatus = _f[2];
                    if (!assignment.error) return [3 /*break*/, 6];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.trainingAssignments];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(assignment.error, "Error loading assignment"))];
                case 5: throw _g.apply(void 0, _h.concat([_o.sent()]));
                case 6:
                    if (!trainings.error) return [3 /*break*/, 8];
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.trainingAssignments];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(trainings.error, "Error loading trainings"))];
                case 7: throw _j.apply(void 0, _k.concat([_o.sent()]));
                case 8:
                    filteredStatus = ((_l = assignmentStatus.data) !== null && _l !== void 0 ? _l : []).filter(function (s) { return s.trainingAssignmentId === assignmentId; });
                    currentPeriod = filteredStatus.length > 0 ? filteredStatus[0].currentPeriod : null;
                    return [2 /*return*/, {
                            assignment: assignment.data,
                            trainings: ((_m = trainings.data) !== null && _m !== void 0 ? _m : []),
                            assignmentStatus: filteredStatus,
                            currentPeriod: currentPeriod
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, assignmentId, formData, validation, _d, trainingId, groupIds, result, _e, _f, err_1, _g, _h;
        var _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "resources",
                        role: "employee"
                    })];
                case 1:
                    _c = _k.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    assignmentId = params.assignmentId;
                    if (!assignmentId) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Assignment ID is required" }, { status: 400 })];
                    }
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _k.sent();
                    return [4 /*yield*/, (0, form_1.validator)(resources_1.trainingAssignmentValidator).validate(formData)];
                case 3:
                    validation = _k.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, trainingId = _d.trainingId, groupIds = _d.groupIds;
                    return [4 /*yield*/, (0, resources_1.upsertTrainingAssignment)(client, {
                            id: assignmentId,
                            trainingId: trainingId,
                            groupIds: groupIds,
                            companyId: "", // not used for updates
                            updatedBy: userId
                        })];
                case 4:
                    result = _k.sent();
                    if (!result.error) return [3 /*break*/, 6];
                    _e = react_router_1.data;
                    _f = [{ error: result.error.message }];
                    _j = {
                        status: 500
                    };
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to update assignment"))];
                case 5: return [2 /*return*/, _e.apply(void 0, _f.concat([(
                        // @ts-expect-error TS2322 - TODO: fix type
                        _j.headers = _k.sent(),
                            _j)]))];
                case 6:
                    _k.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, (0, jobs_1.trigger)("notify", {
                            companyId: companyId,
                            documentId: assignmentId,
                            event: notifications_1.NotificationEvent.TrainingAssignment,
                            recipient: {
                                type: "group",
                                groupIds: groupIds
                            },
                            from: userId
                        })];
                case 7:
                    _k.sent();
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _k.sent();
                    console.error("Failed to send training assignment notifications", err_1);
                    return [3 /*break*/, 9];
                case 9:
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.trainingAssignments];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Assignment updated successfully"))];
                case 10: throw _g.apply(void 0, _h.concat([_k.sent()]));
            }
        });
    });
}
function EditTrainingAssignmentRoute() {
    var _a, _b;
    var _c = (0, react_router_1.useLoaderData)(), assignment = _c.assignment, trainings = _c.trainings, assignmentStatus = _c.assignmentStatus, currentPeriod = _c.currentPeriod;
    var navigate = (0, react_router_1.useNavigate)();
    var params = (0, react_router_1.useParams)();
    var initialValues = {
        id: params.assignmentId,
        trainingId: (_a = assignment === null || assignment === void 0 ? void 0 : assignment.trainingId) !== null && _a !== void 0 ? _a : "",
        groupIds: (_b = assignment === null || assignment === void 0 ? void 0 : assignment.groupIds) !== null && _b !== void 0 ? _b : []
    };
    return (<resources_1.TrainingAssignmentForm initialValues={initialValues} trainings={trainings} assignmentStatus={assignmentStatus} currentPeriod={currentPeriod} onClose={function () { return navigate(path_1.path.to.trainingAssignments); }}/>);
}
var templateObject_1;
