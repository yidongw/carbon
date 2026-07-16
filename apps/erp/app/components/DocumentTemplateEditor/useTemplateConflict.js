"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTemplateConflict = useTemplateConflict;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var hooks_1 = require("~/hooks");
/**
 * Watches the company's `documentTemplate` rows over realtime and flags when
 * *another* user saves the template currently open in the editor. Own writes
 * (matched by `updatedBy`) are ignored, so saving here — or editing in another
 * of your own tabs — never raises a false conflict.
 *
 * The editor does not auto-revalidate on the event (that would silently discard
 * in-progress edits); it surfaces a banner letting the user refresh or keep
 * their version.
 */
function useTemplateConflict(documentType) {
    var _a = (0, hooks_1.useUser)(), userId = _a.id, company = _a.company;
    var _b = (0, react_2.useState)(false), conflict = _b[0], setConflict = _b[1];
    (0, react_1.useRealtimeChannel)({
        topic: "document-template-conflict:".concat(documentType),
        dependencies: [company.id, documentType, userId],
        setup: function (channel) {
            return channel.on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "documentTemplate",
                filter: "companyId=eq.".concat(company.id)
            }, function (payload) {
                var row = payload.new;
                // Only this template, and only someone else's write.
                if (!row || row.documentType !== documentType)
                    return;
                if (!row.updatedBy || row.updatedBy === userId)
                    return;
                setConflict(true);
            });
        }
    });
    return { conflict: conflict, dismiss: function () { return setConflict(false); } };
}
