"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var CustomerAvatar_1 = require("~/components/CustomerAvatar");
var FileDropzone_1 = require("~/components/FileDropzone");
var Form_1 = require("~/components/Form");
var Selectors_1 = require("~/components/Selectors");
var SupplierAvatar_1 = require("~/components/SupplierAvatar");
var hooks_1 = require("~/hooks");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var upload_1 = require("~/utils/upload");
var account_models_1 = require("../../account.models");
var UserAttributesForm = function (_a) {
    var attributeCategory = _a.attributeCategory;
    var personId = (0, react_router_1.useParams)().personId;
    var permissions = (0, hooks_1.usePermissions)();
    var user = (0, hooks_1.useUser)();
    var updateFetcher = (0, react_router_1.useFetcher)();
    var _b = (0, react_2.useState)({}), optimisticUpdates = _b[0], setOptimisticUpdates = _b[1];
    var isAuthorized = !personId;
    if (!isAuthorized && !permissions.can("update", "resources"))
        throw new Error("Unauthorized");
    var userId = isAuthorized ? user.id : personId;
    if (!attributeCategory ||
        !attributeCategory.userAttribute ||
        !Array.isArray(attributeCategory.userAttribute) ||
        attributeCategory.userAttribute.length === 0)
        return null;
    return (<div className="w-full">
      <react_1.VStack spacing={4}>
        {attributeCategory.userAttribute.map(function (attribute) {
            var genericProps = getGenericProps(
            // @ts-ignore
            attribute, optimisticUpdates[attribute.id]);
            return (<GenericAttributeRow key={attribute.id} attribute={attribute} isAuthorized={isAuthorized} setOptimisticUpdate={function (value) {
                    return setOptimisticUpdates(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[attribute.id] = value, _a)));
                    });
                }} 
            // @ts-ignore
            updateFetcher={updateFetcher} userId={userId} {...genericProps}/>);
        })}
      </react_1.VStack>
    </div>);
};
var GenericAttributeRow = function (props) {
    var editing = (0, react_1.useDisclosure)();
    var locale = (0, i18n_1.useLocale)().locale;
    var onSubmit = function (value) {
        props.setOptimisticUpdate(value);
        editing.onClose();
    };
    return (<div key={props.attribute.id} className="w-full">
      {editing.isOpen
            ? TypedForm(__assign(__assign({}, props), { onSubmit: onSubmit, onClose: editing.onClose }))
            : TypedDisplay(__assign(__assign({}, props), { locale: locale, onOpen: editing.onOpen }))}
    </div>);
};
function TypedForm(props) {
    var _a, _b;
    var attribute = props.attribute, type = props.type, value = props.value, updateFetcher = props.updateFetcher, userAttributeId = props.userAttributeId, userAttributeValueId = props.userAttributeValueId, userId = props.userId, onSubmit = props.onSubmit, onClose = props.onClose;
    switch (type) {
        case shared_1.DataType.Boolean:
            return (<form_1.ValidatedForm method="post" action={path_1.path.to.userAttribute(userId)} validator={account_models_1.attributeBooleanValidator} defaultValues={{
                    userAttributeId: userAttributeId,
                    userAttributeValueId: userAttributeValueId,
                    value: value === true
                }} fetcher={updateFetcher} onSubmit={function (data) { return onSubmit(data.value); }}>
          <div className="grid grid-cols-[1fr_2fr_1fr] border-t border-border gap-x-2 pt-3 w-full items-center">
            <p className="text-muted-foreground self-center">
              {attribute.name}
            </p>
            <div>
              <Form_1.Hidden name="type" value="boolean"/>
              <Form_1.Hidden name="userAttributeId"/>
              <Form_1.Hidden name="userAttributeValueId"/>
              <div>
                <Form_1.Boolean name="value"/>
              </div>
            </div>
            <react_1.HStack className="justify-end w-full self-center">
              <Form_1.Submit type="submit">
                <macro_1.Trans>Save</macro_1.Trans>
              </Form_1.Submit>
              <react_1.Button variant="ghost" onClick={onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
            </react_1.HStack>
          </div>
        </form_1.ValidatedForm>);
        case shared_1.DataType.Date:
            return (<form_1.ValidatedForm method="post" action={path_1.path.to.userAttribute(userId)} validator={account_models_1.attributeTextValidator} defaultValues={{
                    userAttributeId: userAttributeId,
                    userAttributeValueId: userAttributeValueId,
                    value: value === null || value === void 0 ? void 0 : value.toString()
                }} fetcher={updateFetcher} onSubmit={function (data) { return onSubmit(data.value); }}>
          <div className="grid grid-cols-[1fr_2fr_1fr] border-t border-border gap-x-2 pt-3 w-full items-center">
            <p className="text-muted-foreground self-center">
              {attribute.name}
            </p>
            <div>
              <Form_1.Hidden name="type" value="date"/>
              <Form_1.Hidden name="userAttributeId"/>
              <Form_1.Hidden name="userAttributeValueId"/>
              <Form_1.DatePicker name="value"/>
            </div>
            <react_1.HStack className="justify-end w-full self-center">
              <Form_1.Submit type="submit">Save</Form_1.Submit>
              <react_1.Button variant="ghost" onClick={onClose}>
                Cancel
              </react_1.Button>
            </react_1.HStack>
          </div>
        </form_1.ValidatedForm>);
        case shared_1.DataType.List:
            return (<form_1.ValidatedForm method="post" action={path_1.path.to.userAttribute(userId)} validator={account_models_1.attributeTextValidator} defaultValues={{
                    userAttributeId: userAttributeId,
                    userAttributeValueId: userAttributeValueId,
                    value: value === null || value === void 0 ? void 0 : value.toString()
                }} fetcher={updateFetcher} onSubmit={function (data) { return onSubmit(data.value); }}>
          <div className="grid grid-cols-[1fr_2fr_1fr] border-t border-border gap-x-2 pt-3 w-full items-center">
            <p className="text-muted-foreground self-center">
              {attribute.name}
            </p>
            <div>
              <Form_1.Hidden name="type" value="list"/>
              <Form_1.Hidden name="userAttributeId"/>
              <Form_1.Hidden name="userAttributeValueId"/>
              <Form_1.Select name="value" options={(_b = (_a = attribute.listOptions) === null || _a === void 0 ? void 0 : _a.map(function (option) { return ({
                    label: option,
                    value: option
                }); })) !== null && _b !== void 0 ? _b : []}/>
            </div>
            <react_1.HStack className="justify-end w-full self-center">
              <Form_1.Submit type="submit">Save</Form_1.Submit>
              <react_1.Button variant="ghost" onClick={onClose}>
                Cancel
              </react_1.Button>
            </react_1.HStack>
          </div>
        </form_1.ValidatedForm>);
        case shared_1.DataType.Numeric:
            return (<form_1.ValidatedForm method="post" action={path_1.path.to.userAttribute(userId)} validator={account_models_1.attributeNumericValidator} defaultValues={{
                    userAttributeId: userAttributeId,
                    userAttributeValueId: userAttributeValueId,
                    value: value ? Number(value) : undefined
                }} fetcher={updateFetcher} onSubmit={function (data) { return onSubmit(data.value); }}>
          <div className="grid grid-cols-[1fr_2fr_1fr] border-t border-border gap-x-2 pt-3 w-full items-center">
            <p className="text-muted-foreground self-center">
              {attribute.name}
            </p>
            <div>
              <Form_1.Hidden name="type" value="numeric"/>
              <Form_1.Hidden name="userAttributeId"/>
              <Form_1.Hidden name="userAttributeValueId"/>
              <Form_1.Number name="value"/>
            </div>
            <react_1.HStack className="justify-end w-full self-center">
              <Form_1.Submit type="submit">Save</Form_1.Submit>
              <react_1.Button variant="ghost" onClick={onClose}>
                Cancel
              </react_1.Button>
            </react_1.HStack>
          </div>
        </form_1.ValidatedForm>);
        case shared_1.DataType.Text:
            return (<form_1.ValidatedForm method="post" action={path_1.path.to.userAttribute(userId)} validator={account_models_1.attributeTextValidator} defaultValues={{
                    userAttributeId: userAttributeId,
                    userAttributeValueId: userAttributeValueId,
                    value: value === null || value === void 0 ? void 0 : value.toString()
                }} fetcher={updateFetcher} onSubmit={function (data) { return onSubmit(data.value); }}>
          <div className="grid grid-cols-[1fr_2fr_1fr] border-t border-border gap-x-2 pt-3 w-full items-center">
            <p className="text-muted-foreground self-center">
              {attribute.name}
            </p>
            <div>
              <Form_1.Hidden name="type" value="text"/>
              <Form_1.Hidden name="userAttributeId"/>
              <Form_1.Hidden name="userAttributeValueId"/>
              <Form_1.Input name="value"/>
            </div>
            <react_1.HStack className="justify-end w-full self-center">
              <Form_1.Submit type="submit">Save</Form_1.Submit>
              <react_1.Button variant="ghost" onClick={onClose}>
                Cancel
              </react_1.Button>
            </react_1.HStack>
          </div>
        </form_1.ValidatedForm>);
        case shared_1.DataType.User:
            return (<form_1.ValidatedForm method="post" action={path_1.path.to.userAttribute(userId)} validator={account_models_1.attributeUserValidator} defaultValues={{
                    userAttributeId: userAttributeId,
                    userAttributeValueId: userAttributeValueId,
                    value: value === null || value === void 0 ? void 0 : value.toString()
                }} fetcher={updateFetcher} onSubmit={function (data) { return onSubmit(data.value); }}>
          <div className="grid grid-cols-[1fr_2fr_1fr] border-t border-border gap-x-2 pt-3 w-full items-center">
            <p className="text-muted-foreground self-center">
              {attribute.name}
            </p>
            <div>
              <Form_1.Hidden name="type" value="user"/>
              <Form_1.Hidden name="userAttributeId"/>
              <Form_1.Hidden name="userAttributeValueId"/>
              <Form_1.Employee name="value"/>
            </div>
            <react_1.HStack className="justify-end w-full self-center">
              <Form_1.Submit type="submit">Save</Form_1.Submit>
              <react_1.Button variant="ghost" onClick={onClose}>
                Cancel
              </react_1.Button>
            </react_1.HStack>
          </div>
        </form_1.ValidatedForm>);
        case shared_1.DataType.Customer:
            return (<form_1.ValidatedForm method="post" action={path_1.path.to.userAttribute(userId)} validator={account_models_1.attributeCustomerValidator} defaultValues={{
                    userAttributeId: userAttributeId,
                    userAttributeValueId: userAttributeValueId,
                    value: value === null || value === void 0 ? void 0 : value.toString()
                }} fetcher={updateFetcher} onSubmit={function (data) { return onSubmit(data.value); }}>
          <div className="grid grid-cols-[1fr_2fr_1fr] border-t border-border gap-x-2 pt-3 w-full items-center">
            <p className="text-muted-foreground self-center">
              {attribute.name}
            </p>
            <div>
              <Form_1.Hidden name="type" value="customer"/>
              <Form_1.Hidden name="userAttributeId"/>
              <Form_1.Hidden name="userAttributeValueId"/>
              <Form_1.Customer label="" name="value"/>
            </div>
            <react_1.HStack className="justify-end w-full self-center">
              <Form_1.Submit type="submit">Save</Form_1.Submit>
              <react_1.Button variant="ghost" onClick={onClose}>
                Cancel
              </react_1.Button>
            </react_1.HStack>
          </div>
        </form_1.ValidatedForm>);
        case shared_1.DataType.Supplier:
            return (<form_1.ValidatedForm method="post" action={path_1.path.to.userAttribute(userId)} validator={account_models_1.attributeSupplierValidator} defaultValues={{
                    userAttributeId: userAttributeId,
                    userAttributeValueId: userAttributeValueId,
                    value: value === null || value === void 0 ? void 0 : value.toString()
                }} fetcher={updateFetcher} onSubmit={function (data) { return onSubmit(data.value); }}>
          <div className="grid grid-cols-[1fr_2fr_1fr] border-t border-border gap-x-2 pt-3 w-full items-center">
            <p className="text-muted-foreground self-center">
              {attribute.name}
            </p>
            <div>
              <Form_1.Hidden name="type" value="supplier"/>
              <Form_1.Hidden name="userAttributeId"/>
              <Form_1.Hidden name="userAttributeValueId"/>
              <Form_1.Supplier label="" name="value"/>
            </div>
            <react_1.HStack className="justify-end w-full self-center">
              <Form_1.Submit type="submit">Save</Form_1.Submit>
              <react_1.Button variant="ghost" onClick={onClose}>
                Cancel
              </react_1.Button>
            </react_1.HStack>
          </div>
        </form_1.ValidatedForm>);
        case shared_1.DataType.File:
            return (<FileAttributeForm attribute={attribute} userAttributeId={userAttributeId} userAttributeValueId={userAttributeValueId} value={value} updateFetcher={updateFetcher} userId={userId} onSubmit={onSubmit} onClose={onClose}/>);
        default:
            return (<div className="text-destructive bg-destructive-foreground p-4 w-full">
          Unknown data type
        </div>);
    }
}
function TypedDisplay(props) {
    var _a, _b, _c, _d, _e, _f;
    var attribute = props.attribute, displayValue = props.displayValue, isAuthorized = props.isAuthorized, locale = props.locale, type = props.type, userAttributeValueId = props.userAttributeValueId, value = props.value, onOpen = props.onOpen, setOptimisticUpdate = props.setOptimisticUpdate;
    switch (type) {
        case shared_1.DataType.Boolean:
            return (<div className="grid grid-cols-[1fr_2fr_1fr] border-t border-border gap-x-2 pt-3 w-full items-center">
          <p className="text-muted-foreground items-center">{attribute.name}</p>
          {displayValue === "N/A" ? (<p className="self-center">{displayValue}</p>) : (<div>
              <react_1.Switch disabled checked={displayValue === true}/>
            </div>)}
          <react_1.HStack className="justify-end w-full self-center">
            <react_1.Button isDisabled={isAuthorized && !attribute.canSelfManage} variant="ghost" onClick={onOpen}>
              Update
            </react_1.Button>
          </react_1.HStack>
        </div>);
        case shared_1.DataType.Date:
        case shared_1.DataType.List:
        case shared_1.DataType.Text:
            return (<div className="grid grid-cols-[1fr_2fr_1fr] border-t border-border gap-x-2 pt-3 w-full items-center">
          <p className="text-muted-foreground self-center">{attribute.name}</p>
          <p className="self-center">{displayValue}</p>
          <UpdateRemoveButtons canRemove={!isAuthorized ||
                    (attribute.canSelfManage === true &&
                        !!value &&
                        !!userAttributeValueId)} canUpdate={!isAuthorized || ((_a = attribute.canSelfManage) !== null && _a !== void 0 ? _a : false)} {...props} onSubmit={setOptimisticUpdate}/>
        </div>);
        case shared_1.DataType.Numeric:
            return (<div className="grid grid-cols-[1fr_2fr_1fr] border-t border-border gap-x-2 pt-3 w-full items-center">
          <p className="text-muted-foreground self-center">{attribute.name}</p>
          <p className="self-center">{displayValue.toLocaleString(locale)}</p>
          <UpdateRemoveButtons canRemove={!isAuthorized || (attribute.canSelfManage === true && !!value)} canUpdate={!isAuthorized || ((_b = attribute.canSelfManage) !== null && _b !== void 0 ? _b : false)} {...props} onSubmit={setOptimisticUpdate}/>
        </div>);
        case shared_1.DataType.User:
            return (<div className="grid grid-cols-[1fr_2fr_1fr] border-t border-border gap-x-2 pt-3 w-full items-center">
          <p className="text-muted-foreground self-center">{attribute.name}</p>
          {value ? (<Selectors_1.UserSelect disabled value={value.toString()}/>) : (<p className="self-center">{displayValue}</p>)}

          <UpdateRemoveButtons canRemove={!isAuthorized || (attribute.canSelfManage === true && !!value)} canUpdate={!isAuthorized || ((_c = attribute.canSelfManage) !== null && _c !== void 0 ? _c : false)} {...props} onSubmit={setOptimisticUpdate}/>
        </div>);
        case shared_1.DataType.Customer:
            return (<div className="grid grid-cols-[1fr_2fr_1fr] border-t border-border gap-x-2 pt-3 w-full items-center">
          <p className="text-muted-foreground self-center">{attribute.name}</p>
          {value ? (<CustomerAvatar_1.default customerId={value.toString()}/>) : (<p className="self-center">{displayValue}</p>)}

          <UpdateRemoveButtons canRemove={!isAuthorized || (attribute.canSelfManage === true && !!value)} canUpdate={!isAuthorized || ((_d = attribute.canSelfManage) !== null && _d !== void 0 ? _d : false)} {...props} onSubmit={setOptimisticUpdate}/>
        </div>);
        case shared_1.DataType.Supplier:
            return (<div className="grid grid-cols-[1fr_2fr_1fr] border-t border-border gap-x-2 pt-3 w-full items-center">
          <p className="text-muted-foreground self-center">{attribute.name}</p>
          {value ? (<SupplierAvatar_1.default supplierId={value.toString()}/>) : (<p className="self-center">{displayValue}</p>)}

          <UpdateRemoveButtons canRemove={!isAuthorized || (attribute.canSelfManage === true && !!value)} canUpdate={!isAuthorized || ((_e = attribute.canSelfManage) !== null && _e !== void 0 ? _e : false)} {...props} onSubmit={setOptimisticUpdate}/>
        </div>);
        case shared_1.DataType.File:
            return (<div className="grid grid-cols-[1fr_2fr_1fr] border-t border-border gap-x-2 pt-3 w-full items-center">
          <p className="text-muted-foreground self-center">{attribute.name}</p>
          {value ? (<a href={(0, path_1.getPrivateUrl)(value.toString())} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
              <lu_1.LuPaperclip className="size-4"/>
              <span className="truncate max-w-[200px]">
                {value.toString().split("/").pop()}
              </span>
            </a>) : (<p className="self-center">{displayValue}</p>)}

          <UpdateRemoveButtons canRemove={!isAuthorized || (attribute.canSelfManage === true && !!value)} canUpdate={!isAuthorized || ((_f = attribute.canSelfManage) !== null && _f !== void 0 ? _f : false)} {...props} onSubmit={setOptimisticUpdate}/>
        </div>);
    }
}
function getGenericProps(attribute, optimisticUpdate) {
    var _a;
    if (!("attributeDataType" in attribute) ||
        !attribute.attributeDataType ||
        Array.isArray(attribute.attributeDataType))
        throw new Error("Missing attributeDataType");
    // @ts-expect-error
    var type = attribute.attributeDataType.id;
    // @ts-expect-error
    var userAttributeId = attribute.id;
    var userAttributeValueId = undefined;
    var displayValue = "N/A";
    var value = null;
    if (
    // @ts-expect-error
    attribute.userAttributeValue &&
        // @ts-expect-error
        Array.isArray(attribute.userAttributeValue) &&
        // @ts-expect-error
        attribute.userAttributeValue.length === 1) {
        // @ts-expect-error
        var userAttributeValue = attribute.userAttributeValue[0];
        userAttributeValueId = userAttributeValue.id;
        switch (type) {
            case shared_1.DataType.Boolean:
                value = userAttributeValue.valueBoolean;
                displayValue = (_a = userAttributeValue.valueBoolean) !== null && _a !== void 0 ? _a : false;
                break;
            case shared_1.DataType.Date:
                value = userAttributeValue.valueDate;
                if (userAttributeValue.valueDate)
                    displayValue = (0, date_1.parseDate)(userAttributeValue.valueDate).toString();
                break;
            case shared_1.DataType.List:
                value = userAttributeValue.valueText;
                if (userAttributeValue.valueText)
                    displayValue = userAttributeValue.valueText;
                break;
            case shared_1.DataType.Numeric:
                value = userAttributeValue.valueNumeric;
                if (userAttributeValue.valueNumeric)
                    displayValue = Number(userAttributeValue.valueNumeric);
                break;
            case shared_1.DataType.Text:
                value = userAttributeValue.valueText;
                if (userAttributeValue.valueText)
                    displayValue = userAttributeValue.valueText;
                break;
            case shared_1.DataType.User:
                value = userAttributeValue.valueUser;
                if (userAttributeValue.valueUser)
                    displayValue = userAttributeValue.valueUser;
                break;
            case shared_1.DataType.Customer:
                value = userAttributeValue.valueText;
                if (userAttributeValue.valueText)
                    displayValue = userAttributeValue.valueText;
                break;
            case shared_1.DataType.Supplier:
                value = userAttributeValue.valueText;
                if (userAttributeValue.valueText)
                    displayValue = userAttributeValue.valueText;
                break;
            case shared_1.DataType.File:
                value = userAttributeValue.valueFile;
                if (userAttributeValue.valueFile)
                    displayValue = userAttributeValue.valueFile;
        }
    }
    if (optimisticUpdate !== undefined) {
        displayValue = optimisticUpdate;
        value = optimisticUpdate;
    }
    return {
        displayValue: displayValue,
        type: type,
        userAttributeId: userAttributeId,
        userAttributeValueId: userAttributeValueId,
        value: value
    };
}
function FileAttributeForm(_a) {
    var _this = this;
    var _b, _c;
    var attribute = _a.attribute, userAttributeId = _a.userAttributeId, userAttributeValueId = _a.userAttributeValueId, value = _a.value, updateFetcher = _a.updateFetcher, userId = _a.userId, onSubmit = _a.onSubmit, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var company = (0, hooks_1.useUser)().company;
    var _d = (0, react_2.useState)(null), file = _d[0], setFile = _d[1];
    var _e = (0, react_2.useState)((_b = value === null || value === void 0 ? void 0 : value.toString()) !== null && _b !== void 0 ? _b : null), filePath = _e[0], setFilePath = _e[1];
    var onDrop = function (acceptedFiles) { return __awaiter(_this, void 0, void 0, function () {
        var fileUpload, fileName, uploadToast, upload;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!acceptedFiles[0] || !carbon)
                        return [2 /*return*/];
                    fileUpload = acceptedFiles[0];
                    setFile(fileUpload);
                    fileName = "".concat(company.id, "/person/").concat(userId, "/").concat(fileUpload.name);
                    uploadToast = (0, upload_1.createUploadToast)({
                        id: "user-attribute-".concat(fileName, "-").concat(fileUpload.name),
                        label: function (pct) { return "".concat(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Uploading ", ""], ["Uploading ", ""])), fileUpload.name), " (").concat(pct, "%)"); }
                    });
                    return [4 /*yield*/, (0, upload_1.uploadToStorageWithProgress)(carbon, {
                            bucket: "private",
                            path: fileName,
                            file: fileUpload,
                            upsert: true,
                            cacheControl: "".concat(12 * 60 * 60),
                            onProgress: uploadToast.onProgress
                        })];
                case 1:
                    upload = _b.sent();
                    if (upload.error) {
                        uploadToast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to upload file: ", ""], ["Failed to upload file: ", ""])), fileUpload.name));
                    }
                    else if ((_a = upload.data) === null || _a === void 0 ? void 0 : _a.path) {
                        uploadToast.dismiss();
                        setFilePath(upload.data.path);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    return (<form_1.ValidatedForm method="post" action={path_1.path.to.userAttribute(userId)} validator={account_models_1.attributeFileValidator} defaultValues={{
            userAttributeId: userAttributeId,
            userAttributeValueId: userAttributeValueId,
            value: filePath !== null && filePath !== void 0 ? filePath : ""
        }} fetcher={updateFetcher} onSubmit={function () {
            if (filePath)
                onSubmit(filePath);
        }}>
      <div className="grid grid-cols-[1fr_2fr_1fr] border-t border-border gap-x-2 pt-3 w-full items-center">
        <p className="text-muted-foreground self-center">{attribute.name}</p>
        <div>
          <Form_1.Hidden name="type" value="file"/>
          <Form_1.Hidden name="userAttributeId"/>
          <Form_1.Hidden name="userAttributeValueId"/>
          <Form_1.Hidden name="value" value={filePath !== null && filePath !== void 0 ? filePath : ""}/>
          {file || filePath ? (<div className="flex flex-col gap-2 items-center justify-center py-4 w-full">
              <lu_1.LuFile className="size-8 text-muted-foreground"/>
              <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                {(_c = file === null || file === void 0 ? void 0 : file.name) !== null && _c !== void 0 ? _c : filePath === null || filePath === void 0 ? void 0 : filePath.split("/").pop()}
              </p>
              <react_1.Button variant="secondary" size="sm" onClick={function () {
                setFile(null);
                setFilePath(null);
            }}>
                Remove
              </react_1.Button>
            </div>) : (<FileDropzone_1.default onDrop={onDrop}/>)}
        </div>
        <react_1.HStack className="justify-end w-full self-center">
          <Form_1.Submit type="submit" isDisabled={!filePath}>
            <macro_1.Trans>Save</macro_1.Trans>
          </Form_1.Submit>
          <react_1.Button variant="ghost" onClick={onClose}>
            <macro_1.Trans>Cancel</macro_1.Trans>
          </react_1.Button>
        </react_1.HStack>
      </div>
    </form_1.ValidatedForm>);
}
function UpdateRemoveButtons(_a) {
    var canRemove = _a.canRemove, canUpdate = _a.canUpdate, updateFetcher = _a.updateFetcher, userId = _a.userId, userAttributeId = _a.userAttributeId, userAttributeValueId = _a.userAttributeValueId, onOpen = _a.onOpen, onSubmit = _a.onSubmit;
    return (<react_1.HStack className="justify-end w-full self-center">
      {userAttributeValueId && (<form_1.ValidatedForm method="post" action={path_1.path.to.deleteUserAttribute(userId)} validator={account_models_1.deleteUserAttributeValueValidator} defaultValues={{
                userAttributeId: userAttributeId,
                userAttributeValueId: userAttributeValueId
            }} fetcher={updateFetcher} onSubmit={function () { return onSubmit(undefined); }}>
          <Form_1.Hidden name="userAttributeId"/>
          <Form_1.Hidden name="userAttributeValueId"/>
          <react_1.Button isDisabled={!canRemove} variant="ghost" type="submit">
            <macro_1.Trans>Remove</macro_1.Trans>
          </react_1.Button>
        </form_1.ValidatedForm>)}

      <react_1.Button isDisabled={!canUpdate} variant="ghost" onClick={onOpen}>
        Update
      </react_1.Button>
    </react_1.HStack>);
}
exports.default = UserAttributesForm;
var templateObject_1, templateObject_2;
