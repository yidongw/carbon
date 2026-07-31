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

Open the project:

```bash
cd mobile
npx cap open ios      # opens ios/App/App.xcodeproj in Xcode
```

Then in Xcode:

1. **Add the SDK + plugin files to the App target.** In the Project Navigator,
   right-click the `App` group → *Add Files to "App"…* → select
   `App/PrinterSDK`, `App/XprinterPlugin.swift`, `App/XprinterPlugin.m`,
   `App/App-Bridging-Header.h`. Check *Add to target: App*. When Xcode offers to
   create an Objective-C bridging header, say **No** (we ship our own).

2. **Build Settings** (target App):
   - *Objective-C Bridging Header* → `App/App-Bridging-Header.h`
   - *Header Search Paths* → add `$(SRCROOT)/App/PrinterSDK/Headers`
   - *Library Search Paths* → add `$(SRCROOT)/App/PrinterSDK`
   - *Other Linker Flags* → add `-ObjC`

3. **Build Phases → Link Binary With Libraries** → `+` →
   - `libPrinterSDK.a` (choose *Add Other…* if not listed)
   - `CoreBluetooth.framework`

4. **Signing & Capabilities** → select your **Team**; set the **Bundle
   Identifier** (default `xyz.jilio.erp` — must be unique to your account).

5. **Run on a real device.** The vendored `.a` is `arm64 + x86_64`; it will *not*
   link in the Apple-Silicon **simulator**. Use a physical iPhone/iPad.

On first launch iOS will ask for Bluetooth permission. Then: scan → pick the
printer (sorted by signal) → print.

> Note: `XprinterPlugin.swift` was authored against the SDK headers without a
> compiler in the loop. If Xcode flags a delegate method signature (Swift's
> import of the Objective-C `XBLEManagerDelegate`), accept its fix-it — the
> selectors are correct, only the Swift spelling may differ.

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
