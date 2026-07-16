"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var DepreciationRunStatus_1 = require("./DepreciationRunStatus");
var DepreciationRunTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, primaryAction = _a.primaryAction;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var _b = (0, react_2.useState)(null), selectedRun = _b[0], setSelectedRun = _b[1];
    var deleteModal = (0, react_1.useDisclosure)();
    var columns = (0, react_2.useMemo)(function () { return [
        {
            accessorKey: "depreciationRunId",
            header: "Run ID",
            cell: function (_a) {
                var row = _a.row;
                return (<components_1.Hyperlink to={path_1.path.to.depreciationRun(row.original.id)}>
              {row.original.depreciationRunId}
            </components_1.Hyperlink>);
            },
            meta: {
                icon: <lu_1.LuHash />
            }
        },
        {
            accessorKey: "periodEnd",
            header: "Period End",
            cell: function (_a) {
                var row = _a.row;
                return (0, utils_1.formatDate)(row.original.periodEnd);
            },
            meta: {
                icon: <lu_1.LuCalendar />
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: function (_a) {
                var row = _a.row;
                return (<DepreciationRunStatus_1.default status={row.original.status}/>);
            },
            meta: {
                icon: <lu_1.LuStar />
            }
        },
        {
            accessorKey: "postedAt",
            header: "Posted At",
            cell: function (_a) {
                var row = _a.row;
                return row.original.postedAt ? (0, utils_1.formatDate)(row.original.postedAt) : "—";
            },
            meta: {
                icon: <lu_1.LuCalendar />
            }
        }
    ]; }, []);
    var renderContextMenu = (0, react_2.useCallback)(function (row) { return (<>
          <react_1.MenuItem disabled={!permissions.can("view", "accounting")} onClick={function () { return navigate(path_1.path.to.depreciationRun(row.id)); }}>
            <react_1.MenuIcon icon={<lu_1.LuEye />}/>
            View Run
          </react_1.MenuItem>
          {row.status === "Draft" && (<react_1.MenuItem disabled={!permissions.can("delete", "accounting")} destructive onClick={function () {
                setSelectedRun(row);
                deleteModal.onOpen();
            }}>
              <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
              Delete
            </react_1.MenuItem>)}
        </>); }, [deleteModal, navigate, permissions]);
    return (<>
        <components_1.Table data={data} columns={columns} count={count} primaryAction={primaryAction} renderContextMenu={renderContextMenu} title="Depreciation"/>
        {selectedRun && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteDepreciationRun(selectedRun.id)} isOpen={deleteModal.isOpen} name={selectedRun.depreciationRunId} text={"Are you sure you want to delete ".concat(selectedRun.depreciationRunId, "? This cannot be undone.")} onCancel={function () {
                deleteModal.onClose();
                setSelectedRun(null);
            }} onSubmit={function () {
                deleteModal.onClose();
                setSelectedRun(null);
            }}/>)}
      </>);
});
DepreciationRunTable.displayName = "DepreciationRunTable";
exports.default = DepreciationRunTable;
