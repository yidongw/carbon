"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuditLog = useAuditLog;
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var usePlanGate_1 = require("~/hooks/usePlanGate");
var AuditLogDrawer_1 = require("./AuditLogDrawer");
/**
 * Hook that returns audit log trigger and drawer elements.
 *
 * Place `trigger` inside the dropdown menu (or card header).
 * Place `drawer` at the component root level (outside any dropdown).
 *
 * This separation is necessary because Radix DropdownMenuContent unmounts
 * its children when the menu closes — the drawer must live outside it.
 */
function useAuditLog(_a) {
    var entityType = _a.entityType, entityId = _a.entityId, companyId = _a.companyId, variant = _a.variant, _b = _a.triggerLabel, triggerLabel = _b === void 0 ? "History" : _b, drawerTitle = _a.drawerTitle;
    var disclosure = (0, react_1.useDisclosure)();
    var isGated = (0, usePlanGate_1.usePlanGate)({ feature: "AUDIT_LOG" }).isGated;
    var trigger = variant === "dropdown" ? (<react_1.DropdownMenuItem onClick={disclosure.onOpen}>
        <react_1.DropdownMenuIcon icon={<lu_1.LuHistory />}/>
        {triggerLabel}
      </react_1.DropdownMenuItem>) : (<react_1.CardAction>
        <react_1.Button variant="secondary" leftIcon={<lu_1.LuHistory />} onClick={disclosure.onOpen}>
          {triggerLabel}
        </react_1.Button>
      </react_1.CardAction>);
    var drawer = (<AuditLogDrawer_1.default isOpen={disclosure.isOpen} onClose={disclosure.onClose} entityType={entityType} entityId={entityId} companyId={companyId} title={drawerTitle} planRestricted={isGated}/>);
    return { trigger: trigger, drawer: drawer };
}
