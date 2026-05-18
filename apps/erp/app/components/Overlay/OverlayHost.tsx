import { useOverlay } from "./OverlayProvider";
import { RegisteredOverlay } from "./RegisteredOverlay";

export function OverlayHost() {
  const { instances, closeOverlay } = useOverlay();

  return (
    <>
      {instances.map((instance, index) => (
        <RegisteredOverlay
          key={instance.id}
          instance={instance}
          stackIndex={index}
          onClose={closeOverlay}
        />
      ))}
    </>
  );
}
