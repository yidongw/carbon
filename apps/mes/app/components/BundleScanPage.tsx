import { localizeVariantAttributeLabel } from "@carbon/database/style-reference";
import { Combobox, Heading, toast } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import { path } from "~/utils/path";
import { MesTopbar } from "./MesTopbar";
import { parseBundleScan, QRScanner } from "./QRScanner";

export type ReleasedBundle = {
  id: string;
  jobReadableId: string | null;
  attributeLabel: string | null;
  quantity: number | null;
};

function bundleAttrLabel(
  b: {
    attributeLabel?: string | null;
  },
  locale?: string
): string {
  const raw = b.attributeLabel?.trim() || "";
  return localizeVariantAttributeLabel(raw, locale) || raw;
}

type BundleScanPageProps = {
  intent: "pickup" | "report";
  title: string;
  description: string;
  releasedBundles: ReleasedBundle[];
};

export function BundleScanPage({
  intent,
  title,
  description,
  releasedBundles
}: BundleScanPageProps) {
  const { t, i18n } = useLingui();
  const navigate = useNavigate();

  const goToBundle = useCallback(
    (id: string) => {
      navigate(`${path.to.bundle(id)}?intent=${intent}`);
    },
    [navigate, intent]
  );

  const handleDecode = useCallback(
    (text: string) => {
      const id = parseBundleScan(text);
      if (!id) {
        toast.error(t`That QR code isn't a bundle ticket`);
        return;
      }
      goToBundle(id);
    },
    [goToBundle, t]
  );

  const options = useMemo(
    () =>
      releasedBundles.map((b) => ({
        value: b.id,
        label: [b.jobReadableId, bundleAttrLabel(b, i18n.locale)]
          .filter(Boolean)
          .join(" — ")
      })),
    [releasedBundles, i18n.locale]
  );

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <MesTopbar />
      <div className="p-4 md:p-6 w-full flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-md flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Heading size="h3">{title}</Heading>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <QRScanner onDecode={handleDecode} />

          <div className="flex flex-col gap-1 border-t border-border pt-4">
            <span className="text-sm font-medium">
              {t`Can't scan? Select a released bundle`}
            </span>
            <Combobox
              options={options}
              value=""
              onChange={(value) => {
                if (value) goToBundle(value);
              }}
              placeholder={t`Search bundles…`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
