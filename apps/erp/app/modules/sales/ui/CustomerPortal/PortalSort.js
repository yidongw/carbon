"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortalSort = PortalSort;
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var hooks_1 = require("~/hooks");
function parseSort(value) {
    var match = value === null || value === void 0 ? void 0 : value.match(/^(.+):(asc|desc)$/);
    if (!match)
        return null;
    return { column: match[1], direction: match[2] };
}
function PortalSort(_a) {
    var _b, _c, _d, _e;
    var columns = _a.columns;
    var _f = (0, hooks_1.useUrlParams)(), params = _f[0], setParams = _f[1];
    var current = parseSort((_b = params.get("sort")) !== null && _b !== void 0 ? _b : undefined);
    var setSort = function (column, direction) {
        setParams({ sort: ["".concat(column, ":").concat(direction)] });
    };
    var clearSort = function () { return setParams({ sort: [] }); };
    var flipDirection = function () {
        if (!current)
            return;
        setSort(current.column, current.direction === "asc" ? "desc" : "asc");
    };
    var activeLabel = current
        ? ((_d = (_c = columns.find(function (c) { return c.value === current.column; })) === null || _c === void 0 ? void 0 : _c.label) !== null && _d !== void 0 ? _d : current.column)
        : null;
    return (<div className="flex items-center gap-1">
      <react_1.DropdownMenu>
        <react_1.DropdownMenuTrigger asChild>
          <react_1.Button variant="secondary" size="sm" leftIcon={<lu_1.LuArrowUpDown />} className="font-medium">
            {activeLabel ? (<span className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Sort:</span>
                <span>{activeLabel}</span>
              </span>) : (<span className="text-muted-foreground">Sort by…</span>)}
          </react_1.Button>
        </react_1.DropdownMenuTrigger>
        <react_1.DropdownMenuContent align="end" className="w-56">
          <react_1.DropdownMenuRadioGroup value={(_e = current === null || current === void 0 ? void 0 : current.column) !== null && _e !== void 0 ? _e : ""}>
            {columns.map(function (col) { return (<react_1.DropdownMenuRadioItem key={col.value} value={col.value} onClick={function () { var _a; return setSort(col.value, (_a = current === null || current === void 0 ? void 0 : current.direction) !== null && _a !== void 0 ? _a : "asc"); }}>
                {col.label}
              </react_1.DropdownMenuRadioItem>); })}
          </react_1.DropdownMenuRadioGroup>
          {current && (<>
              <react_1.DropdownMenuSeparator />
              <react_1.DropdownMenuItem onClick={clearSort} className="text-muted-foreground">
                <lu_1.LuArrowUpDown className="mr-2 size-4"/>
                Clear sort
              </react_1.DropdownMenuItem>
            </>)}
        </react_1.DropdownMenuContent>
      </react_1.DropdownMenu>
      <react_1.IconButton aria-label={(current === null || current === void 0 ? void 0 : current.direction) === "desc"
            ? "Switch to ascending"
            : "Switch to descending"} title={(current === null || current === void 0 ? void 0 : current.direction) === "desc"
            ? "Switch to ascending"
            : "Switch to descending"} size="sm" variant={current ? "secondary" : "ghost"} disabled={!current} onClick={flipDirection} icon={(current === null || current === void 0 ? void 0 : current.direction) === "desc" ? (<lu_1.LuArrowDown />) : (current === null || current === void 0 ? void 0 : current.direction) === "asc" ? (<lu_1.LuArrowUp />) : (<lu_1.LuArrowUpDown />)}/>
    </div>);
}
