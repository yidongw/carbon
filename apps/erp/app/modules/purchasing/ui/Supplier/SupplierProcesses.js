"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Editable_1 = require("~/components/Editable");
var Grid_1 = require("~/components/Grid");
var hooks_1 = require("~/hooks");
var useCustomColumns_1 = require("~/hooks/useCustomColumns");
var path_1 = require("~/utils/path");
var SupplierProccesses = function (_a) {
    var _b;
    var processes = _a.processes;
    var supplierId = (0, react_router_1.useParams)().supplierId;
    if (!supplierId)
        throw new Error("supplierId not found");
    var _c = (0, hooks_1.useUser)(), userId = _c.id, company = _c.company;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var canEdit = permissions.can("update", "purchasing");
    var canDelete = permissions.can("delete", "purchasing");
    var carbon = (0, auth_1.useCarbon)().carbon;
    var baseCurrency = (_b = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD";
    var onCellEdit = (0, react_2.useCallback)(function (id, value, row) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!carbon)
                        throw new Error("Carbon client not found");
                    return [4 /*yield*/, carbon
                            .from("supplierProcess")
                            .update((_a = {},
                            _a[id] = value,
                            _a.updatedBy = userId,
                            _a))
                            .eq("id", row.id)];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    }); }, [carbon, userId]);
    var customColumns = (0, useCustomColumns_1.useCustomColumns)("supplierProcess");
    var formatter = (0, hooks_1.useCurrencyFormatter)();
    var columns = (0, react_2.useMemo)(function () {
        var defaultColumns = [
            {
                accessorKey: "proccessName",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Process"], ["Process"]))),
                cell: function (_a) {
                    var row = _a.row;
                    return (<react_1.HStack className="justify-between min-w-[100px]">
            <span>{row.original.processName}</span>
            <div className="relative w-6 h-5">
              <react_1.DropdownMenu>
                <react_1.DropdownMenuTrigger asChild>
                  <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Edit supplier process"], ["Edit supplier process"])))} icon={<lu_1.LuEllipsisVertical />} size="md" className="absolute right-[-1px] top-[-6px]" variant="ghost" onClick={function (e) { return e.stopPropagation(); }}/>
                </react_1.DropdownMenuTrigger>
                <react_1.DropdownMenuContent>
                  <react_1.DropdownMenuItem onClick={function () {
                            return navigate(path_1.path.to.supplierProcess(supplierId, row.original.id));
                        }} disabled={!canEdit}>
                    <react_1.DropdownMenuIcon icon={<lu_1.LuPencil />}/>
                    <macro_1.Trans>Edit Process</macro_1.Trans>
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuItem onClick={function () {
                            return navigate(path_1.path.to.deleteSupplierProcess(supplierId, row.original.id));
                        }} destructive disabled={!canDelete}>
                    <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                    <macro_1.Trans>Delete Process</macro_1.Trans>
                  </react_1.DropdownMenuItem>
                </react_1.DropdownMenuContent>
              </react_1.DropdownMenu>
            </div>
          </react_1.HStack>);
                }
            },
            {
                accessorKey: "minimumCost",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Minimum Cost"], ["Minimum Cost"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return formatter.format((_b = row.original.minimumCost) !== null && _b !== void 0 ? _b : 0);
                }
            },
            {
                accessorKey: "unitCost",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Unit Cost"], ["Unit Cost"]))),
                cell: function (_a) {
                    var _b;
                    var row = _a.row;
                    return formatter.format((_b = row.original.unitCost) !== null && _b !== void 0 ? _b : 0);
                }
            },
            {
                accessorKey: "leadTime",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Lead Time"], ["Lead Time"]))),
                cell: function (item) { return item.getValue(); }
            }
        ];
        return __spreadArray(__spreadArray([], defaultColumns, true), customColumns, true);
    }, [customColumns, canEdit, canDelete, navigate, supplierId, formatter, t]);
    var editableComponents = (0, react_2.useMemo)(function () { return ({
        minimumCost: (0, Editable_1.EditableNumber)(onCellEdit, {
            formatOptions: {
                style: "currency",
                currency: baseCurrency
            }
        }),
        unitCost: (0, Editable_1.EditableNumber)(onCellEdit, {
            formatOptions: {
                style: "currency",
                currency: baseCurrency
            }
        }),
        leadTime: (0, Editable_1.EditableNumber)(onCellEdit)
    }); }, [onCellEdit, baseCurrency]);
    return (<>
      <react_1.Card className="w-full h-full min-h-[50vh]">
        <react_1.HStack className="justify-between items-start">
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Supplier Processes</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardAction>{canEdit && <components_1.New to="new"/>}</react_1.CardAction>
        </react_1.HStack>

        <react_1.CardContent>
          <Grid_1.default data={processes !== null && processes !== void 0 ? processes : []} columns={columns} canEdit={canEdit} editableComponents={editableComponents} onNewRow={canEdit ? function () { return navigate("new"); } : undefined}/>
        </react_1.CardContent>
      </react_1.Card>
      <react_router_1.Outlet />
    </>);
};
exports.default = SupplierProccesses;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
