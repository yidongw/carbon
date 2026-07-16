"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchEmptyState = SearchEmptyState;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var framer_motion_1 = require("framer-motion");
var lu_1 = require("react-icons/lu");
function SearchEmptyState(_a) {
    var type = _a.type, query = _a.query;
    var t = (0, macro_1.useLingui)().t;
    if (type === "loading") {
        return (<div className="px-3 py-2 space-y-2">
        {[1, 2, 3].map(function (i) { return (<framer_motion_1.motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 px-3 py-3">
            <react_1.Skeleton className="w-9 h-9 rounded-lg flex-shrink-0"/>
            <div className="flex-1 space-y-2">
              <react_1.Skeleton className="h-4 w-3/4"/>
              <react_1.Skeleton className="h-3 w-1/2"/>
            </div>
          </framer_motion_1.motion.div>); })}
      </div>);
    }
    if (type === "no-results") {
        return (<framer_motion_1.motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <lu_1.LuSearch className="w-6 h-6 text-muted-foreground"/>
        </div>
        <p className="text-sm font-medium text-foreground mb-1">
          <macro_1.Trans>No results found</macro_1.Trans>
        </p>
        <p className="text-sm text-muted-foreground">
          {t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["No matches for \"", "\". Try a different search term."], ["No matches for \"", "\". Try a different search term."])), query)}
        </p>
      </framer_motion_1.motion.div>);
    }
    // Initial state - shown before user starts typing
    return (<framer_motion_1.motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <p className="text-sm text-muted-foreground">
        <macro_1.Trans>Type to search across your workspace</macro_1.Trans>
      </p>
    </framer_motion_1.motion.div>);
}
var templateObject_1;
