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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var notifications_1 = require("@carbon/notifications");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var ri_1 = require("react-icons/ri");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
function EmptyState(_a) {
    var description = _a.description;
    return (<div className="h-[460px] flex items-center justify-center flex-col gap-y-4">
      <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
        <lu_1.LuInbox size={18}/>
      </div>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>);
}
function TrainingItem(_a) {
    var training = _a.training, onClose = _a.onClose;
    return (<react_router_1.Link className="flex items-center gap-x-4 px-3 py-3 hover:bg-secondary" onClick={function () { return onClose(); }} to={path_1.path.to.completeTrainingAssignment(training.trainingAssignmentId)}>
      <div>
        <div className="h-9 w-9 flex items-center justify-center border rounded-full">
          <lu_1.LuGraduationCap size={16}/>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex w-full justify-between items-center gap-2">
          <div className="flex flex-col gap-y-1">
            <p className="text-sm truncate">{training.trainingName}</p>
            <div className="flex items-center gap-x-2">
              <span className="text-xs text-muted-foreground capitalize">
                {training.frequency}
              </span>
            </div>
          </div>
          <react_1.Badge variant={training.status === "Overdue" ? "destructive" : "secondary"} className="text-xs">
            {training.status}
          </react_1.Badge>
        </div>
      </div>
    </react_router_1.Link>);
}
function Notification(_a) {
    var _b, _c;
    var icon = _a.icon, to = _a.to, description = _a.description, createdAt = _a.createdAt, markMessageAsRead = _a.markMessageAsRead, from = _a.from, onClose = _a.onClose;
    var userId = (0, hooks_1.useUser)().id;
    var t = (0, macro_1.useLingui)().t;
    var formatTimeAgo = (0, hooks_1.useDateFormatter)().formatTimeAgo;
    var people = (0, stores_1.usePeople)()[0];
    var byUser = "";
    if (from) {
        if (from === userId) {
            byUser = t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["yourself"], ["yourself"])));
        }
        else {
            byUser = (_c = (_b = people.find(function (p) { return p.id === from; })) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : "";
        }
    }
    return (<div className="flex items-between justify-between gap-x-4 px-3 py-3 hover:bg-secondary">
      <react_router_1.Link className="flex items-between justify-between gap-x-4 " onClick={function () { return onClose(); }} to={to}>
        <div>
          <div className="h-9 w-9 flex items-center justify-center gap-y-0 border rounded-full">
            {icon}
          </div>
        </div>
        <div>
          <p className="text-sm">
            {description} {byUser && <span>{t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["by ", ""], ["by ", ""])), byUser)}</span>}
          </p>
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(createdAt)}
          </span>
        </div>
      </react_router_1.Link>
      {markMessageAsRead && (<div>
          <react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Mark as read"], ["Mark as read"])))} icon={<lu_1.LuMailCheck />} variant="secondary" className="rounded-full before:rounded-full" onClick={markMessageAsRead}/>
        </div>)}
    </div>);
}
function GenericNotification(_a) {
    var id = _a.id, event = _a.event, documentType = _a.documentType, props = __rest(_a, ["id", "event", "documentType"]);
    switch (event) {
        case notifications_1.NotificationEvent.ApprovalApproved:
        case notifications_1.NotificationEvent.ApprovalRejected:
        case notifications_1.NotificationEvent.ApprovalRequested:
            return (<Notification icon={<lu_1.LuClipboardCheck />} to={documentType === "qualityDocument"
                    ? path_1.path.to.qualityDocument(id)
                    : path_1.path.to.purchaseOrderDetails(id)} {...props}/>);
        case notifications_1.NotificationEvent.DigitalQuoteResponse:
            return (<Notification icon={<lu_1.LuDollarSign />} to={path_1.path.to.quoteDetails(id)} {...props}/>);
        case notifications_1.NotificationEvent.GaugeCalibrationExpired:
            return (<Notification icon={<lu_1.LuCircleGauge />} to={path_1.path.to.gauge(id)} {...props}/>);
        case notifications_1.NotificationEvent.JobCompleted:
        case notifications_1.NotificationEvent.JobAssignment:
            return (<Notification icon={<lu_1.LuHammer />} to={path_1.path.to.jobDetails(id)} {...props}/>);
        case notifications_1.NotificationEvent.JobOperationAssignment:
        case notifications_1.NotificationEvent.JobOperationMessage:
            var _b = id.split(":"), jobId = _b[0], operationId = _b[1], makeMethodId = _b[2], materialId = _b[3];
            var link = materialId
                ? path_1.path.to.jobMakeMethod(jobId, makeMethodId)
                : path_1.path.to.jobMethod(jobId, makeMethodId);
            return (<Notification icon={event === notifications_1.NotificationEvent.JobOperationMessage ? (<lu_1.LuMessageSquare />) : (<lu_1.LuCirclePlay />)} to={"".concat(link, "?selectedOperation=").concat(operationId)} {...props}/>);
        case notifications_1.NotificationEvent.MaintenanceDispatchCreated:
        case notifications_1.NotificationEvent.MaintenanceDispatchAssignment:
            return (<Notification icon={<lu_1.LuWrench />} to={path_1.path.to.maintenanceDispatch(id)} {...props}/>);
        case notifications_1.NotificationEvent.NonConformanceAssignment:
            return (<Notification icon={<lu_1.LuShieldX />} to={path_1.path.to.issue(id)} {...props}/>);
        case notifications_1.NotificationEvent.ProcedureAssignment:
            return (<Notification icon={<lu_1.LuListChecks />} to={path_1.path.to.procedure(id)} {...props}/>);
        case notifications_1.NotificationEvent.QuoteExpired:
            return (<Notification icon={<lu_1.LuCalendarX />} to={path_1.path.to.quoteDetails(id)} {...props}/>);
        case notifications_1.NotificationEvent.PurchaseInvoiceAssignment:
            return (<Notification icon={<lu_1.LuShoppingCart />} to={path_1.path.to.purchaseInvoiceDetails(id)} {...props}/>);
        case notifications_1.NotificationEvent.PurchaseOrderAssignment:
            return (<Notification icon={<lu_1.LuShoppingCart />} to={path_1.path.to.purchaseOrderDetails(id)} {...props}/>);
        case notifications_1.NotificationEvent.QuoteAssignment:
            return (<Notification icon={<ri_1.RiProgress4Line />} to={path_1.path.to.quoteDetails(id)} {...props}/>);
        case notifications_1.NotificationEvent.RiskAssignment:
            return (<Notification icon={<lu_1.LuShieldAlert />} to={path_1.path.to.risk(id)} {...props}/>);
        case notifications_1.NotificationEvent.SalesRfqReady:
        case notifications_1.NotificationEvent.SalesRfqAssignment:
            return (<Notification icon={<ri_1.RiProgress2Line />} to={path_1.path.to.salesRfq(id)} {...props}/>);
        case notifications_1.NotificationEvent.SalesOrderAssignment:
            return (<Notification icon={<ri_1.RiProgress8Line />} to={path_1.path.to.salesOrderDetails(id)} {...props}/>);
        case notifications_1.NotificationEvent.StockTransferAssignment:
            return (<Notification icon={<lu_1.LuListChecks />} to={path_1.path.to.salesOrderDetails(id)} {...props}/>);
        case notifications_1.NotificationEvent.PickingListAssignment:
            return (<Notification icon={<lu_1.LuListChecks />} to={path_1.path.to.pickingList(id)} {...props}/>);
        case notifications_1.NotificationEvent.SuggestionResponse:
            return (<Notification icon={<lu_1.LuLightbulb />} to={path_1.path.to.suggestion(id)} {...props}/>);
        case notifications_1.NotificationEvent.SupplierQuoteAssignment:
            return (<Notification icon={<lu_1.LuDollarSign />} to={path_1.path.to.supplierQuoteDetails(id)} {...props}/>);
        case notifications_1.NotificationEvent.SupplierQuoteResponse:
            return (<Notification icon={<lu_1.LuMailCheck />} to={path_1.path.to.supplierQuoteDetails(id)} {...props}/>);
        case notifications_1.NotificationEvent.TrainingAssignment:
            return (<Notification icon={<lu_1.LuListChecks />} to={path_1.path.to.completeTrainingAssignment(id)} {...props}/>);
        case notifications_1.NotificationEvent.Digest:
            // Digest rows are rendered by DigestNotification (expandable). This
            // branch is unreachable when GenericNotification is used from the
            // topbar maps — kept as a defensive fallback.
            return null;
        default:
            return null;
    }
}
function DigestNotification(_a) {
    var _this = this;
    var id = _a.id, description = _a.description, createdAt = _a.createdAt, markMessageAsRead = _a.markMessageAsRead, onClose = _a.onClose, fetchChildren = _a.fetchChildren;
    var t = (0, macro_1.useLingui)().t;
    var formatTimeAgo = (0, hooks_1.useDateFormatter)().formatTimeAgo;
    var _b = (0, react_2.useState)(false), expanded = _b[0], setExpanded = _b[1];
    var _c = (0, react_2.useState)(null), children = _c[0], setChildren = _c[1];
    var _d = (0, react_2.useState)(false), loadingChildren = _d[0], setLoadingChildren = _d[1];
    var toggle = function () { return __awaiter(_this, void 0, void 0, function () {
        var next, rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    next = !expanded;
                    setExpanded(next);
                    if (!(next && children === null)) return [3 /*break*/, 4];
                    setLoadingChildren(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, fetchChildren(id)];
                case 2:
                    rows = _a.sent();
                    setChildren(rows);
                    return [3 /*break*/, 4];
                case 3:
                    setLoadingChildren(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<div>
      <div className="flex items-between justify-between gap-x-4 px-3 py-3 hover:bg-secondary">
        <button type="button" onClick={toggle} className="flex items-center justify-start gap-x-4 flex-1 text-left">
          <div>
            <div className="h-9 w-9 flex items-center justify-center gap-y-0 border rounded-full">
              <lu_1.LuInbox />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm">{description}</p>
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(createdAt)}
            </span>
          </div>
          <div className="text-muted-foreground">
            {expanded ? <lu_1.LuChevronUp /> : <lu_1.LuChevronDown />}
          </div>
        </button>
        {markMessageAsRead && (<div>
            <react_1.IconButton aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Mark as read"], ["Mark as read"])))} icon={<lu_1.LuMailCheck />} variant="secondary" className="rounded-full before:rounded-full" onClick={markMessageAsRead}/>
          </div>)}
      </div>
      {expanded && (<div className="bg-muted/30">
          {loadingChildren && (<div className="flex items-center gap-x-2 px-3 py-2 text-xs text-muted-foreground">
              <lu_1.LuLoader className="animate-spin"/>
              <macro_1.Trans>Loading…</macro_1.Trans>
            </div>)}
          {!loadingChildren && children && children.length === 0 && (<div className="px-3 py-2 text-xs text-muted-foreground">
              <macro_1.Trans>No grouped notifications</macro_1.Trans>
            </div>)}
          {!loadingChildren && children && children.length > 0 && (<div className="divide-y">
              {children.map(function (child) { return (<GenericNotification key={child._id} id={child.payload.documentId} createdAt={child.createdAt} description={child.payload.description} event={child.payload.event} from={child.payload.from} documentType={child.payload.documentType} onClose={onClose}/>); })}
            </div>)}
        </div>)}
    </div>);
}
var Notifications = function () {
    var _a, _b;
    var t = (0, macro_1.useLingui)().t;
    var _c = (0, hooks_1.useUser)(), userId = _c.id, companyId = _c.company.id;
    var _d = (0, react_2.useState)(false), isOpen = _d[0], setOpen = _d[1];
    var _e = (0, react_2.useState)("inbox"), activeTab = _e[0], setActiveTab = _e[1];
    var _f = (0, react_2.useState)(false), trainingsLoaded = _f[0], setTrainingsLoaded = _f[1];
    var trainingsFetcher = (0, react_router_1.useFetcher)();
    var _g = (0, hooks_1.useNotifications)({
        companyId: companyId,
        userId: userId
    }), fetchDigestChildren = _g.fetchDigestChildren, hasUnseenNotifications = _g.hasUnseenNotifications, notifications = _g.notifications, markMessageAsRead = _g.markMessageAsRead, markAllMessagesAsSeen = _g.markAllMessagesAsSeen, markAllMessagesAsRead = _g.markAllMessagesAsRead;
    var unreadNotifications = notifications.filter(function (notification) { return !notification.read; });
    var archivedNotifications = notifications.filter(function (notification) { return notification.read; });
    // Lazy load trainings when the tab is selected
    (0, react_2.useEffect)(function () {
        if (activeTab === "trainings" && !trainingsLoaded && isOpen) {
            trainingsFetcher.load(path_1.path.to.api.outstandingTrainings);
            setTrainingsLoaded(true);
        }
    }, [activeTab, trainingsLoaded, isOpen, trainingsFetcher]);
    // Reset trainings loaded state when popover closes
    (0, react_2.useEffect)(function () {
        if (!isOpen) {
            setTrainingsLoaded(false);
        }
    }, [isOpen]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (isOpen && hasUnseenNotifications) {
            markAllMessagesAsSeen();
        }
    }, [hasUnseenNotifications, isOpen]);
    var outstandingTrainings = (_b = (_a = trainingsFetcher.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : [];
    var isLoadingTrainings = trainingsFetcher.state === "loading";
    return (<react_1.Popover onOpenChange={setOpen} open={isOpen}>
      <react_1.PopoverTrigger asChild>
        <react_1.Button variant="ghost" isIcon className="w-8 h-8 flex items-center relative">
          {hasUnseenNotifications && (<div className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0"/>)}
          <lu_1.LuBell size={16}/>
        </react_1.Button>
      </react_1.PopoverTrigger>
      <react_1.PopoverContent className="h-[535px] w-screen md:w-[400px] p-0 -top-px overflow-hidden relative" align="end" sideOffset={10}>
        <react_1.Tabs defaultValue="inbox" value={activeTab} onValueChange={setActiveTab}>
          <react_1.TabsList className="w-full border-b py-6 rounded-none bg-muted/50">
            <react_1.TabsTrigger value="inbox" className="font-normal">
              <macro_1.Trans>Inbox</macro_1.Trans>
            </react_1.TabsTrigger>
            <react_1.TabsTrigger value="trainings" className="font-normal">
              <macro_1.Trans>Trainings</macro_1.Trans>
            </react_1.TabsTrigger>
            <react_1.TabsTrigger value="archive" className="font-normal">
              <macro_1.Trans>Archive</macro_1.Trans>
            </react_1.TabsTrigger>
          </react_1.TabsList>

          {/* <Link
          to={path.to.notificationSettings}
          className="absolute right-[11px] top-1.5"
        >
          <IconButton
            aria-label={t`Settings`}
            icon={<LuSettings />}
            variant="ghost"
            isIcon
            className="rounded-full"
            onClick={() => setOpen(false)}
          />
        </Link> */}

          <react_1.TabsContent value="inbox" className="relative mt-0">
            {!unreadNotifications.length && (<EmptyState description={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["No new notifications"], ["No new notifications"])))}/>)}

            {unreadNotifications.length > 0 && (<react_1.ScrollArea className="pb-12 h-[485px]">
                <div className="divide-y">
                  {unreadNotifications.map(function (notification) {
                var event = notification.payload
                    .event;
                if (event === notifications_1.NotificationEvent.Digest) {
                    return (<DigestNotification key={notification._id} id={notification._id} createdAt={notification.createdAt} description={notification.payload.description} markMessageAsRead={function () {
                            return markMessageAsRead(notification._id);
                        }} onClose={function () { return setOpen(false); }} fetchChildren={fetchDigestChildren}/>);
                }
                return (<GenericNotification key={notification._id} id={notification.payload.documentId} createdAt={notification.createdAt} description={notification.payload.description} event={event} from={notification.payload.from} documentType={notification.payload.documentType} markMessageAsRead={function () {
                        return markMessageAsRead(notification._id);
                    }} onClose={function () { return setOpen(false); }}/>);
            })}
                </div>
              </react_1.ScrollArea>)}

            {unreadNotifications.length > 0 && (<div className="h-12 w-full absolute bottom-0 flex items-center justify-center border-t">
                <react_1.Button variant="secondary" className="bg-transparent" onClick={markAllMessagesAsRead}>
                  <macro_1.Trans>Archive all</macro_1.Trans>
                </react_1.Button>
              </div>)}
          </react_1.TabsContent>

          <react_1.TabsContent value="trainings" className="mt-0">
            {isLoadingTrainings && (<div className="h-[460px] flex items-center justify-center">
                <react_1.Spinner />
              </div>)}

            {!isLoadingTrainings && outstandingTrainings.length === 0 && (<EmptyState description={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["No outstanding trainings"], ["No outstanding trainings"])))}/>)}

            {!isLoadingTrainings && outstandingTrainings.length > 0 && (<react_1.ScrollArea className="h-[490px]">
                <div className="divide-y">
                  {outstandingTrainings.map(function (training) { return (<TrainingItem key={training.trainingAssignmentId} training={training} onClose={function () { return setOpen(false); }}/>); })}
                </div>
              </react_1.ScrollArea>)}
          </react_1.TabsContent>

          <react_1.TabsContent value="archive" className="mt-0">
            {!archivedNotifications.length && (<EmptyState description={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Nothing in the archive"], ["Nothing in the archive"])))}/>)}

            {archivedNotifications.length > 0 && (<react_1.ScrollArea className="h-[490px]">
                <div className="divide-y">
                  {archivedNotifications.map(function (notification) {
                var event = notification.payload
                    .event;
                if (event === notifications_1.NotificationEvent.Digest) {
                    return (<DigestNotification key={notification._id} id={notification._id} createdAt={notification.createdAt} description={notification.payload.description} onClose={function () { return setOpen(false); }} fetchChildren={fetchDigestChildren}/>);
                }
                return (<GenericNotification key={notification._id} id={notification.payload.documentId} createdAt={notification.createdAt} description={notification.payload.description} event={event} from={notification.payload.from} documentType={notification.payload.documentType} onClose={function () { return setOpen(false); }}/>);
            })}
                </div>
              </react_1.ScrollArea>)}
          </react_1.TabsContent>
        </react_1.Tabs>
      </react_1.PopoverContent>
    </react_1.Popover>);
};
exports.default = Notifications;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
