"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelDownloadModal = LabelDownloadModal;
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var PrintingProvider_1 = require("./PrintingProvider");
function LabelDownloadModal(_a) {
    var sourceDocumentId = _a.sourceDocumentId, fileRoutes = _a.fileRoutes, isOpen = _a.isOpen, onClose = _a.onClose;
    var _b = (0, PrintingProvider_1.usePrinting)(), useMetric = _b.useMetric, settingsPath = _b.settingsPath, settingsExternal = _b.settingsExternal;
    if (!isOpen)
        return null;
    var openFile = function (url) {
        window.open(window.location.origin + url, "_blank");
        onClose();
    };
    var renderSizes = function (sizes) { return (<div className="flex flex-col gap-1">
      {sizes
            .filter(function (s) { return s.zpl; })
            .map(function (size) { return (<button type="button" key={"zpl-".concat(size.id)} className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted transition-colors text-left" onClick={function () {
                return openFile(fileRoutes.zpl(sourceDocumentId, { labelSize: size.id }));
            }}>
            <lu_1.LuDownload className="size-4 text-muted-foreground shrink-0"/>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium">
                {(0, utils_1.getLabelSizeLabel)(size)}
              </span>
            </div>
            <react_1.Badge variant="green">ZPL</react_1.Badge>
          </button>); })}
      {sizes.map(function (size) { return (<button type="button" key={"pdf-".concat(size.id)} className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted transition-colors text-left" onClick={function () {
                return openFile(fileRoutes.pdf(sourceDocumentId, { labelSize: size.id }));
            }}>
          <lu_1.LuDownload className="size-4 text-muted-foreground shrink-0"/>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium">
              {(0, utils_1.getLabelSizeLabel)(size)}
            </span>
          </div>
          <react_1.Badge variant="blue">PDF</react_1.Badge>
        </button>); })}
    </div>); };
    var metricSizes = utils_1.labelSizes.filter(function (s) { return s.metric; });
    var imperialSizes = utils_1.labelSizes.filter(function (s) { return !s.metric; });
    return (<react_1.Modal open onOpenChange={function (open) { return !open && onClose(); }}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Download Labels</macro_1.Trans>
          </react_1.ModalTitle>
        </react_1.ModalHeader>
        <react_1.ModalBody>
          <div className="flex flex-col gap-4 pb-4">
            <react_1.Alert variant="info">
              <lu_1.LuInfo className="size-4"/>
              <react_1.AlertTitle>
                <macro_1.Trans>No printer configured</macro_1.Trans>
              </react_1.AlertTitle>
              <react_1.AlertDescription>
                <div className="flex items-center justify-between gap-4">
                  <span>
                    <macro_1.Trans>
                      Add a printer in the printing settings to print labels
                      directly.
                    </macro_1.Trans>
                  </span>
                  <react_1.Button variant="secondary" size="sm" asChild>
                    {settingsExternal ? (<a href={settingsPath} target="_blank" rel="noreferrer">
                        <macro_1.Trans>Printer Settings</macro_1.Trans>
                      </a>) : (<react_router_1.Link to={settingsPath}>
                        <macro_1.Trans>Printer Settings</macro_1.Trans>
                      </react_router_1.Link>)}
                  </react_1.Button>
                </div>
              </react_1.AlertDescription>
            </react_1.Alert>
            <react_1.Tabs defaultValue={useMetric ? "metric" : "imperial"}>
              <react_1.TabsList className="grid w-full grid-cols-2">
                <react_1.TabsTrigger value="imperial">
                  <macro_1.Trans>Imperial</macro_1.Trans>
                </react_1.TabsTrigger>
                <react_1.TabsTrigger value="metric">
                  <macro_1.Trans>Metric</macro_1.Trans>
                </react_1.TabsTrigger>
              </react_1.TabsList>
              <react_1.TabsContent className="mt-2" value="imperial">
                {renderSizes(imperialSizes)}
              </react_1.TabsContent>
              <react_1.TabsContent className="mt-2" value="metric">
                {renderSizes(metricSizes)}
              </react_1.TabsContent>
            </react_1.Tabs>
          </div>
        </react_1.ModalBody>
      </react_1.ModalContent>
    </react_1.Modal>);
}
