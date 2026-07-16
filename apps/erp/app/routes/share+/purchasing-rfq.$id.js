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
exports.meta = void 0;
exports.loader = loader;
exports.default = PurchasingRFQPreview;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var i18n_1 = require("@react-aria/i18n");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var purchasing_service_1 = require("~/modules/purchasing/purchasing.service");
var settings_1 = require("~/modules/settings");
var shared_1 = require("~/modules/shared");
var meta = function () {
    return [{ title: "RFQ Preview" }];
};
exports.meta = meta;
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id, _c, client, companyId, _d, rfqResult, linesResult, company, thumbnailPaths, thumbnails, _e;
        var _f, _g, _h, _j;
        var params = _b.params, request = _b.request;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    id = params.id;
                    if (!id) {
                        return [2 /*return*/, {
                                error: "RFQ not found",
                                data: null
                            }];
                    }
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "purchasing"
                        })];
                case 1:
                    _c = _k.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, Promise.all([
                            (0, purchasing_service_1.getPurchasingRFQ)(client, id),
                            (0, purchasing_service_1.getPurchasingRFQLines)(client, id),
                            (0, settings_1.getCompany)(client, companyId)
                        ])];
                case 2:
                    _d = _k.sent(), rfqResult = _d[0], linesResult = _d[1], company = _d[2];
                    if (rfqResult.error || !rfqResult.data) {
                        return [2 /*return*/, {
                                error: "RFQ not found",
                                data: null
                            }];
                    }
                    thumbnailPaths = (_f = linesResult.data) === null || _f === void 0 ? void 0 : _f.reduce(function (acc, line) {
                        if (line.thumbnailPath) {
                            // @ts-expect-error TS2538 - TODO: fix type
                            acc[line.id] = line.thumbnailPath;
                        }
                        return acc;
                    }, {});
                    if (!thumbnailPaths) return [3 /*break*/, 4];
                    return [4 /*yield*/, Promise.all(Object.entries(thumbnailPaths).map(function (_a) {
                            var lineId = _a[0], path = _a[1];
                            if (!path)
                                return null;
                            return (0, shared_1.getBase64ImageFromSupabase)(client, path).then(function (data) { return ({
                                id: lineId,
                                data: data
                            }); });
                        }))];
                case 3:
                    _e = _k.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _e = [];
                    _k.label = 5;
                case 5:
                    thumbnails = (_h = (_g = (_e)) === null || _g === void 0 ? void 0 : _g.reduce(function (acc, thumbnail) {
                        if (thumbnail) {
                            acc[thumbnail.id] = thumbnail.data;
                        }
                        return acc;
                    }, {})) !== null && _h !== void 0 ? _h : {};
                    return [2 /*return*/, {
                            error: null,
                            data: {
                                rfq: rfqResult.data,
                                lines: (_j = linesResult.data) !== null && _j !== void 0 ? _j : [],
                                company: company.data,
                                thumbnails: thumbnails
                            }
                        }];
            }
        });
    });
}
var Header = function (_a) {
    var _b;
    var company = _a.company, rfq = _a.rfq, locale = _a.locale;
    return (<react_1.CardHeader className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4 sm:space-y-2 pb-7">
    <react_1.VStack spacing={4}>
      <div>
        <react_1.CardTitle className="text-3xl">{(_b = company === null || company === void 0 ? void 0 : company.name) !== null && _b !== void 0 ? _b : ""}</react_1.CardTitle>
        {(rfq === null || rfq === void 0 ? void 0 : rfq.rfqId) && (<p className="text-lg text-muted-foreground">{rfq.rfqId}</p>)}
        {(rfq === null || rfq === void 0 ? void 0 : rfq.dueDate) && (<p className="text-lg text-muted-foreground">
            Due {(0, utils_1.formatDate)(rfq.dueDate, undefined, locale)}
          </p>)}
      </div>
      <span className="text-base text-muted-foreground">
        This is a preview of how suppliers will see the quote request
      </span>
    </react_1.VStack>
  </react_1.CardHeader>);
};
var NotesDisplay = function (_a) {
    var notes = _a.notes;
    if (!notes || Object.keys(notes).length === 0)
        return null;
    return (<div className="prose dark:prose-invert mt-2 text-muted-foreground" dangerouslySetInnerHTML={{
            __html: (0, react_1.generateHTML)(notes)
        }}/>);
};
var LineItems = function (_a) {
    var lines = _a.lines, thumbnails = _a.thumbnails;
    // @ts-expect-error TS2345 - TODO: fix type
    var _b = (0, react_2.useState)(function () {
        return lines.map(function (line) { return line.id; }).filter(Boolean);
    }), openItems = _b[0], setOpenItems = _b[1];
    var toggleOpen = function (id) {
        setOpenItems(function (prev) {
            return prev.includes(id) ? prev.filter(function (item) { return item !== id; }) : __spreadArray(__spreadArray([], prev, true), [id], false);
        });
    };
    return (<react_1.VStack spacing={8} className="w-full">
      {lines.map(function (line) {
            var _a, _b, _c;
            if (!line.id)
                return null;
            return (<framer_motion_1.motion.div key={line.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="border-b border-input py-6 w-full">
            <react_1.HStack spacing={4} className="items-start">
              {thumbnails[line.id] ? (<img alt={(_a = line.itemReadableId) !== null && _a !== void 0 ? _a : "Item"} className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg" src={(_b = thumbnails[line.id]) !== null && _b !== void 0 ? _b : undefined}/>) : (<div className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg p-4">
                  <lu_1.LuImage className="w-16 h-16 text-muted-foreground"/>
                </div>)}

              <react_1.VStack spacing={0} className="w-full">
                <div className="flex flex-col cursor-pointer w-full" 
            // @ts-expect-error TS2345 - TODO: fix type
            onClick={function () { return toggleOpen(line.id); }}>
                  <div className="flex items-center gap-x-4 justify-between flex-grow">
                    <react_1.Heading>{(_c = line.itemReadableId) !== null && _c !== void 0 ? _c : "Item"}</react_1.Heading>
                    <react_1.HStack spacing={4}>
                      <framer_motion_1.motion.div animate={{
                    rotate: openItems.includes(line.id) ? 90 : 0
                }} transition={{ duration: 0.3 }}>
                        <lu_1.LuChevronRight size={24}/>
                      </framer_motion_1.motion.div>
                    </react_1.HStack>
                  </div>
                  <span className="text-muted-foreground text-base truncate">
                    {line.description}
                  </span>
                </div>
              </react_1.VStack>
            </react_1.HStack>

            <framer_motion_1.motion.div initial="collapsed" animate={openItems.includes(line.id) ? "open" : "collapsed"} variants={{
                    open: { opacity: 1, height: "auto", marginTop: 16 },
                    collapsed: { opacity: 0, height: 0, marginTop: 0 }
                }} transition={{ duration: 0.3 }} className="w-full overflow-hidden">
              <LinePricing line={line}/>
            </framer_motion_1.motion.div>
            <NotesDisplay notes={line.externalNotes || null}/>
          </framer_motion_1.motion.div>);
        })}
    </react_1.VStack>);
};
var LinePricing = function (_a) {
    var line = _a.line;
    var quantities = Array.isArray(line.quantity) && line.quantity.length > 0
        ? line.quantity
        : [1];
    return (<react_1.VStack spacing={4}>
      <react_1.Table>
        <react_1.Thead>
          <react_1.Tr className="whitespace-nowrap">
            <react_1.Th className="w-[50px]"/>
            <react_1.Th className="w-2">Quantity</react_1.Th>
            <react_1.Th className="w-[150px]">Unit Price</react_1.Th>
            <react_1.Th className="w-[120px]">Lead Time</react_1.Th>
            <react_1.Th className="w-[150px]">Shipping Cost</react_1.Th>
            <react_1.Th className="w-[150px]">Tax</react_1.Th>
            <react_1.Th className="w-[100px]">Total</react_1.Th>
          </react_1.Tr>
        </react_1.Thead>
        <react_1.Tbody>
          {quantities.map(function (qty, index) { return (<react_1.Tr key={index}>
              <react_1.Td className="w-[50px]">
                <div className="w-4 h-4 border rounded"/>
              </react_1.Td>
              <react_1.Td>{qty}</react_1.Td>
              <react_1.Td className="text-muted-foreground">—</react_1.Td>
              <react_1.Td className="text-muted-foreground">—</react_1.Td>
              <react_1.Td className="text-muted-foreground">—</react_1.Td>
              <react_1.Td className="text-muted-foreground">—</react_1.Td>
              <react_1.Td className="text-muted-foreground">—</react_1.Td>
            </react_1.Tr>); })}
        </react_1.Tbody>
      </react_1.Table>
    </react_1.VStack>);
};
var RFQPreview = function (_a) {
    var _b;
    var data = _a.data;
    var company = data.company, rfq = data.rfq, lines = data.lines, thumbnails = data.thumbnails;
    var locale = (0, i18n_1.useLocale)().locale;
    var mode = (0, react_1.useMode)();
    var logo = mode === "dark" ? company === null || company === void 0 ? void 0 : company.logoDark : company === null || company === void 0 ? void 0 : company.logoLight;
    return (<react_1.VStack spacing={8} className="w-full items-center p-2 md:p-8">
      {logo && (<img src={logo} alt={(_b = company === null || company === void 0 ? void 0 : company.name) !== null && _b !== void 0 ? _b : ""} className="w-auto mx-auto max-w-5xl"/>)}

      <react_1.Badge variant="outline" className="text-lg px-4 py-2">
        Preview Mode
      </react_1.Badge>

      <react_1.Card className="w-full max-w-5xl mx-auto">
        <Header company={company} rfq={rfq} locale={locale}/>
        <react_1.CardContent>
          <LineItems lines={lines} thumbnails={thumbnails}/>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              This is a preview of how suppliers will see the quote request.
              Finalize the RFQ to send it to suppliers.
            </p>
          </div>
        </react_1.CardContent>
      </react_1.Card>
    </react_1.VStack>);
};
var ErrorMessage = function (_a) {
    var title = _a.title, message = _a.message;
    return (<div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>);
};
function PurchasingRFQPreview() {
    var _a = (0, react_router_1.useLoaderData)(), error = _a.error, data = _a.data;
    if (error || !data) {
        return (<ErrorMessage title="RFQ not found" message="Oops! The RFQ you're trying to preview could not be found."/>);
    }
    // @ts-expect-error TS2322 - TODO: fix type
    return <RFQPreview data={data}/>;
}
