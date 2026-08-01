package xyz.jilio.erp;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanResult;
import android.content.Context;
import android.os.Build;
import android.util.Base64;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.PermissionState;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * Android side of the "Xprinter" plugin — same JS interface as the iOS one
 * (startScan/stopScan/connect/disconnect/getStatus/printRaw + deviceFound
 * events), so the web layer (apps/erp utils/nativePrinter.ts) needs no changes.
 *
 * Uses generic BLE: scan, connect, auto-detect a writable characteristic, and
 * write the raw command bytes (TSPL composed in JS) in MTU-sized chunks.
 */
@CapacitorPlugin(
    name = "Xprinter",
    permissions = {
        @Permission(
            alias = "bluetooth",
            strings = {
                Manifest.permission.BLUETOOTH_SCAN,
                Manifest.permission.BLUETOOTH_CONNECT
            }
        ),
        @Permission(
            alias = "location",
            strings = { Manifest.permission.ACCESS_FINE_LOCATION }
        )
    }
)
public class XprinterPlugin extends Plugin {

    private BluetoothAdapter adapter;
    private BluetoothLeScanner scanner;
    private ScanCallback scanCallback;
    private final Map<String, BluetoothDevice> devices = new HashMap<>();

    private BluetoothGatt gatt;
    private BluetoothGattCharacteristic writeChar;
    private int chunkSize = 20; // default BLE payload until MTU is negotiated

    private PluginCall connectCall;
    private PluginCall printCall;
    private ArrayDeque<byte[]> writeQueue;

    @Override
    public void load() {
        BluetoothManager bm =
            (BluetoothManager) getContext().getSystemService(Context.BLUETOOTH_SERVICE);
        if (bm != null) adapter = bm.getAdapter();
    }

    @PluginMethod
    public void isAvailable(PluginCall call) {
        JSObject r = new JSObject();
        r.put("available", adapter != null);
        call.resolve(r);
    }

    private boolean hasBlePerms() {
        if (Build.VERSION.SDK_INT >= 31) {
            return getPermissionState("bluetooth") == PermissionState.GRANTED;
        }
        return getPermissionState("location") == PermissionState.GRANTED;
    }

    @PluginMethod
    public void startScan(PluginCall call) {
        if (!hasBlePerms()) {
            String alias = Build.VERSION.SDK_INT >= 31 ? "bluetooth" : "location";
            requestPermissionForAlias(alias, call, "permsCallback");
            return;
        }
        doScan(call);
    }

    @PermissionCallback
    private void permsCallback(PluginCall call) {
        if (hasBlePerms()) doScan(call);
        else call.reject("Bluetooth permission denied");
    }

    private void doScan(PluginCall call) {
        if (adapter == null) { call.reject("No Bluetooth adapter"); return; }
        scanner = adapter.getBluetoothLeScanner();
        if (scanner == null) { call.reject("Bluetooth is off"); return; }
        devices.clear();
        scanCallback = new ScanCallback() {
            @Override
            public void onScanResult(int callbackType, ScanResult result) {
                BluetoothDevice d = result.getDevice();
                String id = d.getAddress();
                devices.put(id, d);
                String name = null;
                try { name = d.getName(); } catch (SecurityException ignored) {}
                if (name == null && result.getScanRecord() != null) {
                    name = result.getScanRecord().getDeviceName();
                }
                JSObject ev = new JSObject();
                ev.put("id", id);
                ev.put("name", name == null ? "" : name);
                ev.put("rssi", result.getRssi());
                notifyListeners("deviceFound", ev);
            }
        };
        try {
            scanner.startScan(scanCallback);
            call.resolve();
        } catch (SecurityException e) {
            call.reject("Scan failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void stopScan(PluginCall call) {
        try {
            if (scanner != null && scanCallback != null) scanner.stopScan(scanCallback);
        } catch (Exception ignored) {}
        call.resolve();
    }

    @PluginMethod
    public void connect(PluginCall call) {
        String id = call.getString("id");
        BluetoothDevice d = id == null ? null : devices.get(id);
        if (d == null) { call.reject("Unknown device id. Scan first."); return; }
        connectCall = call;
        call.setKeepAlive(true);
        try {
            gatt = d.connectGatt(getContext(), false, gattCallback, BluetoothDevice.TRANSPORT_LE);
        } catch (SecurityException e) {
            call.reject("Connect failed: " + e.getMessage());
        }
    }

    private final BluetoothGattCallback gattCallback = new BluetoothGattCallback() {
        @Override
        public void onConnectionStateChange(BluetoothGatt g, int status, int newState) {
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                try { g.requestMtu(512); } catch (SecurityException ignored) {}
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                writeChar = null;
                JSObject ev = new JSObject();
                ev.put("id", g.getDevice().getAddress());
                notifyListeners("disconnected", ev);
                if (connectCall != null) {
                    connectCall.reject("Disconnected");
                    connectCall.setKeepAlive(false);
                    connectCall = null;
                }
            }
        }

        @Override
        public void onMtuChanged(BluetoothGatt g, int mtu, int status) {
            chunkSize = Math.max(20, mtu - 3);
            try { g.discoverServices(); } catch (SecurityException ignored) {}
        }

        @Override
        public void onServicesDiscovered(BluetoothGatt g, int status) {
            writeChar = null;
            for (BluetoothGattService s : g.getServices()) {
                for (BluetoothGattCharacteristic c : s.getCharacteristics()) {
                    int p = c.getProperties();
                    boolean writable =
                        (p & BluetoothGattCharacteristic.PROPERTY_WRITE) != 0
                        || (p & BluetoothGattCharacteristic.PROPERTY_WRITE_NO_RESPONSE) != 0;
                    if (writable) { writeChar = c; break; }
                }
                if (writeChar != null) break;
            }
            if (connectCall != null) {
                if (writeChar != null) {
                    JSObject r = new JSObject();
                    r.put("ok", true);
                    String nm = null;
                    try { nm = g.getDevice().getName(); } catch (SecurityException ignored) {}
                    r.put("name", nm == null ? "" : nm);
                    connectCall.resolve(r);
                } else {
                    connectCall.reject("No writable characteristic on this device");
                }
                connectCall.setKeepAlive(false);
                connectCall = null;
            }
        }

        @Override
        public void onCharacteristicWrite(BluetoothGatt g, BluetoothGattCharacteristic c, int status) {
            writeNextChunk(status);
        }
    };

    @PluginMethod
    public void disconnect(PluginCall call) {
        try { if (gatt != null) gatt.disconnect(); } catch (Exception ignored) {}
        call.resolve();
    }

    @PluginMethod
    public void getStatus(PluginCall call) {
        JSObject r = new JSObject();
        boolean ready = gatt != null && writeChar != null;
        r.put("code", ready ? 0 : -1);
        r.put("message", ready ? "connected" : "not connected");
        call.resolve(r);
    }

    @PluginMethod
    public void printRaw(PluginCall call) {
        if (gatt == null || writeChar == null) { call.reject("Not connected"); return; }
        String b64 = call.getString("base64");
        if (b64 == null) { call.reject("printRaw requires a base64 string"); return; }
        byte[] data;
        try {
            data = Base64.decode(b64, Base64.DEFAULT);
        } catch (IllegalArgumentException e) {
            call.reject("Invalid base64");
            return;
        }
        writeQueue = new ArrayDeque<>();
        for (int i = 0; i < data.length; i += chunkSize) {
            int end = Math.min(i + chunkSize, data.length);
            writeQueue.add(Arrays.copyOfRange(data, i, end));
        }
        printCall = call;
        writeNextChunk(BluetoothGatt.GATT_SUCCESS);
    }

    private void writeNextChunk(int status) {
        if (printCall == null) return;
        if (status != BluetoothGatt.GATT_SUCCESS) {
            printCall.reject("Write failed, status " + status);
            printCall = null;
            return;
        }
        if (writeQueue == null || writeQueue.isEmpty()) {
            JSObject r = new JSObject();
            r.put("ok", true);
            printCall.resolve(r);
            printCall = null;
            return;
        }
        byte[] next = writeQueue.poll();
        int writeType =
            (writeChar.getProperties() & BluetoothGattCharacteristic.PROPERTY_WRITE_NO_RESPONSE) != 0
                ? BluetoothGattCharacteristic.WRITE_TYPE_NO_RESPONSE
                : BluetoothGattCharacteristic.WRITE_TYPE_DEFAULT;
        try {
            if (Build.VERSION.SDK_INT >= 33) {
                gatt.writeCharacteristic(writeChar, next, writeType);
            } else {
                writeChar.setWriteType(writeType);
                writeChar.setValue(next);
                gatt.writeCharacteristic(writeChar);
            }
        } catch (SecurityException e) {
            printCall.reject("Write failed: " + e.getMessage());
            printCall = null;
        }
    }
}
