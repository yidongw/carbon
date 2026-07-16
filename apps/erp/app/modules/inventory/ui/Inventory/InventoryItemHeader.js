"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var hooks_1 = require("~/hooks");
var ItemForm_1 = require("~/modules/items/ui/Item/ItemForm");
var path_1 = require("~/utils/path");
var useInventoryNavigation_1 = require("./useInventoryNavigation");
var InventoryItemHeader = function (_a) {
    var itemReadableId = _a.itemReadableId, itemType = _a.itemType;
    var links = (0, useInventoryNavigation_1.useInventoryNavigation)();
    var itemId = (0, react_router_1.useParams)().itemId;
    if (!itemId)
        throw new Error("itemId not found");
    var params = (0, hooks_1.useUrlParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    return (<div>
      <react_1.VStack className="w-full">
        <div className="flex justify-between items-center border-b border-border p-2 bg-card w-full">
          <react_1.Button isIcon variant="ghost" onClick={function () {
            return navigate("".concat(path_1.path.to.inventoryQuantities, "?").concat(params.toString()));
        }}>
            <lu_1.LuX className="w-4 h-4"/>
          </react_1.Button>
          <span className="flex items-center font-semibold text-center">
            {itemReadableId}{" "}
            <react_router_1.Link to={(0, ItemForm_1.getLinkToItemDetails)(itemType, itemId)} className="ml-2">
              <lu_1.LuExternalLink />
            </react_router_1.Link>
          </span>
          <Layout_1.DetailsTopbar links={links} preserveParams/>
        </div>
      </react_1.VStack>
    </div>);
};
exports.default = InventoryItemHeader;
