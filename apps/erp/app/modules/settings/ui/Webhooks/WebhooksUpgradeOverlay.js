"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WebhooksUpgradeOverlay;
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var UpgradeOverlay_1 = require("~/components/UpgradeOverlay");
var WebhooksTable_1 = require("./WebhooksTable");
var mockWebhooks = [
    {
        id: "mock-1",
        name: "Order created",
        url: "https://api.example.com/orders",
        table: "salesOrder",
        active: true,
        onInsert: true,
        onUpdate: false,
        onDelete: false,
        successCount: 1247,
        errorCount: 12,
        lastSuccess: "2026-05-05T14:22:00Z",
        lastError: null,
        createdAt: "2026-01-15T10:00:00Z",
        createdBy: "mock-user-1",
        updatedAt: null,
        updatedBy: null,
        companyId: "mock"
    },
    {
        id: "mock-2",
        name: "Customer updated",
        url: "https://hooks.example.com/customer",
        table: "customer",
        active: true,
        onInsert: true,
        onUpdate: true,
        onDelete: false,
        successCount: 856,
        errorCount: 32,
        lastSuccess: "2026-05-05T13:10:00Z",
        lastError: "2026-05-04T09:15:00Z",
        createdAt: "2026-02-01T09:30:00Z",
        createdBy: "mock-user-1",
        updatedAt: null,
        updatedBy: null,
        companyId: "mock"
    },
    {
        id: "mock-3",
        name: "Invoice paid",
        url: "https://api.example.com/invoices/paid",
        table: "salesInvoice",
        active: true,
        onInsert: false,
        onUpdate: true,
        onDelete: false,
        successCount: 412,
        errorCount: 0,
        lastSuccess: "2026-05-05T11:45:00Z",
        lastError: null,
        createdAt: "2026-02-10T11:45:00Z",
        createdBy: "mock-user-2",
        updatedAt: null,
        updatedBy: null,
        companyId: "mock"
    },
    {
        id: "mock-4",
        name: "Item deleted",
        url: "https://hooks.example.com/items",
        table: "item",
        active: false,
        onInsert: false,
        onUpdate: false,
        onDelete: true,
        successCount: 23,
        errorCount: 28,
        lastSuccess: "2026-04-20T16:00:00Z",
        lastError: "2026-04-25T08:30:00Z",
        createdAt: "2026-03-20T14:00:00Z",
        createdBy: "mock-user-2",
        updatedAt: null,
        updatedBy: null,
        companyId: "mock"
    }
];
function WebhooksUpgradeOverlay() {
    return (<UpgradeOverlay_1.UpgradeOverlay>
      <UpgradeOverlay_1.UpgradeOverlayPreview>
        <WebhooksTable_1.default data={mockWebhooks} count={mockWebhooks.length}/>
      </UpgradeOverlay_1.UpgradeOverlayPreview>
      <UpgradeOverlay_1.UpgradeOverlayCard>
        <UpgradeOverlay_1.UpgradeOverlayIcon>
          <lu_1.LuWebhook className="size-6 text-muted-foreground"/>
        </UpgradeOverlay_1.UpgradeOverlayIcon>
        <UpgradeOverlay_1.UpgradeOverlayContent>
          <UpgradeOverlay_1.UpgradeOverlayTitle>
            <macro_1.Trans>Webhooks</macro_1.Trans>
          </UpgradeOverlay_1.UpgradeOverlayTitle>
          <UpgradeOverlay_1.UpgradeOverlayDescription>
            <macro_1.Trans>
              Push record changes to external systems the moment they happen.
            </macro_1.Trans>
          </UpgradeOverlay_1.UpgradeOverlayDescription>
        </UpgradeOverlay_1.UpgradeOverlayContent>
        <UpgradeOverlay_1.UpgradeOverlayActions>
          <UpgradeOverlay_1.UpgradeOverlayUpgradeButton />
        </UpgradeOverlay_1.UpgradeOverlayActions>
      </UpgradeOverlay_1.UpgradeOverlayCard>
    </UpgradeOverlay_1.UpgradeOverlay>);
}
