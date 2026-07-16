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
exports.EditorCommandList = exports.EditorCommand = exports.EditorCommandOut = exports.EditorCommandTunnelContext = void 0;
var cmdk_1 = require("cmdk");
var jotai_1 = require("jotai");
var react_1 = require("react");
var atoms_1 = require("../utils/atoms");
var store_1 = require("../utils/store");
exports.EditorCommandTunnelContext = (0, react_1.createContext)({});
var EditorCommandOut = function (_a) {
    var query = _a.query, range = _a.range;
    var setQuery = (0, jotai_1.useSetAtom)(atoms_1.queryAtom, { store: store_1.novelStore });
    var setRange = (0, jotai_1.useSetAtom)(atoms_1.rangeAtom, { store: store_1.novelStore });
    (0, react_1.useEffect)(function () {
        setQuery(query);
    }, [query, setQuery]);
    (0, react_1.useEffect)(function () {
        setRange(range);
    }, [range, setRange]);
    (0, react_1.useEffect)(function () {
        var navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
        var onKeyDown = function (e) {
            if (navigationKeys.includes(e.key)) {
                e.preventDefault();
                var commandRef = document.querySelector("#slash-command");
                if (commandRef)
                    commandRef.dispatchEvent(new KeyboardEvent("keydown", {
                        key: e.key,
                        cancelable: true,
                        bubbles: true
                    }));
                return false;
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return function () {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, []);
    return (<exports.EditorCommandTunnelContext.Consumer>
      {function (tunnelInstance) { return <tunnelInstance.Out />; }}
    </exports.EditorCommandTunnelContext.Consumer>);
};
exports.EditorCommandOut = EditorCommandOut;
exports.EditorCommand = (0, react_1.forwardRef)(function (_a, ref) {
    var children = _a.children, className = _a.className, rest = __rest(_a, ["children", "className"]);
    var _b = (0, jotai_1.useAtom)(atoms_1.queryAtom), query = _b[0], setQuery = _b[1];
    return (<exports.EditorCommandTunnelContext.Consumer>
      {function (tunnelInstance) { return (<tunnelInstance.In>
          <cmdk_1.Command ref={ref} onKeyDown={function (e) {
                e.stopPropagation();
            }} id="slash-command" className={className} {...rest}>
            <cmdk_1.Command.Input value={query} onValueChange={setQuery} style={{ display: "none" }}/>
            {children}
          </cmdk_1.Command>
        </tunnelInstance.In>); }}
    </exports.EditorCommandTunnelContext.Consumer>);
});
exports.EditorCommandList = cmdk_1.Command.List;
exports.EditorCommand.displayName = "EditorCommand";
