//
//  XprinterPlugin.swift
//  Capacitor bridge over the Xprinter iOS SDK (BLE transport).
//
//  The web app composes printer commands (TSPL for the label printer, or
//  ESC/POS) as raw bytes and hands them to `printRaw` as base64. This plugin
//  owns only the BLE transport + connection lifecycle via `XBLEManager`, which
//  already knows the printer's GATT write characteristic and handles packetized
//  writes — so we don't have to rediscover characteristics by hand.
//
//  JS surface (window.Capacitor.Plugins.Xprinter):
//    isAvailable() -> { available }
//    startScan()   -> emits "deviceFound" { id, name, rssi }
//    stopScan()
//    connect({ id }) / disconnect()
//    getStatus() -> { code, message }
//    printRaw({ base64 }) -> { ok }
//

import Foundation
import Capacitor
import CoreBluetooth

@objc(XprinterPlugin)
public class XprinterPlugin: CAPPlugin, XBLEManagerDelegate {

    // Discovered peripherals keyed by their CoreBluetooth identifier (the same
    // opaque id we hand back to JS so it can ask us to connect to one).
    private var peripherals: [String: CBPeripheral] = [:]
    private var connectCall: CAPPluginCall?

    private var ble: XBLEManager { XBLEManager.sharedInstance() }

    // MARK: - Availability

    @objc func isAvailable(_ call: CAPPluginCall) {
        call.resolve(["available": true])
    }

    // MARK: - Scanning

    @objc func startScan(_ call: CAPPluginCall) {
        ble.delegate = self
        peripherals.removeAll()
        ble.startScan()
        call.resolve()
    }

    @objc func stopScan(_ call: CAPPluginCall) {
        ble.stopScan()
        call.resolve()
    }

    // MARK: - Connection

    @objc func connect(_ call: CAPPluginCall) {
        guard let id = call.getString("id"),
              let peripheral = peripherals[id] else {
            call.reject("Unknown device id. Scan first, then connect using an id from a deviceFound event.")
            return
        }
        ble.delegate = self
        connectCall = call
        call.keepAlive = true
        ble.connectDevice(peripheral)
    }

    @objc func disconnect(_ call: CAPPluginCall) {
        ble.disconnectRootPeripheral()
        call.resolve()
    }

    // MARK: - Status

    @objc func getStatus(_ call: CAPPluginCall) {
        guard ble.isConnected else {
            call.reject("Not connected")
            return
        }
        ble.labelPrinterStatus { code, message in
            call.resolve(["code": Int(code), "message": message ?? ""])
        }
    }

    // MARK: - Printing

    @objc func printRaw(_ call: CAPPluginCall) {
        guard ble.isConnected else {
            call.reject("Not connected")
            return
        }
        guard let base64 = call.getString("base64"),
              let data = Data(base64Encoded: base64) else {
            call.reject("printRaw requires a base64 string of the command bytes.")
            return
        }
        let packageSize = call.getInt("packageSize") ?? 512
        ble.send(data, withPackageSize: UInt(packageSize)) { success, _, _, _, error in
            if success {
                call.resolve(["ok": true])
            } else {
                call.reject(error?.localizedDescription ?? "Failed to send data")
            }
        }
    }

    // MARK: - XBLEManagerDelegate

    public func xbleDiscover(_ peripheral: CBPeripheral!,
                             advertisementData: [AnyHashable: Any]!,
                             rssi RSSI: NSNumber!) {
        guard let peripheral = peripheral else { return }
        let id = peripheral.identifier.uuidString
        peripherals[id] = peripheral
        let advName = advertisementData?[CBAdvertisementDataLocalNameKey] as? String
        notifyListeners("deviceFound", data: [
            "id": id,
            "name": peripheral.name ?? advName ?? "",
            "rssi": RSSI?.intValue ?? 0
        ])
    }

    public func xbleConnect(_ peripheral: CBPeripheral!) {
        connectCall?.resolve(["ok": true, "name": peripheral?.name ?? ""])
        connectCall?.keepAlive = false
        connectCall = nil
    }

    public func xbleFail(toConnect peripheral: CBPeripheral!, error: Error!) {
        connectCall?.reject(error?.localizedDescription ?? "Failed to connect")
        connectCall?.keepAlive = false
        connectCall = nil
    }

    public func xbleDisconnectPeripheral(_ peripheral: CBPeripheral!, error: Error!) {
        notifyListeners("disconnected", data: [
            "id": peripheral?.identifier.uuidString ?? ""
        ])
    }

    public func xbleCentralManagerDidUpdateState(_ state: Int) {
        notifyListeners("bluetoothState", data: ["state": state])
    }
}
