"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnshapeSync = void 0;
var auth_1 = require("@carbon/auth");
var ee_1 = require("@carbon/ee");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Icons_1 = require("~/components/Icons");
var hooks_1 = require("~/hooks");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var OnshapeSync = function (_a) {
    var _b, _c, _d;
    var itemId = _a.itemId, makeMethodId = _a.makeMethodId, isDisabled = _a.isDisabled;
    var t = (0, macro_1.useLingui)().t;
    var formatDateTime = (0, hooks_1.useDateFormatter)().formatDateTime;
    var _e = (0, react_2.useState)(false), initialized = _e[0], setInitialized = _e[1];
    var _f = (0, react_2.useState)(null), documentId = _f[0], setDocumentId = _f[1];
    var _g = (0, react_2.useState)(null), versionId = _g[0], setVersionId = _g[1];
    var _h = (0, react_2.useState)(null), elementId = _h[0], setElementId = _h[1];
    var _j = (0, react_2.useState)(null), lastSyncedAt = _j[0], setLastSyncedAt = _j[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    (0, react_1.useMount)(function () {
        if (!carbon) {
            react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failed to load item data"], ["Failed to load item data"]))));
            return;
        }
        carbon
            .from("externalIntegrationMapping")
            .select("metadata, lastSyncedAt")
            .eq("entityType", "item")
            .eq("entityId", itemId)
            .eq("integration", "onshape")
            .maybeSingle()
            .then(function (_a) {
            var _b, _c, _d, _e;
            var data = _a.data;
            var metadata = data === null || data === void 0 ? void 0 : data.metadata;
            setDocumentId((_b = metadata === null || metadata === void 0 ? void 0 : metadata.documentId) !== null && _b !== void 0 ? _b : null);
            setVersionId((_c = metadata === null || metadata === void 0 ? void 0 : metadata.versionId) !== null && _c !== void 0 ? _c : null);
            setElementId((_d = metadata === null || metadata === void 0 ? void 0 : metadata.elementId) !== null && _d !== void 0 ? _d : null);
            setLastSyncedAt((_e = data === null || data === void 0 ? void 0 : data.lastSyncedAt) !== null && _e !== void 0 ? _e : null);
        });
    });
    var _k = (0, react_2.useState)([]), bomRows = _k[0], setBomRows = _k[1];
    var disclosure = (0, react_1.useDisclosure)();
    var documentsFetcher = (0, react_router_1.useFetcher)({});
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (!isDisabled && initialized) {
            documentsFetcher.load(path_1.path.to.api.onShapeDocuments);
        }
    }, [initialized]);
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = documentsFetcher.data) === null || _a === void 0 ? void 0 : _a.error) {
            react_1.toast.error(documentsFetcher.data.error);
        }
    }, [documentsFetcher.data]);
    var documentOptions = (_b = (0, react_2.useMemo)(function () {
        var _a, _b, _c, _d;
        return ((_d = (_c = (_b = (_a = documentsFetcher.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.items) === null || _c === void 0 ? void 0 : _c.map(function (c) { return ({
            value: c.id,
            label: c.name
        }); }).sort(function (a, b) { return a.label.localeCompare(b.label); })) !== null && _d !== void 0 ? _d : []);
    }, [documentsFetcher.data])) !== null && _b !== void 0 ? _b : [];
    var versionsFetcher = (0, react_router_1.useFetcher)({});
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (documentId && !isDisabled && initialized) {
            versionsFetcher.load(path_1.path.to.api.onShapeVersions(documentId));
        }
    }, [documentId, initialized]);
    var versionOptions = (_c = (0, react_2.useMemo)(function () {
        var _a, _b, _c;
        return ((_c = (_b = (_a = versionsFetcher.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.map(function (c) { return ({
            value: c.id,
            label: c.name
        }); }).sort(function (a, b) { return a.label.localeCompare(b.label); })) !== null && _c !== void 0 ? _c : []);
    }, [versionsFetcher.data])) !== null && _c !== void 0 ? _c : [];
    var elementsFetcher = (0, react_router_1.useFetcher)({});
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (documentId && versionId && !isDisabled && initialized) {
            elementsFetcher.load(path_1.path.to.api.onShapeElements(documentId, versionId));
        }
    }, [documentId, versionId, initialized]);
    var elementOptions = (_d = (0, react_2.useMemo)(function () {
        var _a, _b, _c;
        return ((_c = (_b = (_a = elementsFetcher.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.map(function (c) { return ({
            value: c.id,
            label: c.name
        }); })) !== null && _c !== void 0 ? _c : []);
    }, [elementsFetcher.data])) !== null && _d !== void 0 ? _d : [];
    var isDataLoading = documentsFetcher.state === "loading" ||
        versionsFetcher.state === "loading" ||
        elementsFetcher.state === "loading";
    var isReadyForSync = documentId &&
        versionId &&
        elementId &&
        documentOptions.some(function (c) { return c.value === documentId; }) &&
        versionOptions.some(function (c) { return c.value === versionId; }) &&
        elementOptions.some(function (c) { return c.value === elementId; });
    var bomFetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if ((_b = (_a = bomFetcher.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.rows) {
            setBomRows(bomFetcher.data.data.rows);
        }
    }, [bomFetcher.data]);
    var loadBom = function () {
        if (isReadyForSync) {
            bomFetcher.load(path_1.path.to.api.onShapeBom(documentId, versionId, elementId));
        }
    };
    var upsertBomFetcher = (0, react_router_1.useFetcher)();
    var syncSubmitted = (0, react_2.useRef)(false);
    var saveBom = function () {
        syncSubmitted.current = true;
        var formData = new FormData();
        formData.append("documentId", documentId !== null && documentId !== void 0 ? documentId : "");
        formData.append("versionId", versionId !== null && versionId !== void 0 ? versionId : "");
        formData.append("elementId", elementId !== null && elementId !== void 0 ? elementId : "");
        formData.append("makeMethodId", makeMethodId);
        formData.append("rows", JSON.stringify(bomRows));
        upsertBomFetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.api.onShapeSync
        });
    };
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (syncSubmitted.current &&
            ((_a = upsertBomFetcher.data) === null || _a === void 0 ? void 0 : _a.success) &&
            bomRows.length > 0) {
            setBomRows([]);
            setLastSyncedAt(new Date().toISOString());
            syncSubmitted.current = false;
            react_1.toast.success(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["BOM synced successfully"], ["BOM synced successfully"]))));
        }
        if (((_b = upsertBomFetcher.data) === null || _b === void 0 ? void 0 : _b.success) === false) {
            react_1.toast.error(upsertBomFetcher.data.message);
        }
    }, [bomRows.length, upsertBomFetcher.data, t]);
    return (<div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col gap-2 border bg-muted/30 rounded p-2 w-full">
        <div className="flex items-center w-full justify-between">
          <ee_1.OnshapeLogo className="h-5 w-auto"/>
          <react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Show sync options"], ["Show sync options"])))} variant="ghost" size="sm" icon={<lu_1.LuChevronRight />} className={(0, react_1.cn)(disclosure.isOpen && "rotate-90")} onClick={disclosure.onToggle}/>
        </div>

        {disclosure.isOpen && (<>
            <div className="flex w-full items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">
                <macro_1.Trans>Document:</macro_1.Trans>
              </span>
              <div className="w-[180px]">
                <react_1.Combobox isLoading={documentsFetcher.state === "loading"} options={documentOptions} disabled={isDisabled} onChange={function (value) {
                setVersionId(null);
                setElementId(null);
                setDocumentId(value);
            }} size="sm" className="text-xs" value={documentId !== null && documentId !== void 0 ? documentId : undefined}/>
              </div>
            </div>

            <div className="flex w-full items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">
                <macro_1.Trans>Version:</macro_1.Trans>
              </span>
              <div className="w-[180px]">
                <react_1.Combobox isLoading={versionsFetcher.state === "loading"} disabled={isDisabled} options={versionOptions} onChange={function (value) {
                setVersionId(value);
                setElementId(null);
            }} size="sm" className="text-xs" value={versionId !== null && versionId !== void 0 ? versionId : undefined}/>
              </div>
            </div>

            <div className="flex w-full items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">
                <macro_1.Trans>Assembly:</macro_1.Trans>
              </span>
              <div className="w-[180px]">
                <react_1.Combobox isLoading={elementsFetcher.state === "loading"} options={elementOptions} disabled={isDisabled} onChange={function (value) {
                setElementId(value);
            }} size="sm" className="text-xs" value={elementId !== null && elementId !== void 0 ? elementId : undefined}/>
              </div>
            </div>

            {/* <div className="flex w-full items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">Sync mode:</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="manual"
                    name="syncMode"
                    value="manual"
                    className="h-4 w-4 text-primary border-muted-foreground focus:ring-primary"
                    defaultChecked={mode === "manual"}
                  />
                  <label htmlFor="manual" className="text-xs cursor-pointer">
                    Manual
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="automatic"
                    name="syncMode"
                    value="automatic"
                    className="h-4 w-4 text-primary border-muted-foreground focus:ring-primary"
                    defaultChecked={mode === "automatic"}
                  />
                  <label htmlFor="automatic" className="text-xs cursor-pointer">
                    Automatic
                  </label>
                </div>
              </div>
            </div> */}
          </>)}
        <div className="flex items-center gap-1 w-full justify-between">
          {lastSyncedAt ? (<span className="text-xs text-muted-foreground">
              <macro_1.Trans>Last synced: {formatDateTime(lastSyncedAt)}</macro_1.Trans>
            </span>) : (<div />)}
          {isDataLoading ? (<react_1.Spinner className="size-3"/>) : (<div className="flex gap-2">
              {!initialized && (<react_1.Button variant="secondary" size="sm" onClick={function () { return setInitialized(true); }} isDisabled={isDisabled}>
                  <macro_1.Trans>Fetch</macro_1.Trans>
                </react_1.Button>)}
              <react_1.Button variant={bomRows.length > 0 ? "secondary" : "primary"} isLoading={bomFetcher.state !== "idle"} isDisabled={isDisabled ||
                !isReadyForSync ||
                bomFetcher.state !== "idle" ||
                !initialized} size="sm" onClick={loadBom}>
                {bomRows.length > 0 ? (<macro_1.Trans>Refresh</macro_1.Trans>) : (<macro_1.Trans>Sync</macro_1.Trans>)}
              </react_1.Button>
            </div>)}
        </div>
      </div>
      {bomRows.length > 0 && (<div className="flex flex-col gap-2 border bg-muted/30 rounded p-2 w-full">
          <react_1.HStack className="w-full justify-between">
            <span className="text-xs text-muted-foreground font-light mb-1">
              <macro_1.Trans>Bill of Materials</macro_1.Trans>
            </span>
            <react_1.Button size="sm" onClick={saveBom} isLoading={upsertBomFetcher.state !== "idle"} isDisabled={isDisabled || upsertBomFetcher.state !== "idle"}>
              <macro_1.Trans>Save</macro_1.Trans>
            </react_1.Button>
          </react_1.HStack>

          <div className="max-h-60 overflow-y-auto flex flex-col">
            {bomRows.map(function (row) {
                var isSynced = row.id;
                var partId = row.readableIdWithRevision || row.name;
                return (<div key={row.index} className={(0, react_1.cn)("flex min-h-8 cursor-pointer items-center overflow-hidden rounded-sm pr-2 w-full gap-1 hover:bg-accent")} style={{
                        paddingLeft: "".concat(row.level * 12, "px")
                    }}>
                  <div className={(0, react_1.cn)("flex items-center gap-2 font-medium text-sm w-full")}>
                    <react_1.DropdownMenu>
                      <react_1.DropdownMenuTrigger>
                        <components_1.MethodIcon type={row.defaultMethodType}/>
                      </react_1.DropdownMenuTrigger>
                      <react_1.DropdownMenuContent>
                        <react_1.DropdownMenuRadioGroup value={row.defaultMethodType} onValueChange={function (value) {
                        setBomRows(function (prevRows) {
                            return prevRows.map(function (r) {
                                return r.index === row.index
                                    ? __assign(__assign({}, r), { defaultMethodType: value }) : r;
                            });
                        });
                    }}>
                          {shared_1.methodType.map(function (type) { return (<react_1.DropdownMenuRadioItem key={type} value={type}>
                              <react_1.DropdownMenuIcon icon={<components_1.MethodIcon type={type}/>}/>
                              {type}
                            </react_1.DropdownMenuRadioItem>); })}
                        </react_1.DropdownMenuRadioGroup>
                      </react_1.DropdownMenuContent>
                    </react_1.DropdownMenu>

                    {partId ? (<span className="line-clamp-1">
                        {row.readableIdWithRevision || row.name}
                      </span>) : (<react_1.Status color="red">
                        <macro_1.Trans>No part ID</macro_1.Trans>
                      </react_1.Status>)}
                    {!isSynced && partId && <react_1.PulsingDot className="mt-0.5"/>}
                    {/** biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration */}
                    {row.data["State"] && (
                    // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
                    <Icons_1.OnshapeStatus status={row.data["State"]}/>)}
                  </div>
                  <react_1.HStack spacing={1}>
                    <react_1.Badge className="text-xs" variant="outline">
                      {row.quantity}
                    </react_1.Badge>
                  </react_1.HStack>
                </div>);
            })}
          </div>
        </div>)}
    </div>);
};
exports.OnshapeSync = OnshapeSync;
var templateObject_1, templateObject_2, templateObject_3;
