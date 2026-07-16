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
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var bs_1 = require("react-icons/bs");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var hooks_1 = require("~/hooks");
var invite_links_service_1 = require("~/modules/users/invite-links.service");
var path_1 = require("~/utils/path");
var UpdateInviteLinkExpiryModal_1 = require("./UpdateInviteLinkExpiryModal");
var METHOD_LABELS = {
    wechat: "WeChat",
    phone: "Phone",
    email: "Email",
    google: "Google",
    azure: "Outlook"
};
var InviteLinkActionMenu = function (_a) {
    var row = _a.row, isRevoking = _a.isRevoking, canUpdate = _a.canUpdate, onCopy = _a.onCopy, onSetExpiry = _a.onSetExpiry, onRevoke = _a.onRevoke;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)(false), open = _b[0], setOpen = _b[1];
    var _c = (0, react_2.useState)(false), pendingRevoke = _c[0], setPendingRevoke = _c[1];
    var wasRevoking = (0, react_2.useRef)(false);
    var expired = (0, invite_links_service_1.isInviteLinkExpired)(row);
    var showRevokeLoading = pendingRevoke || isRevoking;
    (0, react_2.useEffect)(function () {
        if (isRevoking) {
            wasRevoking.current = true;
            setOpen(true);
            return;
        }
        if (wasRevoking.current) {
            wasRevoking.current = false;
            setPendingRevoke(false);
            setOpen(false);
        }
    }, [isRevoking]);
    return (<react_1.Menu type="dropdown">
      <react_1.DropdownMenu modal={false} open={open} onOpenChange={function (next) {
            if (showRevokeLoading && !next)
                return;
            setOpen(next);
        }}>
        <react_1.DropdownMenuTrigger asChild>
          <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Action Menu"], ["Action Menu"])))} variant="secondary" icon={<bs_1.BsThreeDotsVertical />} onPointerDown={function (event) { return event.stopPropagation(); }} onClick={function (event) { return event.stopPropagation(); }}/>
        </react_1.DropdownMenuTrigger>
        <react_1.DropdownMenuContent align="end" className="w-56">
          <react_1.MenuItem disabled={showRevokeLoading} onClick={onCopy}>
            <react_1.MenuIcon icon={<lu_1.LuCopy />}/>
            <macro_1.Trans>Copy Link</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem disabled={!canUpdate || showRevokeLoading} onClick={onSetExpiry}>
            <react_1.MenuIcon icon={<lu_1.LuCalendarClock />}/>
            <macro_1.Trans>Set Expiration</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={expired || !canUpdate} onSelect={function (event) {
            event.preventDefault();
            if (!showRevokeLoading && !expired && canUpdate) {
                setPendingRevoke(true);
                setOpen(true);
                onRevoke();
            }
        }}>
            <react_1.MenuIcon icon={showRevokeLoading ? (<react_1.Spinner className="h-4 w-4"/>) : (<lu_1.LuShieldOff />)}/>
            <macro_1.Trans>Revoke Link</macro_1.Trans>
          </react_1.MenuItem>
        </react_1.DropdownMenuContent>
      </react_1.DropdownMenu>
    </react_1.Menu>);
};
var InviteLinksTable = function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var params = (0, hooks_1.useUrlParams)()[0];
    var permissions = (0, hooks_1.usePermissions)();
    var revokeFetcher = (0, react_router_1.useFetcher)();
    var revalidator = (0, react_router_1.useRevalidator)();
    var revokeSubmitted = (0, react_2.useRef)(false);
    var pendingRevokeId = (0, react_2.useRef)(null);
    var _b = (0, react_2.useState)(null), revokingId = _b[0], setRevokingId = _b[1];
    var _c = (0, react_2.useState)(null), expiryModal = _c[0], setExpiryModal = _c[1];
    var _d = (0, react_2.useState)(data), rows = _d[0], setRows = _d[1];
    (0, react_2.useEffect)(function () {
        setRows(function (current) {
            var localRevoked = new Map(current
                .filter(function (row) { return row.revokedAt; })
                .map(function (row) { return [row.id, row.revokedAt]; }));
            return data.map(function (row) {
                if (row.revokedAt || !localRevoked.has(row.id)) {
                    return row;
                }
                return __assign(__assign({}, row), { revokedAt: localRevoked.get(row.id) });
            });
        });
    }, [data]);
    var revokeLink = (0, react_2.useCallback)(function (row) {
        revokeSubmitted.current = true;
        pendingRevokeId.current = row.id;
        setRevokingId(row.id);
        revokeFetcher.submit({ id: row.id }, {
            method: "post",
            action: path_1.path.to.revokeInviteLink
        });
    }, [revokeFetcher]);
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (revokeFetcher.state !== "idle" || !revokeSubmitted.current) {
            return;
        }
        revokeSubmitted.current = false;
        if (((_a = revokeFetcher.data) === null || _a === void 0 ? void 0 : _a.ok) === false && pendingRevokeId.current) {
            var failedId_1 = pendingRevokeId.current;
            setRows(function (current) {
                return current.map(function (item) {
                    return item.id === failedId_1 ? __assign(__assign({}, item), { revokedAt: null }) : item;
                });
            });
            pendingRevokeId.current = null;
            setRevokingId(null);
            revalidator.revalidate();
            return;
        }
        if (((_b = revokeFetcher.data) === null || _b === void 0 ? void 0 : _b.ok) && revokeFetcher.data.id) {
            var _c = revokeFetcher.data, id_1 = _c.id, revokedAt_1 = _c.revokedAt;
            setRows(function (current) {
                return current.map(function (item) {
                    return item.id === id_1
                        ? __assign(__assign({}, item), { revokedAt: revokedAt_1 !== null && revokedAt_1 !== void 0 ? revokedAt_1 : item.revokedAt }) : item;
                });
            });
        }
        pendingRevokeId.current = null;
        setRevokingId(null);
    }, [revokeFetcher.state, revokeFetcher.data, revalidator]);
    var getStatus = (0, react_2.useCallback)(function (row) {
        if ((0, invite_links_service_1.isInviteLinkExpired)(row)) {
            return row.revokedAt ? t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Revoked"], ["Revoked"]))) : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Expired"], ["Expired"])));
        }
        return t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Active"], ["Active"])));
    }, [t]);
    var copyLink = (0, react_2.useCallback)(function (code) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigator.clipboard.writeText("".concat(path_1.ERP_URL).concat(path_1.path.to.joinLink(code)))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, []);
    var columns = (0, react_2.useMemo)(function () { return [
        {
            id: "label",
            accessorFn: function (row) { return row.label || row.code; },
            header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Label"], ["Label"]))),
            cell: function (_a) {
                var getValue = _a.getValue;
                return (<span className="font-medium">{getValue()}</span>);
            },
            meta: { icon: <lu_1.LuLink /> }
        },
        {
            id: "role",
            accessorFn: function (row) { var _a, _b; return (_b = (_a = row.employeeType) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "—"; },
            header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Role"], ["Role"]))),
            cell: function (_a) {
                var getValue = _a.getValue;
                return <Enumerable_1.Enumerable value={getValue()}/>;
            }
        },
        {
            id: "inviter",
            accessorFn: function (row) { var _a, _b; return (_b = (_a = row.inviter) === null || _a === void 0 ? void 0 : _a.fullName) !== null && _b !== void 0 ? _b : "—"; },
            header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Inviter"], ["Inviter"]))),
            cell: function (_a) {
                var getValue = _a.getValue;
                return getValue();
            }
        },
        {
            id: "loginMethods",
            accessorFn: function (row) {
                var _a;
                return ((_a = row.loginMethods) === null || _a === void 0 ? void 0 : _a.length)
                    ? row.loginMethods.map(function (m) { var _a; return (_a = METHOD_LABELS[m]) !== null && _a !== void 0 ? _a : m; }).join(" → ")
                    : "—";
            },
            header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Login"], ["Login"]))),
            cell: function (_a) {
                var getValue = _a.getValue;
                return (<span className="text-sm text-muted-foreground">
            {getValue()}
          </span>);
            }
        },
        {
            id: "status",
            accessorFn: function (row) { return getStatus(row); },
            header: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Status"], ["Status"]))),
            cell: function (_a) {
                var getValue = _a.getValue;
                return <Enumerable_1.Enumerable value={getValue()}/>;
            }
        },
        {
            id: "applications",
            accessorFn: function (row) { var _a, _b, _c; return (_c = (_b = (_a = row.membershipApplication) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.count) !== null && _c !== void 0 ? _c : 0; },
            header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Applications"], ["Applications"]))),
            cell: function (_a) {
                var getValue = _a.getValue;
                return String(getValue());
            }
        },
        {
            id: "expiresAt",
            accessorFn: function (row) { return row.expiresAt; },
            header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Expires"], ["Expires"]))),
            cell: function (_a) {
                var getValue = _a.getValue;
                var value = getValue();
                return value ? new Date(value).toLocaleDateString() : "—";
            }
        },
        {
            id: "actions",
            accessorFn: function (row) { var _a, _b; return "".concat(row.id, ":").concat((_a = row.revokedAt) !== null && _a !== void 0 ? _a : "", ":").concat((_b = row.expiresAt) !== null && _b !== void 0 ? _b : "", ":").concat(revokingId === row.id); },
            header: function () { return <span className="sr-only">{t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Actions"], ["Actions"])))}</span>; },
            cell: function (_a) {
                var _b, _c;
                var row = _a.row;
                var currentRow = (_b = rows.find(function (item) { return item.id === row.original.id; })) !== null && _b !== void 0 ? _b : row.original;
                var isRevoking = revokingId === currentRow.id;
                return (<div className="flex justify-end" data-prevent-row-nav onPointerDown={function (event) { return event.stopPropagation(); }} onClick={function (event) { return event.stopPropagation(); }}>
              <InviteLinkActionMenu key={"".concat(currentRow.id, ":").concat((_c = currentRow.revokedAt) !== null && _c !== void 0 ? _c : "active")} row={currentRow} isRevoking={isRevoking} canUpdate={permissions.can("update", "users")} onCopy={function () { return copyLink(currentRow.code); }} onSetExpiry={function () { return setExpiryModal(currentRow); }} onRevoke={function () { return revokeLink(currentRow); }}/>
            </div>);
            },
            size: 60,
            meta: {
                cellClassName: "transition-none"
            }
        }
    ]; }, [copyLink, getStatus, permissions, revokeLink, revokingId, rows, t]);
    return (<>
      <components_1.Table data={rows} columns={columns} count={count} primaryAction={permissions.can("create", "users") && (<components_1.New label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Invite Link"], ["Invite Link"])))} to={"new?".concat(params.toString())}/>)} title={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Invite Links"], ["Invite Links"])))}/>
      {expiryModal && (<UpdateInviteLinkExpiryModal_1.default id={expiryModal.id} expiresAt={expiryModal.expiresAt} isOpen onClose={function () { return setExpiryModal(null); }}/>)}
    </>);
};
InviteLinksTable.displayName = "InviteLinksTable";
exports.default = InviteLinksTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14;
