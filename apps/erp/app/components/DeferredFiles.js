"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeferredFiles = DeferredFiles;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
function DocumentsSkeleton() {
    return (<react_1.Card className="flex-grow">
      <react_1.HStack className="justify-between items-start">
        <react_1.CardHeader>
          <react_1.Skeleton className="h-5 w-20"/>
        </react_1.CardHeader>
        <div className="py-2 px-4">
          <react_1.Skeleton className="h-9 w-24"/>
        </div>
      </react_1.HStack>
      <react_1.CardContent>
        <div className="flex flex-col">
          <react_1.HStack className="justify-between items-center pb-3 border-b border-border">
            <react_1.Skeleton className="h-3 w-12"/>
            <react_1.HStack className="gap-8">
              <react_1.Skeleton className="h-3 w-10"/>
              <react_1.Skeleton className="h-3 w-14"/>
              <div className="w-8"/>
            </react_1.HStack>
          </react_1.HStack>
          {Array.from({ length: 3 }).map(function (_, i) { return (<react_1.HStack key={i} className="justify-between items-center py-3 border-b border-border last:border-b-0">
              <react_1.HStack className="gap-3 flex-1 min-w-0">
                <react_1.Skeleton className="size-6 shrink-0 rounded"/>
                <react_1.Skeleton className="h-4 w-1/3"/>
              </react_1.HStack>
              <react_1.HStack className="gap-8">
                <react_1.Skeleton className="h-3 w-10"/>
                <react_1.Skeleton className="h-3 w-14"/>
                <react_1.Skeleton className="size-8 shrink-0"/>
              </react_1.HStack>
            </react_1.HStack>); })}
        </div>
      </react_1.CardContent>
    </react_1.Card>);
}
function FilesErrorFallback() {
    var _a = (0, react_router_1.useRevalidator)(), revalidate = _a.revalidate, state = _a.state;
    return (<react_1.Card className="flex-grow">
      <react_1.CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <lu_1.LuTriangleAlert className="size-5"/>
        </div>
        <div className="flex flex-col gap-1 max-w-xs">
          <p className="text-sm font-medium">
            <macro_1.Trans>Couldn't load documents</macro_1.Trans>
          </p>
          <p className="text-xs text-muted-foreground">
            <macro_1.Trans>
              The storage service didn't respond in time. Please try again.
            </macro_1.Trans>
          </p>
        </div>
        <react_1.Button variant="secondary" leftIcon={<lu_1.LuRefreshCw />} onClick={function () { return revalidate(); }} isLoading={state === "loading"}>
          <macro_1.Trans>Retry</macro_1.Trans>
        </react_1.Button>
      </react_1.CardContent>
    </react_1.Card>);
}
function DeferredFiles(_a) {
    var resolve = _a.resolve, children = _a.children, fallback = _a.fallback;
    return (<react_2.Suspense fallback={fallback !== null && fallback !== void 0 ? fallback : <DocumentsSkeleton />}>
      <react_router_1.Await resolve={resolve} errorElement={<FilesErrorFallback />}>
        {children}
      </react_router_1.Await>
    </react_2.Suspense>);
}
exports.default = DeferredFiles;
