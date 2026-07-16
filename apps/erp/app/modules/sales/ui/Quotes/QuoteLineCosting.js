"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var hooks_1 = require("~/hooks");
var QuoteLineCosting = function (_a) {
    var quantities = _a.quantities, getLineCosts = _a.getLineCosts, unitPricePrecision = _a.unitPricePrecision;
    var _b = (0, react_router_1.useParams)(), quoteId = _b.quoteId, lineId = _b.lineId;
    if (!quoteId)
        throw new Error("Could not find quoteId");
    if (!lineId)
        throw new Error("Could not find lineId");
    var quantityCosts = quantities.map(function (quantity) { return ({
        quantity: quantity,
        costs: getLineCosts(quantity)
    }); });
    var formatter = (0, hooks_1.useCurrencyFormatter)();
    var unitCostFormatter = (0, hooks_1.useCurrencyFormatter)({
        maximumFractionDigits: unitPricePrecision
    });
    var detailsDisclosure = (0, react_1.useDisclosure)();
    return (<react_1.Card>
      <react_1.HStack className="justify-between items-start">
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Costing</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardAction>
          <div className="flex items-center space-x-2 py-2">
            <react_1.Switch variant="small" checked={detailsDisclosure.isOpen} onCheckedChange={detailsDisclosure.onToggle} id="cost-details"/>
            <label className="text-sm" htmlFor="cost-details">
              Show Details
            </label>
          </div>
        </react_1.CardAction>
      </react_1.HStack>
      <react_1.CardContent>
        <react_1.Table>
          <react_1.Thead>
            <react_1.Tr>
              <react_1.Th className="w-[300px]"/>
              {quantities.map(function (quantity) { return (<react_1.Th key={quantity.toString()}>{quantity}</react_1.Th>); })}
            </react_1.Tr>
          </react_1.Thead>
          <react_1.Tbody>
            <react_1.Tr>
              <react_1.Td className="border-r border-border ">
                <react_1.HStack className="w-full justify-between ">
                  <span>Total Material Cost</span>
                  <Enumerable_1.Enumerable value="Material"/>
                </react_1.HStack>
              </react_1.Td>
              {quantityCosts.map(function (_a, index) {
            var quantity = _a.quantity, costs = _a.costs;
            var totalMaterialCost = costs.materialCost +
                costs.partCost +
                costs.toolCost +
                costs.consumableCost +
                costs.serviceCost;
            return (<react_1.Td key={quantity.toString()}>
                    <react_1.VStack spacing={0}>
                      <span>
                        {totalMaterialCost
                    ? formatter.format(totalMaterialCost)
                    : formatter.format(0)}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {totalMaterialCost && quantity > 0
                    ? unitCostFormatter.format(totalMaterialCost / quantity)
                    : unitCostFormatter.format(0)}
                      </span>
                    </react_1.VStack>
                  </react_1.Td>);
        })}
            </react_1.Tr>
            {detailsDisclosure.isOpen && (<>
                <react_1.Tr>
                  <react_1.Td className="border-r border-border pl-10 ">
                    <react_1.HStack className="w-full justify-between ">
                      <span className="whitespace-nowrap flex items-center justify-start gap-2">
                        Part Cost{" "}
                        <react_1.Tooltip>
                          <react_1.TooltipTrigger>
                            <lu_1.LuInfo className="w-4 h-4"/>
                          </react_1.TooltipTrigger>
                          <react_1.TooltipContent>
                            Includes bought and picked parts
                          </react_1.TooltipContent>
                        </react_1.Tooltip>
                      </span>
                      <react_1.Badge variant="secondary">
                        <components_1.MethodItemTypeIcon type="Part"/>
                      </react_1.Badge>
                    </react_1.HStack>
                  </react_1.Td>
                  {quantityCosts.map(function (_a) {
                var quantity = _a.quantity, costs = _a.costs;
                return (<react_1.Td key={quantity.toString()}>
                        <react_1.VStack spacing={0}>
                          <span>
                            {costs.partCost
                        ? formatter.format(costs.partCost)
                        : formatter.format(0)}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {costs.partCost && quantity > 0
                        ? unitCostFormatter.format(costs.partCost / quantity)
                        : unitCostFormatter.format(0)}
                          </span>
                        </react_1.VStack>
                      </react_1.Td>);
            })}
                </react_1.Tr>
                <react_1.Tr>
                  <react_1.Td className="border-r border-border pl-10 ">
                    <react_1.HStack className="w-full justify-between ">
                      <span className="whitespace-nowrap">Material Cost</span>
                      <react_1.Badge variant="secondary">
                        <components_1.MethodItemTypeIcon type="Material"/>
                      </react_1.Badge>
                    </react_1.HStack>
                  </react_1.Td>
                  {quantityCosts.map(function (_a) {
                var quantity = _a.quantity, costs = _a.costs;
                return (<react_1.Td key={quantity.toString()}>
                        <react_1.VStack spacing={0}>
                          <span>
                            {costs.materialCost
                        ? formatter.format(costs.materialCost)
                        : formatter.format(0)}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {costs.materialCost && quantity > 0
                        ? unitCostFormatter.format(costs.materialCost / quantity)
                        : unitCostFormatter.format(0)}
                          </span>
                        </react_1.VStack>
                      </react_1.Td>);
            })}
                </react_1.Tr>
                <react_1.Tr>
                  <react_1.Td className="border-r border-border pl-10 ">
                    <react_1.HStack className="w-full justify-between ">
                      <span className="whitespace-nowrap">Tooling Cost</span>
                      <react_1.Badge variant="secondary">
                        <components_1.MethodItemTypeIcon type="Tool"/>
                      </react_1.Badge>
                    </react_1.HStack>
                  </react_1.Td>
                  {quantityCosts.map(function (_a) {
                var quantity = _a.quantity, costs = _a.costs;
                return (<react_1.Td key={quantity.toString()}>
                        <react_1.VStack spacing={0}>
                          <span>
                            {costs.toolCost
                        ? formatter.format(costs.toolCost)
                        : formatter.format(0)}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {costs.toolCost && quantity > 0
                        ? unitCostFormatter.format(costs.toolCost / quantity)
                        : unitCostFormatter.format(0)}
                          </span>
                        </react_1.VStack>
                      </react_1.Td>);
            })}
                </react_1.Tr>
                <react_1.Tr>
                  <react_1.Td className="border-r border-border pl-10 ">
                    <react_1.HStack className="w-full justify-between ">
                      <span className="whitespace-nowrap">Consumable Cost</span>
                      <react_1.Badge variant="secondary">
                        <components_1.MethodItemTypeIcon type="Consumable"/>
                      </react_1.Badge>
                    </react_1.HStack>
                  </react_1.Td>
                  {quantityCosts.map(function (_a) {
                var quantity = _a.quantity, costs = _a.costs;
                return (<react_1.Td key={quantity.toString()}>
                        <react_1.VStack spacing={0}>
                          <span>
                            {costs.consumableCost
                        ? formatter.format(costs.consumableCost)
                        : formatter.format(0)}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {costs.consumableCost && quantity > 0
                        ? unitCostFormatter.format(costs.consumableCost / quantity)
                        : unitCostFormatter.format(0)}
                          </span>
                        </react_1.VStack>
                      </react_1.Td>);
            })}
                </react_1.Tr>
                {/* <Tr>
              <Td className="border-r border-border pl-10 ">
                <HStack className="w-full justify-between ">
                  <span className="whitespace-nowrap">Service Cost</span>
                  <Badge variant="secondary">
                    <MethodItemTypeIcon type="Service" />
                  </Badge>
                </HStack>
              </Td>
              {quantityCosts.map(({ quantity, costs }) => {
                return (
                  <Td key={quantity.toString()}>
                    <VStack spacing={0}>
                      <span>
                        {costs.serviceCost
                          ? formatter.format(costs.serviceCost)
                          : formatter.format(0)}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {costs.serviceCost && quantity > 0
                          ? unitCostFormatter.format(
                              costs.serviceCost / quantity
                            )
                          : unitCostFormatter.format(0)}
                      </span>
                    </VStack>
                  </Td>
                );
              })}
            </Tr> */}
              </>)}
            <react_1.Tr>
              <react_1.Td className="border-r border-border ">
                <react_1.HStack className="w-full justify-between ">
                  <span>Total Direct Cost</span>
                  <Enumerable_1.Enumerable value="Direct"/>
                </react_1.HStack>
              </react_1.Td>
              {quantityCosts.map(function (_a, index) {
            var _b, _c;
            var quantity = _a.quantity, costs = _a.costs;
            var totalDirectCost = ((_b = costs.laborCost) !== null && _b !== void 0 ? _b : 0) + ((_c = costs.machineCost) !== null && _c !== void 0 ? _c : 0);
            return (<react_1.Td key={quantity.toString()}>
                    <react_1.VStack spacing={0}>
                      <span>{formatter.format(totalDirectCost)}</span>
                      <span className="text-muted-foreground text-xs">
                        {totalDirectCost && quantity > 0
                    ? unitCostFormatter.format(totalDirectCost / quantity)
                    : unitCostFormatter.format(0)}
                      </span>
                    </react_1.VStack>
                  </react_1.Td>);
        })}
            </react_1.Tr>

            {detailsDisclosure.isOpen && (<>
                <react_1.Tr>
                  <react_1.Td className="border-r border-border pl-10 ">
                    <react_1.HStack className="w-full justify-between ">
                      <span className="whitespace-nowrap flex items-center justify-start gap-2">
                        Labor Costs
                      </span>
                      <react_1.Badge variant="secondary">
                        <components_1.TimeTypeIcon type="Labor"/>
                      </react_1.Badge>
                    </react_1.HStack>
                  </react_1.Td>
                  {quantityCosts.map(function (_a) {
                var quantity = _a.quantity, costs = _a.costs;
                return (<react_1.Td key={quantity.toString()}>
                        <react_1.VStack spacing={0}>
                          <span>
                            {costs.laborCost
                        ? formatter.format(costs.laborCost)
                        : formatter.format(0)}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {costs.laborCost && quantity > 0
                        ? unitCostFormatter.format(costs.laborCost / quantity)
                        : unitCostFormatter.format(0)}
                          </span>
                        </react_1.VStack>
                      </react_1.Td>);
            })}
                </react_1.Tr>
                <react_1.Tr>
                  <react_1.Td className="border-r border-border pl-14 ">
                    <react_1.HStack className="w-full justify-between ">
                      <span className="whitespace-nowrap flex items-center justify-start gap-2">
                        Labor Hours
                      </span>
                      <react_1.Badge variant="secondary">
                        <lu_1.LuClock />
                      </react_1.Badge>
                    </react_1.HStack>
                  </react_1.Td>
                  {quantityCosts.map(function (_a) {
                var _b, _c;
                var quantity = _a.quantity, costs = _a.costs;
                var laborHours = ((_b = costs.laborHours) !== null && _b !== void 0 ? _b : 0) + ((_c = costs.setupHours) !== null && _c !== void 0 ? _c : 0);
                return (<react_1.Td key={quantity.toString()}>
                        <react_1.VStack spacing={0}>
                          <span>{(0, utils_1.formatDurationHours)(laborHours)}</span>
                          <span className="text-muted-foreground text-xs">
                            {laborHours && quantity > 0
                        ? (0, utils_1.formatDurationHours)(laborHours / quantity)
                        : (0, utils_1.formatDurationHours)(0)}
                          </span>
                        </react_1.VStack>
                      </react_1.Td>);
            })}
                </react_1.Tr>
                <react_1.Tr>
                  <react_1.Td className="border-r border-border pl-10 ">
                    <react_1.HStack className="w-full justify-between ">
                      <span className="whitespace-nowrap flex items-center justify-start gap-2">
                        Machine Costs
                      </span>
                      <react_1.Badge variant="secondary">
                        <components_1.TimeTypeIcon type="Machine"/>
                      </react_1.Badge>
                    </react_1.HStack>
                  </react_1.Td>
                  {quantityCosts.map(function (_a) {
                var quantity = _a.quantity, costs = _a.costs;
                return (<react_1.Td key={quantity.toString()}>
                        <react_1.VStack spacing={0}>
                          <span>
                            {costs.machineCost
                        ? formatter.format(costs.machineCost)
                        : formatter.format(0)}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {costs.machineCost && quantity > 0
                        ? unitCostFormatter.format(costs.machineCost / quantity)
                        : unitCostFormatter.format(0)}
                          </span>
                        </react_1.VStack>
                      </react_1.Td>);
            })}
                </react_1.Tr>
                <react_1.Tr>
                  <react_1.Td className="border-r border-border pl-14 ">
                    <react_1.HStack className="w-full justify-between ">
                      <span className="whitespace-nowrap flex items-center justify-start gap-2">
                        Machine Hours
                      </span>
                      <react_1.Badge variant="secondary">
                        <lu_1.LuClock />
                      </react_1.Badge>
                    </react_1.HStack>
                  </react_1.Td>
                  {quantityCosts.map(function (_a) {
                var _b;
                var quantity = _a.quantity, costs = _a.costs;
                var machineHours = (_b = costs.machineHours) !== null && _b !== void 0 ? _b : 0;
                return (<react_1.Td key={quantity.toString()}>
                        <react_1.VStack spacing={0}>
                          <span>{(0, utils_1.formatDurationHours)(machineHours)}</span>
                          <span className="text-muted-foreground text-xs">
                            {machineHours && quantity > 0
                        ? (0, utils_1.formatDurationHours)(machineHours / quantity)
                        : (0, utils_1.formatDurationHours)(0)}
                          </span>
                        </react_1.VStack>
                      </react_1.Td>);
            })}
                </react_1.Tr>
              </>)}
            <react_1.Tr>
              <react_1.Td className="border-r border-border ">
                <react_1.HStack className="w-full justify-between ">
                  <span>Total Indirect Cost</span>
                  <Enumerable_1.Enumerable value="Indirect"/>
                </react_1.HStack>
              </react_1.Td>
              {quantityCosts.map(function (_a, index) {
            var quantity = _a.quantity, costs = _a.costs;
            return (<react_1.Td key={quantity.toString()}>
                    <react_1.VStack spacing={0}>
                      <span>
                        {costs.overheadCost
                    ? formatter.format(costs.overheadCost)
                    : formatter.format(0)}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {costs.overheadCost && quantity > 0
                    ? unitCostFormatter.format(costs.overheadCost / quantity)
                    : unitCostFormatter.format(0)}
                      </span>
                    </react_1.VStack>
                  </react_1.Td>);
        })}
            </react_1.Tr>
            <react_1.Tr>
              <react_1.Td className="border-r border-border ">
                <react_1.HStack className="w-full justify-between ">
                  <span>Total Outside Cost</span>
                  <Enumerable_1.Enumerable value="Outside"/>
                </react_1.HStack>
              </react_1.Td>
              {quantityCosts.map(function (_a) {
            var quantity = _a.quantity, costs = _a.costs;
            return (<react_1.Td key={quantity.toString()}>
                    <react_1.VStack spacing={0}>
                      <span>
                        {costs.outsideCost
                    ? formatter.format(costs.outsideCost)
                    : formatter.format(0)}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {costs.outsideCost && quantity > 0
                    ? unitCostFormatter.format(costs.outsideCost / quantity)
                    : unitCostFormatter.format(0)}
                      </span>
                    </react_1.VStack>
                  </react_1.Td>);
        })}
            </react_1.Tr>

            <react_1.Tr className="font-bold ">
              <react_1.Td className="border-r border-border ">Total Estimated Cost</react_1.Td>
              {quantityCosts.map(function (_a) {
            var quantity = _a.quantity, costs = _a.costs;
            var totalCost = costs.consumableCost +
                costs.laborCost +
                costs.machineCost +
                costs.materialCost +
                costs.outsideCost +
                costs.overheadCost +
                costs.partCost +
                costs.serviceCost +
                costs.toolCost;
            return (<react_1.Td key={quantity.toString()}>
                    <react_1.VStack spacing={0}>
                      <span>
                        {totalCost
                    ? formatter.format(totalCost)
                    : formatter.format(0)}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {totalCost && quantity > 0
                    ? unitCostFormatter.format(totalCost / quantity)
                    : unitCostFormatter.format(0)}
                      </span>
                    </react_1.VStack>
                  </react_1.Td>);
        })}
            </react_1.Tr>
          </react_1.Tbody>
          <react_1.Tfoot>
            {/* <Tr className="font-bold">
          <Td className="border-r border-border" />
          {quantityCosts.map(({ quantity }) => (
            <Td key={quantity} >
              <Button variant="secondary">Add</Button>
            </Td>
          ))}
        </Tr> */}
          </react_1.Tfoot>
        </react_1.Table>
      </react_1.CardContent>
    </react_1.Card>);
};
exports.default = QuoteLineCosting;
