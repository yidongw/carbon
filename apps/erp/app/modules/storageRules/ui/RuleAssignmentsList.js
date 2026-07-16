"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RuleAssignmentsList;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var UpgradeOverlay_1 = require("~/components/UpgradeOverlay");
var hooks_1 = require("~/hooks");
var usePlanGate_1 = require("~/hooks/usePlanGate");
var path_1 = require("~/utils/path");
var SurfaceChips_1 = require("./SurfaceChips");
// Target-specific copy. Keeps the card description grounded in the right
// nouns and surface list per rule type.
var TARGET_COPY = {
    item: {
        noun: "item",
        surfaceBlurb: "receipts, shipments, transfers, inventory adjustments and bin moves"
    },
    workCenter: {
        noun: "work center",
        surfaceBlurb: "operation start/finish and material moves"
    }
};
var ASSIGN_PATH = {
    item: path_1.path.to.storageRuleAssignItem,
    workCenter: path_1.path.to.storageRuleAssignWorkCenter
};
var UNASSIGN_PATH = {
    item: path_1.path.to.storageRuleUnassignItem,
    workCenter: path_1.path.to.storageRuleUnassignWorkCenter
};
var PERM_MODULE = {
    item: "parts",
    workCenter: "resources"
};
function RuleAssignmentsList(_a) {
    var targetType = _a.targetType, targetId = _a.targetId, assignments = _a.assignments, library = _a.library, _b = _a.variant, variant = _b === void 0 ? "card" : _b;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var isGated = (0, usePlanGate_1.usePlanGate)({ feature: "STORAGE_RULES" }).isGated;
    var module = PERM_MODULE[targetType];
    var canCreate = permissions.can("create", module);
    var canDelete = permissions.can("delete", module);
    var targetCopy = TARGET_COPY[targetType];
    var description = "Enforce constraints on ".concat(targetCopy.surfaceBlurb, " for this ").concat(targetCopy.noun, ".");
    var assignedSet = (0, react_2.useMemo)(function () { return new Set(assignments.map(function (a) { return a.ruleId; })); }, [assignments]);
    var available = (0, react_2.useMemo)(function () { return library.filter(function (r) { return r.active && !assignedSet.has(r.id); }); }, [library, assignedSet]);
    var availableOptions = (0, react_2.useMemo)(function () { return available.map(function (r) { return ({ value: r.id, label: r.name }); }); }, [available]);
    var handleAssign = function (ruleId) {
        if (!ruleId)
            return;
        var fd = new FormData();
        fd.set("ruleId", ruleId);
        fetcher.submit(fd, {
            method: "post",
            action: ASSIGN_PATH[targetType](targetId)
        });
    };
    var isEmpty = assignments.length === 0;
    var header = (<div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">
            <macro_1.Trans>Rules</macro_1.Trans>
          </h2>
          {!isEmpty && (<span className="text-sm font-normal text-muted-foreground tabular-nums">
              {assignments.length}
            </span>)}
        </div>
        <p className="mt-1 max-w-[64ch] text-sm text-muted-foreground text-pretty">
          {description}
        </p>
      </div>
      {!isEmpty && canCreate && (<div className="flex shrink-0 items-center gap-2">
          {availableOptions.length > 0 && (<react_1.Combobox size="md" value="" options={availableOptions} onChange={handleAssign} placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Add from library\u2026"], ["Add from library\u2026"])))} className="w-[200px]"/>)}
          <react_1.Button variant="primary" leftIcon={<lu_1.LuPlus />} asChild>
            <react_router_1.Link to={"".concat(path_1.path.to.newStorageRule, "?targetType=").concat(targetType)}>
              <macro_1.Trans>Add rule</macro_1.Trans>
            </react_router_1.Link>
          </react_1.Button>
        </div>)}
    </div>);
    if (isGated) {
        var gatedBody = (<div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
        <UpgradeOverlay_1.UpgradeOverlayIcon>
          <lu_1.LuShieldCheck className="size-6 text-muted-foreground"/>
        </UpgradeOverlay_1.UpgradeOverlayIcon>
        <UpgradeOverlay_1.UpgradeOverlayContent>
          <UpgradeOverlay_1.UpgradeOverlayTitle>
            <macro_1.Trans>Upgrade to unlock {targetCopy.noun} rules</macro_1.Trans>
          </UpgradeOverlay_1.UpgradeOverlayTitle>
          <UpgradeOverlay_1.UpgradeOverlayDescription>{description}</UpgradeOverlay_1.UpgradeOverlayDescription>
        </UpgradeOverlay_1.UpgradeOverlayContent>
        <UpgradeOverlay_1.UpgradeOverlayActions>
          <UpgradeOverlay_1.UpgradeOverlayUpgradeButton />
        </UpgradeOverlay_1.UpgradeOverlayActions>
      </div>);
        if (variant === "flat") {
            return (<div className="flex flex-col gap-4">
          {header}
          {gatedBody}
        </div>);
        }
        return (<react_1.Card className="flex-grow">
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Rules</macro_1.Trans>
          </react_1.CardTitle>
          <react_1.CardDescription>{description}</react_1.CardDescription>
        </react_1.CardHeader>
        <react_1.CardContent>{gatedBody}</react_1.CardContent>
      </react_1.Card>);
    }
    var body = isEmpty ? (<EmptyState availableOptions={availableOptions} canCreate={canCreate} onAssign={handleAssign} targetNoun={targetCopy.noun}/>) : (<react_1.Table>
      <react_1.Thead>
        <react_1.Tr>
          <react_1.Th>
            <macro_1.Trans>Name</macro_1.Trans>
          </react_1.Th>
          <react_1.Th>
            <macro_1.Trans>Severity</macro_1.Trans>
          </react_1.Th>
          <react_1.Th>
            <macro_1.Trans>Surfaces</macro_1.Trans>
          </react_1.Th>
          <react_1.Th>
            <macro_1.Trans>Status</macro_1.Trans>
          </react_1.Th>
          {variant === "card" && (<react_1.Th>
              <macro_1.Trans>Message</macro_1.Trans>
            </react_1.Th>)}
          <react_1.Th />
        </react_1.Tr>
      </react_1.Thead>
      <react_1.Tbody>
        {assignments.map(function (a) {
            var isBroadcast = a.inheritedFromId === "__all__";
            var isLocked = isBroadcast;
            return (<react_1.Tr key={a.ruleId}>
              <react_1.Td className="whitespace-nowrap">
                <react_1.HStack className="gap-2 items-center flex-wrap">
                  <components_1.Hyperlink to={path_1.path.to.storageRule(a.ruleId)}>
                    <react_1.HStack className="gap-2 items-center">
                      <lu_1.LuShieldCheck className="text-muted-foreground shrink-0"/>
                      <span>{a.rule.name}</span>
                    </react_1.HStack>
                  </components_1.Hyperlink>
                  {isBroadcast && (<react_1.Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                      <macro_1.Trans>Applies to all</macro_1.Trans>
                    </react_1.Badge>)}
                </react_1.HStack>
              </react_1.Td>
              <react_1.Td>
                {a.rule.severity === "error" ? (<react_1.Badge variant="red">
                    <macro_1.Trans>Error</macro_1.Trans>
                  </react_1.Badge>) : (<react_1.Badge variant="yellow">
                    <macro_1.Trans>Warning</macro_1.Trans>
                  </react_1.Badge>)}
              </react_1.Td>
              <react_1.Td>
                <SurfaceChips_1.default surfaces={a.rule.surfaces} targetType={targetType}/>
              </react_1.Td>
              <react_1.Td>
                {a.rule.active ? (<react_1.Status color="green">
                    <macro_1.Trans>Active</macro_1.Trans>
                  </react_1.Status>) : (<react_1.Status color="gray">
                    <macro_1.Trans>Inactive</macro_1.Trans>
                  </react_1.Status>)}
              </react_1.Td>
              {variant === "card" && (<react_1.Td className="w-full max-w-0">
                  <p className="text-muted-foreground truncate max-w-xl">
                    {a.rule.message}
                  </p>
                </react_1.Td>)}
              <react_1.Td className="text-right">
                <react_router_1.Form method="post" action={UNASSIGN_PATH[targetType](targetId, a.ruleId)}>
                  <react_1.IconButton type="submit" icon={<lu_1.LuTrash />} aria-label={isBroadcast
                    ? t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Edit the rule to remove the \"Applies to all\" flag"], ["Edit the rule to remove the \"Applies to all\" flag"]))) : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Unassign rule"], ["Unassign rule"])))} title={isBroadcast
                    ? t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Edit the rule to remove the \"Applies to all\" flag"], ["Edit the rule to remove the \"Applies to all\" flag"]))) : undefined} variant="ghost" size="sm" isDisabled={!canDelete || isLocked}/>
                </react_router_1.Form>
              </react_1.Td>
            </react_1.Tr>);
        })}
      </react_1.Tbody>
    </react_1.Table>);
    if (variant === "flat") {
        return (<div className="flex flex-col gap-4">
        {header}
        {body}
      </div>);
    }
    return (<react_1.Card className="flex-grow">
      <react_1.CardHeader>{header}</react_1.CardHeader>
      <react_1.CardContent>{body}</react_1.CardContent>
    </react_1.Card>);
}
function EmptyState(_a) {
    var availableOptions = _a.availableOptions, canCreate = _a.canCreate, onAssign = _a.onAssign, targetNoun = _a.targetNoun;
    var t = (0, macro_1.useLingui)().t;
    return (<div className="flex flex-col items-center justify-center gap-5 py-10 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <lu_1.LuShieldCheck className="size-6 text-muted-foreground"/>
      </div>

      <div className="flex flex-col gap-1.5 max-w-md">
        <p className="text-base font-medium">
          <macro_1.Trans>No rules assigned</macro_1.Trans>
        </p>
        <p className="text-sm text-muted-foreground">
          Pick an existing rule from the library or create a new one to start
          enforcing constraints on this {targetNoun}.
        </p>
      </div>

      {canCreate && (<react_1.HStack className="gap-2 flex-wrap justify-center pt-1">
          {availableOptions.length > 0 ? (<>
              <react_1.Combobox value="" options={availableOptions} onChange={onAssign} placeholder={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Add from library\u2026"], ["Add from library\u2026"])))}/>
              <react_1.Button asChild variant="secondary" size="sm" leftIcon={<lu_1.LuPlus />}>
                <react_router_1.Link to={path_1.path.to.newStorageRule}>
                  <macro_1.Trans>Create new rule</macro_1.Trans>
                </react_router_1.Link>
              </react_1.Button>
            </>) : (<>
              <react_1.Button asChild variant="secondary" size="sm" leftIcon={<lu_1.LuLibrary />}>
                <react_router_1.Link to={path_1.path.to.storageRules}>
                  <macro_1.Trans>Browse library</macro_1.Trans>
                </react_router_1.Link>
              </react_1.Button>
              <react_1.Button asChild size="sm" leftIcon={<lu_1.LuPlus />}>
                <react_router_1.Link to={path_1.path.to.newStorageRule}>
                  <macro_1.Trans>Create new rule</macro_1.Trans>
                </react_router_1.Link>
              </react_1.Button>
            </>)}
        </react_1.HStack>)}
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
