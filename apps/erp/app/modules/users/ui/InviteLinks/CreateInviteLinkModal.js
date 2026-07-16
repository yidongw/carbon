"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var si_1 = require("react-icons/si");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var users_1 = require("~/modules/users");
var path_1 = require("~/utils/path");
var METHOD_META = {
    wechat: {
        label: "WeChat",
        icon: <si_1.SiWechat className="size-4" style={{ color: "#07C160" }}/>
    },
    phone: { label: "Phone", icon: <lu_1.LuPhone className="size-4"/> },
    email: { label: "Email", icon: <lu_1.LuMail className="size-4"/> },
    google: { label: "Google", icon: <si_1.SiGoogle className="size-4"/> },
    azure: { label: "Outlook", icon: <lu_1.LuMail className="size-4"/> }
};
// Ordered picker: click a method to add it (its order badge appears); click a
// selected method to remove it (remaining ones re-number). The order is what the
// joiner must complete, in sequence. Empty selection = allow any login method.
function LoginMethodsPicker(_a) {
    var available = _a.available;
    var _b = (0, react_2.useState)([]), selected = _b[0], setSelected = _b[1];
    var toggle = function (method) {
        setSelected(function (current) {
            return current.includes(method)
                ? current.filter(function (m) { return m !== method; })
                : __spreadArray(__spreadArray([], current, true), [method], false);
        });
    };
    return (<react_1.VStack spacing={2}>
      <input type="hidden" name="loginMethods" value={selected.join(",")}/>
      <span className="text-sm font-medium">
        <macro_1.Trans>Required login methods</macro_1.Trans>
      </span>
      <p className="text-xs text-muted-foreground">
        <macro_1.Trans>
          Leave empty to allow any login method. Selected methods must all be
          completed, in the order chosen.
        </macro_1.Trans>
      </p>
      <div className="flex flex-col gap-2 w-full">
        {available.map(function (method) {
            var meta = METHOD_META[method];
            if (!meta)
                return null;
            var index = selected.indexOf(method);
            var isSelected = index >= 0;
            return (<button key={method} type="button" onClick={function () { return toggle(method); }} className={"flex items-center justify-between rounded-lg border p-3 text-left transition-colors ".concat(isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted")}>
              <react_1.HStack spacing={2}>
                {meta.icon}
                <span className="text-sm font-medium">{meta.label}</span>
              </react_1.HStack>
              {isSelected && (<span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>)}
            </button>);
        })}
      </div>
    </react_1.VStack>);
}
var CreateInviteLinkModal = function (_a) {
    var _b, _c, _d, _e;
    var _f = _a.availableMethods, availableMethods = _f === void 0 ? [] : _f;
    var t = (0, macro_1.useLingui)().t;
    var defaults = (0, hooks_1.useUser)().defaults;
    var navigate = (0, react_router_1.useNavigate)();
    var employeeTypeFetcher = (0, react_router_1.useFetcher)();
    var _g = (0, react_2.useState)("none"), expirationOption = _g[0], setExpirationOption = _g[1];
    (0, react_1.useMount)(function () {
        employeeTypeFetcher.load(path_1.path.to.api.employeeTypes);
    });
    var employeeTypeOptions = (_d = (_c = (_b = employeeTypeFetcher.data) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.map(function (et) { return ({
        value: et.id,
        label: et.name
    }); })) !== null && _d !== void 0 ? _d : [];
    var getExpirationLabel = function (days) {
        var date = new Date();
        date.setDate(date.getDate() + days);
        var formatted = date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
        return t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", " days (", ")"], ["", " days (", ")"])), days, formatted);
    };
    var expirationOptions = [
        { value: "none", label: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["No expiration"], ["No expiration"]))) },
        { value: "7", label: getExpirationLabel(7) },
        { value: "30", label: getExpirationLabel(30) },
        { value: "60", label: getExpirationLabel(60) },
        { value: "90", label: getExpirationLabel(90) },
        { value: "custom", label: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Custom"], ["Custom"]))) }
    ];
    var calculateExpirationDate = function (days) {
        if (days === "none")
            return undefined;
        if (days === "custom")
            return undefined;
        var date = new Date();
        date.setDate(date.getDate() + parseInt(days));
        return date.toISOString().slice(0, 16);
    };
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open)
                navigate(-1);
        }}>
      <react_1.ModalOverlay />
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" action={path_1.path.to.newInviteLink} validator={users_1.createInviteLinkValidator} defaultValues={{
            locationId: (_e = defaults === null || defaults === void 0 ? void 0 : defaults.locationId) !== null && _e !== void 0 ? _e : undefined
        }}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              <macro_1.Trans>Create Invite Link</macro_1.Trans>
            </react_1.ModalTitle>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <react_1.VStack spacing={4}>
              <Form_1.Input name="label" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Label (optional)"], ["Label (optional)"])))}/>
              <Form_1.Select name="employeeTypeId" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Employee Type"], ["Employee Type"])))} options={employeeTypeOptions} isRequired/>
              <Form_1.Location name="locationId" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Default Location"], ["Default Location"])))}/>
              <Form_1.Select name="expiration" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Expiration"], ["Expiration"])))} options={expirationOptions} value={expirationOption} onChange={function (newValue) {
            if (newValue) {
                setExpirationOption(newValue.value);
            }
        }}/>
              {expirationOption === "custom" && (<Form_1.Input name="expiresAt" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Select date *"], ["Select date *"])))} type="datetime-local"/>)}
              {expirationOption !== "custom" && expirationOption !== "none" && (<Form_1.Input name="expiresAt" type="hidden" value={calculateExpirationDate(expirationOption)}/>)}
              {availableMethods.length > 0 && (<LoginMethodsPicker available={availableMethods}/>)}
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.HStack>
              <Form_1.Submit>
                <macro_1.Trans>Create Link</macro_1.Trans>
              </Form_1.Submit>
            </react_1.HStack>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
};
exports.default = CreateInviteLinkModal;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
