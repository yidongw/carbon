import { toast } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import { parseBundleScan, QRScanner } from "~/components/QRScanner";
import { path } from "~/utils/path";

/**
 * The scan-first entry shared by the report and pickup pages: point the camera
 * at a bundle ticket and jump straight into that flow (report / pickup) for the
 * bundle's current operation.
 */
export function BundleScanPanel({ intent }: { intent: "report" | "pickup" }) {
  const { t } = useLingui();
  const navigate = useNavigate();

  const handleDecode = useCallback(
    (text: string) => {
      const id = parseBundleScan(text);
      if (!id) {
        toast.error(t`That QR code isn't a bundle ticket`);
        return;
      }
      navigate(`${path.to.bundle(id)}?intent=${intent}`);
    },
    [navigate, intent, t]
  );

  return (
    <div className="p-4 md:p-6 w-full">
      <div className="mx-auto flex max-w-md flex-col gap-4">
        <QRScanner onDecode={handleDecode} />
      </div>
    </div>
  );
}
