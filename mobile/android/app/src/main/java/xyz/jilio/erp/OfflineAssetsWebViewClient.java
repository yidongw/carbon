package xyz.jilio.erp;

import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;

import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeWebViewClient;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * Serves the hosted app's /assets/* files (content-hashed, immutable build
 * JS/CSS/fonts) from copies bundled inside the APK, instead of downloading them
 * over the (often weak) network. Only /assets/* GETs that have a bundled copy
 * are intercepted; everything else — HTML documents, auth, data/loaders — falls
 * through to normal Capacitor handling (the remote server). Result: login and
 * pages render from local JS/CSS, only small HTML + data go over the network.
 *
 * The bundled files live in android assets under webassets/assets/… and are
 * fetched from production by scripts/fetch-web-assets.sh (so their hashes match
 * exactly). If a requested asset isn't bundled (e.g. after a web redeploy adds
 * new chunks), it simply loads from the network as before.
 */
public class OfflineAssetsWebViewClient extends BridgeWebViewClient {

    private final Bridge bridge;

    public OfflineAssetsWebViewClient(Bridge bridge) {
        super(bridge);
        this.bridge = bridge;
    }

    @Override
    public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
        try {
            String path = request.getUrl().getPath();
            if (path != null
                && path.startsWith("/assets/")
                && "GET".equalsIgnoreCase(request.getMethod())) {
                String assetPath = "webassets" + path; // webassets/assets/<file>
                try {
                    InputStream is = bridge.getContext().getAssets().open(assetPath);
                    Map<String, String> headers = new HashMap<>();
                    headers.put("Access-Control-Allow-Origin", "*");
                    headers.put("Cache-Control", "public, max-age=31536000, immutable");
                    return new WebResourceResponse(
                        mimeFor(path),
                        isText(path) ? "utf-8" : null,
                        200,
                        "OK",
                        headers,
                        is
                    );
                } catch (IOException notBundled) {
                    // Not bundled -> fall through to the network below.
                }
            }
        } catch (Exception ignored) {
            // Any failure -> default handling.
        }
        return super.shouldInterceptRequest(view, request);
    }

    private boolean isText(String p) {
        return p.endsWith(".js") || p.endsWith(".mjs") || p.endsWith(".css")
            || p.endsWith(".svg") || p.endsWith(".json");
    }

    private String mimeFor(String p) {
        if (p.endsWith(".js") || p.endsWith(".mjs")) return "application/javascript";
        if (p.endsWith(".css")) return "text/css";
        if (p.endsWith(".woff2")) return "font/woff2";
        if (p.endsWith(".woff")) return "font/woff";
        if (p.endsWith(".ttf")) return "font/ttf";
        if (p.endsWith(".svg")) return "image/svg+xml";
        if (p.endsWith(".png")) return "image/png";
        if (p.endsWith(".json")) return "application/json";
        return "application/octet-stream";
    }
}
