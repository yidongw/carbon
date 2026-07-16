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
var Avatar = (0, react_2.forwardRef)(function (_a, ref) {
    var name = _a.name, path = _a.path, _b = _a.bucket, bucket = _b === void 0 ? "avatars" : _b, props = __rest(_a, ["name", "path", "bucket"]);
    var imageUrl = props.imageUrl
        ? props.imageUrl
        : path
            ? path.startsWith("http")
                ? path
                : (0, path_1.getStoragePath)(bucket, path)
            : undefined;
    return <react_1.Avatar src={imageUrl} name={name} ref={ref} {...props}/>;
});
Avatar.displayName = "Avatar";
exports.default = Avatar;
