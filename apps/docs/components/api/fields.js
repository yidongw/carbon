"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyType = prettyType;
exports.Fields = Fields;
function prettyType(a) {
    if (a.format) {
        var enumName = a.format.match(/"([^"]+)"/);
        if (enumName)
            return enumName[1];
        if (a.format.includes("timestamp"))
            return "timestamp";
        if (["integer", "bigint", "numeric", "smallint", "double precision", "real"].includes(a.format))
            return "number";
        if (a.format === "date")
            return "date";
        if (a.format === "uuid")
            return "uuid";
        if (a.format === "boolean")
            return "boolean";
        if (a.format.startsWith("json"))
            return "object";
    }
    return a.type;
}
function Row(_a) {
    var field = _a.field;
    return (<div className="py-[14px]">
      <div className="flex items-center gap-[8px] flex-wrap">
        <code className="font-[family-name:var(--font-mono)] text-[13.5px] text-[#262323]">
          {field.name}
        </code>
        <span className="font-[family-name:var(--font-mono)] text-[12px] text-[rgba(38,35,35,0.54)]">
          {prettyType(field)}
        </span>
        {field.required && (<span className="text-[11px] font-medium text-[#9C7136]">required</span>)}
        {field.pk && (<span className="text-[11px] font-medium text-[#1E84B0]">primary key</span>)}
      </div>
      {field.description && (<p className="m-0 mt-[6px] text-[14.5px] leading-[150%] text-[rgba(38,35,35,0.74)]">
          {field.description}
        </p>)}
      {field.fk && (<p className="m-0 mt-[4px] text-[13px] text-[rgba(38,35,35,0.58)]">
          References{" "}
          <code className="font-[family-name:var(--font-mono)]">
            {field.fk.table}.{field.fk.column}
          </code>
        </p>)}
    </div>);
}
function Fields(_a) {
    var _b;
    var title = _a.title, attributes = _a.attributes, query = _a.query;
    var fields = (_b = attributes !== null && attributes !== void 0 ? attributes : query === null || query === void 0 ? void 0 : query.map(function (q) { return (__assign({}, q)); })) !== null && _b !== void 0 ? _b : [];
    if (!fields.length)
        return null;
    return (<div className="mt-[28px]">
      <h3 className="m-0 mb-[2px] text-[13.5px] font-[560] uppercase tracking-[0.05em] text-[rgba(38,35,35,0.58)]">
        {title}
      </h3>
      <div className="divide-y divide-[#E7E7E3] border-t border-[#E7E7E3]">
        {fields.map(function (f) { return (<Row key={f.name} field={f}/>); })}
      </div>
    </div>);
}
