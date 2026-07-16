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
var ConsumableForm_1 = require("~/modules/items/ui/Consumables/ConsumableForm");
var MaterialForm_1 = require("~/modules/items/ui/Materials/MaterialForm");
var PartForm_1 = require("~/modules/items/ui/Parts/PartForm");
var StyleForm_1 = require("~/modules/items/ui/Styles/StyleForm");
var ToolForm_1 = require("~/modules/items/ui/Tools/ToolForm");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var Icons_1 = require("../Icons");
var Items = function (props) {
    var _a;
    var t = (0, macro_1.useLingui)().t;
    var translateType = function (type) {
        switch (type) {
            case "Style":
                return t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Style"], ["Style"])));
            case "Part":
                return t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Part"], ["Part"])));
            case "Material":
                return t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Material"], ["Material"])));
            case "Tool":
                return t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Tool"], ["Tool"])));
            case "Consumable":
                return t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Consumable"], ["Consumable"])));
            default:
                return type;
        }
    };
    var items = (0, stores_1.useItems)()[0];
    var selectTypeModal = (0, react_1.useDisclosure)();
    var newItemsModal = (0, react_1.useDisclosure)();
    var _b = (0, react_2.useState)(""), created = _b[0], setCreated = _b[1];
    var _c = (0, react_2.useState)("Part"), type = _c[0], setType = _c[1];
    var triggerRef = (0, react_2.useRef)(null);
    var options = (0, react_2.useMemo)(function () {
        return items
            .filter(function (item) { return item.active; })
            .map(function (item) { return ({
            value: item.id,
            label: item.readableIdWithRevision,
            helper: item.name
        }); });
    }, [items]);
    var handleCreateClose = function () {
        var _a;
        setCreated("");
        newItemsModal.onClose();
        (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
    };
    return (<>
      <form_1.CreatableMultiSelect ref={triggerRef} options={options} {...props} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Items"} createLabel={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Item"], ["Item"])))} onCreateOption={function (value) {
            setCreated(value);
            selectTypeModal.onOpen();
        }}/>

      {selectTypeModal.isOpen && (<react_1.Modal open onOpenChange={function (open) {
                if (!open)
                    selectTypeModal.onClose();
            }}>
          <react_1.ModalContent>
            <react_1.ModalHeader>
              <react_1.ModalTitle>
                <macro_1.Trans>Select Item Type</macro_1.Trans>
              </react_1.ModalTitle>
            </react_1.ModalHeader>
            <react_1.ModalBody>
              <div className="grid grid-cols-2 gap-4">
                {Object.values(shared_1.methodItemType).map(function (itemType) { return (<react_1.Button key={itemType} leftIcon={<Icons_1.MethodItemTypeIcon type={itemType}/>} className="flex w-full" variant={type === itemType ? "primary" : "secondary"} size="lg" onClick={function () { return setType(itemType); }}>
                    {translateType(itemType)}
                  </react_1.Button>); })}
              </div>
            </react_1.ModalBody>
            <react_1.ModalFooter>
              <react_1.Button variant="secondary" onClick={function () { return selectTypeModal.onClose(); }}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <react_1.Button onClick={function () {
                selectTypeModal.onClose();
                newItemsModal.onOpen();
            }}>
                <macro_1.Trans>Create</macro_1.Trans>
              </react_1.Button>
            </react_1.ModalFooter>
          </react_1.ModalContent>
        </react_1.Modal>)}

      {type === "Part" && newItemsModal.isOpen && (<PartForm_1.default type="modal" onClose={handleCreateClose} initialValues={{
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
      {type === "Style" && newItemsModal.isOpen && (<StyleForm_1.default type="modal" onClose={handleCreateClose} initialValues={{
                id: "",
                revision: "0",
                name: created,
                description: "",
                itemTrackingType: "Inventory",
                unitOfMeasureCode: "EA",
                replenishmentSystem: "Make",
                defaultMethodType: "Make to Order",
                unitCost: 0,
                lotSize: 0,
                shelfLifeCalculateFromBom: false,
                tags: []
            }}/>)}
      {type === "Material" && newItemsModal.isOpen && (<MaterialForm_1.default type="modal" onClose={handleCreateClose} initialValues={{
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
      {type === "Tool" && newItemsModal.isOpen && (<ToolForm_1.default type="modal" onClose={handleCreateClose} initialValues={{
                id: "",
                revision: "0",
                name: created,
                description: "",
                itemTrackingType: "Inventory",
                unitOfMeasureCode: "EA",
                replenishmentSystem: "Buy",
                defaultMethodType: "Pull from Inventory",
                unitCost: 0,
                shelfLifeCalculateFromBom: false,
                tags: []
            }}/>)}
      {type === "Consumable" && newItemsModal.isOpen && (<ConsumableForm_1.default type="modal" onClose={handleCreateClose} initialValues={{
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
    </>);
};
Items.displayName = "Items";
exports.default = Items;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
