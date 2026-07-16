"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PickingListDetailsRoute;
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var PickingLists_1 = require("~/modules/inventory/ui/PickingLists");
var path_1 = require("~/utils/path");
function PickingListDetailsRoute() {
    var _a;
    var pickingListId = (0, react_router_1.useParams)().pickingListId;
    if (!pickingListId)
        throw new Error("Could not find pickingListId");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.pickingList(pickingListId));
    if (!(routeData === null || routeData === void 0 ? void 0 : routeData.pickingList))
        throw new Error("Could not find picking list in routeData");
    return (<>
      <PickingLists_1.PickingListLines pickingListLines={routeData.pickingListLines} pickingListId={pickingListId} pickingList={routeData.pickingList} recommendations={routeData.recommendations}/>
      <PickingLists_1.PickingListNotes id={pickingListId} notes={((_a = routeData.pickingList.notes) !== null && _a !== void 0 ? _a : {})}/>
    </>);
}
