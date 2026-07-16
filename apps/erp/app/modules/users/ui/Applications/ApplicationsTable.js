"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var bs_1 = require("react-icons/bs");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
var ApplicationActionMenu = function (_a) {
    var row = _a.row, isReviewing = _a.isReviewing, reviewAction = _a.reviewAction, canUpdate = _a.canUpdate, onApprove = _a.onApprove, onReject = _a.onReject;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)(false), open = _b[0], setOpen = _b[1];
    var _c = (0, react_2.useState)(null), pendingAction = _c[0], setPendingAction = _c[1];
    var wasReviewing = (0, react_2.useRef)(false);
    var showApproveLoading = pendingAction === "approve" || (isReviewing && reviewAction === "approve");
    var showRejectLoading = pendingAction === "reject" || (isReviewing && reviewAction === "reject");
    var showReviewLoading = showApproveLoading || showRejectLoading;
    (0, react_2.useEffect)(function () {
        if (isReviewing) {
            wasReviewing.current = true;
            setOpen(true);
            return;
        }
        if (wasReviewing.current) {
            wasReviewing.current = false;
            setPendingAction(null);
            setOpen(false);
        }
    }, [isReviewing]);
    if (row.status !== "pending")
        return null;
    return (<react_1.Menu type="dropdown">
      <react_1.DropdownMenu modal={false} open={open} onOpenChange={function (next) {
            if (showReviewLoading && !next)
                return;
            setOpen(next);
        }}>
        <react_1.DropdownMenuTrigger asChild>
          <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Action Menu"], ["Action Menu"])))} variant="secondary" icon={<bs_1.BsThreeDotsVertical />} onPointerDown={function (event) { return event.stopPropagation(); }} onClick={function (event) { return event.stopPropagation(); }}/>
        </react_1.DropdownMenuTrigger>
        <react_1.DropdownMenuContent align="end" className="w-56">
          <react_1.MenuItem disabled={!canUpdate || showReviewLoading} onSelect={function (event) {
            event.preventDefault();
            if (!showReviewLoading && canUpdate) {
                setPendingAction("approve");
                setOpen(true);
                onApprove();
            }
        }}>
            <react_1.MenuIcon icon={showApproveLoading ? (<react_1.Spinner className="h-4 w-4"/>) : (<lu_1.LuCheck />)}/>
            <macro_1.Trans>Approve</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={!canUpdate || showReviewLoading} onSelect={function (event) {
            event.preventDefault();
            if (!showReviewLoading && canUpdate) {
                setPendingAction("reject");
                setOpen(true);
                onReject();
            }
        }}>
            <react_1.MenuIcon icon={showRejectLoading ? <react_1.Spinner className="h-4 w-4"/> : <lu_1.LuX />}/>
            <macro_1.Trans>Reject</macro_1.Trans>
          </react_1.MenuItem>
        </react_1.DropdownMenuContent>
      </react_1.DropdownMenu>
    </react_1.Menu>);
};
var ApplicationsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var reviewFetcher = (0, react_router_1.useFetcher)();
    var revalidator = (0, react_router_1.useRevalidator)();
    var reviewSubmitted = (0, react_2.useRef)(false);
    var _b = (0, react_2.useState)(null), reviewingId = _b[0], setReviewingId = _b[1];
    var _c = (0, react_2.useState)(null), reviewAction = _c[0], setReviewAction = _c[1];
    var _d = (0, react_2.useState)(0), tableKey = _d[0], setTableKey = _d[1];
    var _e = (0, react_2.useState)(data), rows = _e[0], setRows = _e[1];
    var pendingFilterActive = (0, react_2.useMemo)(function () {
        return params.getAll("filter").some(function (filter) {
            var parsed = (0, query_1.parseFilterParam)(filter);
            return (parsed === null || parsed === void 0 ? void 0 : parsed.column) === "status" && parsed.value === "pending";
        });
    }, [params]);
    var visibleRows = (0, react_2.useMemo)(function () {
        if (!pendingFilterActive) {
            return rows;
        }
        return rows.filter(function (row) { return row.status === "pending"; });
    }, [pendingFilterActive, rows]);
    (0, react_2.useEffect)(function () {
        setRows(data);
    }, [data]);
    var getApplicationStatus = (0, react_2.useCallback)(function (status) {
        switch (status) {
            case "pending":
                return t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Pending"], ["Pending"])));
            case "approved":
                return t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Approved"], ["Approved"])));
            case "rejected":
                return t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Rejected"], ["Rejected"])));
            default:
                return status;
        }
    }, [t]);
    var getApplicantName = (0, react_2.useCallback)(function (row) {
        var _a, _b, _c, _d, _e, _f, _g;
        return ((_g = (_e = (_b = (_a = row.applicant) === null || _a === void 0 ? void 0 : _a.fullName) !== null && _b !== void 0 ? _b : [(_c = row.applicant) === null || _c === void 0 ? void 0 : _c.firstName, (_d = row.applicant) === null || _d === void 0 ? void 0 : _d.lastName]
            .filter(Boolean)
            .join(" ")) !== null && _e !== void 0 ? _e : (_f = row.applicant) === null || _f === void 0 ? void 0 : _f.email) !== null && _g !== void 0 ? _g : "—");
    }, []);
    var reviewApplication = (0, react_2.useCallback)(function (row, action) {
        reviewSubmitted.current = true;
        (0, react_dom_1.flushSync)(function () {
            setReviewingId(row.id);
            setReviewAction(action);
        });
        reviewFetcher.submit({ id: row.id, action: action }, {
            method: "post",
            action: path_1.path.to.reviewMembershipApplication
        });
    }, [reviewFetcher]);
    (0, react_2.useEffect)(function () {
        var _a;
        if (reviewFetcher.state !== "idle" || !reviewSubmitted.current) {
            return;
        }
        reviewSubmitted.current = false;
        setReviewingId(null);
        setReviewAction(null);
        setTableKey(function (current) { return current + 1; });
        if (((_a = reviewFetcher.data) === null || _a === void 0 ? void 0 : _a.ok) && reviewFetcher.data.id) {
            revalidator.revalidate();
        }
    }, [reviewFetcher.state, reviewFetcher.data, revalidator]);
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                id: "applicant",
                accessorFn: function (row) {
                    var _a;
                    var applicant = row.applicant;
                    return [
                        (_a = applicant === null || applicant === void 0 ? void 0 : applicant.fullName) !== null && _a !== void 0 ? _a : [applicant === null || applicant === void 0 ? void 0 : applicant.firstName, applicant === null || applicant === void 0 ? void 0 : applicant.lastName]
                            .filter(Boolean)
                            .join(" "),
                        applicant === null || applicant === void 0 ? void 0 : applicant.email,
                        applicant === null || applicant === void 0 ? void 0 : applicant.phone,
                        applicant === null || applicant === void 0 ? void 0 : applicant.wechat_unionid,
                        applicant === null || applicant === void 0 ? void 0 : applicant.avatarUrl
                    ]
                        .filter(Boolean)
                        .join("|");
                },
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Applicant"], ["Applicant"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var applicant = row.original.applicant;
                    if (!applicant)
                        return "—";
                    var name = getApplicantName(row.original);
                    return (<div className="flex items-center gap-3 min-w-0">
              <components_1.Avatar path={applicant.avatarUrl} name={name} size="sm"/>
              <div className="min-w-0">
                <div className="font-medium truncate">{name}</div>
                {applicant.wechat_unionid && (<div className="text-xs text-muted-foreground truncate" title={applicant.wechat_unionid}>
                    {t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["WeChat"], ["WeChat"])))} · {applicant.wechat_unionid.slice(-8)}
                  </div>)}
                {applicant.phone && (<div className="text-xs text-muted-foreground tabular-nums">
                    {applicant.phone}
                  </div>)}
              </div>
            </div>);
                },
                meta: { icon: <lu_1.LuUsers /> }
            },
            {
                id: "email",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Email"], ["Email"]))),
                accessorFn: function (row) {
                    var _a, _b, _c;
                    return (_b = (_a = row.applicant) === null || _a === void 0 ? void 0 : _a.email) !== null && _b !== void 0 ? _b : (((_c = row.applicant) === null || _c === void 0 ? void 0 : _c.wechat_unionid) ? "wechat" : null);
                },
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    if ((_b = row.original.applicant) === null || _b === void 0 ? void 0 : _b.email) {
                        return row.original.applicant.email;
                    }
                    if ((_c = row.original.applicant) === null || _c === void 0 ? void 0 : _c.wechat_unionid) {
                        return t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["WeChat sign-in"], ["WeChat sign-in"])));
                    }
                    return "—";
                }
            },
            {
                id: "role",
                header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Role"], ["Role"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<Enumerable_1.Enumerable value={(_c = (_b = row.original.employeeType) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : "—"}/>);
                }
            },
            {
                id: "inviter",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Invited By"], ["Invited By"]))),
                cell: function (_a) {
                    var _b, _c, _d;
                    var row = _a.row;
                    return (_d = (_c = (_b = row.original.inviteLink) === null || _b === void 0 ? void 0 : _b.inviter) === null || _c === void 0 ? void 0 : _c.fullName) !== null && _d !== void 0 ? _d : "—";
                }
            },
            {
                accessorKey: "status",
                header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Status"], ["Status"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<Enumerable_1.Enumerable value={getApplicationStatus(row.original.status)}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: [
                            { value: "pending", label: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Pending"], ["Pending"]))) },
                            { value: "approved", label: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Approved"], ["Approved"]))) },
                            { value: "rejected", label: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Rejected"], ["Rejected"]))) }
                        ],
                        isArray: false
                    }
                }
            },
            {
                accessorKey: "createdAt",
                header: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Submitted"], ["Submitted"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return new Date(row.original.createdAt).toLocaleString();
                }
            },
            {
                id: "actions",
                header: function () { return <span className="sr-only">{t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Actions"], ["Actions"])))}</span>; },
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    var currentRow = (_b = rows.find(function (item) { return item.id === row.original.id; })) !== null && _b !== void 0 ? _b : row.original;
                    var isReviewing = reviewingId === currentRow.id;
                    return (<div className="flex justify-end" data-prevent-row-nav onPointerDown={function (event) { return event.stopPropagation(); }} onClick={function (event) { return event.stopPropagation(); }}>
              <ApplicationActionMenu key={currentRow.id} row={currentRow} isReviewing={isReviewing} reviewAction={isReviewing ? reviewAction : null} canUpdate={permissions.can("update", "users")} onApprove={function () { return reviewApplication(currentRow, "approve"); }} onReject={function () { return reviewApplication(currentRow, "reject"); }}/>
            </div>);
                },
                size: 60,
                meta: {
                    cellClassName: "transition-none"
                }
            }
        ];
    }, [
        getApplicantName,
        getApplicationStatus,
        permissions,
        reviewAction,
        reviewApplication,
        reviewingId,
        rows,
        t
    ]);
    return (<components_1.Table key={tableKey} data={visibleRows} columns={columns} count={count} title={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Applications"], ["Applications"])))} withPagination/>);
});
ApplicationsTable.displayName = "ApplicationsTable";
exports.default = ApplicationsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17;
