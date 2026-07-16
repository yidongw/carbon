"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FontConfig = FontConfig;
var template_1 = require("@carbon/documents/template");
var react_1 = require("@carbon/react");
var context_1 = require("./context");
/** Document body font selector (applies to the whole document). */
function FontConfig() {
    var _a = (0, context_1.useDocumentTemplate)(), settings = _a.settings, setSetting = _a.setSetting;
    return (<div className="flex flex-col gap-1.5">
      <react_1.Label>Body font</react_1.Label>
      <react_1.Select value={settings.fontFamily} onValueChange={function (v) {
            return setSetting("fontFamily", v);
        }}>
        <react_1.SelectTrigger>
          <react_1.SelectValue />
        </react_1.SelectTrigger>
        <react_1.SelectContent>
          {template_1.DOCUMENT_FONTS.map(function (f) { return (<react_1.SelectItem key={f.value} value={f.value}>
              <span className="flex w-full items-center justify-between gap-3">
                <span>{f.label}</span>
                <span className="text-xs text-muted-foreground">{f.kind}</span>
              </span>
            </react_1.SelectItem>); })}
        </react_1.SelectContent>
      </react_1.Select>
      <p className="text-xs text-muted-foreground">
        Applies to the whole document.
      </p>
    </div>);
}
