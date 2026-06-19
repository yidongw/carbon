import { Button, HStack, VStack } from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { LuTriangleAlert, LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router";
import type { Handle } from "~/utils/handle";

export const handle: Handle = {
  breadcrumb: msg`Deleted`
};

export default function DeletedPage() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <VStack spacing={6} className="max-w-2xl px-4">
        <HStack spacing={6} className="items-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20 flex-shrink-0">
            <LuTriangleAlert className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <p className="text-lg text-foreground">
            <Trans>What you're looking for has been deleted.</Trans>
          </p>
        </HStack>

        <div className="flex justify-start w-full pl-[88px]">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            leftIcon={<LuArrowLeft />}
          >
            <Trans>Go Back</Trans>
          </Button>
        </div>
      </VStack>
    </div>
  );
}
