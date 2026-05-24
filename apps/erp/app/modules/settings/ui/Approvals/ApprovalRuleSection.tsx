import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  VStack
} from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import type { ReactNode } from "react";
import { LuPlus } from "react-icons/lu";
import { Link } from "react-router";
import { Empty } from "~/components";
import {
  type ApprovalDocumentType,
  type ApprovalRule,
  approvalDocumentTypesWithAmounts
} from "~/modules/shared";
import { path } from "~/utils/path";
import ApprovalRuleCard from "./ApprovalRuleCard";

type ApprovalRuleSectionProps = {
  documentType: ApprovalDocumentType;
  title: ReactNode;
  description: ReactNode;
  rules: ApprovalRule[];
  canCreate: boolean;
};

const ApprovalRuleSection = ({
  documentType,
  title,
  description,
  rules,
  canCreate
}: ApprovalRuleSectionProps) => {
  const allowsMultiple = approvalDocumentTypesWithAmounts.includes(documentType);
  const showAddButton = canCreate && (allowsMultiple || rules.length === 0);
  const activeRules = rules.filter((r) => r.id);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
          {showAddButton && (
            <Button variant="primary" leftIcon={<LuPlus />} asChild>
              <Link to={path.to.newApprovalRule(documentType)}>
                <Trans>New Rule</Trans>
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {activeRules.length === 0 ? (
          <Empty className="my-4" />
        ) : (
          <VStack spacing={3} className="items-stretch">
            {activeRules.map((rule) => (
              <ApprovalRuleCard
                key={rule.id}
                rule={rule}
                documentType={documentType}
              />
            ))}
          </VStack>
        )}
      </CardContent>
    </Card>
  );
};

export default ApprovalRuleSection;
