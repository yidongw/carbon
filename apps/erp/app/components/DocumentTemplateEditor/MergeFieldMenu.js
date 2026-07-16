"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeFieldMenu = MergeFieldMenu;
var template_1 = require("@carbon/documents/template");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var context_1 = require("./context");
/**
 * Dropdown of the document's merge fields. Inserting one hands the caller the
 * `{token}` snippet to splice into whatever it's editing (a key-value cell,
 * rich text, etc.).
 */
function MergeFieldMenu(_a) {
    var onInsert = _a.onInsert, _b = _a.label, label = _b === void 0 ? "Field" : _b;
    var documentType = (0, context_1.useDocumentTemplate)().documentType;
    var fields = (0, template_1.getMergeFields)(documentType);
    if (fields.length === 0)
        return null;
    var groups = __spreadArray([], new Set(fields.map(function (f) { return f.group; })), true);
    return (<react_1.DropdownMenu>
      <react_1.DropdownMenuTrigger asChild>
        <react_1.Button variant="ghost" size="sm" leftIcon={<lu_1.LuBraces />} className="shrink-0 text-muted-foreground">
          {label}
        </react_1.Button>
      </react_1.DropdownMenuTrigger>
      <react_1.DropdownMenuContent align="end" className="max-h-72 overflow-y-auto">
        {groups.map(function (group) { return (<react_2.Fragment key={group}>
            <react_1.DropdownMenuLabel>{group}</react_1.DropdownMenuLabel>
            {fields
                .filter(function (f) { return f.group === group; })
                .map(function (field) { return (<react_1.DropdownMenuItem key={field.token} onClick={function () { return onInsert((0, template_1.mergeToken)(field.token)); }}>
                  {field.label}
                </react_1.DropdownMenuItem>); })}
          </react_2.Fragment>); })}
      </react_1.DropdownMenuContent>
    </react_1.DropdownMenu>);
}
