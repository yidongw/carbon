"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var accounting_models_1 = require("../../accounting.models");
var DimensionsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "name",
                header: "Name",
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={"".concat(row.original.id, "?").concat(params.toString())}>
            {row.original.name}
          </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                accessorKey: "entityType",
                header: "Entity Type",
                cell: function (item) { return <Enumerable_1.Enumerable value={item.getValue()}/>; },
                meta: {
                    filter: {
                        type: "static",
                        options: accounting_models_1.dimensionEntityTypes.map(function (v) { return ({
                            label: <Enumerable_1.Enumerable value={v}/>,
                            value: v
                        }); })
                    },
                    icon: <lu_1.LuBoxes />
                }
            },
            {
                id: "valuesCount",
                header: "Values",
                cell: function (_a) {
                    var _b, _c;
                    var row = _a.row;
                    if (row.original.entityType === "Custom") {
                        var values = (_c = (_b = row.original.dimensionValue) === null || _b === void 0 ? void 0 : _b.map(function (v) { return v.name; })) !== null && _c !== void 0 ? _c : [];
                        if (values.length === 0)
                            return 0;
                        var displayValues = values.slice(0, 3);
                        var remainingCount = values.length - 3;
                        return (<div className="max-w-[320px] truncate">
                {displayValues.join(", ")}
                {remainingCount > 0 && " +".concat(remainingCount)}
              </div>);
                    }
                    return <react_1.Badge variant="gray">Inherited</react_1.Badge>;
                },
                meta: {
                    icon: <lu_1.LuShapes />
                }
            }
        ];
        return defaultColumns;
    }, [params]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem disabled={!permissions.can("update", "accounting")} onClick={function () {
                navigate("".concat(path_1.path.to.dimension(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            Edit Dimension
          </react_1.MenuItem>
          <react_1.MenuItem disabled={!permissions.can("delete", "accounting")} onClick={function () {
                navigate("".concat(path_1.path.to.deleteDimension(row.id), "?").concat(params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            Delete Dimension
          </react_1.MenuItem>
        </>);
    }, [navigate, params, permissions]);
    return (<components_1.Table data={data} columns={columns} count={count} primaryAction={permissions.can("create", "accounting") && (<components_1.New label="Dimension" to={"new?".concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title="Dimensions"/>);
});
DimensionsTable.displayName = "DimensionsTable";
exports.default = DimensionsTable;
