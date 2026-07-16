"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HEADER_LOGO_ID = void 0;
exports.useHeaderConfig = useHeaderConfig;
var template_1 = require("@carbon/documents/template");
var react_1 = require("react");
var context_1 = require("./context");
/** Synthetic selection id for the header's Logo child node in the block tree. */
exports.HEADER_LOGO_ID = "__header_logo__";
/**
 * Read + edit the document header's layout config (logo + which fields show).
 * The config is live editor state (see the store's `headerConfig`); it persists
 * with the rest of the template on Save, so edits show in the preview instantly
 * and mark the template dirty. `section` resolves the referenced header section
 * (for its name / existence check).
 */
function useHeaderConfig() {
    var section = (0, context_1.useEditorStore)(function (s) {
        return s.sections.find(function (x) { var _a; return x.id === ((_a = s.headerSectionId) !== null && _a !== void 0 ? _a : template_1.BUILT_IN_SECTION_IDS.header); });
    });
    var config = (0, context_1.useEditorStore)(function (s) { return s.headerConfig; });
    var setHeaderConfig = (0, context_1.useEditorStore)(function (s) { return s.setHeaderConfig; });
    var patch = (0, react_1.useCallback)(function (partial) { return setHeaderConfig(partial); }, [setHeaderConfig]);
    return { section: section, config: config, patch: patch };
}
