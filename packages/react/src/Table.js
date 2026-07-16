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
exports.Tr = exports.Thead = exports.Th = exports.Tfoot = exports.Td = exports.Tbody = exports.TableCaption = exports.Table = void 0;
var react_1 = require("react");
var cn_1 = require("./utils/cn");
var Table = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, _b = _a.full, full = _b === void 0 ? false : _b, props = __rest(_a, ["className", "full"]);
    return full ? (<div className="w-full">
      <table ref={ref} className={(0, cn_1.cn)("w-full caption-bottom text-sm", className)} {...props}/>
    </div>) : (<div className="rounded-md w-full overflow-hidden">
      <div className="relative w-full overflow-auto">
        <table ref={ref} className={(0, cn_1.cn)("w-full caption-bottom text-sm", className)} {...props}/>
      </div>
    </div>);
});
exports.Table = Table;
Table.displayName = "Table";
var Thead = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<thead ref={ref} className={(0, cn_1.cn)("bg-transparent [&_tr]:border-b border-border", className)} {...props}/>);
});
exports.Thead = Thead;
Thead.displayName = "Thead";
var Tbody = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<tbody ref={ref} className={(0, cn_1.cn)("", className)} {...props}/>);
});
exports.Tbody = Tbody;
Tbody.displayName = "Tbody";
var Tfoot = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<tfoot ref={ref} className={(0, cn_1.cn)("font-medium text-foreground", className)} {...props}/>);
});
exports.Tfoot = Tfoot;
Tfoot.displayName = "Tfoot";
var Tr = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<tr ref={ref} className={(0, cn_1.cn)("group transition-colors data-[state=selected]:bg-muted", className)} {...props}/>);
});
exports.Tr = Tr;
Tr.displayName = "Tr";
var Th = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<th ref={ref} className={(0, cn_1.cn)("group-hover:bg-muted h-11 px-6 text-left align-middle text-foreground/80 bg-transparent font-medium text-sm [&:has([role=checkbox])]:pr-0", className)} {...props}/>);
});
exports.Th = Th;
Th.displayName = "Th";
var Td = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<td ref={ref} className={(0, cn_1.cn)("group-hover:bg-muted text-foreground/80 px-6 bg-transparent align-middle [&:has([role=checkbox])]:pr-0 h-11", className)} {...props}/>);
});
exports.Td = Td;
Td.displayName = "Td";
var TableCaption = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<caption ref={ref} className={(0, cn_1.cn)("mt-4 text-sm text-muted-foreground", className)} {...props}/>);
});
exports.TableCaption = TableCaption;
TableCaption.displayName = "TableCaption";
