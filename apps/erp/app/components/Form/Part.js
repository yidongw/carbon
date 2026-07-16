"use strict";
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
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var PartForm_1 = require("~/modules/items/ui/Parts/PartForm");
var stores_1 = require("~/stores");
var Part = function (_a) {
    var _b;
    var itemReplenishmentSystem = _a.itemReplenishmentSystem, props = __rest(_a, ["itemReplenishmentSystem"]);
    var parts = (0, stores_1.useParts)();
    var newPartsModal = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(""), created = _c[0], setCreated = _c[1];
    var triggerRef = (0, react_2.useRef)(null);
    var options = (0, react_2.useMemo)(function () {
        var _a;
        return (_a = parts.map(function (part) { return ({
            value: part.id,
            label: part.id,
            helper: part.name
        }); })) !== null && _a !== void 0 ? _a : [];
    }, [parts]);
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={options} {...props} label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : "Part"} onCreateOption={function (option) {
            newPartsModal.onOpen();
            setCreated(option);
        }}/>
      {newPartsModal.isOpen && (<PartForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newPartsModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                id: "",
                revision: "0",
                name: created,
                description: "",
                itemTrackingType: "Inventory",
                replenishmentSystem: itemReplenishmentSystem !== null && itemReplenishmentSystem !== void 0 ? itemReplenishmentSystem : "Buy and Make",
                defaultMethodType: "Pull from Inventory",
                unitOfMeasureCode: "EA",
                unitCost: 0,
                lotSize: 0,
                shelfLifeCalculateFromBom: false
            }}/>)}
    </>);
};
Part.displayName = "Part";
exports.default = Part;
