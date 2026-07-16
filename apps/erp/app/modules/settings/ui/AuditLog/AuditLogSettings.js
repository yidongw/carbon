"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var audit_config_1 = require("@carbon/database/audit.config");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
function formatBytes(bytes) {
    if (bytes === 0)
        return "0 B";
    var k = 1024;
    var sizes = ["B", "KB", "MB", "GB"];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return "".concat(parseFloat((bytes / Math.pow(k, i)).toFixed(1)), " ").concat(sizes[i]);
}
var AuditLogSettings = (0, react_2.memo)(function (_a) {
    var enabled = _a.enabled, archives = _a.archives;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var fetcher = (0, react_router_1.useFetcher)();
    var isToggling = fetcher.state !== "idle";
    var handleToggle = (0, react_2.useCallback)(function (checked) {
        fetcher.submit({ action: checked ? "enable" : "disable" }, { method: "POST" });
    }, [fetcher]);
    var handleDownloadArchive = (0, react_2.useCallback)(function (archiveId) {
        fetcher.submit({ action: "download", archiveId: archiveId }, { method: "POST" });
    }, [fetcher]);
    return (<>
        <react_1.Card>
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Audit Logging</macro_1.Trans>
            </react_1.CardTitle>
            <react_1.CardDescription>
              <macro_1.Trans>
                Track changes to key business entities including invoices,
                orders, customers, suppliers, and more.
              </macro_1.Trans>
            </react_1.CardDescription>
          </react_1.CardHeader>
          <react_1.CardContent>
            <react_1.HStack className="justify-between items-center">
              <react_1.VStack className="items-start" spacing={1}>
                <span className="font-medium">
                  {enabled ? (<macro_1.Trans>Audit logging is enabled</macro_1.Trans>) : (<macro_1.Trans>Audit logging is disabled</macro_1.Trans>)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {enabled ? (<macro_1.Trans>
                      All changes to auditable entities are being recorded.
                    </macro_1.Trans>) : (<macro_1.Trans>
                      Enable to start tracking changes to your data.
                    </macro_1.Trans>)}
                </span>
              </react_1.VStack>
              <react_1.Switch checked={enabled} onCheckedChange={handleToggle} disabled={isToggling}/>
            </react_1.HStack>
          </react_1.CardContent>
        </react_1.Card>

        {enabled && (<react_1.Card>
            <react_1.CardHeader>
              <react_1.CardTitle>
                <macro_1.Trans>Archived Logs</macro_1.Trans>
              </react_1.CardTitle>
              <react_1.CardDescription>
                <macro_1.Trans>
                  Logs older than {audit_config_1.auditConfig.retentionDays} days are
                  automatically archived.
                </macro_1.Trans>
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardContent>
              {archives.length > 0 ? (<react_1.VStack className="gap-2">
                  {archives.map(function (archive) { return (<react_1.HStack key={archive.id} className="justify-between items-center p-6 border rounded-md w-full">
                      <react_1.VStack className="items-start">
                        <span className="font-medium text-sm">
                          {formatDate(archive.startDate)} -{" "}
                          {formatDate(archive.endDate)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {archive.rowCount.toLocaleString()} records
                          {archive.sizeBytes &&
                        " (".concat(formatBytes(archive.sizeBytes), ")")}
                        </span>
                      </react_1.VStack>
                      <react_1.Button variant="secondary" size="sm" leftIcon={<lu_1.LuDownload />} onClick={function () { return handleDownloadArchive(archive.id); }}>
                        <macro_1.Trans>Download</macro_1.Trans>
                      </react_1.Button>
                    </react_1.HStack>); })}
                </react_1.VStack>) : (<p className="text-sm text-muted-foreground text-center text-balance py-8">
                  <macro_1.Trans>
                    No archived logs yet. Logs older than{" "}
                    {audit_config_1.auditConfig.retentionDays} days will be automatically
                    archived and available for download here.
                  </macro_1.Trans>
                </p>)}
            </react_1.CardContent>
          </react_1.Card>)}
      </>);
});
AuditLogSettings.displayName = "AuditLogSettings";
exports.default = AuditLogSettings;
