"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACTIVITY_KIND_META = exports.DEFAULT_ENTITY_STATUS = exports.ENTITY_STATUS_META = void 0;
exports.entityStatusMeta = entityStatusMeta;
exports.activityKindFor = activityKindFor;
var lu_1 = require("react-icons/lu");
exports.ENTITY_STATUS_META = {
    Available: {
        color: "hsl(142 71% 45%)",
        icon: lu_1.LuPackageCheck,
        label: "Available"
    },
    Reserved: {
        color: "hsl(220 9% 46%)",
        icon: lu_1.LuPackageOpen,
        label: "Reserved"
    },
    "On Hold": { color: "hsl(25 95% 53%)", icon: lu_1.LuPause, label: "On Hold" },
    Rejected: { color: "hsl(0 84% 60%)", icon: lu_1.LuPackageX, label: "Rejected" },
    Consumed: {
        color: "hsl(217 91% 60%)",
        icon: lu_1.LuPackageMinus,
        label: "Consumed"
    }
};
exports.DEFAULT_ENTITY_STATUS = "Consumed";
function entityStatusMeta(status) {
    var _a;
    return ((_a = exports.ENTITY_STATUS_META[(status !== null && status !== void 0 ? status : exports.DEFAULT_ENTITY_STATUS)]) !== null && _a !== void 0 ? _a : exports.ENTITY_STATUS_META[exports.DEFAULT_ENTITY_STATUS]);
}
exports.ACTIVITY_KIND_META = {
    Receipt: { label: "Receipt", color: "hsl(173 80% 40%)", icon: lu_1.LuPackagePlus },
    Manufacturing: {
        label: "Manufacturing",
        color: "hsl(280 65% 60%)",
        icon: lu_1.LuFactory
    },
    Assembly: { label: "Assembly", color: "hsl(265 70% 65%)", icon: lu_1.LuWrench },
    Shipment: { label: "Shipment", color: "hsl(20 90% 55%)", icon: lu_1.LuTruck },
    Transfer: { label: "Transfer", color: "hsl(200 80% 55%)", icon: lu_1.LuForklift },
    Rework: { label: "Rework", color: "hsl(45 95% 55%)", icon: lu_1.LuRotateCw },
    Inspection: {
        label: "Inspection",
        color: "hsl(330 70% 60%)",
        icon: lu_1.LuClipboardCheck
    },
    Other: { label: "Other", color: "hsl(280 65% 60%)", icon: lu_1.LuPackage }
};
function activityKindFor(type) {
    if (!type)
        return "Other";
    var t = type.toLowerCase();
    if (t.includes("receipt") || t.includes("receive"))
        return "Receipt";
    if (t.includes("ship"))
        return "Shipment";
    // A pick is a warehouse→lineside transfer; render it with the Transfer kind
    // (the node label still shows the raw "Pick" type).
    if (t.includes("transfer") || t.includes("pick"))
        return "Transfer";
    if (t.includes("rework"))
        return "Rework";
    if (t.includes("inspect") || t.includes("qc") || t.includes("quality"))
        return "Inspection";
    if (t.includes("assembly") || t.includes("assemble"))
        return "Assembly";
    if (t.includes("manufactur") || t.includes("mfg") || t.includes("production"))
        return "Manufacturing";
    return "Other";
}
