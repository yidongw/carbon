"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var Layout_1 = require("~/components/Layout");
var ConfirmDelete_1 = require("~/components/Modals/ConfirmDelete");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
function TemplateTopbarLeft(_a) {
    var _b;
    var template = _a.template;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var deleteModal = (0, react_1.useDisclosure)();
    return (<>
      <Layout_1.DetailTopbarContent>
        <Layout_1.DetailTopbarPlainId>{template.name}</Layout_1.DetailTopbarPlainId>
        <react_1.Copy text={(_b = template.name) !== null && _b !== void 0 ? _b : ""}/>
        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} size="sm" variant="secondary"/>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent>
            <react_1.DropdownMenuItem disabled={!permissions.can("delete", "parts") ||
            !permissions.is("employee")} destructive onClick={deleteModal.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete Template</macro_1.Trans>
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </Layout_1.DetailTopbarContent>
      {deleteModal.isOpen && (<ConfirmDelete_1.default action={path_1.path.to.deleteTemplate(template.id)} isOpen={deleteModal.isOpen} name={template.name} text={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), template.name)} onCancel={deleteModal.onClose} onSubmit={deleteModal.onClose}/>)}
    </>);
}
var TemplateHeader = function (_a) {
    var template = _a.template;
    var t = (0, macro_1.useLingui)().t;
    var leftSlotEl = (0, Layout_1.useTopbarLeft)().leftSlotEl;
    var _b = (0, Layout_1.usePanels)(), hasExplorer = _b.hasExplorer, toggleExplorer = _b.toggleExplorer;
    return (<>
      {leftSlotEl &&
            (0, react_dom_1.createPortal)(<TemplateTopbarLeft template={template}/>, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        {hasExplorer && (<react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Toggle Explorer"], ["Toggle Explorer"])))} icon={<lu_1.LuPanelLeft />} onClick={toggleExplorer} variant="ghost"/>)}
        <div className="flex-1"/>
      </div>
    </>);
};
exports.default = TemplateHeader;
var templateObject_1, templateObject_2, templateObject_3;
