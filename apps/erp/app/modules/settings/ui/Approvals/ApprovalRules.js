"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var hooks_1 = require("~/hooks");
var ApprovalRuleSection_1 = require("./ApprovalRuleSection");
var ApprovalRules = (0, react_2.memo)(function (_a) {
    var poRules = _a.poRules, qdRules = _a.qdRules, supplierRules = _a.supplierRules, productionPayRules = _a.productionPayRules;
    var permissions = (0, hooks_1.usePermissions)();
    var canCreate = permissions.can("update", "settings");
    return (<react_1.ScrollArea className="h-full w-full">
        <div className="py-12 px-4 max-w-[60rem] mx-auto">
          <div className="mb-8">
            <react_1.Heading size="h2">
              <macro_1.Trans>Approval Rules</macro_1.Trans>
            </react_1.Heading>
          </div>

          <react_1.VStack spacing={4}>
            <ApprovalRuleSection_1.default documentType="purchaseOrder" title={<macro_1.Trans>Purchase Orders</macro_1.Trans>} description={<macro_1.Trans>
                  Require approval for purchase orders based on amount
                  thresholds
                </macro_1.Trans>} rules={poRules} canCreate={canCreate}/>

            <ApprovalRuleSection_1.default documentType="qualityDocument" title={<macro_1.Trans>Quality Documents</macro_1.Trans>} description={<macro_1.Trans>
                  Require approval for quality documents in your workflow
                </macro_1.Trans>} rules={qdRules} canCreate={canCreate}/>

            <ApprovalRuleSection_1.default documentType="supplier" title={<macro_1.Trans>Suppliers</macro_1.Trans>} description={<macro_1.Trans>
                  Require approval before suppliers can be set to Active
                </macro_1.Trans>} rules={supplierRules} canCreate={canCreate}/>

            <ApprovalRuleSection_1.default documentType="productionQuantityReport" title={<macro_1.Trans>Quantity Review</macro_1.Trans>} description={<macro_1.Trans>
                  Require approval for reported production quantities before
                  salary periods are assigned
                </macro_1.Trans>} rules={productionPayRules} canCreate={canCreate}/>
          </react_1.VStack>
        </div>
      </react_1.ScrollArea>);
});
ApprovalRules.displayName = "ApprovalRules";
exports.default = ApprovalRules;
