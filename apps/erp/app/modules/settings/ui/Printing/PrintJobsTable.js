"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var statusConfig = {
    generating: {
        variant: "purple",
        icon: <lu_1.LuLoader className="size-3"/>,
        label: "Generating"
    },
    queued: {
        variant: "yellow",
        icon: <lu_1.LuClock className="size-3"/>,
        label: "Queued"
    },
    printing: {
        variant: "blue",
        icon: <lu_1.LuPrinter className="size-3"/>,
        label: "Printing"
    },
    completed: {
        variant: "green",
        icon: <lu_1.LuCircleCheck className="size-3"/>,
        label: "Completed"
    },
    failed: {
        variant: "red",
        icon: <lu_1.LuCircleX className="size-3"/>,
        label: "Failed"
    }
};
var ExpandedRowContent = (0, react_2.memo)(function (_a) {
    var _b;
    var job = _a.job;
    return (<div className="px-6 py-4">
      <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
        <div>
          <span className="text-muted-foreground">Printer URL</span>
          <div className="font-mono text-xs break-all">{job.printerUrl}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Source Document</span>
          <div className="font-mono text-xs">
            {(_b = job.sourceDocumentReadableId) !== null && _b !== void 0 ? _b : job.sourceDocumentId}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Attempts</span>
          <div className="font-mono text-xs">{job.attempts}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Completed At</span>
          <div className="font-mono text-xs">
            {job.completedAt ? (0, utils_1.formatDateTime)(job.completedAt) : "—"}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Event ID</span>
          <div className="font-mono text-xs">{job.id}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Created At</span>
          <div className="font-mono text-xs">
            {(0, utils_1.formatDateTime)(job.createdAt)}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Updated At</span>
          <div className="font-mono text-xs">
            {job.updatedAt ? (0, utils_1.formatDateTime)(job.updatedAt) : "—"}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Created By</span>
          <div className="font-mono text-xs">{job.createdBy}</div>
        </div>
      </div>

      {job.error && (<div>
          <h4 className="text-sm font-medium mb-2">Error</h4>
          <pre className="text-xs font-mono bg-red-500/10 text-red-500 p-3 rounded-md whitespace-pre-wrap">
            {job.error}
          </pre>
        </div>)}
    </div>);
});
ExpandedRowContent.displayName = "ExpandedRowContent";
function parseZplDimensions(zplContent) {
    var pwMatch = zplContent.match(/\^PW(\d+)/);
    var llMatch = zplContent.match(/\^LL(\d+)/);
    var dpi = 203;
    var dpmm = Math.round(dpi / 25.4);
    var widthInches = pwMatch
        ? Math.max(0.5, Math.round((Number(pwMatch[1]) / dpi) * 10) / 10)
        : 2;
    var heightInches = llMatch
        ? Math.max(0.5, Math.round((Number(llMatch[1]) / dpi) * 10) / 10)
        : 1;
    return { dpmm: dpmm, width: widthInches, height: heightInches };
}
function ZplPreview(_a) {
    var zpl = _a.zpl;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)(null), imageUrl = _b[0], setImageUrl = _b[1];
    var _c = (0, react_2.useState)(null), error = _c[0], setError = _c[1];
    var _d = (0, react_2.useState)(true), loading = _d[0], setLoading = _d[1];
    (0, react_2.useEffect)(function () {
        var revoked = false;
        var objectUrl = null;
        var _a = parseZplDimensions(zpl), dpmm = _a.dpmm, width = _a.width, height = _a.height;
        fetch("https://api.labelary.com/v1/printers/".concat(dpmm, "dpmm/labels/").concat(width, "x").concat(height, "/0/"), {
            method: "POST",
            headers: {
                Accept: "image/png",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: zpl
        })
            .then(function (res) {
            if (!res.ok)
                throw new Error("Labelary returned ".concat(res.status));
            return res.blob();
        })
            .then(function (blob) {
            if (revoked)
                return;
            objectUrl = URL.createObjectURL(blob);
            setImageUrl(objectUrl);
            setLoading(false);
        })
            .catch(function (err) {
            if (revoked)
                return;
            setError(err.message);
            setLoading(false);
        });
        return function () {
            revoked = true;
            if (objectUrl)
                URL.revokeObjectURL(objectUrl);
        };
    }, [zpl]);
    if (loading) {
        return (<div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
        <macro_1.Trans>Rendering label preview...</macro_1.Trans>
      </div>);
    }
    if (error) {
        return (<div className="flex flex-col gap-2">
        <p className="text-sm text-destructive">
          <macro_1.Trans>Preview failed: {error}</macro_1.Trans>
        </p>
        <pre className="text-xs font-mono bg-muted p-4 rounded-md overflow-auto whitespace-pre-wrap break-all max-h-[40vh]">
          {zpl}
        </pre>
      </div>);
    }
    return (<div className="flex flex-col gap-3">
      <img src={imageUrl} alt={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["ZPL Label Preview"], ["ZPL Label Preview"])))} className="border border-border rounded-md max-h-[350px] object-contain self-start"/>
      <pre className="text-xs font-mono bg-muted p-4 rounded-md overflow-auto whitespace-pre-wrap break-all max-h-[30vh]">
        {zpl}
      </pre>
    </div>);
}
var PrintJobsTable = (0, react_2.memo)(function (_a) {
    var _b;
    var jobs = _a.jobs, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var _c = (0, react_2.useState)(null), viewContent = _c[0], setViewContent = _c[1];
    (0, react_2.useEffect)(function () {
        if (fetcher.data && "content" in fetcher.data && fetcher.data.content) {
            setViewContent({
                content: fetcher.data.content,
                contentType: fetcher.data.contentType,
                printJobId: fetcher.data.printJobId
            });
        }
    }, [fetcher.data]);
    var columns = (0, react_2.useMemo)(function () { return [
        {
            accessorKey: "status",
            header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Status"], ["Status"]))),
            cell: function (_a) {
                var _b, _c;
                var row = _a.row;
                var config = statusConfig[row.original.status];
                return (<react_1.Badge variant={(_b = config === null || config === void 0 ? void 0 : config.variant) !== null && _b !== void 0 ? _b : "secondary"} className="shrink-0">
              <react_1.HStack className="gap-1">
                {config === null || config === void 0 ? void 0 : config.icon}
                <span>{(_c = config === null || config === void 0 ? void 0 : config.label) !== null && _c !== void 0 ? _c : row.original.status}</span>
              </react_1.HStack>
            </react_1.Badge>);
            },
            meta: {
                filter: {
                    type: "static",
                    options: [
                        { label: "Generating", value: "generating" },
                        { label: "Queued", value: "queued" },
                        { label: "Printing", value: "printing" },
                        { label: "Completed", value: "completed" },
                        { label: "Failed", value: "failed" }
                    ]
                }
            }
        },
        {
            accessorKey: "description",
            header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Description"], ["Description"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<div className="max-w-[300px] truncate font-medium">
            {row.original.description}
          </div>);
            },
            meta: {
                icon: <lu_1.LuFileText />
            }
        },
        {
            accessorKey: "sourceDocument",
            header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Source"], ["Source"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<span className="text-sm text-muted-foreground">
            {row.original.sourceDocument}
          </span>);
            },
            meta: {
                filter: {
                    type: "static",
                    options: [
                        { label: "Receipt", value: "receipt" },
                        { label: "Shipment", value: "shipment" },
                        { label: "Operation", value: "operation" },
                        { label: "Job", value: "job" },
                        { label: "Item", value: "item" },
                        { label: "Kanban", value: "kanban" },
                        { label: "Split", value: "split" }
                    ]
                }
            }
        },
        {
            accessorKey: "contentType",
            header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Type"], ["Type"]))),
            cell: function (_a) {
                var _b;
                var row = _a.row;
                return (<span className="font-mono text-xs uppercase text-muted-foreground">
            {(_b = row.original.contentType) !== null && _b !== void 0 ? _b : "—"}
          </span>);
            },
            meta: {
                filter: {
                    type: "static",
                    options: [
                        { label: "ZPL", value: "zpl" },
                        { label: "PDF", value: "pdf" }
                    ]
                }
            }
        },
        {
            accessorKey: "origin",
            header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Origin"], ["Origin"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<span className="text-sm text-muted-foreground capitalize">
            {row.original.origin}
          </span>);
            },
            meta: {
                filter: {
                    type: "static",
                    options: [
                        { label: "Auto", value: "auto" },
                        { label: "Manual", value: "manual" },
                        { label: "Reprint", value: "reprint" }
                    ]
                }
            }
        },
        {
            accessorKey: "createdAt",
            header: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["When"], ["When"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<span className="text-sm text-muted-foreground">
            {(0, utils_1.formatDateTime)(row.original.createdAt)}
          </span>);
            },
            meta: {
                icon: <lu_1.LuCalendar />
            }
        }
    ]; }, [t]);
    var renderExpandedRow = (0, react_2.useCallback)(function (job) { return <ExpandedRowContent job={job}/>; }, []);
    var renderContextMenu = (0, react_2.useCallback)(function (job) { return (<>
        <react_1.MenuItem disabled={job.status === "generating"} onClick={function () {
            fetcher.submit({ intent: "viewContent", printJobId: job.id }, { method: "post" });
        }}>
          <react_1.MenuIcon icon={<lu_1.LuEye />}/>
          <macro_1.Trans>View</macro_1.Trans>
        </react_1.MenuItem>
        <react_1.MenuItem disabled={job.status === "generating"} onClick={function () {
            fetcher.submit({
                intent: "reprint",
                printJobId: job.id,
                printerUrl: job.printerUrl
            }, { method: "post" });
        }}>
          <react_1.MenuIcon icon={<lu_1.LuRefreshCw />}/>
          <macro_1.Trans>Reprint</macro_1.Trans>
        </react_1.MenuItem>
        <react_1.MenuItem destructive onClick={function () {
            fetcher.submit({ intent: "delete", printJobId: job.id }, { method: "post" });
        }}>
          <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
          <macro_1.Trans>Delete</macro_1.Trans>
        </react_1.MenuItem>
      </>); }, [fetcher]);
    return (<>
      <components_1.Table data={jobs} columns={columns} count={count} title={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Print Jobs"], ["Print Jobs"])))} table="printJob" withSearch withPagination renderExpandedRow={renderExpandedRow} renderContextMenu={renderContextMenu}/>
      {viewContent && (<react_1.Modal open onOpenChange={function (open) {
                if (!open)
                    setViewContent(null);
            }}>
          <react_1.ModalContent size="large">
            <react_1.ModalHeader>
              <react_1.ModalTitle>
                <macro_1.Trans>
                  Print Output ({(_b = viewContent.contentType) === null || _b === void 0 ? void 0 : _b.toUpperCase()})
                </macro_1.Trans>
              </react_1.ModalTitle>
            </react_1.ModalHeader>
            <react_1.ModalBody>
              {viewContent.contentType === "zpl" ? (<ZplPreview zpl={viewContent.content}/>) : viewContent.contentType === "pdf" ? (<iframe src={"data:application/pdf;base64,".concat(viewContent.content)} className="w-full h-[60vh] border border-border rounded-md" title={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["PDF Preview"], ["PDF Preview"])))}/>) : null}
            </react_1.ModalBody>
            <react_1.ModalFooter>
              <react_1.Button variant="secondary" onClick={function () { return setViewContent(null); }}>
                <macro_1.Trans>Close</macro_1.Trans>
              </react_1.Button>
            </react_1.ModalFooter>
          </react_1.ModalContent>
        </react_1.Modal>)}
    </>);
});
PrintJobsTable.displayName = "PrintJobsTable";
exports.default = PrintJobsTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
