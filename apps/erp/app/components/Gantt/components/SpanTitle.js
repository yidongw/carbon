"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpanTitle = SpanTitle;
exports.SpanBadgeAccessory = SpanBadgeAccessory;
exports.eventBackgroundClassName = eventBackgroundClassName;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
function SpanTitle(event) {
    return (<span className={(0, react_1.cn)("flex items-center gap-x-2 overflow-x-hidden", eventTextClassName(event))}>
      <span className="truncate">{event.message}</span>{" "}
      <SpanAccessory accessory={event.style.accessory} size={event.size}/>
    </span>);
}
function SpanAccessory(_a) {
    var accessory = _a.accessory, size = _a.size;
    if (!accessory) {
        return null;
    }
    switch (accessory.style) {
        case "person": {
            return (<SpanBadgeAccessory accessory={accessory} className={(0, react_1.cn)("overflow-x-hidden", size === "large" ? "text-sm" : "text-xs")}/>);
        }
        default: {
            return (<div className={(0, react_1.cn)("flex gap-1")}>
          {accessory.items.map(function (item, index) { return (<span key={index} className={(0, react_1.cn)("inline-flex items-center gap-1")}>
              {item.text}
            </span>); })}
        </div>);
        }
    }
}
function SpanBadgeAccessory(_a) {
    var accessory = _a.accessory, className = _a.className;
    return (<react_1.Badge variant="outline" className={(0, react_1.cn)("inline-flex items-center gap-0.5 truncate ", className)}>
      {accessory.items.map(function (item, index) { return (<react_2.Fragment key={index}>
          <span className={(0, react_1.cn)("truncate")}>{item.text}</span>
          {index < accessory.items.length - 1 && (<span className="text-muted-foreground">
              <lu_1.LuChevronRight className="h-4 w-4"/>
            </span>)}
        </react_2.Fragment>); })}
    </react_1.Badge>);
}
function eventTextClassName(event) {
    switch (event.level) {
        case "TRACE": {
            return textClassNameForVariant(event.style.variant);
        }
        case "LOG":
        case "INFO":
        case "DEBUG": {
            return textClassNameForVariant(event.style.variant);
        }
        case "WARN": {
            return "text-orange-500";
        }
        case "ERROR": {
            return "text-red-500";
        }
        default: {
            return textClassNameForVariant(event.style.variant);
        }
    }
}
function eventBackgroundClassName(event) {
    if (event.isError) {
        return "bg-red-500";
    }
    if (event.isCancelled) {
        return "bg-muted";
    }
    switch (event.level) {
        case "TRACE": {
            return backgroundClassNameForVariant(event.style.variant, event.isPartial);
        }
        case "LOG":
        case "INFO":
        case "DEBUG": {
            return backgroundClassNameForVariant(event.style.variant, event.isPartial);
        }
        case "WARN": {
            return "bg-orange-500";
        }
        case "ERROR": {
            return "bg-red-500";
        }
        default: {
            return backgroundClassNameForVariant(event.style.variant, event.isPartial);
        }
    }
}
function textClassNameForVariant(variant) {
    switch (variant) {
        case "primary": {
            return "text-foreground";
        }
        default: {
            return "text-muted-foreground";
        }
    }
}
function backgroundClassNameForVariant(variant, isPartial) {
    switch (variant) {
        case "primary": {
            if (isPartial) {
                return "bg-blue-500";
            }
            return "bg-emerald-500";
        }
        default: {
            return "bg-gray-500";
        }
    }
}
