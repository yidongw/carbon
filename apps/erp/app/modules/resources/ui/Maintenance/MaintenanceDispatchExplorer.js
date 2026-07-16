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
exports.MaintenanceDispatchExplorerSkeleton = MaintenanceDispatchExplorerSkeleton;
exports.MaintenanceDispatchExplorer = MaintenanceDispatchExplorer;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var Modals_1 = require("~/components/Modals");
var TreeView_1 = require("~/components/TreeView");
var hooks_1 = require("~/hooks");
var ItemForm_1 = require("~/modules/items/ui/Item/ItemForm");
var items_1 = require("~/stores/items");
var path_1 = require("~/utils/path");
var resources_models_1 = require("../../resources.models");
var MaintenanceAddPartModal_1 = require("./MaintenanceAddPartModal");
function MaintenanceDispatchExplorerSkeleton() {
    return (<div className="flex flex-col gap-1 w-full">
      <react_1.Skeleton className="h-7 w-full"/>
      <react_1.Skeleton className="h-7 w-full"/>
      <react_1.Skeleton className="h-7 w-3/4"/>
    </div>);
}
function MaintenanceDispatchExplorer(_a) {
    var _b;
    var items = _a.items, events = _a.events;
    var t = (0, macro_1.useLingui)().t;
    var locale = (0, i18n_1.useLocale)().locale;
    var dispatchId = (0, react_router_1.useParams)().dispatchId;
    if (!dispatchId)
        throw new Error("dispatchId not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.maintenanceDispatch(dispatchId));
    var isLocked = (0, resources_models_1.isMaintenanceDispatchLocked)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _b === void 0 ? void 0 : _b.status);
    var _c = (0, react_2.useState)(""), filterText = _c[0], setFilterText = _c[1];
    var deleteDisclosure = (0, react_1.useDisclosure)();
    var editDisclosure = (0, react_1.useDisclosure)();
    var _d = (0, react_2.useState)(null), selectedChild = _d[0], setSelectedChild = _d[1];
    var onDelete = function (child) {
        (0, react_dom_1.flushSync)(function () {
            setSelectedChild(child);
        });
        deleteDisclosure.onOpen();
    };
    var onDeleteCancel = function () {
        setSelectedChild(null);
        deleteDisclosure.onClose();
    };
    var onEdit = function (child) {
        (0, react_dom_1.flushSync)(function () {
            setSelectedChild(child);
        });
        editDisclosure.onOpen();
    };
    var onEditClose = function () {
        setSelectedChild(null);
        editDisclosure.onClose();
    };
    var getDeleteAction = function () {
        if (!selectedChild)
            return "";
        if (selectedChild.type === "item") {
            return path_1.path.to.deleteMaintenanceDispatchItem(dispatchId, selectedChild.id);
        }
        return path_1.path.to.deleteMaintenanceDispatchEvent(dispatchId, selectedChild.id);
    };
    var getDeleteName = function () {
        var _a, _b;
        if (!selectedChild)
            return "";
        if (selectedChild.type === "item") {
            return (_b = (_a = selectedChild.item) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "Item";
        }
        return selectedChild.startTime
            ? new Date(selectedChild.startTime).toLocaleString(locale)
            : "Timecard";
    };
    var tree = [
        {
            key: "items",
            name: "Item",
            pluralName: "Items",
            children: items.map(function (item) { return (__assign(__assign({}, item), { type: "item" })); })
        },
        {
            key: "events",
            name: "Timecard",
            pluralName: "Timecards",
            children: events.map(function (event) { return (__assign(__assign({}, event), { type: "event" })); })
        }
    ];
    return (<react_1.ScrollArea className="h-full">
      <react_1.VStack className="px-2">
        <react_1.HStack className="w-full py-2">
          <react_1.InputGroup size="sm" className="flex flex-grow">
            <react_1.InputLeftElement>
              <lu_1.LuSearch className="h-4 w-4"/>
            </react_1.InputLeftElement>
            <react_1.Input placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Search..."], ["Search..."])))} value={filterText} onChange={function (e) { return setFilterText(e.target.value); }}/>
          </react_1.InputGroup>
        </react_1.HStack>
        <react_1.VStack spacing={0}>
          {tree.map(function (node) { return (<MaintenanceExplorerItem key={node.key} node={node} filterText={filterText} dispatchId={dispatchId} isLocked={isLocked} onDelete={onDelete} onEdit={onEdit}/>); })}
        </react_1.VStack>
      </react_1.VStack>
      {deleteDisclosure.isOpen && (selectedChild === null || selectedChild === void 0 ? void 0 : selectedChild.id) && (<Modals_1.ConfirmDelete action={getDeleteAction()} name={getDeleteName()} text={"Are you sure you want to remove this ".concat(selectedChild.type === "item" ? "item" : "timecard", "?")} isOpen={deleteDisclosure.isOpen} onCancel={onDeleteCancel} onSubmit={onDeleteCancel}/>)}
      {editDisclosure.isOpen &&
            (selectedChild === null || selectedChild === void 0 ? void 0 : selectedChild.id) &&
            selectedChild.type === "event" && (<EditTimecardModal open={editDisclosure.isOpen} onClose={onEditClose} dispatchId={dispatchId} event={selectedChild}/>)}
    </react_1.ScrollArea>);
}
function MaintenanceExplorerItem(_a) {
    var node = _a.node, filterText = _a.filterText, dispatchId = _a.dispatchId, isLocked = _a.isLocked, onDelete = _a.onDelete, onEdit = _a.onEdit;
    var t = (0, macro_1.useLingui)().t;
    var locale = (0, i18n_1.useLocale)().locale;
    var _b = (0, react_2.useState)(node.children.length > 0 && node.children.length < 10), isExpanded = _b[0], setIsExpanded = _b[1];
    var newModal = (0, react_1.useDisclosure)();
    var permissions = (0, hooks_1.usePermissions)();
    var filteredChildren = node.children.filter(function (child) {
        var searchText = getChildSearchText(child, locale);
        return searchText.toLowerCase().includes(filterText.toLowerCase());
    });
    return (<>
      <div className="flex h-8 items-center overflow-hidden rounded-sm px-2 gap-2 text-sm w-full hover:bg-accent">
        <button className="flex flex-grow cursor-pointer items-center overflow-hidden font-medium" onClick={function (e) {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
        }}>
          <div className="h-8 w-4 flex items-center justify-center">
            <lu_1.LuChevronRight className={(0, react_1.cn)("size-4", isExpanded && "rotate-90")}/>
          </div>
          <div className="flex flex-grow items-center justify-between gap-2">
            <span>{node.pluralName}</span>
            {filteredChildren.length > 0 && (<react_1.Count count={filteredChildren.length}/>)}
          </div>
        </button>
        {permissions.can("update", "resources") && !isLocked && (<react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Add"], ["Add"])))} size="sm" variant="ghost" icon={<lu_1.LuCirclePlus />} className="ml-auto" onClick={function () {
                newModal.onOpen();
            }}/>)}
      </div>

      {isExpanded && (<div className="flex flex-col w-full px-2">
          {node.children.length === 0 ? (<div className="flex h-8 items-center overflow-hidden rounded-sm px-2 gap-4">
              <TreeView_1.LevelLine isSelected={false}/>
              <div className="text-xs text-muted-foreground">
                No {node.name.toLowerCase()} found
              </div>
            </div>) : (filteredChildren.map(function (child) { return (<MaintenanceExplorerChildItem key={child.id} child={child} nodeKey={node.key} dispatchId={dispatchId} isLocked={isLocked} onDelete={onDelete} onEdit={onEdit}/>); }))}
        </div>)}

      {newModal.isOpen && node.key === "items" && (<MaintenanceAddPartModal_1.MaintenanceAddPartModal dispatchId={dispatchId} onClose={newModal.onClose}/>)}
      {newModal.isOpen && node.key === "events" && (<NewTimecardModal open={newModal.isOpen} onClose={newModal.onClose} dispatchId={dispatchId}/>)}
    </>);
}
function MaintenanceExplorerChildItem(_a) {
    var _b;
    var child = _a.child, nodeKey = _a.nodeKey, dispatchId = _a.dispatchId, isLocked = _a.isLocked, onDelete = _a.onDelete, onEdit = _a.onEdit;
    var t = (0, macro_1.useLingui)().t;
    var locale = (0, i18n_1.useLocale)().locale;
    var items = (0, items_1.useItems)()[0];
    var link = getChildLink(child, items);
    var icon = getChildIcon(child);
    var label = getChildLabel(child, locale);
    var permissions = (0, hooks_1.usePermissions)();
    var content = (<div className="flex pr-7 h-8 cursor-pointer items-center overflow-hidden rounded-sm px-1 gap-2 text-sm hover:bg-accent w-full font-medium whitespace-nowrap">
      <TreeView_1.LevelLine isSelected={false}/>
      <div className="flex flex-grow items-center gap-2">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      {child.type === "item" && <react_1.Count count={(_b = child.quantity) !== null && _b !== void 0 ? _b : 0}/>}
    </div>);
    return (<div className="group/child relative flex w-full">
      {link ? (<react_router_1.Link to={link} className="flex w-full">
          {content}
        </react_router_1.Link>) : (<div className="flex w-full">{content}</div>)}
      {permissions.can("update", "resources") && !isLocked && (<react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Options"], ["Options"])))} icon={<lu_1.LuEllipsisVertical />} variant="ghost" size="sm" className="absolute right-1 top-1 flex-shrink-0 opacity-0 group-hover/child:opacity-100 data-[state=open]:opacity-100 text-foreground/70 hover:text-foreground"/>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent>
            {child.type === "event" && (<react_1.DropdownMenuItem onSelect={function () {
                    onEdit(child);
                }}>
                <react_1.DropdownMenuIcon icon={<lu_1.LuPencil />}/>
                <macro_1.Trans>Edit</macro_1.Trans>
              </react_1.DropdownMenuItem>)}
            {permissions.can("delete", "resources") && (<react_1.DropdownMenuItem destructive onSelect={function () {
                    onDelete(child);
                }}>
                <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                <macro_1.Trans>Delete</macro_1.Trans>
              </react_1.DropdownMenuItem>)}
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>)}
    </div>);
}
function NewTimecardModal(_a) {
    var open = _a.open, onClose = _a.onClose, dispatchId = _a.dispatchId;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if (fetcher.state === "idle" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === true) {
            onClose();
        }
    }, [fetcher.state, fetcher.data, onClose]);
    return (<react_1.Modal open={open} onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" action={path_1.path.to.newMaintenanceDispatchEvent(dispatchId)} validator={resources_models_1.maintenanceDispatchEventValidator} fetcher={fetcher}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              <macro_1.Trans>Add Timecard</macro_1.Trans>
            </react_1.ModalTitle>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <form_1.Hidden name="maintenanceDispatchId" value={dispatchId}/>
            <react_1.VStack spacing={4}>
              <Form_1.Employee name="employeeId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Employee"], ["Employee"])))}/>
              <Form_1.WorkCenter name="workCenterId" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Work Center"], ["Work Center"])))}/>
              <form_1.DateTimePicker name="startTime" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Start Time"], ["Start Time"])))}/>
              <form_1.DateTimePicker name="endTime" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["End Time"], ["End Time"])))}/>
              <Form_1.TextArea name="notes" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Notes"], ["Notes"])))}/>
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <form_1.Submit>
              <macro_1.Trans>Add</macro_1.Trans>
            </form_1.Submit>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
function EditTimecardModal(_a) {
    var _b, _c, _d, _e;
    var open = _a.open, onClose = _a.onClose, dispatchId = _a.dispatchId, event = _a.event;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if (fetcher.state === "idle" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === true) {
            onClose();
        }
    }, [fetcher.state, fetcher.data, onClose]);
    return (<react_1.Modal open={open} onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" action={path_1.path.to.editMaintenanceDispatchEvent(dispatchId, event.id)} validator={resources_models_1.maintenanceDispatchEventValidator} fetcher={fetcher} defaultValues={{
            maintenanceDispatchId: dispatchId,
            employeeId: (_b = event.employee) === null || _b === void 0 ? void 0 : _b.id,
            workCenterId: (_c = event.workCenter) === null || _c === void 0 ? void 0 : _c.id,
            startTime: event.startTime,
            endTime: (_d = event.endTime) !== null && _d !== void 0 ? _d : undefined,
            notes: (_e = event.notes) !== null && _e !== void 0 ? _e : undefined
        }}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              <macro_1.Trans>Edit Timecard</macro_1.Trans>
            </react_1.ModalTitle>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <form_1.Hidden name="maintenanceDispatchId" value={dispatchId}/>
            <react_1.VStack spacing={4}>
              <Form_1.Employee name="employeeId" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Employee"], ["Employee"])))}/>
              <Form_1.WorkCenter name="workCenterId" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Work Center"], ["Work Center"])))}/>
              <form_1.DateTimePicker name="startTime" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Start Time"], ["Start Time"])))}/>
              <form_1.DateTimePicker name="endTime" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["End Time"], ["End Time"])))}/>
              <Form_1.TextArea name="notes" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Notes"], ["Notes"])))}/>
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <form_1.Submit>
              <macro_1.Trans>Save</macro_1.Trans>
            </form_1.Submit>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
function getChildIcon(child) {
    switch (child.type) {
        case "item":
            return <lu_1.LuBox className="text-blue-500"/>;
        case "event":
            // Blue clock for open (no end time), green check for completed (has end time)
            if (child.endTime) {
                return <lu_1.LuCircleCheck className="text-green-500"/>;
            }
            return <lu_1.LuClock className="text-blue-500"/>;
        default:
            return null;
    }
}
function getChildLabel(child, locale) {
    var _a, _b, _c;
    switch (child.type) {
        case "item":
            return (_b = (_a = child.item) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : child.itemId;
        case "event": {
            var employeeName = (_c = child.employee) === null || _c === void 0 ? void 0 : _c.fullName;
            var timeLabel = child.startTime
                ? new Date(child.startTime).toLocaleString(locale)
                : "Timecard";
            return employeeName ? "".concat(employeeName, " - ").concat(timeLabel) : timeLabel;
        }
        default:
            return "";
    }
}
function getChildSearchText(child, locale) {
    var _a, _b, _c;
    switch (child.type) {
        case "item":
            return (_b = (_a = child.item) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : child.itemId;
        case "event": {
            var parts = [
                (_c = child.employee) === null || _c === void 0 ? void 0 : _c.fullName,
                child.notes,
                child.startTime
                    ? new Date(child.startTime).toLocaleString(locale)
                    : null
            ].filter(Boolean);
            return parts.join(" ");
        }
        default:
            return "";
    }
}
function getChildLink(child, items) {
    switch (child.type) {
        case "item": {
            var item = items.find(function (i) { return i.id === child.itemId; });
            if (!item)
                return null;
            return (0, ItemForm_1.getLinkToItemDetails)(item.type, child.itemId);
        }
        default:
            return null;
    }
}
exports.default = MaintenanceDispatchExplorer;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13;
