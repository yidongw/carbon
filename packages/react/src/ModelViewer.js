"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelViewer = ModelViewer;
var macro_1 = require("@lingui/react/macro");
var OV = require("online-3d-viewer");
var react_1 = require("react");
var react_aria_components_1 = require("react-aria-components");
// @ts-ignore -- three has no declaration file in this context
var THREE = require("three");
var hooks_1 = require("./hooks");
var IconButton_1 = require("./IconButton");
var Spinner_1 = require("./Spinner");
var Tabs_1 = require("./Tabs");
var cn_1 = require("./utils/cn");
var darkColor = "#9797a5";
var lightColor = "#8c8a8a";
function ModelViewer(_a) {
    var file = _a.file, url = _a.url, _b = _a.mode, mode = _b === void 0 ? "dark" : _b, color = _a.color, className = _a.className, _c = _a.withProperties, withProperties = _c === void 0 ? true : _c, onDataUrl = _a.onDataUrl, _d = _a.resetZoomButton, resetZoomButton = _d === void 0 ? true : _d;
    var t = (0, macro_1.useLingui)().t;
    var parentDiv = (0, react_1.useRef)(null);
    var viewerRef = (0, react_1.useRef)(null);
    var _e = (0, react_1.useState)(true), isLoading = _e[0], setIsLoading = _e[1];
    var _f = (0, react_1.useState)(false), isActive = _f[0], setIsActive = _f[1];
    var _g = (0, react_1.useState)("metric"), unitSystem = _g[0], setUnitSystem = _g[1];
    var _h = (0, react_1.useState)(null), modelInfo = _h[0], setModelInfo = _h[1];
    (0, hooks_1.useMount)(function () {
        if (file || url) {
            setIsLoading(true);
            if (viewerRef.current === null) {
                var viewer_1 = new OV.EmbeddedViewer(parentDiv.current, {
                    camera: new OV.Camera(new OV.Coord3D(100, 100, 100), new OV.Coord3D(0, 0, 0), new OV.Coord3D(0, 1, 0), 45.0),
                    backgroundColor: isDarkMode
                        ? new OV.RGBAColor(20, 22, 25, 0)
                        : new OV.RGBAColor(255, 255, 255, 0),
                    defaultColor: new OV.RGBColor(0, 125, 125),
                    onModelLoaded: function () {
                        var _a, _b;
                        if (viewerRef.current) {
                            var viewer3D = viewerRef.current.GetViewer();
                            updateColor(color !== null && color !== void 0 ? color : (isDarkMode ? darkColor : lightColor));
                            viewer3D.Resize((_a = parentDiv.current) === null || _a === void 0 ? void 0 : _a.clientWidth, (_b = parentDiv.current) === null || _b === void 0 ? void 0 : _b.clientHeight);
                            var boundingSphere = viewer3D.GetBoundingSphere(function () { return true; });
                            if (boundingSphere) {
                                var scene = viewer3D.scene;
                                var center = boundingSphere.center;
                                var radius = boundingSphere.radius;
                                var camera = viewer3D.GetCamera();
                                var direction = new OV.Coord3D(1, 1, 1);
                                var eye = new OV.Coord3D(center.x + direction.x * radius * 1.5, center.y + direction.y * radius * 1.5, center.z + direction.z * radius * 1.5);
                                camera.center = center;
                                camera.eye = eye;
                                camera.up = new OV.Coord3D(0, 1, 0);
                                viewer3D.SetCamera(camera);
                                // Add ambient light for overall illumination
                                var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
                                scene.add(ambientLight);
                                // Add directional lights for isometric highlights
                                var dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
                                dirLight1.position.set(1, 1, 1);
                                scene.add(dirLight1);
                                var dirLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
                                dirLight2.position.set(-1, 0.5, -1);
                                scene.add(dirLight2);
                                // Add subtle point light for depth
                                var pointLight = new THREE.PointLight(0xffffff, 0.3);
                                pointLight.position.set(0, radius * 2, 0);
                                scene.add(pointLight);
                                viewer3D.Render();
                            }
                            var model = void 0;
                            if (withProperties) {
                                model = viewer_1.GetModel();
                            }
                            if (model) {
                                // Calculate model dimensions and properties
                                var boundingBox = OV.GetBoundingBox(model);
                                var surfaceArea = OV.CalculateSurfaceArea(model);
                                var volume = OV.CalculateVolume(model);
                                var dimensions = {
                                    x: boundingBox.max.x - boundingBox.min.x,
                                    y: boundingBox.max.y - boundingBox.min.y,
                                    z: boundingBox.max.z - boundingBox.min.z
                                };
                                setModelInfo({
                                    surfaceArea: surfaceArea,
                                    volume: volume,
                                    dimensions: dimensions
                                });
                            }
                        }
                        setIsLoading(false);
                    }
                });
                viewerRef.current = viewer_1;
                if (file) {
                    loadFile(file);
                }
                if (url) {
                    loadUrl(url);
                }
            }
        }
        return function () {
            var _a, _b;
            if (viewerRef.current !== null && parentDiv.current !== null) {
                viewerRef.current.model = undefined;
                viewerRef.current.viewer.renderer.resetState();
                viewerRef.current.viewer.Clear();
                viewerRef.current.viewer = undefined;
                var gl = viewerRef.current.canvas.getContext("webgl2");
                (_a = gl === null || gl === void 0 ? void 0 : gl.getExtension("WEBGL_lose_context")) === null || _a === void 0 ? void 0 : _a.loseContext();
                var tempClone = viewerRef.current.canvas.cloneNode(true);
                (_b = viewerRef.current.canvas.parentNode) === null || _b === void 0 ? void 0 : _b.replaceChild(tempClone, viewerRef.current.canvas);
                parentDiv.current.removeChild(parentDiv.current.children[0]);
                viewerRef.current = null;
            }
        };
    });
    function resetZoom() {
        var _a, _b;
        if (!viewerRef.current)
            return;
        var viewer3D = viewerRef.current.GetViewer();
        viewer3D.Resize((_a = parentDiv.current) === null || _a === void 0 ? void 0 : _a.clientWidth, (_b = parentDiv.current) === null || _b === void 0 ? void 0 : _b.clientHeight);
        var boundingSphere = viewer3D.GetBoundingSphere(function (_meshUserData) { return true; });
        if (boundingSphere) {
            var center = boundingSphere.center;
            var radius = boundingSphere.radius;
            var camera = viewer3D.GetCamera();
            var direction = new OV.Coord3D(1, 1, 1);
            var eye = new OV.Coord3D(center.x + direction.x * radius * 1.5, center.y + direction.y * radius * 1.5, center.z + direction.z * radius * 1.5);
            camera.center = center;
            camera.eye = eye;
            camera.up = new OV.Coord3D(0, 1, 0);
            viewer3D.SetCamera(camera);
        }
    }
    function loadFile(file) {
        if (!file)
            return;
        if (!viewerRef.current)
            return;
        var viewer = viewerRef.current;
        if (!viewer)
            return;
        viewer.LoadModelFromFileList([file]);
    }
    function loadUrl(url) {
        if (!url)
            return;
        if (!viewerRef.current)
            return;
        var viewer = viewerRef.current;
        if (!viewer)
            return;
        viewer.LoadModelFromUrlList([url]);
    }
    function updateColor(color) {
        if (!viewerRef.current)
            return;
        var viewer3D = viewerRef.current.GetViewer();
        viewer3D.mainModel.EnumerateMeshes(function (mesh) {
            if (Array.isArray(mesh.material)) {
                mesh.material.forEach(function (material) {
                    if (material) {
                        material.color.set(color);
                    }
                });
            }
        });
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_1.useEffect)(function () {
        if (color) {
            updateColor(color);
        }
    }, [color]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_1.useEffect)(function () {
        if (!file || !viewerRef.current)
            return;
        setIsLoading(true);
        loadFile(file);
    }, [file]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_1.useEffect)(function () {
        if (!url || file || !viewerRef.current)
            return;
        setIsLoading(true);
        loadUrl(url);
    }, [url, file]);
    var isDarkMode = mode === "dark";
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_1.useEffect)(function () {
        if (viewerRef.current) {
            var viewer3D = viewerRef.current.GetViewer();
            viewer3D.SetBackgroundColor(isDarkMode
                ? new OV.RGBAColor(21, 22, 25, 255)
                : new OV.RGBAColor(255, 255, 255, 255));
            if (!color) {
                updateColor(isDarkMode ? darkColor : lightColor);
            }
        }
    }, [isDarkMode, color]);
    var locale = (0, react_aria_components_1.useLocale)().locale;
    // Conversion functions
    var mmToInches = function (mm) { return mm / 25.4; };
    var mm2ToInches2 = function (mm2) { return mm2 / (25.4 * 25.4); };
    var mm3ToInches3 = function (mm3) { return mm3 / (25.4 * 25.4 * 25.4); };
    var formatter = (0, react_1.useMemo)(function () {
        var decimals = unitSystem === "imperial" ? 6 : 2;
        return new Intl.NumberFormat(locale, {
            style: "decimal",
            minimumFractionDigits: 0,
            maximumFractionDigits: decimals
        });
    }, [locale, unitSystem]);
    // Helper functions to get converted values
    var getDisplayValue = function (value, type) {
        if (unitSystem === "imperial") {
            switch (type) {
                case "linear":
                    return mmToInches(value);
                case "area":
                    return mm2ToInches2(value);
                case "volume":
                    return mm3ToInches3(value);
            }
        }
        return value;
    };
    var getUnit = function (type) {
        if (unitSystem === "imperial") {
            switch (type) {
                case "linear":
                    return "in";
                case "area":
                    return "in²";
                case "volume":
                    return "in³";
            }
        }
        switch (type) {
            case "linear":
                return "mm";
            case "area":
                return "mm²";
            case "volume":
                return "mm³";
        }
    };
    return (<>
      <div ref={parentDiv} role={"img"} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Canvas showing the model in the 3D Viewer"], ["Canvas showing the model in the 3D Viewer"])))} onMouseLeave={function () { return setIsActive(false); }} className={(0, cn_1.cn)("h-full w-full items-center justify-center rounded-lg border border-border bg-gradient-to-bl from-card from-50% via-card to-background min-h-[400px] shadow-md dark:border-none dark:shadow-[inset_0_0.5px_0_rgb(255_255_255_/_0.08),_inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)] relative", className)}>
        {isLoading ? (<div className="absolute inset-0 bg-card h-full w-full flex items-center justify-center">
            <Spinner_1.Spinner className="w-10 h-10"/>
          </div>) : (<>
            {!isActive && (<button type="button" onClick={function () { return setIsActive(true); }} aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Click to interact with 3D model"], ["Click to interact with 3D model"])))} className="absolute inset-0 flex items-end justify-center pb-4 cursor-pointer focus:outline-none group">
                <span className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full border border-border shadow-sm transition-opacity opacity-70 group-hover:opacity-100">
                  {t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Click to interact"], ["Click to interact"])))}
                </span>
              </button>)}
            <pre id="model-viewer-canvas" aria-hidden className="sr-only"/>
            {resetZoomButton && (<IconButton_1.IconButton aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Reset zoom"], ["Reset zoom"])))} className="absolute top-2 right-2" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
                    <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
                    <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
                    <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                    <rect width="10" height="8" x="7" y="8" rx="1"/>
                  </svg>} variant="ghost" onClick={resetZoom}/>)}
            {modelInfo && withProperties && (<>
                <div className="absolute top-2 left-2 text-xs z-10 text-foreground">
                  <Tabs_1.Tabs defaultValue="dimensions" className="w-full gap-0">
                    <Tabs_1.TabsList className="grid w-full grid-cols-2 mb-1">
                      <Tabs_1.TabsTrigger className="text-xs" value="dimensions">
                        {t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Dimensions"], ["Dimensions"])))}
                      </Tabs_1.TabsTrigger>
                      <Tabs_1.TabsTrigger className="text-xs" value="properties">
                        {t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Properties"], ["Properties"])))}
                      </Tabs_1.TabsTrigger>
                    </Tabs_1.TabsList>
                    <Tabs_1.TabsContent value="properties">
                      <div className="flex flex-col gap-1 pt-1 p-2 items-start justify-start font-mono">
                        <div>
                          {t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Surface Area:"], ["Surface Area:"])))}{" "}
                          {formatter.format(getDisplayValue(modelInfo.surfaceArea, "area"))}{" "}
                          {getUnit("area")}
                        </div>
                        <div>
                          {t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Volume:"], ["Volume:"])))}{" "}
                          {formatter.format(getDisplayValue(modelInfo.volume, "volume"))}{" "}
                          {getUnit("volume")}
                        </div>
                      </div>
                    </Tabs_1.TabsContent>
                    <Tabs_1.TabsContent value="dimensions">
                      <div className="flex flex-col gap-1 pt-1 p-2 items-start justify-start font-mono">
                        <div className="flex items-center gap-1.5">
                          <div className="size-2 bg-green-500 rounded-full"/>
                          W:{" "}
                          {formatter.format(getDisplayValue(modelInfo.dimensions.x, "linear"))}{" "}
                          {getUnit("linear")}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="size-2 bg-blue-500 rounded-full"/>
                          H:{" "}
                          {formatter.format(getDisplayValue(modelInfo.dimensions.y, "linear"))}{" "}
                          {getUnit("linear")}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="size-2 bg-red-500 rounded-full"/>
                          L:{" "}
                          {formatter.format(getDisplayValue(modelInfo.dimensions.z, "linear"))}{" "}
                          {getUnit("linear")}
                        </div>
                      </div>
                    </Tabs_1.TabsContent>
                  </Tabs_1.Tabs>
                </div>
                <div className="absolute top-2 right-2 text-xs z-10 text-foreground">
                  <Tabs_1.Tabs value={unitSystem} onValueChange={function (value) {
                    return setUnitSystem(value);
                }} className="w-full gap-0">
                    <Tabs_1.TabsList className="grid w-full grid-cols-2 mb-1">
                      <Tabs_1.TabsTrigger className="text-xs" value="metric">
                        mm
                      </Tabs_1.TabsTrigger>
                      <Tabs_1.TabsTrigger className="text-xs" value="imperial">
                        in
                      </Tabs_1.TabsTrigger>
                    </Tabs_1.TabsList>
                  </Tabs_1.Tabs>
                </div>
              </>)}
          </>)}
      </div>
    </>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
