"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var MaterialFinishForm_1 = require("~/modules/items/ui/MaterialFinishes/MaterialFinishForm");
var path_1 = require("~/utils/path");
var MaterialFinishPreview = function (value, options) {
    var finish = options.find(function (o) { return o.value === value; });
    if (!finish)
        return null;
    return <span>{finish.label}</span>;
};
var MaterialFinish = function (props) {
    var _a, _b, _c;
    var materialFinishesLoader = (0, react_router_1.useFetcher)();
    var newFinishModal = (0, react_1.useDisclosure)();
    var _d = (0, react_2.useState)(""), created = _d[0], setCreated = _d[1];
    var triggerRef = (0, react_2.useRef)(null);
    (0, react_1.useMount)(function () {
        if (props.substanceId) {
            materialFinishesLoader.load(path_1.path.to.api.materialFinishes(props.substanceId));
        }
    });
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (props.substanceId) {
            materialFinishesLoader.load(path_1.path.to.api.materialFinishes(props.substanceId));
        }
    }, [props.substanceId]);
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_b = (_a = materialFinishesLoader.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : []).map(function (c) { return ({
            value: c.id,
            label: c.name,
            helper: c.companyId === null ? "Standard" : undefined
        }); });
    }, [(_a = materialFinishesLoader.data) === null || _a === void 0 ? void 0 : _a.data]);
    var onChange = function (newValue) {
        var _a, _b, _c, _d;
        var finish = (_c = (_b = (_a = materialFinishesLoader.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.find(function (finish) { return finish.id === (newValue === null || newValue === void 0 ? void 0 : newValue.value); })) !== null && _c !== void 0 ? _c : null;
        (_d = props.onChange) === null || _d === void 0 ? void 0 : _d.call(props, finish);
    };
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={options} {...props} disabled={props.disabled || !props.substanceId} inline={(props === null || props === void 0 ? void 0 : props.inline) ? MaterialFinishPreview : undefined} isOptional={(_b = props === null || props === void 0 ? void 0 : props.isOptional) !== null && _b !== void 0 ? _b : true} label={(_c = props === null || props === void 0 ? void 0 : props.label) !== null && _c !== void 0 ? _c : "Finish"} onChange={onChange} onCreateOption={function (option) {
            newFinishModal.onOpen();
            setCreated(option);
        }}/>
      {newFinishModal.isOpen && (<MaterialFinishForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newFinishModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                name: created,
                materialSubstanceId: props.substanceId
            }}/>)}
    </>);
};
exports.default = MaterialFinish;
