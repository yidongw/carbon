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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.default = PickingListLineDetailRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_router_1 = require("react-router");
var inventory_1 = require("~/modules/inventory");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, pickingListId, lineId, pickingListLine, _c, _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "inventory"
                    })];
                case 1:
                    client = (_e.sent()).client;
                    pickingListId = params.pickingListId, lineId = params.lineId;
                    if (!pickingListId)
                        throw new Error("pickingListId not found");
                    if (!lineId)
                        throw new Error("lineId not found");
                    return [4 /*yield*/, (0, inventory_1.getPickingListLine)(client, lineId)];
                case 2:
                    pickingListLine = _e.sent();
                    if (!pickingListLine.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.pickingListDetails(pickingListId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(pickingListLine.error, "Failed to load picking list line"))];
                case 3: throw _c.apply(void 0, _d.concat([_e.sent()]));
                case 4: return [2 /*return*/, { pickingListLine: pickingListLine.data }];
            }
        });
    });
}
function PickingListLineDetailRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    var params = (0, react_router_1.useParams)();
    var pickingListId = params.pickingListId, lineId = params.lineId;
    if (!pickingListId)
        throw new Error("pickingListId not found");
    if (!lineId)
        throw new Error("lineId not found");
    var pickingListLine = (0, react_router_1.useLoaderData)().pickingListLine;
    var navigate = (0, react_router_1.useNavigate)();
    if (!pickingListLine)
        return null;
    return (<div className="border rounded-lg p-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {(_b = (_a = pickingListLine.item) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "Unknown Item"}
          </h3>
          <button type="button" className="text-sm text-muted-foreground hover:text-foreground" onClick={function () { return navigate(path_1.path.to.pickingListDetails(pickingListId)); }}>
            Back to Lines
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Item</span>
            <p className="font-medium">
              {(_c = pickingListLine.item) === null || _c === void 0 ? void 0 : _c.readableId} - {(_d = pickingListLine.item) === null || _d === void 0 ? void 0 : _d.name}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Job</span>
            <p className="font-medium">{(_f = (_e = pickingListLine.job) === null || _e === void 0 ? void 0 : _e.jobId) !== null && _f !== void 0 ? _f : "N/A"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Operation</span>
            <p className="font-medium">
              {(_j = (_h = (_g = pickingListLine.jobOperation) === null || _g === void 0 ? void 0 : _g.process) === null || _h === void 0 ? void 0 : _h.name) !== null && _j !== void 0 ? _j : "N/A"} (Op{" "}
              {(_l = (_k = pickingListLine.jobOperation) === null || _k === void 0 ? void 0 : _k.order) !== null && _l !== void 0 ? _l : ""})
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Work Center</span>
            <p className="font-medium">
              {(_p = (_o = (_m = pickingListLine.jobOperation) === null || _m === void 0 ? void 0 : _m.workCenter) === null || _o === void 0 ? void 0 : _o.name) !== null && _p !== void 0 ? _p : "N/A"}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Qty to Pick</span>
            <p className="font-medium">
              {Number((_q = pickingListLine.quantityToPick) !== null && _q !== void 0 ? _q : 0).toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Qty Picked</span>
            <p className="font-medium">
              {Number((_r = pickingListLine.quantityPicked) !== null && _r !== void 0 ? _r : 0).toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Storage Unit</span>
            <p className="font-medium">
              {(_t = (_s = pickingListLine.storageUnit) === null || _s === void 0 ? void 0 : _s.name) !== null && _t !== void 0 ? _t : "N/A"}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Status</span>
            <p className="font-medium">{(_u = pickingListLine.status) !== null && _u !== void 0 ? _u : "Pending"}</p>
          </div>
        </div>
      </div>
    </div>);
}
