"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var TreeView_1 = require("~/components/TreeView");
var hooks_1 = require("~/hooks");
function accountsToFlatTree(accounts) {
    var _a;
    var byParent = new Map();
    for (var _i = 0, accounts_1 = accounts; _i < accounts_1.length; _i++) {
        var a = accounts_1[_i];
        var key = (_a = a.parentId) !== null && _a !== void 0 ? _a : "__root__";
        if (!byParent.has(key))
            byParent.set(key, []);
        byParent.get(key).push(a);
    }
    var result = [];
    function walk(parentId, level) {
        var _a, _b;
        var children = ((_a = byParent.get(parentId !== null && parentId !== void 0 ? parentId : "__root__")) !== null && _a !== void 0 ? _a : []).sort(function (a, b) {
            var _a, _b;
            var aIsGroup = a.isGroup ? 1 : 0;
            var bIsGroup = b.isGroup ? 1 : 0;
            if (aIsGroup !== bIsGroup)
                return aIsGroup - bIsGroup;
            return ((_a = a.name) !== null && _a !== void 0 ? _a : "").localeCompare((_b = b.name) !== null && _b !== void 0 ? _b : "");
        });
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var account = children_1[_i];
            var childAccounts = (_b = byParent.get(account.id)) !== null && _b !== void 0 ? _b : [];
            var childIds = childAccounts.map(function (c) { return c.id; });
            result.push({
                id: account.id,
                parentId: parentId !== null && parentId !== void 0 ? parentId : undefined,
                children: childIds,
                hasChildren: childIds.length > 0,
                level: level,
                data: account
            });
            walk(account.id, level + 1);
        }
    }
    walk(null, 0);
    return result;
}
function filterAccounts(accounts, search) {
    var _a, _b, _c;
    if (!search.trim())
        return accounts;
    var lower = search.toLowerCase();
    var byId = new Map(accounts.map(function (a) { return [a.id, a]; }));
    var matched = new Set();
    for (var _i = 0, accounts_2 = accounts; _i < accounts_2.length; _i++) {
        var a = accounts_2[_i];
        var nameMatch = (_a = a.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(lower);
        var numberMatch = (_b = a.number) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(lower);
        if (nameMatch || numberMatch) {
            matched.add(a.id);
            var parentId = a.parentId;
            while (parentId) {
                matched.add(parentId);
                var parent_1 = byId.get(parentId);
                parentId = (_c = parent_1 === null || parent_1 === void 0 ? void 0 : parent_1.parentId) !== null && _c !== void 0 ? _c : null;
            }
        }
    }
    return accounts.filter(function (a) { return matched.has(a.id); });
}
function formatCurrency(value) {
    return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
var FinancialStatementTree = (0, react_2.memo)(function (_a) {
    var data = _a.data, _b = _a.showTranslated, showTranslated = _b === void 0 ? false : _b, parentCurrency = _a.parentCurrency, search = _a.search;
    (0, hooks_1.useRealtime)("journal");
    var parentRef = (0, react_2.useRef)(null);
    var filtered = (0, react_2.useMemo)(function () { return filterAccounts(data, search); }, [data, search]);
    var tree = (0, react_2.useMemo)(function () { return accountsToFlatTree(filtered); }, [filtered]);
    var _c = (0, TreeView_1.useTree)({
        tree: tree,
        parentRef: parentRef,
        estimatedRowHeight: function () { return 36; },
        isEager: true
    }), nodes = _c.nodes, getTreeProps = _c.getTreeProps, getNodeProps = _c.getNodeProps, selectNode = _c.selectNode, toggleExpandNode = _c.toggleExpandNode, virtualizer = _c.virtualizer;
    return (<react_1.ScrollArea className="h-[calc(100dvh-var(--header-height)-61px)] w-full">
        <div className="sticky top-0 z-10 flex h-11 items-center pr-4 text-sm font-medium text-foreground/80 border-b border-border bg-card">
          <div className="flex-1 px-4">Account</div>
          <span className="w-32 text-right px-4">
            {showTranslated ? "Local" : "Balance"}
          </span>
          {showTranslated && (<span className="w-32 text-right px-4">
              {parentCurrency !== null && parentCurrency !== void 0 ? parentCurrency : "Translated"}
            </span>)}
          <span className="w-32 text-right px-4">Net Change</span>
        </div>
        <TreeView_1.TreeView tree={tree} nodes={nodes} getTreeProps={getTreeProps} getNodeProps={getNodeProps} virtualizer={virtualizer} parentRef={parentRef} parentClassName="h-full" renderNode={function (_a) {
            var _b, _c;
            var node = _a.node, state = _a.state;
            var account = node.data;
            var isGroup = account.isGroup;
            var isExpanded = state.expanded;
            return (<div className={(0, react_1.cn)("flex h-8 cursor-pointer items-center overflow-hidden pr-4 text-sm group/row", state.selected
                    ? "bg-muted hover:bg-accent"
                    : "bg-transparent hover:bg-accent", isGroup && "font-semibold")} onClick={function () {
                    selectNode(node.id, false);
                    if (isGroup) {
                        toggleExpandNode(node.id);
                    }
                }}>
                {/* Indentation lines */}
                <div className="flex h-9 items-center">
                  {Array.from({ length: node.level }).map(function (_, index) { return (<TreeView_1.LevelLine key={index} isSelected={state.selected}/>); })}

                  <div className={(0, react_1.cn)("flex h-9 w-5 items-center justify-center", node.hasChildren && "hover:bg-accent")} onClick={function (e) {
                    e.stopPropagation();
                    toggleExpandNode(node.id);
                }}>
                    {node.hasChildren ? (isExpanded ? (<lu_1.LuChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0"/>) : (<lu_1.LuChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0"/>)) : (<div className="h-9 w-5"/>)}
                  </div>
                </div>

                {/* Folder icon */}
                <div className="w-5 h-5 flex items-center justify-center mr-2 shrink-0">
                  {isGroup &&
                    (isExpanded ? (<lu_1.LuFolderOpen className="h-4 w-4 text-muted-foreground"/>) : (<lu_1.LuFolder className="h-4 w-4 text-muted-foreground"/>))}
                </div>

                {/* Account number + name */}
                <div className="flex flex-1 items-center gap-2 overflow-hidden">
                  {!isGroup && account.number && (<span className="text-muted-foreground shrink-0">
                      {account.number}
                    </span>)}
                  <span className="truncate">{account.name}</span>
                </div>

                {/* Balance */}
                <span className="w-32 text-right tabular-nums shrink-0 text-muted-foreground">
                  {formatCurrency((_b = account.balanceAtDate) !== null && _b !== void 0 ? _b : 0)}
                </span>

                {/* Translated Balance */}
                {showTranslated && (<span className="w-32 text-right tabular-nums shrink-0 text-muted-foreground">
                    {account.translatedBalance != null
                        ? formatCurrency(account.translatedBalance)
                        : "-"}
                  </span>)}

                {/* Net Change */}
                <span className="w-32 text-right tabular-nums shrink-0 text-muted-foreground">
                  {formatCurrency((_c = account.netChange) !== null && _c !== void 0 ? _c : 0)}
                </span>
              </div>);
        }}/>
      </react_1.ScrollArea>);
});
FinancialStatementTree.displayName = "FinancialStatementTree";
exports.default = FinancialStatementTree;
