"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lu_1 = require("react-icons/lu");
var components_1 = require("~/components");
var Activity_1 = require("~/components/Activity");
var path_1 = require("~/utils/path");
var getActivityText = function (ledgerRecord) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    switch (ledgerRecord.documentType) {
        case "Purchase Receipt":
            return "received ".concat(ledgerRecord.quantity, " units").concat(((_a = ledgerRecord.storageUnit) === null || _a === void 0 ? void 0 : _a.name)
                ? " to ".concat(ledgerRecord.storageUnit.name)
                : "").concat(ledgerRecord.trackedEntityId
                ? " from ".concat(Math.abs(ledgerRecord.quantity) > 1 ? "batch" : "serial", " ").concat(ledgerRecord.trackedEntityId)
                : "");
        case "Purchase Invoice":
            return "invoiced ".concat(ledgerRecord.quantity, " units").concat(((_b = ledgerRecord.storageUnit) === null || _b === void 0 ? void 0 : _b.name)
                ? " on ".concat(ledgerRecord.storageUnit.name)
                : "");
        case "Sales Shipment":
            return "shipped ".concat(-1 * ledgerRecord.quantity, " units").concat(((_c = ledgerRecord.storageUnit) === null || _c === void 0 ? void 0 : _c.name)
                ? " from ".concat(ledgerRecord.storageUnit.name)
                : "").concat(ledgerRecord.trackedEntityId
                ? " of ".concat(Math.abs(ledgerRecord.quantity) > 1 ? "batch" : "serial", " ").concat(ledgerRecord.trackedEntityId)
                : "");
        case "Sales Invoice":
            return "invoiced ".concat(ledgerRecord.quantity, " units for sale").concat(((_d = ledgerRecord.storageUnit) === null || _d === void 0 ? void 0 : _d.name)
                ? " from ".concat(ledgerRecord.storageUnit.name)
                : "");
        case "Transfer Shipment":
            return "shipped ".concat(-1 * ledgerRecord.quantity, " units").concat(((_e = ledgerRecord.storageUnit) === null || _e === void 0 ? void 0 : _e.name)
                ? " from ".concat(ledgerRecord.storageUnit.name)
                : "", " for transfer");
        case "Transfer Receipt":
            return "received ".concat(ledgerRecord.quantity, " units").concat(((_f = ledgerRecord.storageUnit) === null || _f === void 0 ? void 0 : _f.name)
                ? " to ".concat(ledgerRecord.storageUnit.name)
                : "", " from transfer");
        case "Direct Transfer":
            return "transferred ".concat(Math.abs(ledgerRecord.quantity), " units").concat(((_g = ledgerRecord.storageUnit) === null || _g === void 0 ? void 0 : _g.name)
                ? " ".concat(ledgerRecord.quantity > 0 ? "to" : "from", " ").concat(ledgerRecord.storageUnit.name)
                : "");
        case "Inventory Receipt":
            return "received ".concat(ledgerRecord.quantity, " units into inventory").concat(((_h = ledgerRecord.storageUnit) === null || _h === void 0 ? void 0 : _h.name)
                ? " on ".concat(ledgerRecord.storageUnit.name)
                : "");
        case "Inventory Shipment":
            return "shipped ".concat(-1 * ledgerRecord.quantity, " units from inventory").concat(((_j = ledgerRecord.storageUnit) === null || _j === void 0 ? void 0 : _j.name)
                ? " from ".concat(ledgerRecord.storageUnit.name)
                : "");
        case "Posted Assembly":
            return "assembled ".concat(ledgerRecord.quantity, " units").concat(((_k = ledgerRecord.storageUnit) === null || _k === void 0 ? void 0 : _k.name)
                ? " on ".concat(ledgerRecord.storageUnit.name)
                : "");
        case "Purchase Credit Memo":
            return "credited ".concat(ledgerRecord.quantity, " units for purchase").concat(((_l = ledgerRecord.storageUnit) === null || _l === void 0 ? void 0 : _l.name)
                ? " on ".concat(ledgerRecord.storageUnit.name)
                : "");
        case "Purchase Return Shipment":
            return "returned ".concat(ledgerRecord.quantity, " units to supplier").concat(((_m = ledgerRecord.storageUnit) === null || _m === void 0 ? void 0 : _m.name)
                ? " from ".concat(ledgerRecord.storageUnit.name)
                : "");
        case "Sales Credit Memo":
            return "credited ".concat(ledgerRecord.quantity, " units for sale").concat(((_o = ledgerRecord.storageUnit) === null || _o === void 0 ? void 0 : _o.name)
                ? " on ".concat(ledgerRecord.storageUnit.name)
                : "");
        case "Sales Return Receipt":
            return "received ".concat(ledgerRecord.quantity, " units as sales return").concat(((_p = ledgerRecord.storageUnit) === null || _p === void 0 ? void 0 : _p.name)
                ? " to ".concat(ledgerRecord.storageUnit.name)
                : "");
        case "Service Credit Memo":
            return "credited ".concat(ledgerRecord.quantity, " units for service").concat(((_q = ledgerRecord.storageUnit) === null || _q === void 0 ? void 0 : _q.name)
                ? " on ".concat(ledgerRecord.storageUnit.name)
                : "");
        case "Service Invoice":
            return "invoiced ".concat(ledgerRecord.quantity, " units for service").concat(((_r = ledgerRecord.storageUnit) === null || _r === void 0 ? void 0 : _r.name)
                ? " from ".concat(ledgerRecord.storageUnit.name)
                : "");
        case "Service Shipment":
            return "shipped ".concat(-1 * ledgerRecord.quantity, " units for service").concat(((_s = ledgerRecord.storageUnit) === null || _s === void 0 ? void 0 : _s.name)
                ? " from ".concat(ledgerRecord.storageUnit.name)
                : "");
        case "Job Consumption":
            return (<span>
          issued {-1 * ledgerRecord.quantity} units{" "}
          {((_t = ledgerRecord.storageUnit) === null || _t === void 0 ? void 0 : _t.name)
                    ? "from ".concat(ledgerRecord.storageUnit.name, " ")
                    : ""}
          {ledgerRecord.trackedEntityId ? (<>
              from {Math.abs(ledgerRecord.quantity) > 1 ? "batch" : "serial"}{" "}
              {ledgerRecord.trackedEntityId}{" "}
            </>) : null}
          {ledgerRecord.documentLineId && ledgerRecord.documentId ? (<>
              to a{" "}
              <components_1.Hyperlink className="inline-flex" to={"".concat(path_1.path.to.jobProductionEvents(ledgerRecord.documentId), "?filter=jobOperationId:eq:").concat(ledgerRecord.documentLineId)}>
                job operation
              </components_1.Hyperlink>
            </>) : ledgerRecord.documentId ? (<>
              to a{" "}
              <components_1.Hyperlink className="inline-flex" to={path_1.path.to.jobDetails(ledgerRecord.documentId)}>
                job
              </components_1.Hyperlink>
            </>) : null}
        </span>);
        case "Maintenance Consumption":
            return (<span>
          issued {-1 * ledgerRecord.quantity} units{" "}
          {((_u = ledgerRecord.storageUnit) === null || _u === void 0 ? void 0 : _u.name)
                    ? "from ".concat(ledgerRecord.storageUnit.name, " ")
                    : ""}
          {ledgerRecord.trackedEntityId ? (<>
              from {Math.abs(ledgerRecord.quantity) > 1 ? "batch" : "serial"}{" "}
              {ledgerRecord.trackedEntityId}{" "}
            </>) : null}
          {ledgerRecord.documentId ? (<>
              to a{" "}
              <components_1.Hyperlink className="inline-flex" to={path_1.path.to.maintenanceDispatch(ledgerRecord.documentId)}>
                maintenance dispatch
              </components_1.Hyperlink>
            </>) : null}
        </span>);
        case "Job Receipt":
            return (<>
          <span>
            received {ledgerRecord.quantity} units
            {((_v = ledgerRecord.storageUnit) === null || _v === void 0 ? void 0 : _v.name)
                    ? " to ".concat(ledgerRecord.storageUnit.name)
                    : ""}{" "}
            from a
          </span>{" "}
          <components_1.Hyperlink className="inline-flex" to={path_1.path.to.jobDetails(ledgerRecord.documentId)}>
            job
          </components_1.Hyperlink>
        </>);
        default:
            break;
    }
    switch (ledgerRecord.entryType) {
        case "Positive Adjmt.":
            return "made a positive adjustment of ".concat(ledgerRecord.quantity).concat(((_w = ledgerRecord.storageUnit) === null || _w === void 0 ? void 0 : _w.name)
                ? " to ".concat((_x = ledgerRecord.storageUnit) === null || _x === void 0 ? void 0 : _x.name)
                : "").concat(ledgerRecord.trackedEntityId
                ? " for ".concat(Math.abs(ledgerRecord.quantity) > 1 ? "batch" : "serial", " ").concat(ledgerRecord.trackedEntityId)
                : "");
        case "Negative Adjmt.":
            return "made a negative adjustment of ".concat(-1 * ledgerRecord.quantity).concat(((_y = ledgerRecord.storageUnit) === null || _y === void 0 ? void 0 : _y.name)
                ? " to ".concat(ledgerRecord.storageUnit.name)
                : "").concat(ledgerRecord.trackedEntityId
                ? " for ".concat(Math.abs(ledgerRecord.quantity) > 1 ? "batch" : "serial", " ").concat(ledgerRecord.trackedEntityId)
                : "");
        default:
            return "";
    }
};
var getActivityIcon = function (ledgerRecord) {
    switch (ledgerRecord.entryType) {
        case "Transfer":
            return <lu_1.LuArrowRightLeft className="text-blue-500 w-5 h-5"/>;
        case "Positive Adjmt.":
            return <lu_1.LuCirclePlus className="text-emerald-500 w-5 h-5"/>;
        case "Negative Adjmt.":
        case "Consumption":
            return <lu_1.LuCircleMinus className="text-red-500 w-5 h-5"/>;
        default:
            return "";
    }
};
var InventoryActivity = function (_a) {
    var item = _a.item;
    return (<Activity_1.default employeeId={item.createdBy} activityMessage={getActivityText(item)} activityTime={item.createdAt} activityIcon={getActivityIcon(item)} comment={item.comment}/>);
};
exports.default = InventoryActivity;
