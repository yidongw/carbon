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
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var localforage_1 = require("localforage");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var pi_1 = require("react-icons/pi");
var ri_1 = require("react-icons/ri");
var rx_1 = require("react-icons/rx");
var react_router_1 = require("react-router");
var Icons_1 = require("~/components/Icons");
var hooks_1 = require("~/hooks");
var useAccountSubmodules_1 = require("~/modules/account/ui/useAccountSubmodules");
var useAccountingSubmodules_1 = require("~/modules/accounting/ui/useAccountingSubmodules");
var useDocumentsSubmodules_1 = require("~/modules/documents/ui/useDocumentsSubmodules");
var useInventorySubmodules_1 = require("~/modules/inventory/ui/useInventorySubmodules");
var useInvoicingSubmodules_1 = require("~/modules/invoicing/ui/useInvoicingSubmodules");
var useItemsSubmodules_1 = require("~/modules/items/ui/useItemsSubmodules");
var usePeopleSubmodules_1 = require("~/modules/people/ui/usePeopleSubmodules");
var useProductionSubmodules_1 = require("~/modules/production/ui/useProductionSubmodules");
var usePurchasingSubmodules_1 = require("~/modules/purchasing/ui/usePurchasingSubmodules");
var useQualitySubmodules_1 = require("~/modules/quality/ui/useQualitySubmodules");
var useResourcesSubmodules_1 = require("~/modules/resources/ui/useResourcesSubmodules");
var useSalesSubmodules_1 = require("~/modules/sales/ui/useSalesSubmodules");
var useSettingsSubmodules_1 = require("~/modules/settings/ui/useSettingsSubmodules");
var ui_1 = require("~/stores/ui");
var SearchEmptyState_1 = require("./Search/SearchEmptyState");
var shortcut = {
    key: "K",
    modifiers: ["mod"]
};
var SearchModal = function () {
    var _a, _b;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var fetcher = (0, react_router_1.useFetcher)();
    var _c = (0, ui_1.useUIStore)(), isSearchModalOpen = _c.isSearchModalOpen, closeSearchModal = _c.closeSearchModal;
    var company = (0, hooks_1.useUser)().company;
    var storageKey = "recentSearches_".concat(company.id);
    var _d = (0, react_2.useState)(""), input = _d[0], setInput = _d[1];
    var _e = (0, react_2.useState)(false), isDebouncing = _e[0], setIsDebouncing = _e[1];
    var debounceSearch = (0, react_1.useDebounce)(function (q) {
        if (q && q.length >= 2) {
            fetcher.load("/api/search?q=".concat(encodeURIComponent(q)));
        }
        setIsDebouncing(false);
    }, 500);
    (0, react_2.useEffect)(function () {
        if (isSearchModalOpen) {
            setInput("");
        }
    }, [isSearchModalOpen]);
    var staticResults = useGroupedSubmodules();
    var modules = (0, hooks_1.useModules)();
    var getModuleIcon = function (moduleName) {
        var module = modules.find(function (m) { return m.name.toLowerCase() === moduleName.toLowerCase(); });
        return module === null || module === void 0 ? void 0 : module.icon;
    };
    var _f = (0, react_2.useState)([]), recentResults = _f[0], setRecentResults = _f[1];
    (0, react_2.useEffect)(function () {
        var loadRecentSearches = function () { return __awaiter(void 0, void 0, void 0, function () {
            var recentResultsFromStorage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, localforage_1.default.getItem(storageKey)];
                    case 1:
                        recentResultsFromStorage = _a.sent();
                        if (recentResultsFromStorage) {
                            setRecentResults(recentResultsFromStorage);
                        }
                        else {
                            setRecentResults([]);
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        loadRecentSearches();
    }, [storageKey]);
    var recentPaths = new Set(recentResults.map(function (r) { return r.to; }));
    var searchResults = input.length >= 2 ? ((_b = (_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.results) !== null && _b !== void 0 ? _b : []) : [];
    var loading = fetcher.state === "loading";
    // Filter static results based on input for empty state detection
    var normalizedInput = input.toLowerCase().trim();
    var hasMatchingStaticResults = normalizedInput.length === 0 ||
        Object.entries(staticResults).some(function (_a) {
            var module = _a[0], submodules = _a[1];
            return submodules.some(function (s) {
                return !recentPaths.has(s.to) &&
                    "".concat(module, " ").concat(s.name).toLowerCase().includes(normalizedInput);
            });
        });
    var hasMatchingRecentResults = normalizedInput.length === 0 ||
        recentResults.some(function (r) { return r.name.toLowerCase().includes(normalizedInput); });
    var hasAnyResults = searchResults.length > 0 ||
        hasMatchingStaticResults ||
        hasMatchingRecentResults;
    var onInputChange = function (value) {
        setInput(value);
        if (value && value.length >= 2) {
            setIsDebouncing(true);
        }
        debounceSearch(value);
    };
    var onSelect = function (route, entityType, module, description) { return __awaiter(void 0, void 0, void 0, function () {
        var to, name, newRecentSearches, _a;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    to = route.to, name = route.name;
                    navigate(route.to);
                    closeSearchModal();
                    _a = [[
                            { to: to, name: name, entityType: entityType, module: module, description: description }
                        ]];
                    return [4 /*yield*/, localforage_1.default.getItem(storageKey)];
                case 1:
                    newRecentSearches = __spreadArray.apply(void 0, _a.concat([((_c = (_b = (_d.sent())) === null || _b === void 0 ? void 0 : _b.filter(function (item) { return item.to !== to; })) !== null && _c !== void 0 ? _c : []), true])).slice(0, 5);
                    setRecentResults(newRecentSearches);
                    localforage_1.default.setItem(storageKey, newRecentSearches);
                    return [2 /*return*/];
            }
        });
    }); };
    var removeRecentSearch = function (path, e) { return __awaiter(void 0, void 0, void 0, function () {
        var existingRecent, updated;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    e.stopPropagation();
                    return [4 /*yield*/, localforage_1.default.getItem(storageKey)];
                case 1:
                    existingRecent = (_a = (_b.sent())) !== null && _a !== void 0 ? _a : [];
                    updated = existingRecent.filter(function (item) { return item.to !== path; });
                    setRecentResults(updated);
                    return [4 /*yield*/, localforage_1.default.setItem(storageKey, updated)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return (<react_1.Modal open={isSearchModalOpen} onOpenChange={function (open) {
            setInput("");
            if (!open)
                closeSearchModal();
        }}>
      <react_1.ModalContent className="rounded-xl p-0 h-[520px] max-w-2xl overflow-hidden dark:shadow-button" withCloseButton={false}>
        <react_1.Command className="h-full flex flex-col">
          {/* Search Input */}

          <react_1.CommandInput placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Search across your workspace..."], ["Search across your workspace..."])))} value={input} onValueChange={onInputChange} className="h-14 text-base"/>

          {/* Results */}
          <react_1.CommandList className="flex-1 max-h-none overflow-y-auto px-2 py-2">
            {loading || isDebouncing ? (<SearchEmptyState_1.SearchEmptyState type="loading"/>) : !hasAnyResults ? (<SearchEmptyState_1.SearchEmptyState type="no-results" query={input}/>) : (<>
                {/* Recent Searches */}
                {recentResults.length > 0 && (<>
                    <react_1.CommandGroup heading={<span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <lu_1.LuClock className="w-3 h-3"/>
                          <macro_1.Trans>Recent</macro_1.Trans>
                        </span>} key="recent">
                      {recentResults.map(function (result, index) {
                    var ModuleIcon = result.module
                        ? getModuleIcon(result.module)
                        : undefined;
                    return (<react_1.CommandItem key={"".concat(result.to, "-").concat((0, nanoid_1.nanoid)(), "-").concat(index)} onSelect={function () {
                            return onSelect(result, result.entityType, result.module, result.description);
                        }} value={":".concat(result.to)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg group">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                              {result.entityType ? (<ResultIcon entityType={result.entityType}/>) : ModuleIcon ? (<ModuleIcon className="w-4 h-4 text-muted-foreground"/>) : (<rx_1.RxMagnifyingGlass className="w-4 h-4 text-muted-foreground"/>)}
                            </div>
                            <react_1.VStack spacing={0} className="flex-1 min-w-0">
                              <span className="font-medium truncate">
                                {result.name}
                              </span>
                              {result.description && (<span className="text-sm text-muted-foreground truncate">
                                  {result.description}
                                </span>)}
                            </react_1.VStack>
                            <button type="button" onClick={function (e) { return removeRecentSearch(result.to, e); }} className="flex-shrink-0 p-1 rounded hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                              <lu_1.LuX className="w-4 h-4 text-muted-foreground"/>
                            </button>
                          </react_1.CommandItem>);
                })}
                    </react_1.CommandGroup>
                    <react_1.CommandSeparator className="my-2"/>
                  </>)}

                {/* Search Results */}
                {searchResults.length > 0 && (<react_1.CommandGroup heading={<span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <macro_1.Trans>Results</macro_1.Trans>
                      </span>} key="search">
                    {searchResults.map(function (result) { return (<react_1.CommandItem key={"".concat(result.id, "-").concat((0, nanoid_1.nanoid)())} value={"".concat(input).concat(result.id)} onSelect={function () {
                        return onSelect({
                            to: result.link,
                            name: result.title
                        }, result.entityType, undefined, result.description);
                    }} className="flex items-center gap-3 px-3 py-3 rounded-lg group">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          <ResultIcon entityType={result.entityType}/>
                        </div>
                        <react_1.VStack spacing={0} className="flex-1 min-w-0">
                          <span className="font-medium text-foreground truncate">
                            {result.title}
                          </span>
                          {result.description && (<span className="text-sm text-muted-foreground truncate">
                              {result.description}
                            </span>)}
                        </react_1.VStack>
                        <lu_1.LuChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"/>
                      </react_1.CommandItem>); })}
                  </react_1.CommandGroup>)}

                {/* Module Navigation */}
                {Object.entries(staticResults).map(function (_a) {
                var module = _a[0], submodules = _a[1];
                var filteredSubmodules = submodules.filter(function (s) { return !recentPaths.has(s.to); });
                if (filteredSubmodules.length === 0)
                    return null;
                return (<div key={"static-".concat(module)}>
                      <react_1.CommandGroup heading={<span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {module}
                          </span>}>
                        {filteredSubmodules.map(function (submodule, index) {
                        var hasIconElement = "iconElement" in submodule && submodule.iconElement;
                        return (<react_1.CommandItem key={"".concat(submodule.to, "-").concat(submodule.name, "-").concat(index)} onSelect={function () {
                                return onSelect(submodule, undefined, module);
                            }} value={"".concat(module, " ").concat(submodule.name)} className="flex items-center gap-3 px-3 py-2 rounded-lg group">
                              <div className="flex-shrink-0 w-7 h-7 rounded-md bg-muted/50 flex items-center justify-center text-muted-foreground [&>svg]:w-4 [&>svg]:h-4">
                                {hasIconElement ? (submodule.iconElement) : submodule.icon ? (<submodule.icon className="w-4 h-4"/>) : null}
                              </div>
                              <span className="flex-1 text-sm">
                                {submodule.name}
                              </span>
                              <lu_1.LuChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"/>
                            </react_1.CommandItem>);
                    })}
                      </react_1.CommandGroup>
                      <react_1.CommandSeparator className="my-2"/>
                    </div>);
            })}
              </>)}
          </react_1.CommandList>

          {/* Footer */}
          <div className="border-t border-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">
                  Up/Down
                </kbd>
                <macro_1.Trans>Navigate</macro_1.Trans>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">
                  Enter
                </kbd>
                <macro_1.Trans>Select</macro_1.Trans>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">
                  Esc
                </kbd>
                <macro_1.Trans>Close</macro_1.Trans>
              </span>
            </div>
          </div>
        </react_1.Command>
      </react_1.ModalContent>
    </react_1.Modal>);
};
function ResultIcon(_a) {
    var entityType = _a.entityType;
    var iconClass = "w-4 h-4 text-muted-foreground";
    switch (entityType) {
        case "customer":
            return <lu_1.LuSquareUser className={iconClass}/>;
        case "employee":
            return <lu_1.LuUser className={iconClass}/>;
        case "gauge":
            return <lu_1.LuDraftingCompass className={iconClass}/>;
        case "job":
            return <lu_1.LuCirclePlay className={iconClass}/>;
        case "issue":
            return <lu_1.LuShieldX className={iconClass}/>;
        case "item":
            return <Icons_1.MethodItemTypeIcon type="Part" className={iconClass}/>;
        case "purchaseOrder":
            return <lu_1.LuShoppingCart className={iconClass}/>;
        case "salesInvoice":
            return <ri_1.RiProgress8Line className={iconClass}/>;
        case "purchaseInvoice":
            return <lu_1.LuFileCheck className={iconClass}/>;
        case "supplier":
            return <pi_1.PiShareNetworkFill className={iconClass}/>;
        case "quote":
            return <ri_1.RiProgress4Line className={iconClass}/>;
        case "salesRfq":
            return <ri_1.RiProgress2Line className={iconClass}/>;
        case "salesOrder":
            return <ri_1.RiProgress8Line className={iconClass}/>;
        case "supplierQuote":
            return <lu_1.LuPackageSearch className={iconClass}/>;
        default:
            return null;
    }
}
var SearchButton = function () {
    var t = (0, macro_1.useLingui)().t;
    var openSearchModal = (0, ui_1.useUIStore)().openSearchModal;
    (0, react_1.useShortcutKeys)({
        shortcut: shortcut,
        action: openSearchModal
    });
    return (<div>
      <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Search"], ["Search"])))} icon={<lu_1.LuSearch />} variant="ghost" className="xl:hidden" onClick={openSearchModal}/>

      <react_1.Button leftIcon={<lu_1.LuSearch />} variant="secondary" className="hidden w-[200px] px-2 hover:scale-100 xl:inline-flex" onClick={openSearchModal}>
        <react_1.HStack className="w-full">
          <div className="flex flex-grow">
            <macro_1.Trans>Search</macro_1.Trans>
          </div>
          <react_1.ShortcutKey variant="small" shortcut={shortcut} className="hidden sm:grid"/>
        </react_1.HStack>
      </react_1.Button>
      <SearchModal />
    </div>);
};
function useGroupedSubmodules() {
    var modules = (0, hooks_1.useModules)();
    var items = (0, useItemsSubmodules_1.default)();
    var production = (0, useProductionSubmodules_1.default)();
    var inventory = (0, useInventorySubmodules_1.default)();
    var sales = (0, useSalesSubmodules_1.default)();
    var purchasing = (0, usePurchasingSubmodules_1.default)();
    var documents = (0, useDocumentsSubmodules_1.default)();
    var accounting = (0, useAccountingSubmodules_1.default)();
    var invoicing = (0, useInvoicingSubmodules_1.default)();
    var settings = (0, useSettingsSubmodules_1.default)();
    var people = (0, usePeopleSubmodules_1.default)();
    var quality = (0, useQualitySubmodules_1.default)();
    var resources = (0, useResourcesSubmodules_1.default)();
    var account = (0, useAccountSubmodules_1.default)();
    var groupedSubmodules = {
        items: items,
        inventory: inventory,
        sales: sales,
        purchasing: purchasing,
        quality: quality,
        accounting: accounting,
        invoicing: invoicing,
        people: people,
        production: production,
        resources: resources,
        settings: settings
    };
    var ungroupedSubmodules = {
        documents: documents,
        "my account": account
    };
    var shortcuts = modules.reduce(function (acc, module) {
        var _a, _b;
        var moduleName = module.name.toLowerCase();
        if (moduleName in groupedSubmodules) {
            var groups = groupedSubmodules[moduleName].groups;
            acc = __assign(__assign({}, acc), (_a = {}, _a[module.name] = groups.flatMap(function (group) {
                return group.routes.map(function (route) { return ({
                    to: route.to,
                    name: route.name,
                    icon: module.icon,
                    iconElement: route.icon
                }); });
            }), _a));
        }
        else if (moduleName in ungroupedSubmodules ||
            moduleName === "my account") {
            acc = __assign(__assign({}, acc), (_b = {}, _b[module.name] = ungroupedSubmodules[moduleName].links.map(function (link) { return ({
                to: link.to,
                name: link.name,
                icon: module.icon
            }); }), _b));
        }
        return acc;
    }, {});
    return shortcuts;
}
exports.default = (0, react_2.memo)(SearchButton);
var templateObject_1, templateObject_2;
