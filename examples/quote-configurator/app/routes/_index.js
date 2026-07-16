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
exports.action = action;
exports.default = Route;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var config_1 = require("~/config");
var carbon_server_1 = require("~/lib/carbon.server");
var formValidator = zod_1.z.object({
    email: zod_1.z.string().email(),
    material: zod_1.z.string().min(1),
    height: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    width: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0)),
    length: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0))
});
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var validation, _c, _d, _e, email, material, height, width, length, _f, customer, sequence, quoteId, quoteInsert, configuration, quoteLineInsert, upsertMethod;
        var request = _b.request;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _d = (_c = (0, form_1.validator)(formValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 1: return [4 /*yield*/, _d.apply(_c, [_g.sent()])];
                case 2:
                    validation = _g.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "Invalid form data",
                                data: null
                            }, { status: 500 })];
                    }
                    _e = validation.data, email = _e.email, material = _e.material, height = _e.height, width = _e.width, length = _e.length;
                    return [4 /*yield*/, Promise.all([
                            carbon_server_1.carbon.getCustomerByEmail(email),
                            carbon_server_1.carbon.getNextSequence("quote")
                        ])];
                case 3:
                    _f = _g.sent(), customer = _f[0], sequence = _f[1];
                    if (customer.error) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "Failed to get customer from email",
                                data: null
                            }, { status: 500 })];
                    }
                    if (sequence.error) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "Failed to get next sequence",
                                data: null
                            }, { status: 500 })];
                    }
                    quoteId = sequence.data;
                    return [4 /*yield*/, carbon_server_1.carbon.upsertQuote({
                            quoteId: quoteId,
                            customerId: customer.data.id,
                            currencyCode: "USD",
                            createdBy: "system"
                        })];
                case 4:
                    quoteInsert = _g.sent();
                    if (quoteInsert.error || !quoteInsert.data) {
                        console.error(quoteInsert.error);
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "Failed to create quote",
                                data: null
                            }, { status: 500 })];
                    }
                    configuration = {
                        width: width,
                        height: height,
                        length: length,
                        material: material
                    };
                    return [4 /*yield*/, carbon_server_1.carbon.upsertQuoteLine({
                            quoteId: quoteInsert.data.id,
                            itemId: config_1.CONFIGURED_ITEM_ID,
                            description: "".concat(material, " Custom Item - ").concat(width, "x").concat(height, "x").concat(length),
                            methodType: "Make to Order",
                            unitOfMeasureCode: "EA",
                            quantity: [1, 25, 50, 100],
                            configuration: configuration
                        })];
                case 5:
                    quoteLineInsert = _g.sent();
                    if (quoteLineInsert.error || !quoteLineInsert.data) {
                        console.error(quoteLineInsert.error);
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "Failed to create quote line",
                                data: null
                            }, { status: 500 })];
                    }
                    return [4 /*yield*/, carbon_server_1.carbon.upsertQuoteLineMethod({
                            quoteId: quoteInsert.data.id,
                            quoteLineId: quoteLineInsert.data.id,
                            itemId: config_1.CONFIGURED_ITEM_ID,
                            configuration: configuration
                        })];
                case 6:
                    upsertMethod = _g.sent();
                    if (upsertMethod.error) {
                        console.error(upsertMethod.error);
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "Failed to create quote line method",
                                data: null
                            }, { status: 500 })];
                    }
                    return [2 /*return*/, {
                            success: true,
                            message: "Quote created: ".concat(quoteInsert.data.quoteId),
                            data: {
                                quoteId: quoteInsert.data.quoteId,
                                id: quoteInsert.data.id
                            }
                        }];
            }
        });
    });
}
function Route() {
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === true) {
            react_1.toast.success(fetcher.data.message);
        }
        if (((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success) === false) {
            react_1.toast.error(fetcher.data.message);
        }
    }, [fetcher.data]);
    return (<react_1.TooltipProvider>
      <div className="flex h-screen w-screen flex-col items-center justify-center p-4">
        <div className="max-w-xl text-center flex flex-col gap-8">
          <react_1.Heading size="h1">Quote Configurator</react_1.Heading>

          <form_1.ValidatedForm method="post" fetcher={fetcher} validator={formValidator} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4">
              <form_1.Input name="email" label="Email" type="email" placeholder="Enter your email"/>
              <form_1.Select name="material" label="Material" options={["Steel", "Aluminum", "Copper"].map(function (material) { return ({
            label: material,
            value: material
        }); })}/>
              <form_1.Number name="height" label="Height"/>
              <form_1.Number name="width" label="Width"/>
              <form_1.Number name="length" label="Length"/>
            </div>

            <react_1.Button type="submit" variant="primary" size="lg" isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"}>
              Generate Quote
            </react_1.Button>
          </form_1.ValidatedForm>
        </div>
      </div>
    </react_1.TooltipProvider>);
}
