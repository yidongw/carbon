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
Object.defineProperty(exports, "__esModule", { value: true });
exports.coordinateGetter = void 0;
exports.default = ConfigurationParametersForm;
exports.hasDraggableData = hasDraggableData;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var core_1 = require("@dnd-kit/core");
var sortable_1 = require("@dnd-kit/sortable");
var utilities_1 = require("@dnd-kit/utilities");
var macro_1 = require("@lingui/react/macro");
var class_variance_authority_1 = require("class-variance-authority");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Icons_1 = require("~/components/Configurator/Icons");
var Enumerable_1 = require("~/components/Enumerable");
var Form_1 = require("~/components/Form");
var Shape_1 = require("~/components/Form/Shape");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var items_1 = require("~/modules/items");
var configuratorDataTypeLabels_1 = require("~/utils/configuratorDataTypeLabels");
function ConfigurationParametersForm(_a) {
    var _b;
    var _c;
    var bindings = _a.bindings, initialParameters = _a.parameters, initialGroups = _a.groups;
    var t = (0, macro_1.useLingui)().t;
    var dataTypeLabel = (0, configuratorDataTypeLabels_1.useConfiguratorDataTypeLabel)();
    var _d = useConfigurationParameters(undefined), isList = _d.isList, isMaterial = _d.isMaterial, key = _d.key, onChangeCheckForListType = _d.onChangeCheckForListType, setKey = _d.setKey, setIsList = _d.setIsList, setIsMaterial = _d.setIsMaterial, updateKey = _d.updateKey;
    var materialShapeOptions = (0, Shape_1.useShape)();
    var submit = (0, react_router_1.useSubmit)();
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === false) {
            react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failed to update configuration parameter"], ["Failed to update configuration parameter"]))));
        }
    }, [fetcher.data, t]);
    var groupDisclosure = (0, react_1.useDisclosure)();
    var deleteGroupDisclosure = (0, react_1.useDisclosure)();
    var _e = (0, react_2.useState)(null), selectedGroup = _e[0], setSelectedGroup = _e[1];
    var parametersById = new Map(initialParameters.map(function (parameter) { return [parameter.id, parameter]; }));
    var pendingParameters = usePendingParameters({
        configurationParameterOrderUrl: bindings.urls.configurationParameterOrder
    });
    // merge pending parameters and existing parameters
    for (var _i = 0, pendingParameters_1 = pendingParameters; _i < pendingParameters_1.length; _i++) {
        var pendingParameter = pendingParameters_1[_i];
        var parameter = parametersById.get(pendingParameter.id);
        if (parameter) {
            parametersById.set(pendingParameter.id, __assign(__assign({}, parameter), pendingParameter));
        }
    }
    var parameters = Array.from(parametersById.values()).sort(function (a, b) { return a.sortOrder - b.sortOrder; });
    var _f = (0, react_2.useState)(null), activeParameter = _f[0], setActiveParameter = _f[1];
    var groupsById = new Map(initialGroups.map(function (group) { return [group.id, group]; }));
    var pendingGroups = usePendingGroups({
        configurationParameterGroupOrderUrl: bindings.urls.configurationParameterGroupOrder
    });
    // merge pending groups and existing groups
    for (var _g = 0, pendingGroups_1 = pendingGroups; _g < pendingGroups_1.length; _g++) {
        var pendingGroup = pendingGroups_1[_g];
        var group = groupsById.get(pendingGroup.id);
        if (group) {
            groupsById.set(pendingGroup.id, __assign(__assign({}, group), pendingGroup));
        }
    }
    var groups = Array.from(groupsById.values()).sort(function (a, b) { return a.sortOrder - b.sortOrder; });
    var _h = (0, react_2.useState)(null), activeGroup = _h[0], setActiveGroup = _h[1];
    var sensors = (0, core_1.useSensors)((0, core_1.useSensor)(core_1.MouseSensor), (0, core_1.useSensor)(core_1.TouchSensor), (0, core_1.useSensor)(core_1.KeyboardSensor, {
        coordinateGetter: exports.coordinateGetter
    }));
    return (<>
      <react_1.Card isCollapsible>
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Configuration Parameters</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>

        <react_1.CardContent>
          <div className="flex flex-col gap-4">
            <div className="p-6 border rounded-lg">
              <form_1.ValidatedForm action={bindings.urls.configurationParameter} method="post" validator={bindings.parameterValidator} fetcher={fetcher} resetAfterSubmit onSubmit={function () {
            setKey("");
            setIsList(false);
            setIsMaterial(false);
        }} defaultValues={_b = {},
            _b[bindings.ownerField] = bindings.ownerId,
            _b.key = "",
            _b.label = "",
            _b.dataType = "numeric",
            _b.listOptions = [],
            _b.configurationParameterGroupId = undefined,
            _b.materialFormFilterId = "",
            _b} className="w-full">
                <form_1.Hidden name="id"/>
                <form_1.Hidden name={bindings.ownerField}/>
                <form_1.Hidden name="key" value={key}/>
                <react_1.VStack spacing={4}>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                    <react_1.VStack>
                      <Form_1.Input name="label" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Label"], ["Label"])))} onChange={updateKey}/>
                      {key && (<react_1.HStack spacing={1}>
                          <lu_1.LuKeySquare className="w-3 h-3 text-muted-foreground"/>
                          <span className="text-sm text-muted-foreground">
                            {key}
                          </span>
                        </react_1.HStack>)}
                    </react_1.VStack>

                    <form_1.Select name="dataType" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Data Type"], ["Data Type"])))} options={items_1.configurationParameterDataTypes.map(function (type) { return ({
            label: (<react_1.HStack className="w-full">
                            <Icons_1.ConfiguratorDataTypeIcon type={type} className="mr-2"/>
                            {dataTypeLabel(type)}
                          </react_1.HStack>),
            value: type
        }); })} onChange={onChangeCheckForListType}/>
                    {isList && (<Form_1.Array name="listOptions" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["List Parameters"], ["List Parameters"])))}/>)}
                    {isMaterial && (<form_1.Combobox name="materialFormFilterId" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Material Shape"], ["Material Shape"])))} isClearable isOptional options={materialShapeOptions.map(function (shape) { return ({
                label: <Enumerable_1.Enumerable value={shape.label}/>,
                value: shape.value
            }); })}/>)}
                  </div>
                  <react_1.HStack spacing={2}>
                    <form_1.Submit leftIcon={<lu_1.LuCirclePlus />} isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle" &&
            fetcher.formAction ===
                bindings.urls.configurationParameter}>
                      <macro_1.Trans>Add Parameter</macro_1.Trans>
                    </form_1.Submit>
                  </react_1.HStack>
                </react_1.VStack>
              </form_1.ValidatedForm>
            </div>
            <div className="flex">
              <react_1.Button type="button" variant="secondary" leftIcon={<lu_1.LuFolderOpen />} onClick={groupDisclosure.onOpen}>
                <macro_1.Trans>Add Group</macro_1.Trans>
              </react_1.Button>
            </div>

            {parameters.length > 0 && (<core_1.DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
                <sortable_1.SortableContext items={groups.map(function (g) { return g.id; })}>
                  <div className="relative"></div>
                  {groups
                .sort(function (a, b) { return a.sortOrder - b.sortOrder; })
                .map(function (group) {
                var groupParameters = parameters.filter(function (opt) {
                    return "".concat(opt.configurationParameterGroupId) === group.id;
                });
                return (<div key={group.id} className={(0, react_1.cn)("transition-opacity", (activeGroup === null || activeGroup === void 0 ? void 0 : activeGroup.id) === group.id && "opacity-0")}>
                          <ParameterGroup bindings={bindings} group={group} parameters={groupParameters} deleteGroupDisclosure={deleteGroupDisclosure} groupDisclosure={groupDisclosure} setSelectedGroup={setSelectedGroup}/>
                        </div>);
            })}
                </sortable_1.SortableContext>
                <react_1.ClientOnly fallback={null}>
                  {function () {
                return (0, react_dom_1.createPortal)(<core_1.DragOverlay>
                        {activeGroup && (<ParameterGroup bindings={bindings} group={activeGroup} deleteGroupDisclosure={deleteGroupDisclosure} groupDisclosure={groupDisclosure} isOverlay parameters={parameters.filter(function (opt) {
                            return "".concat(opt.configurationParameterGroupId) ===
                                activeGroup.id;
                        })} setSelectedGroup={setSelectedGroup}/>)}
                        {activeParameter && (<ConfigurableParameter bindings={bindings} parameter={activeParameter} isOverlay/>)}
                      </core_1.DragOverlay>, document.body);
            }}
                </react_1.ClientOnly>
              </core_1.DndContext>)}
          </div>
        </react_1.CardContent>
      </react_1.Card>
      {deleteGroupDisclosure.isOpen && selectedGroup && (<Modals_1.ConfirmDelete action={bindings.urls.deleteConfigurationParameterGroup(selectedGroup.id)} isOpen name={(_c = selectedGroup.name) !== null && _c !== void 0 ? _c : ""} text={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Are you sure you want to delete ", "?"], ["Are you sure you want to delete ", "?"])), selectedGroup.name)} onCancel={function () {
                deleteGroupDisclosure.onClose();
                setSelectedGroup(null);
            }} onSubmit={function () {
                deleteGroupDisclosure.onClose();
                setSelectedGroup(null);
            }}/>)}
      {groupDisclosure.isOpen && (<react_1.Modal open={groupDisclosure.isOpen} onOpenChange={function (open) {
                if (!open) {
                    groupDisclosure.onClose();
                    setSelectedGroup(null);
                }
            }}>
          <react_1.ModalContent>
            <form_1.ValidatedForm action={bindings.urls.configurationParameterGroup} method="post" validator={bindings.parameterGroupValidator} fetcher={fetcher} defaultValues={{
                id: selectedGroup === null || selectedGroup === void 0 ? void 0 : selectedGroup.id,
                name: selectedGroup === null || selectedGroup === void 0 ? void 0 : selectedGroup.name
            }} onSubmit={function () {
                setSelectedGroup(null);
                groupDisclosure.onClose();
            }}>
              <react_1.ModalHeader>
                <react_1.ModalTitle>
                  {selectedGroup ? (<macro_1.Trans>Edit Group</macro_1.Trans>) : (<macro_1.Trans>Add Group</macro_1.Trans>)}
                </react_1.ModalTitle>
              </react_1.ModalHeader>
              <react_1.ModalBody>
                <form_1.Hidden name="id"/>
                <Form_1.Input name="name" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Name"], ["Name"])))}/>
              </react_1.ModalBody>
              <react_1.ModalFooter>
                <react_1.Button variant="secondary" type="button" onClick={groupDisclosure.onClose}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
                <form_1.Submit isDisabled={fetcher.state !== "idle" &&
                fetcher.formAction ===
                    bindings.urls.configurationParameterGroup} isLoading={fetcher.state !== "idle" &&
                fetcher.formAction ===
                    bindings.urls.configurationParameterGroup}>
                  <macro_1.Trans>Save</macro_1.Trans>
                </form_1.Submit>
              </react_1.ModalFooter>
            </form_1.ValidatedForm>
          </react_1.ModalContent>
        </react_1.Modal>)}
    </>);
    function onDragStart(event) {
        if (!hasDraggableData(event.active))
            return;
        var data = event.active.data.current;
        if ((data === null || data === void 0 ? void 0 : data.type) === "group") {
            setActiveGroup(data.group);
            return;
        }
        if ((data === null || data === void 0 ? void 0 : data.type) === "parameter") {
            setActiveParameter(data.parameter);
            return;
        }
    }
    function onDragEnd(event) {
        var _a;
        setActiveGroup(null);
        setActiveParameter(null);
        var active = event.active, over = event.over;
        if (!over)
            return;
        var activeId = active.id;
        var overId = over.id;
        if (!hasDraggableData(active))
            return;
        var activeData = active.data.current;
        if (activeId === overId)
            return;
        var isActiveAColumn = (activeData === null || activeData === void 0 ? void 0 : activeData.type) === "group";
        if (!isActiveAColumn)
            return;
        var activeGroup = groups.find(function (g) { return g.id === activeId; });
        var overGroup = (_a = over.data.current) === null || _a === void 0 ? void 0 : _a.group;
        if (!activeGroup || !overGroup)
            return;
        var sortOrderBefore = 0;
        var sortOrderAfter = 0;
        if (activeGroup.sortOrder > overGroup.sortOrder) {
            // Moving up - insert before the over item
            sortOrderAfter = overGroup.sortOrder;
            // Find the previous group's sort order
            for (var i = groups.length - 1; i >= 0; i--) {
                var group = groups[i];
                if (group.sortOrder < overGroup.sortOrder) {
                    sortOrderBefore = group.sortOrder;
                    break;
                }
            }
        }
        else {
            // Moving down - insert after the over item
            sortOrderBefore = overGroup.sortOrder;
            // Find the next group's sort order
            for (var i = 0; i < groups.length; i++) {
                var group = groups[i];
                if (group.sortOrder > overGroup.sortOrder) {
                    sortOrderAfter = group.sortOrder;
                    break;
                }
            }
            if (sortOrderAfter === 0) {
                sortOrderAfter = sortOrderBefore + 1;
            }
        }
        var newSortOrder = (sortOrderBefore + sortOrderAfter) / 2;
        submit({
            id: activeGroup.id,
            sortOrder: newSortOrder
        }, {
            method: "post",
            action: bindings.urls.configurationParameterGroupOrder,
            navigate: false,
            fetcherKey: "group:".concat(activeGroup.id)
        });
    }
    function onDragOver(event) {
        var _a, _b, _c, _d;
        var active = event.active, over = event.over;
        if (!over)
            return;
        var activeId = active.id;
        var overId = over.id;
        if (activeId === overId)
            return;
        if (!hasDraggableData(active) || !hasDraggableData(over))
            return;
        var activeData = active.data.current;
        var overData = over.data.current;
        var isActiveAnParameter = (activeData === null || activeData === void 0 ? void 0 : activeData.type) === "parameter";
        var isOverAnParameter = (overData === null || overData === void 0 ? void 0 : overData.type) === "parameter";
        var activeParameter = parametersById.get(activeId.toString());
        var overParameter = parametersById.get(overId.toString());
        if (!isActiveAnParameter)
            return;
        // dropping an option over another option
        if (isActiveAnParameter &&
            isOverAnParameter &&
            activeParameter &&
            overParameter) {
            var sortOrderBefore_1 = 0;
            var sortOrderAfter = 0;
            if (activeParameter.sortOrder > overParameter.sortOrder ||
                activeParameter.configurationParameterGroupId !==
                    overParameter.configurationParameterGroupId) {
                sortOrderAfter = overParameter.sortOrder;
                for (var i = parameters.length - 1; i >= 0; i--) {
                    var parameter = parameters[i];
                    if ("".concat(parameter.configurationParameterGroupId) ===
                        "".concat(overParameter.configurationParameterGroupId) &&
                        parameter.sortOrder < sortOrderAfter) {
                        sortOrderBefore_1 = (_a = parameter.sortOrder) !== null && _a !== void 0 ? _a : 0;
                        break;
                    }
                }
            }
            else {
                sortOrderBefore_1 = overParameter.sortOrder;
                sortOrderAfter =
                    (_c = (_b = parameters.find(function (parameter) {
                        return "".concat(parameter.configurationParameterGroupId) ===
                            "".concat(overParameter.configurationParameterGroupId) &&
                            parameter.sortOrder > sortOrderBefore_1;
                    })) === null || _b === void 0 ? void 0 : _b.sortOrder) !== null && _c !== void 0 ? _c : sortOrderBefore_1 + 1;
            }
            var newSortOrder = (sortOrderBefore_1 + sortOrderAfter) / 2;
            if (activeParameter.configurationParameterGroupId !==
                overParameter.configurationParameterGroupId) {
                submit({
                    id: activeParameter.id,
                    configurationParameterGroupId: overParameter.configurationParameterGroupId == "null"
                        ? null
                        : overParameter.configurationParameterGroupId,
                    sortOrder: newSortOrder,
                    label: activeParameter.label,
                    key: activeParameter.key,
                    dataType: activeParameter.dataType
                }, {
                    method: "post",
                    action: bindings.urls.configurationParameterOrder,
                    navigate: false,
                    fetcherKey: "parameter:".concat(activeParameter.id)
                });
                return;
            }
            if (activeParameter && overParameter) {
                submit({
                    id: activeParameter.id,
                    configurationParameterGroupId: overParameter.configurationParameterGroupId == "null"
                        ? null
                        : overParameter.configurationParameterGroupId,
                    sortOrder: newSortOrder,
                    label: activeParameter.label,
                    key: activeParameter.key,
                    dataType: activeParameter.dataType
                }, {
                    method: "post",
                    action: bindings.urls.configurationParameterOrder,
                    navigate: false,
                    fetcherKey: "parameter:".concat(activeParameter.id)
                });
            }
            return;
        }
        var isOverAGroup = (overData === null || overData === void 0 ? void 0 : overData.type) === "group";
        // dropping an option over a group
        if (isActiveAnParameter && isOverAGroup) {
            var activeParameter_1 = parametersById.get(activeId.toString());
            var groupId_1 = overId;
            if (activeParameter_1) {
                var firstItemInColumn = parameters.find(function (parameter) { return parameter.configurationParameterGroupId === groupId_1; });
                var sortOrderBefore = 0;
                var sortOrderAfter = (_d = firstItemInColumn === null || firstItemInColumn === void 0 ? void 0 : firstItemInColumn.sortOrder) !== null && _d !== void 0 ? _d : 1;
                var newSortOrder = (sortOrderBefore + sortOrderAfter) / 2;
                submit({
                    id: activeParameter_1.id,
                    configurationParameterGroupId: groupId_1 == "null" ? null : groupId_1,
                    sortOrder: newSortOrder,
                    label: activeParameter_1.label,
                    key: activeParameter_1.key,
                    dataType: activeParameter_1.dataType
                }, {
                    method: "post",
                    action: bindings.urls.configurationParameterOrder,
                    navigate: false,
                    fetcherKey: "parameter:".concat(activeParameter_1.id)
                });
            }
        }
    }
}
var variants = (0, class_variance_authority_1.cva)("border rounded-lg", {
    variants: {
        dragging: {
            default: "",
            over: "ring-2 opacity-30",
            overlay: "ring-2 ring-primary"
        }
    }
});
function ParameterGroup(_a) {
    var bindings = _a.bindings, group = _a.group, isOverlay = _a.isOverlay, parameters = _a.parameters, groupDisclosure = _a.groupDisclosure, deleteGroupDisclosure = _a.deleteGroupDisclosure, setSelectedGroup = _a.setSelectedGroup;
    var t = (0, macro_1.useLingui)().t;
    var groupDisplayName = group.isUngrouped ? t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Ungrouped"], ["Ungrouped"]))) : group.name;
    var _b = (0, sortable_1.useSortable)({
        id: group.id,
        data: { type: "group", group: group },
        attributes: {
            roleDescription: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Group: ", ""], ["Group: ", ""])), groupDisplayName)
        }
    }), setNodeRef = _b.setNodeRef, attributes = _b.attributes, listeners = _b.listeners, transform = _b.transform, transition = _b.transition, isDragging = _b.isDragging;
    var style = {
        transition: transition,
        transform: utilities_1.CSS.Translate.toString(transform)
    };
    return (<div key={group.id} ref={setNodeRef} style={style} className={variants({
            dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined
        })}>
      <div className={(0, react_1.cn)("p-4 bg-muted/30", parameters.length > 0 && "border-b")}>
        <react_1.HStack className="w-full justify-between">
          <react_1.HStack>
            <react_1.IconButton aria-label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Reorder Group"], ["Reorder Group"])))} icon={<lu_1.LuGripVertical />} variant="ghost" isDisabled={group.id === "null"} {...attributes} {...listeners} className="cursor-grab"/>
            <h3 className="font-semibold">{groupDisplayName}</h3>
          </react_1.HStack>
          <react_1.DropdownMenu>
            <react_1.DropdownMenuTrigger asChild>
              <react_1.IconButton aria-label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Open menu"], ["Open menu"])))} icon={<lu_1.LuEllipsisVertical />} variant="ghost"/>
            </react_1.DropdownMenuTrigger>
            <react_1.DropdownMenuContent align="end">
              <react_1.DropdownMenuItem onClick={function () {
            (0, react_dom_1.flushSync)(function () {
                setSelectedGroup(group);
            });
            groupDisclosure.onOpen();
        }}>
                <macro_1.Trans>Edit</macro_1.Trans>
              </react_1.DropdownMenuItem>
              <react_1.DropdownMenuItem destructive disabled={group.isUngrouped} onClick={function () {
            (0, react_dom_1.flushSync)(function () {
                setSelectedGroup(group);
            });
            deleteGroupDisclosure.onOpen();
        }}>
                <macro_1.Trans>Delete</macro_1.Trans>
              </react_1.DropdownMenuItem>
            </react_1.DropdownMenuContent>
          </react_1.DropdownMenu>
        </react_1.HStack>
      </div>
      <sortable_1.SortableContext items={parameters.map(function (opt) { return opt.id; })}>
        <div className={(0, react_1.cn)("flex flex-col gap-2", parameters.length > 0 && "p-2")}>
          {parameters.map(function (parameter) { return (<ConfigurableParameter key={parameter.id} bindings={bindings} parameter={parameter}/>); })}
        </div>
      </sortable_1.SortableContext>
    </div>);
}
function ConfigurableParameter(_a) {
    var _b;
    var _c, _d, _e;
    var bindings = _a.bindings, parameter = _a.parameter, isOverlay = _a.isOverlay;
    var t = (0, macro_1.useLingui)().t;
    var dataTypeLabel = (0, configuratorDataTypeLabels_1.useConfiguratorDataTypeLabel)();
    var formatRelativeTime = (0, hooks_1.useDateFormatter)().formatRelativeTime;
    var _f = useConfigurationParameters(parameter), isList = _f.isList, isMaterial = _f.isMaterial, key = _f.key, onChangeCheckForListType = _f.onChangeCheckForListType, updateKey = _f.updateKey;
    var materialShapeOptions = (0, Shape_1.useShape)();
    var disclosure = (0, react_1.useDisclosure)();
    var deleteParameterDisclosure = (0, react_1.useDisclosure)();
    var submitted = (0, react_2.useRef)(false);
    var fetcher = (0, react_router_1.useFetcher)();
    var _g = (0, sortable_1.useSortable)({
        id: parameter.id,
        data: {
            type: "parameter",
            parameter: parameter
        },
        attributes: {
            roleDescription: "Parameter: ".concat(parameter.label)
        }
    }), attributes = _g.attributes, listeners = _g.listeners, setNodeRef = _g.setNodeRef, transform = _g.transform, transition = _g.transition, isDragging = _g.isDragging;
    var style = {
        transform: utilities_1.CSS.Transform.toString(transform),
        transition: transition
    };
    (0, react_2.useEffect)(function () {
        if (submitted.current && fetcher.state === "idle") {
            disclosure.onClose();
            submitted.current = false;
        }
    }, [disclosure, fetcher.state]);
    var isUpdated = parameter.updatedBy !== null;
    var person = isUpdated ? parameter.updatedBy : parameter.createdBy;
    var date = (_c = parameter.updatedAt) !== null && _c !== void 0 ? _c : parameter.createdAt;
    return (<div ref={setNodeRef} style={style} className={(0, react_1.cn)("p-4 bg-card", variants({
            dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined
        }))}>
      {disclosure.isOpen ? (<form_1.ValidatedForm action={bindings.urls.configurationParameter} method="post" validator={bindings.parameterValidator} fetcher={fetcher} resetAfterSubmit onSubmit={function () {
                disclosure.onClose();
            }} defaultValues={_b = {
                    id: parameter.id
                },
                _b[bindings.ownerField] = bindings.ownerId,
                _b.key = parameter.key,
                _b.label = parameter.label,
                _b.dataType = parameter.dataType,
                _b.listOptions = (_d = parameter.listOptions) !== null && _d !== void 0 ? _d : [],
                _b.materialFormFilterId = (_e = parameter.materialFormFilterId) !== null && _e !== void 0 ? _e : undefined,
                _b}>
          <form_1.Hidden name="id"/>
          <form_1.Hidden name={bindings.ownerField}/>
          <form_1.Hidden name="key" value={key}/>
          <react_1.VStack spacing={4}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <react_1.VStack>
                <Form_1.Input name="label" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Label"], ["Label"])))} onChange={updateKey} autoFocus/>
                {key && (<react_1.HStack spacing={1}>
                    <lu_1.LuKeySquare className="w-3 h-3 text-muted-foreground"/>
                    <span className="text-sm text-muted-foreground">{key}</span>
                  </react_1.HStack>)}
              </react_1.VStack>

              <form_1.Select name="dataType" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Data Type"], ["Data Type"])))} options={items_1.configurationParameterDataTypes.map(function (type) { return ({
                label: (<react_1.HStack className="w-full">
                      <Icons_1.ConfiguratorDataTypeIcon type={type} className="mr-2"/>
                      {dataTypeLabel(type)}
                    </react_1.HStack>),
                value: type
            }); })} onChange={onChangeCheckForListType}/>
              {isList && (<Form_1.Array name="listOptions" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["List Parameters"], ["List Parameters"])))}/>)}
              {isMaterial && (<form_1.Combobox name="materialFormFilterId" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Material Shape"], ["Material Shape"])))} isOptional isClearable options={materialShapeOptions.map(function (shape) { return ({
                    label: <Enumerable_1.Enumerable value={shape.label}/>,
                    value: shape.value
                }); })}/>)}
            </div>
            <react_1.HStack className="w-full justify-end" spacing={2}>
              <react_1.Button variant="secondary" onClick={disclosure.onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <form_1.Submit isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle" &&
                fetcher.formAction === bindings.urls.configurationParameter}>
                <macro_1.Trans>Save</macro_1.Trans>
              </form_1.Submit>
            </react_1.HStack>
          </react_1.VStack>
        </form_1.ValidatedForm>) : (<div className="flex flex-col gap-2 w-full">
          <div className="flex flex-1 justify-between items-center w-full">
            <react_1.HStack spacing={2} className="w-1/2">
              <react_1.IconButton aria-label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Reorder"], ["Reorder"])))} icon={<lu_1.LuGripVertical />} variant="ghost" {...attributes} {...listeners} className="cursor-grab"/>
              <react_1.HStack spacing={4} className="flex-1">
                <div className="bg-muted border rounded-full flex items-center justify-center p-2">
                  <Icons_1.ConfiguratorDataTypeIcon type={parameter.dataType} className="w-4 h-4"/>
                </div>
                <react_1.VStack spacing={0}>
                  <span className="text-sm font-medium">{parameter.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {parameter.key}
                  </span>
                </react_1.VStack>
              </react_1.HStack>
            </react_1.HStack>
            <div className="flex items-center justify-end gap-2">
              <react_1.HStack spacing={2}>
                <span className="text-xs text-muted-foreground">
                  {isUpdated ? t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Updated"], ["Updated"]))) : t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Created"], ["Created"])))}{" "}
                  {formatRelativeTime(date)}
                </span>
                <components_1.EmployeeAvatar employeeId={person} withName={false}/>
              </react_1.HStack>
              <react_1.DropdownMenu>
                <react_1.DropdownMenuTrigger asChild>
                  <react_1.IconButton aria-label={t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Open menu"], ["Open menu"])))} icon={<lu_1.LuEllipsisVertical />} variant="ghost"/>
                </react_1.DropdownMenuTrigger>
                <react_1.DropdownMenuContent align="end">
                  <react_1.DropdownMenuItem onClick={disclosure.onOpen}>
                    <macro_1.Trans>Edit</macro_1.Trans>
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuItem destructive onClick={deleteParameterDisclosure.onOpen}>
                    <macro_1.Trans>Delete</macro_1.Trans>
                  </react_1.DropdownMenuItem>
                </react_1.DropdownMenuContent>
              </react_1.DropdownMenu>
            </div>
          </div>
          {parameter.dataType === "material" && (<div className="py-4 px-8 bg-muted/30 rounded-md">
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <span className="text-sm">
                    <macro_1.Trans>ID</macro_1.Trans>
                  </span>
                  <div className="text-xs font-mono text-muted-foreground">
                    {parameter.key}.id
                  </div>
                </div>
                <div>
                  <span className="text-sm">
                    <macro_1.Trans>Material Form</macro_1.Trans>
                  </span>
                  <div className="text-xs font-mono text-muted-foreground">
                    {parameter.key}.materialFormId
                  </div>
                </div>
                <div>
                  <span className="text-sm">
                    <macro_1.Trans>Substance</macro_1.Trans>
                  </span>
                  <div className="text-xs font-mono text-muted-foreground">
                    {parameter.key}.materialSubstanceId
                  </div>
                </div>
                <div>
                  <span className="text-sm">
                    <macro_1.Trans>Dimension</macro_1.Trans>
                  </span>
                  <div className="text-xs font-mono text-muted-foreground">
                    {parameter.key}.dimensionId
                  </div>
                </div>
                <div>
                  <span className="text-sm">
                    <macro_1.Trans>Grade</macro_1.Trans>
                  </span>
                  <div className="text-xs font-mono text-muted-foreground">
                    {parameter.key}.gradeId
                  </div>
                </div>
                <div>
                  <span className="text-sm">
                    <macro_1.Trans>Finish</macro_1.Trans>
                  </span>
                  <div className="text-xs font-mono text-muted-foreground">
                    {parameter.key}.finishId
                  </div>
                </div>
                <div>
                  <span className="text-sm">
                    <macro_1.Trans>Material Type</macro_1.Trans>
                  </span>
                  <div className="text-xs font-mono text-muted-foreground">
                    {parameter.key}.materialTypeId
                  </div>
                </div>
              </div>
            </div>)}
        </div>)}
      {deleteParameterDisclosure.isOpen && (<Modals_1.ConfirmDelete action={bindings.urls.deleteConfigurationParameter(parameter.id)} isOpen={deleteParameterDisclosure.isOpen} name={parameter.label} text={t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Are you sure you want to delete the ", " parameter? This will not update any formulas that are using this parameter."], ["Are you sure you want to delete the ", " parameter? This will not update any formulas that are using this parameter."])), parameter.label)} onCancel={function () {
                deleteParameterDisclosure.onClose();
            }} onSubmit={function () {
                deleteParameterDisclosure.onClose();
            }}/>)}
    </div>);
}
function useConfigurationParameters(parameter) {
    var _a;
    var _b = (0, react_2.useState)((_a = parameter === null || parameter === void 0 ? void 0 : parameter.key) !== null && _a !== void 0 ? _a : ""), key = _b[0], setKey = _b[1];
    var _c = (0, react_2.useState)((parameter === null || parameter === void 0 ? void 0 : parameter.dataType) === "list"), isList = _c[0], setIsList = _c[1];
    var _d = (0, react_2.useState)((parameter === null || parameter === void 0 ? void 0 : parameter.dataType) === "material"), isMaterial = _d[0], setIsMaterial = _d[1];
    var onChangeCheckForListType = function (newValue) {
        if (!newValue)
            return;
        var type = newValue.value;
        setIsList(type === "list");
        setIsMaterial(type === "material");
    };
    var updateKey = function (e) {
        var label = e.target.value;
        setKey(label
            .trim()
            .replace(/\s+/g, "_")
            .replace(/[^\p{L}\p{N}_]/gu, ""));
    };
    return {
        key: key,
        isList: isList,
        isMaterial: isMaterial,
        onChangeCheckForListType: onChangeCheckForListType,
        setKey: setKey,
        setIsList: setIsList,
        setIsMaterial: setIsMaterial,
        updateKey: updateKey
    };
}
function usePendingGroups(_a) {
    var configurationParameterGroupOrderUrl = _a.configurationParameterGroupOrderUrl;
    return (0, react_router_1.useFetchers)()
        .filter(function (fetcher) {
        return fetcher.formAction === configurationParameterGroupOrderUrl;
    })
        .map(function (fetcher) {
        var id = String(fetcher.formData.get("id"));
        var sortOrder = Number(fetcher.formData.get("sortOrder"));
        return { id: id, sortOrder: sortOrder };
    });
}
function usePendingParameters(_a) {
    var configurationParameterOrderUrl = _a.configurationParameterOrderUrl;
    return (0, react_router_1.useFetchers)()
        .filter(function (fetcher) {
        return fetcher.formAction === configurationParameterOrderUrl;
    })
        .map(function (fetcher) {
        var configurationParameterGroupId = String(fetcher.formData.get("configurationParameterGroupId"));
        var id = String(fetcher.formData.get("id"));
        var label = String(fetcher.formData.get("label"));
        var key = String(fetcher.formData.get("key"));
        var dataType = String(fetcher.formData.get("dataType"));
        var item = {
            id: id,
            label: label,
            key: key,
            dataType: dataType,
            configurationParameterGroupId: configurationParameterGroupId
        };
        return item;
    });
}
var directions = [
    core_1.KeyboardCode.Down,
    core_1.KeyboardCode.Right,
    core_1.KeyboardCode.Up,
    core_1.KeyboardCode.Left
];
var coordinateGetter = function (event, _a) {
    var _b = _a.context, active = _b.active, droppableRects = _b.droppableRects, droppableContainers = _b.droppableContainers, collisionRect = _b.collisionRect;
    if (directions.includes(event.code)) {
        event.preventDefault();
        if (!active || !collisionRect) {
            return;
        }
        var filteredContainers_1 = [];
        droppableContainers.getEnabled().forEach(function (entry) {
            var _a, _b, _c;
            if (!entry || (entry === null || entry === void 0 ? void 0 : entry.disabled)) {
                return;
            }
            var rect = droppableRects.get(entry.id);
            if (!rect) {
                return;
            }
            var data = entry.data.current;
            if (data) {
                var type = data.type, children = data.children;
                if (type === "Group" && (children === null || children === void 0 ? void 0 : children.length) > 0) {
                    if (((_a = active.data.current) === null || _a === void 0 ? void 0 : _a.type) !== "Group") {
                        return;
                    }
                }
            }
            switch (event.code) {
                case core_1.KeyboardCode.Down:
                    if (((_b = active.data.current) === null || _b === void 0 ? void 0 : _b.type) === "Group") {
                        return;
                    }
                    if (collisionRect.top < rect.top) {
                        // find all droppable areas below
                        filteredContainers_1.push(entry);
                    }
                    break;
                case core_1.KeyboardCode.Up:
                    if (((_c = active.data.current) === null || _c === void 0 ? void 0 : _c.type) === "Group") {
                        return;
                    }
                    if (collisionRect.top > rect.top) {
                        // find all droppable areas above
                        filteredContainers_1.push(entry);
                    }
                    break;
                case core_1.KeyboardCode.Left:
                    if (collisionRect.left >= rect.left + rect.width) {
                        // find all droppable areas to left
                        filteredContainers_1.push(entry);
                    }
                    break;
                case core_1.KeyboardCode.Right:
                    // find all droppable areas to right
                    if (collisionRect.left + collisionRect.width <= rect.left) {
                        filteredContainers_1.push(entry);
                    }
                    break;
            }
        });
        var collisions = (0, core_1.closestCorners)({
            active: active,
            collisionRect: collisionRect,
            droppableRects: droppableRects,
            droppableContainers: filteredContainers_1,
            pointerCoordinates: null
        });
        var closestId = (0, core_1.getFirstCollision)(collisions, "id");
        if (closestId != null) {
            var newDroppable = droppableContainers.get(closestId);
            var newNode = newDroppable === null || newDroppable === void 0 ? void 0 : newDroppable.node.current;
            var newRect = newDroppable === null || newDroppable === void 0 ? void 0 : newDroppable.rect.current;
            if (newNode && newRect) {
                return {
                    x: newRect.left,
                    y: newRect.top
                };
            }
        }
    }
    return undefined;
};
exports.coordinateGetter = coordinateGetter;
function hasDraggableData(entry) {
    if (!entry) {
        return false;
    }
    var data = entry.data.current;
    if ((data === null || data === void 0 ? void 0 : data.type) === "parameter" || (data === null || data === void 0 ? void 0 : data.type) === "group") {
        return true;
    }
    return false;
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20;
