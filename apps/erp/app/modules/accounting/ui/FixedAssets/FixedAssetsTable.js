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
var Enumerable_1 = require("~/components/Enumerable");
var Location_1 = require("~/components/Form/Location");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var useCurrencyFormatter_1 = require("~/hooks/useCurrencyFormatter");
var path_1 = require("~/utils/path");
var accounting_models_1 = require("../../accounting.models");
var FixedAssetStatus_1 = require("./FixedAssetStatus");
var FixedAssetsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, assetClasses = _a.assetClasses, primaryAction = _a.primaryAction;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var company = (0, hooks_1.useUser)().company;
    var currencyFormatter = (0, useCurrencyFormatter_1.useCurrencyFormatter)({
        currency: company.baseCurrencyCode
    });
    var locations = (0, Location_1.useLocations)();
    var _b = (0, react_2.useState)(null), selectedAsset = _b[0], setSelectedAsset = _b[1];
    var deleteModal = (0, react_1.useDisclosure)();
    var columns = (0, react_2.useMemo)(function () { return [
        {
            accessorKey: "fixedAssetId",
            header: "Asset ID",
            cell: function (_a) {
                var row = _a.row;
                return (<components_1.Hyperlink to={path_1.path.to.fixedAsset(row.original.id)}>
              {row.original.fixedAssetId}
            </components_1.Hyperlink>);
            },
            meta: {
                icon: <lu_1.LuBookMarked />
            }
        },
        {
            accessorKey: "name",
            header: "Name",
            meta: {
                icon: <lu_1.LuBuilding2 />
            }
        },
        {
            accessorKey: "serialNumber",
            header: "Serial Number",
            meta: {
                icon: <lu_1.LuHash />
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: function (_a) {
                var row = _a.row;
                return (<FixedAssetStatus_1.default status={row.original.status}/>);
            },
            meta: {
                filter: {
                    type: "static",
                    options: accounting_models_1.fixedAssetStatuses.map(function (v) { return ({
                        label: <FixedAssetStatus_1.default status={v}/>,
                        value: v
                    }); })
                },
                icon: <lu_1.LuStar />
            }
        },
        {
            accessorKey: "fixedAssetClassId",
            header: "Asset Class",
            cell: function (_a) {
                var _b;
                var row = _a.row;
                var cls = row.original.fixedAssetClass;
                return <Enumerable_1.Enumerable value={(_b = cls === null || cls === void 0 ? void 0 : cls.name) !== null && _b !== void 0 ? _b : null}/>;
            },
            meta: {
                filter: {
                    type: "static",
                    options: assetClasses.map(function (c) { return ({
                        label: <Enumerable_1.Enumerable value={c.name}/>,
                        value: c.id
                    }); })
                },
                icon: <lu_1.LuLayers />
            }
        },
        {
            accessorKey: "location.name",
            header: "Location",
            cell: function (_a) {
                var _b;
                var row = _a.row;
                var loc = row.original.location;
                return <Enumerable_1.Enumerable value={(_b = loc === null || loc === void 0 ? void 0 : loc.name) !== null && _b !== void 0 ? _b : null}/>;
            },
            meta: {
                filter: {
                    type: "static",
                    options: locations.map(function (l) { return ({
                        label: <Enumerable_1.Enumerable value={l.label}/>,
                        value: l.label
                    }); })
                },
                icon: <lu_1.LuMapPin />
            }
        },
        {
            accessorKey: "acquisitionCost",
            header: "Acquisition Cost",
            cell: function (_a) {
                var row = _a.row;
                return currencyFormatter.format(Number(row.original.acquisitionCost));
            },
            meta: {
                icon: <lu_1.LuCircleDollarSign />
            }
        },
        {
            id: "netBookValue",
            header: "Net Book Value",
            cell: function (_a) {
                var row = _a.row;
                var nbv = Number(row.original.acquisitionCost) -
                    Number(row.original.accumulatedDepreciation);
                return currencyFormatter.format(nbv);
            },
            meta: {
                icon: <lu_1.LuCircleDollarSign />
            }
        }
    ]; }, [assetClasses, currencyFormatter, locations]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        var isDraft = row.status === "Draft";
        return (<>
            <react_1.MenuItem disabled={!permissions.can("view", "accounting")} onClick={function () { return navigate(path_1.path.to.fixedAsset(row.id)); }}>
              <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
              {isDraft ? "Edit Asset" : "View Asset"}
            </react_1.MenuItem>
            {isDraft && (<react_1.MenuItem disabled={!permissions.can("delete", "accounting")} destructive onClick={function () {
                    setSelectedAsset(row);
                    deleteModal.onOpen();
                }}>
                <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
                Delete Asset
              </react_1.MenuItem>)}
          </>);
    }, [deleteModal, navigate, permissions]);
    return (<>
        <components_1.Table data={data} columns={columns} count={count} primaryAction={primaryAction} renderContextMenu={renderContextMenu} title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Fixed Assets"], ["Fixed Assets"])))}/>
        {selectedAsset && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteFixedAsset(selectedAsset.id)} isOpen={deleteModal.isOpen} name={selectedAsset.fixedAssetId} text={"Are you sure you want to delete ".concat(selectedAsset.fixedAssetId, "? This cannot be undone.")} onCancel={function () {
                deleteModal.onClose();
                setSelectedAsset(null);
            }} onSubmit={function () {
                deleteModal.onClose();
                setSelectedAsset(null);
            }}/>)}
      </>);
});
FixedAssetsTable.displayName = "FixedAssetsTable";
exports.default = FixedAssetsTable;
var templateObject_1;
