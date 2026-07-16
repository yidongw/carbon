"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuditLogUpgradeOverlay;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var UpgradeOverlay_1 = require("~/components/UpgradeOverlay");
function AuditLogUpgradeOverlay() {
    return (<UpgradeOverlay_1.UpgradeOverlay>
      <UpgradeOverlay_1.UpgradeOverlayPreview>
        <react_1.VStack spacing={4} className="py-12 px-4 max-w-[60rem] mx-auto gap-4">
          <react_1.Card>
            <react_1.CardHeader>
              <react_1.CardTitle>Audit Logging</react_1.CardTitle>
              <react_1.CardDescription>
                Track changes to key business entities including invoices,
                orders, customers, suppliers, and more.
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardContent>
              <react_1.HStack className="justify-between items-center">
                <react_1.VStack className="items-start" spacing={1}>
                  <span className="font-medium">Audit logging is disabled</span>
                  <span className="text-sm text-muted-foreground">
                    Enable to start tracking changes to your data.
                  </span>
                </react_1.VStack>
                <react_1.Switch checked={false} disabled/>
              </react_1.HStack>
            </react_1.CardContent>
          </react_1.Card>

          <react_1.Card>
            <react_1.CardHeader>
              <react_1.CardTitle>Archived Logs</react_1.CardTitle>
              <react_1.CardDescription>
                Logs older than 30 days are automatically archived.
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardContent>
              <react_1.VStack className="gap-2">
                {[1, 2].map(function (i) { return (<react_1.HStack key={i} className="justify-between items-center p-6 border rounded-md w-full">
                    <react_1.VStack className="items-start">
                      <span className="font-medium text-sm">
                        Jan 1, 2026 - Jan 31, 2026
                      </span>
                      <span className="text-xs text-muted-foreground">
                        1,234 records (2.1 MB)
                      </span>
                    </react_1.VStack>
                    <div className="h-8 w-24 rounded bg-muted"/>
                  </react_1.HStack>); })}
              </react_1.VStack>
            </react_1.CardContent>
          </react_1.Card>
        </react_1.VStack>
      </UpgradeOverlay_1.UpgradeOverlayPreview>
      <UpgradeOverlay_1.UpgradeOverlayCard>
        <UpgradeOverlay_1.UpgradeOverlayIcon>
          <lu_1.LuHistory className="size-6 text-muted-foreground"/>
        </UpgradeOverlay_1.UpgradeOverlayIcon>
        <UpgradeOverlay_1.UpgradeOverlayContent>
          <UpgradeOverlay_1.UpgradeOverlayTitle>
            <macro_1.Trans>Audit Logs</macro_1.Trans>
          </UpgradeOverlay_1.UpgradeOverlayTitle>
          <UpgradeOverlay_1.UpgradeOverlayDescription>
            <macro_1.Trans>
              Track every change to your orders, invoices, customers, suppliers,
              and more.
            </macro_1.Trans>
          </UpgradeOverlay_1.UpgradeOverlayDescription>
        </UpgradeOverlay_1.UpgradeOverlayContent>
        <UpgradeOverlay_1.UpgradeOverlayActions>
          <UpgradeOverlay_1.UpgradeOverlayUpgradeButton />
        </UpgradeOverlay_1.UpgradeOverlayActions>
      </UpgradeOverlay_1.UpgradeOverlayCard>
    </UpgradeOverlay_1.UpgradeOverlay>);
}
