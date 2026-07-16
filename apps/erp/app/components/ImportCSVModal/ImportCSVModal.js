"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportCSVModal = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var AnimatedSizeContainer_1 = require("../AnimatedSizeContainer");
var FieldMappings_1 = require("./FieldMappings");
var UploadCSV_1 = require("./UploadCSV");
var useCsvContext_1 = require("./useCsvContext");
var ImportCSVPage;
(function (ImportCSVPage) {
    ImportCSVPage["UploadCSV"] = "upload-csv";
    ImportCSVPage["FieldMappings"] = "field-mapping";
})(ImportCSVPage || (ImportCSVPage = {}));
var pages = [ImportCSVPage.UploadCSV, ImportCSVPage.FieldMappings];
var formId = "import-csv-modal";
var ImportCSVModal = function (_a) {
    var _b, _c, _d, _e;
    var table = _a.table, onClose = _a.onClose;
    var fetcher = (0, react_router_1.useFetcher)();
    var _f = (0, react_2.useState)(ImportCSVPage.UploadCSV), page = _f[0], setPage = _f[1];
    var _g = (0, react_2.useState)(null), file = _g[0], setFile = _g[1];
    var _h = (0, react_2.useState)(null), filePath = _h[0], setFilePath = _h[1];
    var _j = (0, react_2.useState)(null), fileColumns = _j[0], setFileColumns = _j[1];
    var _k = (0, react_2.useState)(null), firstRows = _k[0], setFirstRows = _k[1];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var _a, _b, _c, _d, _e;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === true) {
            var inserted = (_b = fetcher.data.inserted) !== null && _b !== void 0 ? _b : 0;
            var updated = (_c = fetcher.data.updated) !== null && _c !== void 0 ? _c : 0;
            var skipped = (_d = fetcher.data.skipped) !== null && _d !== void 0 ? _d : 0;
            if (skipped > 0) {
                // Leave the modal open so the user sees which rows were skipped.
                react_1.toast.info("Imported ".concat(inserted, ", updated ").concat(updated, ", skipped ").concat(skipped, " row(s)."));
            }
            else {
                react_1.toast.success("Imported ".concat(inserted, ", updated ").concat(updated, "."));
                onClose();
            }
        }
        else if (((_e = fetcher.data) === null || _e === void 0 ? void 0 : _e.success) === false) {
            react_1.toast.error(fetcher.data.message);
        }
    }, [(_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success]);
    // if the file upload is successful, set the page to field-mapping
    (0, react_2.useEffect)(function () {
        if (file && fileColumns && page === ImportCSVPage.UploadCSV) {
            setPage(ImportCSVPage.FieldMappings);
        }
    }, [file, fileColumns, page]);
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.ModalContent onInteractOutside={function (e) { return e.preventDefault(); }}>
        <div className="relative">
          <AnimatedSizeContainer_1.AnimatedSizeContainer height>
            <useCsvContext_1.ImportCsvContext.Provider value={{
            file: file,
            fileColumns: fileColumns,
            firstRows: firstRows,
            filePath: filePath,
            setFile: setFile,
            setFileColumns: setFileColumns,
            setFirstRows: setFirstRows,
            setFilePath: setFilePath
        }}>
              <div>
                <form_1.ValidatedForm className="flex flex-col gap-y-4" fetcher={fetcher} method="post" action={path_1.path.to.import(table)} validator={shared_1.importSchemas[table].extend({
            filePath: zod_1.z
                .string()
                .min(1, { message: "Path is required" }),
            enumMappings: zod_1.z.string().optional()
        })} id={formId} onSubmit={function () {
            react_1.toast.info("Importing...");
        }}>
                  <form_1.Hidden name="filePath" value={filePath !== null && filePath !== void 0 ? filePath : ""}/>
                  {page === ImportCSVPage.UploadCSV && (<UploadCSV_1.UploadCSV table={table}/>)}
                  {page === ImportCSVPage.FieldMappings && (<FieldMappings_1.FieldMapping formId={formId} table={table} onReset={function () {
                (0, react_dom_1.flushSync)(function () {
                    setFile(null);
                    setFileColumns(null);
                    setFirstRows(null);
                });
                setPage(ImportCSVPage.UploadCSV);
            }}/>)}
                </form_1.ValidatedForm>
                {((_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.success) === true &&
            ((_d = fetcher.data.skipped) !== null && _d !== void 0 ? _d : 0) > 0 && (<div className="mt-4 rounded-md border border-border p-3">
                      <p className="text-sm font-medium">
                        {fetcher.data.skipped} row(s) were skipped:
                      </p>
                      <ul className="mt-2 max-h-48 overflow-auto text-sm text-muted-foreground">
                        {((_e = fetcher.data.errors) !== null && _e !== void 0 ? _e : []).map(function (e) { return (<li key={e.row}>
                              Row {e.row + 1}: {e.reason}
                            </li>); })}
                      </ul>
                      <react_1.Button className="mt-3" variant="secondary" onClick={onClose}>
                        Done
                      </react_1.Button>
                    </div>)}
              </div>
            </useCsvContext_1.ImportCsvContext.Provider>
          </AnimatedSizeContainer_1.AnimatedSizeContainer>
        </div>
      </react_1.ModalContent>
    </react_1.Modal>);
};
exports.ImportCSVModal = ImportCSVModal;
