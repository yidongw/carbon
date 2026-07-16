"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PdfViewer;
var react_1 = require("@carbon/react");
var pdf_worker_min_mjs_url_1 = require("pdfjs-dist/build/pdf.worker.min.mjs?url");
var react_2 = require("react");
var react_pdf_1 = require("react-pdf");
react_pdf_1.pdfjs.GlobalWorkerOptions.workerSrc = pdf_worker_min_mjs_url_1.default;
function SkeletonDocument() {
    return (<div className="flex flex-col space-y-3 p-3">
      <react_1.Skeleton className="h-[380px] bg-muted w-full rounded-md"/>
      <div className="space-y-2">
        <react_1.Skeleton className="h-4 bg-muted w-full rounded-md"/>
        <react_1.Skeleton className="h-4 bg-muted w-full rounded-md"/>
      </div>
    </div>);
}
function PdfViewer(_a) {
    var file = _a.file;
    var _b = (0, react_2.useState)(), numPages = _b[0], setNumPages = _b[1];
    return (<react_pdf_1.Document file={file} onLoadSuccess={function (_a) {
        var numPages = _a.numPages;
        return setNumPages(numPages);
    }} loading={<SkeletonDocument />}>
      <div className="overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent max-h-[calc(100dvh-91px)]">
        {Array.from(new Array(numPages), function (_, index) { return (<react_pdf_1.Page key={"page_".concat(index + 1)} pageNumber={index + 1} renderTextLayer={false} width={680} height={780}/>); })}
      </div>
    </react_pdf_1.Document>);
}
