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
exports.default = SplitBatchOverlay;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var configTableShared_1 = require("../Jobs/configTableShared");
var cellKey = function (color, size) {
    return "".concat(color !== null && color !== void 0 ? color : "", "|").concat(size !== null && size !== void 0 ? size : "");
};
var num = function (v) { return Number(v) || 0; };
/**
 * Split a Master Work Order's cut into Bundle Work Orders. Each row is a bundle
 * (existing bundles are editable; their reported quantity is shown and caps how
 * far down they can go). Add a bundle from the per-color/size buttons — one per
 * color/size that still has un-bundled cut remaining; none show when nothing is
 * left. Confirm creates the new bundles and updates the edited ones.
 */
function SplitBatchOverlay(_a) {
    var cells = _a.cells, existingBundles = _a.existingBundles, splitRows = _a.splitRows, masterDisplayId = _a.masterDisplayId, onDismiss = _a.onDismiss, fetcher = _a.fetcher, action = _a.action;
    var t = (0, macro_1.useLingui)().t;
    var cutByCell = (0, react_2.useMemo)(function () {
        var m = new Map();
        for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
            var c = cells_1[_i];
            m.set(cellKey(c.colorCode, c.sizeCode), c.cut);
        }
        return m;
    }, [cells]);
    var totalCut = (0, react_2.useMemo)(function () { return cells.reduce(function (s, c) { return s + c.cut; }, 0); }, [cells]);
    var _b = (0, react_2.useState)(function () {
        var _a;
        var existingRows = existingBundles.map(function (b) { return ({
            id: b.id,
            splitRowId: null,
            jobReadableId: b.jobReadableId,
            colorCode: b.colorCode,
            colorName: b.colorName,
            sizeCode: b.sizeCode,
            quantity: b.quantity,
            reportedQuantity: b.reportedQuantity
        }); });
        // Prefer the captured cut rows: one bundle per pending split row (carries its
        // id so saving materializes it).
        if (splitRows.length > 0) {
            var prefillRows_1 = splitRows.map(function (sr) { return ({
                id: null,
                splitRowId: sr.id,
                jobReadableId: null,
                colorCode: sr.colorCode,
                colorName: sr.colorName,
                sizeCode: sr.sizeCode,
                quantity: sr.quantity,
                reportedQuantity: 0
            }); });
            return __spreadArray(__spreadArray([], existingRows, true), prefillRows_1, true);
        }
        // Fallback (cuts with no captured rows): prefill the un-bundled cut per cell.
        var bundled = new Map();
        for (var _i = 0, existingBundles_1 = existingBundles; _i < existingBundles_1.length; _i++) {
            var b = existingBundles_1[_i];
            var k = cellKey(b.colorCode, b.sizeCode);
            bundled.set(k, ((_a = bundled.get(k)) !== null && _a !== void 0 ? _a : 0) + b.quantity);
        }
        var prefillRows = cells
            .map(function (c) {
            var _a;
            return ({
                c: c,
                remaining: c.cut - ((_a = bundled.get(cellKey(c.colorCode, c.sizeCode))) !== null && _a !== void 0 ? _a : 0)
            });
        })
            .filter(function (x) { return x.remaining > 0; })
            .map(function (_a) {
            var c = _a.c, remaining = _a.remaining;
            return ({
                id: null,
                splitRowId: null,
                jobReadableId: null,
                colorCode: c.colorCode,
                colorName: c.colorName,
                sizeCode: c.sizeCode,
                quantity: remaining,
                reportedQuantity: 0
            });
        });
        return __spreadArray(__spreadArray([], existingRows, true), prefillRows, true);
    }), rows = _b[0], setRows = _b[1];
    var enteredByCell = (0, react_2.useMemo)(function () {
        var _a;
        var m = new Map();
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var r = rows_1[_i];
            var k = cellKey(r.colorCode, r.sizeCode);
            m.set(k, ((_a = m.get(k)) !== null && _a !== void 0 ? _a : 0) + num(r.quantity));
        }
        return m;
    }, [rows]);
    var remainingFor = function (c) { var _a; return c.cut - ((_a = enteredByCell.get(cellKey(c.colorCode, c.sizeCode))) !== null && _a !== void 0 ? _a : 0); };
    var addableCells = cells.filter(function (c) { return remainingFor(c) > 0; });
    var total = rows.reduce(function (s, r) { return s + num(r.quantity); }, 0);
    var remaining = totalCut - total;
    var cellOver = function (color, size) { var _a, _b; return ((_a = enteredByCell.get(cellKey(color, size))) !== null && _a !== void 0 ? _a : 0) > ((_b = cutByCell.get(cellKey(color, size))) !== null && _b !== void 0 ? _b : 0); };
    var rowBelowReported = function (r) { return !!r.id && num(r.quantity) < r.reportedQuantity; };
    var hasOver = (0, react_2.useMemo)(function () {
        var _a;
        for (var _i = 0, enteredByCell_1 = enteredByCell; _i < enteredByCell_1.length; _i++) {
            var _b = enteredByCell_1[_i], k = _b[0], entered = _b[1];
            if (entered > ((_a = cutByCell.get(k)) !== null && _a !== void 0 ? _a : 0))
                return true;
        }
        return false;
    }, [enteredByCell, cutByCell]);
    var hasBelowReported = rows.some(rowBelowReported);
    var isSubmitting = fetcher.state !== "idle";
    var canConfirm = rows.length > 0 && !hasOver && !hasBelowReported && !isSubmitting;
    var updateQuantity = function (i, value) {
        return setRows(function (prev) { return prev.map(function (r, idx) { return (idx === i ? __assign(__assign({}, r), { quantity: value }) : r); }); });
    };
    var deleteRow = function (i) {
        return setRows(function (prev) { return prev.filter(function (_, idx) { return idx !== i; }); });
    };
    var addRow = function (c) {
        return setRows(function (prev) { return __spreadArray(__spreadArray([], prev, true), [
            {
                id: null,
                splitRowId: null,
                jobReadableId: null,
                colorCode: c.colorCode,
                colorName: c.colorName,
                sizeCode: c.sizeCode,
                quantity: remainingFor(c),
                reportedQuantity: 0
            }
        ], false); });
    };
    var handleConfirm = function () {
        if (!action || !canConfirm)
            return;
        var bundles = rows.map(function (r) {
            var _a, _b;
            return ({
                id: (_a = r.id) !== null && _a !== void 0 ? _a : undefined,
                splitRowId: (_b = r.splitRowId) !== null && _b !== void 0 ? _b : undefined,
                colorCode: r.colorCode,
                sizeCode: r.sizeCode,
                quantity: num(r.quantity)
            });
        });
        var formData = new FormData();
        formData.append("bundles", JSON.stringify(bundles));
        fetcher.submit(formData, { method: "post", action: action });
    };
    var inputClass = "h-8 w-24 rounded-md border bg-transparent px-2 text-sm tabular-nums focus:outline-none focus:ring-1";
    return (<div className={configTableShared_1.configParamsModalShellClassName}>
      <div className="shrink-0 border-b border-border px-6 py-4 pr-12">
        <h3 className="text-base font-medium font-headline tracking-tight text-foreground">
          <macro_1.Trans>Split Batch</macro_1.Trans>
        </h3>
        {masterDisplayId ? (<p className="mt-1 text-sm text-muted-foreground">{masterDisplayId}</p>) : null}
      </div>

      <div className={configTableShared_1.configParamsModalBodyClassName}>
        {rows.length === 0 && addableCells.length === 0 ? (<p className="py-8 text-center text-sm text-muted-foreground">
            <macro_1.Trans>Nothing left to split for this work order.</macro_1.Trans>
          </p>) : (<>
            {rows.length > 0 ? (<table className="w-full border-separate border-spacing-x-3 border-spacing-y-1 text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-1 py-1 text-left font-medium">
                      <macro_1.Trans>Bundle</macro_1.Trans>
                    </th>
                    <th className="px-1 py-1 text-left font-medium">
                      <macro_1.Trans>Size</macro_1.Trans>
                    </th>
                    <th className="px-1 py-1 text-left font-medium">
                      <macro_1.Trans>Color</macro_1.Trans>
                    </th>
                    <th className="px-1 py-1 text-left font-medium">
                      <macro_1.Trans>Quantity</macro_1.Trans>
                    </th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rows.map(function (r, i) {
                    var _a, _b, _c, _d, _e;
                    var over = cellOver(r.colorCode, r.sizeCode);
                    var below = rowBelowReported(r);
                    return (<tr key={(_a = r.id) !== null && _a !== void 0 ? _a : "new-".concat(i)}>
                        <td className="px-1 tabular-nums text-muted-foreground">
                          {(_b = r.jobReadableId) !== null && _b !== void 0 ? _b : (<span className="italic">
                              <macro_1.Trans>New</macro_1.Trans>
                            </span>)}
                        </td>
                        <td className="px-1 font-medium">{(_c = r.sizeCode) !== null && _c !== void 0 ? _c : "—"}</td>
                        <td className="px-1 font-medium">
                          {(_e = (_d = r.colorName) !== null && _d !== void 0 ? _d : r.colorCode) !== null && _e !== void 0 ? _e : "—"}
                        </td>
                        <td>
                          <input type="number" min={0} value={num(r.quantity)} onFocus={function (e) { return e.currentTarget.select(); }} onChange={function (e) {
                            return updateQuantity(i, Number(e.target.value) || 0);
                        }} className={(0, react_1.cn)(inputClass, over || below
                            ? "border-red-500 focus:ring-red-500 bg-red-50/40 dark:bg-red-950/30"
                            : "border-sky-300 dark:border-sky-700 focus:ring-ring")}/>
                        </td>
                        <td>
                          {r.id ? null : (<react_1.IconButton type="button" icon={<lu_1.LuTrash2 />} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Delete row"], ["Delete row"])))} variant="ghost" size="sm" onClick={function () { return deleteRow(i); }}/>)}
                        </td>
                      </tr>);
                })}
                </tbody>
              </table>) : null}

            {addableCells.length > 0 ? (<div className="mt-4 flex flex-wrap gap-2">
                {addableCells.map(function (c) {
                    var _a, _b, _c;
                    return (<react_1.Button key={cellKey(c.colorCode, c.sizeCode)} type="button" variant="secondary" size="sm" leftIcon={<lu_1.LuPlus />} onClick={function () { return addRow(c); }}>
                    {(_a = c.sizeCode) !== null && _a !== void 0 ? _a : "—"} · {(_c = (_b = c.colorName) !== null && _b !== void 0 ? _b : c.colorCode) !== null && _c !== void 0 ? _c : "—"} ·{" "}
                    <span className="tabular-nums">{remainingFor(c)}</span>
                  </react_1.Button>);
                })}
              </div>) : null}
          </>)}
      </div>

      <div className="shrink-0 border-t border-border px-6 py-4">
        <react_1.HStack className="justify-between">
          <react_1.HStack spacing={2}>
            <span className="text-sm text-muted-foreground">
              <macro_1.Trans>Remaining</macro_1.Trans>:{" "}
              <strong className={(0, react_1.cn)("tabular-nums", remaining < 0 ? "text-red-500" : "text-foreground")}>
                {remaining}
              </strong>
            </span>
            {hasOver ? (<react_1.Badge variant="red">
                <macro_1.Trans>Exceeds cut</macro_1.Trans>
              </react_1.Badge>) : null}
            {hasBelowReported ? (<react_1.Badge variant="red">
                <macro_1.Trans>Below reported</macro_1.Trans>
              </react_1.Badge>) : null}
          </react_1.HStack>
          <react_1.HStack className="gap-2">
            <react_1.Button type="button" variant="ghost" onClick={onDismiss}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <react_1.Button type="button" variant="primary" isDisabled={!canConfirm} isLoading={isSubmitting} onClick={handleConfirm}>
              <macro_1.Trans>Save</macro_1.Trans>
            </react_1.Button>
          </react_1.HStack>
        </react_1.HStack>
      </div>
    </div>);
}
var templateObject_1;
