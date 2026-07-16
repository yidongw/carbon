"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_dropzone_1 = require("react-dropzone");
var lu_1 = require("react-icons/lu");
var FileDropzone = function (_a) {
    var onDrop = _a.onDrop;
    var _b = (0, react_dropzone_1.useDropzone)({
        onDrop: onDrop,
        maxFiles: 1,
        multiple: false
    }), getRootProps = _b.getRootProps, getInputProps = _b.getInputProps, isDragActive = _b.isDragActive;
    return (<div {...getRootProps()} className={(0, react_1.cn)("mt-4 border-2 border-dashed rounded-md p-6 text-center hover:border-primary hover:bg-primary/10 w-full", isDragActive ? "border-primary bg-primary/10" : "border-muted")}>
      <input {...getInputProps()}/>
      <lu_1.LuCloudUpload className="mx-auto h-12 w-12 text-muted-foreground"/>
      <p className="mt-2 text-sm text-muted-foreground">
        <macro_1.Trans>Drag and drop a file here, or click to select a file</macro_1.Trans>
      </p>
    </div>);
};
exports.default = FileDropzone;
