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
exports.AssociatedItemsList = AssociatedItemsList;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var hooks_1 = require("~/hooks");
var TrackedEntityStatus_1 = require("~/modules/inventory/ui/Traceability/TrackedEntityStatus");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var quality_models_1 = require("../../quality.models");
var DispositionStatus_1 = require("./DispositionStatus");
function EntityLabel(_a) {
    var _b;
    var link = _a.link;
    var readableId = (_b = link.trackedEntity) === null || _b === void 0 ? void 0 : _b.readableId;
    var idSlice = link.trackedEntityId.slice(-8);
    if (readableId) {
        return (<span className="font-mono truncate">
        {readableId}
        <span className="text-muted-foreground"> / {idSlice}</span>
      </span>);
    }
    return <span className="font-mono truncate">{idSlice}</span>;
}
function AssociatedItemsList(_a) {
    var associatedItems = _a.associatedItems, _b = _a.isDisabled, isDisabled = _b === void 0 ? false : _b;
    var items = (0, stores_1.useItems)()[0];
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var splitFetcher = (0, react_router_1.useFetcher)();
    var assignFetcher = (0, react_router_1.useFetcher)();
    var _c = (0, react_2.useState)(null), splitTarget = _c[0], setSplitTarget = _c[1];
    var _d = (0, react_2.useState)(null), moveTarget = _d[0], setMoveTarget = _d[1];
    var _e = (0, react_2.useState)(null), dragOverRowId = _e[0], setDragOverRowId = _e[1];
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.error) {
            react_1.toast.error(fetcher.data.error.message);
        }
    }, [fetcher.data]);
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (splitFetcher.data &&
            "error" in splitFetcher.data &&
            ((_a = splitFetcher.data) === null || _a === void 0 ? void 0 : _a.error)) {
            react_1.toast.error(splitFetcher.data.error.message);
        }
        if (splitFetcher.state === "idle" && ((_b = splitFetcher.data) === null || _b === void 0 ? void 0 : _b.success)) {
            setSplitTarget(null);
        }
    }, [splitFetcher.data, splitFetcher.state]);
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (assignFetcher.data &&
            "error" in assignFetcher.data &&
            ((_a = assignFetcher.data) === null || _a === void 0 ? void 0 : _a.error)) {
            react_1.toast.error(assignFetcher.data.error.message);
        }
        if (assignFetcher.state === "idle" &&
            ((_b = assignFetcher.data) === null || _b === void 0 ? void 0 : _b.success)) {
            setMoveTarget(null);
        }
    }, [assignFetcher.data, assignFetcher.state]);
    var onUpdateDisposition = (0, react_2.useCallback)(function (nonConformanceItemId, dispositionValue) {
        var formData = new FormData();
        formData.append("id", nonConformanceItemId);
        formData.append("field", "disposition");
        formData.append("value", dispositionValue !== null && dispositionValue !== void 0 ? dispositionValue : "");
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.updateIssueItem
        });
    }, [fetcher]);
    var onUpdateQuantity = (0, react_2.useCallback)(function (nonConformanceItemId, quantityValue) {
        var _a;
        var formData = new FormData();
        formData.append("id", nonConformanceItemId);
        formData.append("field", "quantity");
        formData.append("value", (_a = quantityValue === null || quantityValue === void 0 ? void 0 : quantityValue.toString()) !== null && _a !== void 0 ? _a : "0");
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.updateIssueItem
        });
    }, [fetcher]);
    var onMoveEntity = (0, react_2.useCallback)(function (sourceRowId, targetRowId, assignment) {
        var formData = new FormData();
        formData.append("nonConformanceItemId", sourceRowId);
        formData.append("targetItemId", targetRowId);
        formData.append("entityAssignments", JSON.stringify([assignment]));
        assignFetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.assignIssueItemEntities
        });
    }, [assignFetcher]);
    var rows = (0, react_2.useMemo)(function () {
        if (!associatedItems)
            return [];
        return associatedItems.map(function (child) {
            var _a;
            var row = child;
            var links = Array.isArray(row.links) ? row.links : [];
            var quantity = Number((_a = row.quantity) !== null && _a !== void 0 ? _a : 0);
            var linkedSum = links.reduce(function (acc, l) { var _a; return acc + Number((_a = l.quantity) !== null && _a !== void 0 ? _a : 0); }, 0);
            return {
                child: child,
                row: row,
                links: links,
                quantity: quantity,
                linkedSum: linkedSum,
                disposition: row.disposition,
                pending: !row.disposition || row.disposition === "Pending" ? true : false,
                sumMismatch: Math.abs(linkedSum - quantity) > 1e-6
            };
        });
    }, [associatedItems]);
    if (!associatedItems || associatedItems.length === 0) {
        return null;
    }
    // Disposition only applies to rows that route physical tracked entities.
    // Hide the entire card when nothing here is dispositionable (e.g. an NCR
    // from a non-tracked job-operation part), matching the closure validator's
    // skip-on-no-links rule.
    var dispositionableRows = rows.filter(function (r) { return r.links.length > 0; });
    if (dispositionableRows.length === 0) {
        return null;
    }
    var canEdit = permissions.can("update", "quality") && !isDisabled;
    var blockingRows = dispositionableRows.filter(function (r) { return r.pending || r.sumMismatch; });
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.CardTitle>
          {dispositionableRows.length > 1 ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Dispositions"], ["Dispositions"]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Disposition"], ["Disposition"])))}
        </react_1.CardTitle>
      </react_1.CardHeader>
      <react_1.CardContent>
        {blockingRows.length > 0 && (<react_1.Alert variant="warning" className="mb-4">
            <lu_1.LuTriangleAlert className="size-4"/>
            <react_1.AlertTitle>
              <macro_1.Trans>Closure blocked</macro_1.Trans>
            </react_1.AlertTitle>
            <react_1.AlertDescription>
              <macro_1.Trans>
                Resolve these before completing the NCR: every row must have a
                non-Pending disposition, and its linked entity quantities must
                match the row quantity.
              </macro_1.Trans>
            </react_1.AlertDescription>
          </react_1.Alert>)}
        <ul className="flex flex-col divide-y divide-border">
          {dispositionableRows.map(function (r) {
            var _a;
            var item = items.find(function (i) { return i.id === r.child.documentId; });
            if (!item)
                return null;
            var sameItemSiblings = dispositionableRows.filter(function (s) {
                return s.child.id !== r.child.id &&
                    s.child.documentId === r.child.documentId;
            });
            var siblings = dispositionableRows
                .filter(function (s) { return s.child.id !== r.child.id; })
                .map(function (s) {
                var _a;
                return ({
                    id: s.child.id,
                    disposition: ((_a = s.disposition) !== null && _a !== void 0 ? _a : "Pending"),
                    itemReadableId: item.readableIdWithRevision
                });
            });
            var isDropTarget = canEdit &&
                sameItemSiblings.length > 0 &&
                dragOverRowId === r.child.id;
            return (<li key={r.child.id} className={"py-4 first:pt-0 last:pb-0 transition-colors rounded-md ".concat(isDropTarget ? "bg-accent/40 ring-2 ring-accent" : "")} data-blocked={r.pending || r.sumMismatch ? "true" : undefined} onDragOver={function (e) {
                    if (!canEdit)
                        return;
                    var marker = "application/x-issue-item:".concat(item.id).toLowerCase();
                    var matches = Array.from(e.dataTransfer.types).some(function (t) { return t.toLowerCase() === marker; });
                    if (!matches)
                        return;
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    setDragOverRowId(r.child.id);
                }} onDragLeave={function (e) {
                    if (e.currentTarget.contains(e.relatedTarget))
                        return;
                    setDragOverRowId(function (id) { return (id === r.child.id ? null : id); });
                }} onDrop={function (e) {
                    if (!canEdit)
                        return;
                    setDragOverRowId(null);
                    var payload = e.dataTransfer.getData("application/json");
                    if (!payload)
                        return;
                    try {
                        var data = JSON.parse(payload);
                        if (data.itemId !== item.id)
                            return;
                        if (data.sourceRowId === r.child.id)
                            return;
                        e.preventDefault();
                        onMoveEntity(data.sourceRowId, r.child.id, {
                            trackedEntityId: data.trackedEntityId,
                            quantity: data.quantity
                        });
                    }
                    catch (_a) {
                        // ignore malformed drag payload
                    }
                }}>
                <div className="flex items-center w-full gap-4">
                  <div className="flex flex-col min-w-0 flex-1">
                    <h3 className="font-semibold truncate">
                      {item.readableIdWithRevision}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.name}
                    </p>
                  </div>
                  <form_1.ValidatedForm key={"".concat(r.child.id, "-").concat(r.quantity)} defaultValues={{
                    quantity: r.quantity
                }} validator={quality_models_1.itemQuantityValidator} className="w-24 shrink-0">
                    <form_1.Number label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Quantity"], ["Quantity"])))} name="quantity" isReadOnly={!canEdit || r.links.length > 0} minValue={0} size="sm" onBlur={function (e) {
                    var target = e.target;
                    var numValue = parseFloat(target.value) || 0;
                    onUpdateQuantity(r.child.id, numValue);
                }}/>
                  </form_1.ValidatedForm>
                  <form_1.ValidatedForm defaultValues={{
                    disposition: (_a = r.disposition) !== null && _a !== void 0 ? _a : "Pending"
                }} validator={zod_1.z.object({
                    disposition: zod_1.z.string()
                })} className="w-[120px] shrink-0 items-center">
                    <form_1.Select options={quality_models_1.disposition.map(function (d) { return ({
                    value: d,
                    label: <DispositionStatus_1.DispositionStatus disposition={d}/>
                }); })} isReadOnly={!canEdit} label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Status"], ["Status"])))} name="disposition" inline={function (value) {
                    return (<div className="h-8 flex items-center">
                            <DispositionStatus_1.DispositionStatus disposition={value}/>
                          </div>);
                }} onChange={function (value) {
                    if (value) {
                        onUpdateDisposition(r.child.id, value.value);
                    }
                }}/>
                  </form_1.ValidatedForm>
                  <div className="w-10 shrink-0 flex items-end justify-end">
                    {canEdit && r.links.length > 0 && (<react_1.DropdownMenu>
                        <react_1.DropdownMenuTrigger asChild>
                          <react_1.IconButton size="md" variant="secondary" aria-label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["More actions"], ["More actions"])))} icon={<lu_1.LuEllipsisVertical />}/>
                        </react_1.DropdownMenuTrigger>
                        <react_1.DropdownMenuContent align="end">
                          {r.quantity > 1 && (<react_1.DropdownMenuItem onClick={function () {
                            return setSplitTarget({
                                id: r.child.id,
                                itemId: item.id,
                                maxQuantity: r.quantity,
                                itemReadableId: item.readableIdWithRevision,
                                links: r.links
                            });
                        }}>
                              <lu_1.LuSplit className="mr-2 size-4"/>
                              <macro_1.Trans>Split line</macro_1.Trans>
                            </react_1.DropdownMenuItem>)}
                          {siblings.length > 0 && (<react_1.DropdownMenuItem onClick={function () {
                            return setMoveTarget({
                                sourceRowId: r.child.id,
                                links: r.links,
                                siblings: siblings
                            });
                        }}>
                              <lu_1.LuArrowRightLeft className="mr-2 size-4"/>
                              <macro_1.Trans>Move entities…</macro_1.Trans>
                            </react_1.DropdownMenuItem>)}
                        </react_1.DropdownMenuContent>
                      </react_1.DropdownMenu>)}
                  </div>
                </div>

                {r.links.length > 0 && (<ul className="mt-3 flex flex-wrap gap-1.5 pl-0.5">
                    {r.links.map(function (link) {
                        var _a;
                        var draggable = canEdit && sameItemSiblings.length > 0;
                        return (<li key={link.id} draggable={draggable} onDragStart={function (e) {
                                if (!draggable)
                                    return;
                                e.dataTransfer.effectAllowed = "move";
                                e.dataTransfer.setData("application/json", JSON.stringify({
                                    sourceRowId: r.child.id,
                                    itemId: item.id,
                                    trackedEntityId: link.trackedEntityId,
                                    quantity: Number(link.quantity)
                                }));
                                e.dataTransfer.setData("application/x-issue-item:".concat(item.id), "1");
                            }} className={"inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 py-1 pl-2.5 pr-1.5 text-xs ".concat(draggable
                                ? "cursor-grab active:cursor-grabbing hover:bg-muted/70"
                                : "")}>
                          <EntityLabel link={link}/>
                          <TrackedEntityStatus_1.default status={(_a = link.trackedEntity) === null || _a === void 0 ? void 0 : _a.status}/>
                        </li>);
                    })}
                  </ul>)}

                {r.sumMismatch && (<p className="mt-2 text-xs text-warning-foreground">
                    <macro_1.Trans>
                      Linked entity quantity ({r.linkedSum}) does not match row
                      quantity ({r.quantity}).
                    </macro_1.Trans>
                  </p>)}
              </li>);
        })}
        </ul>
      </react_1.CardContent>

      {splitTarget && (<SplitLineModal target={splitTarget} fetcher={splitFetcher} onClose={function () { return setSplitTarget(null); }}/>)}

      {moveTarget && (<MoveEntitiesModal target={moveTarget} fetcher={assignFetcher} onClose={function () { return setMoveTarget(null); }}/>)}
    </react_1.Card>);
}
function SplitLineModal(_a) {
    var target = _a.target, fetcher = _a.fetcher, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var isSubmitting = fetcher.state !== "idle";
    var hasMultipleEntities = target.links.length > 1;
    var _b = (0, react_2.useState)({}), selected = _b[0], setSelected = _b[1];
    var selectedAssignments = target.links
        .filter(function (l) { return selected[l.trackedEntityId]; })
        .map(function (l) { return ({
        trackedEntityId: l.trackedEntityId,
        quantity: Number(l.quantity)
    }); });
    var selectedSum = selectedAssignments.reduce(function (acc, a) { return acc + a.quantity; }, 0);
    var canSubmit = hasMultipleEntities
        ? selectedAssignments.length > 0 &&
            selectedSum > 0 &&
            selectedSum < target.maxQuantity
        : true;
    return (<react_1.Modal open onOpenChange={function (next) {
            if (!next)
                onClose();
        }}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Split line</macro_1.Trans>
          </react_1.ModalTitle>
          <react_1.ModalDescription>
            <macro_1.Trans>
              Move some of the quantity into a new disposition row so MRB can
              decide each portion separately (e.g. scrap some, rework some).
            </macro_1.Trans>
          </react_1.ModalDescription>
        </react_1.ModalHeader>
        <form_1.ValidatedForm fetcher={fetcher} method="post" action={path_1.path.to.splitIssueItem} validator={quality_models_1.splitIssueItemValidator} defaultValues={{
            id: target.id,
            itemId: target.itemId,
            splitQuantity: hasMultipleEntities ? undefined : 1
        }}>
          <react_1.ModalBody>
            <div className="flex flex-col gap-4 w-full">
              <form_1.Hidden name="id"/>
              <form_1.Hidden name="itemId"/>
              <input type="hidden" name="entityAssignments" value={hasMultipleEntities ? JSON.stringify(selectedAssignments) : ""}/>
              <form_1.Input name="currentQuantity" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Current quantity"], ["Current quantity"])))} isReadOnly value={String(target.maxQuantity)}/>
              {hasMultipleEntities ? (<div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">
                    <macro_1.Trans>Entities to split off</macro_1.Trans>
                  </label>
                  <ul className="flex flex-col divide-y divide-border border border-border rounded-md max-h-64 overflow-y-auto">
                    {target.links.map(function (link) {
                var _a;
                return (<li key={link.id} className="flex items-center gap-2 text-sm px-3 py-2">
                        <react_1.Checkbox checked={!!selected[link.trackedEntityId]} onCheckedChange={function (checked) {
                        return setSelected(function (prev) {
                            var _a;
                            return (__assign(__assign({}, prev), (_a = {}, _a[link.trackedEntityId] = checked === true, _a)));
                        });
                    }}/>
                        <div className="text-xs flex-1 min-w-0">
                          <EntityLabel link={link}/>
                        </div>
                        <TrackedEntityStatus_1.default status={(_a = link.trackedEntity) === null || _a === void 0 ? void 0 : _a.status}/>
                      </li>);
            })}
                  </ul>
                  <p className="text-xs text-muted-foreground">
                    <macro_1.Trans>
                      Selected: {selectedSum} / remaining after split:{" "}
                      {target.maxQuantity - selectedSum}
                    </macro_1.Trans>
                  </p>
                </div>) : (<form_1.Number name="splitQuantity" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Split off quantity"], ["Split off quantity"])))} minValue={1} maxValue={target.maxQuantity - 1} helperText={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Remaining after split stays on the original row."], ["Remaining after split stays on the original row."])))}/>)}
            </div>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.HStack spacing={2}>
              <react_1.Button variant="secondary" onClick={onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <form_1.Submit isDisabled={isSubmitting || !canSubmit} isLoading={isSubmitting}>
                <macro_1.Trans>Split</macro_1.Trans>
              </form_1.Submit>
            </react_1.HStack>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
function MoveEntitiesModal(_a) {
    var _b, _c;
    var target = _a.target, fetcher = _a.fetcher, onClose = _a.onClose;
    var isSubmitting = fetcher.state !== "idle";
    var _d = (0, react_2.useState)({}), selected = _d[0], setSelected = _d[1];
    var _e = (0, react_2.useState)((_c = (_b = target.siblings[0]) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : ""), targetItemId = _e[0], setTargetItemId = _e[1];
    var selectedAssignments = target.links
        .filter(function (l) { return selected[l.trackedEntityId]; })
        .map(function (l) { return ({
        trackedEntityId: l.trackedEntityId,
        quantity: Number(l.quantity)
    }); });
    var canSubmit = selectedAssignments.length > 0 && targetItemId !== "";
    return (<react_1.Modal open onOpenChange={function (next) {
            if (!next)
                onClose();
        }}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Move entities</macro_1.Trans>
          </react_1.ModalTitle>
          <react_1.ModalDescription>
            <macro_1.Trans>
              Reassign specific tracked entities from this row to another
              disposition row.
            </macro_1.Trans>
          </react_1.ModalDescription>
        </react_1.ModalHeader>
        <form_1.ValidatedForm fetcher={fetcher} method="post" action={path_1.path.to.assignIssueItemEntities} validator={quality_models_1.assignIssueItemEntitiesValidator} defaultValues={{
            nonConformanceItemId: target.sourceRowId,
            targetItemId: targetItemId
        }}>
          <react_1.ModalBody>
            <div className="flex flex-col gap-4 w-full">
              <form_1.Hidden name="nonConformanceItemId"/>
              <input type="hidden" name="targetItemId" value={targetItemId}/>
              <input type="hidden" name="entityAssignments" value={JSON.stringify(selectedAssignments)}/>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  <macro_1.Trans>Target disposition row</macro_1.Trans>
                </label>
                <select className="border border-border rounded-md px-3 py-2 text-sm bg-background" value={targetItemId} onChange={function (e) { return setTargetItemId(e.target.value); }}>
                  {target.siblings.map(function (s) { return (<option key={s.id} value={s.id}>
                      {s.disposition}
                    </option>); })}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  <macro_1.Trans>Entities to move</macro_1.Trans>
                </label>
                <ul className="flex flex-col divide-y divide-border border border-border rounded-md max-h-64 overflow-y-auto">
                  {target.links.map(function (link) {
            var _a;
            return (<li key={link.id} className="flex items-center gap-2 text-sm px-3 py-2">
                      <react_1.Checkbox checked={!!selected[link.trackedEntityId]} onCheckedChange={function (checked) {
                    return setSelected(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[link.trackedEntityId] = checked === true, _a)));
                    });
                }}/>
                      <div className="text-xs flex-1 min-w-0">
                        <EntityLabel link={link}/>
                      </div>
                      <TrackedEntityStatus_1.default status={(_a = link.trackedEntity) === null || _a === void 0 ? void 0 : _a.status}/>
                    </li>);
        })}
                </ul>
              </div>
            </div>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.HStack spacing={2}>
              <react_1.Button variant="secondary" onClick={onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <form_1.Submit isDisabled={isSubmitting || !canSubmit} isLoading={isSubmitting}>
                <macro_1.Trans>Move</macro_1.Trans>
              </form_1.Submit>
            </react_1.HStack>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
