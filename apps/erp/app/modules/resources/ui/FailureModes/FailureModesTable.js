"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var resources_models_1 = require("../../resources.models");
var FailureModesTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failure Mode"], ["Failure Mode"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={row.original.id}>
            <Enumerable_1.Enumerable value={row.original.name}/>
          </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuCircleAlert />
                }
            },
            {
                accessorKey: "type",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Type"], ["Type"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return <Enumerable_1.Enumerable value={row.original.type}/>;
                },
                meta: {
                    icon: <lu_1.LuShapes />,
                    filter: {
                        type: "static",
                        options: resources_models_1.maintenanceFailureModeType.map(function (type) { return ({
                            label: <Enumerable_1.Enumerable value={type}/>,
                            value: type
                        }); })
                    }
                }
            }
        ];
        return __spreadArray([], defaultColumns, true);
    }, [t]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem onClick={function () {
                navigate("".concat(path_1.path.to.failureMode(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Failure Mode</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem destructive disabled={!permissions.can("delete", "resources")} onClick={function () {
                navigate("".concat(path_1.path.to.deleteFailureMode(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete Failure Mode</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={data} columns={columns} count={count} primaryAction={permissions.can("create", "resources") && (<components_1.New label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Failure Mode"], ["Failure Mode"])))} to={"".concat(path_1.path.to.newFailureMode, "?").concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Failure Modes"], ["Failure Modes"])))}/>);
});
FailureModesTable.displayName = "FailureModesTable";
exports.default = FailureModesTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
