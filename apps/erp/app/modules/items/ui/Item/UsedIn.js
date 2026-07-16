"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsedInSkeleton = UsedInSkeleton;
exports.UsedInTree = UsedInTree;
exports.RevisionsItem = RevisionsItem;
exports.UsedInItem = UsedInItem;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var components_1 = require("~/components");
var Modals_1 = require("~/components/Modals");
var TreeView_1 = require("~/components/TreeView");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var utils_1 = require("../Methods/utils");
var RevisionForm_1 = require("./RevisionForm");
function UsedInSkeleton() {
    return (<div className="flex flex-col gap-1 w-full">
      <react_1.Skeleton className="h-7 w-full"/>
      <react_1.Skeleton className="h-7 w-full"/>
      <react_1.Skeleton className="h-7 w-3/4"/>
      <react_1.Skeleton className="h-7 w-1/2"/>
    </div>);
}
var revisionValidator = zod_1.z.array(zod_1.z.object({
    id: zod_1.z.string(),
    revision: zod_1.z.string(),
    methodType: zod_1.z.string(),
    type: zod_1.z.string()
}));
function UsedInTree(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var tree = _a.tree, revisionsJson = _a.revisions, itemReadableId = _a.itemReadableId, itemReadableIdWithRevision = _a.itemReadableIdWithRevision, jobMaterialUsage = _a.jobMaterialUsage, _l = _a.hasSizesInsteadOfRevisions, hasSizesInsteadOfRevisions = _l === void 0 ? false : _l, filterTextProp = _a.filterText, hideSearch = _a.hideSearch;
    var t = (0, macro_1.useLingui)().t;
    var _m = (0, react_2.useState)(""), filterTextInternal = _m[0], setFilterTextInternal = _m[1];
    var filterText = filterTextProp !== null && filterTextProp !== void 0 ? filterTextProp : filterTextInternal;
    var jobMaterialQuantities = (_b = jobMaterialUsage === null || jobMaterialUsage === void 0 ? void 0 : jobMaterialUsage.byMaterialId) !== null && _b !== void 0 ? _b : {};
    var jobQuantities = (_c = jobMaterialUsage === null || jobMaterialUsage === void 0 ? void 0 : jobMaterialUsage.byJobId) !== null && _c !== void 0 ? _c : {};
    var revisions = (_f = ((_e = (_d = revisionValidator.safeParse(revisionsJson)) === null || _d === void 0 ? void 0 : _d.data) !== null && _e !== void 0 ? _e : [])) === null || _f === void 0 ? void 0 : _f.map(function (r) { return ({
        id: r.id,
        documentReadableId: (0, string_1.getReadableIdWithRevision)(itemReadableId, r.revision),
        methodType: r.methodType,
        type: r.type,
        revision: r.revision
    }); });
    return (<react_1.VStack className="w-full p-2">
      {!hideSearch && (<react_1.HStack className="w-full py-1 sticky top-0 z-10 bg-card -mt-2 pt-2 -mx-2 px-2">
          <react_1.InputGroup size="sm" className="flex grow">
            <react_1.InputLeftElement>
              <lu_1.LuSearch className="h-4 w-4"/>
            </react_1.InputLeftElement>
            <react_1.Input placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Search..."], ["Search..."])))} value={filterText} onChange={function (e) { return setFilterTextInternal(e.target.value); }}/>
          </react_1.InputGroup>
        </react_1.HStack>)}
      <react_1.VStack spacing={0}>
        <RevisionsItem filterText={filterText} node={{
            key: (_h = (_g = revisions === null || revisions === void 0 ? void 0 : revisions[0]) === null || _g === void 0 ? void 0 : _g.type) !== null && _h !== void 0 ? _h : "Part",
            name: hasSizesInsteadOfRevisions ? t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Sizes"], ["Sizes"]))) : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Revisions"], ["Revisions"]))),
            module: "parts",
            children: revisions
        }} maxRevision={(_k = (_j = revisions === null || revisions === void 0 ? void 0 : revisions[0]) === null || _j === void 0 ? void 0 : _j.revision) !== null && _k !== void 0 ? _k : ""} hasSizesInsteadOfRevisions={hasSizesInsteadOfRevisions}/>
        {tree.map(function (node) { return (<UsedInItem key={node.key} filterText={filterText} node={node} itemReadableIdWithRevision={itemReadableIdWithRevision} jobMaterialQuantities={jobMaterialQuantities} jobQuantities={jobQuantities}/>); })}
      </react_1.VStack>
    </react_1.VStack>);
}
function RevisionsItem(_a) {
    var node = _a.node, filterText = _a.filterText, maxRevision = _a.maxRevision, _b = _a.hasSizesInsteadOfRevisions, hasSizesInsteadOfRevisions = _b === void 0 ? false : _b;
    var itemId = (0, react_router_1.useParams)().itemId;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var revisionDisclosure = (0, react_1.useDisclosure)();
    var defaultDisclosure = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(), selectedRevision = _c[0], setSelectedRevision = _c[1];
    var _d = (0, react_2.useState)(node.children.length > 0 && node.children.length < 10), isExpanded = _d[0], setIsExpanded = _d[1];
    var filteredChildren = node.children.filter(function (child) {
        return child.documentReadableId.toLowerCase().includes(filterText.toLowerCase());
    });
    return (<>
      <div className="relative w-full">
        <button className="flex h-8 cursor-pointer items-center overflow-hidden rounded-sm px-2 gap-2 text-sm hover:bg-accent w-full font-medium" onClick={function (e) {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
        }}>
          <div className="h-8 w-4 flex items-center justify-center">
            <lu_1.LuChevronRight className={(0, react_1.cn)("size-4", isExpanded && "rotate-90")}/>
          </div>
          <div className="flex flex-grow items-center justify-between gap-2 pr-6">
            <span>{node.name}</span>

            {filteredChildren.length > 0 && (<react_1.Count count={filteredChildren.length}/>)}
          </div>
        </button>
        {permissions.can("create", "parts") && (<react_1.IconButton size="sm" variant="secondary" icon={<lu_1.LuPlus />} aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Create"], ["Create"])))} className="size-5 absolute right-2 top-1.5" onClick={function () {
                (0, react_dom_1.flushSync)(function () {
                    setSelectedRevision({
                        copyFromId: itemId,
                        type: node.key,
                        revision: hasSizesInsteadOfRevisions
                            ? ""
                            : getNextRevision(maxRevision)
                    });
                    revisionDisclosure.onOpen();
                });
            }}/>)}
      </div>
      {isExpanded && (<div className="flex flex-col w-full relative ">
          {node.children.length === 0 ? (<div className="flex h-8 items-center overflow-hidden rounded-sm px-2 gap-4">
              <TreeView_1.LevelLine isSelected={false}/>
              <div className="text-xs text-muted-foreground">
                {t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["No ", " found"], ["No ", " found"])), node.name.toLowerCase())}
              </div>
            </div>) : (filteredChildren.map(function (child, index) {
                var _a;
                var isActive = child.id === itemId;
                return (<div className="relative group/used-in" key={index}>
                  <components_1.Hyperlink to={getUseInLink(child, node.key, "")} className={(0, react_1.cn)("pr-6 flex h-8 cursor-pointer items-center overflow-hidden rounded-sm px-1 gap-4 text-sm hover:bg-accent w-full font-medium whitespace-nowrap", isActive && "bg-accent")}>
                    <TreeView_1.LevelLine isSelected={isActive} className="mr-2"/>
                    <components_1.MethodIcon type={(_a = child.methodType) !== null && _a !== void 0 ? _a : "Method"} className="mr-2"/>
                    <span className="truncate">{child.documentReadableId}</span>
                  </components_1.Hyperlink>
                  {permissions.can("update", "parts") && (<react_1.DropdownMenu>
                      <react_1.DropdownMenuTrigger asChild>
                        <react_1.IconButton size="sm" variant="secondary" icon={<lu_1.LuEllipsisVertical />} aria-label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Edit"], ["Edit"])))} className="absolute right-2 top-1 flex-shrink-0 opacity-0 group-hover/used-in:opacity-100 data-[state=open]:opacity-100"/>
                      </react_1.DropdownMenuTrigger>
                      <react_1.DropdownMenuContent align="end">
                        <react_1.DropdownMenuItem onSelect={function () {
                            (0, react_dom_1.flushSync)(function () {
                                var _a;
                                setSelectedRevision({
                                    id: child.id,
                                    type: node.key,
                                    revision: (_a = child.revision) !== null && _a !== void 0 ? _a : ""
                                });
                                revisionDisclosure.onOpen();
                            });
                        }}>
                          <react_1.DropdownMenuIcon icon={<lu_1.LuPencil />}/>
                          Edit
                        </react_1.DropdownMenuItem>
                        <react_1.DropdownMenuItem onSelect={function () {
                            (0, react_dom_1.flushSync)(function () {
                                var _a;
                                setSelectedRevision({
                                    id: child.id,
                                    type: node.key,
                                    revision: (_a = child.revision) !== null && _a !== void 0 ? _a : ""
                                });
                                defaultDisclosure.onOpen();
                            });
                        }}>
                          <react_1.DropdownMenuIcon icon={<lu_1.LuStar />}/>
                          Set as Default{" "}
                          {hasSizesInsteadOfRevisions ? "Size" : "Revision"}
                        </react_1.DropdownMenuItem>
                      </react_1.DropdownMenuContent>
                    </react_1.DropdownMenu>)}
                </div>);
            }))}
        </div>)}

      {revisionDisclosure.isOpen && selectedRevision && (<RevisionForm_1.default initialValues={selectedRevision} onClose={revisionDisclosure.onClose} hasSizesInsteadOfRevisions={hasSizesInsteadOfRevisions}/>)}
      {defaultDisclosure.isOpen && selectedRevision && (<Modals_1.Confirm action={path_1.path.to.defaultRevision(selectedRevision.id)} confirmText={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Make Default"], ["Make Default"])))} title={hasSizesInsteadOfRevisions
                ? t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Make size ", " default?"], ["Make size ", " default?"])), selectedRevision.revision) : t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Make revision ", " default?"], ["Make revision ", " default?"])), selectedRevision.revision)} text={hasSizesInsteadOfRevisions
                ? t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["This will replace all method materials of other sizes with this size."], ["This will replace all method materials of other sizes with this size."]))) : t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["This will replace all method materials of other revisions with this revision."], ["This will replace all method materials of other revisions with this revision."])))} isOpen onSubmit={function () {
                defaultDisclosure.onClose();
                setSelectedRevision(null);
            }} onCancel={defaultDisclosure.onClose}/>)}
    </>);
}
function getNextRevision(maxRevision) {
    if (/^\d+$/.test(maxRevision)) {
        return (parseInt(maxRevision) + 1).toString();
    }
    else if (/^[A-Z]{1,2}$/.test(maxRevision)) {
        // Handle single letter case
        if (maxRevision.length === 1) {
            return maxRevision === "Z"
                ? "AA"
                : String.fromCharCode(maxRevision.charCodeAt(0) + 1);
        }
        // Handle double letter case
        var firstChar = maxRevision[0];
        var secondChar = maxRevision[1];
        if (secondChar === "Z") {
            return String.fromCharCode(firstChar.charCodeAt(0) + 1) + "A";
        }
        return firstChar + String.fromCharCode(secondChar.charCodeAt(0) + 1);
    }
    return maxRevision;
}
function UsedInItem(_a) {
    var node = _a.node, itemReadableIdWithRevision = _a.itemReadableIdWithRevision, filterText = _a.filterText, jobMaterialQuantities = _a.jobMaterialQuantities, jobQuantities = _a.jobQuantities;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)(node.children.length > 0 && node.children.length < 10), isExpanded = _b[0], setIsExpanded = _b[1];
    var permissions = (0, hooks_1.usePermissions)();
    if (!permissions.can("view", node.module)) {
        return null;
    }
    var filteredChildren = node.children.filter(function (child) {
        return child.documentReadableId.toLowerCase().includes(filterText.toLowerCase());
    });
    return (<>
      <button className="flex h-8 cursor-pointer items-center overflow-hidden rounded-sm px-2 gap-2 text-sm hover:bg-accent w-full font-medium" onClick={function (e) {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
        }}>
        <div className="h-8 w-4 flex items-center justify-center">
          <lu_1.LuChevronRight className={(0, react_1.cn)("size-4", isExpanded && "rotate-90")}/>
        </div>
        <div className="flex flex-grow items-center justify-between gap-2">
          <span>{node.name}</span>
          {filteredChildren.length > 0 && (<react_1.Count count={filteredChildren.length}/>)}
        </div>
      </button>
      {isExpanded && (<div className="flex flex-col w-full">
          {node.children.length === 0 ? (<div className="flex h-8 items-center overflow-hidden rounded-sm px-2 gap-4">
              <TreeView_1.LevelLine isSelected={false}/>
              <div className="text-xs text-muted-foreground">
                {t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["No ", " found"], ["No ", " found"])), node.name.toLowerCase())}
              </div>
            </div>) : (filteredChildren.map(function (child, index) {
                var _a;
                return (<components_1.Hyperlink key={index} to={getUseInLink(child, node.key, itemReadableIdWithRevision)} className="flex h-8 cursor-pointer items-center overflow-hidden rounded-sm px-1 gap-4 text-sm hover:bg-accent w-full font-medium whitespace-nowrap">
                <TreeView_1.LevelLine isSelected={false} className="mr-2"/>
                {child.methodType === "Shipment" ? (<lu_1.LuTruck className="mr-2 text-indigo-600"/>) : node.module === "quality" ? (<lu_1.LuShieldX className="mr-2 text-red-600"/>) : (<components_1.MethodIcon type={(_a = child.methodType) !== null && _a !== void 0 ? _a : "Method"} className="mr-2"/>)}
                <span className="truncate">{child.documentReadableId}</span>
                {node.key === "jobMaterials" &&
                        jobMaterialQuantities &&
                        child.id in jobMaterialQuantities && (<react_1.Tooltip>
                      <react_1.TooltipTrigger asChild>
                        <react_1.Badge variant="outline" className="ml-2">
                          {jobMaterialQuantities[child.id]}
                        </react_1.Badge>
                      </react_1.TooltipTrigger>
                      <react_1.TooltipContent>
                        Estimated quantity required for this job material
                      </react_1.TooltipContent>
                    </react_1.Tooltip>)}
                {node.key === "jobs" &&
                        jobQuantities &&
                        child.id in jobQuantities && (<react_1.Tooltip>
                      <react_1.TooltipTrigger asChild>
                        <react_1.Badge variant="outline" className="ml-2">
                          {jobQuantities[child.id]}
                        </react_1.Badge>
                      </react_1.TooltipTrigger>
                      <react_1.TooltipContent>
                        Production quantity for this job
                      </react_1.TooltipContent>
                    </react_1.Tooltip>)}
                {child.version && (<react_1.Badge variant="outline" className="ml-2">
                    V{child.version}
                  </react_1.Badge>)}
              </components_1.Hyperlink>);
            }))}
        </div>)}
    </>);
}
function getUseInLink(child, key, itemReadableIdWithRevision) {
    switch (key) {
        case "Part":
            return path_1.path.to.partDetails(child.id);
        case "Material":
            return path_1.path.to.materialDetails(child.id);
        case "Tool":
            return path_1.path.to.toolDetails(child.id);
        case "Consumable":
            return path_1.path.to.consumableDetails(child.id);
        case "Service":
            return path_1.path.to.serviceDetails(child.id);
        case "issues":
            if (!child.documentId)
                return "#";
            return path_1.path.to.issue(child.documentId);
        case "jobs":
            return path_1.path.to.job(child.id);
        case "jobMaterials":
            if (!child.documentId)
                return "#";
            return "".concat(path_1.path.to.jobMaterials(child.documentId), "?filter=readableIdWithRevision:eq:").concat(itemReadableIdWithRevision);
        case "maintenanceDispatchItems":
            if (!child.documentId)
                return "#";
            return path_1.path.to.maintenanceDispatch(child.documentId);
        case "methodMaterials":
            if (!child.documentId || !child.itemType)
                return "#";
            return (0, utils_1.getPathToMakeMethod)(child.itemType, child.documentParentId, child.documentId);
        case "purchaseOrderLines":
            if (!child.documentId)
                return "#";
            return path_1.path.to.purchaseOrder(child.documentId);
        case "receiptLines":
            if (!child.documentId)
                return "#";
            return path_1.path.to.receipt(child.documentId);
        case "quoteLines":
            if (!child.documentId)
                return "#";
            return path_1.path.to.quote(child.documentId);
        case "quoteMaterials":
            if (!child.documentId || !child.documentParentId)
                return "#";
            return path_1.path.to.quoteLine(child.documentParentId, child.documentId);
        case "salesOrderLines":
            if (!child.documentId)
                return "#";
            return path_1.path.to.salesOrder(child.documentId);
        case "shipmentLines":
            if (!child.documentId)
                return "#";
            return path_1.path.to.shipment(child.documentId);
        case "supplierQuotes":
            if (!child.documentId)
                return "#";
            return path_1.path.to.supplierQuote(child.documentId);
        default:
            return "#";
    }
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
