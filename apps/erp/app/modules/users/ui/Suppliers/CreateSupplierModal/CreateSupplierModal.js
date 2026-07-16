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
var CreateSupplierModal = function () {
    var _a, _b, _c, _d, _e, _f;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var formFetcher = (0, react_router_1.useFetcher)();
    var _g = (0, react_2.useState)((_a = params.get("supplier")) !== null && _a !== void 0 ? _a : undefined), supplier = _g[0], setSupplier = _g[1];
    var _h = (0, react_2.useState)(null), contact = _h[0], setContact = _h[1];
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open)
                navigate(path_1.path.to.supplierAccounts);
        }}>
      <react_1.ModalOverlay />
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" action={"".concat(path_1.path.to.newSupplierAccount).concat(params.get("supplier") ? "?supplier=".concat(params.get("supplier")) : "")} validator={users_1.createSupplierAccountValidator} defaultValues={{
            id: (_b = params.get("id")) !== null && _b !== void 0 ? _b : "",
            supplier: (_c = params.get("supplier")) !== null && _c !== void 0 ? _c : ""
        }} fetcher={formFetcher} className="flex flex-col h-full">
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              <macro_1.Trans>Create an account</macro_1.Trans>
            </react_1.ModalTitle>
          </react_1.ModalHeader>

          <react_1.ModalBody>
            <react_1.VStack spacing={4}>
              <Form_1.Supplier name="supplier" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Supplier"], ["Supplier"])))} onChange={function (newValue) {
            return setSupplier(newValue === null || newValue === void 0 ? void 0 : newValue.value);
        }}/>
              <SupplierContact name="id" supplier={supplier} onChange={function (contact) { var _a; return setContact((_a = contact === null || contact === void 0 ? void 0 : contact.contact) !== null && _a !== void 0 ? _a : null); }}/>
              {contact && (<>
                  <react_1.FormControl>
                    <react_1.FormLabel>
                      <macro_1.Trans>Email</macro_1.Trans>
                    </react_1.FormLabel>
                    <react_1.Input isReadOnly value={(_d = contact === null || contact === void 0 ? void 0 : contact.email) !== null && _d !== void 0 ? _d : ""}/>
                  </react_1.FormControl>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <react_1.FormControl>
                      <react_1.FormLabel>
                        <macro_1.Trans>First Name</macro_1.Trans>
                      </react_1.FormLabel>
                      <react_1.Input isReadOnly value={(_e = contact === null || contact === void 0 ? void 0 : contact.firstName) !== null && _e !== void 0 ? _e : ""}/>
                    </react_1.FormControl>
                    <react_1.FormControl>
                      <react_1.FormLabel>
                        <macro_1.Trans>Last Name</macro_1.Trans>
                      </react_1.FormLabel>
                      <react_1.Input isReadOnly value={(_f = contact === null || contact === void 0 ? void 0 : contact.lastName) !== null && _f !== void 0 ? _f : ""}/>
                    </react_1.FormControl>
                  </div>
                </>)}
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.HStack>
              <Form_1.Submit isLoading={formFetcher.state !== "idle"}>
                <macro_1.Trans>Create User</macro_1.Trans>
              </Form_1.Submit>
            </react_1.HStack>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
};
var SupplierContact = function (_a) {
    var _b;
    var name = _a.name, supplier = _a.supplier, onChange = _a.onChange;
    var initialLoad = (0, react_2.useRef)(true);
    var _c = (0, form_1.useField)(name), error = _c.error, defaultValue = _c.defaultValue, isSupplierContactOptional = _c.isOptional;
    var _d = (0, form_1.useControlField)(name), value = _d[0], setValue = _d[1];
    var supplierContactFetcher = (0, react_router_1.useFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (supplier) {
            supplierContactFetcher.load(path_1.path.to.api.supplierContacts(supplier));
        }
        if (initialLoad.current) {
            initialLoad.current = false;
        }
        else {
            setValue(null);
            if (onChange) {
                onChange(null);
            }
        }
    }, [supplier]);
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_a = supplierContactFetcher.data) === null || _a === void 0 ? void 0 : _a.data)
            ? (_b = supplierContactFetcher.data) === null || _b === void 0 ? void 0 : _b.data.map(function (c) {
                var _a, _b, _c, _d;
                return ({
                    value: c.id,
                    label: (_d = (_b = (_a = c.contact) === null || _a === void 0 ? void 0 : _a.fullName) !== null && _b !== void 0 ? _b : (_c = c.contact) === null || _c === void 0 ? void 0 : _c.email) !== null && _d !== void 0 ? _d : "Unknown"
                });
            })
            : [];
    }, [supplierContactFetcher.data]);
    var handleChange = function (newValue) {
        var _a, _b, _c;
        setValue(newValue !== null && newValue !== void 0 ? newValue : "");
        if (onChange && typeof onChange === "function") {
            if (!newValue)
                onChange(null);
            var contact = (_b = (_a = supplierContactFetcher.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.find(function (c) { return c.id === newValue; });
            // @ts-expect-error TS2322 - TODO: fix type
            onChange({ id: newValue, contact: (_c = contact === null || contact === void 0 ? void 0 : contact.contact) !== null && _c !== void 0 ? _c : null });
        }
    };
    // so that we can call onChange on load
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (value && value === defaultValue) {
            handleChange(value);
        }
    }, [value, (_b = supplierContactFetcher.data) === null || _b === void 0 ? void 0 : _b.data]);
    return (<react_1.FormControl isInvalid={!!error}>
      <react_1.FormLabel htmlFor={name} isOptional={isSupplierContactOptional}>
        <macro_1.Trans>Supplier Contact</macro_1.Trans>
      </react_1.FormLabel>
      <input type="hidden" name={name} id={name} value={value !== null && value !== void 0 ? value : ""}/>
      <react_1.Combobox id={name} value={value !== null && value !== void 0 ? value : undefined} options={options} onChange={handleChange} className="w-full"/>
      {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
    </react_1.FormControl>);
};
exports.default = CreateSupplierModal;
var templateObject_1;
