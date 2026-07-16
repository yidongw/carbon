"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeConfig = ThemeConfig;
exports.hasThemeColors = hasThemeColors;
var template_1 = require("@carbon/documents/template");
var ColorPicker_1 = require("~/components/ColorPicker");
var context_1 = require("./context");
var SWATCHES = {
    accent: { label: "Accent", hint: "Line-items header bar" },
    accentForeground: { label: "Accent text", hint: "Text on the accent bar" },
    heading: { label: "Headings", hint: "Section titles (BILL TO, NOTES…)" },
    text: { label: "Body text", hint: "Addresses, values, item details" }
};
function ThemeConfig() {
    var documentType = (0, context_1.useEditorStore)(function (s) { return s.documentType; });
    var theme = (0, context_1.useEditorStore)(function (s) { return s.theme; });
    var setThemeColor = (0, context_1.useEditorStore)(function (s) { return s.setThemeColor; });
    var keys = (0, template_1.documentThemeColors)(documentType);
    if (keys.length === 0)
        return null;
    return (<div className="flex flex-col gap-3">
      {keys.map(function (key) { return (<div key={key} className="flex flex-col gap-1.5">
          <div className="flex flex-col">
            <span className="text-sm">{SWATCHES[key].label}</span>
            <span className="text-xs text-muted-foreground">
              {SWATCHES[key].hint}
            </span>
          </div>
          <ColorPicker_1.ColorPicker value={theme[key]} onChange={function (value) { return setThemeColor(key, value); }}/>
        </div>); })}
    </div>);
}
/** Whether any theme color applies to this document (gates the Colors tab). */
function hasThemeColors(documentType) {
    return (0, template_1.documentThemeColors)(documentType).length > 0;
}
