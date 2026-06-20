import { Heading, ScrollArea, VStack } from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import { memo } from "react";
import { usePermissions } from "~/hooks";
import { type ApprovalRule } from "~/modules/shared";
import ApprovalRuleSection from "./ApprovalRuleSection";

type ApprovalRulesProps = {
  poRules: ApprovalRule[];
  qdRules: ApprovalRule[];
  supplierRules: ApprovalRule[];
  productionPayRules: ApprovalRule[];
};

const ApprovalRules = memo(
  ({ poRules, qdRules, supplierRules, productionPayRules }: ApprovalRulesProps) => {
    const permissions = usePermissions();
    const canCreate = permissions.can("update", "settings");

    return (
      <ScrollArea className="h-full w-full">
        <div className="py-12 px-4 max-w-[60rem] mx-auto">
          <div className="mb-8">
            <Heading size="h2">
              <Trans>Approval Rules</Trans>
            </Heading>
          </div>

          <VStack spacing={4}>
            <ApprovalRuleSection
              documentType="purchaseOrder"
              title={<Trans>Purchase Orders</Trans>}
              description={
                <Trans>
                  Require approval for purchase orders based on amount
                  thresholds
                </Trans>
              }
              rules={poRules}
              canCreate={canCreate}
            />

            <ApprovalRuleSection
              documentType="qualityDocument"
              title={<Trans>Quality Documents</Trans>}
              description={
                <Trans>
                  Require approval for quality documents in your workflow
                </Trans>
              }
              rules={qdRules}
              canCreate={canCreate}
            />

            <ApprovalRuleSection
              documentType="supplier"
              title={<Trans>Suppliers</Trans>}
              description={
                <Trans>
                  Require approval before suppliers can be set to Active
                </Trans>
              }
              rules={supplierRules}
              canCreate={canCreate}
            />

            <ApprovalRuleSection
              documentType="productionQuantityReport"
              title={<Trans>Quantity Review</Trans>}
              description={
                <Trans>
                  Require approval for reported production quantities before
                  salary periods are assigned
                </Trans>
              }
              rules={productionPayRules}
              canCreate={canCreate}
            />
          </VStack>
        </div>
      </ScrollArea>
    );
  }
);

ApprovalRules.displayName = "ApprovalRules";
export default ApprovalRules;
