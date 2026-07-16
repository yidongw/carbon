"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var storage_rules_1 = require("@carbon/ee/storage-rules");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Assignee_1 = require("~/components/Assignee");
var AuditLog_1 = require("~/components/AuditLog");
var ConfirmDelete_1 = require("~/components/Modals/ConfirmDelete");
var hooks_1 = require("~/hooks");
var inventory_1 = require("~/modules/inventory");
var path_1 = require("~/utils/path");
var StockTransferCompleteModal_1 = require("./StockTransferCompleteModal");
var StockTransferStatus_1 = require("./StockTransferStatus");
var StockTransferHeader = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("id not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.stockTransfer(id));
    if (!(routeData === null || routeData === void 0 ? void 0 : routeData.stockTransfer))
        throw new Error("Failed to load stockTransfer");
    var status = routeData.stockTransfer.status;
    var t = (0, macro_1.useLingui)().t;
    var company = (0, hooks_1.useUser)().company;
    var permissions = (0, hooks_1.usePermissions)();
    var postModal = (0, react_1.useDisclosure)();
    var deleteModal = (0, react_1.useDisclosure)();
    var statusFetcher = (0, react_router_1.useFetcher)();
    // Item rules fire on Release + Complete (the "go" transitions). Each gets
    // its own fetcher so Release's loading state doesn't disable Complete and
    // vice versa, and violations surface via a single shared modal.
    var releaseRules = (0, storage_rules_1.useStorageRuleViolations)({
        action: path_1.path.to.stockTransferStatus(id)
    });
    var releaseFetcher = releaseRules.fetcher;
    var completeRules = (0, storage_rules_1.useStorageRuleViolations)({
        action: path_1.path.to.stockTransferStatus(id)
    });
    var completeFetcher = completeRules.fetcher;
    var _o = (0, AuditLog_1.useAuditLog)({
        entityType: "stockTransfer",
        entityId: id,
        companyId: company.id,
        variant: "dropdown"
    }), auditLogTrigger = _o.trigger, auditLogDrawer = _o.drawer;
    var canComplete = routeData.stockTransferLines.length > 0 &&
        routeData.stockTransferLines.some(function (line) { var _a; return ((_a = line.pickedQuantity) !== null && _a !== void 0 ? _a : 0) !== 0; }) &&
        ["Released", "In Progress"].includes(status);
    var isCompleted = status === "Completed";
    var isLocked = (0, inventory_1.isStockTransferLocked)(status);
    var optimisticAssignment = (0, Assignee_1.useOptimisticAssignment)({
        id: id,
        table: "stockTransfer"
    });
    var assignee = optimisticAssignment !== undefined
        ? optimisticAssignment
        : (_a = routeData === null || routeData === void 0 ? void 0 : routeData.stockTransfer) === null || _a === void 0 ? void 0 : _a.assignee;
    var hasPickedItems = routeData === null || routeData === void 0 ? void 0 : routeData.stockTransferLines.some(function (line) { return line.pickedQuantity && line.pickedQuantity > 0; });
    var hasTrackedLines = routeData === null || routeData === void 0 ? void 0 : routeData.stockTransferLines.some(function (line) { return !!line.trackedEntityId; });
    return (<>
      <div className="flex flex-shrink-0 items-center justify-between px-4 py-2 bg-card border-b border-border h-[50px] overflow-x-auto scrollbar-hide dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1)]">
        <react_1.HStack className="w-full justify-between">
          <react_1.HStack>
            <react_1.Heading size="h4" className="flex items-center gap-2">
              <span>{(_b = routeData === null || routeData === void 0 ? void 0 : routeData.stockTransfer) === null || _b === void 0 ? void 0 : _b.stockTransferId}</span>
            </react_1.Heading>

            <react_1.Copy text={(_d = (_c = routeData === null || routeData === void 0 ? void 0 : routeData.stockTransfer) === null || _c === void 0 ? void 0 : _c.stockTransferId) !== null && _d !== void 0 ? _d : ""}/>
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} variant="secondary" size="sm"/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent>
                {auditLogTrigger}
                <react_1.DropdownMenuSeparator />
                <react_1.DropdownMenuItem disabled={["Draft"].includes((_f = (_e = routeData === null || routeData === void 0 ? void 0 : routeData.stockTransfer) === null || _e === void 0 ? void 0 : _e.status) !== null && _f !== void 0 ? _f : "") ||
            statusFetcher.state !== "idle" ||
            !permissions.can("delete", "inventory")} onClick={function () {
            statusFetcher.submit({ status: "Draft" }, {
                method: "post",
                action: path_1.path.to.stockTransferStatus(id)
            });
        }}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuLoaderCircle />}/>
                  <macro_1.Trans>Reopen</macro_1.Trans>
                </react_1.DropdownMenuItem>
                <react_1.DropdownMenuSeparator />
                <react_1.DropdownMenuItem disabled={!permissions.can("delete", "inventory") ||
            !permissions.is("employee") ||
            !["Released", "Draft"].includes(status) ||
            hasPickedItems ||
            isLocked} destructive onClick={deleteModal.onOpen}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                  <macro_1.Trans>Delete Stock Transfer</macro_1.Trans>
                </react_1.DropdownMenuItem>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
            <StockTransferStatus_1.default status={(_g = routeData === null || routeData === void 0 ? void 0 : routeData.stockTransfer) === null || _g === void 0 ? void 0 : _g.status}/>
          </react_1.HStack>
          <react_1.HStack>
            <Assignee_1.default size="md" id={id} value={assignee !== null && assignee !== void 0 ? assignee : ""} table="stockTransfer" isReadOnly={!permissions.can("update", "inventory")}/>
            {hasTrackedLines && (<components_1.PrintButton sourceDocument="StockTransfer" sourceDocumentId={id} locationId={(_j = (_h = routeData === null || routeData === void 0 ? void 0 : routeData.stockTransfer) === null || _h === void 0 ? void 0 : _h.locationId) !== null && _j !== void 0 ? _j : undefined} context="inventory" fileRoutes={{
                pdf: path_1.path.to.file.stockTransferLabelsPdf,
                zpl: path_1.path.to.file.stockTransferLabelsZpl
            }}/>)}
            <react_1.Button variant="secondary" leftIcon={<lu_1.LuBarcode />} asChild>
              <a target="_blank" href={path_1.path.to.file.stockTransfer(id)} rel="noreferrer">
                <macro_1.Trans>Pick List</macro_1.Trans>
              </a>
            </react_1.Button>
            <react_1.Button type="button" leftIcon={<lu_1.LuCirclePlay />} variant={status === "Draft" ? "primary" : "secondary"} isDisabled={status !== "Draft" ||
            releaseFetcher.state !== "idle" ||
            !permissions.can("update", "inventory")} isLoading={releaseFetcher.state !== "idle"} onClick={function () {
            var fd = new FormData();
            fd.set("status", "Released");
            releaseRules.submit(fd);
        }}>
              <macro_1.Trans>Release</macro_1.Trans>
            </react_1.Button>
            <releaseRules.ViolationModal />

            <form onSubmit={function (e) {
            e.preventDefault();
            var fd = new FormData();
            fd.set("status", "Completed");
            completeRules.submit(fd);
        }}>
              <react_1.Button type="submit" variant={canComplete && !isCompleted ? "primary" : "secondary"} isDisabled={!canComplete ||
            isCompleted ||
            !permissions.is("employee") ||
            completeFetcher.state !== "idle"} leftIcon={<lu_1.LuCircleCheck />} isLoading={completeFetcher.state !== "idle"}>
                <macro_1.Trans>Complete</macro_1.Trans>
              </react_1.Button>
            </form>
            <completeRules.ViolationModal />
          </react_1.HStack>
        </react_1.HStack>
      </div>

      {postModal.isOpen && (<StockTransferCompleteModal_1.default onClose={postModal.onClose}/>)}
      {deleteModal.isOpen && (<ConfirmDelete_1.default action={path_1.path.to.deleteStockTransfer(id)} isOpen={deleteModal.isOpen} name={(_l = (_k = routeData === null || routeData === void 0 ? void 0 : routeData.stockTransfer) === null || _k === void 0 ? void 0 : _k.stockTransferId) !== null && _l !== void 0 ? _l : "stockTransfer"} text={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), (_m = routeData === null || routeData === void 0 ? void 0 : routeData.stockTransfer) === null || _m === void 0 ? void 0 : _m.stockTransferId)} onCancel={function () {
                deleteModal.onClose();
            }} onSubmit={function () {
                deleteModal.onClose();
            }}/>)}
      {auditLogDrawer}
    </>);
};
exports.default = StockTransferHeader;
var templateObject_1, templateObject_2;
