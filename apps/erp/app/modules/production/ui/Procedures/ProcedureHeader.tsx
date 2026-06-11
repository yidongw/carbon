import {
  Badge,
  Button,
  Copy,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HStack,
  IconButton,
  useDisclosure,
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { PostgrestResponse } from "@supabase/supabase-js";
import { Suspense, useEffect } from "react";
import {
  LuChevronDown,
  LuCirclePlus,
  LuEllipsisVertical,
  LuGitPullRequestArrow,
  LuPanelLeft,
  LuPanelRight,
  LuTrash
} from "react-icons/lu";
import { createPortal } from "react-dom";
import { Await, useNavigate, useParams } from "react-router";
import { usePanels, useTopbarLeft } from "~/components/Layout";
import ConfirmDelete from "~/components/Modals/ConfirmDelete";
import { usePermissions, useRouteData } from "~/hooks";
import { path } from "~/utils/path";
import type { Procedure } from "../../types";
import ProcedureForm from "./ProcedureForm";
import ProcedureStatus from "./ProcedureStatus";

function ProcedureTopbarLeft({ id }: { id: string }) {
  const { t } = useLingui();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const routeData = useRouteData<{
    procedure: Procedure;
    versions: PostgrestResponse<Procedure>;
  }>(path.to.procedure(id));

  const newVersionDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
  useEffect(() => {
    newVersionDisclosure.onClose();
  }, [id]);

  return (
    <>
      <HStack className="items-center -ml-2" spacing={1}>
          <span className="font-semibold text-sm">
            {routeData?.procedure?.name}
          </span>
          <Badge variant="outline">V{routeData?.procedure?.version}</Badge>
          <ProcedureStatus status={routeData?.procedure?.status} />
          <Copy text={routeData?.procedure?.name ?? ""} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                aria-label={t`More options`}
                icon={<LuEllipsisVertical />}
                variant="secondary"
                size="sm"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                disabled={
                  !permissions.can("delete", "production") ||
                  !permissions.is("employee")
                }
                destructive
                onClick={deleteDisclosure.onOpen}
              >
                <DropdownMenuIcon icon={<LuTrash />} />
                <Trans>Delete Procedure</Trans>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Suspense fallback={null}>
            <Await resolve={routeData?.versions}>
              {(versions) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      leftIcon={<LuGitPullRequestArrow />}
                      rightIcon={<LuChevronDown />}
                    >
                      <Trans>Versions</Trans>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {permissions.can("create", "production") && (
                      <>
                        <DropdownMenuItem onClick={newVersionDisclosure.onOpen}>
                          <DropdownMenuIcon icon={<LuCirclePlus />} />
                          <Trans>New Version</Trans>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuRadioGroup
                      value={id}
                      onValueChange={(value) =>
                        navigate(path.to.procedure(value))
                      }
                    >
                      {routeData?.procedure && (
                        <DropdownMenuRadioItem
                          key={routeData.procedure.id}
                          value={routeData.procedure.id}
                          className="flex items-center justify-between gap-2"
                        >
                          <Badge variant="outline">
                            V{routeData.procedure.version}
                          </Badge>
                          <span>{routeData.procedure.name}</span>
                          <ProcedureStatus status={routeData.procedure.status} />
                        </DropdownMenuRadioItem>
                      )}
                      {versions?.data
                        ?.filter((v) => v.id !== id)
                        .map((version) => (
                          <DropdownMenuRadioItem
                            key={version.id}
                            value={version.id}
                            className="flex items-center justify-between gap-2"
                          >
                            <Badge variant="outline">V{version.version}</Badge>
                            <span>{version.name}</span>
                            <ProcedureStatus status={version.status} />
                          </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </Await>
          </Suspense>
      </HStack>

      {newVersionDisclosure.isOpen && (
        <ProcedureForm
          type="copy"
          initialValues={{
            name: routeData?.procedure?.name ?? "",
            version: (routeData?.procedure?.version ?? 0) + 1,
            processId: routeData?.procedure?.processId ?? "",
            content: JSON.stringify(routeData?.procedure?.content) ?? "",
            copyFromId: routeData?.procedure?.id ?? ""
          }}
          open={newVersionDisclosure.isOpen}
          onClose={newVersionDisclosure.onClose}
        />
      )}
      {deleteDisclosure.isOpen && (
        <ConfirmDelete
          action={path.to.deleteProcedure(id)}
          isOpen={deleteDisclosure.isOpen}
          name={routeData?.procedure?.name ?? "procedure"}
          text={t`Are you sure you want to delete ${routeData?.procedure?.name}? This cannot be undone.`}
          onCancel={() => {
            deleteDisclosure.onClose();
          }}
          onSubmit={() => {
            deleteDisclosure.onClose();
          }}
        />
      )}
    </>
  );
}

const ProcedureHeader = () => {
  const { id } = useParams();
  if (!id) throw new Error("id not found");

  const { leftSlotEl } = useTopbarLeft();
  const { t } = useLingui();
  const { hasExplorer, toggleExplorer, toggleProperties } = usePanels();

  return (
    <>
      {leftSlotEl && createPortal(<ProcedureTopbarLeft id={id} />, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        {hasExplorer && (
          <IconButton
            aria-label={t`Toggle Explorer`}
            icon={<LuPanelLeft />}
            onClick={toggleExplorer}
            variant="ghost"
          />
        )}
        <div className="flex-1" />
        <IconButton
          aria-label={t`Toggle Properties`}
          icon={<LuPanelRight />}
          onClick={toggleProperties}
          variant="ghost"
        />
      </div>
    </>
  );
};

export default ProcedureHeader;
