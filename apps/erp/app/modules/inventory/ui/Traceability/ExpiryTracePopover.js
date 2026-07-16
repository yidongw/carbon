"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpiryTracePopover = ExpiryTracePopover;
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var STEP_ICON = {
    Source: <lu_1.LuPackage className="size-3.5"/>,
    Policy: <lu_1.LuShieldCheck className="size-3.5"/>,
    Inputs: <lu_1.LuLayers className="size-3.5"/>,
    Override: <lu_1.LuPencil className="size-3.5"/>,
    Resolved: <lu_1.LuCalendarCheck className="size-3.5"/>
};
/**
 * Hover-style popover that explains how the expirationDate column was
 * resolved. Same layout as PriceTracePopover so users get a single
 * mental model for "trace" UIs.
 *
 * Steps are derived from the row's attributes JSONB plus optional
 * caller-supplied policy + inputs. Returns the trigger as-is when there
 * is no expiry to trace (renders no popover).
 */
function ExpiryTracePopover(_a) {
    var entity = _a.entity, policy = _a.policy, inputs = _a.inputs, children = _a.children;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    if (!entity.expirationDate) {
        return <>{children}</>;
    }
    var steps = buildSteps(entity, policy, inputs, formatDate);
    return (<react_1.Popover>
      <react_1.PopoverTrigger asChild>
        <button type="button" className="cursor-help decoration-dotted underline-offset-2 hover:underline text-left">
          {children}
        </button>
      </react_1.PopoverTrigger>
      <react_1.PopoverContent align="end" sideOffset={8} className="w-[380px] p-0">
        {/* Header: tight, scannable. */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-sm font-semibold">
              <macro_1.Trans>Expiry trace</macro_1.Trans>
            </p>
          </div>
        </div>

        {/* Vertical timeline. Each step = icon column (with connector line)
            + content. Compact rows, two-line content (label + detail),
            right-aligned date when present. */}
        <ol className="px-4 py-3">
          {steps.map(function (step, i) {
            var isLast = i === steps.length - 1;
            var isResolved = step.step === "Resolved";
            return (<li key={i} className="grid grid-cols-[20px_1fr_auto] gap-x-3 gap-y-0">
                {/* Icon + connector */}
                <div className="flex flex-col items-center">
                  <span className={isResolved
                    ? "flex h-5 w-5 items-center justify-center rounded-full text-emerald-500"
                    : "flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground"}>
                    {STEP_ICON[step.step]}
                  </span>
                  {!isLast && (<span className="w-px flex-1 bg-border min-h-3"/>)}
                </div>

                {/* Content */}
                <div className={"min-w-0 " + (isLast ? "pb-0" : "pb-3")}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-wide font-medium text-muted-foreground">
                      {step.step}
                    </span>
                  </div>
                  {step.href ? (<react_router_1.Link to={step.href} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline decoration-dotted underline-offset-2 inline-flex items-center gap-1 min-w-0 max-w-full">
                      <span className="truncate">{step.label}</span>
                      <lu_1.LuExternalLink className="size-3 shrink-0 text-muted-foreground"/>
                    </react_router_1.Link>) : (<div className="text-sm font-medium truncate">
                      {step.label}
                    </div>)}
                  {step.detail && (<div className="text-xs text-muted-foreground truncate" title={step.detail}>
                      {step.detail}
                    </div>)}
                </div>

                {/* Date column */}
                <div className={"text-xs font-mono tabular-nums whitespace-nowrap pt-3.5 " +
                    (isResolved
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground")}>
                  {step.date ? formatDate(step.date) : ""}
                </div>
              </li>);
        })}
        </ol>
      </react_1.PopoverContent>
    </react_1.Popover>);
}
/**
 * Build the trace from the row's attributes blob. Pulls in policy + inputs
 * if the caller passed them; otherwise emits the steps it can derive.
 */
function buildSteps(entity, policy, inputs, formatDate) {
    var _a, _b, _c, _d, _e, _f, _g;
    var attrs = ((_a = entity.attributes) !== null && _a !== void 0 ? _a : {});
    var out = [];
    // 1. Source: how the entity got created. Use the entity's createdAt as
    // the Source row's date — that's when the receipt / production / split
    // happened. For receipt-source entities this is the goods-in date.
    var sourceDate = (_b = entity.createdAt) !== null && _b !== void 0 ? _b : null;
    var splitFrom = attrs["Split Entity ID"];
    var receiptId = attrs.Receipt;
    var jobId = attrs.Job;
    var adjustment = attrs["Inventory Adjustment"];
    if (typeof splitFrom === "string" && splitFrom) {
        out.push({
            step: "Source",
            label: "Split from another batch",
            detail: "Parent ".concat(splitFrom),
            date: sourceDate
        });
    }
    else if (typeof receiptId === "string" && receiptId) {
        out.push({
            step: "Source",
            label: "Goods receipt",
            detail: (_c = entity.sourceDocumentReadableId) !== null && _c !== void 0 ? _c : receiptId,
            href: path_1.path.to.receipt(receiptId),
            date: sourceDate
        });
    }
    else if (typeof jobId === "string" && jobId) {
        out.push({
            step: "Source",
            label: "Production output",
            detail: (_d = entity.sourceDocumentReadableId) !== null && _d !== void 0 ? _d : jobId,
            href: path_1.path.to.job(jobId),
            date: sourceDate
        });
    }
    else if (adjustment && typeof adjustment === "object") {
        out.push({
            step: "Source",
            label: "Manual inventory adjustment",
            detail: adjustment.at
                ? "Recorded ".concat(formatDate(adjustment.at))
                : ((_e = entity.sourceDocumentReadableId) !== null && _e !== void 0 ? _e : undefined),
            date: sourceDate
        });
    }
    else {
        out.push({
            step: "Source",
            label: (_f = entity.sourceDocument) !== null && _f !== void 0 ? _f : "Unknown",
            detail: (_g = entity.sourceDocumentReadableId) !== null && _g !== void 0 ? _g : undefined,
            date: sourceDate
        });
    }
    // 2. Policy: itemShelfLife mode (when caller passed it).
    if (policy === null || policy === void 0 ? void 0 : policy.mode) {
        var baseDetail = policy.mode === "Fixed Duration" && policy.days
            ? "".concat(policy.days, " day").concat(policy.days === 1 ? "" : "s", " from trigger")
            : policy.mode === "Calculated"
                ? "MIN expiry across consumed inputs"
                : "Date entered at receipt";
        var detailParts = [baseDetail];
        if (policy.mode === "Fixed Duration" && policy.calculateFromBom) {
            detailParts.push("Capped by earliest input expiry");
        }
        out.push({
            step: "Policy",
            label: policy.mode,
            detail: detailParts.join(" · "),
            date: computePolicyDate(policy, entity, inputs, attrs, sourceDate)
        });
    }
    // 3. Inputs: only meaningful for Calculated mode.
    if ((policy === null || policy === void 0 ? void 0 : policy.mode) === "Calculated" && inputs && inputs.length > 0) {
        inputs.forEach(function (input) {
            var _a;
            out.push({
                step: "Inputs",
                label: (_a = input.label) !== null && _a !== void 0 ? _a : input.id,
                detail: input.expirationDate ? undefined : "no expiry",
                date: input.expirationDate
            });
        });
    }
    // 4. Manual overrides recorded by updateTrackedEntityExpiry. Each entry
    // shows the date set, the reason, and when it was applied.
    var overrides = Array.isArray(attrs.expiryOverrides)
        ? attrs.expiryOverrides
        : [];
    overrides.forEach(function (o) {
        var _a, _b;
        var detailParts = [];
        if (o.source)
            detailParts.push(o.source);
        if (o.at)
            detailParts.push("recorded ".concat(formatDate(o.at)));
        out.push({
            step: "Override",
            label: (_a = o.reason) !== null && _a !== void 0 ? _a : "Manual override",
            detail: detailParts.length ? detailParts.join(" · ") : undefined,
            date: (_b = o.next) !== null && _b !== void 0 ? _b : null
        });
    });
    // 5. Resolved.
    out.push({
        step: "Resolved",
        label: "Final expiration date",
        date: entity.expirationDate
    });
    return out;
}
/**
 * Date the policy *originally produced*, before any manual overrides.
 * Falls back to the current expirationDate when there are no overrides
 * (since the resolved value is the policy output in that case).
 */
function computePolicyDate(policy, entity, inputs, attrs, sourceDate) {
    var _a;
    var overrides = Array.isArray(attrs.expiryOverrides)
        ? attrs.expiryOverrides
        : [];
    if (overrides.length > 0 && typeof overrides[0].previous === "string") {
        return overrides[0].previous;
    }
    if (policy.mode === "Fixed Duration" && policy.days && sourceDate) {
        try {
            var calendarDate = sourceDate.includes("T")
                ? (0, date_1.toCalendarDate)((0, date_1.parseAbsolute)(sourceDate, (0, date_1.getLocalTimeZone)()))
                : (0, date_1.parseDate)(sourceDate);
            return calendarDate.add({ days: policy.days }).toString();
        }
        catch (_b) {
            // fall through to default
        }
    }
    if (policy.mode === "Calculated" && inputs && inputs.length > 0) {
        var dates = inputs
            .map(function (i) { return i.expirationDate; })
            .filter(function (d) { return typeof d === "string" && d.length > 0; })
            .sort();
        if (dates.length > 0)
            return dates[0];
    }
    return (_a = entity.expirationDate) !== null && _a !== void 0 ? _a : null;
}
