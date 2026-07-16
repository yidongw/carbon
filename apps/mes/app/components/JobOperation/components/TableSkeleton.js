"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableSkeleton = TableSkeleton;
var react_1 = require("@carbon/react");
function TableSkeleton() {
    return (<react_1.Table>
      <react_1.Thead>
        <react_1.Tr>
          <react_1.Th>
            <react_1.Skeleton className="h-4 w-full"/>
          </react_1.Th>
          <react_1.Th>
            <react_1.Skeleton className="h-4 w-full"/>
          </react_1.Th>
        </react_1.Tr>
      </react_1.Thead>
      <react_1.Tbody>
        {__spreadArray([], Array(5), true).map(function (_, index) { return (<react_1.Tr key={"skeleton-".concat(index)}>
            <react_1.Td>
              <react_1.Skeleton className="h-4 w-full"/>
            </react_1.Td>
            <react_1.Td>
              <react_1.Skeleton className="h-4 w-full"/>
            </react_1.Td>
          </react_1.Tr>); })}
      </react_1.Tbody>
    </react_1.Table>);
}
