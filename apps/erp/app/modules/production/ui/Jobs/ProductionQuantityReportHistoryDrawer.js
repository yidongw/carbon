"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.ProductionQuantityReportHistoryDrawer = ProductionQuantityReportHistoryDrawer;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var ProductionQuantityLineBreakdown_1 = require("./ProductionQuantityLineBreakdown");
var ProductionQuantityReportCardHeader_1 = require("./ProductionQuantityReportCardHeader");
var SupplierQuantityReportCardHeader_1 = require("./SupplierQuantityReportCardHeader");
function batchTotalQuantity(lines) {
    return lines.reduce(function (sum, line) { var _a; return sum + ((_a = line.quantity) !== null && _a !== void 0 ? _a : 0); }, 0);
}
function batchEmployeeId(lines) {
    var _a, _b;
    return (_b = (_a = lines.find(function (l) { return l.employeeId; })) === null || _a === void 0 ? void 0 : _a.employeeId) !== null && _b !== void 0 ? _b : null;
}
function batchCreatedBy(lines) {
    var _a, _b;
    return (_b = (_a = lines.find(function (l) { return l.createdBy; })) === null || _a === void 0 ? void 0 : _a.createdBy) !== null && _b !== void 0 ? _b : null;
}
function batchCreatedAt(lines) {
    var timestamps = lines
        .map(function (l) { return l.createdAt; })
        .filter(function (t) { return Boolean(t); });
    if (timestamps.length === 0)
        return null;
    return timestamps.reduce(function (earliest, t) {
        return new Date(t).getTime() < new Date(earliest).getTime() ? t : earliest;
    });
}
function groupInvalidatedLines(lines) {
    var _a, _b;
    var invalidated = lines.filter(function (l) { return l.invalidatedAt; });
    var batches = new Map();
    for (var _i = 0, invalidated_1 = invalidated; _i < invalidated_1.length; _i++) {
        var line = invalidated_1[_i];
        var key = "".concat(line.invalidatedAt, "|").concat((_a = line.invalidatedBy) !== null && _a !== void 0 ? _a : "");
        var existing = batches.get(key);
        if (existing) {
            existing.lines.push(line);
        }
        else {
            batches.set(key, {
                invalidatedAt: line.invalidatedAt,
                invalidatedBy: (_b = line.invalidatedBy) !== null && _b !== void 0 ? _b : "",
                lines: [line]
            });
        }
    }
    return __spreadArray([], batches.values(), true).sort(function (a, b) {
        return new Date(b.invalidatedAt).getTime() - new Date(a.invalidatedAt).getTime();
    });
}
function ProductionQuantityReportHistoryDrawer(_a) {
    var _this = this;
    var reportId = _a.reportId, configurationParameters = _a.configurationParameters, linesApiPath = _a.linesApiPath, supplierId = _a.supplierId, reportCreatedBy = _a.reportCreatedBy, open = _a.open, onClose = _a.onClose;
    var formatDateTime = (0, hooks_1.useDateFormatter)().formatDateTime;
    var _b = (0, react_2.useState)(false), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_2.useState)([]), lines = _c[0], setLines = _c[1];
    var _d = (0, react_2.useState)(null), error = _d[0], setError = _d[1];
    (0, react_2.useEffect)(function () {
        if (!open || !reportId)
            return;
        var cancelled = false;
        setLoading(true);
        setError(null);
        void fetch(linesApiPath !== null && linesApiPath !== void 0 ? linesApiPath : path_1.path.to.api.quantityReportLines(reportId, true))
            .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
            var body;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!res.ok) return [3 /*break*/, 2];
                        return [4 /*yield*/, res.json()];
                    case 1:
                        body = (_b.sent());
                        throw new Error((_a = body.error) !== null && _a !== void 0 ? _a : "Failed to load history");
                    case 2: return [2 /*return*/, res.json()];
                }
            });
        }); })
            .then(function (data) {
            var _a;
            if (!cancelled) {
                setLines((_a = data.lines) !== null && _a !== void 0 ? _a : []);
            }
        })
            .catch(function (err) {
            if (!cancelled) {
                setError(err.message);
            }
        })
            .finally(function () {
            if (!cancelled) {
                setLoading(false);
            }
        });
        return function () {
            cancelled = true;
        };
    }, [open, reportId, linesApiPath]);
    var batches = (0, react_2.useMemo)(function () { return groupInvalidatedLines(lines); }, [lines]);
    return (<react_1.Drawer open={open} onOpenChange={function (isOpen) { return !isOpen && onClose(); }}>
      <react_1.DrawerContent className="sm:max-w-lg">
        <react_1.DrawerHeader>
          <react_1.DrawerTitle>
            <macro_1.Trans>Report history</macro_1.Trans>
          </react_1.DrawerTitle>
        </react_1.DrawerHeader>
        <react_1.DrawerBody className="flex min-h-0 min-w-0 flex-col items-stretch gap-4">
          {loading ? <react_1.Loading isLoading/> : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          {!loading && !error ? (batches.length === 0 ? (<p className="text-sm text-muted-foreground">
                <macro_1.Trans>No previous versions</macro_1.Trans>
              </p>) : (<react_1.VStack className="w-full items-stretch gap-4">
                {batches.map(function (batch) {
                var _a;
                var totalQuantity = batchTotalQuantity(batch.lines);
                var employeeId = batchEmployeeId(batch.lines);
                var createdBy = (_a = batchCreatedBy(batch.lines)) !== null && _a !== void 0 ? _a : reportCreatedBy;
                var createdAt = batchCreatedAt(batch.lines);
                return (<div key={"".concat(batch.invalidatedAt, "-").concat(batch.invalidatedBy)} className="flex w-full flex-col gap-3 rounded-xl border border-border/70 bg-muted/30 p-3 dark:bg-muted/20">
                      {supplierId ? (<SupplierQuantityReportCardHeader_1.SupplierQuantityReportCardHeader supplierId={supplierId} createdBy={createdBy} summary={<macro_1.Trans>Reported {totalQuantity} units</macro_1.Trans>} timestamp={createdAt ? formatDateTime(createdAt) : ""}/>) : employeeId ? (<ProductionQuantityReportCardHeader_1.ProductionQuantityReportCardHeader employeeId={employeeId} createdBy={createdBy} summary={<macro_1.Trans>Reported {totalQuantity} units</macro_1.Trans>} timestamp={createdAt ? formatDateTime(createdAt) : ""}/>) : (<div>
                          <p className="text-sm font-medium leading-5 text-foreground">
                            <macro_1.Trans>
                              Reported{" "}
                              <span className="tabular-nums">
                                {totalQuantity}
                              </span>{" "}
                              units
                            </macro_1.Trans>
                          </p>
                          {createdAt ? (<p className="text-xs tabular-nums leading-5 text-muted-foreground">
                              {formatDateTime(createdAt)}
                            </p>) : null}
                        </div>)}
                      <div className="flex flex-col gap-2">
                        {batch.lines.map(function (line) { return (<ProductionQuantityLineBreakdown_1.ProductionQuantityLineBreakdown key={line.id} line={line} configurationParameters={configurationParameters}/>); })}
                      </div>
                    </div>);
            })}
              </react_1.VStack>)) : null}
        </react_1.DrawerBody>
      </react_1.DrawerContent>
    </react_1.Drawer>);
}
