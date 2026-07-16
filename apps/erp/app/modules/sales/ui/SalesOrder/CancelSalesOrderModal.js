"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelSalesOrderModal = CancelSalesOrderModal;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
function CancelSalesOrderModal(_a) {
    var _b, _c;
    var orderId = _a.orderId, isOpen = _a.isOpen, onClose = _a.onClose, onSubmit = _a.onSubmit, isSubmitting = _a.isSubmitting;
    var t = (0, macro_1.useLingui)().t;
    var previewFetcher = (0, react_router_1.useFetcher)();
    var _d = (0, react_2.useState)(null), selection = _d[0], setSelection = _d[1];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (!isOpen)
            return;
        previewFetcher.load(path_1.path.to.salesOrderCancelPreview(orderId));
    }, [isOpen, orderId]);
    (0, react_2.useEffect)(function () {
        if (!isOpen)
            setSelection(null);
    }, [isOpen]);
    var jobs = (_c = (_b = previewFetcher.data) === null || _b === void 0 ? void 0 : _b.jobs) !== null && _c !== void 0 ? _c : [];
    var isLoading = previewFetcher.state !== "idle" && !previewFetcher.data;
    var selectedJobIds = (0, react_2.useMemo)(function () { return selection !== null && selection !== void 0 ? selection : new Set(jobs.map(function (j) { return j.id; })); }, [selection, jobs]);
    var allSelected = jobs.length > 0 && selectedJobIds.size === jobs.length;
    var someSelected = selectedJobIds.size > 0 && !allSelected;
    var toggleAll = function () {
        setSelection(allSelected ? new Set() : new Set(jobs.map(function (j) { return j.id; })));
    };
    var toggleOne = function (id) {
        var next = new Set(selectedJobIds);
        if (next.has(id))
            next.delete(id);
        else
            next.add(id);
        setSelection(next);
    };
    var selectedIds = (0, react_2.useMemo)(function () { return Array.from(selectedJobIds); }, [selectedJobIds]);
    var submit = function (includeJobs) {
        var fd = new FormData();
        fd.set("status", "Cancelled");
        fd.set("cancelJobIds", includeJobs ? selectedIds.join(",") : "");
        onSubmit(fd);
    };
    return (<react_1.Modal open={isOpen} onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Cancel Sales Order</macro_1.Trans>
          </react_1.ModalTitle>
          {!isLoading && jobs.length > 0 && (<react_1.ModalDescription>
              <macro_1.Trans>
                This sales order has associated jobs. Choose what to do with
                them.
              </macro_1.Trans>
            </react_1.ModalDescription>)}
        </react_1.ModalHeader>
        <react_1.ModalBody>
          {isLoading ? (<p className="text-sm text-muted-foreground">
              <macro_1.Trans>Loading associated jobs...</macro_1.Trans>
            </p>) : jobs.length === 0 ? (<p className="text-sm text-muted-foreground">
              <macro_1.Trans>
                No active jobs found for this sales order. The order will be
                cancelled directly.
              </macro_1.Trans>
            </p>) : (<react_1.VStack spacing={2}>
              <react_1.HStack className="px-1">
                <react_1.Checkbox isChecked={allSelected} isIndeterminate={someSelected} onCheckedChange={toggleAll}/>
                <span className="text-xs uppercase text-muted-foreground">
                  <macro_1.Trans>Select all</macro_1.Trans>
                </span>
              </react_1.HStack>
              <div className="max-h-[320px] w-full overflow-y-auto">
                {jobs.map(function (job) { return (<label key={job.id} className="flex items-center gap-3 border-b last:border-b-0 px-3 py-2 cursor-pointer hover:bg-muted/40">
                    <react_1.Checkbox isChecked={selectedJobIds.has(job.id)} onCheckedChange={function () { return toggleOne(job.id); }}/>
                    <react_1.HStack className="py-2">
                      <div className="text-sm font-medium truncate">
                        {job.jobReadableId}
                        {job.itemReadableId && (<span className="ml-2 text-muted-foreground font-normal">
                            {job.itemReadableId}
                          </span>)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <react_1.Badge variant="outline">{job.status}</react_1.Badge>
                        {job.dueDate && <span>Due {job.dueDate}</span>}
                      </div>
                    </react_1.HStack>
                  </label>); })}
              </div>
            </react_1.VStack>)}
        </react_1.ModalBody>
        <react_1.ModalFooter>
          <react_1.HStack>
            <react_1.Button variant="ghost" onClick={onClose} isDisabled={isSubmitting}>
              <macro_1.Trans>Back</macro_1.Trans>
            </react_1.Button>
            {jobs.length > 0 && (<react_1.Button variant="secondary" onClick={function () { return submit(false); }} isDisabled={isSubmitting} isLoading={isSubmitting}>
                <macro_1.Trans>Cancel SO only</macro_1.Trans>
              </react_1.Button>)}
            <react_1.Button variant="primary" onClick={function () { return submit(jobs.length > 0); }} isDisabled={isSubmitting || (jobs.length > 0 && selectedJobIds.size === 0)} isLoading={isSubmitting}>
              {jobs.length === 0
            ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Cancel SO"], ["Cancel SO"]))) : selectedJobIds.size === jobs.length
            ? t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Cancel SO + ", " job", ""], ["Cancel SO + ", " job", ""])), selectedIds.length, selectedIds.length === 1 ? "" : "s") : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Cancel SO + ", " selected"], ["Cancel SO + ", " selected"])), selectedIds.length)}
            </react_1.Button>
          </react_1.HStack>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1, templateObject_2, templateObject_3;
