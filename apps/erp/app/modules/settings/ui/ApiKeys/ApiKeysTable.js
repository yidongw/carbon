"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
function getScopeCount(scopes) {
    if (!scopes)
        return 0;
    return Object.keys(scopes).length;
}
function formatRateLimit(limit, window) {
    var _a;
    var windowLabels = {
        "1m": "/min",
        "1h": "/hr",
        "1d": "/day"
    };
    return "".concat(limit).concat((_a = windowLabels[window]) !== null && _a !== void 0 ? _a : "/hr");
}
var ApiKeysTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var navigate = (0, react_router_1.useNavigate)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var permissions = (0, hooks_1.usePermissions)();
    var people = (0, stores_1.usePeople)()[0];
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={row.original.id}>{row.original.name}</components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuTag />
                }
            },
            {
                id: "keyPreview",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Key"], ["Key"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var preview = row.original.keyPreview;
                    return (<span className="font-mono text-sm text-muted-foreground">
              {preview ? "crbn_\u2022\u2022\u2022".concat(preview) : "crbn_•••••"}
            </span>);
                },
                meta: {
                    icon: <lu_1.LuKey />
                }
            },
            {
                id: "scopes",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Scopes"], ["Scopes"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var scopes = row.original.scopes;
                    var scopeCount = getScopeCount(scopes);
                    return (<react_1.Badge variant="secondary">
              {scopeCount === 0 ? t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["No Access"], ["No Access"]))) : t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["", " permissions"], ["", " permissions"])), scopeCount)}
            </react_1.Badge>);
                },
                meta: {
                    icon: <lu_1.LuShield />
                }
            },
            {
                id: "rateLimit",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Rate Limit"], ["Rate Limit"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var limit = row.original.rateLimit;
                    var window = row.original.rateLimitWindow;
                    return (<span className="text-sm text-muted-foreground">
              {formatRateLimit(limit !== null && limit !== void 0 ? limit : 60, window !== null && window !== void 0 ? window : "1m")}
            </span>);
                },
                meta: {
                    icon: <lu_1.LuGauge />
                }
            },
            {
                id: "createdBy",
                header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Created By"], ["Created By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return <components_1.EmployeeAvatar employeeId={row.original.createdBy}/>;
                },
                meta: {
                    icon: <lu_1.LuUser />,
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: employee.name
                        }); })
                    }
                }
            },
            {
                id: "expiresAt",
                header: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Expires"], ["Expires"]))),
                cell: function (_a) {
                    var row = _a.row;
                    var expiresAt = row.original.expiresAt;
                    if (!expiresAt)
                        return (<span className="text-muted-foreground">
                <macro_1.Trans>Never</macro_1.Trans>
              </span>);
                    var isExpired = new Date(expiresAt) < new Date();
                    return (<react_1.Badge variant={isExpired ? "destructive" : "secondary"}>
              {isExpired ? t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Expired"], ["Expired"]))) : formatDate(expiresAt)}
            </react_1.Badge>);
                },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            },
            {
                accessorKey: "createdAt",
                header: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Created At"], ["Created At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            }
        ];
    }, [people, t, formatDate]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem onClick={function () {
                navigate("".concat(path_1.path.to.apiKey(row.id), "?").concat(params === null || params === void 0 ? void 0 : params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit API Key</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem destructive onClick={function () {
                navigate("".concat(path_1.path.to.deleteApiKey(row.id), "?").concat(params === null || params === void 0 ? void 0 : params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete API Key</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [navigate, params, permissions]);
    return (<>
      <components_1.Table data={data} columns={columns} count={count !== null && count !== void 0 ? count : 0} primaryAction={<react_1.HStack>
            {permissions.can("update", "users") && (<components_1.New label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["API Key"], ["API Key"])))} to={"".concat(path_1.path.to.newApiKey, "?").concat(params.toString())}/>)}
            <react_1.Button leftIcon={<lu_1.LuCode />} variant="secondary" asChild>
              <react_router_1.Link to={path_1.path.to.apiIntroduction}>
                <macro_1.Trans>API Docs</macro_1.Trans>
              </react_router_1.Link>
            </react_1.Button>
          </react_1.HStack>} renderContextMenu={renderContextMenu} title={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["API Keys"], ["API Keys"])))}/>
      <react_router_1.Outlet />
    </>);
});
ApiKeysTable.displayName = "ApiKeysTable";
exports.default = ApiKeysTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
