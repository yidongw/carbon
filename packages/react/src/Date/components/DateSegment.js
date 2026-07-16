"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateSegment = void 0;
var datepicker_1 = require("@react-aria/datepicker");
var clsx_1 = require("clsx");
var react_1 = require("react");
var segmentSizeVariants = {
    sm: "text-sm",
    md: "text-sm",
    lg: "text-base"
};
var DateSegment = function (_a) {
    var segment = _a.segment, state = _a.state, _b = _a.size, size = _b === void 0 ? "md" : _b;
    var instanceId = (0, react_1.useId)();
    var ref = (0, react_1.useRef)(null);
    var segmentProps = (0, datepicker_1.useDateSegment)(segment, state, ref).segmentProps;
    if ("id" in segmentProps && segmentProps.id) {
        segmentProps.id = instanceId;
    }
    if ("aria-describedby" in segmentProps && segmentProps["aria-describedby"]) {
        segmentProps["aria-describedby"] = instanceId;
    }
    return (<div {...segmentProps} ref={ref} className={(0, clsx_1.default)("box-content tabular-nums text-right outline-none rounded-sm group focus:bg-primary focus:text-primary-foreground", segmentSizeVariants[size])}>
      <span aria-hidden="true" className={(0, clsx_1.default)("w-full text-center", {
            hidden: !segment.isPlaceholder,
            "h-0": !segment.isPlaceholder,
            block: segment.isPlaceholder
        })}>
        {segment.isPlaceholder
            ? segment.text.toUpperCase()
            : segment.placeholder}
      </span>
      {segment.isPlaceholder ? "" : segment.text}
    </div>);
};
exports.DateSegment = DateSegment;
