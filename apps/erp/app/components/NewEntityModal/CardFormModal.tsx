import { cn, Modal, ModalBody, ModalContent } from "@carbon/react";
import type { PropsWithChildren } from "react";
import {
  newEntityRouteModalBodyClassName,
  newEntityRouteModalCloseButtonClassName,
  newEntityRouteModalContentClassName
} from "~/utils/newEntityRouteModalClassNames";

type CardFormModalProps = PropsWithChildren<{
  contentClassName?: string;
  onClose: () => void;
}>;

export function CardFormModal({
  children,
  contentClassName,
  onClose
}: CardFormModalProps) {
  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <ModalContent
        className={cn(newEntityRouteModalContentClassName, contentClassName)}
        closeButtonClassName={newEntityRouteModalCloseButtonClassName}
      >
        <ModalBody className={newEntityRouteModalBodyClassName}>
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
