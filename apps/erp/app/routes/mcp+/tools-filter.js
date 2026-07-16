"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterTools = filterTools;
function filterTools(tools, f) {
    var q = f.q.trim().toLowerCase();
    return tools.filter(function (t) {
        if (f.module && t.module !== f.module)
            return false;
        if (f.classification && t.classification !== f.classification)
            return false;
        if (q && !"".concat(t.name, " ").concat(t.description).toLowerCase().includes(q))
            return false;
        return true;
    });
}
