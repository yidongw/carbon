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
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderLazyOverlay = renderLazyOverlay;
var react_1 = require("@carbon/react");
var react_2 = require("react");
function overlayFormInjectedProps(ctx) {
    return {
        onDismiss: ctx.close,
        fetcher: ctx.submitFetcher,
        confirmMode: ctx.confirmMode,
        onConfirmSuccess: ctx.onConfirmSuccess,
        action: ctx.confirmMode === "server" ? ctx.url : undefined
    };
}
function LoadingFallback() {
    return (<div className="flex min-h-[200px] items-center justify-center p-6">
      <react_1.Loading isLoading/>
    </div>);
}
function LazyOverlayContent(_a) {
    var Component = _a.component, props = _a.props;
    return <Component {...props}/>;
}
function renderLazyOverlay(selectProps, factory) {
    var LazyContent = (0, react_2.lazy)(factory);
    var Renderer = function (ctx) {
        if (ctx.isLoading) {
            return <LoadingFallback />;
        }
        if (ctx.loaderData === undefined) {
            return null;
        }
        var contentProps = selectProps(ctx);
        if (!contentProps)
            return null;
        var props = __assign(__assign({}, contentProps), overlayFormInjectedProps(ctx));
        return (<react_2.Suspense fallback={<LoadingFallback />}>
        <LazyOverlayContent component={LazyContent} props={props}/>
      </react_2.Suspense>);
    };
    Renderer.displayName = "LazyOverlay";
    return Renderer;
}
