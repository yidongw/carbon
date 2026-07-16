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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useUserSelect;
exports.isGroup = isGroup;
var react_1 = require("@carbon/react");
var debounce_1 = require("lodash/debounce");
var words_1 = require("lodash/words");
var react_2 = require("react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var defaultProps = {
    alwaysSelected: [],
    accessibilityLabel: "User selector",
    checkedSelections: false,
    disabled: false,
    hideSelections: false,
    id: "MultiUserSelect",
    innerInputRender: null,
    isMulti: false,
    placeholder: "",
    queryFilters: {},
    readOnly: false,
    resetAfterSelection: false,
    selections: [],
    selectionsMaxHeight: 400,
    showAvatars: false,
    usersOnly: false,
    // biome-ignore lint/suspicious/noEmptyBlockStatements: suppressed due to migration
    onCancel: function () { }
};
function useUserSelect(props) {
    var _this = this;
    var _a, _b, _c, _d;
    var formatPersonName = (0, hooks_1.useFormatPersonName)();
    /* Inner Props */
    var innerProps = (0, react_2.useMemo)(function () { return (__assign(__assign({}, defaultProps), props)); }, [props]);
    /* Data Fetching */
    var groupsFetcher = (0, react_router_1.useFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        groupsFetcher.load(path_1.path.to.api.groupsByType(innerProps.type));
    }, [innerProps.type]);
    /* Refs */
    var containerRef = (0, react_2.useRef)(null);
    var inputRef = (0, react_2.useRef)(null);
    var listBoxRef = (0, react_2.useRef)(null);
    var popoverRef = (0, react_2.useRef)(null);
    var buttonRef = (0, react_2.useRef)(null);
    var focusableNodes = (0, react_2.useRef)({});
    var instanceId = (0, react_2.useId)();
    /* Disclosures */
    var dropdown = (0, react_1.useDisclosure)();
    /* Fetch States */
    var _e = (0, react_2.useState)({}), loadingGroups = _e[0], setLoadingGroups = _e[1];
    var _f = (0, react_2.useState)({}), fetchedMembers = _f[0], setFetchedMembers = _f[1];
    var searchCache = (0, react_2.useRef)({});
    /* Input */
    var _g = (0, react_2.useState)(""), controlledValue = _g[0], setControlledValue = _g[1];
    /* Output */
    var _h = (0, react_2.useState)([]), filteredOptionGroups = _h[0], setFilteredOptionGroups = _h[1];
    /* Focus */
    var _j = (0, react_2.useState)(null), focusedId = _j[0], setFocusedId = _j[1];
    /* Selections */
    var _k = (0, react_2.useState)(innerProps.selections && innerProps.selections.length > 0
        ? makeSelectionItemsById(innerProps.selections, innerProps.isMulti)
        : {}), selectionItemsById = _k[0], setSelectionItemsById = _k[1];
    // Convert the tree from the server into a format that is easier to work with
    var optionGroups = (0, react_2.useMemo)(function () {
        var makeGroupItems = function (group, groupId) {
            var result = [];
            if (!innerProps.usersOnly) {
                result.push(__assign(__assign({}, group.data), { uid: getOptionId(groupId, group.data.id), label: group.data.name || "", children: group.children }));
                var subgroups = group.children.map(function (subgroup) { return (__assign(__assign({}, subgroup.data), { uid: getOptionId(groupId, subgroup.data.id), label: subgroup.data.name || "", children: subgroup.children })); });
                result.push.apply(result, subgroups);
            }
            var users = (fetchedMembers[group.data.id] ||
                group.data.users ||
                []).map(function (user) {
                return __assign(__assign({}, user), { uid: getOptionId(groupId, user.id), label: formatPersonName({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        fullName: user.fullName
                    }) || "" });
            });
            result.push.apply(result, users);
            return result;
        };
        return !groupsFetcher.data || !groupsFetcher.data.groups
            ? []
            : groupsFetcher.data.groups.reduce(function (acc, group) {
                if (!innerProps.usersOnly ||
                    (group.data.users && group.data.users.length) ||
                    (fetchedMembers[group.data.id] &&
                        fetchedMembers[group.data.id].length)) {
                    var uid = getGroupId(instanceId, group.data.id);
                    return acc.concat({
                        uid: uid,
                        expanded: false,
                        items: makeGroupItems(group, uid),
                        name: group.data.name || ""
                    });
                }
                return acc;
            }, []);
    }, [
        formatPersonName,
        groupsFetcher.data,
        innerProps.usersOnly,
        instanceId,
        fetchedMembers
    ]);
    /* Pre-populate controlled component after data loads */
    (0, react_2.useEffect)(function () {
        if (innerProps.value && optionGroups && optionGroups.length > 0) {
            var flattened_1 = optionGroups.reduce(function (acc, group) { return acc.concat(group.items); }, []);
            var values = Array.isArray(innerProps.value)
                ? innerProps.value
                : [innerProps.value];
            var newSelections_1 = {};
            var missingUserIds_1 = [];
            values.forEach(function (val) {
                if (!selectionItemsById[val]) {
                    var found = flattened_1.find(function (item) { return item.id === val; });
                    if (found) {
                        newSelections_1[val] = found;
                    }
                    else if (typeof val === "string" && !val.startsWith("group_")) {
                        missingUserIds_1.push(val);
                    }
                }
            });
            if (Object.keys(newSelections_1).length > 0) {
                setSelectionItemsById(function (prev) { return (__assign(__assign({}, prev), newSelections_1)); });
            }
            if (missingUserIds_1.length > 0) {
                var fetchMissing = function () { return __awaiter(_this, void 0, void 0, function () {
                    var res, data_1, err_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, fetch(path_1.path.to.api.usersBatch(missingUserIds_1))];
                            case 1:
                                res = _a.sent();
                                return [4 /*yield*/, res.json()];
                            case 2:
                                data_1 = _a.sent();
                                if (data_1.users && data_1.users.length > 0) {
                                    setSelectionItemsById(function (prev) {
                                        var next = __assign({}, prev);
                                        data_1.users.forEach(function (u) {
                                            if (!next[u.id]) {
                                                next[u.id] = __assign(__assign({}, u), { uid: getOptionId("preselected", u.id), label: u.fullName || "" });
                                            }
                                        });
                                        return next;
                                    });
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                err_1 = _a.sent();
                                console.error("Failed to fetch preselected users", err_1);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                fetchMissing();
            }
        }
    }, [optionGroups, innerProps.value, selectionItemsById]);
    var makeFilteredOptionGroups = (0, react_2.useCallback)(function (query) {
        return optionGroups.reduce(function (acc, group) {
            if (query === null || query === void 0 ? void 0 : query.trim()) {
                var matches = group.items.filter(function (item) {
                    return stringContainsTerm(item.label, query);
                });
                if (matches && matches.length) {
                    return acc.concat(__assign(__assign({}, group), { expanded: true, items: matches }));
                }
                else {
                    return acc;
                }
            }
            else {
                return acc.concat(group);
            }
        }, []);
    }, [optionGroups]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        // Preserve each group's expanded state so it doesn't collapse when its
        // lazily-fetched members arrive.
        setFilteredOptionGroups(function (previousGroups) {
            var expandedByUid = new Map(previousGroups.map(function (group) { return [group.uid, group.expanded]; }));
            return makeFilteredOptionGroups().map(function (group) {
                return expandedByUid.has(group.uid)
                    ? __assign(__assign({}, group), { expanded: expandedByUid.get(group.uid) }) : group;
            });
        });
    }, [optionGroups, makeFilteredOptionGroups, setFilteredOptionGroups]);
    /* Event Handlers */
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var commit = (0, react_2.useCallback)(function () {
        dropdown.onClose();
        setFocusedId(null);
    }, [dropdown, setFocusedId]);
    (0, react_1.useOutsideClick)({
        ref: containerRef,
        handler: function () {
            clear();
            commit();
        }
    });
    var focusInput = (0, react_2.useCallback)(function () {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var clear = (0, react_2.useCallback)(function () {
        setFilteredOptionGroups(makeFilteredOptionGroups());
        setControlledValue("");
    }, [makeFilteredOptionGroups, setControlledValue, setFilteredOptionGroups]);
    var resetFocus = (0, react_2.useCallback)(function () {
        var _a;
        setFocusedId(null);
        focusInput();
        if (listBoxRef) {
            (_a = listBoxRef.current) === null || _a === void 0 ? void 0 : _a.scrollTo(0, 0);
        }
    }, [focusInput]);
    var prefetchGroup = (0, react_2.useCallback)(function (uid) {
        var groupId = uid.split("_")[1];
        if (groupId && !fetchedMembers[groupId] && !loadingGroups[groupId]) {
            setLoadingGroups(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[groupId] = true, _a)));
            });
            fetch(path_1.path.to.api.groupMembers(groupId))
                .then(function (res) { return res.json(); })
                .then(function (data) {
                var _a;
                if (data.users) {
                    var users_1 = data.users;
                    var queryFilters_1 = innerProps.queryFilters;
                    if ((_a = queryFilters_1 === null || queryFilters_1 === void 0 ? void 0 : queryFilters_1.allowedIds) === null || _a === void 0 ? void 0 : _a.length) {
                        users_1 = users_1.filter(function (u) {
                            return queryFilters_1.allowedIds.includes(u.id);
                        });
                    }
                    setFetchedMembers(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[groupId] = users_1, _a)));
                    });
                }
            })
                .catch(function (err) { return console.error("Failed to prefetch group", err); })
                .finally(function () {
                setLoadingGroups(function (prev) {
                    var _a;
                    return (__assign(__assign({}, prev), (_a = {}, _a[groupId] = false, _a)));
                });
            });
        }
    }, [fetchedMembers, loadingGroups, innerProps]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onGroupExpand = (0, react_2.useCallback)(function (uid) {
        setFilteredOptionGroups(function (previousGroups) {
            return previousGroups.map(function (group) {
                return group.uid === uid ? __assign(__assign({}, group), { expanded: true }) : group;
            });
        });
        prefetchGroup(uid);
    }, [setFilteredOptionGroups, prefetchGroup]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onGroupCollapse = (0, react_2.useCallback)(function (uid) {
        return setFilteredOptionGroups(function (previousGroups) {
            return previousGroups.map(function (group) {
                return group.uid === uid ? __assign(__assign({}, group), { expanded: false }) : group;
            });
        });
    }, [setFilteredOptionGroups]);
    var isExpanded = (0, react_2.useCallback)(function (uid) {
        return filteredOptionGroups.some(function (g) { return g.uid === uid && g.expanded; });
    }, [filteredOptionGroups]);
    var getFirstNode = (0, react_2.useCallback)(function () {
        return Object.values(focusableNodes.current).find(function (node) { return node !== undefined && node.previousId === undefined; });
    }, []);
    var getLastNode = (0, react_2.useCallback)(function () {
        return Object.values(focusableNodes.current).find(function (node) { return node !== undefined && node.nextId === undefined; });
    }, []);
    var getNextNode = (0, react_2.useCallback)(function (currentId) {
        if (currentId === null) {
            if (!dropdown.isOpen)
                dropdown.onOpen();
            return getFirstNode();
        }
        var nextId = focusableNodes.current[currentId].nextId;
        if (nextId) {
            return focusableNodes.current[nextId];
        }
        resetFocus();
        return null;
    }, [dropdown, getFirstNode, resetFocus]);
    var getPreviousNode = (0, react_2.useCallback)(function (currentId) {
        if (currentId === null)
            return getLastNode();
        var previousId = focusableNodes.current[currentId].previousId;
        if (previousId) {
            return focusableNodes.current[previousId];
        }
        resetFocus();
        return null;
    }, [getLastNode, resetFocus]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var hasParent = (0, react_2.useCallback)(function (id) {
        var parentId = focusableNodes.current[id].parentId;
        return parentId !== undefined;
    }, [focusableNodes]);
    var hasChildren = (0, react_2.useCallback)(function (id) {
        var _a;
        return (_a = focusableNodes.current[id].expandable) !== null && _a !== void 0 ? _a : false;
    }, []);
    var scrollTo = (0, react_2.useCallback)(function (elementId, delay) {
        var element = document.getElementById(elementId);
        var block = "nearest";
        if (element) {
            if (delay) {
                setTimeout(function () {
                    element.scrollIntoView({ block: block });
                }, 80);
            }
            else {
                element.scrollIntoView({ block: block });
            }
        }
    }, []);
    var getSelectionById = (0, react_2.useCallback)(function (uid) {
        for (var _i = 0, filteredOptionGroups_1 = filteredOptionGroups; _i < filteredOptionGroups_1.length; _i++) {
            var group = filteredOptionGroups_1[_i];
            var result = group.items.find(function (item) { return item.uid === uid; });
            if (result)
                return result;
        }
        return undefined;
    }, [filteredOptionGroups]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var setFocus = (0, react_2.useCallback)(function (command) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var nextFocusedId = focusedId;
        var scrollDelay = false;
        switch (command) {
            case "first":
                nextFocusedId = (_b = (_a = getFirstNode()) === null || _a === void 0 ? void 0 : _a.uid) !== null && _b !== void 0 ? _b : null;
                break;
            case "last":
                nextFocusedId = (_d = (_c = getLastNode()) === null || _c === void 0 ? void 0 : _c.uid) !== null && _d !== void 0 ? _d : null;
                break;
            case "previous":
                nextFocusedId = (_f = (_e = getPreviousNode(focusedId)) === null || _e === void 0 ? void 0 : _e.uid) !== null && _f !== void 0 ? _f : null;
                break;
            case "next":
                nextFocusedId = (_h = (_g = getNextNode(focusedId)) === null || _g === void 0 ? void 0 : _g.uid) !== null && _h !== void 0 ? _h : null;
                break;
            default:
                nextFocusedId = command;
                scrollDelay = true;
        }
        setFocusedId(nextFocusedId);
        if (nextFocusedId) {
            var element = document.getElementById(nextFocusedId);
            if (element)
                element.focus();
            scrollTo(nextFocusedId, scrollDelay);
        }
    }, [
        focusedId,
        getFirstNode,
        getLastNode,
        getPreviousNode,
        getNextNode,
        scrollTo,
        setFocusedId
    ]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var debouncedInputChange = (0, react_2.useMemo)(function () {
        var queryFilters = innerProps.queryFilters;
        return (0, debounce_1.default)(function (search) { return __awaiter(_this, void 0, void 0, function () {
            var q, cacheKey, searchResults, searchUrl, res, data, searchResults, e_1;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        q = search.trim();
                        if (!(q.length >= 2)) return [3 /*break*/, 6];
                        cacheKey = "".concat(q, "|").concat((_a = queryFilters === null || queryFilters === void 0 ? void 0 : queryFilters.excludeSelf) !== null && _a !== void 0 ? _a : "", "|").concat((_c = (_b = queryFilters === null || queryFilters === void 0 ? void 0 : queryFilters.allowedIds) === null || _b === void 0 ? void 0 : _b.join(",")) !== null && _c !== void 0 ? _c : "");
                        if (searchCache.current[cacheKey]) {
                            searchResults = searchCache.current[cacheKey].map(function (user) { return (__assign(__assign({}, user), { uid: getOptionId("search", user.id), label: user.fullName || "" })); });
                            setFilteredOptionGroups([
                                {
                                    uid: "search_results",
                                    expanded: true,
                                    items: searchResults,
                                    name: "Search Results"
                                }
                            ]);
                            resetFocus();
                            return [2 /*return*/];
                        }
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 4, , 5]);
                        searchUrl = path_1.path.to.api.usersSearch(q);
                        if (queryFilters === null || queryFilters === void 0 ? void 0 : queryFilters.excludeSelf) {
                            searchUrl += "&excludeSelf=true";
                        }
                        if ((_d = queryFilters === null || queryFilters === void 0 ? void 0 : queryFilters.allowedIds) === null || _d === void 0 ? void 0 : _d.length) {
                            searchUrl += "&allowedIds=".concat(queryFilters.allowedIds.join(","));
                        }
                        return [4 /*yield*/, fetch(searchUrl)];
                    case 2:
                        res = _e.sent();
                        return [4 /*yield*/, res.json()];
                    case 3:
                        data = _e.sent();
                        if (data.users && data.users.length > 0) {
                            searchCache.current[cacheKey] = data.users;
                            searchResults = data.users.map(function (user) { return (__assign(__assign({}, user), { uid: getOptionId("search", user.id), label: user.fullName || "" })); });
                            setFilteredOptionGroups([
                                {
                                    uid: "search_results",
                                    expanded: true,
                                    items: searchResults,
                                    name: "Search Results"
                                }
                            ]);
                        }
                        else {
                            setFilteredOptionGroups([]);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _e.sent();
                        console.error(e_1);
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        setFilteredOptionGroups(makeFilteredOptionGroups(search));
                        _e.label = 7;
                    case 7:
                        resetFocus();
                        return [2 /*return*/];
                }
            });
        }); }, 240);
    }, [
        makeFilteredOptionGroups,
        resetFocus,
        setFilteredOptionGroups,
        innerProps
    ]);
    var onInputFocus = (0, react_2.useCallback)(function () {
        dropdown.onOpen();
        resetFocus();
    }, [dropdown, resetFocus]);
    var onInputBlur = (0, react_2.useCallback)(function (e) {
        if (innerProps.onBlur && typeof innerProps.onBlur === "function") {
            innerProps.onBlur(e);
        }
    }, [innerProps]);
    var onMouseOver = (0, react_2.useCallback)(function () {
        setFocusedId(null);
    }, []);
    var onChange = (0, react_2.useCallback)(function (selections) {
        if (innerProps.onChange && typeof innerProps.onChange === "function") {
            innerProps.onChange(selections);
        }
    }, [innerProps]);
    var onCheckedChange = (0, react_2.useCallback)(function (selections) {
        if (innerProps.onCheckedSelectionsChange &&
            typeof innerProps.onChange === "function") {
            innerProps.onCheckedSelectionsChange(selections);
        }
    }, [innerProps]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onSelect = (0, react_2.useCallback)(function (selectionItem) {
        if (selectionItem === undefined)
            return;
        setSelectionItemsById(function (previousSelections) {
            var nextSelections = innerProps.isMulti
                ? __assign({}, previousSelections) : {};
            nextSelections[selectionItem.id] = checked(selectionItem);
            onChange(Object.values(nextSelections));
            return nextSelections;
        });
        if (innerProps.isMulti && !innerProps.resetAfterSelection) {
            setFocusedId(selectionItem.uid);
        }
        else {
            commit();
            clear();
        }
    }, [
        clear,
        commit,
        innerProps.isMulti,
        innerProps.resetAfterSelection,
        onChange,
        setFocusedId,
        setSelectionItemsById
    ]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onDeselect = (0, react_2.useCallback)(function (selectionItem) {
        if (selectionItem === undefined)
            return;
        var id = selectionItem.id;
        setSelectionItemsById(function (previousSelections) {
            if (id in previousSelections) {
                // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
                var _a = previousSelections, _b = id, removed = _a[_b], newSelectionCodes = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                onChange(Object.values(newSelectionCodes));
                return newSelectionCodes;
            }
            return previousSelections;
        });
    }, [onChange, setSelectionItemsById]);
    var onToggle = (0, react_2.useCallback)(function (selectionItem) {
        if (selectionItem === undefined)
            return;
        if (selectionItem.id in selectionItemsById) {
            onDeselect(selectionItem);
        }
        else {
            onSelect(selectionItem);
        }
    }, [onDeselect, onSelect, selectionItemsById]);
    var onToggleChecked = (0, react_2.useCallback)(function (selectionItem) {
        if (selectionItem === undefined)
            return;
        setSelectionItemsById(function (previousSelections) {
            var _a;
            var nextSelections = __assign(__assign({}, previousSelections), (_a = {}, _a[selectionItem.id] = toggleChecked(selectionItem), _a));
            onCheckedChange(Object.values(nextSelections));
            return nextSelections;
        });
    }, [onCheckedChange]);
    var removeSelections = (0, react_2.useCallback)(function () {
        Object.values(selectionItemsById).forEach(function (item) {
            onDeselect(item);
        });
    }, [onDeselect, selectionItemsById]);
    var onClearInput = (0, react_2.useCallback)(function () {
        clear();
        if (!innerProps.isMulti) {
            removeSelections();
        }
    }, [clear, innerProps.isMulti, removeSelections]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onInputChange = (0, react_2.useCallback)(function (_a) {
        var _b;
        var target = _a.target;
        setControlledValue(target.value);
        debouncedInputChange(target.value);
        if (((_b = target.value) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            dropdown.onOpen();
        }
        else if (!innerProps.isMulti) {
            removeSelections();
        }
    }, [
        debouncedInputChange,
        dropdown,
        innerProps.isMulti,
        removeSelections,
        setControlledValue
    ]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onExplode = (0, react_2.useCallback)(function (selectionItem) {
        if (!("users" in selectionItem))
            return;
        var id = selectionItem.id, users = selectionItem.users, children = selectionItem.children;
        setSelectionItemsById(function (prevSelectionItems) {
            if (id in prevSelectionItems) {
                // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
                var _a = prevSelectionItems, _b = id, removed = _a[_b], newSelectionItems_1 = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                users.forEach(function (user) {
                    newSelectionItems_1[user.id] = __assign(__assign({}, user), { uid: getOptionId(id, user.id), label: formatPersonName({
                            firstName: user.firstName,
                            lastName: user.lastName,
                            fullName: user.fullName
                        }) || "" });
                });
                children === null || children === void 0 ? void 0 : children.forEach(function (group) {
                    newSelectionItems_1[group.data.id] = __assign(__assign({}, group.data), { uid: getOptionId(id, group.data.id), label: group.data.name || "" });
                });
                onChange(Object.values(newSelectionItems_1));
                return newSelectionItems_1;
            }
            return prevSelectionItems;
        });
    }, [onChange, setSelectionItemsById]);
    var onKeyDown = (0, react_2.useCallback)(function (event) {
        if (innerProps.disabled) {
            return;
        }
        switch (event.key) {
            case "ArrowLeft":
                if (focusedId) {
                    if (hasParent(focusedId)) {
                        var parentId = focusableNodes.current[focusedId].parentId;
                        onGroupCollapse(parentId);
                        setFocus(parentId);
                    }
                    else {
                        onGroupCollapse(focusedId);
                    }
                    break;
                }
                else {
                    return;
                }
            case "ArrowRight":
                if (focusedId && hasChildren(focusedId)) {
                    if (isExpanded(focusedId)) {
                        setFocus("next");
                    }
                    else {
                        onGroupExpand(focusedId);
                    }
                    break;
                }
                else {
                    return;
                }
            case "Tab":
                clear();
                commit();
                return;
            case "Enter":
                if (focusedId && hasParent(focusedId)) {
                    onSelect(getSelectionById(focusedId));
                    clear();
                    commit();
                    break;
                }
                break;
            case "Escape":
                if (dropdown.isOpen) {
                    commit();
                }
                else {
                    clear();
                }
                break;
            case " ": // space
                if (focusedId) {
                    if (hasParent(focusedId)) {
                        onToggle(getSelectionById(focusedId));
                    }
                    break;
                }
                return;
            case "ArrowUp":
                setFocus("previous");
                break;
            case "ArrowDown":
                if (dropdown.isOpen) {
                    setFocus("next");
                }
                else {
                    dropdown.onOpen();
                }
                break;
            case "Home":
                if (!dropdown.isOpen)
                    return;
                setFocus("first");
                break;
            case "End":
                if (!dropdown.isOpen)
                    return;
                setFocus("last");
                break;
            default:
                resetFocus();
                return;
        }
        event.preventDefault();
    }, [
        commit,
        dropdown,
        focusedId,
        getSelectionById,
        hasParent,
        hasChildren,
        isExpanded,
        innerProps.disabled,
        clear,
        onGroupCollapse,
        onGroupExpand,
        onSelect,
        onToggle,
        resetFocus,
        setFocus
    ]);
    /* Accessibility */
    var popoverProps = (0, react_2.useMemo)(function () { return ({}); }, []);
    var listBoxProps = (0, react_2.useMemo)(function () { return ({
        id: instanceId,
        role: "tree",
        tabIndex: -1
    }); }, [instanceId]);
    var inputProps = (0, react_2.useMemo)(function () { return ({
        role: "combobox",
        "aria-expanded": dropdown.isOpen,
        "aria-controls": dropdown.isOpen ? instanceId : undefined,
        "aria-haspopup": "tree",
        "aria-autocomplete": "list",
        "aria-activedescendant": focusedId !== null && focusedId !== void 0 ? focusedId : undefined,
        autoComplete: "off",
        autoCorrect: "off"
    }); }, [instanceId, dropdown.isOpen, focusedId]);
    var aria = (0, react_2.useMemo)(function () { return ({
        inputProps: inputProps,
        listBoxProps: listBoxProps,
        popoverProps: popoverProps
    }); }, [inputProps, listBoxProps, popoverProps]);
    var inputValue = innerProps.isMulti || focusedId || controlledValue
        ? controlledValue
        : ((_c = (_b = (_a = Object.values(selectionItemsById)) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : "");
    return {
        aria: aria,
        groups: filteredOptionGroups,
        errors: (_d = groupsFetcher.data) === null || _d === void 0 ? void 0 : _d.errors,
        loading: groupsFetcher.state === "loading",
        loadingGroups: loadingGroups,
        selectionItemsById: selectionItemsById,
        // focus
        instanceId: instanceId,
        focusedId: focusedId,
        // filters
        inputValue: inputValue,
        // disclosures
        dropdown: dropdown,
        // props
        innerProps: innerProps,
        refs: {
            containerRef: containerRef,
            inputRef: inputRef,
            listBoxRef: listBoxRef,
            popoverRef: popoverRef,
            buttonRef: buttonRef,
            focusableNodes: focusableNodes
        },
        // event handlers
        onClearInput: onClearInput,
        onKeyDown: onKeyDown,
        onGroupCollapse: onGroupCollapse,
        onGroupExpand: onGroupExpand,
        prefetchGroup: prefetchGroup,
        onInputChange: onInputChange,
        onInputBlur: onInputBlur,
        onInputFocus: onInputFocus,
        onSelect: onSelect,
        onDeselect: onDeselect,
        onToggleChecked: onToggleChecked,
        onExplode: onExplode,
        onMouseOver: onMouseOver,
        setControlledValue: setControlledValue,
        setSelectionItemsById: setSelectionItemsById
    };
}
function getOptionId(groupId, optionId) {
    return "".concat(groupId, "_").concat(optionId, "_option");
}
function getGroupId(instanceId, groupId) {
    return "".concat(instanceId, "_").concat(groupId, "_group");
}
function checked(item) {
    return __assign(__assign({}, item), { isChecked: true });
}
function isGroup(item) {
    var _a, _b;
    return (("users" in item && ((_a = item.users) === null || _a === void 0 ? void 0 : _a.length) > 0) ||
        ("children" in item && ((_b = item === null || item === void 0 ? void 0 : item.children) === null || _b === void 0 ? void 0 : _b.length)));
}
function toggleChecked(item) {
    return __assign(__assign({}, item), { isChecked: !item.isChecked || false });
}
function makeSelectionItemsById(input, isMulti) {
    var result = {};
    // biome-ignore lint/suspicious/useIterableCallbackReturn: suppressed due to migration
    input.forEach(function (item) {
        if (!(item.id in result)) {
            result[item.id] = checked(item);
            // early exit for signle user select
            if (!isMulti)
                return result;
        }
    });
    return result;
}
function stringContainsTerm(input, filter) {
    var i = input.toLocaleLowerCase().trim();
    var f = filter.toLocaleLowerCase().trim();
    if (i.startsWith(f)) {
        return true;
    }
    var filterTokens = (0, words_1.default)(f);
    var inputTokens = (0, words_1.default)(i);
    return filterTokens.every(function (fToken) {
        return inputTokens.some(function (iToken) { return iToken.startsWith(fToken); });
    });
}
