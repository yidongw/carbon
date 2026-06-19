import { Button, HStack, VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import { LuTriangleAlert, LuArrowLeft } from "react-icons/lu";
import { useNavigate, useSearchParams } from "react-router";
import type { Handle } from "~/utils/handle";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`Deleted`
};

export default function DeletedPage() {
  const { t } = useLingui();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "item";

  const getMessage = () => {
    switch (type) {
      case "job":
        return t`The job you're looking for has been deleted.`;
      case "part":
      case "material":
      case "tool":
      case "consumable":
      case "item":
        return t`The item you're looking for has been deleted.`;
      case "customer":
        return t`The customer you're looking for has been deleted.`;
      case "supplier":
        return t`The supplier you're looking for has been deleted.`;
      default:
        return t`The resource you're looking for has been deleted.`;
    }
  };

  const getListPath = () => {
    switch (type) {
      case "job":
        return path.to.jobs;
      case "part":
      case "material":
      case "tool":
      case "consumable":
      case "item":
        return path.to.items;
      case "customer":
        return path.to.customers;
      case "supplier":
        return path.to.suppliers;
      default:
        return "/x";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12">
      <VStack spacing={6} className="max-w-md w-full px-4">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/20 mx-auto">
          <LuTriangleAlert className="w-10 h-10 text-orange-600 dark:text-orange-400" />
        </div>

        <VStack spacing={2} className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">
            <Trans>Item Deleted</Trans>
          </h1>
          <p className="text-muted-foreground">
            {getMessage()}
          </p>
        </VStack>

        <HStack spacing={3} className="w-full justify-center">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            leftIcon={<LuArrowLeft />}
          >
            <Trans>Go Back</Trans>
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(getListPath())}
          >
            <Trans>View List</Trans>
          </Button>
        </HStack>
      </VStack>
    </div>
  );
}
