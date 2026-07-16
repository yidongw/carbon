"use client";
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeCardWarning = TimeCardWarning;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
var CHECK_INTERVAL_MS = 5 * 60 * 1000;
var CLOCK_STORAGE_KEY = "timeclock-warning-ack";
function TimeCardWarning(_a) {
    var openClockEntry = _a.openClockEntry;
    var t = (0, macro_1.useLingui)().t;
    var locale = (0, i18n_1.useLocale)().locale;
    var _b = (0, react_2.useState)(false), showClockWarning = _b[0], setShowClockWarning = _b[1];
    var _c = (0, react_2.useState)(""), editClockOut = _c[0], setEditClockOut = _c[1];
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        if (!openClockEntry) {
            setShowClockWarning(false);
            return;
        }
        var checkStale = function () {
            var elapsed = Date.now() - new Date(openClockEntry.clockIn).getTime();
            if (elapsed < TWELVE_HOURS_MS) {
                setShowClockWarning(false);
                return;
            }
            var acked = sessionStorage.getItem(CLOCK_STORAGE_KEY);
            if (acked === openClockEntry.id) {
                setShowClockWarning(false);
                return;
            }
            setShowClockWarning(true);
        };
        checkStale();
        var interval = setInterval(checkStale, CHECK_INTERVAL_MS);
        return function () { return clearInterval(interval); };
    }, [openClockEntry]);
    (0, react_2.useEffect)(function () {
        if (fetcher.data && fetcher.state === "idle") {
            if (fetcher.data.success) {
                react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Updated successfully"], ["Updated successfully"]))));
                setShowClockWarning(false);
            }
        }
    }, [fetcher.data, fetcher.state, t]);
    var handleClockAcknowledge = function () {
        if (openClockEntry) {
            sessionStorage.setItem(CLOCK_STORAGE_KEY, openClockEntry.id);
        }
        setShowClockWarning(false);
    };
    var handleEditClockOut = function () {
        if (!editClockOut || !openClockEntry)
            return;
        var formData = new FormData();
        formData.append("intent", "clockOut");
        formData.append("clockOut", new Date(editClockOut).toISOString());
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.timecard
        });
    };
    if (showClockWarning && openClockEntry) {
        var hoursElapsed = Math.floor((Date.now() - new Date(openClockEntry.clockIn).getTime()) / 3600000);
        return (<react_1.Modal open onOpenChange={function () {
                /* intentionally non-dismissable */
            }}>
        <react_1.ModalContent>
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              <macro_1.Trans>Forgot to Clock Out?</macro_1.Trans>
            </react_1.ModalTitle>
            <react_1.ModalDescription>
              <macro_1.Trans>
                You've been clocked in for {hoursElapsed} hours. Did you forget
                to clock out?
              </macro_1.Trans>
            </react_1.ModalDescription>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <react_1.VStack spacing={4}>
              <p className="text-sm text-muted-foreground">
                <macro_1.Trans>
                  You clocked in at{" "}
                  {new Date(openClockEntry.clockIn).toLocaleString(locale)}. You
                  can edit your clock-out time below or acknowledge that you're
                  still working.
                </macro_1.Trans>
              </p>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  <macro_1.Trans>Set clock-out time</macro_1.Trans>
                </label>
                <react_1.Input type="datetime-local" value={editClockOut} onChange={function (e) { return setEditClockOut(e.target.value); }}/>
              </div>
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" onClick={handleClockAcknowledge}>
              <macro_1.Trans>I'm Still Working</macro_1.Trans>
            </react_1.Button>
            <react_1.Button onClick={handleEditClockOut} isDisabled={!editClockOut || fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"}>
              <macro_1.Trans>Set Clock Out</macro_1.Trans>
            </react_1.Button>
          </react_1.ModalFooter>
        </react_1.ModalContent>
      </react_1.Modal>);
    }
    return null;
}
var templateObject_1;
