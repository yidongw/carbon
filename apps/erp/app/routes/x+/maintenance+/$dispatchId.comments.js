"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.action = action;
exports.default = MaintenanceDispatchCommentsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var resources_1 = require("~/modules/resources");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, dispatchId, viewClient, dispatch, formData, validation, upsertComment, _d, _e, _f, _g;
        var _h;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "resources"
                        })];
                case 1:
                    _c = _j.sent(), client = _c.client, userId = _c.userId;
                    dispatchId = params.dispatchId;
                    if (!dispatchId)
                        throw new Error("dispatchId not found");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "resources"
                        })];
                case 2:
                    viewClient = (_j.sent()).client;
                    return [4 /*yield*/, (0, resources_1.getMaintenanceDispatch)(viewClient, dispatchId)];
                case 3:
                    dispatch = _j.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, resources_1.isMaintenanceDispatchLocked)((_h = dispatch.data) === null || _h === void 0 ? void 0 : _h.status),
                            redirectTo: path_1.path.to.maintenanceDispatch(dispatchId),
                            message: "Cannot modify a locked dispatch. Reopen it first."
                        })];
                case 4:
                    _j.sent();
                    return [4 /*yield*/, request.formData()];
                case 5:
                    formData = _j.sent();
                    return [4 /*yield*/, (0, form_1.validator)(resources_1.maintenanceDispatchCommentValidator).validate(formData)];
                case 6:
                    validation = _j.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, resources_1.upsertMaintenanceDispatchComment)(client, __assign(__assign({}, validation.data), { maintenanceDispatchId: dispatchId, createdBy: validation.data.id ? undefined : userId, 
                            // @ts-expect-error - stfu typescript
                            updatedBy: validation.data.id ? userId : undefined }))];
                case 7:
                    upsertComment = _j.sent();
                    if (!upsertComment.error) return [3 /*break*/, 9];
                    _d = react_router_1.data;
                    _e = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(upsertComment.error, "Failed to save comment"))];
                case 8: return [2 /*return*/, _d.apply(void 0, _e.concat([_j.sent()]))];
                case 9:
                    _f = react_router_1.data;
                    _g = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Comment saved"))];
                case 10: return [2 /*return*/, _f.apply(void 0, _g.concat([_j.sent()]))];
            }
        });
    });
}
function MaintenanceDispatchCommentsRoute() {
    var _a;
    var t = (0, macro_1.useLingui)().t;
    var locale = (0, i18n_1.useLocale)().locale;
    var dispatchId = (0, react_router_1.useParams)().dispatchId;
    if (!dispatchId)
        throw new Error("dispatchId not found");
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var _b = (0, react_2.useState)(""), comment = _b[0], setComment = _b[1];
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.maintenanceDispatch(dispatchId));
    var comments = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.comments) !== null && _a !== void 0 ? _a : [];
    var handleSubmit = function () {
        if (!comment.trim())
            return;
        var formData = new FormData();
        formData.append("comment", comment);
        fetcher.submit(formData, { method: "post" });
        setComment("");
    };
    return (<react_1.VStack spacing={4}>
      <react_1.HStack className="justify-between w-full">
        <h2 className="text-lg font-semibold">
          <macro_1.Trans>Comments</macro_1.Trans>
        </h2>
      </react_1.HStack>

      {permissions.can("update", "resources") && (<react_1.Card>
          <react_1.CardContent className="py-4">
            <react_1.VStack spacing={2}>
              <react_1.Textarea placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Add a comment..."], ["Add a comment..."])))} value={comment} onChange={function (e) { return setComment(e.target.value); }} rows={3}/>
              <react_1.HStack className="justify-end w-full">
                <react_1.Button variant="primary" leftIcon={<lu_1.LuSend />} onClick={handleSubmit} isDisabled={!comment.trim()} isLoading={fetcher.state !== "idle"}>
                  <macro_1.Trans>Post Comment</macro_1.Trans>
                </react_1.Button>
              </react_1.HStack>
            </react_1.VStack>
          </react_1.CardContent>
        </react_1.Card>)}

      {comments.length === 0 ? (<react_1.Card>
          <react_1.CardContent className="py-8 text-center text-muted-foreground">
            <macro_1.Trans>No comments yet. Be the first to add a comment.</macro_1.Trans>
          </react_1.CardContent>
        </react_1.Card>) : (<div className="space-y-2">
          {comments.map(function (c) { return (<react_1.Card key={c.id}>
              <react_1.CardContent className="py-4">
                <react_1.VStack spacing={2}>
                  <react_1.HStack className="justify-between w-full">
                    <react_1.HStack>
                      <components_1.EmployeeAvatar employeeId={c.createdBy.id} size="xs"/>
                    </react_1.HStack>
                    <span className="text-xs text-muted-foreground">
                      {new Date(c.createdAt).toLocaleString(locale)}
                    </span>
                  </react_1.HStack>
                  <p className="text-sm">{c.comment}</p>
                </react_1.VStack>
              </react_1.CardContent>
            </react_1.Card>); })}
        </div>)}
    </react_1.VStack>);
}
var templateObject_1;
