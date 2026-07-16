"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Redirect = void 0;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var Redirect = function (_a) {
    var path = _a.path;
    var _b = (0, react_2.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    (0, react_2.useEffect)(function () {
        window.location.href = path;
        setIsLoading(false);
    }, [path]);
    return (<div className="flex h-screen w-screen items-center justify-center">
      <react_1.Loading className="size-8" isLoading={isLoading}/>
    </div>);
};
exports.Redirect = Redirect;
