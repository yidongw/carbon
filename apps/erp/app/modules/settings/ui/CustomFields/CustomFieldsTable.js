"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var bi_1 = require("react-icons/bi");
var bs_1 = require("react-icons/bs");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var hooks_1 = require("~/hooks");
var settings_1 = require("~/modules/settings");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var CustomFieldsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var permissions = (0, hooks_1.usePermissions)();
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Table"], ["Table"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<div className="flex items-center gap-2">
            <components_1.Hyperlink to={row.original.table}>{row.original.name}</components_1.Hyperlink>
            {shared_1.tablesWithTags.includes(row.original.table) && (<lu_1.LuTags className="text-emerald-500"/>)}
          </div>);
                },
                meta: {
                    icon: <lu_1.LuDatabase />
                }
            },
            {
                accessorKey: "module",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Module"], ["Module"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return <Enumerable_1.Enumerable value={row.original.module}/>;
                },
                meta: {
                    icon: <lu_1.LuLayoutGrid />,
                    filter: {
                        type: "static",
                        options: settings_1.modulesType.map(function (m) { return ({
                            label: <Enumerable_1.Enumerable value={m}/>,
                            value: m
                        }); })
                    }
                }
            },
            {
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Fields"], ["Fields"]))),
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    return (<react_1.HStack className="text-xs text-muted-foreground">
            <lu_1.LuList />
            <span>
              {Array.isArray(row.original.fields)
                            ? ((_c = (_b = row.original.fields) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0)
                            : 0}{" "}
              Fields
            </span>
            <react_1.Button variant="secondary" size="sm" onClick={function () {
                            navigate("".concat(path_1.path.to.customFieldList(row.original.table), "?").concat(params === null || params === void 0 ? void 0 : params.toString()));
                        }}>
              <macro_1.Trans>Edit</macro_1.Trans>
            </react_1.Button>
          </react_1.HStack>);
                }
            }
        ];
    }, [navigate, params, t]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem onClick={function () {
                navigate("".concat(path_1.path.to.newCustomField(row.table), "?").concat(params === null || params === void 0 ? void 0 : params.toString()));
            }}>
            <react_1.MenuIcon icon={<bi_1.BiAddToQueue />}/>
            <macro_1.Trans>New Field</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem onClick={function () {
                navigate("".concat(path_1.path.to.customFieldList(row.table), "?").concat(params === null || params === void 0 ? void 0 : params.toString()));
            }}>
            <react_1.MenuIcon icon={<bs_1.BsListUl />}/>
            <macro_1.Trans>View Custom Fields</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [navigate, params, permissions]);
    return (<>
      <components_1.Table data={data} columns={columns} count={count !== null && count !== void 0 ? count : 0} title={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Custom Fields"], ["Custom Fields"])))} renderContextMenu={renderContextMenu}/>
    </>);
});
CustomFieldsTable.displayName = "CustomFieldsTable";
exports.default = CustomFieldsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
