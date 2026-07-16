"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var macro_1 = require("@lingui/react/macro");
var react_dropzone_1 = require("react-dropzone");
var lu_1 = require("react-icons/lu");
var FileDropzone = function (_a) {
    var onDrop = _a.onDrop, accept = _a.accept, _b = _a.multiple, multiple = _b === void 0 ? true : _b;
    var _c = (0, react_dropzone_1.useDropzone)({
        onDrop: onDrop,
        accept: accept,
        multiple: multiple
    }), getRootProps = _c.getRootProps, getInputProps = _c.getInputProps, isDragActive = _c.isDragActive;
    return (<div {...getRootProps()} className={"mt-4 border-2 border-dashed rounded-md p-6 text-center hover:border-primary hover:bg-primary/10 ".concat(isDragActive ? "border-primary bg-primary/10" : "border-card")}>
      <input {...getInputProps()}/>
      <lu_1.LuCloudUpload className="mx-auto h-12 w-12 text-muted-foreground"/>
      <p className="mt-2 text-sm text-muted-foreground">
        {multiple ? (<macro_1.Trans>Drag and drop some files here, or click to select files</macro_1.Trans>) : (<macro_1.Trans>Drag and drop a file here, or click to select a file</macro_1.Trans>)}
      </p>
    </div>);
};
exports.default = FileDropzone;
