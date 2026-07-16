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
var path_1 = require("~/utils/path");
var SequencesTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={row.original.table}>{row.original.name}</components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuText />
                }
            },
            {
                accessorKey: "prefix",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Prefix"], ["Prefix"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuTextCursor />
                }
            },
            {
                accessorKey: "next",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Current"], ["Current"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuArrowRight />
                }
            },
            {
                accessorKey: "size",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Size"], ["Size"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuMaximize />
                }
            },
            {
                accessorKey: "step",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Step"], ["Step"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuStepForward />
                }
            },
            {
                accessorKey: "suffix",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Suffix"], ["Suffix"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuHash />
                }
            }
        ];
    }, [t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem disabled={!permissions.can("update", "settings")} onClick={function () {
                navigate("".concat(path_1.path.to.tableSequence(row.table), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Sequence</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={data} columns={columns} count={count} renderContextMenu={renderContextMenu} title={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Sequences"], ["Sequences"])))}/>);
});
SequencesTable.displayName = "SequencesTable";
exports.default = SequencesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
