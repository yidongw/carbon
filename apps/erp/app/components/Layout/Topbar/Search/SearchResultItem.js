"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchResultItem = SearchResultItem;
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var config_1 = require("./config");
function SearchResultItem(_a) {
    var result = _a.result, onSelect = _a.onSelect, searchQuery = _a.searchQuery;
    var config = (0, config_1.getEntityTypeConfig)(result.entityType);
    var Icon = config.icon;
    var entityLabel = (0, config_1.getEntityTypeLabel)(result.entityType);
    return (<button type="button" onClick={onSelect} className={(0, react_1.cn)("w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left", "transition-colors duration-150", "hover:bg-accent focus:bg-accent focus:outline-none", "group cursor-pointer")}>
      {/* Icon */}
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
        {Icon && <Icon className="w-4 h-4 text-muted-foreground"/>}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground truncate">
            <HighlightedText text={result.title} query={searchQuery}/>
          </span>
        </div>
        {result.description && (<p className="text-sm text-muted-foreground truncate mt-0.5">
            {result.description}
          </p>)}
      </div>

      {/* Entity type label + chevron */}
      <div className="flex-shrink-0 flex items-center gap-2 text-muted-foreground">
        <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          {entityLabel}
        </span>
        <lu_1.LuChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"/>
      </div>
    </button>);
}
// Helper to highlight matching text
function HighlightedText(_a) {
    var text = _a.text, query = _a.query;
    if (!query || query.length < 2) {
        return <>{text}</>;
    }
    var parts = text.split(new RegExp("(".concat(escapeRegExp(query), ")"), "gi"));
    return (<>
      {parts.map(function (part, i) {
            return part.toLowerCase() === query.toLowerCase() ? (<mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-inherit rounded-sm px-0.5">
            {part}
          </mark>) : (part);
        })}
    </>);
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
