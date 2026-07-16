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
var InlineEditor_1 = require("~/components/InlineEditor");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var defaultColumnVisibility = {};
var SuggestionsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, tags = _a.tags, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var params = (0, hooks_1.useUrlParams)()[0];
    var people = (0, stores_1.usePeople)()[0];
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "suggestion",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Suggestion"], ["Suggestion"]))),
                cell: function (_a) {
                    var _b, _c, _d, _e;
                    var row = _a.row;
                    return (<components_1.Hyperlink to={row.original.id}>
              <react_1.HStack spacing={2} className="max-w-[400px]">
                <span className="text-xl shrink-0">
                  {(_b = row.original.emoji) !== null && _b !== void 0 ? _b : "💡"}
                </span>
                <span className="truncate">
                  {(_c = row.original.suggestion) === null || _c === void 0 ? void 0 : _c.slice(0, 100)}
                  {((_e = (_d = row.original.suggestion) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0) > 100 ? "..." : ""}
                </span>
              </react_1.HStack>
            </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuFileText />
                }
            },
            {
                id: "employee",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Employee"], ["Employee"]))),
                cell: function (_a) {
                    var _b, _c, _d;
                    var row = _a.row;
                    return (<react_1.HStack spacing={2}>
              <react_1.Avatar size="sm" name={(_b = row.original.employeeName) !== null && _b !== void 0 ? _b : undefined} src={(_c = row.original.employeeAvatarUrl) !== null && _c !== void 0 ? _c : undefined}/>
              <span>{(_d = row.original.employeeName) !== null && _d !== void 0 ? _d : "Anonymous"}</span>
            </react_1.HStack>);
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
                accessorKey: "tags",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Tags"], ["Tags"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<InlineEditor_1.TagsCell row={row.original} table="suggestion" availableTags={tags}/>);
                },
                meta: {
                    filter: {
                        type: "static",
                        options: tags === null || tags === void 0 ? void 0 : tags.map(function (tag) { return ({
                            value: tag.name,
                            label: <react_1.Badge variant="secondary">{tag.name}</react_1.Badge>
                        }); }),
                        isArray: true
                    },
                    icon: <lu_1.LuTag />
                }
            },
            {
                accessorKey: "createdAt",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Date"], ["Date"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            }
        ];
        return defaultColumns;
    }, [tags, people, t, formatDate]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
            <react_1.MenuItem onClick={function () {
                navigate(path_1.path.to.suggestion(row.id));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuEye />}/>
              <macro_1.Trans>View Suggestion</macro_1.Trans>
            </react_1.MenuItem>
            <react_1.MenuItem destructive disabled={!permissions.can("delete", "resources")} onClick={function () {
                navigate("".concat(path_1.path.to.deleteSuggestion(row.id), "?").concat(params.toString()));
            }}>
              <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Suggestion</macro_1.Trans>
            </react_1.MenuItem>
          </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={data} count={count} columns={columns} defaultColumnVisibility={defaultColumnVisibility} renderContextMenu={renderContextMenu} title={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Suggestions"], ["Suggestions"])))} table="suggestion" withSavedView/>);
});
SuggestionsTable.displayName = "SuggestionsTable";
exports.default = SuggestionsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
