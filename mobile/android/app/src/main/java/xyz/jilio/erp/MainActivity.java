package xyz.jilio.erp;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(XprinterPlugin.class);
        super.onCreate(savedInstanceState);
        // Serve /assets/* from files bundled in the APK (see
        // OfflineAssetsWebViewClient) so the heavy JS/CSS don't download over a
        // weak network on kiosk displays.
        getBridge().setWebViewClient(new OfflineAssetsWebViewClient(getBridge()));
    }
}
