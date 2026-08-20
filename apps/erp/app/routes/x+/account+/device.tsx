import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HStack,
  Label,
  NumberField,
  NumberInput,
  Switch,
  toast,
  VStack
} from "@carbon/react";
import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { useEffect, useState } from "react";
import {
  readScreensaverMinutes,
  writeScreensaverMinutes
} from "~/components/Screensaver";
import type { Handle } from "~/utils/handle";
import {
  DEFAULT_DENSITY,
  DEFAULT_THRESHOLD,
  readLabelDensity,
  readLabelThreshold,
  writeLabelDensity,
  writeLabelThreshold
} from "~/utils/labelBitmap";
import { path } from "~/utils/path";

export const handle: Handle = {
  breadcrumb: msg`This Device`,
  to: path.to.accountDevice
};

// Per-device settings stored only in this browser's localStorage — never sent
// to the server, so each tablet/terminal keeps its own values.
export default function DeviceSettingsRoute() {
  const [enabled, setEnabled] = useState(false);
  const [minutes, setMinutes] = useState(3);
  const [density, setDensity] = useState(DEFAULT_DENSITY);
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);

  // Load current per-device values on mount (localStorage is client-only).
  useEffect(() => {
    const stored = readScreensaverMinutes();
    if (stored === null) {
      setEnabled(false);
      setMinutes(3);
    } else {
      setEnabled(stored > 0);
      setMinutes(stored > 0 ? stored : 3);
    }
    setDensity(readLabelDensity());
    setThreshold(readLabelThreshold());
  }, []);

  const savePrinter = () => {
    writeLabelDensity(density);
    writeLabelThreshold(threshold);
    toast.success("已保存到本设备");
  };

  const resetPrinter = () => {
    setDensity(DEFAULT_DENSITY);
    setThreshold(DEFAULT_THRESHOLD);
    writeLabelDensity(DEFAULT_DENSITY);
    writeLabelThreshold(DEFAULT_THRESHOLD);
    toast.success("已恢复默认");
  };

  const save = () => {
    writeScreensaverMinutes(enabled ? Math.max(1, minutes) : 0);
    toast.success("已保存到本设备");
  };

  const reset = () => {
    writeScreensaverMinutes(null);
    setEnabled(false);
    setMinutes(3);
    toast.success("已恢复默认（仅 kiosk 模式）");
  };

  return (
    <VStack spacing={4} className="w-full py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            <Trans>Screensaver</Trans>
          </CardTitle>
          <CardDescription>
            <Trans>
              Only applies to this device. After the display is idle it shows
              the current module's dashboard; touch to return. By default the
              screensaver runs only in kiosk mode (the native app, or a URL with
              ?kiosk=1).
            </Trans>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VStack spacing={4}>
            <HStack className="w-full justify-between">
              <Label htmlFor="screensaver-enabled">
                <Trans>Enable screensaver on this device</Trans>
              </Label>
              <Switch
                id="screensaver-enabled"
                checked={enabled}
                onCheckedChange={setEnabled}
              />
            </HStack>

            {enabled && (
              <VStack spacing={1} className="w-full max-w-[220px]">
                <Label htmlFor="screensaver-minutes">
                  <Trans>Idle timeout (minutes)</Trans>
                </Label>
                <NumberField
                  value={minutes}
                  minValue={1}
                  maxValue={120}
                  onChange={(v) => setMinutes(Number.isFinite(v) ? v : 3)}
                >
                  <NumberInput id="screensaver-minutes" className="w-full" />
                </NumberField>
              </VStack>
            )}

            <HStack spacing={2}>
              <Button onClick={save}>
                <Trans>Save</Trans>
              </Button>
              <Button variant="secondary" onClick={reset}>
                <Trans>Reset to default</Trans>
              </Button>
            </HStack>
          </VStack>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Trans>Bluetooth label printer</Trans>
          </CardTitle>
          <CardDescription>
            <Trans>
              Only applies to this device — the darkness and stroke weight used
              when printing labels to the Bluetooth label printer connected to
              this terminal.
            </Trans>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VStack spacing={4}>
            <VStack spacing={1} className="w-full max-w-[220px]">
              <Label htmlFor="bt-density">
                <Trans>Print darkness (density)</Trans>
              </Label>
              <NumberField
                value={density}
                minValue={1}
                maxValue={15}
                onChange={(v) =>
                  setDensity(Number.isFinite(v) ? v : DEFAULT_DENSITY)
                }
              >
                <NumberInput id="bt-density" className="w-full" />
              </NumberField>
              <span className="text-[11px] text-muted-foreground">
                <Trans>Higher = darker. Default 11.</Trans>
              </span>
            </VStack>

            <VStack spacing={1} className="w-full max-w-[220px]">
              <Label htmlFor="bt-threshold">
                <Trans>Stroke thinness (threshold)</Trans>
              </Label>
              <NumberField
                value={threshold}
                minValue={60}
                maxValue={240}
                onChange={(v) =>
                  setThreshold(Number.isFinite(v) ? v : DEFAULT_THRESHOLD)
                }
              >
                <NumberInput id="bt-threshold" className="w-full" />
              </NumberField>
              <span className="text-[11px] text-muted-foreground">
                <Trans>
                  Lower = thinner strokes (dense Chinese stays legible). Default
                  150.
                </Trans>
              </span>
            </VStack>

            <HStack spacing={2}>
              <Button onClick={savePrinter}>
                <Trans>Save</Trans>
              </Button>
              <Button variant="secondary" onClick={resetPrinter}>
                <Trans>Reset to default</Trans>
              </Button>
            </HStack>
          </VStack>
        </CardContent>
      </Card>
    </VStack>
  );
}
