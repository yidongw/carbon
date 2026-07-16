"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var ConfirmDelete_1 = require("~/components/Modals/ConfirmDelete");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var SurfaceChips_1 = require("./SurfaceChips");
// How a rule reaches its targets, for the badge + assignment display.
// Item rules use type/group filters (empty = all items); other targets use the
// appliesToAll broadcast flag.
function ruleReach(rule) {
    var _a, _b;
    if (rule.targetType === "item") {
        var types = (_a = rule.filteredItemTypes) !== null && _a !== void 0 ? _a : [];
        var groups = (_b = rule.filteredItemGroupIds) !== null && _b !== void 0 ? _b : [];
        if (types.length === 0 && groups.length === 0) {
            return { broadcastLabel: "All items", showAssignments: false };
        }
        var parts = [];
        if (types.length)
            parts.push("".concat(types.length, " type").concat(types.length > 1 ? "s" : ""));
        if (groups.length)
            parts.push("".concat(groups.length, " group").concat(groups.length > 1 ? "s" : ""));
        return { broadcastLabel: parts.join(" · "), showAssignments: true };
    }
    return {
        broadcastLabel: rule.appliesToAll ? "Applies to all" : null,
        showAssignments: !rule.appliesToAll
    };
}
var TARGET_LABEL = {
    item: "Storage",
    workCenter: "Work center"
};
var RuleSectionCard = (0, react_2.memo)(function (_a) {
    var title = _a.title, description = _a.description, icon = _a.icon, newRuleHref = _a.newRuleHref, newRuleLabel = _a.newRuleLabel, canCreate = _a.canCreate, rules = _a.rules;
    return (<react_1.Card>
      <react_1.CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <react_1.CardTitle className="flex items-center gap-2 text-base font-semibold">
              {icon}
              {title}
            </react_1.CardTitle>
            <react_1.CardDescription className="mt-1 max-w-[60ch] text-sm text-pretty">
              {description}
            </react_1.CardDescription>
          </div>
          {canCreate && (<react_1.Button variant="primary" leftIcon={<lu_1.LuPlus />} asChild>
              <react_router_1.Link to={newRuleHref}>{newRuleLabel}</react_router_1.Link>
            </react_1.Button>)}
        </div>
      </react_1.CardHeader>
      <react_1.CardContent>
        {rules.length === 0 ? (<components_1.Empty className="my-4"/>) : (<react_1.VStack spacing={3} className="items-stretch">
            {rules.map(function (r) { return (<StorageRuleCard key={r.id} rule={r}/>); })}
          </react_1.VStack>)}
      </react_1.CardContent>
    </react_1.Card>);
});
RuleSectionCard.displayName = "RuleSectionCard";
var StorageRulesGroups = (0, react_2.memo)(function (_a) {
    var rules = _a.rules;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var canCreate = permissions.can("create", "inventory");
    // Only item (storage) rules are shown here; workCenter rules are managed via
    // Resources and hidden until their entry point + MES modal ship.
    var itemRules = (0, react_2.useMemo)(function () { return rules.filter(function (r) { return r.targetType === "item"; }); }, [rules]);
    return (<react_1.ScrollArea className="w-full h-[calc(100dvh-49px)] bg-card">
      <react_1.VStack spacing={4} className="py-12 px-4 max-w-[60rem] h-full mx-auto gap-4">
        <div className="flex flex-col gap-1 w-full">
          <react_1.Heading size="h3" className="tracking-tight text-balance">
            {t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Storage Rules"], ["Storage Rules"])))}
          </react_1.Heading>
          <p className="max-w-[72ch] text-sm text-muted-foreground text-pretty">
            {t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Predicate-driven guards that fire on inventory transactions. Block with errors or warn with acknowledge-to-continue."], ["Predicate-driven guards that fire on inventory transactions. Block with errors or warn with acknowledge-to-continue."])))}
          </p>
        </div>

        <RuleSectionCard title={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Storage rules"], ["Storage rules"])))} description={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Fire on receipts, shipments, transfers, inventory adjustments and bin moves (place/pick)."], ["Fire on receipts, shipments, transfers, inventory adjustments and bin moves (place/pick)."])))} icon={<lu_1.LuPackage className="size-4 text-muted-foreground"/>} newRuleHref={"".concat(path_1.path.to.newStorageRule, "?targetType=item")} newRuleLabel={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Storage Rule"], ["Storage Rule"])))} canCreate={canCreate} rules={itemRules}/>
      </react_1.VStack>
    </react_1.ScrollArea>);
});
StorageRulesGroups.displayName = "StorageRulesGroups";
exports.default = StorageRulesGroups;
var StorageRuleCard = (0, react_2.memo)(function (_a) {
    var _b;
    var rule = _a.rule;
    var t = (0, macro_1.useLingui)().t;
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var deleteDisclosure = (0, react_1.useDisclosure)();
    var canEdit = permissions.can("update", "inventory");
    var canDelete = permissions.can("delete", "inventory");
    var _c = ruleReach(rule), broadcastLabel = _c.broadcastLabel, showAssignments = _c.showAssignments;
    var handleEdit = (0, react_2.useCallback)(function () {
        navigate("".concat(path_1.path.to.storageRule(rule.id), "?").concat(params.toString()));
    }, [navigate, params, rule.id]);
    return (<>
      <react_1.Card className="p-0 border">
        <react_1.Accordion type="multiple" className="w-full">
          <react_1.AccordionItem value={rule.id} className="border-none">
            <div className="relative">
              <react_1.AccordionTrigger className="px-6 py-6 hover:no-underline w-full">
                <react_1.HStack spacing={4} className="flex-1 justify-between pr-12">
                  <div className="flex items-center gap-3 min-w-0">
                    <react_1.Heading size="h4" as="h3" className="truncate">
                      {rule.name}
                    </react_1.Heading>
                    <react_1.Badge variant="secondary">
                      {TARGET_LABEL[rule.targetType]}
                    </react_1.Badge>
                    {rule.severity === "error" ? (<react_1.Badge variant="red">Error</react_1.Badge>) : (<react_1.Badge variant="yellow">Warn</react_1.Badge>)}
                    {broadcastLabel && (<react_1.Badge variant="outline">{broadcastLabel}</react_1.Badge>)}
                  </div>
                  <react_1.Status color={rule.active ? "green" : "gray"} className="text-xs font-medium">
                    {rule.active ? "Active" : "Inactive"}
                  </react_1.Status>
                </react_1.HStack>
              </react_1.AccordionTrigger>
              <div className="absolute right-12 top-1/2 -translate-y-1/2 z-10">
                <react_1.DropdownMenu>
                  <react_1.DropdownMenuTrigger asChild>
                    <react_1.IconButton aria-label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} variant="ghost" onClick={function (e) { return e.stopPropagation(); }}/>
                  </react_1.DropdownMenuTrigger>
                  <react_1.DropdownMenuContent align="end">
                    <react_1.DropdownMenuItem disabled={!canEdit} onClick={function (e) {
            e.stopPropagation();
            handleEdit();
        }}>
                      <lu_1.LuPencil className="mr-2 h-4 w-4"/>
                      Edit Rule
                    </react_1.DropdownMenuItem>
                    <react_1.DropdownMenuSeparator />
                    <react_1.DropdownMenuItem destructive disabled={!canDelete} onClick={function (e) {
            e.stopPropagation();
            deleteDisclosure.onOpen();
        }}>
                      <lu_1.LuTrash className="mr-2 h-4 w-4"/>
                      Delete Rule
                    </react_1.DropdownMenuItem>
                  </react_1.DropdownMenuContent>
                </react_1.DropdownMenu>
              </div>
            </div>
            <react_1.AccordionContent className="px-6 pb-5">
              <react_1.VStack spacing={3}>
                {rule.description && (<p className="text-sm text-muted-foreground">
                    {rule.description}
                  </p>)}
                {rule.message && (<div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wide font-medium text-muted-foreground">
                      Message
                    </span>
                    <p className="text-sm">{rule.message}</p>
                  </div>)}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-wide font-medium text-muted-foreground">
                      Triggers
                    </span>
                    <SurfaceChips_1.default surfaces={rule.surfaces} targetType={rule.targetType}/>
                  </div>
                  {showAssignments && (<div className="flex flex-col gap-1">
                      <span className="text-xs uppercase tracking-wide font-medium text-muted-foreground">
                        Assignments
                      </span>
                      <span className="tabular-nums text-sm">
                        {(_b = rule.assignmentCount) !== null && _b !== void 0 ? _b : 0}
                      </span>
                    </div>)}
                </div>
              </react_1.VStack>
            </react_1.AccordionContent>
          </react_1.AccordionItem>
        </react_1.Accordion>
      </react_1.Card>
      <ConfirmDelete_1.default action={path_1.path.to.deleteStorageRule(rule.id)} isOpen={deleteDisclosure.isOpen} name={"".concat(TARGET_LABEL[rule.targetType], " rule \"").concat(rule.name, "\"")} text="Are you sure you want to delete this storage rule? Assignments will also be removed." onCancel={deleteDisclosure.onClose} onSubmit={deleteDisclosure.onClose}/>
    </>);
});
StorageRuleCard.displayName = "StorageRuleCard";
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
