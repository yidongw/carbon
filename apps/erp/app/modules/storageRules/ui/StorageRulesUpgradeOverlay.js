"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StorageRulesUpgradeOverlay;
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var UpgradeOverlay_1 = require("~/components/UpgradeOverlay");
var StorageRulesTable_1 = require("./StorageRulesTable");
var mockRules = [
    {
        id: "mock-1",
        name: "Require lot number on receipt",
        targetType: "item",
        severity: "error",
        active: true,
        appliesToAll: false,
        description: "Block receiving when lot number is missing.",
        message: "Lot number is required for this item on receipt.",
        updatedAt: "2026-05-04T10:00:00Z",
        customFields: {},
        assignmentCount: 24,
        surfaces: ["receipt"]
    },
    {
        id: "mock-2",
        name: "Warn on negative adjustment",
        targetType: "item",
        severity: "warn",
        active: true,
        appliesToAll: true,
        description: "Flag inventory adjustments that take quantity below zero.",
        message: "Adjustment will result in negative on-hand quantity.",
        updatedAt: "2026-04-29T14:22:00Z",
        customFields: {},
        assignmentCount: 12,
        surfaces: ["inventoryAdjustment"]
    },
    {
        id: "mock-3",
        name: "Shipment requires serial",
        targetType: "item",
        severity: "error",
        active: true,
        appliesToAll: false,
        description: "Block shipment when serial number is not captured.",
        message: "Serial number is required on shipment.",
        updatedAt: "2026-04-21T09:15:00Z",
        customFields: {},
        assignmentCount: 8,
        surfaces: ["shipment"]
    },
    {
        id: "mock-4",
        name: "Stock transfer between plants",
        targetType: "item",
        severity: "warn",
        active: false,
        appliesToAll: false,
        description: "Warn when transferring between non-default plants.",
        message: "Cross-plant transfer requires manager approval.",
        updatedAt: "2026-03-12T11:45:00Z",
        customFields: {},
        assignmentCount: 3,
        surfaces: ["stockTransfer"]
    }
];
function StorageRulesUpgradeOverlay() {
    return (<UpgradeOverlay_1.UpgradeOverlay>
      <UpgradeOverlay_1.UpgradeOverlayPreview>
        <StorageRulesTable_1.default data={mockRules} count={mockRules.length}/>
      </UpgradeOverlay_1.UpgradeOverlayPreview>
      <UpgradeOverlay_1.UpgradeOverlayCard>
        <UpgradeOverlay_1.UpgradeOverlayIcon>
          <lu_1.LuShieldCheck className="size-6 text-muted-foreground"/>
        </UpgradeOverlay_1.UpgradeOverlayIcon>
        <UpgradeOverlay_1.UpgradeOverlayContent>
          <UpgradeOverlay_1.UpgradeOverlayTitle>
            <macro_1.Trans>Storage Rules</macro_1.Trans>
          </UpgradeOverlay_1.UpgradeOverlayTitle>
          <UpgradeOverlay_1.UpgradeOverlayDescription>
            <macro_1.Trans>
              Enforce per-item validation and guidelines across receipts,
              shipments, transfers, and adjustments.
            </macro_1.Trans>
          </UpgradeOverlay_1.UpgradeOverlayDescription>
        </UpgradeOverlay_1.UpgradeOverlayContent>
        <UpgradeOverlay_1.UpgradeOverlayActions>
          <UpgradeOverlay_1.UpgradeOverlayUpgradeButton />
        </UpgradeOverlay_1.UpgradeOverlayActions>
      </UpgradeOverlay_1.UpgradeOverlayCard>
    </UpgradeOverlay_1.UpgradeOverlay>);
}
