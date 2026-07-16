"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderLineShipments = SalesOrderLineShipments;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var Shipments_1 = require("~/modules/inventory/ui/Shipments");
var path_1 = require("~/utils/path");
function SalesOrderLineShipments(_a) {
    var line = _a.line, shipments = _a.shipments;
    var permissions = (0, hooks_1.usePermissions)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var _b = (0, react_router_1.useParams)(), orderId = _b.orderId, lineId = _b.lineId;
    if (!orderId)
        throw new Error("orderId not found");
    if (!lineId)
        throw new Error("lineId not found");
    var newJobDisclosure = (0, react_1.useDisclosure)();
    var hasShipments = shipments.length > 0;
    var totalShipmentQuantity = shipments.reduce(function (sum, shipment) { var _a; return sum + ((_a = shipment.shippedQuantity) !== null && _a !== void 0 ? _a : 0); }, 0);
    var fetcher = (0, react_router_1.useFetcher)();
    return (<>
      <react_1.Card>
        <react_1.HStack className="w-full justify-between">
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Shipments</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardAction>
            {permissions.can("create", "inventory") && hasShipments && (<fetcher.Form method="post" action={path_1.path.to.newSalesOrderLineShipment(orderId, lineId)}>
                <react_1.Button type="submit" leftIcon={<lu_1.LuCirclePlus />} onClick={newJobDisclosure.onOpen} isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"}>
                  New Shipment
                </react_1.Button>
              </fetcher.Form>)}
          </react_1.CardAction>
        </react_1.HStack>

        <react_1.CardContent>
          {shipments.length > 0 ? (<react_1.Table>
              <react_1.Thead>
                <react_1.Tr>
                  <react_1.Th>
                    <macro_1.Trans>Shipment</macro_1.Trans>
                  </react_1.Th>
                  <react_1.Th>
                    <macro_1.Trans>Date</macro_1.Trans>
                  </react_1.Th>
                  <react_1.Th className="text-right">Quantity</react_1.Th>
                </react_1.Tr>
              </react_1.Thead>
              <react_1.Tbody>
                {Object.entries(shipments.reduce(function (acc, shipment) {
                var key = shipment.shipment.id;
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(shipment);
                return acc;
            }, {})).map(function (_a) {
                var shipmentId = _a[0], groupedShipments = _a[1];
                return (<react_1.Tr key={shipmentId}>
                    <react_1.Td>
                      <react_1.HStack>
                        <components_1.Hyperlink to={path_1.path.to.shipment(shipmentId)}>
                          {groupedShipments[0].shipment.shipmentId}
                        </components_1.Hyperlink>
                        <Shipments_1.ShipmentStatus status={groupedShipments[0].shipment.status} invoiced={groupedShipments[0].shipment.invoiced}/>
                      </react_1.HStack>
                    </react_1.Td>
                    <react_1.Td>
                      {formatDate(groupedShipments[0].shipment.createdAt)}
                    </react_1.Td>
                    <react_1.Td className="text-right">
                      {groupedShipments.reduce(function (sum, shipment) { var _a; return sum + ((_a = shipment.shippedQuantity) !== null && _a !== void 0 ? _a : 0); }, 0)}
                    </react_1.Td>
                  </react_1.Tr>);
            })}
              </react_1.Tbody>
              <react_1.Tfoot className="border-t border-border">
                <react_1.Tr>
                  <react_1.Td />
                  <react_1.Td />
                  <react_1.Td className="text-right">{totalShipmentQuantity}</react_1.Td>
                </react_1.Tr>
              </react_1.Tfoot>
            </react_1.Table>) : (<components_1.Empty className="pb-12">
              {permissions.can("create", "inventory") && (<fetcher.Form method="post" action={path_1.path.to.newSalesOrderLineShipment(orderId, lineId)}>
                  <react_1.Button type="submit" leftIcon={<lu_1.LuCirclePlus />} onClick={newJobDisclosure.onOpen} isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"}>
                    New Shipment
                  </react_1.Button>
                </fetcher.Form>)}
            </components_1.Empty>)}
        </react_1.CardContent>
      </react_1.Card>
    </>);
}
