"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var WebhookForm_1 = require("./WebhookForm");
var WebhooksTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var navigate = (0, react_router_1.useNavigate)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var permissions = (0, hooks_1.usePermissions)();
    var people = (0, stores_1.usePeople)()[0];
    var webhookTables = (0, WebhookForm_1.useWebhookTables)();
    var columns = (0, react_2.useMemo)(function () {
        return [
            {
                accessorKey: "name",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<div className="flex flex-col gap-1 justify-start items-start pb-1">
            <components_1.Hyperlink to={row.original.id}>{row.original.name}</components_1.Hyperlink>
            <react_1.HStack>
              {row.original.active ? (<react_1.Badge variant="green">Active</react_1.Badge>) : (<react_1.Badge variant="red">Inactive</react_1.Badge>)}
              <span className="text-xs text-muted-foreground font-mono">
                {row.original.url}
              </span>
            </react_1.HStack>
          </div>);
                },
                meta: {
                    icon: <lu_1.LuTag />
                }
            },
            {
                accessorKey: "table",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Table"], ["Table"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<div className="flex flex-col gap-1 justify-start items-start pb-1">
            <components_1.Hyperlink className="flex flex-row gap-1 items-center" to={path_1.path.to.apiTable("js", row.original.table)}>
              <lu_1.LuTable2 className="size-4"/>
              <span className="text-sm font-medium">
                {"public.".concat(row.original.table)}
              </span>
            </components_1.Hyperlink>
            <react_1.HStack>
              {row.original.onInsert && <react_1.Badge variant="green">Insert</react_1.Badge>}
              {row.original.onUpdate && <react_1.Badge variant="blue">Update</react_1.Badge>}
              {row.original.onDelete && <react_1.Badge variant="red">Delete</react_1.Badge>}
            </react_1.HStack>
          </div>);
                },
                meta: {
                    icon: <lu_1.LuDatabase />,
                    filter: {
                        type: "static",
                        options: webhookTables
                    }
                }
            },
            {
                accessorKey: "successCount",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Success"], ["Success"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<SuccessErrorBar successCount={row.original.successCount} errorCount={row.original.errorCount}/>);
                },
                meta: {
                    icon: <lu_1.LuPercent />
                }
            },
            {
                id: "createdBy",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Created By"], ["Created By"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<components_1.EmployeeAvatar employeeId={row.original.createdBy}/>);
                },
                meta: {
                    icon: <lu_1.LuUser />,
                    filter: {
                        type: "static",
                        options: people.map(function (employee) { return ({
                            value: employee.id,
                            label: employee.name
                        }); })
                    }
                }
            },
            {
                accessorKey: "createdAt",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Created At"], ["Created At"]))),
                cell: function (item) { return formatDate(item.getValue()); },
                meta: {
                    icon: <lu_1.LuCalendar />
                }
            }
        ];
    }, [people, webhookTables, t, formatDate]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var renderContextMenu = (0, react_2.useCallback)(function (row) {
        return (<>
          <react_1.MenuItem onClick={function () {
                navigate("".concat(path_1.path.to.webhook(row.id), "?").concat(params === null || params === void 0 ? void 0 : params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuPencil />}/>
            <macro_1.Trans>Edit Webhook</macro_1.Trans>
          </react_1.MenuItem>
          <react_1.MenuItem destructive onClick={function () {
                navigate("".concat(path_1.path.to.deleteWebhook(row.id), "?").concat(params === null || params === void 0 ? void 0 : params.toString()));
            }}>
            <react_1.MenuIcon icon={<lu_1.LuTrash />}/>
            <macro_1.Trans>Delete Webhook</macro_1.Trans>
          </react_1.MenuItem>
        </>);
    }, [navigate, params, permissions]);
    var docsDisclosure = (0, react_1.useDisclosure)();
    return (<>
      <components_1.Table data={data} columns={columns} count={count !== null && count !== void 0 ? count : 0} defaultColumnVisibility={{
            createdAt: false,
            createdBy: false
        }} primaryAction={<react_1.HStack>
            {permissions.can("update", "users") && (<components_1.New label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Webhook"], ["Webhook"])))} to={"".concat(path_1.path.to.newWebhook, "?").concat(params.toString())}/>)}
            <react_1.Button leftIcon={<lu_1.LuCode />} variant="secondary" onClick={docsDisclosure.onOpen}>
              <macro_1.Trans>Webhooks Docs</macro_1.Trans>
            </react_1.Button>
          </react_1.HStack>} renderContextMenu={renderContextMenu} title={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Webhooks"], ["Webhooks"])))}/>
      <react_router_1.Outlet />
      <WebhookDocs open={docsDisclosure.isOpen} onClose={docsDisclosure.onClose}/>
    </>);
});
WebhooksTable.displayName = "WebhooksTable";
exports.default = WebhooksTable;
var code = {
    insertPayload: function (table, companyId) { return "\nconst url = \"<your-webhook-url>\";  \n\nconst payload = {\n  type: \"INSERT\",\n  table: \"".concat(table, "\",\n  record: {\n    // the new row\n  },\n  companyId: \"").concat(companyId, "\",\n};\n\nfetch(url, {\n  method: \"POST\",\n  headers: {\n    \"Content-Type\": \"application/json\",\n  },\n  body: JSON.stringify(payload),\n});\n"); },
    updatePayload: function (table, companyId) { return "\nconst url = \"<your-webhook-url>\";  \n\nconst payload = {\n  type: \"UPDATE\",\n  table: \"".concat(table, "\",\n  record: {\n    // the new row\n  },\n  old: {\n    // the old row\n  },\n  companyId: \"").concat(companyId, "\",\n};\n\nfetch(url, {\n  method: \"POST\",\n  headers: {\n    \"Content-Type\": \"application/json\",\n  },\n  body: JSON.stringify(payload),\n});\n"); },
    deletePayload: function (table, companyId) { return "\nconst url = \"<your-webhook-url>\";  \n\nconst payload = {\n  type: \"DELETE\",\n  table: \"".concat(table, "\",\n  record: {\n    // the deleted row\n  },\n  companyId: \"").concat(companyId, "\",\n};\n\nfetch(url, {\n  method: \"POST\",\n  headers: {\n    \"Content-Type\": \"application/json\",\n  },\n  body: JSON.stringify(payload),\n});\n  "); }
};
function WebhookDocs(_a) {
    var _b, _c, _d;
    var open = _a.open, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var webhookTables = (0, WebhookForm_1.useWebhookTables)();
    var _e = (0, react_2.useState)("quote"), activeTable = _e[0], setActiveTable = _e[1];
    var company = (0, hooks_1.useUser)().company;
    return (<react_1.Drawer open={open} onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.DrawerContent size="md">
        <react_1.DrawerHeader>
          <react_1.DrawerTitle>
            <macro_1.Trans>Webhook Documentation</macro_1.Trans>
          </react_1.DrawerTitle>
        </react_1.DrawerHeader>
        <react_1.DrawerBody>
          <react_1.Tabs defaultValue="INSERT" className="w-full">
            <react_1.HStack className="w-full justify-between">
              <div>
                <react_1.TabsList className="grid grid-cols-3">
                  <react_1.TabsTrigger value="INSERT">INSERT</react_1.TabsTrigger>
                  <react_1.TabsTrigger value="UPDATE">UPDATE</react_1.TabsTrigger>
                  <react_1.TabsTrigger value="DELETE">DELETE</react_1.TabsTrigger>
                </react_1.TabsList>
              </div>
              <div>
                <react_1.Select value={activeTable} onValueChange={function (val) { return setActiveTable(val); }}>
                  <react_1.SelectTrigger id="table" className="min-w-[200px]">
                    <react_1.SelectValue placeholder={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Select a table"], ["Select a table"])))}/>
                  </react_1.SelectTrigger>
                  <react_1.SelectContent>
                    {webhookTables.map(function (option) { return (<react_1.SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </react_1.SelectItem>); })}
                  </react_1.SelectContent>
                </react_1.Select>
              </div>
            </react_1.HStack>
            <react_1.TabsContent value="INSERT">
              <div className="flex flex-col gap-4 py-4">
                <p>
                  When an <react_1.Badge variant="green">INSERT</react_1.Badge> event occurs,
                  the following webhook will be triggered. The <react_1.Kbd>record</react_1.Kbd>{" "}
                  object will contain the inserted row.
                </p>
                <react_1.Separator />
                <react_1.CodeBlock className="js">
                  {code.insertPayload(activeTable, company.id)}
                </react_1.CodeBlock>
                <react_1.Separator />
                <div>
                  <react_1.Button leftIcon={<lu_1.LuFileText />} variant="link" asChild>
                    <react_router_1.Link to={path_1.path.to.apiTable("js", activeTable)}>
                      {(_b = webhookTables.find(function (table) { return table.value === activeTable; })) === null || _b === void 0 ? void 0 : _b.label}{" "}
                      Table Schema
                    </react_router_1.Link>
                  </react_1.Button>
                </div>
              </div>
            </react_1.TabsContent>
            <react_1.TabsContent value="UPDATE">
              <div className="flex flex-col gap-4 py-4">
                <p>
                  When an <react_1.Badge variant="blue">UPDATE</react_1.Badge> event occurs,
                  we'll send a <react_1.Kbd>POST</react_1.Kbd> request to the webhook URL you've
                  provided.
                </p>
                <p>
                  The payload will be similar to the code below. The{" "}
                  <react_1.Kbd>record</react_1.Kbd> object will contain the updated row and the{" "}
                  <react_1.Kbd>old</react_1.Kbd> object will contain the previous values.
                </p>
                <react_1.Separator />
                <react_1.CodeBlock className="js">
                  {code.updatePayload(activeTable, company.id)}
                </react_1.CodeBlock>
                <react_1.Separator />
                <div>
                  <react_1.Button leftIcon={<lu_1.LuFileText />} variant="link" asChild>
                    <react_router_1.Link to={path_1.path.to.apiTable("js", activeTable)}>
                      {(_c = webhookTables.find(function (table) { return table.value === activeTable; })) === null || _c === void 0 ? void 0 : _c.label}{" "}
                      Table Schema
                    </react_router_1.Link>
                  </react_1.Button>
                </div>
              </div>
            </react_1.TabsContent>
            <react_1.TabsContent value="DELETE">
              <div className="flex flex-col gap-4 py-4">
                <p>
                  When a <react_1.Badge variant="red">DELETE</react_1.Badge> event occurs, we'll
                  send a <react_1.Kbd>POST</react_1.Kbd> request to the webhook URL you've
                  provided. The payload will be similar to the code below. The{" "}
                  <react_1.Kbd>record</react_1.Kbd> object will contain the deleted row.
                </p>
                <react_1.Separator />
                <react_1.CodeBlock className="js">
                  {code.deletePayload(activeTable, company.id)}
                </react_1.CodeBlock>
                <react_1.Separator />
                <div>
                  <react_1.Button leftIcon={<lu_1.LuFileText />} variant="link" asChild>
                    <react_router_1.Link to={path_1.path.to.apiTable("js", activeTable)}>
                      {(_d = webhookTables.find(function (table) { return table.value === activeTable; })) === null || _d === void 0 ? void 0 : _d.label}{" "}
                      Table Schema
                    </react_router_1.Link>
                  </react_1.Button>
                </div>
              </div>
            </react_1.TabsContent>
          </react_1.Tabs>
        </react_1.DrawerBody>
      </react_1.DrawerContent>
    </react_1.Drawer>);
}
function SuccessErrorBar(_a) {
    var successCount = _a.successCount, errorCount = _a.errorCount;
    var total = successCount + errorCount;
    var successPercentage = total > 0 ? (successCount / total) * 100 : 0;
    var errorPercentage = total > 0 ? (errorCount / total) * 100 : 0;
    var numberFormatter = (0, i18n_1.useNumberFormatter)({
        maximumFractionDigits: 0,
        notation: "compact",
        compactDisplay: "short"
    });
    return (<div className="flex flex-col w-full gap-0">
      <div className="w-full h-3 bg-muted rounded-sm overflow-hidden flex">
        <react_1.Tooltip>
          <react_1.TooltipTrigger asChild>
            <div className="h-full bg-emerald-500" style={{ width: "".concat(numberFormatter.format(successPercentage), "%") }}/>
          </react_1.TooltipTrigger>
          <react_1.TooltipContent>
            <p>Success: {successCount}</p>
          </react_1.TooltipContent>
        </react_1.Tooltip>
        <react_1.Tooltip>
          <react_1.TooltipTrigger asChild>
            <div className="h-full bg-red-500" style={{ width: "".concat(errorPercentage, "%") }}/>
          </react_1.TooltipTrigger>
          <react_1.TooltipContent>
            <p>Error: {numberFormatter.format(errorCount)}</p>
          </react_1.TooltipContent>
        </react_1.Tooltip>
      </div>
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
