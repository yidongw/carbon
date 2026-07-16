"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Assignee_1 = require("~/components/Assignee");
var ConfirmDelete_1 = require("~/components/Modals/ConfirmDelete");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var PickingListStatus_1 = require("./PickingListStatus");
var PickingListHeader = function () {
    var _a, _b, _c, _d, _e, _f;
    var pickingListId = (0, react_router_1.useParams)().pickingListId;
    if (!pickingListId)
        throw new Error("pickingListId not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.pickingList(pickingListId));
    if (!(routeData === null || routeData === void 0 ? void 0 : routeData.pickingList))
        throw new Error("Failed to load picking list");
    var pickingList = routeData.pickingList;
    var status = pickingList.status;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var deleteModal = (0, react_1.useDisclosure)();
    var statusFetcher = (0, react_router_1.useFetcher)();
    var isClosed = ["Completed", "Cancelled"].includes(status);
    var hasPickedLines = ((_a = routeData.pickingListLines) !== null && _a !== void 0 ? _a : []).some(function (l) { var _a; return Number((_a = l.quantityPicked) !== null && _a !== void 0 ? _a : 0) > 0; });
    var optimisticAssignment = (0, Assignee_1.useOptimisticAssignment)({
        id: pickingListId,
        table: "pickingList"
    });
    var assignee = optimisticAssignment !== undefined
        ? optimisticAssignment
        : pickingList.assignee;
    var submitStatus = function (next) {
        statusFetcher.submit({ status: next }, { method: "post", action: path_1.path.to.pickingListStatus(pickingListId) });
    };
    return (<>
      <div className="flex flex-shrink-0 items-center justify-between px-4 py-2 bg-card border-b border-border h-[50px] overflow-x-auto scrollbar-hide dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1)]">
        <react_1.HStack className="w-full justify-between">
          <react_1.HStack>
            <react_1.Heading size="h4" className="flex items-center gap-2">
              <span>{pickingList.pickingListId}</span>
            </react_1.Heading>
            <react_1.Copy text={(_b = pickingList.pickingListId) !== null && _b !== void 0 ? _b : ""}/>
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} variant="secondary" size="sm"/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent>
                <react_1.DropdownMenuItem disabled={status === "Draft" ||
            statusFetcher.state !== "idle" ||
            !permissions.can("delete", "inventory")} onClick={function () { return submitStatus("Draft"); }}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuLoaderCircle />}/>
                  <macro_1.Trans>Reopen</macro_1.Trans>
                </react_1.DropdownMenuItem>
                <react_1.DropdownMenuSeparator />
                <react_1.DropdownMenuItem disabled={status !== "Draft" ||
            hasPickedLines ||
            !permissions.can("delete", "inventory") ||
            !permissions.is("employee")} destructive onClick={deleteModal.onOpen}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                  <macro_1.Trans>Delete Picking List</macro_1.Trans>
                </react_1.DropdownMenuItem>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
            <PickingListStatus_1.default status={status}/>
          </react_1.HStack>

          <react_1.HStack>
            <Assignee_1.default size="md" id={pickingListId} value={assignee !== null && assignee !== void 0 ? assignee : ""} table="pickingList" isReadOnly={!permissions.can("update", "inventory")}/>
            <react_1.Button type="button" leftIcon={<lu_1.LuCirclePlay />} variant={status === "Draft" ? "primary" : "secondary"} isDisabled={status !== "Draft" ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "inventory")} isLoading={statusFetcher.state !== "idle" &&
            ((_c = statusFetcher.formData) === null || _c === void 0 ? void 0 : _c.get("status")) === "In Progress"} onClick={function () { return submitStatus("In Progress"); }}>
              <macro_1.Trans>Start</macro_1.Trans>
            </react_1.Button>
            <react_1.Button type="button" leftIcon={<lu_1.LuCircleCheck />} variant="secondary" isDisabled={status !== "In Progress" ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "inventory")} isLoading={statusFetcher.state !== "idle" &&
            ((_d = statusFetcher.formData) === null || _d === void 0 ? void 0 : _d.get("status")) === "Completed"} onClick={function () { return submitStatus("Completed"); }}>
              <macro_1.Trans>Finish</macro_1.Trans>
            </react_1.Button>
            <react_1.Button type="button" variant="secondary" leftIcon={<lu_1.LuCircleStop />} isDisabled={isClosed ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "inventory")} isLoading={statusFetcher.state !== "idle" &&
            ((_e = statusFetcher.formData) === null || _e === void 0 ? void 0 : _e.get("status")) === "Cancelled"} onClick={function () { return submitStatus("Cancelled"); }}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
          </react_1.HStack>
        </react_1.HStack>
      </div>

      {deleteModal.isOpen && (<ConfirmDelete_1.default action={path_1.path.to.pickingListDelete(pickingListId)} isOpen={deleteModal.isOpen} name={(_f = pickingList.pickingListId) !== null && _f !== void 0 ? _f : "picking list"} text={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), pickingList.pickingListId)} onCancel={deleteModal.onClose} onSubmit={deleteModal.onClose}/>)}
    </>);
};
exports.default = PickingListHeader;
var templateObject_1, templateObject_2;
