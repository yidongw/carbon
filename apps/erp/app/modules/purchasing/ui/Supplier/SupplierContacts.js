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
var SupplierContacts = function (_a) {
    var _b, _c, _d, _e;
    var contacts = _a.contacts;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var supplierId = (0, react_router_1.useParams)().supplierId;
    if (!supplierId)
        throw new Error("supplierId not found");
    var permissions = (0, hooks_1.usePermissions)();
    var canEdit = permissions.can("create", "purchasing");
    var isEmpty = contacts === undefined || (contacts === null || contacts === void 0 ? void 0 : contacts.length) === 0;
    var deleteContactModal = (0, react_1.useDisclosure)();
    var _f = (0, react_2.useState)(), selectedContact = _f[0], setSelectedContact = _f[1];
    var getActions = (0, react_2.useCallback)(function (contact) {
        var actions = [];
        actions.push({
            label: permissions.can("update", "purchasing")
                ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Edit Contact"], ["Edit Contact"]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["View Contact"], ["View Contact"]))),
            icon: <lu_1.LuPencil />,
            onClick: function () {
                navigate(contact.id);
            }
        });
        if (permissions.can("delete", "purchasing")) {
            actions.push({
                label: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Delete Contact"], ["Delete Contact"]))),
                destructive: true,
                icon: <lu_1.LuTrash />,
                onClick: function () {
                    setSelectedContact(contact);
                    deleteContactModal.onOpen();
                }
            });
        }
        if (permissions.can("create", "users") &&
            contact.user === null &&
            contact.contact.email) {
            actions.push({
                label: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Create Account"], ["Create Account"]))),
                icon: <io_1.IoMdAdd />,
                onClick: function () {
                    navigate("".concat(path_1.path.to.newSupplierAccount, "?id=").concat(contact.id, "&supplier=").concat(supplierId));
                }
            });
        }
        if (permissions.can("create", "resources")) {
            actions.push({
                label: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Add Contractor"], ["Add Contractor"]))),
                icon: <io_1.IoMdAdd />,
                onClick: function () {
                    navigate("".concat(path_1.path.to.newContractor, "?id=").concat(contact.id, "&supplierId=").concat(supplierId));
                }
            });
        }
        return actions;
    }, [permissions, deleteContactModal, navigate, supplierId, t]);
    return (<>
      <react_1.Card>
        <react_1.HStack className="justify-between items-start">
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Contacts</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardAction>{canEdit && <components_1.New to="new"/>}</react_1.CardAction>
        </react_1.HStack>
        <react_1.CardContent>
          {isEmpty ? (<div className="my-8 text-center w-full">
              <p className="text-muted-foreground text-sm">
                <macro_1.Trans>You haven't created any contacts yet.</macro_1.Trans>
              </p>
            </div>) : (<ul className="flex flex-col w-full gap-4">
              {contacts === null || contacts === void 0 ? void 0 : contacts.map(function (contact) { return (<li key={contact.id}>
                  {contact.contact &&
                    !Array.isArray(contact.contact) &&
                    !Array.isArray(contact.user) ? (<components_1.Contact contact={contact.contact} url={path_1.path.to.supplierContact(supplierId, contact.id)} user={contact.user} actions={getActions(contact)}/>) : null}
                </li>); })}
            </ul>)}
        </react_1.CardContent>
      </react_1.Card>

      {selectedContact && selectedContact.id && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteSupplierContact(supplierId, selectedContact.id)} isOpen={deleteContactModal.isOpen} name={(_e = (_c = (_b = selectedContact.contact) === null || _b === void 0 ? void 0 : _b.fullName) !== null && _c !== void 0 ? _c : (_d = selectedContact.contact) === null || _d === void 0 ? void 0 : _d.email) !== null && _e !== void 0 ? _e : "Unknown"} text="Are you sure you want to delete this contact?" onCancel={deleteContactModal.onClose} onSubmit={deleteContactModal.onClose}/>)}

      <react_router_1.Outlet />
    </>);
};
exports.default = SupplierContacts;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
