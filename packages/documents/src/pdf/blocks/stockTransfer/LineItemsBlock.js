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
exports.LineItemsBlock = LineItemsBlock;
var node_1 = require("@bwip-js/node");
var env_1 = require("@carbon/env");
var renderer_1 = require("@react-pdf/renderer");
var qr_code_1 = require("../../../qr/qr-code");
var template_1 = require("../../../template");
var itemText_1 = require("../itemText");
var tw_1 = require("../tw");
function generateBarcode(text) {
    return __awaiter(this, void 0, void 0, function () {
        var buffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, node_1.default.toBuffer({
                        bcid: "code128",
                        text: text,
                        scale: 3,
                        height: 5,
                        includetext: true,
                        textxalign: "center"
                    })];
                case 1:
                    buffer = _a.sent();
                    return [2 /*return*/, "data:image/png;base64,".concat(buffer.toString("base64"))];
            }
        });
    });
}
function LineItemsBlock(_a) {
    var block = _a.block, data = _a.data;
    var tw = (0, tw_1.useTw)();
    var stockTransferLines = data.stockTransferLines, thumbnails = data.thumbnails, theme = data.theme;
    var opts = __assign(__assign({}, template_1.DEFAULT_LINE_ITEMS_OPTIONS), block.options);
    var overflow = (0, itemText_1.itemTextOverflowStyle)(opts);
    return (<renderer_1.View style={tw("mb-6 text-xs")}>
      <renderer_1.View style={[
            tw("flex flex-row py-2 px-3 text-[9px] font-bold"),
            { backgroundColor: theme.accent, color: theme.accentForeground }
        ]}>
        <renderer_1.Text style={tw("w-2/5 text-left")}>Description</renderer_1.Text>
        <renderer_1.Text style={tw("w-1/4 text-center")}>Transfer</renderer_1.Text>
        <renderer_1.Text style={tw("w-1/6 text-center")}>Qty</renderer_1.Text>
        <renderer_1.Text style={tw("w-1/8 text-center")}>Pick</renderer_1.Text>
      </renderer_1.View>

      {__spreadArray([], stockTransferLines, true).sort(function (a, b) {
            var storageUnitA = a.fromStorageUnitName || "Any";
            var storageUnitB = b.fromStorageUnitName || "Any";
            return storageUnitA.localeCompare(storageUnitB);
        })
            .map(function (line) {
            var _a;
            var barcodeDataUrl = generateBarcode((_a = line.itemReadableId) !== null && _a !== void 0 ? _a : "");
            var pickUrl = "".concat((0, env_1.getAppUrl)(), "/api/stock-transfer/").concat(line.id, "/pick");
            if (line.requiresSerialTracking) {
                pickUrl += "?type=serial";
            }
            else if (line.requiresBatchTracking) {
                pickUrl += "?type=batch";
            }
            var pickQRCode = (0, qr_code_1.generateQRCode)(pickUrl, 4);
            return (<renderer_1.View style={tw("flex flex-row justify-between py-2 px-3 border-b border-gray-200 text-[10px]")} key={line.id} wrap={false}>
              <renderer_1.View style={tw("w-2/5")}>
                <renderer_1.Text style={__assign(__assign({}, tw("font-bold mb-1")), overflow)}>
                  {line.itemDescription}
                </renderer_1.Text>
                <renderer_1.Text style={__assign(__assign({}, tw("text-[9px] opacity-80 mb-2")), overflow)}>
                  {line.itemReadableId}
                </renderer_1.Text>
                {opts.showThumbnails &&
                    thumbnails &&
                    line.id != null &&
                    line.id in thumbnails &&
                    thumbnails[line.id] && (<renderer_1.View style={tw("mt-2 mb-2")}>
                      <renderer_1.Image src={thumbnails[line.id]} style={tw("w-1/4 h-auto max-w-[25%]")}/>
                    </renderer_1.View>)}
                <renderer_1.Image src={barcodeDataUrl} style={tw("max-w-[50%]")}/>
              </renderer_1.View>

              <renderer_1.View style={tw("w-1/4 text-center")}>
                <renderer_1.Text style={tw("text-xs")}>
                  {line.fromStorageUnitName || "Any"} →{" "}
                  {line.toStorageUnitName || "Any"}
                </renderer_1.Text>
              </renderer_1.View>

              <renderer_1.Text style={tw("w-1/6 text-center")}>
                {"".concat(line.quantity, " ").concat(line.unitOfMeasure)}
              </renderer_1.Text>

              <renderer_1.View style={tw("w-1/8 flex flex-col items-center")}>
                <renderer_1.Image src={pickQRCode} style={tw("h-16 w-16")}/>
              </renderer_1.View>
            </renderer_1.View>);
        })}
    </renderer_1.View>);
}
