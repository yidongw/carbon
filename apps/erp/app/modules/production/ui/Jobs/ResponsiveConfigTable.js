"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponsiveConfigTable = ResponsiveConfigTable;
var react_1 = require("@carbon/react");
var configTableShared_1 = require("./configTableShared");
function isZeroOrEmpty(value) {
    if (value === undefined)
        return true;
    var stringValue = String(value).trim();
    if (stringValue === "")
        return true;
    return Number(stringValue) === 0;
}
function defaultIsFieldEmpty(row, column) {
    return isZeroOrEmpty(row[column.key]);
}
function visibleFieldsForVerticalReadOnly(rows, columns, isFieldEmpty) {
    return columns.filter(function (col) { return rows.some(function (row) { return !isFieldEmpty(row, col); }); });
}
var stickyLabelClass = "sticky left-0 z-10 bg-background px-3 py-1.5 text-xs font-medium whitespace-nowrap border-r border-border shadow-[4px_0_8px_-4px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_8px_-4px_rgba(0,0,0,0.35)]";
/**
 * Config-table layout that renders a horizontal table on md+ screens and a
 * transposed table on smaller viewports (field labels in a sticky left column,
 * values scrolling horizontally to the right).
 */
function ResponsiveConfigTable(_a) {
    var columns = _a.columns, rows = _a.rows, _b = _a.hasReferences, hasReferences = _b === void 0 ? false : _b, _c = _a.hideZeroValuesInVertical, hideZeroValuesInVertical = _c === void 0 ? false : _c, isFieldEmpty = _a.isFieldEmpty, _d = _a.getColumnWidthClass, getColumnWidthClass = _d === void 0 ? configTableShared_1.getColumnWidthClass : _d, getCellClassName = _a.getCellClassName, renderCell = _a.renderCell, renderRowActions = _a.renderRowActions;
    if (rows.length === 0)
        return null;
    var resolveFieldEmpty = isFieldEmpty !== null && isFieldEmpty !== void 0 ? isFieldEmpty : defaultIsFieldEmpty;
    var fieldRows = hideZeroValuesInVertical
        ? visibleFieldsForVerticalReadOnly(rows, columns, resolveFieldEmpty)
        : columns;
    var cellClassName = function (col) {
        return getCellClassName
            ? getCellClassName(col, hasReferences)
            : (0, react_1.cn)("px-3 py-1.5", getColumnWidthClass(col, hasReferences));
    };
    return (<>
      <div className="hidden max-w-full overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent md:block">
        <react_1.Table className="w-auto min-w-max table-fixed">
          <react_1.Thead>
            <react_1.Tr>
              {columns.map(function (col) { return (<react_1.Th key={col.key} className={(0, react_1.cn)("px-3 text-xs whitespace-nowrap", getColumnWidthClass(col, hasReferences))}>
                  {col.label}
                </react_1.Th>); })}
              {renderRowActions ? (<react_1.Th className="px-3 w-10 min-w-10 max-w-10"/>) : null}
            </react_1.Tr>
          </react_1.Thead>
          <react_1.Tbody>
            {rows.map(function (row, rowIndex) { return (<react_1.Tr key={rowIndex}>
                {columns.map(function (col) { return (<react_1.Td key={col.key} className={cellClassName(col)}>
                    {renderCell(col, row, rowIndex)}
                  </react_1.Td>); })}
                {renderRowActions ? (<react_1.Td className="px-3 py-1.5 w-10 min-w-10 max-w-10">
                    {renderRowActions(rowIndex)}
                  </react_1.Td>) : null}
              </react_1.Tr>); })}
          </react_1.Tbody>
        </react_1.Table>
      </div>

      <div className="max-w-full overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent md:hidden">
        <react_1.Table className="w-auto min-w-max table-fixed">
          <react_1.Tbody>
            {fieldRows.map(function (col) { return (<react_1.Tr key={col.key}>
                <react_1.Th className={(0, react_1.cn)(stickyLabelClass, "min-w-[5rem] max-w-[8rem]")}>
                  {col.label}
                </react_1.Th>
                {rows.map(function (row, rowIndex) { return (<react_1.Td key={rowIndex} className={cellClassName(col)}>
                    {renderCell(col, row, rowIndex)}
                  </react_1.Td>); })}
              </react_1.Tr>); })}
            {renderRowActions ? (<react_1.Tr>
                <react_1.Th className={(0, react_1.cn)(stickyLabelClass, "min-w-[5rem]")}/>
                {rows.map(function (_, rowIndex) { return (<react_1.Td key={rowIndex} className="px-3 py-1.5 w-10 min-w-10 max-w-10">
                    {renderRowActions(rowIndex)}
                  </react_1.Td>); })}
              </react_1.Tr>) : null}
          </react_1.Tbody>
        </react_1.Table>
      </div>
    </>);
}
