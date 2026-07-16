"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var users_1 = require("~/modules/users");
var path_1 = require("~/utils/path");
var CreateEmployeeModal = function (_a) {
    var _b, _c, _d, _e;
    var _f = _a.type, type = _f === void 0 ? "route" : _f, _g = _a.open, open = _g === void 0 ? true : _g, onClose = _a.onClose, onSuccess = _a.onSuccess;
    var t = (0, macro_1.useLingui)().t;
    var defaults = (0, hooks_1.useUser)().defaults;
    var navigate = (0, react_router_1.useNavigate)();
    var formFetcher = (0, react_router_1.useFetcher)();
    var employeeTypeFetcher = (0, react_router_1.useFetcher)();
    var handledSuccessRef = (0, react_2.useRef)(false);
    (0, react_1.useMount)(function () {
        employeeTypeFetcher.load(path_1.path.to.api.employeeTypes);
    });
    (0, react_2.useEffect)(function () {
        if (open) {
            handledSuccessRef.current = false;
        }
    }, [open]);
    (0, react_2.useEffect)(function () {
        if (type !== "modal")
            return;
        var data = formFetcher.data;
        if (!data || handledSuccessRef.current)
            return;
        if (formFetcher.state === "loading" && data.success === true) {
            handledSuccessRef.current = true;
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess({
                userId: data.userId,
                firstName: data.firstName,
                lastName: data.lastName
            });
            onClose === null || onClose === void 0 ? void 0 : onClose();
            react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Successfully invited employee"], ["Successfully invited employee"]))));
            return;
        }
        if (formFetcher.state === "idle" && data.success === false) {
            react_1.toast.error(data.message);
        }
    }, [formFetcher.data, formFetcher.state, onClose, onSuccess, type, t]);
    var employeeTypeOptions = (_d = (_c = (_b = employeeTypeFetcher.data) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.map(function (et) { return ({
        value: et.id,
        label: et.name
    }); })) !== null && _d !== void 0 ? _d : [];
    var handleClose = function () {
        if (type === "modal") {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            return;
        }
        navigate(-1);
    };
    return (<react_1.Modal open={open} onOpenChange={function (isOpen) {
            if (!isOpen)
                handleClose();
        }}>
      <react_1.ModalOverlay />
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" action={path_1.path.to.newEmployee} validator={users_1.createEmployeeValidator} defaultValues={{
            locationId: (_e = defaults === null || defaults === void 0 ? void 0 : defaults.locationId) !== null && _e !== void 0 ? _e : undefined
        }} fetcher={formFetcher} className="flex flex-col h-full">
          {type === "modal" ? <Form_1.Hidden name="type" value="modal"/> : null}
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              <macro_1.Trans>Create an account</macro_1.Trans>
            </react_1.ModalTitle>
          </react_1.ModalHeader>

          <react_1.ModalBody>
            <react_1.VStack spacing={4}>
              <Form_1.Input name="email" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Email"], ["Email"])))}/>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <Form_1.Input name="firstName" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["First Name"], ["First Name"])))}/>
                <Form_1.Input name="lastName" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Last Name"], ["Last Name"])))}/>
              </div>
              <Form_1.SequenceOrCustomId name="number" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["ID Number"], ["ID Number"])))} table="user" isOptional/>
              <Form_1.Select name="employeeType" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Employee Type"], ["Employee Type"])))} options={employeeTypeOptions} placeholder={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Select Employee Type"], ["Select Employee Type"])))}/>
              <Form_1.Location name="locationId" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Location"], ["Location"])))}/>
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.HStack>
              <Form_1.Submit isLoading={formFetcher.state !== "idle"}>
                <macro_1.Trans>Invite</macro_1.Trans>
              </Form_1.Submit>
              {type === "modal" ? (<react_1.Button size="md" variant="solid" onClick={handleClose}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>) : null}
            </react_1.HStack>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
};
exports.default = CreateEmployeeModal;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
