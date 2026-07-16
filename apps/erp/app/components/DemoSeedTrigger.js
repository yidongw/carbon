"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoSeedTrigger = DemoSeedTrigger;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var TOAST_ID = "demo-seed";
/**
 * Rendered only while in a demo company. The first time the demo is unseeded it
 * kicks off the (detached, server-side) seed and shows a live progress toast that
 * polls real row counts until seeding completes, then revalidates so the freshly
 * seeded data shows up. Renders nothing.
 */
function DemoSeedTrigger(_a) {
    var needsSeed = _a.needsSeed, status = _a.status;
    var t = (0, macro_1.useLingui)().t;
    var trigger = (0, react_router_1.useFetcher)();
    var poll = (0, react_router_1.useFetcher)();
    var revalidator = (0, react_router_1.useRevalidator)();
    var startedRef = (0, react_2.useRef)(false);
    var intervalRef = (0, react_2.useRef)(null);
    var doneRef = (0, react_2.useRef)(false);
    var pollCountRef = (0, react_2.useRef)(0);
    (0, react_2.useEffect)(function () {
        if (startedRef.current)
            return;
        // Seed when the demo is empty (needsSeed), or just resume polling if a seed is
        // already running (e.g. after a refresh mid-seed).
        if (!needsSeed && status !== "seeding")
            return;
        startedRef.current = true;
        if (needsSeed) {
            trigger.submit(null, { method: "post", action: path_1.path.to.demoSeed });
        }
        react_1.toast.loading(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Setting up your demo data\u2026"], ["Setting up your demo data\u2026"]))), {
            id: TOAST_ID,
            duration: Number.POSITIVE_INFINITY
        });
        poll.load(path_1.path.to.demoSeed);
        // Run once on mount. Deps must stay [] — a [status] dep would clear this
        // interval (and not restart it, due to startedRef) the moment the loader
        // revalidates pending → seeding, killing the progress updates.
        intervalRef.current = setInterval(function () { return poll.load(path_1.path.to.demoSeed); }, 3000);
        return function () {
            if (intervalRef.current)
                clearInterval(intervalRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    (0, react_2.useEffect)(function () {
        var _a, _b, _c, _d;
        var data = poll.data;
        if (!data || doneRef.current)
            return;
        pollCountRef.current += 1;
        var items = (_b = (_a = data.counts) === null || _a === void 0 ? void 0 : _a.items) !== null && _b !== void 0 ? _b : 0;
        var total = (_d = (_c = data.counts) === null || _c === void 0 ? void 0 : _c.total) !== null && _d !== void 0 ? _d : 0;
        // Done when the seed has actually produced data (not just a stale `seeded` flag),
        // when there's no demo to seed, or after a safety cap (~5 min).
        var finished = (data.status === "seeded" && items > 0) ||
            data.status === "none" ||
            pollCountRef.current > 100;
        if (finished) {
            doneRef.current = true;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (items > 0) {
                react_1.toast.success(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Your demo is ready \u2014 explore every module!"], ["Your demo is ready \u2014 explore every module!"]))), {
                    id: TOAST_ID,
                    duration: 5000
                });
                revalidator.revalidate();
            }
            else {
                react_1.toast.dismiss(TOAST_ID);
            }
            return;
        }
        react_1.toast.loading(total > 0
            ? t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Getting your demo workspace ready \u2014 ", " records so far\u2026"], ["Getting your demo workspace ready \u2014 ", " records so far\u2026"])), total) : t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Getting your demo workspace ready\u2026"], ["Getting your demo workspace ready\u2026"]))), { id: TOAST_ID, duration: Number.POSITIVE_INFINITY });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [poll.data]);
    return null;
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
