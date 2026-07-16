"use client";
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.PinInOverlay = PinInOverlay;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var RECENT_KEY_PREFIX = "console-recent-";
var MAX_RECENT = 5;
function getRecentOperators(companyId) {
    try {
        var raw = localStorage.getItem("".concat(RECENT_KEY_PREFIX).concat(companyId));
        return raw ? JSON.parse(raw) : [];
    }
    catch (_a) {
        return [];
    }
}
function addRecentOperator(companyId, userId) {
    try {
        var recent = getRecentOperators(companyId).filter(function (id) { return id !== userId; });
        recent.unshift(userId);
        localStorage.setItem("".concat(RECENT_KEY_PREFIX).concat(companyId), JSON.stringify(recent.slice(0, MAX_RECENT)));
    }
    catch (_a) {
        // localStorage not available
    }
}
function PinInOverlay(_a) {
    var companyId = _a.companyId, locationEmployeeIds = _a.locationEmployeeIds, sessionUserId = _a.sessionUserId, _b = _a.hasPinnedUser, hasPinnedUser = _b === void 0 ? false : _b, _c = _a.dismissable, dismissable = _c === void 0 ? false : _c, onDismiss = _a.onDismiss;
    var t = (0, macro_1.useLingui)().t;
    var formatPersonName = (0, hooks_1.useFormatPersonName)();
    var people = (0, stores_1.usePeople)()[0];
    var _d = (0, react_2.useState)(""), search = _d[0], setSearch = _d[1];
    var _e = (0, react_2.useState)(null), selectedPerson = _e[0], setSelectedPerson = _e[1];
    var _f = (0, react_2.useState)(""), pin = _f[0], setPin = _f[1];
    var _g = (0, react_2.useState)(null), pinError = _g[0], setPinError = _g[1];
    var searchRef = (0, react_2.useRef)(null);
    var pinInFetcher = (0, react_router_1.useFetcher)();
    var pinOutFetcher = (0, react_router_1.useFetcher)();
    var recentIds = (0, react_2.useMemo)(function () { return getRecentOperators(companyId); }, [companyId]);
    var isPinning = pinInFetcher.state !== "idle";
    (0, react_2.useEffect)(function () {
        if (!dismissable)
            return;
        var handleKeyDown = function (e) {
            if (e.key === "Escape")
                onDismiss === null || onDismiss === void 0 ? void 0 : onDismiss();
        };
        document.addEventListener("keydown", handleKeyDown);
        return function () { return document.removeEventListener("keydown", handleKeyDown); };
    }, [dismissable, onDismiss]);
    var getPersonName = (0, react_2.useCallback)(function (person) {
        return formatPersonName({
            firstName: person.firstName,
            lastName: person.lastName,
            fullName: person.name
        }) || person.name;
    }, [formatPersonName]);
    var submitPinIn = (0, react_2.useCallback)(function (person, pinValue) {
        var _a;
        addRecentOperator(companyId, person.id);
        var formData = new FormData();
        formData.append("userId", person.id);
        formData.append("name", getPersonName(person));
        formData.append("avatarUrl", (_a = person.avatarUrl) !== null && _a !== void 0 ? _a : "");
        if (pinValue)
            formData.append("pin", pinValue);
        pinInFetcher.submit(formData, {
            method: "POST",
            action: path_1.path.to.consolePinIn
        });
    }, [companyId, getPersonName, pinInFetcher]);
    (0, react_2.useEffect)(function () {
        var _a;
        if (pinInFetcher.state === "idle" && ((_a = pinInFetcher.data) === null || _a === void 0 ? void 0 : _a.error)) {
            setPinError(pinInFetcher.data.error);
            setPin("");
        }
    }, [pinInFetcher.state, pinInFetcher.data]);
    // Focus search on mount
    (0, react_2.useEffect)(function () {
        var _a;
        (_a = searchRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    }, []);
    var stationUser = (0, react_2.useMemo)(function () { return (sessionUserId ? people.find(function (p) { return p.id === sessionUserId; }) : null); }, [people, sessionUserId]);
    var operatorList = (0, react_2.useMemo)(function () {
        var query = search.toLowerCase().trim();
        var list = sessionUserId
            ? people.filter(function (p) { return p.id !== sessionUserId; })
            : people;
        if (locationEmployeeIds.length > 0) {
            list = list.filter(function (p) { return locationEmployeeIds.includes(p.id); });
        }
        var filtered = query
            ? list.filter(function (p) {
                var _a, _b;
                var displayName = getPersonName(p).toLowerCase();
                return (displayName.includes(query) ||
                    ((_a = p.firstName) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(query)) ||
                    ((_b = p.lastName) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(query)) ||
                    p.name.toLowerCase().includes(query));
            })
            : list;
        var sorted = __spreadArray([], filtered, true).sort(function (a, b) {
            var aRecent = recentIds.indexOf(a.id);
            var bRecent = recentIds.indexOf(b.id);
            if (aRecent !== -1 && bRecent !== -1)
                return aRecent - bRecent;
            if (aRecent !== -1)
                return -1;
            if (bRecent !== -1)
                return 1;
            return getPersonName(a).localeCompare(getPersonName(b));
        });
        // When searching, return flat list. When browsing, split into groups.
        if (query) {
            return { recent: [], others: sorted, all: sorted };
        }
        var recent = sorted.filter(function (p) { return recentIds.includes(p.id); });
        var others = sorted.filter(function (p) { return !recentIds.includes(p.id); });
        return { recent: recent, others: others, all: sorted };
    }, [
        getPersonName,
        people,
        search,
        recentIds,
        locationEmployeeIds,
        sessionUserId
    ]);
    // Track if we've submitted a pin-in attempt
    var hasSubmittedPinIn = (0, react_2.useRef)(false);
    // Watch for successful pin-in completion
    (0, react_2.useEffect)(function () {
        var _a;
        if (pinInFetcher.state === "submitting" ||
            pinInFetcher.state === "loading") {
            hasSubmittedPinIn.current = true;
        }
        if (hasSubmittedPinIn.current &&
            pinInFetcher.state === "idle" &&
            !((_a = pinInFetcher.data) === null || _a === void 0 ? void 0 : _a.error)) {
            // Fetcher completed without error — cookie is set, dismiss overlay
            hasSubmittedPinIn.current = false;
            onDismiss === null || onDismiss === void 0 ? void 0 : onDismiss();
        }
    }, [pinInFetcher.state, pinInFetcher.data, onDismiss]);
    var handlePinComplete = (0, react_2.useCallback)(function (value) {
        if (selectedPerson && value.length === 4) {
            submitPinIn(selectedPerson, value);
            // Don't dismiss here — wait for fetcher to complete
        }
    }, [selectedPerson, submitPinIn]);
    var handleBackdropClick = (0, react_2.useCallback)(function () {
        if (dismissable)
            onDismiss === null || onDismiss === void 0 ? void 0 : onDismiss();
    }, [dismissable, onDismiss]);
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={handleBackdropClick}>
      <div className="w-full max-w-sm mx-4 rounded-2xl border bg-card shadow-2xl overflow-hidden relative" onClick={function (e) { return e.stopPropagation(); }}>
        {/* Close button — top right, outside the search bar */}
        {dismissable && (<button type="button" onClick={onDismiss} className="absolute top-2.5 right-2.5 z-10 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <lu_1.LuX className="h-4 w-4"/>
          </button>)}

        {/* Search */}
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <lu_1.LuSearch className="h-4 w-4 text-muted-foreground shrink-0"/>
          <input ref={searchRef} type="text" placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Search operators..."], ["Search operators..."])))} value={search} onChange={function (e) {
            setSearch(e.target.value);
            setSelectedPerson(null);
            setPin("");
            setPinError(null);
        }} className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground pr-8"/>
        </div>

        {/* Operator list */}
        <div className="max-h-[240px] overflow-y-auto">
          {operatorList.all.length === 0 ? (<div className="py-8 text-center text-sm text-muted-foreground">
              {search ? <macro_1.Trans>No results</macro_1.Trans> : <macro_1.Trans>No operators</macro_1.Trans>}
            </div>) : (<div className="py-1">
              {operatorList.recent.length > 0 && (<>
                  <p className="px-4 pt-1.5 pb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    <macro_1.Trans>Recent</macro_1.Trans>
                  </p>
                  {operatorList.recent.map(function (person) { return (<OperatorRow key={person.id} person={person} isSelected={(selectedPerson === null || selectedPerson === void 0 ? void 0 : selectedPerson.id) === person.id} onSelect={function (p) {
                        setSelectedPerson((selectedPerson === null || selectedPerson === void 0 ? void 0 : selectedPerson.id) === p.id ? null : p);
                        setPin("");
                        setPinError(null);
                    }}/>); })}
                  {operatorList.others.length > 0 && (<div className="mx-4 my-1 border-t"/>)}
                </>)}
              {operatorList.others.map(function (person) { return (<OperatorRow key={person.id} person={person} isSelected={(selectedPerson === null || selectedPerson === void 0 ? void 0 : selectedPerson.id) === person.id} onSelect={function (p) {
                    setSelectedPerson((selectedPerson === null || selectedPerson === void 0 ? void 0 : selectedPerson.id) === p.id ? null : p);
                    setPin("");
                    setPinError(null);
                }}/>); })}
            </div>)}
        </div>

        {/* Station user option — for exiting console mode */}
        {stationUser && !search && (<div className="border-t">
            <p className="px-4 pt-1.5 pb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              <macro_1.Trans>Station User</macro_1.Trans>
            </p>
            <OperatorRow person={stationUser} isSelected={(selectedPerson === null || selectedPerson === void 0 ? void 0 : selectedPerson.id) === stationUser.id} onSelect={function (p) {
                setSelectedPerson((selectedPerson === null || selectedPerson === void 0 ? void 0 : selectedPerson.id) === p.id ? null : p);
                setPin("");
                setPinError(null);
            }}/>
          </div>)}

        {/* PIN input — below station user, above footer */}
        {selectedPerson && (<div className="border-t px-4 py-3">
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-muted-foreground">
                <macro_1.Trans>Enter PIN for {getPersonName(selectedPerson)}</macro_1.Trans>
              </p>
              <div className="flex items-center gap-3">
                <react_1.InputOTP maxLength={4} value={pin} onChange={function (value) {
                setPin(value);
                setPinError(null);
            }} onComplete={handlePinComplete} disabled={isPinning} autoFocus containerClassName="[&_[data-slot=input-otp-slot]]:text-[0px]">
                  <react_1.InputOTPGroup>
                    <react_1.InputOTPSlot index={0} className={pin[0] ? "before:content-['●'] before:text-sm" : ""}/>
                    <react_1.InputOTPSlot index={1} className={pin[1] ? "before:content-['●'] before:text-sm" : ""}/>
                    <react_1.InputOTPSlot index={2} className={pin[2] ? "before:content-['●'] before:text-sm" : ""}/>
                    <react_1.InputOTPSlot index={3} className={pin[3] ? "before:content-['●'] before:text-sm" : ""}/>
                  </react_1.InputOTPGroup>
                </react_1.InputOTP>
                {isPinning && (<lu_1.LuLoader className="h-4 w-4 animate-spin text-muted-foreground"/>)}
              </div>
              {pinError && (<p className="text-xs text-destructive">{pinError}</p>)}
            </div>
          </div>)}

        {hasPinnedUser && (<div className="border-t px-3 py-2.5">
            <react_1.Button variant="ghost" size="md" className="w-full text-destructive hover:text-destructive" onClick={function () {
                pinOutFetcher.submit(null, {
                    method: "POST",
                    action: path_1.path.to.consolePinOut
                });
            }}>
              <lu_1.LuLogOut className="mr-2 h-4 w-4"/>
              <macro_1.Trans>Pin Out</macro_1.Trans>
            </react_1.Button>
          </div>)}
      </div>
    </div>);
}
function OperatorRow(_a) {
    var _b;
    var person = _a.person, isSelected = _a.isSelected, onSelect = _a.onSelect;
    var formatPersonName = (0, hooks_1.useFormatPersonName)();
    var displayName = formatPersonName({
        firstName: person.firstName,
        lastName: person.lastName,
        fullName: person.name
    }) || person.name;
    return (<button type="button" onClick={function () { return onSelect(person); }} className={"flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ".concat(isSelected ? "bg-primary/5" : "hover:bg-muted/50")}>
      <react_1.Avatar size="xs" name={displayName} src={(_b = person.avatarUrl) !== null && _b !== void 0 ? _b : undefined}/>
      <span className="text-sm flex-1 truncate">{displayName}</span>
      {isSelected && <lu_1.LuCheck className="h-3.5 w-3.5 text-primary shrink-0"/>}
    </button>);
}
var templateObject_1;
