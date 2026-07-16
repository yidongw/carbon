"use client";
"use strict";
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
exports.AvatarOverflowIndicator = exports.AvatarGroupList = exports.AvatarGroup = exports.Avatar = exports.avatarVariants = void 0;
var utils_1 = require("@carbon/utils");
var class_variance_authority_1 = require("class-variance-authority");
var react_1 = require("react");
var cn_1 = require("./utils/cn");
exports.avatarVariants = (0, class_variance_authority_1.cva)("flex flex-shrink-0 overflow-hidden rounded-full items-center justify-center font-medium transition-transform duration-200 ease-in-out", {
    variants: {
        size: {
            "2xl": "h-32 w-32 text-6xl",
            xl: "h-24 w-24 text-4xl",
            lg: "h-16 w-16 text-2xl",
            md: "h-12 w-12 text-base",
            sm: "h-8 w-8 text-xs",
            xs: "h-6 w-6 text-xxs",
            xxs: "h-4 w-4 text-[8px] tracking-tight"
        },
        isGroup: {
            true: "ring-2 ring-background hover:-translate-y-1 hover:scale-110"
        }
    },
    defaultVariants: {
        size: "sm",
        isGroup: false
    }
});
var Avatar = (0, react_1.forwardRef)(function (_a, ref) {
    var _b;
    var className = _a.className, name = _a.name, src = _a.src, size = _a.size, children = _a.children, props = __rest(_a, ["className", "name", "src", "size", "children"]);
    var isGroup = !!((_b = useAvatarGroupContext()) === null || _b === void 0 ? void 0 : _b.limit);
    var avatarInitials = getInitials(name !== null && name !== void 0 ? name : "");
    var _c = (0, react_1.useState)(false), error = _c[0], setError = _c[1];
    var colorValue = (0, utils_1.getColorByValue)(name !== null && name !== void 0 ? name : "", "light");
    var background = colorValue === null || colorValue === void 0 ? void 0 : colorValue.background;
    var color = colorValue === null || colorValue === void 0 ? void 0 : colorValue.color;
    return src && !error ? (<img className={(0, cn_1.cn)((0, exports.avatarVariants)({ size: size, isGroup: isGroup }), "object-cover bg-muted-foreground border border-muted", className)} alt={name !== null && name !== void 0 ? name : "avatar"} src={src} onError={function () { return setError(true); }}/>) : (<span className={(0, cn_1.cn)((0, exports.avatarVariants)({
            size: size,
            isGroup: isGroup
        }), "bg-muted-foreground", className)} style={name ? { background: background, color: color } : undefined} {...props} ref={ref}>
        <>
          {avatarInitials ? (<span className="text-foreground no-underline" style={name ? { color: color } : undefined}>
              {avatarInitials}
            </span>) : (<svg viewBox="0 0 128 128" className="h-full w-full text-muted" role="img" style={name ? { color: color } : undefined} aria-label={name ? "".concat(name, " avatar") : "avatar"}>
              <path fill="currentColor" d="M103,102.1388 C93.094,111.92 79.3504,118 64.1638,118 C48.8056,118 34.9294,111.768 25,101.7892 L25,95.2 C25,86.8096 31.981,80 40.6,80 L87.4,80 C96.019,80 103,86.8096 103,95.2 L103,102.1388 Z"></path>
              <path fill="currentColor" d="M63.9961647,24 C51.2938136,24 41,34.2938136 41,46.9961647 C41,59.7061864 51.2938136,70 63.9961647,70 C76.6985159,70 87,59.7061864 87,46.9961647 C87,34.2938136 76.6985159,24 63.9961647,24"></path>
            </svg>)}
        </>
      </span>);
});
exports.Avatar = Avatar;
Avatar.displayName = "Avatar";
var AvatarGroupContext = (0, react_1.createContext)({
    size: undefined
});
var AvatarGroupProvider = function (_a) {
    var children = _a.children, limit = _a.limit, size = _a.size;
    var _b = (0, react_1.useState)(0), count = _b[0], setCount = _b[1];
    return (<AvatarGroupContext.Provider value={{
            count: count,
            setCount: setCount,
            limit: limit,
            size: size
        }}>
      {children}
    </AvatarGroupContext.Provider>);
};
var useAvatarGroupContext = function () { return (0, react_1.useContext)(AvatarGroupContext); };
var AvatarGroup = (0, react_1.forwardRef)(function (_a, ref) {
    var children = _a.children, className = _a.className, limit = _a.limit, _b = _a.size, size = _b === void 0 ? "sm" : _b, props = __rest(_a, ["children", "className", "limit", "size"]);
    return (<AvatarGroupProvider limit={limit} size={size}>
        <div ref={ref} className={(0, cn_1.cn)("flex items-center justify-start -space-x-2 [&>*:not(:first-of-type)]:mask-radial", className)} {...props}>
          {children}
        </div>
      </AvatarGroupProvider>);
});
exports.AvatarGroup = AvatarGroup;
AvatarGroup.displayName = "AvatarGroup";
var AvatarGroupList = function (_a) {
    var children = _a.children;
    var _b = useAvatarGroupContext(), limit = _b.limit, setCount = _b.setCount;
    setCount === null || setCount === void 0 ? void 0 : setCount(react_1.Children.count(children));
    return <>{limit ? react_1.Children.toArray(children).slice(0, limit) : children}</>;
};
exports.AvatarGroupList = AvatarGroupList;
var AvatarOverflowIndicator = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var _b = useAvatarGroupContext(), limit = _b.limit, count = _b.count, size = _b.size;
    if (!limit || !count || count <= limit)
        return null;
    return (<span ref={ref} className={(0, cn_1.cn)((0, exports.avatarVariants)({ size: size, isGroup: true }), "relative flex bg-muted-foreground ring-2 ring-background", className)} {...props}>
      +{count - limit}
    </span>);
});
exports.AvatarOverflowIndicator = AvatarOverflowIndicator;
AvatarOverflowIndicator.displayName = "AvatarOverflowIndicator";
function getInitials(name) {
    var _a;
    var names = name.trim().split(" ");
    var firstName = (_a = names[0]) !== null && _a !== void 0 ? _a : "";
    var lastName = names.length > 1 ? names[names.length - 1] : "";
    return firstName && lastName
        ? "".concat(firstName.charAt(0)).concat(lastName.charAt(0))
        : firstName.charAt(0);
}
