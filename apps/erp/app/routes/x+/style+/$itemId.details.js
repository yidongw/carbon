"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StyleDetailsRoute;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var methodBindings_1 = require("~/modules/items/methodBindings");
var Item_1 = require("~/modules/items/ui/Item");
var path_1 = require("~/utils/path");
var emptyConfigurationRuleBindings = {
    save: "#",
    delete: function (_field) { return "#"; }
};
function StyleDetailsRoute() {
    var _a, _b, _c, _d;
    var itemId = (0, react_router_1.useParams)().itemId;
    if (!itemId)
        throw new Error("Could not find itemId");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.style(itemId));
    if (!routeData)
        throw new Error("Could not find style data");
    var files = routeData.files, makeMethods = routeData.makeMethods, methodData = routeData.methodData, styleSummary = routeData.styleSummary, tags = routeData.tags;
    var isManufactured = styleSummary.replenishmentSystem !== "Buy";
    return (<react_1.VStack spacing={2} className="p-2">
      {methodData && (<>
          <react_2.Suspense fallback={<react_1.Menubar />}>
            <react_router_1.Await resolve={makeMethods}>
              {function (resolvedMakeMethods) {
                var _a;
                return (<Item_1.MakeMethodTools itemId={methodData.makeMethod.itemId} makeMethods={(_a = resolvedMakeMethods.data) !== null && _a !== void 0 ? _a : []} type="Style" currentMethodId={methodData.makeMethod.id}/>);
            }}
            </react_router_1.Await>
          </react_2.Suspense>
          <Item_1.ItemNotes id={styleSummary.id} title={(_a = styleSummary.name) !== null && _a !== void 0 ? _a : ""} subTitle={(_b = styleSummary.readableIdWithRevision) !== null && _b !== void 0 ? _b : ""} notes={(_c = styleSummary.notes) !== null && _c !== void 0 ? _c : undefined}/>
          {isManufactured && (<>
              <Item_1.BillOfMaterial key={"bom:".concat(itemId)} methodBindings={(0, methodBindings_1.methodBindings)(itemId)} configurationRuleBindings={emptyConfigurationRuleBindings} makeMethod={methodData.makeMethod} materials={methodData.methodMaterials} operations={methodData.methodOperations} configurable={false} configurationRules={[]} parameters={[]} replenishmentSystem={(_d = styleSummary.replenishmentSystem) !== null && _d !== void 0 ? _d : undefined}/>
              <Item_1.BillOfProcess key={"bop:".concat(itemId)} methodBindings={(0, methodBindings_1.methodBindings)(itemId)} configurationRuleBindings={emptyConfigurationRuleBindings} makeMethod={methodData.makeMethod} operations={methodData.methodOperations} materials={methodData.methodMaterials} configurable={false} configurationRules={[]} parameters={[]} tags={tags}/>
            </>)}
        </>)}
      <react_2.Suspense fallback={null}>
        <react_router_1.Await resolve={files}>
          {function (resolvedFiles) { return (<Item_1.ItemDocuments files={resolvedFiles} itemId={itemId} type="Style"/>); }}
        </react_router_1.Await>
      </react_2.Suspense>
      <Item_1.ItemRiskRegister itemId={itemId}/>
    </react_1.VStack>);
}
