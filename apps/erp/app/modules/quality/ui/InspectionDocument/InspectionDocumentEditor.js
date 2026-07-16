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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.default = InspectionDocumentEditor;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var react_konva_1 = require("react-konva");
var react_pdf_1 = require("react-pdf");
require("react-pdf/dist/Page/AnnotationLayer.css");
require("react-pdf/dist/Page/TextLayer.css");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Editable_1 = require("~/components/Editable");
var Grid_1 = require("~/components/Grid");
var Icons_1 = require("~/components/Icons");
var hooks_1 = require("~/hooks");
var shared_models_1 = require("~/modules/shared/shared.models");
var path_1 = require("~/utils/path");
var cropInspectionAnchorToPng_1 = require("./cropInspectionAnchorToPng");
var exportInspectionDocumentPdfWithOverlays_1 = require("./exportInspectionDocumentPdfWithOverlays");
function toPercent(px, total) {
    return (px / total) * 100;
}
var EDITOR_SPLITTER_H = 8;
var MIN_PDF_PANE_PX = 160;
var ANNOTATION_DIALOG_WIDTH_PX = 220;
var ANNOTATION_DIALOG_HEIGHT_PX = 140;
var ANNOTATION_DIALOG_GAP_PX = 8;
var SELECTOR_RESIZE_HANDLE_PX = 10;
var SELECTOR_MIN_SIZE_PX = 12;
var ANNOTATION_RESIZE_HANDLE_PX = 10;
var ANNOTATION_MIN_SIZE_PX = 12;
/** When the features table is expanded it keeps at least half the editor stack; PDF height is capped accordingly. */
function clampPdfPaneHeight(pdfPx, stackH, featuresExpanded) {
    if (!featuresExpanded || stackH <= EDITOR_SPLITTER_H + MIN_PDF_PANE_PX) {
        return Math.max(MIN_PDF_PANE_PX, pdfPx);
    }
    var minFeatures = stackH * 0.5;
    var maxPdf = Math.max(MIN_PDF_PANE_PX, stackH - EDITOR_SPLITTER_H - minFeatures);
    return Math.min(maxPdf, Math.max(MIN_PDF_PANE_PX, pdfPx));
}
function getAnnotationDialogPosition(args) {
    var renderedWidth = args.renderedWidth, overlayHeight = args.overlayHeight, totalPagesStage = args.totalPagesStage, pageNumber = args.pageNumber, x = args.x, y = args.y, width = args.width, height = args.height;
    var annLeft = (x / 100) * renderedWidth;
    var annTop = ((pageNumber - 1) / totalPagesStage) * overlayHeight +
        (y / 100) * (overlayHeight / totalPagesStage);
    var annWidth = (width / 100) * renderedWidth;
    var annHeight = (height / 100) * (overlayHeight / totalPagesStage);
    var annRight = annLeft + annWidth;
    var annBottom = annTop + annHeight;
    var maxLeft = Math.max(8, renderedWidth - ANNOTATION_DIALOG_WIDTH_PX);
    var maxTop = Math.max(8, overlayHeight - ANNOTATION_DIALOG_HEIGHT_PX);
    var rightCandidate = annRight + ANNOTATION_DIALOG_GAP_PX;
    var leftCandidate = annLeft - ANNOTATION_DIALOG_WIDTH_PX - ANNOTATION_DIALOG_GAP_PX;
    var left = rightCandidate;
    if (rightCandidate <= maxLeft) {
        left = rightCandidate;
    }
    else if (leftCandidate >= 8) {
        left = leftCandidate;
    }
    else {
        left = Math.max(8, Math.min(maxLeft, rightCandidate));
    }
    var top = Math.max(8, Math.min(maxTop, annTop));
    var dialogRight = left + ANNOTATION_DIALOG_WIDTH_PX;
    var dialogBottom = top + ANNOTATION_DIALOG_HEIGHT_PX;
    var overlapsAnnotation = left < annRight &&
        dialogRight > annLeft &&
        top < annBottom &&
        dialogBottom > annTop;
    if (overlapsAnnotation) {
        var belowCandidate = annBottom + ANNOTATION_DIALOG_GAP_PX;
        var aboveCandidate = annTop - ANNOTATION_DIALOG_HEIGHT_PX - ANNOTATION_DIALOG_GAP_PX;
        if (belowCandidate <= maxTop) {
            top = belowCandidate;
        }
        else if (aboveCandidate >= 8) {
            top = aboveCandidate;
        }
        else {
            top = Math.max(8, Math.min(maxTop, belowCandidate));
        }
    }
    return { left: left, top: top };
}
function cursorForSelectorResizeHandle(handle) {
    switch (handle) {
        case "n":
        case "s":
            return "ns-resize";
        case "e":
        case "w":
            return "ew-resize";
        case "ne":
        case "sw":
            return "nesw-resize";
        case "nw":
        case "se":
            return "nwse-resize";
        default:
            return "pointer";
    }
}
/** Callout / anchor stroke — matches reference (orange border, hollow fill). */
var CALLOUT_STROKE = "#f97316";
var CALLOUT_TEXT = "#171717";
/**
 * Konva 9 does not apply the `cursor` prop to the DOM; Transformer only sets
 * `stage.content.style.cursor` manually. Use these helpers for hover/drag cursors.
 */
function konvaContentFromStageRef(stageRef) {
    var _a;
    var st = stageRef.current;
    return (_a = st === null || st === void 0 ? void 0 : st.content) !== null && _a !== void 0 ? _a : null;
}
/** Liang–Barsky: clip segment (x0,y0)→(x1,y1) to axis-aligned rect; returns [0,1] params or null. */
function liangBarskySegmentRect(x0, y0, x1, y1, minX, minY, maxX, maxY) {
    var dx = x1 - x0;
    var dy = y1 - y0;
    var u0 = 0;
    var u1 = 1;
    var p = [-dx, dx, -dy, dy];
    var q = [x0 - minX, maxX - x0, y0 - minY, maxY - y0];
    for (var i = 0; i < 4; i += 1) {
        if (Math.abs(p[i]) < 1e-12) {
            if (q[i] < 0)
                return null;
        }
        else {
            var r = q[i] / p[i];
            if (p[i] < 0) {
                u0 = Math.max(u0, r);
            }
            else {
                u1 = Math.min(u1, r);
            }
            if (u0 > u1)
                return null;
        }
    }
    return { u0: u0, u1: u1 };
}
/**
 * Visible connector from balloon edge → toward anchor, stopping before the anchor rect interior.
 * u is linear param from B (0) to A (1); balloon occupies u ∈ [0, r/L).
 */
function clippedBalloonToAnchorLine(bx, by, radiusPx, ax, ay, rect) {
    var L = Math.hypot(ax - bx, ay - by);
    if (L < 1e-6)
        return null;
    var epsU = Math.max(1e-4, 2 / L);
    var uBalloonExit = Math.min(1 - epsU, radiusPx / L + epsU);
    var x = rect.x, y = rect.y, w = rect.w, h = rect.h;
    var hit = liangBarskySegmentRect(bx, by, ax, ay, x, y, x + w, y + h);
    var uEnd = 1 - epsU;
    if (hit) {
        var uEnter = Math.max(0, Math.min(1, hit.u0));
        if (uEnter > uBalloonExit) {
            uEnd = Math.min(uEnd, uEnter - epsU);
        }
    }
    if (uEnd <= uBalloonExit + 1e-4)
        return null;
    var x0 = bx + (ax - bx) * uBalloonExit;
    var y0 = by + (ay - by) * uBalloonExit;
    var x1 = bx + (ax - bx) * uEnd;
    var y1 = by + (ay - by) * uEnd;
    return [x0, y0, x1, y1];
}
var featureTypeOptions = shared_models_1.procedureStepType.map(function (t) { return ({
    label: t,
    value: t
}); });
var ConditionalMeasurementText = function (baseMutation) {
    return function (props) {
        if (props.row.type !== "Measurement") {
            return <span className="text-muted-foreground text-sm">&mdash;</span>;
        }
        return (0, Editable_1.EditableText)(baseMutation)(props);
    };
};
var ConditionalMeasurementList = function (baseMutation, options) {
    return function (props) {
        if (props.row.type !== "Measurement") {
            return <span className="text-muted-foreground text-sm">&mdash;</span>;
        }
        return (0, Editable_1.EditableList)(baseMutation, options)(props);
    };
};
var BALLOON_W_NORM = 0.04;
var BALLOON_H_NORM = 0.04;
var BALLOON_OFFSET_NORM = 0.02;
var BALLOON_W_PCT = BALLOON_W_NORM * 100;
var BALLOON_H_PCT = BALLOON_H_NORM * 100;
var BALLOON_OFFSET_PCT = BALLOON_OFFSET_NORM * 100;
function nextBalloonLabel(rows) {
    var nums = rows
        .map(function (r) { return parseInt(r.label, 10); })
        .filter(function (n) { return Number.isFinite(n); });
    var max = nums.length ? Math.max.apply(Math, nums) : 0;
    return String(max + 1);
}
function isTempFeatureId(featureId) {
    return featureId.startsWith("temp-ftr-");
}
function isTempBalloonId(balloonId) {
    return balloonId != null && balloonId.startsWith("temp-bln-");
}
function stripBalloonGeometryFromFeatureRows(rows) {
    return rows.map(function (r) {
        return r.balloonId == null
            ? r
            : __assign(__assign({}, r), { balloonId: null, balloonAnchorId: "", x: 0, y: 0, geometryDirty: false });
    });
}
function hasBalloonGeometry(rows, selectors) {
    return rows.some(function (r) { return r.balloonId != null; }) || selectors.length > 0;
}
function sanitizeFilenameBase(name) {
    var trimmed = name.trim().replace(/[\\/:*?"<>|]+/g, "_");
    return (trimmed.length > 0 ? trimmed : "diagram").slice(0, 120);
}
function triggerDownload(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
function getBalloonValueOrNull(value) {
    var trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
}
function blobToBase64Data(blob) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function () {
            var dataUrl = reader.result;
            var comma = dataUrl.indexOf(",");
            resolve(comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl);
        };
        reader.onerror = function () { return reject(reader.error); };
        reader.readAsDataURL(blob);
    });
}
/** Selector regions are always derived from balloon rows (region = anchor rect). */
function selectorRectsFromBalloonRecords(balloons) {
    return balloons.map(function (b) {
        var _a, _b, _c, _d, _e, _f, _g;
        return ({
            id: String(b.id),
            pageNumber: Number((_a = b.pageNumber) !== null && _a !== void 0 ? _a : 1),
            x: Number((_c = (_b = b.regionX) !== null && _b !== void 0 ? _b : b.xCoordinate) !== null && _c !== void 0 ? _c : 0) * 100,
            y: Number((_e = (_d = b.regionY) !== null && _d !== void 0 ? _d : b.yCoordinate) !== null && _e !== void 0 ? _e : 0) * 100,
            width: Number((_f = b.regionWidth) !== null && _f !== void 0 ? _f : 0.1) * 100,
            height: Number((_g = b.regionHeight) !== null && _g !== void 0 ? _g : 0.1) * 100,
            isNew: false,
            isDirty: false
        });
    });
}
/** When a balloon exists, its page is authoritative for overlay placement. */
function resolvedFeaturePageNumber(feature, balloon) {
    var _a;
    if (balloon != null &&
        balloon.pageNumber != null &&
        balloon.pageNumber !== "") {
        return Number(balloon.pageNumber);
    }
    return Number((_a = feature.pageNumber) !== null && _a !== void 0 ? _a : 1);
}
function mapFeatureRowFromRecords(feature, balloon) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var desc = feature.description != null && String(feature.description).trim() !== ""
        ? String(feature.description)
        : "";
    var label = String((_a = feature.label) !== null && _a !== void 0 ? _a : "");
    var featureName = desc || "Feature ".concat(label);
    var balloonId = balloon != null
        ? String(balloon.id)
        : feature.balloonId != null
            ? String(feature.balloonId)
            : null;
    return {
        featureId: String(feature.id),
        balloonId: balloonId,
        balloonAnchorId: balloonId !== null && balloonId !== void 0 ? balloonId : "",
        label: label,
        pageNumber: resolvedFeaturePageNumber(feature, balloon),
        x: balloon ? Number((_b = balloon.xCoordinate) !== null && _b !== void 0 ? _b : 0) * 100 : 0,
        y: balloon ? Number((_c = balloon.yCoordinate) !== null && _c !== void 0 ? _c : 0) * 100 : 0,
        width: BALLOON_W_PCT,
        height: BALLOON_H_PCT,
        featureName: featureName,
        nominalValue: String((_d = feature.nominalValue) !== null && _d !== void 0 ? _d : ""),
        tolerancePlus: String((_e = feature.tolerancePlus) !== null && _e !== void 0 ? _e : ""),
        toleranceMinus: String((_f = feature.toleranceMinus) !== null && _f !== void 0 ? _f : ""),
        units: String((_g = feature.unit) !== null && _g !== void 0 ? _g : ""),
        type: (_h = feature.type) !== null && _h !== void 0 ? _h : "Measurement",
        featureDirty: false,
        geometryDirty: false
    };
}
function buildFeatureRowsFromLoader(features, balloons) {
    var balloonByFeatureId = new Map(balloons.map(function (b) { return [String(b.inspectionFeatureId), b]; }));
    return features.map(function (f) {
        return mapFeatureRowFromRecords(f, f.balloonId != null
            ? balloons.find(function (b) { return String(b.id) === String(f.balloonId); })
            : balloonByFeatureId.get(String(f.id)));
    });
}
function InspectionDocumentEditor(_a) {
    var _this = this;
    var _b, _c;
    var diagramId = _a.diagramId, name = _a.name, content = _a.content, initialFeatures = _a.features, balloons = _a.balloons, unitOfMeasures = _a.unitOfMeasures;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var nameFetcher = (0, react_router_1.useFetcher)();
    var _d = (0, react_2.useState)(name), title = _d[0], setTitle = _d[1];
    var debouncedSaveName = (0, react_1.useDebounce)(function (value) {
        nameFetcher.submit({ drawingNumber: value }, {
            method: "post",
            action: path_1.path.to.updateInspectionDocumentName(diagramId)
        });
    }, 500);
    var carbon = (0, auth_1.useCarbon)().carbon;
    var user = (0, hooks_1.useUser)();
    var companyId = user.company.id;
    var _e = (0, react_2.useState)((_b = content === null || content === void 0 ? void 0 : content.pdfUrl) !== null && _b !== void 0 ? _b : ""), pdfUrl = _e[0], setPdfUrl = _e[1];
    var _f = (0, react_2.useState)(null), pdfFile = _f[0], setPdfFile = _f[1];
    var _g = (0, react_2.useState)(false), uploading = _g[0], setUploading = _g[1];
    var _h = (0, react_2.useState)(false), replacePdfConfirmOpen = _h[0], setReplacePdfConfirmOpen = _h[1];
    var _j = (0, react_2.useState)(null), pendingReplacePdfFile = _j[0], setPendingReplacePdfFile = _j[1];
    (0, react_2.useEffect)(function () {
        var documentPresent = pdfFile !== null || pdfUrl.trim() !== "";
        setFeaturesTableExpanded(!documentPresent);
    }, [pdfFile, pdfUrl]);
    var _k = (0, react_2.useState)(function () {
        return selectorRectsFromBalloonRecords(balloons);
    }), anchorRects = _k[0], setSelectorRects = _k[1];
    var _l = (0, react_2.useState)(function () {
        return buildFeatureRowsFromLoader(initialFeatures, balloons);
    }), featureRows = _l[0], setFeatureRows = _l[1];
    var _m = (0, react_2.useState)(false), placing = _m[0], setPlacing = _m[1];
    var _o = (0, react_2.useState)(false), placingAnnotation = _o[0], setPlacingAnnotation = _o[1];
    var _p = (0, react_2.useState)(false), zoomBoxMode = _p[0], setZoomBoxMode = _p[1];
    var _q = (0, react_2.useState)(1), zoomScale = _q[0], setZoomScale = _q[1];
    var _r = (0, react_2.useState)(0), numPages = _r[0], setNumPages = _r[1];
    /** 1-based page index for the PDF viewer (one page on screen at a time). */
    var _s = (0, react_2.useState)(1), pdfViewPage = _s[0], setPdfViewPage = _s[1];
    var _t = (0, react_2.useState)(null), pdfMetrics = _t[0], setPdfMetrics = _t[1];
    var _u = (0, react_2.useState)(false), isMounted = _u[0], setIsMounted = _u[1];
    var _v = (0, react_2.useState)(null), drag = _v[0], setDrag = _v[1];
    var _w = (0, react_2.useState)(null), dragKind = _w[0], setDragKind = _w[1];
    var _x = (0, react_2.useState)(0), containerWidth = _x[0], setContainerWidth = _x[1];
    var _y = (0, react_2.useState)(0), overlayHeight = _y[0], setOverlayHeight = _y[1];
    /** Expanded when no PDF (edit features); collapsed when a document is loaded (room for drawing). */
    var _z = (0, react_2.useState)(function () { var _a; return !((_a = content === null || content === void 0 ? void 0 : content.pdfUrl) !== null && _a !== void 0 ? _a : "").trim(); }), featuresTableExpanded = _z[0], setFeaturesTableExpanded = _z[1];
    /** Height of PDF block when table is expanded (px); drag the splitter to adjust. */
    var _0 = (0, react_2.useState)(360), pdfPaneHeightPx = _0[0], setPdfPaneHeightPx = _0[1];
    var _1 = (0, react_2.useState)(0), editorStackHeightPx = _1[0], setEditorStackHeightPx = _1[1];
    var _2 = (0, react_2.useState)(false), isResizingPdfFeatures = _2[0], setIsResizingPdfFeatures = _2[1];
    var _3 = (0, react_2.useState)(false), pdfExporting = _3[0], setPdfExporting = _3[1];
    var _4 = (0, react_2.useState)(false), pdfPageRendered = _4[0], setPdfPageRendered = _4[1];
    var prevPdfViewPageRef = (0, react_2.useRef)(pdfViewPage);
    if (prevPdfViewPageRef.current !== pdfViewPage) {
        prevPdfViewPageRef.current = pdfViewPage;
        setPdfPageRendered(false);
    }
    var overlayRef = (0, react_2.useRef)(null);
    var containerRef = (0, react_2.useRef)(null);
    var stageRef = (0, react_2.useRef)(null);
    var editorStackRef = (0, react_2.useRef)(null);
    var balloonDragRef = (0, react_2.useRef)(null);
    var anchorResizeRef = (0, react_2.useRef)(null);
    var annotationResizeRef = (0, react_2.useRef)(null);
    var splitDragRef = (0, react_2.useRef)(null);
    var fileInputRef = (0, react_2.useRef)(null);
    /** Only the explicit Save button should show "Diagram saved" — not auto-persist after anchor draw. */
    var manualSaveToastRef = (0, react_2.useRef)(false);
    var pdfReplaceToastRef = (0, react_2.useRef)(false);
    var pdfReplacePendingMetricsRef = (0, react_2.useRef)(false);
    /** Persisted feature ids to hard-delete on next Save. */
    var pendingFeatureDeleteIdsRef = (0, react_2.useRef)(new Set());
    /** Persisted balloon ids to hard-delete on next Save (unballoon). */
    var pendingBalloonDeleteIdsRef = (0, react_2.useRef)(new Set());
    var _5 = (0, react_2.useState)(null), placingFeatureId = _5[0], setPlacingFeatureId = _5[1];
    var _6 = (0, react_2.useState)([]), annotations = _6[0], setAnnotations = _6[1];
    var _7 = (0, react_2.useState)(null), selectedAnnotationId = _7[0], setSelectedAnnotationId = _7[1];
    var _8 = (0, react_2.useState)(null), selectedBalloonId = _8[0], setSelectedBalloonId = _8[1];
    var _9 = (0, react_2.useState)(null), selectedSelectorId = _9[0], setSelectedSelectorId = _9[1];
    var _10 = (0, react_2.useState)(null), annotationDraft = _10[0], setAnnotationDraft = _10[1];
    var _11 = (0, react_2.useState)("12"), annotationFontSizeInput = _11[0], setAnnotationFontSizeInput = _11[1];
    var _12 = (0, react_2.useState)(null), annotationEditDraft = _12[0], setAnnotationEditDraft = _12[1];
    var _13 = (0, react_2.useState)("12"), annotationEditFontSizeInput = _13[0], setAnnotationEditFontSizeInput = _13[1];
    var documentPageCount = Math.max(1, numPages, (_c = pdfMetrics === null || pdfMetrics === void 0 ? void 0 : pdfMetrics.pageCount) !== null && _c !== void 0 ? _c : 0);
    (0, react_2.useEffect)(function () {
        setPdfViewPage(function (p) { var _a; return Math.min(Math.max(1, p), Math.max(1, (_a = pdfMetrics === null || pdfMetrics === void 0 ? void 0 : pdfMetrics.pageCount) !== null && _a !== void 0 ? _a : numPages)); });
    }, [pdfMetrics === null || pdfMetrics === void 0 ? void 0 : pdfMetrics.pageCount, numPages]);
    (0, react_2.useEffect)(function () {
        var _a;
        void pdfViewPage;
        (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.scrollTo(0, 0);
    }, [pdfViewPage]);
    (0, react_2.useEffect)(function () {
        setSelectedSelectorId(function (id) {
            if (!id)
                return null;
            var sel = anchorRects.find(function (s) { return s.id === id; });
            if (!sel || sel.pageNumber !== pdfViewPage)
                return null;
            return id;
        });
        setSelectedBalloonId(function (bid) {
            if (!bid)
                return null;
            var row = featureRows.find(function (r) { return r.balloonId === bid; });
            if (!row || row.pageNumber !== pdfViewPage)
                return null;
            return bid;
        });
        setSelectedAnnotationId(function (aid) {
            if (!aid)
                return null;
            var ann = annotations.find(function (a) { return a.id === aid; });
            if (!ann || ann.pageNumber !== pdfViewPage)
                return null;
            return aid;
        });
    }, [pdfViewPage, anchorRects, featureRows, annotations]);
    (0, react_2.useEffect)(function () {
        setIsMounted(true);
    }, []);
    (0, react_2.useEffect)(function () {
        if (!editorStackRef.current)
            return;
        var el = editorStackRef.current;
        var ro = new ResizeObserver(function () {
            var h = el.clientHeight;
            setEditorStackHeightPx(h);
            setPdfPaneHeightPx(function (prev) {
                return clampPdfPaneHeight(prev, h, featuresTableExpanded);
            });
        });
        ro.observe(el);
        return function () { return ro.disconnect(); };
    }, [featuresTableExpanded]);
    (0, react_2.useEffect)(function () {
        if (!isResizingPdfFeatures)
            return;
        var onMove = function (e) {
            var start = splitDragRef.current;
            if (!start)
                return;
            var dy = e.clientY - start.startY;
            setPdfPaneHeightPx(clampPdfPaneHeight(start.startPdfPx + dy, editorStackHeightPx, featuresTableExpanded));
        };
        var onUp = function () {
            setIsResizingPdfFeatures(false);
            splitDragRef.current = null;
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return function () {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, [isResizingPdfFeatures, editorStackHeightPx, featuresTableExpanded]);
    var onSplitResizeMouseDown = (0, react_2.useCallback)(function (e) {
        if (!featuresTableExpanded)
            return;
        e.preventDefault();
        splitDragRef.current = {
            startY: e.clientY,
            startPdfPx: pdfPaneHeightPx
        };
        setIsResizingPdfFeatures(true);
    }, [featuresTableExpanded, pdfPaneHeightPx]);
    // Measure container width and keep it up to date on resize
    (0, react_2.useEffect)(function () {
        if (!containerRef.current)
            return;
        var ro = new ResizeObserver(function (entries) {
            var _a;
            var w = (_a = entries[0]) === null || _a === void 0 ? void 0 : _a.contentRect.width;
            if (w)
                setContainerWidth(w);
        });
        ro.observe(containerRef.current);
        return function () { return ro.disconnect(); };
    }, []);
    (0, react_2.useEffect)(function () {
        var hasPdfSource = pdfFile !== null || pdfUrl !== "";
        if (!hasPdfSource || !overlayRef.current)
            return;
        var ro = new ResizeObserver(function (entries) {
            var _a, _b;
            var h = (_b = (_a = entries[0]) === null || _a === void 0 ? void 0 : _a.contentRect.height) !== null && _b !== void 0 ? _b : 0;
            setOverlayHeight(h);
        });
        ro.observe(overlayRef.current);
        return function () { return ro.disconnect(); };
    }, [pdfFile, pdfUrl]);
    (0, react_2.useEffect)(function () {
        if (!pdfReplacePendingMetricsRef.current || !pdfMetrics)
            return;
        pdfReplacePendingMetricsRef.current = false;
        var formData = new FormData();
        formData.set("pageCount", String(pdfMetrics.pageCount));
        formData.set("defaultPageWidth", String(pdfMetrics.defaultPageWidth));
        formData.set("defaultPageHeight", String(pdfMetrics.defaultPageHeight));
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.saveInspectionDocument(diagramId)
        });
    }, [diagramId, fetcher, pdfMetrics]);
    (0, react_2.useEffect)(function () {
        var _a, _b, _c, _d, _e;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === true) {
            var savedBalloons = (_b = fetcher.data.balloons) !== null && _b !== void 0 ? _b : [];
            setSelectorRects(selectorRectsFromBalloonRecords(savedBalloons));
            setFeatureRows(buildFeatureRowsFromLoader((_c = fetcher.data.features) !== null && _c !== void 0 ? _c : [], savedBalloons));
            pendingFeatureDeleteIdsRef.current.clear();
            pendingBalloonDeleteIdsRef.current.clear();
            if (pdfReplaceToastRef.current) {
                react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Drawing replaced. Balloon placements were removed; feature rows are unchanged."], ["Drawing replaced. Balloon placements were removed; feature rows are unchanged."]))));
                pdfReplaceToastRef.current = false;
            }
            else if (manualSaveToastRef.current) {
                react_1.toast.success(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Diagram saved"], ["Diagram saved"]))));
                manualSaveToastRef.current = false;
            }
        }
        else if (((_d = fetcher.data) === null || _d === void 0 ? void 0 : _d.success) === false) {
            pdfReplaceToastRef.current = false;
            pdfReplacePendingMetricsRef.current = false;
            manualSaveToastRef.current = false;
            react_1.toast.error((_e = fetcher.data.message) !== null && _e !== void 0 ? _e : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Failed to save diagram"], ["Failed to save diagram"]))));
        }
    }, [fetcher.data, t]);
    var loadAnnotations = (0, react_2.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setAnnotations([]);
            return [2 /*return*/];
        });
    }); }, []);
    (0, react_2.useEffect)(function () {
        void loadAnnotations();
    }, [loadAnnotations]);
    (0, react_2.useEffect)(function () {
        if (!selectedAnnotationId || annotationDraft) {
            setAnnotationEditDraft(null);
            return;
        }
        var selected = annotations.find(function (item) { return item.id === selectedAnnotationId; });
        if (!selected) {
            setAnnotationEditDraft(null);
            return;
        }
        setAnnotationEditDraft({
            id: selected.id,
            pageNumber: selected.pageNumber,
            x: selected.x,
            y: selected.y,
            width: selected.width,
            height: selected.height,
            text: selected.text,
            fontSize: selected.fontSize
        });
        setAnnotationEditFontSizeInput(String(selected.fontSize));
    }, [selectedAnnotationId, annotations, annotationDraft]);
    var getRelativePosFromStage = (0, react_2.useCallback)(function () {
        var _a, _b;
        var stage = stageRef.current;
        var pos = (_b = (_a = stage === null || stage === void 0 ? void 0 : stage.getPointerPosition) === null || _a === void 0 ? void 0 : _a.call(stage)) !== null && _b !== void 0 ? _b : null;
        if (!pos || !stage)
            return { x: 0, y: 0 };
        var w = stage.width();
        var h = stage.height();
        return { x: toPercent(pos.x, w), y: toPercent(pos.y, h) };
    }, []);
    var persistAnnotationResize = (0, react_2.useCallback)(function (_annotation) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    }); }, []);
    var finalizeDragAt = (0, react_2.useCallback)(function (x, y) {
        var _a, _b, _c, _d;
        if (!drag || !dragKind)
            return;
        var rx = Math.min(drag.startX, x);
        var ry = Math.min(drag.startY, y);
        var rw = Math.abs(x - drag.startX);
        var rh = Math.abs(y - drag.startY);
        if (rw < 0.5 || rh < 0.5) {
            if (dragKind === "balloonMove") {
                balloonDragRef.current = null;
            }
            if (dragKind === "annotationResize") {
                annotationResizeRef.current = null;
            }
            if (dragKind === "anchorResize") {
                anchorResizeRef.current = null;
            }
            setDragKind(null);
            setDrag(null);
            return;
        }
        if (dragKind === "zoom") {
            if (!containerRef.current || !overlayRef.current) {
                setDragKind(null);
                setDrag(null);
                return;
            }
            var overlayRect = overlayRef.current.getBoundingClientRect();
            var boxWidthPx = (rw / 100) * overlayRect.width;
            var boxHeightPx = (rh / 100) * overlayRect.height;
            if (boxWidthPx < 8 || boxHeightPx < 8) {
                setDragKind(null);
                setDrag(null);
                return;
            }
            var fitX = containerRef.current.clientWidth / boxWidthPx;
            var fitY = containerRef.current.clientHeight / boxHeightPx;
            var nextZoom = Math.max(0.5, Math.min(3, Number((zoomScale * Math.min(fitX, fitY)).toFixed(2))));
            var zoomRatio_1 = nextZoom / zoomScale;
            var centerXPx_1 = ((rx + rw / 2) / 100) * overlayRect.width;
            var centerYPx_1 = ((ry + rh / 2) / 100) * overlayHeight;
            setZoomScale(nextZoom);
            requestAnimationFrame(function () {
                if (!containerRef.current)
                    return;
                containerRef.current.scrollLeft =
                    centerXPx_1 * zoomRatio_1 - containerRef.current.clientWidth / 2;
                containerRef.current.scrollTop =
                    centerYPx_1 * zoomRatio_1 - containerRef.current.clientHeight / 2;
            });
            setDragKind(null);
            setDrag(null);
            return;
        }
        if (dragKind === "annotation") {
            var pageNumber = pdfViewPage;
            var localY = ry;
            var localHeight = rh;
            var clippedLocalHeight = Math.min(localHeight, 100 - localY);
            if (clippedLocalHeight < 0.5) {
                setDragKind(null);
                setDrag(null);
                return;
            }
            setAnnotationDraft({
                pageNumber: pageNumber,
                x: rx,
                y: localY,
                width: rw,
                height: clippedLocalHeight,
                text: "",
                fontSize: 12
            });
            setAnnotationFontSizeInput("12");
            setDragKind(null);
            setDrag(null);
            setPlacingAnnotation(false);
            return;
        }
        if (dragKind === "annotationResize" && annotationResizeRef.current) {
            var activeResize_1 = annotationResizeRef.current;
            var stageWidthPctBase = Math.max(1, containerWidth * zoomScale);
            var pageHeightPx = overlayHeight;
            var minWidthPct = Math.max(0.5, (ANNOTATION_MIN_SIZE_PX / stageWidthPctBase) * 100);
            var minHeightPct = Math.max(0.5, (ANNOTATION_MIN_SIZE_PX / Math.max(1, pageHeightPx)) * 100);
            var start = activeResize_1.startRect;
            var deltaX = x - drag.startX;
            var deltaY = y - drag.startY;
            var nextX = start.x;
            var nextY = start.y;
            var nextW = start.width;
            var nextH = start.height;
            if (activeResize_1.handle.includes("e")) {
                nextW = Math.max(minWidthPct, Math.min(100 - start.x, start.width + deltaX));
            }
            if (activeResize_1.handle.includes("s")) {
                nextH = Math.max(minHeightPct, Math.min(100 - start.y, start.height + deltaY));
            }
            if (activeResize_1.handle.includes("w")) {
                var limitedX = Math.max(0, Math.min(start.x + start.width - minWidthPct, start.x + deltaX));
                nextX = limitedX;
                nextW = start.width - (limitedX - start.x);
            }
            if (activeResize_1.handle.includes("n")) {
                var limitedY = Math.max(0, Math.min(start.y + start.height - minHeightPct, start.y + deltaY));
                nextY = limitedY;
                nextH = start.height - (limitedY - start.y);
            }
            var resized_1 = {
                x: Math.max(0, Math.min(100 - nextW, nextX)),
                y: Math.max(0, Math.min(100 - nextH, nextY)),
                width: nextW,
                height: nextH
            };
            var finalAnnotation = __assign(__assign({ id: activeResize_1.annotationId, pageNumber: start.pageNumber }, resized_1), { text: (_b = (_a = annotations.find(function (item) { return item.id === activeResize_1.annotationId; })) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : "", fontSize: (_d = (_c = annotations.find(function (item) { return item.id === activeResize_1.annotationId; })) === null || _c === void 0 ? void 0 : _c.fontSize) !== null && _d !== void 0 ? _d : 12 });
            setAnnotations(function (prev) {
                return prev.map(function (a) {
                    return a.id === activeResize_1.annotationId ? __assign(__assign({}, a), resized_1) : a;
                });
            });
            setAnnotationEditDraft(function (prev) {
                return prev && prev.id === activeResize_1.annotationId
                    ? __assign(__assign({}, prev), resized_1) : prev;
            });
            annotationResizeRef.current = null;
            setDragKind(null);
            setDrag(null);
            void persistAnnotationResize(finalAnnotation);
            return;
        }
        if (dragKind === "anchor") {
            var pageNumber_1 = pdfViewPage;
            var localY_1 = ry;
            var localHeight = rh;
            var clippedLocalHeight_1 = Math.min(localHeight, 100 - localY_1);
            if (clippedLocalHeight_1 < 0.5) {
                setDragKind(null);
                setDrag(null);
                return;
            }
            var placingExistingFeatureId_1 = placingFeatureId;
            var tempBalloonId_1 = "temp-bln-".concat((0, nanoid_1.nanoid)());
            var balloonX_1 = rx + rw + BALLOON_OFFSET_PCT;
            if (balloonX_1 + BALLOON_W_PCT > 100) {
                balloonX_1 = rx - BALLOON_OFFSET_PCT - BALLOON_W_PCT;
            }
            balloonX_1 = Math.max(0, Math.min(100 - BALLOON_W_PCT, balloonX_1));
            var balloonY_1 = Math.max(0, Math.min(100 - BALLOON_H_PCT, localY_1));
            setSelectorRects(function (prev) { return __spreadArray(__spreadArray([], prev, true), [
                {
                    id: tempBalloonId_1,
                    pageNumber: pageNumber_1,
                    x: rx,
                    y: localY_1,
                    width: rw,
                    height: clippedLocalHeight_1,
                    isNew: true,
                    isDirty: false
                }
            ], false); });
            setFeatureRows(function (prev) {
                var existing = placingExistingFeatureId_1
                    ? prev.find(function (r) { return r.featureId === placingExistingFeatureId_1; })
                    : null;
                if (existing) {
                    return prev.map(function (r) {
                        return r.featureId !== placingExistingFeatureId_1
                            ? r
                            : __assign(__assign({}, r), { balloonId: tempBalloonId_1, balloonAnchorId: tempBalloonId_1, pageNumber: pageNumber_1, x: balloonX_1, y: balloonY_1, featureDirty: isTempFeatureId(r.featureId)
                                    ? r.featureDirty
                                    : true, geometryDirty: true });
                    });
                }
                var tempFeatureId = "temp-ftr-".concat((0, nanoid_1.nanoid)());
                var label = nextBalloonLabel(prev);
                return __spreadArray(__spreadArray([], prev, true), [
                    {
                        featureId: tempFeatureId,
                        balloonId: tempBalloonId_1,
                        balloonAnchorId: tempBalloonId_1,
                        label: label,
                        pageNumber: pageNumber_1,
                        x: balloonX_1,
                        y: balloonY_1,
                        width: BALLOON_W_PCT,
                        height: BALLOON_H_PCT,
                        featureName: "Feature ".concat(label),
                        nominalValue: "",
                        tolerancePlus: "",
                        toleranceMinus: "",
                        units: "",
                        type: "Measurement"
                    }
                ], false);
            });
            setPlacingFeatureId(null);
            // New selector rows only — skip AI when placing geometry on an existing table feature.
            if (!placingExistingFeatureId_1) {
                var renderedPageWidthPx_1 = Math.max(1, containerWidth * zoomScale);
                void (function () { return __awaiter(_this, void 0, void 0, function () {
                    var bytes, res, blob, imageBase64, analyzeRes, payloadUnknown, payload, a_1, _a, _b;
                    var _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _d.trys.push([0, 13, , 14]);
                                if (pdfFile === null && !pdfUrl) {
                                    return [2 /*return*/];
                                }
                                bytes = void 0;
                                if (!(pdfFile !== null)) return [3 /*break*/, 2];
                                return [4 /*yield*/, pdfFile.arrayBuffer()];
                            case 1:
                                bytes = _d.sent();
                                return [3 /*break*/, 5];
                            case 2: return [4 /*yield*/, fetch(pdfUrl, { credentials: "include" })];
                            case 3:
                                res = _d.sent();
                                if (!res.ok) {
                                    throw new Error(String(res.status));
                                }
                                return [4 /*yield*/, res.arrayBuffer()];
                            case 4:
                                bytes = _d.sent();
                                _d.label = 5;
                            case 5: return [4 /*yield*/, (0, cropInspectionAnchorToPng_1.cropInspectionAnchorToPngBlob)({
                                    pdfBytes: bytes,
                                    pageNumber: pageNumber_1,
                                    x: rx,
                                    y: localY_1,
                                    width: rw,
                                    height: clippedLocalHeight_1,
                                    renderedPageWidthPx: renderedPageWidthPx_1
                                })];
                            case 6:
                                blob = _d.sent();
                                _d.label = 7;
                            case 7:
                                _d.trys.push([7, 11, , 12]);
                                return [4 /*yield*/, blobToBase64Data(blob)];
                            case 8:
                                imageBase64 = _d.sent();
                                return [4 /*yield*/, fetch(path_1.path.to.api.inspectionDocumentBalloonAnalyze(diagramId), {
                                        method: "POST",
                                        credentials: "include",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            imageBase64: imageBase64,
                                            mediaType: "image/png"
                                        })
                                    })];
                            case 9:
                                analyzeRes = _d.sent();
                                return [4 /*yield*/, analyzeRes.json()];
                            case 10:
                                payloadUnknown = _d.sent();
                                payload = payloadUnknown;
                                if (!analyzeRes.ok || !payload.success || !payload.analysis) {
                                    react_1.toast.error(t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Could not analyze region: ", ""], ["Could not analyze region: ", ""])), (_c = payload.message) !== null && _c !== void 0 ? _c : analyzeRes.statusText));
                                    return [2 /*return*/];
                                }
                                a_1 = payload.analysis;
                                setFeatureRows(function (prev) {
                                    return prev.map(function (r) {
                                        if (r.balloonId !== tempBalloonId_1)
                                            return r;
                                        var fmt = function (n, fallback) {
                                            return n != null && Number.isFinite(n) ? String(n) : fallback;
                                        };
                                        var nextNominal = fmt(a_1.nominal, r.nominalValue);
                                        var nextPlus = fmt(a_1.tol_plus, r.tolerancePlus);
                                        var nextMinus = fmt(a_1.tol_minus, r.toleranceMinus);
                                        var nextUnits = a_1.unit != null ? a_1.unit : r.units;
                                        var nextFeatureName = r.featureName;
                                        if (a_1.type !== "unknown") {
                                            var tag = " [".concat(a_1.type, "]");
                                            if (!nextFeatureName.includes(tag)) {
                                                nextFeatureName = "".concat(nextFeatureName).concat(tag);
                                            }
                                        }
                                        return __assign(__assign({}, r), { nominalValue: nextNominal, tolerancePlus: nextPlus, toleranceMinus: nextMinus, units: nextUnits, type: "Measurement", featureName: nextFeatureName, featureDirty: true });
                                    });
                                });
                                react_1.toast.success(t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Feature values suggested from drawing"], ["Feature values suggested from drawing"]))));
                                return [3 /*break*/, 12];
                            case 11:
                                _a = _d.sent();
                                react_1.toast.error(t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Could not analyze cropped region"], ["Could not analyze cropped region"]))));
                                return [3 /*break*/, 12];
                            case 12: return [3 /*break*/, 14];
                            case 13:
                                _b = _d.sent();
                                react_1.toast.error(t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Could not prepare region image for analysis"], ["Could not prepare region image for analysis"]))));
                                return [3 /*break*/, 14];
                            case 14: return [2 /*return*/];
                        }
                    });
                }); })();
            }
            setDragKind(null);
            setDrag(null);
            setPlacing(false);
            return;
        }
        if (dragKind === "balloonMove") {
            balloonDragRef.current = null;
            setDragKind(null);
            setDrag(null);
            return;
        }
        if (dragKind === "anchorResize") {
            anchorResizeRef.current = null;
            setDragKind(null);
            setDrag(null);
            return;
        }
        setDragKind(null);
        setDrag(null);
    }, [
        drag,
        pdfViewPage,
        dragKind,
        zoomScale,
        overlayHeight,
        containerWidth,
        pdfFile,
        pdfUrl,
        diagramId,
        annotations,
        persistAnnotationResize,
        placingFeatureId,
        t
    ]);
    var getAnnotationIdAt = (0, react_2.useCallback)(function (x, y) {
        var pageNumber = pdfViewPage;
        var localY = y;
        for (var i = annotations.length - 1; i >= 0; i -= 1) {
            var annotation = annotations[i];
            if (annotation.pageNumber !== pageNumber)
                continue;
            var inRect = x >= annotation.x &&
                x <= annotation.x + annotation.width &&
                localY >= annotation.y &&
                localY <= annotation.y + annotation.height;
            if (inRect)
                return annotation.id;
        }
        return null;
    }, [annotations, pdfViewPage]);
    var getAnnotationResizeHandleAt = (0, react_2.useCallback)(function (x, y) {
        var pageNumber = pdfViewPage;
        var localY = y;
        var pageHeightPx = overlayHeight;
        var stageWidthPctBase = Math.max(1, containerWidth * zoomScale);
        var hPad = Math.max(0.5, (ANNOTATION_RESIZE_HANDLE_PX / stageWidthPctBase) * 100);
        var vPad = Math.max(0.5, (ANNOTATION_RESIZE_HANDLE_PX / Math.max(1, pageHeightPx)) * 100);
        for (var i = annotations.length - 1; i >= 0; i -= 1) {
            var a = annotations[i];
            if (a.pageNumber !== pageNumber)
                continue;
            var left = a.x;
            var right = a.x + a.width;
            var top_1 = a.y;
            var bottom = a.y + a.height;
            var nearLeft = Math.abs(x - left) <= hPad;
            var nearRight = Math.abs(x - right) <= hPad;
            var nearTop = Math.abs(localY - top_1) <= vPad;
            var nearBottom = Math.abs(localY - bottom) <= vPad;
            var withinXBand = x >= left - hPad && x <= right + hPad;
            var withinYBand = localY >= top_1 - vPad && localY <= bottom + vPad;
            if (!withinXBand || !withinYBand)
                continue;
            if (nearTop && nearLeft)
                return { annotationId: a.id, handle: "nw" };
            if (nearTop && nearRight)
                return { annotationId: a.id, handle: "ne" };
            if (nearBottom && nearLeft)
                return { annotationId: a.id, handle: "sw" };
            if (nearBottom && nearRight)
                return { annotationId: a.id, handle: "se" };
            if (nearTop)
                return { annotationId: a.id, handle: "n" };
            if (nearBottom)
                return { annotationId: a.id, handle: "s" };
            if (nearLeft)
                return { annotationId: a.id, handle: "w" };
            if (nearRight)
                return { annotationId: a.id, handle: "e" };
        }
        return null;
    }, [annotations, pdfViewPage, overlayHeight, containerWidth, zoomScale]);
    var getBalloonIdAt = (0, react_2.useCallback)(function (x, y) {
        var pageNumber = pdfViewPage;
        var localY = y;
        for (var i = featureRows.length - 1; i >= 0; i -= 1) {
            var balloon = featureRows[i];
            if (balloon.pageNumber !== pageNumber)
                continue;
            var inRect = x >= balloon.x &&
                x <= balloon.x + balloon.width &&
                localY >= balloon.y &&
                localY <= balloon.y + balloon.height;
            if (inRect && balloon.balloonId)
                return balloon.balloonId;
        }
        return null;
    }, [featureRows, pdfViewPage]);
    var getSelectorIdAt = (0, react_2.useCallback)(function (x, y) {
        var pageNumber = pdfViewPage;
        var localY = y;
        for (var i = anchorRects.length - 1; i >= 0; i -= 1) {
            var anchor = anchorRects[i];
            if (anchor.pageNumber !== pageNumber)
                continue;
            var inRect = x >= anchor.x &&
                x <= anchor.x + anchor.width &&
                localY >= anchor.y &&
                localY <= anchor.y + anchor.height;
            if (inRect)
                return anchor.id;
        }
        return null;
    }, [anchorRects, pdfViewPage]);
    var getSelectorResizeHandleAt = (0, react_2.useCallback)(function (x, y) {
        var pageNumber = pdfViewPage;
        var localY = y;
        var pageHeightPx = overlayHeight;
        var stageWidthPctBase = Math.max(1, containerWidth * zoomScale);
        var hPad = Math.max(0.5, (SELECTOR_RESIZE_HANDLE_PX / stageWidthPctBase) * 100);
        var vPad = Math.max(0.5, (SELECTOR_RESIZE_HANDLE_PX / Math.max(1, pageHeightPx)) * 100);
        for (var i = anchorRects.length - 1; i >= 0; i -= 1) {
            var s = anchorRects[i];
            if (s.pageNumber !== pageNumber)
                continue;
            var left = s.x;
            var right = s.x + s.width;
            var top_2 = s.y;
            var bottom = s.y + s.height;
            var nearLeft = Math.abs(x - left) <= hPad;
            var nearRight = Math.abs(x - right) <= hPad;
            var nearTop = Math.abs(localY - top_2) <= vPad;
            var nearBottom = Math.abs(localY - bottom) <= vPad;
            var withinXBand = x >= left - hPad && x <= right + hPad;
            var withinYBand = localY >= top_2 - vPad && localY <= bottom + vPad;
            if (!withinXBand || !withinYBand)
                continue;
            if (nearTop && nearLeft)
                return { balloonAnchorId: s.id, handle: "nw" };
            if (nearTop && nearRight)
                return { balloonAnchorId: s.id, handle: "ne" };
            if (nearBottom && nearLeft)
                return { balloonAnchorId: s.id, handle: "sw" };
            if (nearBottom && nearRight)
                return { balloonAnchorId: s.id, handle: "se" };
            if (nearTop)
                return { balloonAnchorId: s.id, handle: "n" };
            if (nearBottom)
                return { balloonAnchorId: s.id, handle: "s" };
            if (nearLeft)
                return { balloonAnchorId: s.id, handle: "w" };
            if (nearRight)
                return { balloonAnchorId: s.id, handle: "e" };
        }
        return null;
    }, [anchorRects, pdfViewPage, overlayHeight, containerWidth, zoomScale]);
    var handleStageMouseDown = (0, react_2.useCallback)(function (e) {
        var _a, _b, _c, _d, _e, _f;
        var ke = e;
        var evt = ke.evt;
        if (!evt)
            return;
        if (placing) {
            evt.preventDefault();
            var _g = getRelativePosFromStage(), x_1 = _g.x, y_1 = _g.y;
            setDragKind("anchor");
            setDrag({ startX: x_1, startY: y_1, currentX: x_1, currentY: y_1 });
            return;
        }
        if (placingAnnotation) {
            evt.preventDefault();
            var _h = getRelativePosFromStage(), x_2 = _h.x, y_2 = _h.y;
            setDragKind("annotation");
            setDrag({ startX: x_2, startY: y_2, currentX: x_2, currentY: y_2 });
            return;
        }
        if (zoomBoxMode) {
            evt.preventDefault();
            var _j = getRelativePosFromStage(), x_3 = _j.x, y_3 = _j.y;
            setDragKind("zoom");
            setDrag({ startX: x_3, startY: y_3, currentX: x_3, currentY: y_3 });
            return;
        }
        var _k = getRelativePosFromStage(), x = _k.x, y = _k.y;
        var annotationId = getAnnotationIdAt(x, y);
        var annotationResize = getAnnotationResizeHandleAt(x, y);
        if (annotationResize) {
            var annotation = annotations.find(function (a) { return a.id === annotationResize.annotationId; });
            if (annotation) {
                setSelectedAnnotationId(annotation.id);
                setSelectedBalloonId(null);
                setSelectedSelectorId(null);
                annotationResizeRef.current = {
                    annotationId: annotation.id,
                    handle: annotationResize.handle,
                    startRect: {
                        x: annotation.x,
                        y: annotation.y,
                        width: annotation.width,
                        height: annotation.height,
                        pageNumber: annotation.pageNumber
                    }
                };
                evt.preventDefault();
                setDragKind("annotationResize");
                setDrag({ startX: x, startY: y, currentX: x, currentY: y });
                return;
            }
        }
        if (annotationId) {
            setSelectedAnnotationId(annotationId);
            setSelectedBalloonId(null);
            setSelectedSelectorId(null);
            return;
        }
        var anchorResize = getSelectorResizeHandleAt(x, y);
        if (anchorResize) {
            var anchor_1 = anchorRects.find(function (s) { return s.id === anchorResize.balloonAnchorId; });
            if (anchor_1) {
                var linkedBalloonId = (_b = (_a = featureRows.find(function (row) { return row.balloonAnchorId === anchor_1.id; })) === null || _a === void 0 ? void 0 : _a.balloonId) !== null && _b !== void 0 ? _b : null;
                setSelectedSelectorId(anchor_1.id);
                setSelectedBalloonId(linkedBalloonId);
                setSelectedAnnotationId(null);
                anchorResizeRef.current = {
                    balloonAnchorId: anchor_1.id,
                    handle: anchorResize.handle,
                    startRect: {
                        x: anchor_1.x,
                        y: anchor_1.y,
                        width: anchor_1.width,
                        height: anchor_1.height
                    }
                };
                evt.preventDefault();
                setDragKind("anchorResize");
                setDrag({ startX: x, startY: y, currentX: x, currentY: y });
                return;
            }
        }
        var balloonId = getBalloonIdAt(x, y);
        if (balloonId) {
            var linkedSelectorId = (_d = (_c = featureRows.find(function (row) { return row.balloonId === balloonId; })) === null || _c === void 0 ? void 0 : _c.balloonAnchorId) !== null && _d !== void 0 ? _d : null;
            setSelectedBalloonId(balloonId);
            setSelectedAnnotationId(null);
            setSelectedSelectorId(linkedSelectorId);
            var dragged = featureRows.find(function (row) { return row.balloonId === balloonId; });
            if (dragged) {
                evt.preventDefault();
                balloonDragRef.current = {
                    balloonId: balloonId,
                    startX: dragged.x,
                    startY: dragged.y
                };
                setDragKind("balloonMove");
                setDrag({ startX: x, startY: y, currentX: x, currentY: y });
            }
            return;
        }
        var balloonAnchorId = getSelectorIdAt(x, y);
        if (balloonAnchorId) {
            var linkedBalloonId = (_f = (_e = featureRows.find(function (row) { return row.balloonAnchorId === balloonAnchorId; })) === null || _e === void 0 ? void 0 : _e.balloonId) !== null && _f !== void 0 ? _f : null;
            setSelectedSelectorId(balloonAnchorId);
            setSelectedAnnotationId(null);
            setSelectedBalloonId(linkedBalloonId);
            return;
        }
        setSelectedAnnotationId(null);
        setSelectedBalloonId(null);
        setSelectedSelectorId(null);
    }, [
        placingAnnotation,
        placing,
        getRelativePosFromStage,
        zoomBoxMode,
        getAnnotationIdAt,
        getAnnotationResizeHandleAt,
        getSelectorResizeHandleAt,
        getBalloonIdAt,
        getSelectorIdAt,
        annotations,
        featureRows,
        anchorRects
    ]);
    var handleCreateAnnotation = (0, react_2.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var next;
        return __generator(this, function (_a) {
            if (!annotationDraft || annotationDraft.text.trim().length === 0) {
                react_1.toast.error(t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Annotation text is required"], ["Annotation text is required"]))));
                return [2 /*return*/];
            }
            next = {
                id: "temp-ann-".concat(Date.now()),
                pageNumber: annotationDraft.pageNumber,
                x: annotationDraft.x,
                y: annotationDraft.y,
                width: annotationDraft.width,
                height: annotationDraft.height,
                text: annotationDraft.text.trim(),
                fontSize: annotationDraft.fontSize
            };
            setAnnotations(function (prev) { return __spreadArray(__spreadArray([], prev, true), [next], false); });
            setAnnotationDraft(null);
            setAnnotationFontSizeInput("12");
            react_1.toast.success(t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Annotation added"], ["Annotation added"]))));
            return [2 /*return*/];
        });
    }); }, [annotationDraft, t]);
    var handleUpdateAnnotation = (0, react_2.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var updated;
        return __generator(this, function (_a) {
            if (!annotationEditDraft || annotationEditDraft.text.trim().length === 0) {
                react_1.toast.error(t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Annotation text is required"], ["Annotation text is required"]))));
                return [2 /*return*/];
            }
            updated = __assign(__assign({}, annotationEditDraft), { text: annotationEditDraft.text.trim() });
            setAnnotations(function (prev) {
                return prev.map(function (item) { return (item.id === updated.id ? updated : item); });
            });
            setSelectedAnnotationId(null);
            setAnnotationEditDraft(null);
            react_1.toast.success(t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Annotation updated"], ["Annotation updated"]))));
            return [2 /*return*/];
        });
    }); }, [annotationEditDraft, t]);
    var handleDeleteAnnotation = (0, react_2.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!annotationEditDraft)
                return [2 /*return*/];
            setAnnotations(function (prev) {
                return prev.filter(function (item) { return item.id !== annotationEditDraft.id; });
            });
            setSelectedAnnotationId(null);
            setAnnotationEditDraft(null);
            react_1.toast.success(t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Annotation deleted"], ["Annotation deleted"]))));
            return [2 /*return*/];
        });
    }); }, [annotationEditDraft, t]);
    var getHoverCursorAt = (0, react_2.useCallback)(function (x, y) {
        var pageNumber = pdfViewPage;
        var localY = y;
        var inRect = function (left, top, width, height) {
            return x >= left &&
                x <= left + width &&
                localY >= top &&
                localY <= top + height;
        };
        // Top-most visual priority: annotation -> balloon -> anchor.
        var annotationResize = getAnnotationResizeHandleAt(x, y);
        if (annotationResize) {
            return cursorForSelectorResizeHandle(annotationResize.handle);
        }
        for (var _i = 0, annotations_1 = annotations; _i < annotations_1.length; _i++) {
            var annotation = annotations_1[_i];
            if (annotation.pageNumber !== pageNumber)
                continue;
            if (inRect(annotation.x, annotation.y, annotation.width, annotation.height)) {
                return "pointer";
            }
        }
        for (var _a = 0, featureRows_1 = featureRows; _a < featureRows_1.length; _a++) {
            var balloon = featureRows_1[_a];
            if (balloon.pageNumber !== pageNumber || !balloon.balloonId)
                continue;
            if (inRect(balloon.x, balloon.y, balloon.width, balloon.height)) {
                return "pointer";
            }
        }
        var anchorResize = getSelectorResizeHandleAt(x, y);
        if (anchorResize) {
            return cursorForSelectorResizeHandle(anchorResize.handle);
        }
        for (var _b = 0, anchorRects_1 = anchorRects; _b < anchorRects_1.length; _b++) {
            var anchor = anchorRects_1[_b];
            if (anchor.pageNumber !== pageNumber)
                continue;
            if (inRect(anchor.x, anchor.y, anchor.width, anchor.height)) {
                return "pointer";
            }
        }
        return "";
    }, [
        annotations,
        featureRows,
        anchorRects,
        pdfViewPage,
        getAnnotationResizeHandleAt,
        getSelectorResizeHandleAt
    ]);
    var handleStageMouseMove = (0, react_2.useCallback)(function (e) {
        var evt = e.evt;
        if (!evt)
            return;
        var _a = getRelativePosFromStage(), x = _a.x, y = _a.y;
        var stageContent = konvaContentFromStageRef(stageRef);
        if (placing || placingAnnotation || zoomBoxMode || drag) {
            if (stageContent) {
                if (dragKind === "balloonMove") {
                    stageContent.style.cursor = "grabbing";
                }
                else if (dragKind === "annotationResize" &&
                    annotationResizeRef.current) {
                    stageContent.style.cursor = cursorForSelectorResizeHandle(annotationResizeRef.current.handle);
                }
                else if (dragKind === "anchorResize" && anchorResizeRef.current) {
                    stageContent.style.cursor = cursorForSelectorResizeHandle(anchorResizeRef.current.handle);
                }
                else {
                    stageContent.style.cursor = "";
                }
            }
        }
        else if (stageContent) {
            stageContent.style.cursor = getHoverCursorAt(x, y);
        }
        if (dragKind === "balloonMove" && drag && balloonDragRef.current) {
            var activeDrag_1 = balloonDragRef.current;
            var deltaX_1 = x - drag.startX;
            var deltaY_1 = y - drag.startY;
            setFeatureRows(function (prev) {
                return prev.map(function (row) {
                    if (row.balloonId !== activeDrag_1.balloonId)
                        return row;
                    var nextX = Math.max(0, Math.min(100 - row.width, activeDrag_1.startX + deltaX_1));
                    var nextY = Math.max(0, Math.min(100 - row.height, activeDrag_1.startY + deltaY_1));
                    return __assign(__assign({}, row), { x: nextX, y: nextY, geometryDirty: isTempBalloonId(row.balloonId)
                            ? row.geometryDirty
                            : true });
                });
            });
        }
        if (dragKind === "annotationResize" &&
            drag &&
            annotationResizeRef.current) {
            var activeResize_2 = annotationResizeRef.current;
            var pageHeightPx = overlayHeight;
            var stageWidthPctBase = Math.max(1, containerWidth * zoomScale);
            var minWidthPct = Math.max(0.5, (ANNOTATION_MIN_SIZE_PX / stageWidthPctBase) * 100);
            var minHeightPct = Math.max(0.5, (ANNOTATION_MIN_SIZE_PX / Math.max(1, pageHeightPx)) * 100);
            var start = activeResize_2.startRect;
            var deltaX = x - drag.startX;
            var deltaY = y - drag.startY;
            var nextX = start.x;
            var nextY = start.y;
            var nextW = start.width;
            var nextH = start.height;
            if (activeResize_2.handle.includes("e")) {
                nextW = Math.max(minWidthPct, Math.min(100 - start.x, start.width + deltaX));
            }
            if (activeResize_2.handle.includes("s")) {
                nextH = Math.max(minHeightPct, Math.min(100 - start.y, start.height + deltaY));
            }
            if (activeResize_2.handle.includes("w")) {
                var limitedX = Math.max(0, Math.min(start.x + start.width - minWidthPct, start.x + deltaX));
                nextX = limitedX;
                nextW = start.width - (limitedX - start.x);
            }
            if (activeResize_2.handle.includes("n")) {
                var limitedY = Math.max(0, Math.min(start.y + start.height - minHeightPct, start.y + deltaY));
                nextY = limitedY;
                nextH = start.height - (limitedY - start.y);
            }
            var resized_2 = {
                x: Math.max(0, Math.min(100 - nextW, nextX)),
                y: Math.max(0, Math.min(100 - nextH, nextY)),
                width: nextW,
                height: nextH
            };
            setAnnotations(function (prev) {
                return prev.map(function (a) {
                    return a.id === activeResize_2.annotationId ? __assign(__assign({}, a), resized_2) : a;
                });
            });
            setAnnotationEditDraft(function (prev) {
                return prev && prev.id === activeResize_2.annotationId
                    ? __assign(__assign({}, prev), resized_2) : prev;
            });
        }
        if (dragKind === "anchorResize" && drag && anchorResizeRef.current) {
            var activeResize_3 = anchorResizeRef.current;
            var deltaX = x - drag.startX;
            var deltaY = y - drag.startY;
            var pageHeightPx = overlayHeight;
            var stageWidthPctBase = Math.max(1, containerWidth * zoomScale);
            var minWidthPct = Math.max(0.5, (SELECTOR_MIN_SIZE_PX / stageWidthPctBase) * 100);
            var minHeightPct = Math.max(0.5, (SELECTOR_MIN_SIZE_PX / Math.max(1, pageHeightPx)) * 100);
            var start = activeResize_3.startRect;
            var nextX = start.x;
            var nextY = start.y;
            var nextW = start.width;
            var nextH = start.height;
            if (activeResize_3.handle.includes("e")) {
                nextW = Math.max(minWidthPct, Math.min(100 - start.x, start.width + deltaX));
            }
            if (activeResize_3.handle.includes("s")) {
                nextH = Math.max(minHeightPct, Math.min(100 - start.y, start.height + deltaY));
            }
            if (activeResize_3.handle.includes("w")) {
                var limitedX = Math.max(0, Math.min(start.x + start.width - minWidthPct, start.x + deltaX));
                nextX = limitedX;
                nextW = start.width - (limitedX - start.x);
            }
            if (activeResize_3.handle.includes("n")) {
                var limitedY = Math.max(0, Math.min(start.y + start.height - minHeightPct, start.y + deltaY));
                nextY = limitedY;
                nextH = start.height - (limitedY - start.y);
            }
            var resizedRect_1 = {
                x: Math.max(0, Math.min(100 - nextW, nextX)),
                y: Math.max(0, Math.min(100 - nextH, nextY)),
                width: nextW,
                height: nextH
            };
            setSelectorRects(function (prev) {
                return prev.map(function (anchor) {
                    return anchor.id !== activeResize_3.balloonAnchorId
                        ? anchor
                        : __assign(__assign(__assign({}, anchor), resizedRect_1), { isDirty: true });
                });
            });
            setFeatureRows(function (prev) {
                return prev.map(function (row) {
                    return row.balloonAnchorId !== activeResize_3.balloonAnchorId
                        ? row
                        : __assign(__assign({}, row), { geometryDirty: isTempBalloonId(row.balloonId)
                                ? row.geometryDirty
                                : true });
                });
            });
        }
        if (!drag)
            return;
        setDrag(function (d) { return (d ? __assign(__assign({}, d), { currentX: x, currentY: y }) : null); });
    }, [
        drag,
        dragKind,
        getRelativePosFromStage,
        getHoverCursorAt,
        placing,
        placingAnnotation,
        zoomBoxMode,
        overlayHeight,
        containerWidth,
        zoomScale
    ]);
    var handleStageMouseUp = (0, react_2.useCallback)(function (e) {
        var evt = e.evt;
        if (!evt)
            return;
        if (!drag || !dragKind)
            return;
        var _a = getRelativePosFromStage(), x = _a.x, y = _a.y;
        finalizeDragAt(x, y);
    }, [drag, dragKind, getRelativePosFromStage, finalizeDragAt]);
    var handleSave = (0, react_2.useCallback)(function () {
        var _a, _b;
        manualSaveToastRef.current = true;
        var formData = new FormData();
        formData.set("name", name);
        if (pdfUrl)
            formData.set("pdfUrl", pdfUrl);
        var featuresCreate = featureRows
            .filter(function (r) { return isTempFeatureId(r.featureId); })
            .map(function (r) { return ({
            tempId: r.featureId,
            pageNumber: r.pageNumber,
            label: r.label,
            description: r.featureName.trim() || null,
            nominalValue: getBalloonValueOrNull(r.nominalValue),
            tolerancePlus: getBalloonValueOrNull(r.tolerancePlus),
            toleranceMinus: getBalloonValueOrNull(r.toleranceMinus),
            unit: getBalloonValueOrNull(r.units),
            type: r.type
        }); });
        var featuresUpdate = featureRows
            .filter(function (r) {
            return !isTempFeatureId(r.featureId) &&
                (r.featureDirty || (r.geometryDirty && r.balloonId != null));
        })
            .map(function (r) { return ({
            id: r.featureId,
            pageNumber: r.pageNumber,
            label: r.label,
            description: r.featureName.trim() || null,
            nominalValue: getBalloonValueOrNull(r.nominalValue),
            tolerancePlus: getBalloonValueOrNull(r.tolerancePlus),
            toleranceMinus: getBalloonValueOrNull(r.toleranceMinus),
            unit: getBalloonValueOrNull(r.units),
            type: r.type
        }); });
        formData.set("features", JSON.stringify({
            create: featuresCreate,
            update: featuresUpdate,
            delete: __spreadArray([], pendingFeatureDeleteIdsRef.current, true)
        }));
        var balloonsCreate = featureRows
            .filter(function (r) { return isTempBalloonId(r.balloonId); })
            .map(function (r) {
            var _a, _b, _c, _d, _e;
            var anchor = anchorRects.find(function (s) { return s.id === r.balloonAnchorId; });
            return __assign(__assign({}, (isTempFeatureId(r.featureId)
                ? { tempInspectionFeatureId: r.featureId }
                : { inspectionFeatureId: r.featureId })), { tempBalloonAnchorId: (_a = r.balloonId) !== null && _a !== void 0 ? _a : undefined, pageNumber: r.pageNumber, regionX: ((_b = anchor === null || anchor === void 0 ? void 0 : anchor.x) !== null && _b !== void 0 ? _b : 0) / 100, regionY: ((_c = anchor === null || anchor === void 0 ? void 0 : anchor.y) !== null && _c !== void 0 ? _c : 0) / 100, regionWidth: ((_d = anchor === null || anchor === void 0 ? void 0 : anchor.width) !== null && _d !== void 0 ? _d : BALLOON_W_PCT) / 100, regionHeight: ((_e = anchor === null || anchor === void 0 ? void 0 : anchor.height) !== null && _e !== void 0 ? _e : BALLOON_H_PCT) / 100, xCoordinate: r.x / 100, yCoordinate: r.y / 100 });
        });
        var balloonsUpdateById = new Map();
        for (var _i = 0, _c = anchorRects.filter(function (s) { return !s.isNew && s.isDirty; }); _i < _c.length; _i++) {
            var anchor = _c[_i];
            balloonsUpdateById.set(anchor.id, {
                id: anchor.id,
                pageNumber: anchor.pageNumber,
                regionX: anchor.x / 100,
                regionY: anchor.y / 100,
                regionWidth: anchor.width / 100,
                regionHeight: anchor.height / 100
            });
        }
        var _loop_1 = function (row) {
            var anchor = anchorRects.find(function (s) { return s.id === row.balloonAnchorId; });
            var existing = (_a = balloonsUpdateById.get(row.balloonId)) !== null && _a !== void 0 ? _a : {
                id: row.balloonId
            };
            balloonsUpdateById.set(row.balloonId, __assign(__assign(__assign(__assign({}, existing), { pageNumber: (_b = anchor === null || anchor === void 0 ? void 0 : anchor.pageNumber) !== null && _b !== void 0 ? _b : row.pageNumber }), (anchor
                ? {
                    regionX: anchor.x / 100,
                    regionY: anchor.y / 100,
                    regionWidth: anchor.width / 100,
                    regionHeight: anchor.height / 100
                }
                : {})), { xCoordinate: row.x / 100, yCoordinate: row.y / 100 }));
        };
        for (var _d = 0, _e = featureRows.filter(function (r) { return r.balloonId && !isTempBalloonId(r.balloonId) && r.geometryDirty; }); _d < _e.length; _d++) {
            var row = _e[_d];
            _loop_1(row);
        }
        formData.set("balloons", JSON.stringify({
            create: balloonsCreate,
            update: __spreadArray([], balloonsUpdateById.values(), true),
            delete: __spreadArray([], pendingBalloonDeleteIdsRef.current, true)
        }));
        if (pdfMetrics) {
            formData.set("pageCount", String(pdfMetrics.pageCount));
            formData.set("defaultPageWidth", String(pdfMetrics.defaultPageWidth));
            formData.set("defaultPageHeight", String(pdfMetrics.defaultPageHeight));
        }
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.saveInspectionDocument(diagramId)
        });
    }, [diagramId, name, pdfUrl, anchorRects, featureRows, pdfMetrics, fetcher]);
    var uploadPdfAndSave = (0, react_2.useCallback)(function (file, options) { return __awaiter(_this, void 0, void 0, function () {
        var storagePath, result, nextPdfUrl, formData, persistedBalloonDeleteIds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    setUploading(true);
                    storagePath = "".concat(companyId, "/inspectionDocument/").concat(diagramId, "/").concat((0, nanoid_1.nanoid)(), ".pdf");
                    return [4 /*yield*/, carbon.storage
                            .from("private")
                            .upload(storagePath, file)];
                case 1:
                    result = _a.sent();
                    setUploading(false);
                    if (result.error) {
                        react_1.toast.error(t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Failed to upload PDF"], ["Failed to upload PDF"]))));
                        return [2 /*return*/];
                    }
                    nextPdfUrl = "/file/preview/private/".concat(result.data.path);
                    setPdfUrl(nextPdfUrl);
                    setPdfFile(null);
                    setPdfViewPage(1);
                    setNumPages(0);
                    setPdfMetrics(null);
                    formData = new FormData();
                    formData.set("pdfUrl", nextPdfUrl);
                    if (options.clearBalloons) {
                        persistedBalloonDeleteIds = featureRows
                            .filter(function (r) {
                            return r.balloonId != null && !isTempBalloonId(r.balloonId);
                        })
                            .map(function (r) { return r.balloonId; });
                        formData.set("balloons", JSON.stringify({
                            create: [],
                            update: [],
                            delete: persistedBalloonDeleteIds
                        }));
                        setSelectorRects([]);
                        setFeatureRows(function (prev) { return stripBalloonGeometryFromFeatureRows(prev); });
                        pendingBalloonDeleteIdsRef.current.clear();
                        pdfReplaceToastRef.current = true;
                        pdfReplacePendingMetricsRef.current = true;
                    }
                    fetcher.submit(formData, {
                        method: "post",
                        action: path_1.path.to.saveInspectionDocument(diagramId)
                    });
                    return [2 /*return*/];
            }
        });
    }); }, [carbon, companyId, diagramId, featureRows, fetcher, t]);
    var handlePdfUpload = (0, react_2.useCallback)(function (e) { return __awaiter(_this, void 0, void 0, function () {
        var file, replacingExistingPdf, shouldConfirmClearBalloons;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
                    e.target.value = "";
                    if (!file || !carbon)
                        return [2 /*return*/];
                    replacingExistingPdf = pdfUrl.trim() !== "";
                    shouldConfirmClearBalloons = replacingExistingPdf && hasBalloonGeometry(featureRows, anchorRects);
                    if (shouldConfirmClearBalloons) {
                        setPendingReplacePdfFile(file);
                        setReplacePdfConfirmOpen(true);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, uploadPdfAndSave(file, { clearBalloons: false })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [anchorRects, carbon, featureRows, pdfUrl, uploadPdfAndSave]);
    var handleConfirmReplacePdf = (0, react_2.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    file = pendingReplacePdfFile;
                    setReplacePdfConfirmOpen(false);
                    setPendingReplacePdfFile(null);
                    if (!file)
                        return [2 /*return*/];
                    return [4 /*yield*/, uploadPdfAndSave(file, { clearBalloons: true })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [pendingReplacePdfFile, uploadPdfAndSave]);
    var handleCancelReplacePdf = (0, react_2.useCallback)(function () {
        setReplacePdfConfirmOpen(false);
        setPendingReplacePdfFile(null);
    }, []);
    var hasPdf = pdfFile !== null || pdfUrl !== "";
    var isPdfReady = hasPdf && (numPages > 0 || pdfMetrics !== null);
    var isOverlayReady = isPdfReady && containerWidth > 0 && overlayHeight > 0;
    var handleDeleteFeature = (0, react_2.useCallback)(function (featureId) {
        setFeatureRows(function (prev) {
            var row = prev.find(function (r) { return r.featureId === featureId; });
            if (row && !isTempFeatureId(row.featureId)) {
                pendingFeatureDeleteIdsRef.current.add(row.featureId);
            }
            var nextRows = prev.filter(function (r) { return r.featureId !== featureId; });
            var keptAnchorIds = new Set(nextRows
                .map(function (r) { return r.balloonAnchorId; })
                .filter(function (id) { return id.length > 0; }));
            setSelectorRects(function (sels) {
                return sels.filter(function (sel) { return keptAnchorIds.has(sel.id); });
            });
            return nextRows;
        });
    }, []);
    var handleAddFeature = (0, react_2.useCallback)(function () {
        setFeatureRows(function (prev) {
            var label = nextBalloonLabel(prev);
            return __spreadArray(__spreadArray([], prev, true), [
                {
                    featureId: "temp-ftr-".concat((0, nanoid_1.nanoid)()),
                    balloonId: null,
                    balloonAnchorId: "",
                    label: label,
                    pageNumber: pdfViewPage,
                    x: 0,
                    y: 0,
                    width: BALLOON_W_PCT,
                    height: BALLOON_H_PCT,
                    featureName: "Feature ".concat(label),
                    nominalValue: "",
                    tolerancePlus: "",
                    toleranceMinus: "",
                    units: "",
                    type: "Measurement"
                }
            ], false);
        });
    }, [pdfViewPage]);
    var handlePlaceFeatureOnDrawing = (0, react_2.useCallback)(function (featureId) {
        setPlacingFeatureId(featureId);
        setPlacing(true);
        setPlacingAnnotation(false);
        setZoomBoxMode(false);
    }, []);
    var handleUnballoon = (0, react_2.useCallback)(function (featureId) {
        setFeatureRows(function (prev) {
            var row = prev.find(function (r) { return r.featureId === featureId; });
            if (!(row === null || row === void 0 ? void 0 : row.balloonId))
                return prev;
            if (!isTempBalloonId(row.balloonId)) {
                pendingBalloonDeleteIdsRef.current.add(row.balloonId);
            }
            if (row.balloonAnchorId) {
                setSelectorRects(function (sels) {
                    return sels.filter(function (s) { return s.id !== row.balloonAnchorId; });
                });
            }
            return prev.map(function (r) {
                return r.featureId !== featureId
                    ? r
                    : __assign(__assign({}, r), { balloonId: null, balloonAnchorId: "", x: 0, y: 0, geometryDirty: false });
            });
        });
    }, []);
    var updateFeatureField = (0, react_2.useCallback)(function (featureId, field, value) {
        setFeatureRows(function (prev) {
            return prev.map(function (r) {
                var _a;
                return r.featureId !== featureId
                    ? r
                    : __assign(__assign({}, r), (_a = {}, _a[field] = value, _a.featureDirty = isTempFeatureId(r.featureId)
                        ? r.featureDirty
                        : true, _a));
            });
        });
    }, []);
    var featureMutation = (0, react_2.useCallback)(function (accessorKey, newValue, row) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            updateFeatureField(row.featureId, accessorKey, newValue);
            return [2 /*return*/, {
                    data: null,
                    error: null,
                    count: null,
                    status: 200,
                    statusText: "OK"
                }];
        });
    }); }, [updateFeatureField]);
    var unitOfMeasureOptions = (0, react_2.useMemo)(function () { return unitOfMeasures.map(function (uom) { return ({ value: uom.code, label: uom.name }); }); }, [unitOfMeasures]);
    var uomCodeToName = (0, react_2.useMemo)(function () { return new Map(unitOfMeasures.map(function (uom) { return [uom.code, uom.name]; })); }, [unitOfMeasures]);
    var featureEditableComponents = (0, react_2.useMemo)(function () { return ({
        type: (0, Editable_1.EditableList)(featureMutation, featureTypeOptions),
        label: (0, Editable_1.EditableText)(featureMutation),
        featureName: (0, Editable_1.EditableText)(featureMutation),
        nominalValue: ConditionalMeasurementText(featureMutation),
        tolerancePlus: ConditionalMeasurementText(featureMutation),
        toleranceMinus: ConditionalMeasurementText(featureMutation),
        units: ConditionalMeasurementList(featureMutation, unitOfMeasureOptions)
    }); }, [featureMutation, unitOfMeasureOptions]);
    var featureColumns = (0, react_2.useMemo)(function () { return [
        { accessorKey: "label", header: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Feature"], ["Feature"]))), size: 80 },
        {
            accessorKey: "type",
            header: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Type"], ["Type"]))),
            size: 140,
            cell: function (_a) {
                var row = _a.row;
                return (<react_1.HStack spacing={1} className="items-center">
            <Icons_1.ProcedureStepTypeIcon type={row.original
                        .type} className="h-4 w-4"/>
            <span className="text-sm">{row.original.type}</span>
          </react_1.HStack>);
            }
        },
        { accessorKey: "featureName", header: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Description"], ["Description"]))) },
        {
            accessorKey: "nominalValue",
            header: t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Nom"], ["Nom"]))),
            size: 112,
            cell: function (_a) {
                var row = _a.row;
                return row.original.type === "Measurement" ? row.original.nominalValue : null;
            }
        },
        {
            accessorKey: "tolerancePlus",
            header: t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Tol+"], ["Tol+"]))),
            size: 112,
            cell: function (_a) {
                var row = _a.row;
                return row.original.type === "Measurement"
                    ? row.original.tolerancePlus
                    : null;
            }
        },
        {
            accessorKey: "toleranceMinus",
            header: t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Tol-"], ["Tol-"]))),
            size: 112,
            cell: function (_a) {
                var row = _a.row;
                return row.original.type === "Measurement"
                    ? row.original.toleranceMinus
                    : null;
            }
        },
        {
            accessorKey: "units",
            header: t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Units"], ["Units"]))),
            size: 96,
            cell: function (_a) {
                var _b;
                var row = _a.row;
                return row.original.type === "Measurement"
                    ? ((_b = uomCodeToName.get(row.original.units)) !== null && _b !== void 0 ? _b : row.original.units)
                    : null;
            }
        },
        {
            id: "actions",
            header: t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Actions"], ["Actions"]))),
            size: 148,
            cell: function (_a) {
                var row = _a.row;
                return (<react_1.HStack spacing={0} className="items-center">
            <react_1.IconButton type="button" variant="ghost" size="sm" aria-label={t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Remove feature"], ["Remove feature"])))} icon={<lu_1.LuTrash2 className="h-4 w-4 text-destructive"/>} onClick={function (e) {
                        e.stopPropagation();
                        handleDeleteFeature(row.original.featureId);
                    }}/>
            <span className="mx-1.5 h-5 w-px shrink-0 bg-foreground/20 dark:bg-white/30" aria-hidden/>
            {row.original.balloonId ? (<react_1.Button type="button" variant="outline" size="sm" onClick={function (e) {
                            e.stopPropagation();
                            handleUnballoon(row.original.featureId);
                        }}>
                {t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Unballoon"], ["Unballoon"])))}
              </react_1.Button>) : (<react_1.Button type="button" variant="outline" size="sm" leftIcon={<lu_1.LuRectangleHorizontal className="h-3.5 w-3.5"/>} isDisabled={!isOverlayReady} onClick={function (e) {
                            e.stopPropagation();
                            handlePlaceFeatureOnDrawing(row.original.featureId);
                        }}>
                {t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Balloon"], ["Balloon"])))}
              </react_1.Button>)}
          </react_1.HStack>);
            }
        }
    ]; }, [
        handleDeleteFeature,
        handlePlaceFeatureOnDrawing,
        handleUnballoon,
        isOverlayReady,
        uomCodeToName,
        t
    ]);
    var handleDownloadPdfWithBalloons = (0, react_2.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var bytes, res, placedRows, outBytes, blobBytes, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!hasPdf) {
                        react_1.toast.error(t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Upload a PDF first"], ["Upload a PDF first"]))));
                        return [2 /*return*/];
                    }
                    setPdfExporting(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 8, 9, 10]);
                    bytes = void 0;
                    if (!pdfFile) return [3 /*break*/, 3];
                    return [4 /*yield*/, pdfFile.arrayBuffer()];
                case 2:
                    bytes = _b.sent();
                    return [3 /*break*/, 6];
                case 3: return [4 /*yield*/, fetch(pdfUrl, { credentials: "include" })];
                case 4:
                    res = _b.sent();
                    if (!res.ok) {
                        throw new Error(String(res.status));
                    }
                    return [4 /*yield*/, res.arrayBuffer()];
                case 5:
                    bytes = _b.sent();
                    _b.label = 6;
                case 6:
                    placedRows = featureRows
                        .filter(function (r) { return r.balloonId != null; })
                        .map(function (r) { return ({
                        balloonId: r.balloonId,
                        balloonAnchorId: r.balloonAnchorId,
                        label: r.label,
                        pageNumber: r.pageNumber,
                        x: r.x,
                        y: r.y,
                        width: r.width,
                        height: r.height
                    }); });
                    return [4 /*yield*/, (0, exportInspectionDocumentPdfWithOverlays_1.buildInspectionDocumentPdfWithOverlaysBytes)({
                            pdfBytes: bytes,
                            featureRows: placedRows,
                            anchorRects: anchorRects,
                            scale: 2
                        })];
                case 7:
                    outBytes = _b.sent();
                    blobBytes = new Uint8Array(outBytes.byteLength);
                    blobBytes.set(outBytes);
                    triggerDownload(new Blob([blobBytes], { type: "application/pdf" }), "".concat(sanitizeFilenameBase(name), "-with-balloons.pdf"));
                    react_1.toast.success(t(templateObject_26 || (templateObject_26 = __makeTemplateObject(["PDF downloaded"], ["PDF downloaded"]))));
                    return [3 /*break*/, 10];
                case 8:
                    _a = _b.sent();
                    react_1.toast.error(t(templateObject_27 || (templateObject_27 = __makeTemplateObject(["Could not build PDF. Try again."], ["Could not build PDF. Try again."]))));
                    return [3 /*break*/, 10];
                case 9:
                    setPdfExporting(false);
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); }, [hasPdf, pdfFile, pdfUrl, name, featureRows, anchorRects, t]);
    var previewRect = drag &&
        dragKind !== "balloonMove" &&
        dragKind !== "anchorResize" &&
        dragKind !== "annotationResize"
        ? {
            x: Math.min(drag.startX, drag.currentX),
            y: Math.min(drag.startY, drag.currentY),
            width: Math.abs(drag.currentX - drag.startX),
            height: Math.abs(drag.currentY - drag.startY)
        }
        : null;
    var renderedWidth = containerWidth > 0 ? Math.max(1, containerWidth * zoomScale) : 0;
    return (<div className="flex flex-col h-full overflow-hidden">
      <react_1.Modal open={replacePdfConfirmOpen} onOpenChange={function (open) {
            if (!open)
                handleCancelReplacePdf();
        }}>
        <react_1.ModalOverlay />
        <react_1.ModalContent>
          <react_1.ModalHeader>
            <react_1.ModalTitle>{t(templateObject_28 || (templateObject_28 = __makeTemplateObject(["Replace drawing?"], ["Replace drawing?"])))}</react_1.ModalTitle>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <p className="text-sm text-muted-foreground">
              {t(templateObject_29 || (templateObject_29 = __makeTemplateObject(["Replacing the PDF removes all balloon placements on this document. Feature rows and their values stay; you can place balloons again on the new drawing."], ["Replacing the PDF removes all balloon placements on this document. Feature rows and their values stay; you can place balloons again on the new drawing."])))}
            </p>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button type="button" variant="secondary" onClick={handleCancelReplacePdf} isDisabled={uploading}>
              {t(templateObject_30 || (templateObject_30 = __makeTemplateObject(["Cancel"], ["Cancel"])))}
            </react_1.Button>
            <react_1.Button type="button" isLoading={uploading} isDisabled={uploading} onClick={function () { return void handleConfirmReplacePdf(); }}>
              {t(templateObject_31 || (templateObject_31 = __makeTemplateObject(["Replace PDF"], ["Replace PDF"])))}
            </react_1.Button>
          </react_1.ModalFooter>
        </react_1.ModalContent>
      </react_1.Modal>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} disabled={uploading}/>

      {/* Header bar — min-height only so controls are not clipped when the row wraps */}
      <div className="flex min-h-[50px] flex-shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 overflow-x-auto border-b border-border bg-card px-4 py-2 scrollbar-hide dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        <div className="min-w-0 flex-1 pr-2">
          <react_1.Input borderless value={title} placeholder={t(templateObject_32 || (templateObject_32 = __makeTemplateObject(["Untitled Diagram"], ["Untitled Diagram"])))} className="font-semibold text-base truncate" onChange={function (e) {
            setTitle(e.target.value);
            debouncedSaveName(e.target.value);
        }}/>
        </div>
        <react_1.HStack spacing={2} className="flex-shrink-0 flex-wrap justify-end">
          <react_1.Button variant={placing ? "primary" : "secondary"} leftIcon={<lu_1.LuRectangleHorizontal />} onClick={function () {
            setPlacing(function (v) {
                var next = !v;
                if (next) {
                    setPlacingAnnotation(false);
                    setZoomBoxMode(false);
                    setPlacingFeatureId(null);
                }
                return next;
            });
        }} isDisabled={!isOverlayReady}>
            {placing ? t(templateObject_33 || (templateObject_33 = __makeTemplateObject(["Drag to place on drawing"], ["Drag to place on drawing"]))) : t(templateObject_34 || (templateObject_34 = __makeTemplateObject(["Add Selector"], ["Add Selector"])))}
          </react_1.Button>
          <react_1.Button variant={zoomBoxMode ? "primary" : "secondary"} onClick={function () {
            setZoomBoxMode(function (v) {
                var next = !v;
                if (next) {
                    setPlacing(false);
                    setPlacingAnnotation(false);
                }
                return next;
            });
        }} isDisabled={!isOverlayReady}>
            {zoomBoxMode ? t(templateObject_35 || (templateObject_35 = __makeTemplateObject(["Drag to zoom"], ["Drag to zoom"]))) : t(templateObject_36 || (templateObject_36 = __makeTemplateObject(["Zoom Box"], ["Zoom Box"])))}
          </react_1.Button>
          {hasPdf && (<react_1.Button variant="secondary" leftIcon={<lu_1.LuUpload />} onClick={function () { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }} isDisabled={uploading}>
              {uploading ? t(templateObject_37 || (templateObject_37 = __makeTemplateObject(["Uploading\u2026"], ["Uploading\u2026"]))) : t(templateObject_38 || (templateObject_38 = __makeTemplateObject(["Replace PDF"], ["Replace PDF"])))}
            </react_1.Button>)}
          {hasPdf && (<react_1.Button type="button" variant="secondary" leftIcon={<lu_1.LuFileDown className="h-4 w-4"/>} onClick={handleDownloadPdfWithBalloons} isDisabled={pdfExporting} isLoading={pdfExporting}>
              {t(templateObject_39 || (templateObject_39 = __makeTemplateObject(["Download PDF"], ["Download PDF"])))}
            </react_1.Button>)}
          <react_1.Button leftIcon={<lu_1.LuSave />} onClick={handleSave} isDisabled={fetcher.state !== "idle"}>
            {t(templateObject_40 || (templateObject_40 = __makeTemplateObject(["Save"], ["Save"])))}
          </react_1.Button>
          <react_1.HStack className="ml-1 rounded-md border bg-background px-1 py-1">
            <react_1.IconButton type="button" variant="ghost" size="sm" aria-label={t(templateObject_41 || (templateObject_41 = __makeTemplateObject(["Zoom out"], ["Zoom out"])))} icon={<lu_1.LuMinus />} onClick={function () {
            return setZoomScale(function (z) { return Math.max(0.5, Number((z - 0.1).toFixed(2))); });
        }}/>
            <span className="min-w-14 select-none text-center text-sm font-medium">
              {Math.round(zoomScale * 100)}%
            </span>
            <react_1.IconButton type="button" variant="ghost" size="sm" aria-label={t(templateObject_42 || (templateObject_42 = __makeTemplateObject(["Zoom in"], ["Zoom in"])))} icon={<lu_1.LuPlus />} onClick={function () {
            return setZoomScale(function (z) { return Math.min(3, Number((z + 0.1).toFixed(2))); });
        }}/>
            <react_1.Button type="button" variant="ghost" size="sm" onClick={function () {
            setZoomScale(1);
            requestAnimationFrame(function () {
                if (!containerRef.current)
                    return;
                containerRef.current.scrollLeft = 0;
                containerRef.current.scrollTop = 0;
            });
        }}>
              {t(templateObject_43 || (templateObject_43 = __makeTemplateObject(["Reset View"], ["Reset View"])))}
            </react_1.Button>
          </react_1.HStack>
        </react_1.HStack>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4 pt-2">
        <div ref={editorStackRef} className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden">
          {/* PDF viewer — outer measures width, inner fills container */}
          <div className={"flex min-h-0 min-w-full flex-col overflow-hidden rounded-lg border bg-muted ".concat(featuresTableExpanded ? "shrink-0" : "min-h-[220px] flex-1")} style={__assign(__assign({}, (featuresTableExpanded
            ? { height: pdfPaneHeightPx }
            : undefined)), { minWidth: "100%" })}>
            {hasPdf && documentPageCount > 1 ? (<div role="navigation" aria-label={t(templateObject_44 || (templateObject_44 = __makeTemplateObject(["PDF pages"], ["PDF pages"])))} className="flex shrink-0 items-center justify-center gap-3 border-b border-border bg-card px-3 py-2.5 shadow-sm">
                <react_1.IconButton type="button" variant="secondary" size="sm" aria-label={t(templateObject_45 || (templateObject_45 = __makeTemplateObject(["Previous page"], ["Previous page"])))} icon={<lu_1.LuChevronLeft className="h-4 w-4"/>} isDisabled={pdfViewPage <= 1} onClick={function () { return setPdfViewPage(function (p) { return Math.max(1, p - 1); }); }}/>
                <span className="min-w-[8.5rem] select-none text-center text-sm font-medium tabular-nums text-foreground">
                  {t(templateObject_46 || (templateObject_46 = __makeTemplateObject(["Page ", " of ", ""], ["Page ", " of ", ""])), pdfViewPage, documentPageCount)}
                </span>
                <react_1.IconButton type="button" variant="secondary" size="sm" aria-label={t(templateObject_47 || (templateObject_47 = __makeTemplateObject(["Next page"], ["Next page"])))} icon={<lu_1.LuChevronRight className="h-4 w-4"/>} isDisabled={pdfViewPage >= documentPageCount} onClick={function () {
                return setPdfViewPage(function (p) { return Math.min(documentPageCount, p + 1); });
            }}/>
              </div>) : null}
            <div ref={containerRef} className="relative min-h-0 min-w-full flex-1 overflow-auto" style={__assign(__assign({}, (placing || placingAnnotation || zoomBoxMode
            ? { cursor: "crosshair" }
            : {})), { minWidth: "100%" })}>
              {hasPdf ? (<div ref={overlayRef} className="relative select-none" style={{ width: renderedWidth > 0 ? renderedWidth : "100%" }} onMouseLeave={function () {
                if (drag)
                    setDrag(null);
                if (dragKind)
                    setDragKind(null);
                balloonDragRef.current = null;
                annotationResizeRef.current = null;
                anchorResizeRef.current = null;
                var el = konvaContentFromStageRef(stageRef);
                if (el)
                    el.style.cursor = "";
            }}>
                  {isMounted && (<div className="pointer-events-none">
                      <react_pdf_1.Document file={pdfFile !== null && pdfFile !== void 0 ? pdfFile : pdfUrl} onLoadSuccess={function (pdf) { return __awaiter(_this, void 0, void 0, function () {
                    var page, viewport, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                setNumPages(pdf.numPages);
                                setPdfViewPage(1);
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, pdf.getPage(1)];
                            case 2:
                                page = _b.sent();
                                viewport = page.getViewport({ scale: 1 });
                                setPdfMetrics({
                                    pageCount: pdf.numPages,
                                    defaultPageWidth: viewport.width,
                                    defaultPageHeight: viewport.height
                                });
                                return [3 /*break*/, 4];
                            case 3:
                                _a = _b.sent();
                                setPdfMetrics(null);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); }} onLoadError={function (err) {
                    return react_1.toast.error("PDF error: ".concat(err.message));
                }}>
                        {numPages > 0 ? (<react_pdf_1.Page key={pdfViewPage} pageNumber={pdfViewPage} width={renderedWidth > 0 ? renderedWidth : undefined} renderTextLayer={false} renderAnnotationLayer={false} className="w-full" onRenderSuccess={function () { return setPdfPageRendered(true); }}/>) : null}
                      </react_pdf_1.Document>
                    </div>)}

                  {pdfPageRendered &&
                containerWidth > 0 &&
                overlayHeight > 0 && (<div className="pointer-events-auto absolute inset-0 z-[9]">
                        <react_konva_1.Stage ref={stageRef} width={renderedWidth} height={overlayHeight} listening onMouseDown={handleStageMouseDown} onMouseMove={handleStageMouseMove} onMouseUp={handleStageMouseUp}>
                          <react_konva_1.Layer>
                            {anchorRects
                    .filter(function (s) { return s.pageNumber === pdfViewPage; })
                    .map(function (s) {
                    var pageHeightPx = overlayHeight;
                    var x = (s.x / 100) * renderedWidth;
                    var y = (s.y / 100) * pageHeightPx;
                    var width = (s.width / 100) * renderedWidth;
                    var height = (s.height / 100) * pageHeightPx;
                    var isSelected = s.id === selectedSelectorId;
                    return (<react_konva_1.Rect key={"konva-rect-".concat(s.id)} x={x} y={y} width={width} height={height} stroke={CALLOUT_STROKE} strokeWidth={isSelected ? 3 : 2} fill={isSelected
                            ? "rgba(249,115,22,0.12)"
                            : undefined} fillEnabled={isSelected} hitStrokeWidth={8} listening={false}/>);
                })}
                            {annotations
                    .filter(function (a) { return a.pageNumber === pdfViewPage; })
                    .map(function (annotation) {
                    var pageHeightPx = overlayHeight;
                    var x = (annotation.x / 100) * renderedWidth;
                    var y = (annotation.y / 100) * pageHeightPx;
                    var w = (annotation.width / 100) * renderedWidth;
                    var h = (annotation.height / 100) * pageHeightPx;
                    var isSelected = annotation.id === selectedAnnotationId;
                    var previewText = (annotationEditDraft === null || annotationEditDraft === void 0 ? void 0 : annotationEditDraft.id) === annotation.id
                        ? annotationEditDraft.text
                        : annotation.text;
                    var previewFontSize = (annotationEditDraft === null || annotationEditDraft === void 0 ? void 0 : annotationEditDraft.id) === annotation.id
                        ? annotationEditDraft.fontSize
                        : annotation.fontSize;
                    return (<react_konva_1.Group key={"annotation-".concat(annotation.id)} x={x} y={y}>
                                    <react_konva_1.Rect x={0} y={0} width={w} height={h} fill={isSelected
                            ? "rgba(249,115,22,0.22)"
                            : "rgba(249,115,22,0.12)"} stroke={CALLOUT_STROKE} strokeWidth={isSelected ? 2.5 : 1.5} cornerRadius={4} listening={false}/>
                                    <react_konva_1.Text x={8} y={6} width={Math.max(20, w - 16)} height={Math.max(16, h - 12)} text={previewText} fill={CALLOUT_TEXT} fontSize={previewFontSize} listening={false}/>
                                  </react_konva_1.Group>);
                })}
                            {annotationDraft &&
                    annotationDraft.pageNumber === pdfViewPage &&
                    (function () {
                        var pageHeightPx = overlayHeight;
                        var x = (annotationDraft.x / 100) * renderedWidth;
                        var y = (annotationDraft.y / 100) * pageHeightPx;
                        var w = (annotationDraft.width / 100) * renderedWidth;
                        var h = (annotationDraft.height / 100) * pageHeightPx;
                        return (<react_konva_1.Group key="annotation-draft" x={x} y={y}>
                                    <react_konva_1.Rect x={0} y={0} width={w} height={h} fill="rgba(249,115,22,0.16)" stroke={CALLOUT_STROKE} dash={[4, 4]} strokeWidth={2} cornerRadius={4} listening={false}/>
                                    {annotationDraft.text.trim().length > 0 && (<react_konva_1.Text x={8} y={6} width={Math.max(20, w - 16)} height={Math.max(16, h - 12)} text={annotationDraft.text} fill={CALLOUT_TEXT} fontSize={annotationDraft.fontSize} listening={false}/>)}
                                  </react_konva_1.Group>);
                    })()}
                            {featureRows
                    .filter(function (b) {
                    return b.pageNumber === pdfViewPage && b.balloonId;
                })
                    .map(function (b) {
                    var pageHeightPx = overlayHeight;
                    var balloonWidthPx = (b.width / 100) * renderedWidth;
                    var balloonHeightPx = (b.height / 100) * pageHeightPx;
                    var balloonX = (b.x / 100) * renderedWidth;
                    var balloonY = (b.y / 100) * pageHeightPx;
                    var balloonCenterX = balloonX + balloonWidthPx / 2;
                    var balloonCenterY = balloonY + balloonHeightPx / 2;
                    var radius = Math.max(8, Math.min(balloonWidthPx, balloonHeightPx) / 2);
                    var balloonLabelFontSize = Math.max(14, Math.min(26, Math.round(radius * 1.15)));
                    var isSelected = b.balloonId === selectedBalloonId;
                    var linkedSelector = anchorRects.find(function (s) { return s.id === b.balloonAnchorId; });
                    var linePoints = null;
                    if (linkedSelector &&
                        linkedSelector.pageNumber === pdfViewPage) {
                        var sx = (linkedSelector.x / 100) * renderedWidth;
                        var sy = (linkedSelector.y / 100) * pageHeightPx;
                        var sw = (linkedSelector.width / 100) *
                            renderedWidth;
                        var sh = (linkedSelector.height / 100) *
                            pageHeightPx;
                        var anchorX = sx + sw / 2;
                        var anchorY = sy + sh / 2;
                        linePoints = clippedBalloonToAnchorLine(balloonCenterX, balloonCenterY, radius, anchorX, anchorY, { x: sx, y: sy, w: sw, h: sh });
                    }
                    return (<react_konva_1.Group key={"balloon-group-".concat(b.balloonId)} x={balloonX} y={balloonY} listening={false}>
                                    {/* Hit target: children use listening={false}, so without this rect
                    the group receives no pointer events (no hover cursor, no drag). */}
                                    <react_konva_1.Rect x={0} y={0} width={balloonWidthPx} height={balloonHeightPx} fill="rgba(0,0,0,0.001)" listening={false}/>
                                    {linePoints && (<react_konva_1.Line key={"balloon-line-".concat(b.balloonId)} points={[
                                linePoints[0] - balloonX,
                                linePoints[1] - balloonY,
                                linePoints[2] - balloonX,
                                linePoints[3] - balloonY
                            ]} stroke={CALLOUT_STROKE} strokeWidth={2} listening={false}/>)}
                                    <react_konva_1.Circle key={"balloon-circle-".concat(b.balloonId)} x={balloonWidthPx / 2} y={balloonHeightPx / 2} radius={radius} fill={isSelected
                            ? "rgba(249,115,22,0.14)"
                            : "rgba(0,0,0,0)"} fillEnabled stroke={CALLOUT_STROKE} strokeWidth={isSelected ? 3 : 2} listening={false}/>
                                    <react_konva_1.Text key={"balloon-text-".concat(b.balloonId)} x={balloonWidthPx / 2 - radius} y={balloonHeightPx / 2 - radius} width={radius * 2} height={radius * 2} text={b.label} align="center" verticalAlign="middle" fill={CALLOUT_STROKE} fontStyle="bold" fontSize={balloonLabelFontSize} listening={false}/>
                                  </react_konva_1.Group>);
                })}
                            {previewRect && (<react_konva_1.Rect x={(previewRect.x / 100) * renderedWidth} y={(previewRect.y / 100) * overlayHeight} width={(previewRect.width / 100) * renderedWidth} height={(previewRect.height / 100) * overlayHeight} stroke={dragKind === "zoom"
                        ? "#2563eb"
                        : CALLOUT_STROKE} strokeWidth={2} fillEnabled={false}/>)}
                          </react_konva_1.Layer>
                        </react_konva_1.Stage>
                      </div>)}
                </div>) : (<button type="button" disabled={uploading} onClick={function () { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }} className="flex items-center justify-center min-w-full h-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer">
                  <react_1.VStack className="items-center gap-2">
                    {uploading ? (<lu_1.LuLoader className="h-12 w-12 opacity-30 animate-spin"/>) : (<lu_1.LuUpload className="h-12 w-12 opacity-30"/>)}
                    <p>
                      {uploading
                ? t(templateObject_48 || (templateObject_48 = __makeTemplateObject(["Uploading\u2026"], ["Uploading\u2026"]))) : t(templateObject_49 || (templateObject_49 = __makeTemplateObject(["Click to upload a PDF drawing"], ["Click to upload a PDF drawing"])))}
                    </p>
                  </react_1.VStack>
                </button>)}
              {annotationDraft &&
            annotationDraft.pageNumber === pdfViewPage &&
            renderedWidth > 0 &&
            overlayHeight > 0 && (<div className="absolute z-20 rounded-md border bg-background p-2 shadow-md" style={getAnnotationDialogPosition({
                renderedWidth: renderedWidth,
                overlayHeight: overlayHeight,
                totalPagesStage: 1,
                pageNumber: annotationDraft.pageNumber,
                x: annotationDraft.x,
                y: annotationDraft.y,
                width: annotationDraft.width,
                height: annotationDraft.height
            })}>
                    <react_1.VStack spacing={2} className="w-52">
                      <input className="h-8 w-full rounded border bg-background px-2 text-xs" placeholder={t(templateObject_50 || (templateObject_50 = __makeTemplateObject(["Annotation text"], ["Annotation text"])))} value={annotationDraft.text} onChange={function (event) {
                return setAnnotationDraft(function (prev) {
                    return prev ? __assign(__assign({}, prev), { text: event.target.value }) : prev;
                });
            }}/>
                      <input type="text" inputMode="numeric" className="h-8 w-full rounded border bg-background px-2 text-xs" placeholder={t(templateObject_51 || (templateObject_51 = __makeTemplateObject(["Text size"], ["Text size"])))} value={annotationFontSizeInput} onChange={function (event) {
                var raw = event.target.value;
                if (!/^\d*$/.test(raw))
                    return;
                setAnnotationFontSizeInput(raw);
                if (raw === "")
                    return;
                var parsed = Number(raw);
                if (!Number.isFinite(parsed))
                    return;
                setAnnotationDraft(function (prev) {
                    return prev
                        ? __assign(__assign({}, prev), { fontSize: Math.max(8, Math.min(48, parsed)) }) : prev;
                });
            }} onBlur={function () {
                var parsed = Number(annotationFontSizeInput || "12");
                var normalized = Math.max(8, Math.min(48, Number.isFinite(parsed) ? parsed : 12));
                setAnnotationFontSizeInput(String(normalized));
                setAnnotationDraft(function (prev) {
                    return prev ? __assign(__assign({}, prev), { fontSize: normalized }) : prev;
                });
            }}/>
                      <react_1.HStack spacing={1} className="justify-end">
                        <react_1.Button type="button" size="sm" variant="ghost" onClick={function () {
                setAnnotationDraft(null);
                setAnnotationFontSizeInput("12");
            }}>
                          {t(templateObject_52 || (templateObject_52 = __makeTemplateObject(["Cancel"], ["Cancel"])))}
                        </react_1.Button>
                        <react_1.Button type="button" size="sm" onClick={function () { return void handleCreateAnnotation(); }}>
                          {t(templateObject_53 || (templateObject_53 = __makeTemplateObject(["Add"], ["Add"])))}
                        </react_1.Button>
                      </react_1.HStack>
                    </react_1.VStack>
                  </div>)}
              {!annotationDraft &&
            annotationEditDraft &&
            annotationEditDraft.pageNumber === pdfViewPage &&
            renderedWidth > 0 &&
            overlayHeight > 0 && (<div className="absolute z-20 rounded-md border bg-background p-2 shadow-md" style={getAnnotationDialogPosition({
                renderedWidth: renderedWidth,
                overlayHeight: overlayHeight,
                totalPagesStage: 1,
                pageNumber: annotationEditDraft.pageNumber,
                x: annotationEditDraft.x,
                y: annotationEditDraft.y,
                width: annotationEditDraft.width,
                height: annotationEditDraft.height
            })}>
                    <react_1.VStack spacing={2} className="w-52">
                      <input className="h-8 w-full rounded border bg-background px-2 text-xs" placeholder={t(templateObject_54 || (templateObject_54 = __makeTemplateObject(["Annotation text"], ["Annotation text"])))} value={annotationEditDraft.text} onChange={function (event) {
                return setAnnotationEditDraft(function (prev) {
                    return prev ? __assign(__assign({}, prev), { text: event.target.value }) : prev;
                });
            }}/>
                      <input type="text" inputMode="numeric" className="h-8 w-full rounded border bg-background px-2 text-xs" placeholder={t(templateObject_55 || (templateObject_55 = __makeTemplateObject(["Text size"], ["Text size"])))} value={annotationEditFontSizeInput} onChange={function (event) {
                var raw = event.target.value;
                if (!/^\d*$/.test(raw))
                    return;
                setAnnotationEditFontSizeInput(raw);
                if (raw === "")
                    return;
                var parsed = Number(raw);
                if (!Number.isFinite(parsed))
                    return;
                setAnnotationEditDraft(function (prev) {
                    return prev
                        ? __assign(__assign({}, prev), { fontSize: Math.max(8, Math.min(48, parsed)) }) : prev;
                });
            }} onBlur={function () {
                var parsed = Number(annotationEditFontSizeInput || "12");
                var normalized = Math.max(8, Math.min(48, Number.isFinite(parsed) ? parsed : 12));
                setAnnotationEditFontSizeInput(String(normalized));
                setAnnotationEditDraft(function (prev) {
                    return prev ? __assign(__assign({}, prev), { fontSize: normalized }) : prev;
                });
            }}/>
                      <react_1.HStack spacing={1} className="justify-between">
                        <react_1.Button type="button" size="sm" variant="destructive" leftIcon={<lu_1.LuTrash2 />} onClick={function () { return void handleDeleteAnnotation(); }}>
                          {t(templateObject_56 || (templateObject_56 = __makeTemplateObject(["Delete"], ["Delete"])))}
                        </react_1.Button>
                        <react_1.HStack spacing={1}>
                          <react_1.Button type="button" size="sm" variant="ghost" onClick={function () {
                setSelectedAnnotationId(null);
                setAnnotationEditDraft(null);
            }}>
                            {t(templateObject_57 || (templateObject_57 = __makeTemplateObject(["Cancel"], ["Cancel"])))}
                          </react_1.Button>
                          <react_1.Button type="button" size="sm" onClick={function () { return void handleUpdateAnnotation(); }}>
                            {t(templateObject_58 || (templateObject_58 = __makeTemplateObject(["Update"], ["Update"])))}
                          </react_1.Button>
                        </react_1.HStack>
                      </react_1.HStack>
                    </react_1.VStack>
                  </div>)}
            </div>
          </div>

          {featuresTableExpanded ? (<div role="separator" aria-orientation="horizontal" aria-label={t(templateObject_59 || (templateObject_59 = __makeTemplateObject(["Drag to resize diagram and features"], ["Drag to resize diagram and features"])))} aria-valuenow={Math.round(pdfPaneHeightPx)} className={"group flex h-2 shrink-0 cursor-row-resize touch-none items-center justify-center rounded-md px-2 hover:bg-muted/80 ".concat(isResizingPdfFeatures ? "bg-muted" : "")} onMouseDown={onSplitResizeMouseDown}>
              <span className="h-1 w-14 shrink-0 rounded-full bg-muted-foreground/40 group-hover:bg-muted-foreground/65"/>
            </div>) : null}

          {/* Features table — form fields map to balloon columns; persisted on Save */}
          <div className={featuresTableExpanded
            ? "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg bg-card"
            : "flex max-h-[14rem] min-w-0 shrink-0 flex-col overflow-hidden rounded-lg bg-card"} style={featuresTableExpanded && editorStackHeightPx > 0
            ? { minHeight: editorStackHeightPx * 0.5 }
            : undefined}>
            <div className="flex min-h-10 flex-shrink-0 items-center justify-between gap-2 bg-muted/40 px-2 py-2 pl-3">
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                {t(templateObject_60 || (templateObject_60 = __makeTemplateObject(["Features"], ["Features"])))} ({featureRows.length})
              </span>
              <react_1.HStack spacing={1} className="flex-shrink-0 items-center">
                <react_1.Button type="button" variant="secondary" size="sm" leftIcon={<lu_1.LuPlus className="h-4 w-4"/>} onClick={handleAddFeature}>
                  {t(templateObject_61 || (templateObject_61 = __makeTemplateObject(["Add Feature"], ["Add Feature"])))}
                </react_1.Button>
                <react_1.IconButton type="button" variant="ghost" size="sm" aria-expanded={featuresTableExpanded} aria-label={featuresTableExpanded
            ? t(templateObject_62 || (templateObject_62 = __makeTemplateObject(["Collapse features table"], ["Collapse features table"]))) : t(templateObject_63 || (templateObject_63 = __makeTemplateObject(["Expand features table"], ["Expand features table"])))} icon={featuresTableExpanded ? (<lu_1.LuChevronDown className="h-4 w-4"/>) : (<lu_1.LuChevronUp className="h-4 w-4"/>)} onClick={function () { return setFeaturesTableExpanded(function (v) { return !v; }); }}/>
              </react_1.HStack>
            </div>
            <div className={featuresTableExpanded
            ? "min-h-0 flex-1 overflow-auto"
            : "overflow-hidden"}>
              <Grid_1.default data={featureRows} columns={featureColumns} editableComponents={featureEditableComponents} contained={false}/>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30, templateObject_31, templateObject_32, templateObject_33, templateObject_34, templateObject_35, templateObject_36, templateObject_37, templateObject_38, templateObject_39, templateObject_40, templateObject_41, templateObject_42, templateObject_43, templateObject_44, templateObject_45, templateObject_46, templateObject_47, templateObject_48, templateObject_49, templateObject_50, templateObject_51, templateObject_52, templateObject_53, templateObject_54, templateObject_55, templateObject_56, templateObject_57, templateObject_58, templateObject_59, templateObject_60, templateObject_61, templateObject_62, templateObject_63;
