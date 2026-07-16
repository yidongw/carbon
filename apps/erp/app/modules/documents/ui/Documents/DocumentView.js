"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var DocumentIcon_1 = require("~/components/DocumentIcon");
var path_1 = require("~/utils/path");
var useDocument_1 = require("./useDocument");
var PdfViewer = (0, react_2.lazy)(function () { return Promise.resolve().then(function () { return require("./PdfViewer"); }); });
function SkeletonDocument() {
    return (<div className="flex flex-col space-y-3 p-3">
      <react_1.Skeleton className="h-[380px] bg-muted w-full rounded-md"/>
      <div className="space-y-2">
        <react_1.Skeleton className="h-4 bg-muted w-full rounded-md"/>
        <react_1.Skeleton className="h-4 bg-muted w-full rounded-md"/>
      </div>
    </div>);
}
var DocumentPreview = function (_a) {
    var _b;
    var bucket = _a.bucket, document = _a.document;
    var download = (0, useDocument_1.useDocument)().download;
    switch (document.type) {
        case "Image":
            return (<img src={path_1.path.to.file.previewFile("".concat(bucket, "/").concat(document.path))} className="object-contain" width={"680"} alt="Preview"/>);
        case "PDF":
            return (<react_2.Suspense fallback={<SkeletonDocument />}>
          <PdfViewer file={path_1.path.to.file.previewFile("".concat(bucket, "/").concat(document.path))}/>
        </react_2.Suspense>);
        default:
            return (<div className="flex flex-1 border-t border-border flex-col items-center justify-start w-full h-full pt-24">
          <DocumentIcon_1.default className="w-24 h-36 mb-2" type={document.type}/>
          <p className="text-xl mb-1">{document.name}</p>
          <p className="text-muted-foreground mb-4">
            {(0, utils_1.convertKbToString)((_b = document.size) !== null && _b !== void 0 ? _b : 0)}
          </p>
          <react_1.Button size="lg" leftIcon={<lu_1.LuDownload />} onClick={function () { return download(document); }}>
            <macro_1.Trans>Download</macro_1.Trans>
          </react_1.Button>
        </div>);
    }
};
var DocumentView = function (_a) {
    var bucket = _a.bucket, document = _a.document;
    var navigate = (0, react_router_1.useNavigate)();
    var onClose = function () { return navigate(path_1.path.to.documents); };
    var download = (0, useDocument_1.useDocument)().download;
    return (<>
      <react_1.ResizableHandle withHandle/>
      <react_1.ResizablePanel defaultSize={50} maxSize={70} minSize={25} className="bg-background">
        <div className="flex items-center justify-between p-0.5">
          <react_1.Button isIcon variant={"ghost"} onClick={onClose}>
            <lu_1.LuX className="w-4 h-4"/>
          </react_1.Button>
          <span className="text-sm">{document.name}</span>
          <react_1.Button variant={"ghost"} onClick={function () { return download(document); }}>
            <lu_1.LuDownload className="w-4 h-4 mr-2"/>
            <macro_1.Trans>Download</macro_1.Trans>
          </react_1.Button>
        </div>
        <DocumentPreview bucket={bucket} document={document}/>
      </react_1.ResizablePanel>
    </>);
};
exports.default = DocumentView;
