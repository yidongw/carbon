"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelUpload = void 0;
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var react_dropzone_1 = require("react-dropzone");
var lu_1 = require("react-icons/lu");
var SIZE_LIMIT = (0, utils_1.getFileSizeLimit)("CAD_MODEL_UPLOAD");
var supportedModelTypes = ["stp", "step"];
var ModelUpload = function (_a) {
    var url = _a.url, file = _a.file, onFileChange = _a.onFileChange, className = _a.className;
    var hasFile = !!file || !!url;
    var _b = (0, react_dropzone_1.useDropzone)({
        accept: {
            "application/step": [".stp", ".step"]
        },
        disabled: hasFile,
        multiple: false,
        maxSize: SIZE_LIMIT.bytes,
        onDropAccepted: function (acceptedFiles) {
            var _a;
            var file = acceptedFiles[0];
            var fileExtension = (_a = file.name.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (!fileExtension || !supportedModelTypes.includes(fileExtension)) {
                react_1.toast.error("File type not supported");
                return;
            }
            if (file.size > SIZE_LIMIT.bytes) {
                react_1.toast.error("File size too big (max. ".concat(SIZE_LIMIT.format(), ")"));
                return;
            }
            onFileChange(file);
        },
        onDropRejected: function (fileRejections) {
            var errors = fileRejections[0].errors;
            var message;
            if (errors[0].code === "file-too-large") {
                message = "File size too big (max. ".concat(SIZE_LIMIT.format(), ")");
            }
            else if (errors[0].code === "file-invalid-type") {
                message = "File type not supported";
            }
            else {
                message = errors[0].message;
            }
            react_1.toast.error(message);
        }
    }), isDragActive = _b.isDragActive, getRootProps = _b.getRootProps, getInputProps = _b.getInputProps;
    return (<div {...getRootProps()} className={(0, react_1.cn)("group flex flex-col flex-grow rounded-lg border border-border bg-gradient-to-tr from-background to-card text-card-foreground shadow-sm w-full", !hasFile &&
            "cursor-pointer hover:border-primary/30 hover:border-dashed hover:to-primary/10 hover:via-card border-2 border-dashed", className)}>
      <input {...getInputProps()} name="file" className="sr-only"/>
      <div className="flex flex-col h-full w-full p-4">
        <div className="flex flex-col flex-grow items-center justify-center gap-2 p-6">
          {file && (<>
              <p className="text-base font-medium text-card-foreground">
                {file.name}
              </p>
              <p className="text-muted-foreground text-xs group-hover:text-foreground">
                {(0, utils_1.convertKbToString)(Math.ceil(file.size / 1024))}
              </p>
              <react_1.Spinner className="size-12"/>
            </>)}
          {!file && (<>
              <div className={(0, react_1.cn)("p-4 bg-accent rounded-full group-hover:bg-primary")}>
                <lu_1.LuCloudUpload className="mx-auto size-12 text-muted-foreground group-hover:text-primary-foreground"/>
              </div>
              {isDragActive ? (<p className="text-lg text-muted-foreground group-hover:text-foreground mt-8">
                  Drop file here
                </p>) : (<>
                  <p className="text-base font-medium text-muted-foreground group-hover:text-foreground mt-8">
                    Choose file to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground group-hover:text-foreground">
                    Supports {supportedModelTypes.join(", ")} files
                  </p>
                </>)}
            </>)}
        </div>
      </div>
    </div>);
};
exports.ModelUpload = ModelUpload;
