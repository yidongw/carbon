"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ApiKeysUpgradeOverlay;
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var UpgradeOverlay_1 = require("~/components/UpgradeOverlay");
var ApiKeysTable_1 = require("./ApiKeysTable");
var mockApiKeys = [
    {
        id: "mock-1",
        name: "Production",
        keyHash: "",
        keyPreview: "a1b2",
        scopes: {
            sales: ["read", "write"],
            purchasing: ["read"],
            inventory: ["read", "write"],
            production: ["read"]
        },
        rateLimit: 60,
        rateLimitWindow: "1m",
        expiresAt: null,
        lastUsedAt: new Date().toISOString(),
        createdAt: "2026-01-15T10:00:00Z",
        createdBy: "mock-user-1",
        companyId: "mock"
    },
    {
        id: "mock-2",
        name: "Staging",
        keyHash: "",
        keyPreview: "9c4e",
        scopes: {
            sales: ["read"],
            inventory: ["read"]
        },
        rateLimit: 60,
        rateLimitWindow: "1m",
        expiresAt: "2026-12-31T23:59:59Z",
        lastUsedAt: "2026-04-30T15:22:00Z",
        createdAt: "2026-02-01T09:30:00Z",
        createdBy: "mock-user-1",
        companyId: "mock"
    },
    {
        id: "mock-3",
        name: "CI Pipeline",
        keyHash: "",
        keyPreview: "f0a1",
        scopes: {
            production: ["read"]
        },
        rateLimit: 30,
        rateLimitWindow: "1m",
        expiresAt: null,
        lastUsedAt: "2026-05-05T08:10:00Z",
        createdAt: "2026-02-10T11:45:00Z",
        createdBy: "mock-user-2",
        companyId: "mock"
    },
    {
        id: "mock-4",
        name: "Reporting",
        keyHash: "",
        keyPreview: "7d2b",
        scopes: {
            sales: ["read"],
            purchasing: ["read"]
        },
        rateLimit: 10,
        rateLimitWindow: "1m",
        expiresAt: "2026-06-15T00:00:00Z",
        lastUsedAt: null,
        createdAt: "2026-03-20T14:00:00Z",
        createdBy: "mock-user-2",
        companyId: "mock"
    }
];
function ApiKeysUpgradeOverlay() {
    return (<UpgradeOverlay_1.UpgradeOverlay>
      <UpgradeOverlay_1.UpgradeOverlayPreview>
        <ApiKeysTable_1.default data={mockApiKeys} count={mockApiKeys.length}/>
      </UpgradeOverlay_1.UpgradeOverlayPreview>
      <UpgradeOverlay_1.UpgradeOverlayCard>
        <UpgradeOverlay_1.UpgradeOverlayIcon>
          <lu_1.LuKeyRound className="size-6 text-muted-foreground"/>
        </UpgradeOverlay_1.UpgradeOverlayIcon>
        <UpgradeOverlay_1.UpgradeOverlayContent>
          <UpgradeOverlay_1.UpgradeOverlayTitle>
            <macro_1.Trans>API Keys</macro_1.Trans>
          </UpgradeOverlay_1.UpgradeOverlayTitle>
          <UpgradeOverlay_1.UpgradeOverlayDescription>
            <macro_1.Trans>API keys for programmatic access to your Carbon data.</macro_1.Trans>
          </UpgradeOverlay_1.UpgradeOverlayDescription>
        </UpgradeOverlay_1.UpgradeOverlayContent>
        <UpgradeOverlay_1.UpgradeOverlayActions>
          <UpgradeOverlay_1.UpgradeOverlayUpgradeButton />
        </UpgradeOverlay_1.UpgradeOverlayActions>
      </UpgradeOverlay_1.UpgradeOverlayCard>
    </UpgradeOverlay_1.UpgradeOverlay>);
}
