"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var Selectors_1 = require("~/components/Selectors");
var users_1 = require("~/modules/users");
var path_1 = require("~/utils/path");
var DeactivateUsersModal = function (_a) {
    var userIds = _a.userIds, isOpen = _a.isOpen, _b = _a.redirectTo, redirectTo = _b === void 0 ? path_1.path.to.employeeAccounts : _b, onClose = _a.onClose;
    var isSingleUser = userIds.length === 1;
    return (<react_1.Modal open={isOpen} onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            {isSingleUser ? (<macro_1.Trans>Deactivate Employee</macro_1.Trans>) : (<macro_1.Trans>Deactivate Employees</macro_1.Trans>)}
          </react_1.ModalTitle>
        </react_1.ModalHeader>
        <react_1.ModalBody>
          <p className="mb-2">
            {isSingleUser ? (<macro_1.Trans>Are you sure you want to deactivate this user?</macro_1.Trans>) : (<macro_1.Trans>Are you sure you want to deactivate these users?</macro_1.Trans>)}
          </p>
          <Selectors_1.UserSelect value={userIds} readOnly isMulti/>
        </react_1.ModalBody>
        <react_1.ModalFooter>
          <react_1.HStack>
            <react_1.Button variant="ghost" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <form_1.ValidatedForm method="post" action={path_1.path.to.deactivateUsers} validator={users_1.deactivateUsersValidator} onSuccess={onClose}>
              {userIds.map(function (id, index) { return (<input key={id} type="hidden" name={"users[".concat(index, "]")} value={id}/>); })}
              <input type="hidden" name="redirectTo" value={redirectTo}/>
              <react_1.Button variant="destructive" type="submit">
                <macro_1.Trans>Deactivate</macro_1.Trans>
              </react_1.Button>
            </form_1.ValidatedForm>
          </react_1.HStack>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
};
exports.default = DeactivateUsersModal;
