"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var react_2 = require("react");
var path_1 = require("~/utils/path");
var FilePreview = (0, react_2.forwardRef)(function (_a, ref) {
    var bucket = _a.bucket, pathToFile = _a.pathToFile, type = _a.type, children = _a.children, className = _a.className, props = __rest(_a, ["bucket", "pathToFile", "type", "children", "className"]);
    return (<react_1.HoverCard>
      <react_1.HoverCardTrigger>{children}</react_1.HoverCardTrigger>
      {type === "PDF" ? (<react_1.HoverCardContent align="start" ref={ref} {...props} className={(0, react_1.cn)("w-[425px] h-[550px] overflow-hidden p-0", className)}>
          <iframe seamless title={pathToFile} width="425" height="550" src={path_1.path.to.file.previewFile("".concat(bucket, "/").concat(pathToFile))}/>
        </react_1.HoverCardContent>) : (<react_1.HoverCardContent align="start" className="w-[400px] h-[400px] overflow-hidden p-0 z-[100]">
          <iframe seamless title={pathToFile} width="400" height="400" src={path_1.path.to.file.previewImage(bucket, pathToFile)}/>
        </react_1.HoverCardContent>)}
    </react_1.HoverCard>);
});
FilePreview.displayName = "FilePreview";
exports.default = FilePreview;
