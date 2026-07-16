"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CustomerPortalsUpgradeOverlay;
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var UpgradeOverlay_1 = require("~/components/UpgradeOverlay");
var CustomerPortalsTable_1 = require("./CustomerPortalsTable");
var mockPortals = [
    {
        id: "mock-1",
        documentType: "Customer",
        documentId: "mock-customer-1",
        customerId: "mock-customer-1",
        supplierId: null,
        expiresAt: null,
        companyId: "mock",
        createdAt: "2026-01-15T10:00:00Z"
    },
    {
        id: "mock-2",
        documentType: "Customer",
        documentId: "mock-customer-2",
        customerId: "mock-customer-2",
        supplierId: null,
        expiresAt: null,
        companyId: "mock",
        createdAt: "2026-02-01T09:30:00Z"
    },
    {
        id: "mock-3",
        documentType: "Customer",
        documentId: "mock-customer-3",
        customerId: "mock-customer-3",
        supplierId: null,
        expiresAt: null,
        companyId: "mock",
        createdAt: "2026-03-20T14:00:00Z"
    }
];
function CustomerPortalsUpgradeOverlay() {
    return (<UpgradeOverlay_1.UpgradeOverlay>
      <UpgradeOverlay_1.UpgradeOverlayPreview>
        <CustomerPortalsTable_1.default appUrl="https://app.carbon.ms" data={mockPortals} count={mockPortals.length}/>
      </UpgradeOverlay_1.UpgradeOverlayPreview>
      <UpgradeOverlay_1.UpgradeOverlayCard>
        <UpgradeOverlay_1.UpgradeOverlayIcon>
          <lu_1.LuGlobe className="size-6 text-muted-foreground"/>
        </UpgradeOverlay_1.UpgradeOverlayIcon>
        <UpgradeOverlay_1.UpgradeOverlayContent>
          <UpgradeOverlay_1.UpgradeOverlayTitle>
            <macro_1.Trans>Customer Portals</macro_1.Trans>
          </UpgradeOverlay_1.UpgradeOverlayTitle>
          <UpgradeOverlay_1.UpgradeOverlayDescription>
            <macro_1.Trans>
              Share a branded portal link so customers can track their orders
              and documents.
            </macro_1.Trans>
          </UpgradeOverlay_1.UpgradeOverlayDescription>
        </UpgradeOverlay_1.UpgradeOverlayContent>
        <UpgradeOverlay_1.UpgradeOverlayActions>
          <UpgradeOverlay_1.UpgradeOverlayUpgradeButton />
        </UpgradeOverlay_1.UpgradeOverlayActions>
      </UpgradeOverlay_1.UpgradeOverlayCard>
    </UpgradeOverlay_1.UpgradeOverlay>);
}
