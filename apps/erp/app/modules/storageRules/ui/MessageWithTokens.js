"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MessageWithTokens;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
/**
 * Maps each surface to the ctx-block keys whose fields will be populated
 * at eval time. Used to filter the FIELD_REGISTRY into a relevant
 * suggestion list.
 */
var CTX_KEYS_BY_SURFACE = {
    receipt: ["storage", "transaction"],
    shipment: ["storage", "transaction"],
    stockTransfer: ["storage", "transaction"],
    warehouseTransfer: ["storage", "transaction"],
    inventoryAdjustment: ["storage", "transaction"],
    place: ["storage", "transaction"],
    pick: ["storage", "transaction"],
    operationStart: ["workCenter", "operation", "transaction"],
    operationFinish: ["workCenter", "operation", "transaction"],
    materialIssue: ["workCenter", "operation", "transaction"],
    materialReceive: ["workCenter", "operation", "transaction"]
};
var CONTEXT_LABELS = {
    item: "Item",
    storage: "Storage unit",
    workCenter: "Work center",
    operation: "Operation",
    transaction: "Transaction"
};
// Index `FIELD_REGISTRY` once at module scope. The original code re-filtered
// the registry for each context on every `groups` recompute (one filter
// per ctx key on every conditions/surfaces change). One pass at load,
// bucketed by context — `O(n)` once instead of `O(n)` per ctx per render.
var FIELDS_BY_CTX = {
    item: [],
    storage: [],
    workCenter: [],
    operation: [],
    transaction: []
};
for (var _i = 0, FIELD_REGISTRY_1 = utils_1.FIELD_REGISTRY; _i < FIELD_REGISTRY_1.length; _i++) {
    var f = FIELD_REGISTRY_1[_i];
    FIELDS_BY_CTX[f.context].push(f);
}
// Stable references for default values. `surfacesValue ?? []` would
// allocate a fresh `[]` every render, busting the `groups` memo — and
// re-running the per-condition token assembly even when nothing changed.
var EMPTY_SURFACES = [];
var ORDERED_CTX = ["storage", "transaction"];
// Hoist the static icon node — re-rendering the parent doesn't need to
// reallocate the icon element (rendering-hoist-jsx).
var BRACES_ICON = <lu_1.LuBraces />;
// Mirror of the runtime `TOKEN_RE` in packages/utils/src/storageRules.ts so the
// editor highlights exactly what `interpolateMessage` will substitute — no
// false greens, no missed reds. Inlined rather than re-exported to avoid a
// UI → runtime import cycle.
var TOKEN_RE = /\{(condition\[\d+\]\.(?:field|operator|value|name)|[a-zA-Z_][\w.]*)\}/g;
// Runtime accepts arbitrary suffixes under `item.customFields.*` via the
// generic dotted-path resolver. Treat any such token as known so the editor
// stops painting valid custom-field references as errors.
var CUSTOM_FIELD_PREFIX = "item.customFields.";
// Only background + ring — text stays `text-transparent` (inherited from
// the overlay) so the textarea's real glyphs show through cleanly. Adding a
// text color here would render duplicate, mis-aligned text on top of the
// caret layer.
var KNOWN_TOKEN_CLS = "rounded-sm bg-blue-500/25 ring-1 ring-blue-500/50";
var UNKNOWN_TOKEN_CLS = "rounded-sm bg-destructive/20 ring-1 ring-destructive/50";
function MessageWithTokens(_a) {
    var _b;
    var name = _a.name, label = _a.label, conditions = _a.conditions, _c = _a.surfacesFieldName, surfacesFieldName = _c === void 0 ? "surfaces" : _c, targetType = _a.targetType;
    var t = (0, macro_1.useLingui)().t;
    var textareaRef = (0, react_2.useRef)(null);
    var overlayRef = (0, react_2.useRef)(null);
    var surfacesValue = (0, form_1.useControlField)(surfacesFieldName)[0];
    var surfaces = surfacesValue !== null && surfacesValue !== void 0 ? surfacesValue : EMPTY_SURFACES;
    var _d = (0, form_1.useField)(name), getInputProps = _d.getInputProps, error = _d.error, defaultValue = _d.defaultValue;
    var _e = (0, form_1.useControlField)(name), value = _e[0], setValue = _e[1];
    var text = ((_b = value !== null && value !== void 0 ? value : defaultValue) !== null && _b !== void 0 ? _b : "");
    var formState = (0, form_1.useFormStateContext)();
    var isDisabled = formState.isDisabled;
    var isReadOnly = formState.isReadOnly;
    var isLocked = isDisabled || isReadOnly;
    var insertToken = (0, react_2.useCallback)(function (token) {
        var _a, _b;
        var el = textareaRef.current;
        if (!el)
            return;
        var start = (_a = el.selectionStart) !== null && _a !== void 0 ? _a : el.value.length;
        var end = (_b = el.selectionEnd) !== null && _b !== void 0 ? _b : el.value.length;
        var insertion = "{".concat(token, "}");
        var next = el.value.slice(0, start) + insertion + el.value.slice(end);
        setValue(next);
        // Defer so React commits the new value before we move the caret.
        requestAnimationFrame(function () {
            var ta = textareaRef.current;
            if (!ta)
                return;
            var cursor = start + insertion.length;
            ta.setSelectionRange(cursor, cursor);
            ta.focus();
        });
    }, [setValue]);
    // One handler for all token rows. Each item stamps its token onto
    // `data-token`; we read it off the event target instead of allocating a
    // fresh `() => insertToken(tok.token)` closure per item per render.
    var handleTokenSelect = (0, react_2.useCallback)(function (e) {
        var token = e.currentTarget.dataset.token;
        if (token)
            insertToken(token);
    }, [insertToken]);
    var syncScroll = (0, react_2.useCallback)(function () {
        var ta = textareaRef.current;
        var ov = overlayRef.current;
        if (!ta || !ov)
            return;
        ov.scrollTop = ta.scrollTop;
        ov.scrollLeft = ta.scrollLeft;
    }, []);
    var groups = (0, react_2.useMemo)(function () {
        var out = [];
        var conds = conditions !== null && conditions !== void 0 ? conditions : [];
        // Field pool scoped to the rule's targetType; falls back to full registry
        // when not provided (legacy usage).
        var scopedFieldsByCtx = {};
        if (targetType) {
            var pool = (0, utils_1.getFieldsForTargetType)(targetType);
            for (var _i = 0, pool_1 = pool; _i < pool_1.length; _i++) {
                var f = pool_1[_i];
                var bucket = scopedFieldsByCtx[f.context];
                if (bucket)
                    bucket.push(f);
                else
                    scopedFieldsByCtx[f.context] = [f];
            }
        }
        var fieldsForCtx = function (ctx) { var _a; return targetType ? ((_a = scopedFieldsByCtx[ctx]) !== null && _a !== void 0 ? _a : []) : FIELDS_BY_CTX[ctx]; };
        // 1. Per-condition tokens.
        conds.forEach(function (c, i) {
            var _a;
            var def = (0, utils_1.getFieldDef)(c.field);
            out.push({
                heading: "Condition ".concat(i + 1, ": ").concat((_a = def === null || def === void 0 ? void 0 : def.label) !== null && _a !== void 0 ? _a : c.field),
                tokens: [
                    {
                        token: "condition[".concat(i, "].field"),
                        description: "Field name"
                    },
                    {
                        token: "condition[".concat(i, "].operator"),
                        description: "Operator"
                    },
                    {
                        token: "condition[".concat(i, "].value"),
                        description: "Required value (raw id/input)"
                    },
                    {
                        token: "condition[".concat(i, "].name"),
                        description: "Required value (label)"
                    }
                ]
            });
        });
        // 2. Item ctx tokens — populated when item context is in scope. For
        //    workCenter rules the item is only available via `operation.itemId`,
        //    so suppress the item header entirely.
        if (!targetType || targetType !== "workCenter") {
            var itemTokens = [
                // `item.id` is readable id (e.g. "PART-001"), not UUID — see
                // `evaluateLinesForSurface` where ctx is normalised.
                { token: "item.id", description: "Readable ID (e.g. PART-001)" },
                { token: "item.name", description: "Display name" }
            ];
            for (var _a = 0, _b = fieldsForCtx("item"); _a < _b.length; _a++) {
                var f = _b[_a];
                itemTokens.push({ token: f.path, description: f.label });
            }
            out.push({ heading: CONTEXT_LABELS.item, tokens: itemTokens });
        }
        // 3. Surface-relevant ctx tokens. Compute the union of ctx keys
        //    populated by any selected surface; hide groups no surface uses.
        var allowedCtx = new Set();
        for (var _c = 0, surfaces_1 = surfaces; _c < surfaces_1.length; _c++) {
            var s = surfaces_1[_c];
            var keys = CTX_KEYS_BY_SURFACE[s];
            if (!keys)
                continue;
            for (var _d = 0, keys_1 = keys; _d < keys_1.length; _d++) {
                var k = keys_1[_d];
                allowedCtx.add(k);
            }
        }
        for (var _e = 0, ORDERED_CTX_1 = ORDERED_CTX; _e < ORDERED_CTX_1.length; _e++) {
            var ctxKey = ORDERED_CTX_1[_e];
            if (!allowedCtx.has(ctxKey))
                continue;
            var fields = fieldsForCtx(ctxKey);
            if (fields.length === 0)
                continue;
            var tokens = [];
            for (var _f = 0, fields_1 = fields; _f < fields_1.length; _f++) {
                var f = fields_1[_f];
                tokens.push({ token: f.path, description: f.label });
            }
            out.push({ heading: CONTEXT_LABELS[ctxKey], tokens: tokens });
        }
        return out;
    }, [conditions, surfaces, targetType]);
    var knownTokens = (0, react_2.useMemo)(function () {
        var set = new Set();
        for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
            var g = groups_1[_i];
            for (var _a = 0, _b = g.tokens; _a < _b.length; _a++) {
                var tok = _b[_a];
                set.add(tok.token);
            }
        }
        return set;
    }, [groups]);
    // Single-pass element emit. Skips the intermediate `parts` array
    // allocation, the iterator object from `matchAll`, and the per-segment
    // shape objects. Reset `lastIndex` because `TOKEN_RE` is a shared
    // module-scope `/g` regex.
    var highlighted = (0, react_2.useMemo)(function () {
        var _a;
        var out = [];
        TOKEN_RE.lastIndex = 0;
        var last = 0;
        var key = 0;
        var m;
        while ((m = TOKEN_RE.exec(text)) !== null) {
            var idx = m.index;
            if (idx > last)
                out.push(text.slice(last, idx));
            var inner = (_a = m[1]) !== null && _a !== void 0 ? _a : "";
            var known = knownTokens.has(inner) || inner.startsWith(CUSTOM_FIELD_PREFIX);
            out.push(<mark key={key++} className={known ? KNOWN_TOKEN_CLS : UNKNOWN_TOKEN_CLS}>
          {m[0]}
        </mark>);
            last = idx + m[0].length;
            // Defensive: zero-length match would loop forever. The regex can't
            // match empty since it requires at least `{` + ident + `}`, but the
            // bump keeps a future regex change safe.
            if (m[0].length === 0)
                TOKEN_RE.lastIndex++;
        }
        if (last < text.length)
            out.push(text.slice(last));
        return out;
    }, [text, knownTokens]);
    // Identical typography between the overlay and the textarea — any drift
    // here desyncs the highlighted rectangles from the rendered glyphs.
    var sharedTypography = "px-3 py-2 text-sm leading-[1.25rem] font-sans whitespace-pre-wrap break-words";
    var inputProps = getInputProps({
        id: name,
        placeholder: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Shown to the user when this rule fails."], ["Shown to the user when this rule fails."])))
    });
    return (<react_1.FormControl isInvalid={!!error}>
      {label && <react_1.FormLabel htmlFor={name}>{label}</react_1.FormLabel>}
      <div className="relative w-full">
        <div ref={overlayRef} aria-hidden="true" 
    // `pb-[1lh]` reserves a trailing line so the overlay's last row
    // stays glued to the textarea's last row — without it an
    // unterminated final line gets clipped on scroll.
    className={(0, react_1.cn)("pointer-events-none absolute inset-0 overflow-hidden rounded-md border border-transparent text-transparent pb-[1lh]", sharedTypography, isDisabled && "opacity-50", isReadOnly && "bg-muted")}>
          {highlighted}
        </div>
        <textarea {...inputProps} ref={textareaRef} value={text} onChange={function (e) {
            var _a;
            setValue(e.target.value);
            (_a = inputProps.onChange) === null || _a === void 0 ? void 0 : _a.call(inputProps, e);
        }} onBlur={function (e) { var _a; return (_a = inputProps.onBlur) === null || _a === void 0 ? void 0 : _a.call(inputProps, e); }} onScroll={syncScroll} disabled={isDisabled} readOnly={isReadOnly} className={(0, react_1.cn)("relative flex min-h-[2lh] max-h-[10lh] w-full rounded-md border border-input bg-transparent ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-muted read-only:cursor-not-allowed", sharedTypography)}/>
      </div>
      {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
      <react_1.HStack className="justify-end mt-2">
        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.Button variant="ghost" size="sm" leftIcon={BRACES_ICON} isDisabled={isLocked}>
              <macro_1.Trans>Insert token</macro_1.Trans>
            </react_1.Button>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent className="max-h-[420px] overflow-y-auto">
            {groups.map(function (group, gi) { return (<react_1.DropdownMenuGroup key={"".concat(group.heading, "-").concat(gi)}>
                {gi > 0 && <react_1.DropdownMenuSeparator />}
                <react_1.DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-wider">
                  {group.heading}
                </react_1.DropdownMenuLabel>
                {group.tokens.map(function (tok) { return (<react_1.DropdownMenuItem key={tok.token} data-token={tok.token} onClick={handleTokenSelect} className="flex items-center gap-2">
                    <span className="font-mono text-xs">{"{".concat(tok.token, "}")}</span>
                    <span className="text-muted-foreground text-xs">
                      {tok.description}
                    </span>
                  </react_1.DropdownMenuItem>); })}
              </react_1.DropdownMenuGroup>); })}
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </react_1.HStack>
    </react_1.FormControl>);
}
var templateObject_1;
