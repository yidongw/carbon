"use client";
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JobStatusMenu;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var cardCell_1 = require("~/components/Table/components/cardCell");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var JobHeader_1 = require("./JobHeader");
var JobStatus_1 = require("./JobStatus");
/**
 * Clickable status badge that opens a menu to change a job's status inline.
 * Mirrors the status actions in the job header (JobTopbarLeft) and reuses the
 * same modals so side-effect flows (release/complete/cancel) stay consistent.
 */
function JobStatusMenu(_a) {
    var _b;
    var job = _a.job;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var isCardCell = (0, cardCell_1.useIsCardCell)();
    // A KEYED fetcher: its state lives globally and reconnects after the cell is
    // rebuilt (the jobs table recreates its columns/cells on every render, which
    // would otherwise wipe any local component state mid-change). This is what
    // makes the spinner and the new status survive the table refresh.
    var fetcher = (0, react_router_1.useFetcher)({ key: "job-status:".concat(job.id) });
    var releaseModal = (0, react_1.useDisclosure)();
    var cancelModal = (0, react_1.useDisclosure)();
    var completeModal = (0, react_1.useDisclosure)();
    var inFlight = fetcher.state !== "idle";
    // After a successful change the action echoes the new status; hold it until
    // the row read-back catches up (it can lag a few seconds).
    var confirmed = ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success) ? fetcher.data.status : undefined;
    // While saving, show the real (old) status with a spinner — never flip early.
    // Once it settles, show the confirmed new status. Everything is derived from
    // the keyed fetcher, so it all survives the table rebuilding the cell.
    var status = !inFlight && confirmed ? confirmed : job.status;
    var busy = inFlight;
    var canUpdate = permissions.can("update", "production");
    if (!job.id || !canUpdate) {
        return <JobStatus_1.default status={status}/>;
    }
    var isDraft = ["Draft", "Planned"].includes(status !== null && status !== void 0 ? status : "");
    var isPaused = status === "Paused";
    var isRunning = ["Ready", "In Progress"].includes(status !== null && status !== void 0 ? status : "");
    var isDone = ["Completed", "Cancelled"].includes(status !== null && status !== void 0 ? status : "");
    var submitStatus = function (next) {
        return fetcher.submit({ status: next }, 
        // stay=1 keeps inline changes on the jobs list (e.g. "Mark as Planned"
        // would otherwise redirect to the job's materials page).
        { method: "post", action: "".concat(path_1.path.to.jobStatus(job.id), "?stay=1") });
    };
    return (<>
      {/* modal=false so opening from inside the touch-handling card doesn't
            fight Radix's focus/scroll lock and immediately close. */}
      <react_1.DropdownMenu modal={false}>
        {isCardCell ? (
        // In the mobile card the whole chip is the tap target: render the
        // badge as visuals and overlay a full-cover trigger. Stop the tap from
        // bubbling to the card's row-nav / swipe handlers.
        <>
            <span className={(0, react_1.cn)("inline-flex items-center gap-1.5", busy && "opacity-50")}>
              <JobStatus_1.default status={status}/>
              {busy && <react_1.Spinner className="size-4 text-foreground"/>}
            </span>
            <react_1.DropdownMenuTrigger asChild>
              <button type="button" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Change status"], ["Change status"])))} disabled={busy} onPointerDown={function (e) { return e.stopPropagation(); }} onClick={function (e) { return e.stopPropagation(); }} data-card-action className="absolute inset-0 z-[1] cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"/>
            </react_1.DropdownMenuTrigger>
          </>) : (<react_1.DropdownMenuTrigger asChild>
            <button type="button" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Change status"], ["Change status"])))} disabled={busy} className="inline-flex items-center gap-1.5 cursor-pointer rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default disabled:hover:opacity-100">
              <span className={busy ? "opacity-50" : undefined}>
                <JobStatus_1.default status={status}/>
              </span>
              {busy && <react_1.Spinner className="size-4 text-foreground"/>}
            </button>
          </react_1.DropdownMenuTrigger>)}
        <react_1.DropdownMenuContent align="start">
          {isDraft && (<react_1.DropdownMenuItem disabled={busy} onClick={function () { return submitStatus("Planned"); }}>
              <react_1.DropdownMenuIcon className="text-yellow-500" icon={<lu_1.LuCheckCheck />}/>
              <macro_1.Trans>Mark as Planned</macro_1.Trans>
            </react_1.DropdownMenuItem>)}
          <react_1.DropdownMenuItem disabled={!isDraft ||
            busy ||
            (job.quantity === 0 && job.scrapQuantity === 0)} onClick={releaseModal.onOpen}>
            <react_1.DropdownMenuIcon className="text-blue-600" icon={<lu_1.LuCirclePlay />}/>
            <macro_1.Trans>Release</macro_1.Trans>
          </react_1.DropdownMenuItem>
          {isPaused ? (<react_1.DropdownMenuItem disabled={busy} onClick={function () { return submitStatus("Ready"); }}>
              <react_1.DropdownMenuIcon className="text-blue-600" icon={<lu_1.LuCirclePlay />}/>
              <macro_1.Trans>Resume</macro_1.Trans>
            </react_1.DropdownMenuItem>) : (<react_1.DropdownMenuItem disabled={!isRunning || busy} onClick={function () { return submitStatus("Paused"); }}>
              <react_1.DropdownMenuIcon className="text-orange-500" icon={<lu_1.LuCirclePause />}/>
              <macro_1.Trans>Pause</macro_1.Trans>
            </react_1.DropdownMenuItem>)}
          <react_1.DropdownMenuItem disabled={isDone || busy} onClick={completeModal.onOpen}>
            <react_1.DropdownMenuIcon className="text-green-600" icon={<lu_1.LuCircleCheck />}/>
            <macro_1.Trans>Complete</macro_1.Trans>
          </react_1.DropdownMenuItem>
          <react_1.DropdownMenuItem disabled={isDone || busy} onClick={cancelModal.onOpen}>
            <react_1.DropdownMenuIcon className="text-red-600" icon={<lu_1.LuCircleStop />}/>
            <macro_1.Trans>Cancel</macro_1.Trans>
          </react_1.DropdownMenuItem>
          <react_1.DropdownMenuSeparator />
          <react_1.DropdownMenuItem disabled={!isDone || busy} onClick={function () {
            return submitStatus(status === "Cancelled" ? "Draft" : "In Progress");
        }}>
            <react_1.DropdownMenuIcon className="text-blue-600" icon={<lu_1.LuCirclePlay />}/>
            <macro_1.Trans>Reopen</macro_1.Trans>
          </react_1.DropdownMenuItem>
        </react_1.DropdownMenuContent>
      </react_1.DropdownMenu>
      {releaseModal.isOpen && (<JobHeader_1.JobStartModal job={job} onClose={releaseModal.onClose} fetcher={fetcher} stay/>)}
      {cancelModal.isOpen && (<JobHeader_1.JobCancelModal job={job} onClose={cancelModal.onClose} fetcher={fetcher} stay/>)}
      {completeModal.isOpen && (<JobHeader_1.JobCompleteModal job={job} onClose={completeModal.onClose} fetcher={fetcher} stay/>)}
    </>);
}
var templateObject_1, templateObject_2;
