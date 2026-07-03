import type { Database } from "@carbon/database";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Label,
  toast,
  useDisclosure,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import { useFetcher } from "react-router";
import { ConfirmDelete } from "~/components/Modals";
import { path } from "~/utils/path";

type EmployeePickup =
  Database["public"]["Tables"]["jobOperationPickup"]["Row"] & {
    employee?: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      avatarUrl: string | null;
    } | null;
  };

export function ProcessPickupDispositionDrawer({
  pickup,
  open,
  onClose,
  onSaved,
  onDeleted,
  canDelete
}: {
  pickup: EmployeePickup;
  open: boolean;
  onClose: () => void;
  onSaved: (quantity: number, notes: string | null) => void;
  onDeleted?: () => void;
  canDelete?: boolean;
}) {
  const { t } = useLingui();
  const deleteModal = useDisclosure();
  const fetcher = useFetcher<{ ok?: boolean; error?: string }>();
  const [quantity, setQuantity] = useState(Number(pickup.quantity));
  const [notes, setNotes] = useState(pickup.notes ?? "");

  useEffect(() => {
    if (!open) return;
    setQuantity(Number(pickup.quantity));
    setNotes(pickup.notes ?? "");
  }, [open, pickup]);

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (fetcher.data.error) {
      toast.error(fetcher.data.error);
      return;
    }
    if (fetcher.data.ok) {
      toast.success(t`Process pickup updated`);
      onSaved(quantity, notes || null);
      onClose();
    }
  }, [fetcher.state, fetcher.data, onSaved, onClose, t]);

  const save = () => {
    if (quantity <= 0) {
      toast.error(t`Quantity must be greater than zero`);
      return;
    }

    fetcher.submit(JSON.stringify({ quantity, notes: notes || undefined }), {
      method: "PATCH",
      action: path.to.api.pickupUpdate(pickup.id),
      encType: "application/json"
    });
  };

  const isSaving = fetcher.state !== "idle";

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen && !deleteModal.isOpen) onClose();
        }}
      >
        <DrawerContent className="flex w-full max-w-lg flex-col sm:max-w-lg">
          <DrawerHeader>
            <DrawerTitle>
              <Trans>Process Pickup</Trans>
            </DrawerTitle>
          </DrawerHeader>
          <DrawerBody className="flex w-full min-w-0 flex-col items-stretch gap-4">
            <VStack className="w-full gap-1">
              <Label>{t`Quantity`}</Label>
              <input
                type="number"
                min={1}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </VStack>
            <VStack className="w-full gap-1">
              <Label>{t`Notes`}</Label>
              <textarea
                className="min-h-[4rem] w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            {canDelete ? (
              <Button
                type="button"
                variant="destructive"
                leftIcon={<LuTrash2 />}
                onClick={deleteModal.onOpen}
                isDisabled={isSaving}
                className="sm:mr-auto"
              >
                <Trans>Delete</Trans>
              </Button>
            ) : null}
            <Button type="button" variant="secondary" onClick={onClose}>
              <Trans>Cancel</Trans>
            </Button>
            <Button
              type="button"
              onClick={save}
              isLoading={isSaving}
              isDisabled={quantity <= 0}
            >
              <Trans>Save</Trans>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {canDelete && deleteModal.isOpen ? (
        <ConfirmDelete
          action={path.to.deleteJobPickup(pickup.id)}
          isOpen
          name={t`this process pickup`}
          text={t`Are you sure you want to delete this process pickup? This action cannot be undone.`}
          onCancel={deleteModal.onClose}
          onSubmit={() => {
            deleteModal.onClose();
            onDeleted?.();
            onClose();
          }}
        />
      ) : null}
    </>
  );
}
