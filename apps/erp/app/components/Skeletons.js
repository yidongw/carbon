"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExplorerSkeleton = ExplorerSkeleton;
var react_1 = require("@carbon/react");
function ExplorerSkeleton() {
    return (<div className="space-y-2">
      <react_1.Skeleton className="h-6 w-full"/>
      <react_1.Skeleton className="h-4 w-3/4"/>
      <react_1.Skeleton className="h-4 w-5/6"/>
      <react_1.Skeleton className="h-4 w-2/3"/>
      <react_1.Skeleton className="h-4 w-4/5"/>
    </div>);
}
