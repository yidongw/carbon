"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingSkeleton = LoadingSkeleton;
exports.default = InfiniteScroll;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_intersection_observer_1 = require("react-intersection-observer");
var Empty_1 = require("./Empty");
function LoadingSkeleton(_a) {
    var ref = _a.ref;
    return (<>
      <div ref={ref} className="flex items-center space-x-4 p-4">
        <react_1.Skeleton className="h-8 w-8 rounded-full"/>
        <div className="space-y-2">
          <react_1.Skeleton className="h-4 w-[250px]"/>
          <react_1.Skeleton className="h-4 w-[200px]"/>
        </div>
      </div>
      <div className="flex items-center space-x-4 p-4">
        <react_1.Skeleton className="h-8 w-8 rounded-full"/>
        <div className="space-y-2">
          <react_1.Skeleton className="h-4 w-[250px]"/>
          <react_1.Skeleton className="h-4 w-[200px]"/>
        </div>
      </div>
      <div className="flex items-center space-x-4 p-4">
        <react_1.Skeleton className="h-8 w-8 rounded-full"/>
        <div className="space-y-2">
          <react_1.Skeleton className="h-4 w-[250px]"/>
          <react_1.Skeleton className="h-4 w-[200px]"/>
        </div>
      </div>
    </>);
}
function InfiniteScroll(_a) {
    var Component = _a.component, items = _a.items, loadMore = _a.loadMore, hasMore = _a.hasMore, listClassName = _a.listClassName;
    var _b = (0, react_intersection_observer_1.useInView)({
        threshold: 0
    }), ref = _b.ref, inView = _b.inView;
    (0, react_2.useEffect)(function () {
        if (inView) {
            loadMore();
        }
    }, [inView, loadMore]);
    return (<div className="w-full">
      <ul className={(0, react_1.cn)("relative flex h-full flex-col gap-2 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent", listClassName)}>
        {items.length === 0 ? (<div className="flex pt-16 justify-center">
            <Empty_1.default />
          </div>) : (items.map(function (item) { return <Component key={item.id} item={item}/>; }))}
        <div ref={ref}>{hasMore && <LoadingSkeleton />}</div>
      </ul>
    </div>);
}
