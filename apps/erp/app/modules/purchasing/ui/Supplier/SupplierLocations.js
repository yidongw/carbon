"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var io_1 = require("react-icons/io");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var SupplierLocations = function (_a) {
    var _b, _c;
    var locations = _a.locations;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var supplierId = (0, react_router_1.useParams)().supplierId;
    if (!supplierId)
        throw new Error("supplierId not found");
    var permissions = (0, hooks_1.usePermissions)();
    var canEdit = permissions.can("create", "purchasing");
    var isEmpty = locations === undefined || (locations === null || locations === void 0 ? void 0 : locations.length) === 0;
    var deleteLocationModal = (0, react_1.useDisclosure)();
    var _d = (0, react_2.useState)(), selectedLocation = _d[0], setSelectedLocation = _d[1];
    var getActions = (0, react_2.useCallback)(function (location) {
        var actions = [];
        if (permissions.can("update", "purchasing")) {
            actions.push({
                label: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Edit Location"], ["Edit Location"]))),
                icon: <lu_1.LuPencil />,
                onClick: function () {
                    navigate(location.id);
                }
            });
        }
        if (permissions.can("delete", "purchasing")) {
            actions.push({
                label: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Delete Location"], ["Delete Location"]))),
                icon: <lu_1.LuTrash />,
                destructive: true,
                onClick: function () {
                    setSelectedLocation(location);
                    deleteLocationModal.onOpen();
                }
            });
        }
        if (permissions.can("create", "resources")) {
            actions.push({
                label: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Add Partner"], ["Add Partner"]))),
                icon: <io_1.IoMdAdd />,
                onClick: function () {
                    navigate("".concat(path_1.path.to.newPartner, "?id=").concat(location.id, "&supplierId=").concat(supplierId));
                }
            });
        }
        return actions;
    }, [permissions, deleteLocationModal, navigate, supplierId, t]);
    return (<>
      <react_1.Card>
        <react_1.HStack className="justify-between items-start">
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Locations</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardAction>{canEdit && <components_1.New to="new"/>}</react_1.CardAction>
        </react_1.HStack>
        <react_1.CardContent>
          {isEmpty ? (<div className="my-8 text-center w-full">
              <p className="text-muted-foreground text-sm">
                You haven’t created any locations yet.
              </p>
            </div>) : (<ul className="flex flex-col w-full gap-4">
              {locations === null || locations === void 0 ? void 0 : locations.map(function (location) { return (<li key={location.id}>
                  {location.address && !Array.isArray(location.address) ? (<components_1.Location location={location} actions={getActions(location)}/>) : null}
                </li>); })}
            </ul>)}
        </react_1.CardContent>
      </react_1.Card>

      {selectedLocation && selectedLocation.id && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteSupplierLocation(supplierId, selectedLocation.id)} name={(_c = (_b = selectedLocation.address) === null || _b === void 0 ? void 0 : _b.city) !== null && _c !== void 0 ? _c : ""} text="Are you sure you want to delete this location?" isOpen={deleteLocationModal.isOpen} onCancel={deleteLocationModal.onClose} onSubmit={deleteLocationModal.onClose}/>)}

      <react_router_1.Outlet />
    </>);
};
exports.default = SupplierLocations;
var templateObject_1, templateObject_2, templateObject_3;
