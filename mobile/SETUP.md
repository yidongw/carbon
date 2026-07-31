# Jilio Mobile (Capacitor iOS shell + Xprinter BLE printing)

A thin native iOS app that loads the hosted Carbon/Jilio ERP in a WKWebView and
adds a native Bluetooth printing bridge for Xprinter label printers (e.g.
XP-D361B). Printing from plain iOS Safari is impossible for this printer (it is
Bluetooth-only, no WiFi/AirPrint, and Web Bluetooth is not supported on iOS), so
the ERP is wrapped in a native shell that talks to the printer via the official
Xprinter iOS SDK (BLE).

## What's already wired up (in this repo)

- `capacitor.config.json` — `appId`, `appName`, and `server.url` (the hosted ERP).
- `ios/` — generated Capacitor iOS project.
- `ios/App/App/PrinterSDK/` — vendored Xprinter SDK (`libPrinterSDK.a` + headers).
- `ios/App/App/XprinterPlugin.swift` + `.m` — the Capacitor plugin (BLE scan /
  connect / print) built on `XBLEManager`.
- `ios/App/App/App-Bridging-Header.h` — exposes the SDK to Swift.
- `ios/App/App/Info.plist` — Bluetooth usage descriptions added.

The web side (scan/connect/print UI + TSPL label composer) lives in the Carbon
repo under `apps/erp` and is served from `server.url`, so it updates over the air
without rebuilding the app.

## Prerequisites

1. **Full Xcode** (from the Mac App Store) — Command Line Tools alone cannot
   build an iOS app.
2. **Apple Developer account** ($99/yr) — for signing + TestFlight.

## One-time Xcode wiring (the parts that must be done in the GUI)

**The Xcode project is already fully wired and compile-verified.** The SDK,
plugin, bridging header, search paths, `-ObjC`, and the `libPrinterSDK.a` +
`CoreBluetooth.framework` links are committed in `project.pbxproj`. A device
build (`xcodebuild -scheme App -sdk iphoneos`, no signing) succeeds. So you do
**not** need to add files or change build settings by hand.

The only things left require your Apple Developer account:

```bash
cd mobile
npx cap open ios      # opens ios/App/App.xcodeproj in Xcode
```

1. **Signing & Capabilities** → select your **Team**. Bundle id defaults to
   `xyz.jilio.erp` (change if it collides with an existing app id on your
   account).
2. **Run on a real device.** The vendored `.a` is `arm64 + x86_64` and will
   *not* link in the Apple-Silicon **simulator** — use a physical iPhone/iPad.

On first launch iOS asks for Bluetooth permission. Then in `/print-test`
(inside the app): scan → pick the printer (sorted by signal) → print a test
label.

### Command-line build note

Build with `-scheme App`, not `-target App` — the latter fails with
`CapApp-SPM.modulemap not found` because it skips generating the Capacitor SPM
module maps. Xcode's GUI Run button always uses the scheme, so this only bites
CLI builds.

## Distribute via TestFlight

1. Xcode → *Product → Archive*.
2. *Distribute App → App Store Connect → Upload*.
3. In App Store Connect → TestFlight, add internal testers (up to 100, no
   review, instant). Builds last 90 days.

## Updating

- **Web/UI changes** ship automatically (the app loads `server.url`).
- **Native/printer changes** require a new Xcode build + TestFlight upload.
- After editing `capacitor.config.json` or adding Capacitor plugins:
  `npx cap sync ios`.
