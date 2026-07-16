"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useItemPostingGroups = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var ItemPostingGroupForm_1 = require("~/modules/items/ui/ItemPostingGroups/ItemPostingGroupForm");
var path_1 = require("~/utils/path");
var Enumerable_1 = require("../Enumerable");
var ItemPostingGroupPreview = function (value, options) {
    var _a;
    var itemGroup = options.find(function (o) { return o.value === value; });
    return (_a = itemGroup === null || itemGroup === void 0 ? void 0 : itemGroup.label) !== null && _a !== void 0 ? _a : null;
};
var ItemPostingGroup = function (props) {
    var _a, _b;
    var newItemPostingGroupModal = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(""), created = _c[0], setCreated = _c[1];
    var triggerRef = (0, react_2.useRef)(null);
    var options = (0, exports.useItemPostingGroups)();
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={(_a = options.map(function (o) { return ({
            value: o.value,
            label: <Enumerable_1.Enumerable value={o.label}/>
        }); })) !== null && _a !== void 0 ? _a : []} {...props} inline={props.inline ? ItemPostingGroupPreview : undefined} label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : "Posting Group"} onCreateOption={function (option) {
            newItemPostingGroupModal.onOpen();
            setCreated(option);
        }}/>
      {newItemPostingGroupModal.isOpen && (<ItemPostingGroupForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newItemPostingGroupModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                name: created
            }}/>)}
    </>);
};
ItemPostingGroup.displayName = "ItemPostingGroup";
exports.default = ItemPostingGroup;
var useItemPostingGroups = function () {
    var itemGroupFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        itemGroupFetcher.load(path_1.path.to.api.itemPostingGroups);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_a = itemGroupFetcher.data) === null || _a === void 0 ? void 0 : _a.data)
            ? (_b = itemGroupFetcher.data) === null || _b === void 0 ? void 0 : _b.data.map(function (c) { return ({
                value: c.id,
                label: c.name
            }); })
            : [];
    }, [itemGroupFetcher.data]);
    return options;
};
exports.useItemPostingGroups = useItemPostingGroups;
