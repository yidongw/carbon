"use strict";
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FOOTER_BLOCK_ID = void 0;
exports.useEditorStore = useEditorStore;
exports.DocumentTemplateProvider = DocumentTemplateProvider;
exports.useDocumentTemplate = useDocumentTemplate;
var template_1 = require("@carbon/documents/template");
var sortable_1 = require("@dnd-kit/sortable");
var nanoid_1 = require("nanoid");
var react_1 = require("react");
var react_router_1 = require("react-router");
var zustand_1 = require("zustand");
var shallow_1 = require("zustand/react/shallow");
/**
 * Synthetic selection id for the page Footer. The footer is page chrome, not a
 * flow block, so it isn't in `blocks` — but it gets a row in the list and a
 * config panel keyed off this id.
 */
exports.FOOTER_BLOCK_ID = "__footer__";
function snapshot(s) {
    return {
        blocks: s.blocks,
        theme: s.theme,
        settings: s.settings,
        headerSectionId: s.headerSectionId,
        footerSectionId: s.footerSectionId,
        headerConfig: s.headerConfig
    };
}
/** Live header config seeded from the referenced header section's stored config. */
function seedHeaderConfig(sections, headerSectionId) {
    var _a;
    var id = headerSectionId !== null && headerSectionId !== void 0 ? headerSectionId : template_1.BUILT_IN_SECTION_IDS.header;
    var stored = (_a = sections.find(function (s) { return s.id === id; })) === null || _a === void 0 ? void 0 : _a.config;
    return __assign(__assign({}, template_1.DEFAULT_HEADER_OPTIONS), (stored !== null && stored !== void 0 ? stored : {}));
}
function createBlock(type) {
    var id = (0, nanoid_1.nanoid)();
    switch (type) {
        case "richText":
            return { id: id, type: type, visible: true, content: { type: "doc", content: [] } };
        case "keyValue":
            return { id: id, type: type, visible: true, rows: [] };
        case "spacer":
            return { id: id, type: type, visible: true, variant: "space" };
    }
}
function createEditorStore(props) {
    var initial = {
        blocks: props.initialBlocks,
        theme: props.initialTheme,
        settings: props.initialSettings,
        headerSectionId: props.initialHeaderSectionId,
        footerSectionId: props.initialFooterSectionId,
        headerConfig: seedHeaderConfig(props.sections, props.initialHeaderSectionId)
    };
    return (0, zustand_1.createStore)(function (set, get) {
        var _a;
        return (__assign(__assign({}, initial), { baseline: snapshot(initial), documentType: props.documentType, sections: props.sections, customFields: props.customFields, termsSeed: props.termsSeed, previewEntities: props.previewEntities, hasWatermark: props.hasWatermark, selectedId: null, previewId: null, previewNonce: 0, labelSizeId: (_a = props.initialLabelSizeId) !== null && _a !== void 0 ? _a : "label4x2", select: function (id) { return set({ selectedId: id }); }, setPreviewId: function (id) { return set({ previewId: id }); }, refreshPreview: function () { return set(function (s) { return ({ previewNonce: s.previewNonce + 1 }); }); }, setLabelSizeId: function (id) { return set({ labelSizeId: id }); }, addBlock: function (type) {
                var block = createBlock(type);
                set(function (s) { return ({ blocks: __spreadArray(__spreadArray([], s.blocks, true), [block], false), selectedId: block.id }); });
            }, addSharedBlock: function (sectionId) {
                var block = {
                    id: (0, nanoid_1.nanoid)(),
                    type: "shared",
                    visible: true,
                    sectionId: sectionId
                };
                set(function (s) { return ({ blocks: __spreadArray(__spreadArray([], s.blocks, true), [block], false), selectedId: block.id }); });
            }, addCustomFieldBlock: function (fieldId, label) {
                var block = {
                    id: (0, nanoid_1.nanoid)(),
                    type: "customField",
                    visible: true,
                    fieldId: fieldId,
                    label: label
                };
                set(function (s) { return ({ blocks: __spreadArray(__spreadArray([], s.blocks, true), [block], false), selectedId: block.id }); });
            }, addField: function (withLabel) {
                var block = __assign({ id: (0, nanoid_1.nanoid)(), type: "field", visible: true, value: "" }, (withLabel ? { label: "" } : {}));
                set(function (s) { return ({ blocks: __spreadArray(__spreadArray([], s.blocks, true), [block], false), selectedId: block.id }); });
            }, removeBlock: function (id) {
                return set(function (s) { return ({
                    blocks: s.blocks.filter(function (b) { return b.id !== id; }),
                    selectedId: s.selectedId === id ? null : s.selectedId
                }); });
            }, toggleVisible: function (id) {
                return set(function (s) { return ({
                    blocks: s.blocks.map(function (b) {
                        return b.id === id ? __assign(__assign({}, b), { visible: !b.visible }) : b;
                    })
                }); });
            }, reorder: function (activeId, overId) {
                return set(function (s) {
                    var from = s.blocks.findIndex(function (b) { return b.id === activeId; });
                    var to = s.blocks.findIndex(function (b) { return b.id === overId; });
                    if (from === -1 || to === -1)
                        return {};
                    return { blocks: (0, sortable_1.arrayMove)(s.blocks, from, to) };
                });
            }, updateBlock: function (id, patch) {
                return set(function (s) { return ({
                    blocks: s.blocks.map(function (b) {
                        return b.id === id ? __assign(__assign({}, b), patch) : b;
                    })
                }); });
            }, setThemeColor: function (key, value) {
                return set(function (s) {
                    var _a;
                    return ({ theme: __assign(__assign({}, s.theme), (_a = {}, _a[key] = value, _a)) });
                });
            }, setSetting: function (key, value) {
                return set(function (s) {
                    var _a;
                    return ({ settings: __assign(__assign({}, s.settings), (_a = {}, _a[key] = value, _a)) });
                });
            }, setHeaderSection: function (sectionId) { return set({ headerSectionId: sectionId }); }, setFooterSection: function (sectionId) { return set({ footerSectionId: sectionId }); }, setHeaderConfig: function (patch) {
                return set(function (s) { return ({ headerConfig: __assign(__assign({}, s.headerConfig), patch) }); });
            }, reset: function () {
                var baseline = get().baseline;
                set(__assign(__assign({}, baseline), { selectedId: null }));
            }, rebaseline: function () { return set(function (s) { return ({ baseline: snapshot(s) }); }); } }));
    });
}
/** True when the editable state diverges from the last-saved baseline. */
function selectIsDirty(s) {
    return JSON.stringify(snapshot(s)) !== JSON.stringify(s.baseline);
}
var EditorContext = (0, react_1.createContext)(null);
function useEditorContext() {
    var ctx = (0, react_1.useContext)(EditorContext);
    if (!ctx) {
        throw new Error("Document template hooks must be used within a DocumentTemplateProvider");
    }
    return ctx;
}
/** Subscribe to a slice of the editor store (preferred for new code). */
function useEditorStore(selector) {
    return (0, zustand_1.useStore)(useEditorContext().store, selector);
}
function DocumentTemplateProvider(_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    var storeRef = (0, react_1.useRef)(null);
    if (!storeRef.current)
        storeRef.current = createEditorStore(props);
    var store = storeRef.current;
    var fetcher = (0, react_router_1.useFetcher)();
    var isSaving = fetcher.state !== "idle";
    var savedRef = (0, react_1.useRef)(false);
    var save = (0, react_1.useCallback)(function () {
        var _a, _b;
        var s = store.getState();
        var formData = new FormData();
        formData.append("documentType", s.documentType);
        formData.append("blocks", JSON.stringify(s.blocks));
        formData.append("theme", JSON.stringify(s.theme));
        formData.append("settings", JSON.stringify(s.settings));
        formData.append("headerSectionId", (_a = s.headerSectionId) !== null && _a !== void 0 ? _a : "");
        formData.append("footerSectionId", (_b = s.footerSectionId) !== null && _b !== void 0 ? _b : "");
        formData.append("headerConfig", JSON.stringify(s.headerConfig));
        savedRef.current = true;
        fetcher.submit(formData, { method: "post", action: props.actionPath });
    }, [store, fetcher, props.actionPath]);
    // Once our save resolves, clear the dirty baseline to the just-saved state.
    (0, react_1.useEffect)(function () {
        var _a;
        if (savedRef.current && fetcher.state === "idle" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success)) {
            savedRef.current = false;
            store.getState().rebaseline();
        }
    }, [fetcher.data, fetcher.state, store]);
    var value = (0, react_1.useMemo)(function () { return ({ store: store, save: save, isSaving: isSaving }); }, [store, save, isSaving]);
    return (<EditorContext.Provider value={value}>{children}</EditorContext.Provider>);
}
/**
 * Back-compat accessor returning the full editor API in one object. New code
 * should prefer `useEditorStore(selector)` to subscribe to a narrow slice.
 */
function useDocumentTemplate() {
    var _a = useEditorContext(), save = _a.save, isSaving = _a.isSaving;
    var state = useEditorStore((0, shallow_1.useShallow)(function (s) { return ({
        documentType: s.documentType,
        blocks: s.blocks,
        theme: s.theme,
        settings: s.settings,
        headerSectionId: s.headerSectionId,
        footerSectionId: s.footerSectionId,
        headerConfig: s.headerConfig,
        sections: s.sections,
        customFields: s.customFields,
        termsSeed: s.termsSeed,
        previewEntities: s.previewEntities,
        hasWatermark: s.hasWatermark,
        previewId: s.previewId,
        selectedId: s.selectedId,
        select: s.select,
        setPreviewId: s.setPreviewId,
        addBlock: s.addBlock,
        addSharedBlock: s.addSharedBlock,
        addCustomFieldBlock: s.addCustomFieldBlock,
        addField: s.addField,
        removeBlock: s.removeBlock,
        toggleVisible: s.toggleVisible,
        reorder: s.reorder,
        updateBlock: s.updateBlock,
        setThemeColor: s.setThemeColor,
        setSetting: s.setSetting,
        setHeaderSection: s.setHeaderSection,
        setFooterSection: s.setFooterSection,
        setHeaderConfig: s.setHeaderConfig,
        reset: s.reset,
        isDirty: selectIsDirty(s)
    }); }));
    return __assign(__assign({}, state), { save: save, isSaving: isSaving });
}
