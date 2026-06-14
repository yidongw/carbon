import { Heading, ScrollArea, VStack } from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import { memo, useMemo } from "react";
import { LuPlus } from "react-icons/lu";
import { Link } from "react-router";
import { Empty } from "~/components";
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

    // A rule's ceiling is the next-higher tier's minimum (null for the top tier).
    const nextTierFloor = useMemo(() => {
      const floors = Array.from(
        new Set(poRules.map((r) => r.lowerBoundAmount ?? 0))
      ).sort((a, b) => a - b);
      return (lowerBoundAmount: number): number | null =>
        floors.find((f) => f > lowerBoundAmount) ?? null;
    }, [poRules]);

    return (
      <ScrollArea className="h-full w-full">
        <div className="py-12 px-4 max-w-[60rem] mx-auto">
          <div className="mb-8">
            <Heading size="h2">
              <Trans>Approval Rules</Trans>
            </Heading>
          </div>

          <VStack spacing={4}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      <Trans>Purchase Orders</Trans>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      <Trans>
                        Require approval for purchase orders based on amount
                        thresholds
                      </Trans>
                    </CardDescription>
                  </div>
                  {canCreate && (
                    <Button variant="primary" leftIcon={<LuPlus />} asChild>
                      <Link to={path.to.newApprovalRule("purchaseOrder")}>
                        <Trans>New Rule</Trans>
                      </Link>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {poRules.length === 0 ? (
                  <Empty className="my-4" />
                ) : (
                  <VStack spacing={3} className="items-stretch">
                    {poRules
                      .filter((r) => r.id)
                      .map((rule) => (
                        <ApprovalRuleCard
                          key={rule.id}
                          rule={rule}
                          documentType="purchaseOrder"
                          upperBound={nextTierFloor(rule.lowerBoundAmount ?? 0)}
                        />
                      ))}
                  </VStack>
                )}
              </CardContent>
            </Card>

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
