"use strict";
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
exports.PrintButton = PrintButton;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var LabelDownloadModal_1 = require("./LabelDownloadModal");
var PrintingProvider_1 = require("./PrintingProvider");
function PrintButton(_a) {
    var _b;
    var sourceDocument = _a.sourceDocument, sourceDocumentId = _a.sourceDocumentId, locationId = _a.locationId, context = _a.context, workCenterId = _a.workCenterId, fileRoutes = _a.fileRoutes, disabled = _a.disabled;
    var _c = (0, PrintingProvider_1.usePrinting)(), printerRoutes = _c.printerRoutes, resolvePrinterRoute = _c.resolvePrinterRoute, printPath = _c.printPath;
    var modal = (0, react_1.useDisclosure)();
    var downloadModal = (0, react_1.useDisclosure)();
    var fetcher = (0, react_router_1.useFetcher)();
    var defaultPrinter = resolvePrinterRoute(locationId, context, workCenterId);
    var _d = (0, react_2.useState)((_b = defaultPrinter === null || defaultPrinter === void 0 ? void 0 : defaultPrinter.id) !== null && _b !== void 0 ? _b : ""), selectedPrinterId = _d[0], setSelectedPrinterId = _d[1];
    (0, react_2.useEffect)(function () {
        var _a, _b, _c;
        if (modal.isOpen) {
            setSelectedPrinterId((_c = (_a = defaultPrinter === null || defaultPrinter === void 0 ? void 0 : defaultPrinter.id) !== null && _a !== void 0 ? _a : (_b = printerRoutes[0]) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : "");
        }
    }, [modal.isOpen, defaultPrinter === null || defaultPrinter === void 0 ? void 0 : defaultPrinter.id, printerRoutes]);
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
            react_1.toast.success(fetcher.data.message);
            modal.onClose();
        }
        else if (((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success) === false) {
            react_1.toast.error(fetcher.data.message);
        }
    }, [fetcher.data, modal.onClose]);
    var handleClick = function () {
        if (printerRoutes.length > 0) {
            modal.onOpen();
        }
        else {
            downloadModal.onOpen();
        }
    };
    var handlePrint = function () {
        fetcher.submit(__assign(__assign(__assign({ sourceDocument: sourceDocument, sourceDocumentId: sourceDocumentId }, (locationId ? { locationId: locationId } : {})), (workCenterId ? { workCenterId: workCenterId } : {})), { printerRouteId: selectedPrinterId }), {
            method: "POST",
            action: printPath,
            encType: "application/json"
        });
    };
    return (<>
      <react_1.Button leftIcon={<lu_1.LuPrinter />} variant="secondary" disabled={disabled} onClick={handleClick}>
        <macro_1.Trans>Print</macro_1.Trans>
      </react_1.Button>

      {modal.isOpen && (<react_1.Modal open onOpenChange={function (open) { return !open && modal.onClose(); }}>
          <react_1.ModalContent>
            <react_1.ModalHeader>
              <react_1.ModalTitle>
                <macro_1.Trans>Select Printer</macro_1.Trans>
              </react_1.ModalTitle>
            </react_1.ModalHeader>
            <react_1.ModalBody>
              <div className="flex flex-col gap-1">
                {printerRoutes.map(function (route) { return (<button type="button" key={route.id} className={"flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ".concat(selectedPrinterId === route.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted")} onClick={function () { return setSelectedPrinterId(route.id); }}>
                    <lu_1.LuPrinter className="size-4 text-muted-foreground shrink-0"/>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium">{route.name}</span>
                      <span className="text-xs text-muted-foreground ml-2 uppercase">
                        {route.format}
                      </span>
                      {route.mediaSizeId && (<span className="text-xs text-muted-foreground ml-2">
                          {route.mediaSizeId}
                        </span>)}
                    </div>
                    {selectedPrinterId === route.id && (<lu_1.LuCheck className="size-4 text-primary shrink-0"/>)}
                  </button>); })}
              </div>
            </react_1.ModalBody>
            <react_1.ModalFooter>
              <div className="flex gap-2">
                <react_1.Button variant="primary" leftIcon={<lu_1.LuPrinter />} disabled={!selectedPrinterId || fetcher.state !== "idle"} onClick={handlePrint}>
                  <macro_1.Trans>Print</macro_1.Trans>
                </react_1.Button>
                <react_1.Button variant="solid" onClick={modal.onClose}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
              </div>
            </react_1.ModalFooter>
          </react_1.ModalContent>
        </react_1.Modal>)}

      <LabelDownloadModal_1.LabelDownloadModal sourceDocumentId={sourceDocumentId} fileRoutes={fileRoutes} isOpen={downloadModal.isOpen} onClose={downloadModal.onClose}/>
    </>);
}
