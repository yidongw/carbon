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
exports.File = void 0;
var react_1 = require("react");
var Button_1 = require("./Button");
var File = function (_a) {
    var _b;
    var accept = _a.accept, className = _a.className, children = _a.children, _c = _a.multiple, multiple = _c === void 0 ? false : _c, onChange = _a.onChange, props = __rest(_a, ["accept", "className", "children", "multiple", "onChange"]);
    var fileInputRef = (0, react_1.useRef)(null);
    return (<div className="flex w-auto">
      <input ref={fileInputRef} type="file" hidden multiple={multiple} accept={accept} onChange={onChange}/>
      <Button_1.Button className={className} {...props} variant={(_b = props.variant) !== null && _b !== void 0 ? _b : "secondary"} onClick={function () {
            if (fileInputRef.current)
                fileInputRef.current.click();
        }}>
        {children}
      </Button_1.Button>
    </div>);
};
exports.File = File;
