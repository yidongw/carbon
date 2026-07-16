"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
function formatBookDepreciation(row) {
    var method = row.depreciationMethod;
    var life = row.usefulLifeMonths;
    var residual = row.residualValuePercent;
    var years = life ? Math.round((life / 12) * 10) / 10 : null;
    var lifeStr = years ? "".concat(years, "yr") : "";
    var residualStr = residual && Number(residual) > 0 ? ", ".concat(residual, "% residual") : "";
    return "".concat(method, ", ").concat(lifeStr).concat(residualStr);
}
function formatTaxDepreciation(row) {
    var method = row.taxDepreciationMethod;
    if (!method)
        return "Same as Book";
    if (method === "MACRS") {
        var cls = row.macrsPropertyClass;
        return cls ? "MACRS ".concat(cls, "-Year") : "MACRS";
    }
    var life = row.taxUsefulLifeMonths;
    var years = life ? Math.round((life / 12) * 10) / 10 : null;
    var lifeStr = years ? ", ".concat(years, "yr") : "";
    return "".concat(method).concat(lifeStr);
}
var AssetClassesTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, taxDepreciationEnabled = _a.taxDepreciationEnabled, primaryAction = _a.primaryAction;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var _b = (0, react_2.useState)(null), selectedClass = _b[0], setSelectedClass = _b[1];
    var deleteModal = (0, react_1.useDisclosure)();
    var columns = (0, react_2.useMemo)(function () {
        var cols = [
            {
                accessorKey: "name",
                header: "Name",
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.Hyperlink to={path_1.path.to.assetClass(row.original.id)}>
              <Enumerable_1.Enumerable value={row.original.name} className="cursor-pointer"/>
            </components_1.Hyperlink>);
                },
                meta: {
                    icon: <lu_1.LuBookMarked />
                }
            },
            {
                id: "bookDepreciation",
                header: "Book Depreciation",
                cell: function (_a) {
                    var row = _a.row;
                    return formatBookDepreciation(row.original);
                },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            }
        ];
        if (taxDepreciationEnabled) {
            cols.push({
                id: "taxDepreciation",
                header: "Tax Depreciation",
                cell: function (_a) {
                    var row = _a.row;
                    return formatTaxDepreciation(row.original);
                },
                meta: {
                    icon: <lu_1.LuPercent />
                }
            });
        }
        return cols;
    }, [taxDepreciationEnabled]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) { return (<>
          <react_1.MenuItem disabled={!permissions.can("update", "accounting")} onClick={function () { return navigate(path_1.path.to.assetClass(row.id)); }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            Edit Asset Class
          </react_1.MenuItem>
          <react_1.MenuItem disabled={!permissions.can("delete", "accounting")} destructive onClick={function () {
            setSelectedClass(row);
            deleteModal.onOpen();
        }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            Delete Asset Class
          </react_1.MenuItem>
        </>); }, [deleteModal, navigate, permissions]);
    return (<>
        <components_1.Table data={data} columns={columns} count={count} primaryAction={primaryAction} renderContextMenu={renderContextMenu} title="Asset Classes"/>
        {selectedClass && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteAssetClass(selectedClass.id)} isOpen={deleteModal.isOpen} name={selectedClass.name} text={"Are you sure you want to delete the asset class: ".concat(selectedClass.name, "? This cannot be undone.")} onCancel={function () {
                deleteModal.onClose();
                setSelectedClass(null);
            }} onSubmit={function () {
                deleteModal.onClose();
                setSelectedClass(null);
            }}/>)}
      </>);
});
AssetClassesTable.displayName = "AssetClassesTable";
exports.default = AssetClassesTable;
