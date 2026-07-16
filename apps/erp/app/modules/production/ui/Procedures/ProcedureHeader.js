"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var ConfirmDelete_1 = require("~/components/Modals/ConfirmDelete");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var ProcedureForm_1 = require("./ProcedureForm");
var ProcedureStatus_1 = require("./ProcedureStatus");
function ProcedureTopbarLeft(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    var id = _a.id;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.procedure(id));
    var newVersionDisclosure = (0, react_1.useDisclosure)();
    var deleteDisclosure = (0, react_1.useDisclosure)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        newVersionDisclosure.onClose();
    }, [id]);
    return (<>
      <Layout_1.DetailTopbarContent>
        <Layout_1.DetailTopbarPlainId>{(_b = routeData === null || routeData === void 0 ? void 0 : routeData.procedure) === null || _b === void 0 ? void 0 : _b.name}</Layout_1.DetailTopbarPlainId>
        <Layout_1.DetailTopbarBadge variant="outline" label={"V".concat((_c = routeData === null || routeData === void 0 ? void 0 : routeData.procedure) === null || _c === void 0 ? void 0 : _c.version)}/>
        <ProcedureStatus_1.default iconOnly status={(_d = routeData === null || routeData === void 0 ? void 0 : routeData.procedure) === null || _d === void 0 ? void 0 : _d.status}/>
        <react_1.Copy text={(_f = (_e = routeData === null || routeData === void 0 ? void 0 : routeData.procedure) === null || _e === void 0 ? void 0 : _e.name) !== null && _f !== void 0 ? _f : ""}/>
        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} variant="secondary" size="sm"/>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent>
            {permissions.can("create", "production") && (<>
                <react_1.DropdownMenuItem onClick={newVersionDisclosure.onOpen}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuCirclePlus />}/>
                  <macro_1.Trans>New Version</macro_1.Trans>
                </react_1.DropdownMenuItem>
                <react_1.DropdownMenuSeparator />
              </>)}
            <react_2.Suspense fallback={null}>
              <react_router_1.Await resolve={routeData === null || routeData === void 0 ? void 0 : routeData.versions}>
                {function (versions) {
            var _a;
            return (<react_1.DropdownMenuRadioGroup value={id} onValueChange={function (value) {
                    return navigate(path_1.path.to.procedure(value));
                }}>
                    {(routeData === null || routeData === void 0 ? void 0 : routeData.procedure) && (<react_1.DropdownMenuRadioItem key={routeData.procedure.id} value={routeData.procedure.id} className="flex items-center justify-between gap-2">
                        <react_1.Badge variant="outline">
                          V{routeData.procedure.version}
                        </react_1.Badge>
                        <span>{routeData.procedure.name}</span>
                        <ProcedureStatus_1.default status={routeData.procedure.status}/>
                      </react_1.DropdownMenuRadioItem>)}
                    {(_a = versions === null || versions === void 0 ? void 0 : versions.data) === null || _a === void 0 ? void 0 : _a.filter(function (v) { return v.id !== id; }).map(function (version) { return (<react_1.DropdownMenuRadioItem key={version.id} value={version.id} className="flex items-center justify-between gap-2">
                          <react_1.Badge variant="outline">V{version.version}</react_1.Badge>
                          <span>{version.name}</span>
                          <ProcedureStatus_1.default status={version.status}/>
                        </react_1.DropdownMenuRadioItem>); })}
                  </react_1.DropdownMenuRadioGroup>);
        }}
              </react_router_1.Await>
            </react_2.Suspense>
            <react_1.DropdownMenuSeparator />
            <react_1.DropdownMenuItem disabled={!permissions.can("delete", "production") ||
            !permissions.is("employee")} destructive onClick={deleteDisclosure.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Procedure</macro_1.Trans>
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </Layout_1.DetailTopbarContent>

      {newVersionDisclosure.isOpen && (<ProcedureForm_1.default type="copy" initialValues={{
                name: (_h = (_g = routeData === null || routeData === void 0 ? void 0 : routeData.procedure) === null || _g === void 0 ? void 0 : _g.name) !== null && _h !== void 0 ? _h : "",
                version: ((_k = (_j = routeData === null || routeData === void 0 ? void 0 : routeData.procedure) === null || _j === void 0 ? void 0 : _j.version) !== null && _k !== void 0 ? _k : 0) + 1,
                processId: (_m = (_l = routeData === null || routeData === void 0 ? void 0 : routeData.procedure) === null || _l === void 0 ? void 0 : _l.processId) !== null && _m !== void 0 ? _m : "",
                content: (_p = JSON.stringify((_o = routeData === null || routeData === void 0 ? void 0 : routeData.procedure) === null || _o === void 0 ? void 0 : _o.content)) !== null && _p !== void 0 ? _p : "",
                copyFromId: (_r = (_q = routeData === null || routeData === void 0 ? void 0 : routeData.procedure) === null || _q === void 0 ? void 0 : _q.id) !== null && _r !== void 0 ? _r : ""
            }} open={newVersionDisclosure.isOpen} onClose={newVersionDisclosure.onClose}/>)}
      {deleteDisclosure.isOpen && (<ConfirmDelete_1.default action={path_1.path.to.deleteProcedure(id)} isOpen={deleteDisclosure.isOpen} name={(_t = (_s = routeData === null || routeData === void 0 ? void 0 : routeData.procedure) === null || _s === void 0 ? void 0 : _s.name) !== null && _t !== void 0 ? _t : "procedure"} text={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), (_u = routeData === null || routeData === void 0 ? void 0 : routeData.procedure) === null || _u === void 0 ? void 0 : _u.name)} onCancel={function () {
                deleteDisclosure.onClose();
            }} onSubmit={function () {
                deleteDisclosure.onClose();
            }}/>)}
    </>);
}
var ProcedureHeader = function () {
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("id not found");
    var leftSlotEl = (0, Layout_1.useTopbarLeft)().leftSlotEl;
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, Layout_1.usePanels)(), hasExplorer = _a.hasExplorer, toggleExplorer = _a.toggleExplorer, toggleProperties = _a.toggleProperties;
    return (<>
      {leftSlotEl && (0, react_dom_1.createPortal)(<ProcedureTopbarLeft id={id}/>, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        {hasExplorer && (<react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Toggle Explorer"], ["Toggle Explorer"])))} icon={<lu_1.LuPanelLeft />} onClick={toggleExplorer} variant="ghost"/>)}
        <div className="flex-1"/>
        <react_1.IconButton aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Toggle Properties"], ["Toggle Properties"])))} icon={<lu_1.LuPanelRight />} onClick={toggleProperties} variant="ghost"/>
      </div>
    </>);
};
exports.default = ProcedureHeader;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
