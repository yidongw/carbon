"use strict";
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
var CustomerContacts = function (_a) {
    var _b, _c, _d, _e;
    var contacts = _a.contacts;
    var navigate = (0, react_router_1.useNavigate)();
    var customerId = (0, react_router_1.useParams)().customerId;
    if (!customerId)
        throw new Error("customerId not found");
    var permissions = (0, hooks_1.usePermissions)();
    var canEdit = permissions.can("create", "sales");
    var isEmpty = contacts === undefined || (contacts === null || contacts === void 0 ? void 0 : contacts.length) === 0;
    var deleteContactModal = (0, react_1.useDisclosure)();
    var _f = (0, react_2.useState)(null), contact = _f[0], setSelectedContact = _f[1];
    var getActions = (0, react_2.useCallback)(function (contact) {
        var actions = [];
        actions.push({
            label: permissions.can("update", "sales")
                ? "Edit Contact"
                : "View Contact",
            icon: <lu_1.LuPencil />,
            onClick: function () {
                navigate(contact.id);
            }
        });
        if (permissions.can("delete", "sales")) {
            actions.push({
                label: "Delete Contact",
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
                label: "Create Account",
                icon: <io_1.IoMdAdd />,
                onClick: function () {
                    navigate("".concat(path_1.path.to.newCustomerAccount, "?id=").concat(contact.id, "&customer=").concat(customerId));
                }
            });
        }
        return actions;
    }, [permissions, deleteContactModal, navigate, customerId]);
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
          {isEmpty ? (<div className="w-full my-8 text-center">
              <p className="text-muted-foreground text-sm">
                You haven’t created any contacts yet.
              </p>
            </div>) : (<ul className="flex flex-col w-full gap-4">
              {contacts === null || contacts === void 0 ? void 0 : contacts.map(function (contact) { return (<li key={contact.id}>
                  {contact.contact &&
                    !Array.isArray(contact.contact) &&
                    !Array.isArray(contact.user) ? (<components_1.Contact contact={contact.contact} url={path_1.path.to.customerContact(customerId, contact.id)} user={contact.user} actions={getActions(contact)}/>) : null}
                </li>); })}
            </ul>)}
        </react_1.CardContent>
      </react_1.Card>

      {contact && contact.id && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteCustomerContact(customerId, contact.id)} isOpen={deleteContactModal.isOpen} name={(_e = (_c = (_b = contact === null || contact === void 0 ? void 0 : contact.contact) === null || _b === void 0 ? void 0 : _b.fullName) !== null && _c !== void 0 ? _c : (_d = contact === null || contact === void 0 ? void 0 : contact.contact) === null || _d === void 0 ? void 0 : _d.email) !== null && _e !== void 0 ? _e : "Unknown"} text="Are you sure you want to delete this contact?" onCancel={deleteContactModal.onClose} onSubmit={deleteContactModal.onClose}/>)}

      <react_router_1.Outlet />
    </>);
};
exports.default = CustomerContacts;
