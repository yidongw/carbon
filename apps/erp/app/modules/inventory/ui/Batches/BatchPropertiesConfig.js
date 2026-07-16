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
exports.default = BatchPropertiesConfig;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var core_1 = require("@dnd-kit/core");
var sortable_1 = require("@dnd-kit/sortable");
var utilities_1 = require("@dnd-kit/utilities");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Icons_1 = require("~/components/Configurator/Icons");
var Form_1 = require("~/components/Form");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var items_models_1 = require("~/modules/items/items.models");
var configuratorDataTypeLabels_1 = require("~/utils/configuratorDataTypeLabels");
var path_1 = require("~/utils/path");
var inventory_models_1 = require("../../inventory.models");
function BatchPropertiesConfig(_a) {
    var itemId = _a.itemId, initialProperties = _a.properties, _b = _a.type, type = _b === void 0 ? "card" : _b, _c = _a.isReadOnly, isReadOnly = _c === void 0 ? false : _c, onClose = _a.onClose;
    var _d = useBatchProperties(), isList = _d.isList, onChangeCheckForListType = _d.onChangeCheckForListType, setIsList = _d.setIsList;
    var t = (0, macro_1.useLingui)().t;
    var dataTypeLabel = (0, configuratorDataTypeLabels_1.useConfiguratorDataTypeLabel)();
    var submit = (0, react_router_1.useSubmit)();
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === false) {
            react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failed to update batch property"], ["Failed to update batch property"]))));
        }
    }, [fetcher.data, t]);
    var propertiesById = new Map(initialProperties.map(function (property) { return [property.id, property]; }));
    var pendingProperties = usePendingProperties({ itemId: itemId });
    // merge pending properties and existing properties
    for (var _i = 0, pendingProperties_1 = pendingProperties; _i < pendingProperties_1.length; _i++) {
        var pendingProperty = pendingProperties_1[_i];
        var property = propertiesById.get(pendingProperty.id);
        if (property) {
            propertiesById.set(pendingProperty.id, __assign(__assign({}, property), pendingProperty));
        }
    }
    var properties = Array.from(propertiesById.values()).sort(function (a, b) { return a.sortOrder - b.sortOrder; });
    var _e = (0, react_2.useState)(null), activeProperty = _e[0], setActiveProperty = _e[1];
    var sensors = (0, core_1.useSensors)((0, core_1.useSensor)(core_1.MouseSensor), (0, core_1.useSensor)(core_1.TouchSensor), (0, core_1.useSensor)(core_1.KeyboardSensor));
    return (<react_1.ModalCardProvider type={type}>
      <react_1.ModalCard onClose={onClose}>
        <react_1.ModalCardContent>
          <react_1.ModalCardHeader>
            <react_1.ModalCardTitle>
              <macro_1.Trans>Batch Properties</macro_1.Trans>
            </react_1.ModalCardTitle>
          </react_1.ModalCardHeader>

          <react_1.ModalCardBody>
            <div className="flex flex-col gap-4">
              <div className="p-6 border rounded-lg">
                <form_1.ValidatedForm action={path_1.path.to.batchProperty(itemId)} method="post" fetcher={fetcher} validator={inventory_models_1.batchPropertyValidator} resetAfterSubmit onSubmit={function () {
            setIsList(false);
        }} defaultValues={{
            itemId: itemId,
            label: "",
            dataType: "text",
            listOptions: []
        }} className="w-full">
                  <form_1.Hidden name="id"/>
                  <form_1.Hidden name="itemId"/>
                  <react_1.VStack spacing={4}>
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                      <react_1.VStack>
                        <Form_1.Input name="label" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Label"], ["Label"])))} isDisabled={isReadOnly}/>
                      </react_1.VStack>

                      <form_1.Select name="dataType" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Data Type"], ["Data Type"])))} disabled={isReadOnly} options={items_models_1.batchPropertyDataTypes.map(function (type) { return ({
            label: (<react_1.HStack className="w-full">
                              <Icons_1.ConfiguratorDataTypeIcon type={type} className="mr-2"/>
                              {dataTypeLabel(type)}
                            </react_1.HStack>),
            value: type
        }); })} onChange={onChangeCheckForListType}/>
                      {isList && (<Form_1.Array isDisabled={isReadOnly} name="listOptions" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["List Options"], ["List Options"])))}/>)}
                    </div>
                    <react_1.HStack spacing={2}>
                      <form_1.Submit leftIcon={<lu_1.LuCirclePlus />} isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
                        <macro_1.Trans>Add Property</macro_1.Trans>
                      </form_1.Submit>
                    </react_1.HStack>
                  </react_1.VStack>
                </form_1.ValidatedForm>
              </div>

              {properties.length > 0 && (<core_1.DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
                  <sortable_1.SortableContext items={properties.map(function (p) { return p.id; })}>
                    <div className="flex flex-col gap-2">
                      {properties.map(function (property) { return (<BatchPropertyComponent key={property.id} property={property}/>); })}
                    </div>
                  </sortable_1.SortableContext>
                  <react_1.ClientOnly fallback={null}>
                    {function () {
                return (0, react_dom_1.createPortal)(<core_1.DragOverlay>
                          {activeProperty && (<BatchPropertyComponent property={activeProperty} isOverlay/>)}
                        </core_1.DragOverlay>, document.body);
            }}
                  </react_1.ClientOnly>
                </core_1.DndContext>)}
            </div>
          </react_1.ModalCardBody>
        </react_1.ModalCardContent>
      </react_1.ModalCard>
    </react_1.ModalCardProvider>);
    function onDragStart(event) {
        var active = event.active;
        var activeProperty = properties.find(function (p) { return p.id === active.id; });
        if (activeProperty) {
            setActiveProperty(activeProperty);
        }
    }
    function onDragEnd(event) {
        setActiveProperty(null);
        var active = event.active, over = event.over;
        if (!over)
            return;
        var activeId = active.id;
        var overId = over.id;
        if (activeId === overId)
            return;
        var activeIndex = properties.findIndex(function (p) { return p.id === activeId; });
        var overIndex = properties.findIndex(function (p) { return p.id === overId; });
        if (activeIndex === -1 || overIndex === -1)
            return;
        var activeProperty = properties[activeIndex];
        var overProperty = properties[overIndex];
        var newSortOrder;
        if (activeIndex > overIndex) {
            // Moving up
            var prevProperty = properties[overIndex - 1];
            newSortOrder = prevProperty
                ? (prevProperty.sortOrder + overProperty.sortOrder) / 2
                : overProperty.sortOrder / 2;
        }
        else {
            // Moving down
            var nextProperty = properties[overIndex + 1];
            newSortOrder = nextProperty
                ? (overProperty.sortOrder + nextProperty.sortOrder) / 2
                : overProperty.sortOrder + 1;
        }
        submit({
            id: activeProperty.id,
            sortOrder: newSortOrder
        }, {
            method: "post",
            action: path_1.path.to.batchPropertyOrder(itemId),
            navigate: false
        });
    }
}
function BatchPropertyComponent(_a) {
    var _b, _c;
    var property = _a.property, isOverlay = _a.isOverlay;
    var t = (0, macro_1.useLingui)().t;
    var dataTypeLabel = (0, configuratorDataTypeLabels_1.useConfiguratorDataTypeLabel)();
    var formatRelativeTime = (0, hooks_1.useDateFormatter)().formatRelativeTime;
    var _d = useBatchProperties(property), isList = _d.isList, onChangeCheckForListType = _d.onChangeCheckForListType;
    var disclosure = (0, react_1.useDisclosure)();
    var deletePropertyDisclosure = (0, react_1.useDisclosure)();
    var submitted = (0, react_2.useRef)(false);
    var fetcher = (0, react_router_1.useFetcher)();
    var _e = (0, sortable_1.useSortable)({
        id: property.id
    }), attributes = _e.attributes, listeners = _e.listeners, setNodeRef = _e.setNodeRef, transform = _e.transform, transition = _e.transition, isDragging = _e.isDragging;
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
    var isUpdated = property.updatedBy !== null;
    var person = isUpdated ? property.updatedBy : property.createdBy;
    var date = (_b = property.updatedAt) !== null && _b !== void 0 ? _b : property.createdAt;
    return (<div ref={setNodeRef} style={style} className={(0, react_1.cn)("p-4 bg-card border rounded-lg", isOverlay ? "ring-2 ring-primary" : isDragging && "opacity-30")}>
      {disclosure.isOpen ? (<form_1.ValidatedForm action={path_1.path.to.batchProperty(property.itemId)} method="post" validator={inventory_models_1.batchPropertyValidator} fetcher={fetcher} resetAfterSubmit onSubmit={function () {
                disclosure.onClose();
            }} defaultValues={{
                id: property.id,
                itemId: property.itemId,
                label: property.label,
                // @ts-expect-error TS2322 - TODO: fix type
                dataType: property.dataType,
                listOptions: (_c = property.listOptions) !== null && _c !== void 0 ? _c : []
            }}>
          <form_1.Hidden name="id"/>
          <form_1.Hidden name="itemId"/>

          <react_1.VStack spacing={4}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <react_1.VStack>
                <Form_1.Input name="label" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Label"], ["Label"])))} autoFocus/>
              </react_1.VStack>

              <form_1.Select name="dataType" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Data Type"], ["Data Type"])))} options={items_models_1.batchPropertyDataTypes.map(function (type) { return ({
                label: (<react_1.HStack className="w-full">
                      <Icons_1.ConfiguratorDataTypeIcon type={type} className="mr-2"/>
                      {dataTypeLabel(type)}
                    </react_1.HStack>),
                value: type
            }); })} onChange={onChangeCheckForListType}/>
              {isList && (<Form_1.Array name="listOptions" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["List Options"], ["List Options"])))}/>)}
            </div>
            <react_1.HStack className="w-full justify-end" spacing={2}>
              <react_1.Button variant="secondary" onClick={disclosure.onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <form_1.Submit isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
                <macro_1.Trans>Save</macro_1.Trans>
              </form_1.Submit>
            </react_1.HStack>
          </react_1.VStack>
        </form_1.ValidatedForm>) : (<div className="flex flex-1 justify-between items-center w-full">
          <react_1.HStack spacing={2} className="w-1/2">
            <react_1.IconButton aria-label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Reorder"], ["Reorder"])))} icon={<lu_1.LuGripVertical />} variant="ghost" {...attributes} {...listeners} className="cursor-grab"/>
            <react_1.HStack spacing={4} className="flex-1">
              <div className="bg-muted border rounded-full flex items-center justify-center p-2">
                <Icons_1.ConfiguratorDataTypeIcon type={property.dataType} className="w-4 h-4"/>
              </div>
              <react_1.VStack spacing={0}>
                <span className="text-sm font-medium">{property.label}</span>
              </react_1.VStack>
            </react_1.HStack>
          </react_1.HStack>
          <div className="flex items-center justify-end gap-2">
            <react_1.HStack spacing={2}>
              <span className="text-xs text-muted-foreground">
                {isUpdated ? t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Updated"], ["Updated"]))) : t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Created"], ["Created"])))} {formatRelativeTime(date)}
              </span>
              <components_1.EmployeeAvatar employeeId={person} withName={false}/>
            </react_1.HStack>
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton aria-label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Open menu"], ["Open menu"])))} icon={<lu_1.LuEllipsisVertical />} variant="ghost"/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent align="end">
                <react_1.DropdownMenuItem onClick={disclosure.onOpen}>
                  <macro_1.Trans>Edit</macro_1.Trans>
                </react_1.DropdownMenuItem>
                <react_1.DropdownMenuItem destructive onClick={deletePropertyDisclosure.onOpen}>
                  <macro_1.Trans>Delete</macro_1.Trans>
                </react_1.DropdownMenuItem>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
          </div>
        </div>)}
      {deletePropertyDisclosure.isOpen && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteBatchProperty(property.itemId, property.id)} isOpen={deletePropertyDisclosure.isOpen} name={property.label} text={"Are you sure you want to delete the ".concat(property.label, " property?")} onCancel={function () {
                deletePropertyDisclosure.onClose();
            }} onSubmit={function () {
                deletePropertyDisclosure.onClose();
            }}/>)}
    </div>);
}
function useBatchProperties(property) {
    var _a = (0, react_2.useState)((property === null || property === void 0 ? void 0 : property.dataType) === "list"), isList = _a[0], setIsList = _a[1];
    var onChangeCheckForListType = function (newValue) {
        if (!newValue)
            return;
        var type = newValue.value;
        setIsList(type === "list");
    };
    return {
        isList: isList,
        onChangeCheckForListType: onChangeCheckForListType,
        setIsList: setIsList
    };
}
function usePendingProperties(_a) {
    var itemId = _a.itemId;
    return (0, react_router_1.useFetchers)()
        .filter(function (fetcher) {
        return fetcher.formAction === path_1.path.to.batchPropertyOrder(itemId);
    })
        .map(function (fetcher) {
        var id = String(fetcher.formData.get("id"));
        var sortOrder = Number(fetcher.formData.get("sortOrder"));
        return { id: id, sortOrder: sortOrder };
    });
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
