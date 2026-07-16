"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConfigurableItems = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var ConsumableForm_1 = require("~/modules/items/ui/Consumables/ConsumableForm");
var MaterialForm_1 = require("~/modules/items/ui/Materials/MaterialForm");
var PartForm_1 = require("~/modules/items/ui/Parts/PartForm");
var StyleForm_1 = require("~/modules/items/ui/Styles/StyleForm");
var ToolForm_1 = require("~/modules/items/ui/Tools/ToolForm");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var Icons_1 = require("../Icons");
var ItemPreview = function (value, options) {
    var item = options.find(function (o) { return o.value === value; });
    if (!item)
        return null;
    return <span>{item.label}</span>;
};
var useTranslatedItemType = function () {
    var t = (0, macro_1.useLingui)().t;
    return function (type) {
        switch (type) {
            case "Item":
                return t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Item"], ["Item"])));
            case "Style":
                return t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Style"], ["Style"])));
            case "Part":
                return t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Part"], ["Part"])));
            case "Material":
                return t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Material"], ["Material"])));
            case "Tool":
                return t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Tool"], ["Tool"])));
            case "Consumable":
                return t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Consumable"], ["Consumable"])));
            default:
                return type;
        }
    };
};
var Item = function (_a) {
    var _b, _c, _d;
    var name = _a.name, label = _a.label, helperText = _a.helperText, _e = _a.isConfigured, isConfigured = _e === void 0 ? false : _e, isOptional = _a.isOptional, _f = _a.type, type = _f === void 0 ? "Part" : _f, _g = _a.typeFieldName, typeFieldName = _g === void 0 ? "itemType" : _g, validItemTypes = _a.validItemTypes, onConfigure = _a.onConfigure, onTypeChange = _a.onTypeChange, _h = _a.isReadOnly, isReadOnly = _h === void 0 ? false : _h, props = __rest(_a, ["name", "label", "helperText", "isConfigured", "isOptional", "type", "typeFieldName", "validItemTypes", "onConfigure", "onTypeChange", "isReadOnly"]);
    var t = (0, macro_1.useLingui)().t;
    var translateItemType = useTranslatedItemType();
    var items = (0, stores_1.useItems)()[0];
    var options = (0, react_2.useMemo)(function () {
        var results = items
            .filter(function (item) {
            // Filter by type
            // @ts-expect-error
            if (validItemTypes && !validItemTypes.includes(item.type))
                return false;
            if (type !== "Item" && type !== item.type)
                return false;
            // Filter by active status
            // Filter by active status
            if (!props.includeInactive && !item.active)
                return false;
            // Filter by replenishment system
            if (props.replenishmentSystem) {
                var systemMatches = item.replenishmentSystem === props.replenishmentSystem ||
                    item.replenishmentSystem === "Buy and Make" ||
                    props.replenishmentSystem === item.replenishmentSystem;
                if (!systemMatches)
                    return false;
            }
            return true;
        })
            .map(function (item) {
            var _a;
            var scopedQuantity = props.locationId
                ? (_a = item.quantityByLocation) === null || _a === void 0 ? void 0 : _a[props.locationId]
                : item.quantityOnHand;
            return {
                value: item.id,
                label: item.readableIdWithRevision,
                helper: item.name,
                helperRight: scopedQuantity !== undefined
                    ? "".concat(scopedQuantity, " ").concat(item.unitOfMeasureCode)
                    : undefined
            };
        });
        if (props.whitelist) {
            results = results.filter(function (item) { var _a; return (_a = props.whitelist) === null || _a === void 0 ? void 0 : _a.includes(item.value); });
        }
        if (props.blacklist) {
            return results.filter(function (item) { var _a; return !((_a = props.blacklist) === null || _a === void 0 ? void 0 : _a.includes(item.value)); });
        }
        return results;
    }, [
        items,
        props === null || props === void 0 ? void 0 : props.includeInactive,
        props.blacklist,
        props.locationId,
        props.replenishmentSystem,
        props.whitelist,
        type,
        validItemTypes
    ]);
    var selectTypeModal = (0, react_1.useDisclosure)();
    var newItemsModal = (0, react_1.useDisclosure)();
    var _j = (0, react_2.useState)(""), created = _j[0], setCreated = _j[1];
    var triggerRef = (0, react_2.useRef)(null);
    var _k = (0, form_1.useField)(name), getInputProps = _k.getInputProps, error = _k.error, fieldIsOptional = _k.isOptional;
    var _l = (0, form_1.useControlField)(name), value = _l[0], setValue = _l[1];
    var resolvedIsOptional = (_b = isOptional !== null && isOptional !== void 0 ? isOptional : fieldIsOptional) !== null && _b !== void 0 ? _b : false;
    (0, react_2.useEffect)(function () {
        if (props.value !== null && props.value !== undefined)
            setValue(props.value);
    }, [props.value, setValue]);
    var onChange = function (value) {
        var _a, _b, _c;
        if (value) {
            (_a = props === null || props === void 0 ? void 0 : props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, (_b = options.find(function (o) { return o.value === value; })) !== null && _b !== void 0 ? _b : null);
        }
        else {
            (_c = props === null || props === void 0 ? void 0 : props.onChange) === null || _c === void 0 ? void 0 : _c.call(props, null);
        }
    };
    var canSwitchItemType = typeof onTypeChange === "function";
    var submitRef = (0, react_2.useRef)(null);
    var handleCreateClose = function () {
        var _a;
        setCreated("");
        newItemsModal.onClose();
        (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
    };
    return (<>
      <react_1.FormControl isInvalid={!!error} className="w-full">
        {type && (<react_1.FormLabel htmlFor={name} isConfigured={isConfigured} isOptional={resolvedIsOptional} onConfigure={onConfigure}>
            {translateItemType(type)}
          </react_1.FormLabel>)}
        <input {...getInputProps({
        id: name
    })} type="hidden" name={name} id={name} value={value}/>
        <input type="hidden" name={typeFieldName} id={typeFieldName} value={type}/>
        <div className="flex flex-grow items-start min-w-0 relative">
          <react_1.CreatableCombobox className={(0, react_1.cn)("flex-grow min-w-0")} ref={triggerRef} options={options} {...props} inline={props.inline ? ItemPreview : undefined} value={value === null || value === void 0 ? void 0 : value.replace(/"/g, '\\"')} onChange={function (newValue) {
            var _a, _b;
            setValue((_a = newValue === null || newValue === void 0 ? void 0 : newValue.replace(/"/g, '\\"')) !== null && _a !== void 0 ? _a : "");
            onChange((_b = newValue === null || newValue === void 0 ? void 0 : newValue.replace(/"/g, '\\"')) !== null && _b !== void 0 ? _b : "");
        }} label={label === "Item"
            ? t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Item"], ["Item"]))) : label === "Style"
            ? t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Style"], ["Style"]))) : label === "Part"
            ? t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Part"], ["Part"]))) : label === "Material"
            ? t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Material"], ["Material"]))) : label === "Tool"
            ? t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Tool"], ["Tool"]))) : label === "Consumable"
            ? t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Consumable"], ["Consumable"]))) : undefined} itemHeight={44} onCreateOption={function (option) {
            if (type === "Item") {
                selectTypeModal.onOpen();
                setCreated(option);
            }
            else {
                newItemsModal.onOpen();
                setCreated(option);
            }
        }}/>
          {canSwitchItemType && !props.inline && (<react_1.DropdownMenu>
              <react_1.Tooltip>
                <react_1.TooltipTrigger>
                  <react_1.DropdownMenuTrigger asChild>
                    <react_1.IconButton type="button" aria-label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Change Type"], ["Change Type"])))} className={(0, react_1.cn)("absolute right-0 top-0 bg-card dark:bg-card flex-shrink-0 h-10 w-10 px-3 rounded-l-none before:rounded-l-none border -ml-px shadow-none hover:shadow-button-base")} variant="secondary" size={props.inline ? "sm" : "md"} icon={type === "Item" ? (<lu_1.LuFilter className="size-3"/>) : (<Icons_1.MethodItemTypeIcon type={type}/>)}/>
                  </react_1.DropdownMenuTrigger>
                </react_1.TooltipTrigger>
                <react_1.TooltipContent>
                  <macro_1.Trans>
                    Change the item type (e.g. Part, Material, Tool, etc.)
                  </macro_1.Trans>
                </react_1.TooltipContent>
              </react_1.Tooltip>
              <react_1.DropdownMenuContent>
                <react_1.DropdownMenuRadioGroup value={type} 
        // @ts-expect-error
        onValueChange={onTypeChange}>
                  <react_1.DropdownMenuRadioItem value="Item" className="flex items-center gap-2">
                    <lu_1.LuFilter className="h-4 w-4"/>
                    <span>
                      <macro_1.Trans>All Items</macro_1.Trans>
                    </span>
                  </react_1.DropdownMenuRadioItem>
                  {Object.values(shared_1.methodItemType)
                .filter(function (itemType) {
                return validItemTypes === undefined ||
                    (Array.isArray(validItemTypes) &&
                        validItemTypes.includes(itemType));
            })
                .map(function (itemType) { return (<react_1.DropdownMenuRadioItem key={itemType} value={itemType} className="flex items-center gap-2">
                        <Icons_1.MethodItemTypeIcon type={itemType}/>
                        <span>{translateItemType(itemType)}</span>
                      </react_1.DropdownMenuRadioItem>); })}
                </react_1.DropdownMenuRadioGroup>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>)}
        </div>
        {error ? (<react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>) : (helperText && <react_1.FormHelperText>{helperText}</react_1.FormHelperText>)}
      </react_1.FormControl>
      {selectTypeModal.isOpen && (<react_1.Modal open onOpenChange={function (open) {
                if (!open) {
                    selectTypeModal.onClose();
                }
            }}>
          <react_1.ModalContent>
            <react_1.ModalHeader>
              <react_1.ModalTitle>
                <macro_1.Trans>Select Item Type</macro_1.Trans>
              </react_1.ModalTitle>
            </react_1.ModalHeader>
            <react_1.ModalBody>
              <div className="grid grid-cols-2 gap-4">
                {Object.values(shared_1.methodItemType).map(function (itemType) { return (<react_1.Button key={itemType} leftIcon={<Icons_1.MethodItemTypeIcon type={itemType}/>} className="flex w-full" variant={type === itemType ? "primary" : "secondary"} size="lg" onClick={function () {
                    onTypeChange === null || onTypeChange === void 0 ? void 0 : onTypeChange(itemType);
                    setTimeout(function () {
                        var _a;
                        (_a = submitRef.current) === null || _a === void 0 ? void 0 : _a.focus();
                    }, 0);
                }}>
                    {translateItemType(itemType)}
                  </react_1.Button>); })}
              </div>
            </react_1.ModalBody>
            <react_1.ModalFooter>
              <react_1.Button variant="secondary" onClick={function () {
                selectTypeModal.onClose();
            }}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <react_1.Button ref={submitRef} isDisabled={type === "Item"} onClick={function () {
                selectTypeModal.onClose();
                newItemsModal.onOpen();
            }}>
                <macro_1.Trans>Create</macro_1.Trans>
              </react_1.Button>
            </react_1.ModalFooter>
          </react_1.ModalContent>
        </react_1.Modal>)}
      {type === "Part" && newItemsModal.isOpen && (<PartForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newItemsModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                id: "",
                revision: "0",
                name: created,
                description: "",
                itemTrackingType: "Inventory",
                replenishmentSystem: (_c = props === null || props === void 0 ? void 0 : props.replenishmentSystem) !== null && _c !== void 0 ? _c : "Make",
                unitOfMeasureCode: "EA",
                defaultMethodType: (props === null || props === void 0 ? void 0 : props.replenishmentSystem) === "Buy"
                    ? "Pull from Inventory"
                    : "Make to Order",
                unitCost: 0,
                lotSize: 0,
                shelfLifeCalculateFromBom: false,
                tags: []
            }}/>)}
      {type === "Style" && newItemsModal.isOpen && (<StyleForm_1.default type="modal" onClose={handleCreateClose} initialValues={{
                id: "",
                revision: "0",
                name: created,
                description: "",
                itemTrackingType: "Inventory",
                replenishmentSystem: "Make",
                unitOfMeasureCode: "EA",
                defaultMethodType: "Make to Order",
                unitCost: 0,
                lotSize: 0,
                shelfLifeCalculateFromBom: false,
                tags: []
            }}/>)}
      {type === "Consumable" && newItemsModal.isOpen && (<ConsumableForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newItemsModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                id: "",
                name: created,
                description: "",
                itemTrackingType: "Non-Inventory",
                unitOfMeasureCode: "EA",
                replenishmentSystem: "Buy",
                defaultMethodType: "Pull from Inventory",
                unitCost: 0,
                shelfLifeCalculateFromBom: false,
                tags: []
            }}/>)}
      {type === "Material" && newItemsModal.isOpen && (<MaterialForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newItemsModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                id: "",
                name: created,
                description: "",
                materialFormId: "",
                materialSubstanceId: "",
                itemTrackingType: "Inventory",
                unitOfMeasureCode: "EA",
                replenishmentSystem: "Buy",
                defaultMethodType: "Pull from Inventory",
                unitCost: 0,
                shelfLifeCalculateFromBom: false,
                tags: []
            }}/>)}
      {/* TODO: Add service */}
      {type === "Tool" && newItemsModal.isOpen && (<ToolForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newItemsModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                id: "",
                revision: "0",
                name: created,
                description: "",
                itemTrackingType: "Inventory",
                unitOfMeasureCode: "EA",
                replenishmentSystem: (_d = props === null || props === void 0 ? void 0 : props.replenishmentSystem) !== null && _d !== void 0 ? _d : "Buy",
                defaultMethodType: (props === null || props === void 0 ? void 0 : props.replenishmentSystem) === "Buy"
                    ? "Pull from Inventory"
                    : "Make to Order",
                unitCost: 0,
                shelfLifeCalculateFromBom: false,
                tags: []
            }}/>)}
    </>);
};
Item.displayName = "Item";
exports.default = Item;
var useConfigurableItems = function () {
    var _a;
    var configurableItemsLoader = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        configurableItemsLoader.load(path_1.path.to.api.itemConfigurable);
    });
    var configurableItemIds = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_b = (_a = configurableItemsLoader.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : []).map(function (c) { return c.itemId; });
    }, [(_a = configurableItemsLoader.data) === null || _a === void 0 ? void 0 : _a.data]);
    return configurableItemIds;
};
exports.useConfigurableItems = useConfigurableItems;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13;
