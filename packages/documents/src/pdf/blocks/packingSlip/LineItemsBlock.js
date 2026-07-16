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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineItemsBlock = LineItemsBlock;
var node_1 = require("@bwip-js/node");
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
    var shipmentLines = data.shipmentLines, trackedEntities = data.trackedEntities, thumbnails = data.thumbnails, theme = data.theme;
    var opts = __assign(__assign({}, template_1.DEFAULT_LINE_ITEMS_OPTIONS), block.options);
    var overflow = (0, itemText_1.itemTextOverflowStyle)(opts);
    var hasTrackedEntities = trackedEntities.length > 0;
    var rowIndex = 0;
    return (<renderer_1.View style={tw("mb-4")}>
      <renderer_1.View style={[
            tw("flex flex-row py-2 px-3 text-[9px] font-bold"),
            { backgroundColor: theme.accent, color: theme.accentForeground }
        ]}>
        <renderer_1.Text style={tw("w-".concat(hasTrackedEntities ? "5/12" : "7/12", " text-left"))}>
          Description
        </renderer_1.Text>
        <renderer_1.Text style={tw("w-2/12 text-right")}>Qty</renderer_1.Text>
        {hasTrackedEntities && (<renderer_1.Text style={tw("w-5/12 text-right")}>Serial/Batch</renderer_1.Text>)}
      </renderer_1.View>

      {shipmentLines
            .filter(function (line) { var _a; return ((_a = line === null || line === void 0 ? void 0 : line.shippedQuantity) !== null && _a !== void 0 ? _a : 0) > 0; })
            .map(function (line) {
            var barcodeDataUrl = generateBarcode((line === null || line === void 0 ? void 0 : line.itemReadableId) || "");
            var trackedEntitiesForLine = trackedEntities.filter(function (entity) {
                var _a;
                return ((_a = entity.attributes) === null || _a === void 0 ? void 0 : _a["Shipment Line"]) === line.id;
            });
            var isEven = rowIndex % 2 === 0;
            rowIndex++;
            var rowBg = !opts.zebra || isEven ? "bg-white" : "bg-gray-50";
            return (<renderer_1.View key={line.id} style={tw("flex flex-row py-2 px-3 border-b border-gray-200 text-[10px] ".concat(rowBg))} wrap={false}>
              <renderer_1.View style={tw("w-".concat(hasTrackedEntities ? "5/12" : "7/12", " pr-2"))}>
                <renderer_1.Text style={__assign(__assign({}, tw("text-gray-800")), overflow)}>
                  {line.itemReadableId}
                </renderer_1.Text>
                <renderer_1.Text style={__assign(__assign({}, tw("text-[8px] text-gray-400 mt-0.5")), overflow)}>
                  {line.description}
                </renderer_1.Text>
                {opts.showThumbnails &&
                    thumbnails &&
                    line.id != null &&
                    line.id in thumbnails &&
                    thumbnails[line.id] && (<renderer_1.View style={tw("mt-1 w-16")}>
                      <renderer_1.Image src={thumbnails[line.id]} style={tw("w-full h-auto")}/>
                    </renderer_1.View>)}
                <renderer_1.View style={tw("mt-1")}>
                  <renderer_1.Image src={barcodeDataUrl} style={tw("max-w-[50%]")}/>
                </renderer_1.View>
              </renderer_1.View>
              <renderer_1.Text style={tw("w-2/12 text-right text-gray-600")}>
                {"".concat(line.shippedQuantity, " / ").concat(line.orderQuantity, " ").concat(line.unitOfMeasure)}
              </renderer_1.Text>
              {hasTrackedEntities && (<renderer_1.View style={tw("w-5/12 flex flex-col gap-1 items-end")}>
                  {trackedEntitiesForLine.map(function (entity) {
                        var qrCodeDataUrl = (0, qr_code_1.generateQRCode)(entity.id, 8);
                        return (<renderer_1.View key={entity.id} style={tw("mb-1 flex flex-row items-center gap-1")}>
                        <renderer_1.Text style={tw("text-[8px] text-gray-600")}>
                          {entity.id}
                        </renderer_1.Text>
                        <renderer_1.Image src={qrCodeDataUrl} style={{ width: 24, height: 24 }}/>
                      </renderer_1.View>);
                    })}
                </renderer_1.View>)}
            </renderer_1.View>);
        })}
    </renderer_1.View>);
}
