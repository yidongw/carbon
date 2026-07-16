"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationDetailTabs = OperationDetailTabs;
var react_1 = require("@carbon/react");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var operationFormLayout_1 = require("./operationFormLayout");
function OperationDetailTabs(_a) {
    var sections = _a.sections;
    var _b = (0, react_2.useState)(null), expandedId = _b[0], setExpandedId = _b[1];
    var expandedSection = sections.find(function (section) { return section.id === expandedId; });
    return (<div className="flex w-full flex-col overflow-hidden rounded-b-lg border border-border bg-card shadow-sm">
      <div className={(0, react_1.cn)("grid w-full grid-cols-2 gap-px bg-border sm:grid-cols-4", expandedSection && "border-b border-border")}>
        {sections.map(function (section) {
            var isExpanded = expandedId === section.id;
            return (<button key={section.id} type="button" title={section.summary && !isExpanded
                    ? section.summaryTitle
                    : undefined} aria-label={section.summary && !isExpanded && section.summaryTitle
                    ? "".concat(section.accessibilityLabel, ", ").concat(section.summaryTitle)
                    : section.accessibilityLabel} className={(0, react_1.cn)("group relative flex min-w-0 items-center gap-2 border-b-2 bg-muted/40 px-3 py-2.5 text-left transition-[color,background-color,border-color] duration-200", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset", isExpanded
                    ? "z-10 -mb-px border-b-primary bg-background text-foreground"
                    : "z-0 border-b-transparent text-muted-foreground hover:bg-muted hover:text-foreground")} onClick={function () { return setExpandedId(isExpanded ? null : section.id); }}>
              <framer_motion_1.motion.span animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ type: "spring", bounce: 0, duration: 0.25 }} className={(0, react_1.cn)("flex shrink-0 transition-colors duration-200", isExpanded
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground")}>
                <lu_1.LuChevronRight className="h-4 w-4"/>
              </framer_motion_1.motion.span>
              <span className={(0, react_1.cn)("shrink-0 transition-colors duration-200", isExpanded
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground")}>
                {section.icon}
              </span>
              <span className={(0, react_1.cn)("min-w-0 flex-1 text-sm font-medium text-balance tabular-nums transition-colors duration-200", isExpanded
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground", section.summary && !isExpanded && "text-foreground/90")}>
                {section.summary && !isExpanded
                    ? section.summary
                    : section.label}
              </span>
            </button>);
        })}
      </div>
      <div className="relative overflow-hidden rounded-b-lg border-t border-border bg-background">
        {sections.map(function (section) {
            var _a;
            var isVisible = expandedId === section.id;
            return (<div key={section.id} className={(0, react_1.cn)((_a = section.contentClassName) !== null && _a !== void 0 ? _a : operationFormLayout_1.operationDetailSectionGridClass, "transition-opacity duration-200", isVisible
                    ? "relative opacity-100"
                    : "pointer-events-none absolute inset-x-0 top-0 h-0 overflow-hidden opacity-0")}>
              {section.content}
            </div>);
        })}
      </div>
    </div>);
}
