"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.ErrorMessage = exports.meta = void 0;
exports.loader = loader;
exports.default = ExternalSupplierQuote;
var client_server_1 = require("@carbon/auth/client.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var Editor_1 = require("@carbon/react/Editor");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var purchasing_models_1 = require("~/modules/purchasing/purchasing.models");
var purchasing_service_1 = require("~/modules/purchasing/purchasing.service");
var settings_1 = require("~/modules/settings");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var meta = function () {
    return [{ title: "Supplier Quote" }];
};
exports.meta = meta;
var QuoteState;
(function (QuoteState) {
    QuoteState[QuoteState["Valid"] = 0] = "Valid";
    QuoteState[QuoteState["Expired"] = 1] = "Expired";
    QuoteState[QuoteState["NotFound"] = 2] = "NotFound";
})(QuoteState || (QuoteState = {}));
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id, serviceRole, quote, _c, company, companySettings, quoteLines, quoteLinePrices, thumbnailPaths, thumbnails, _d;
        var _e, _f, _g, _h, _j, _k;
        var params = _b.params, request = _b.request;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    id = params.id;
                    if (!id) {
                        return [2 /*return*/, {
                                state: QuoteState.NotFound,
                                data: null
                            }];
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, purchasing_service_1.getSupplierQuoteByExternalLinkId)(serviceRole, id)];
                case 1:
                    quote = _l.sent();
                    if (quote.error) {
                        return [2 /*return*/, {
                                state: QuoteState.NotFound,
                                data: null
                            }];
                    }
                    if (!quote.data.externalLinkId) return [3 /*break*/, 3];
                    return [4 /*yield*/, serviceRole
                            .from("externalLink")
                            .update({
                            lastAccessedAt: new Date().toISOString()
                        })
                            .eq("id", quote.data.externalLinkId)];
                case 2:
                    _l.sent();
                    _l.label = 3;
                case 3:
                    if (quote.data.expirationDate &&
                        new Date(quote.data.expirationDate) < new Date() &&
                        quote.data.status === "Draft") {
                        return [2 /*return*/, {
                                state: QuoteState.Expired,
                                data: null
                            }];
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, settings_1.getCompany)(serviceRole, quote.data.companyId),
                            (0, settings_1.getCompanySettings)(serviceRole, quote.data.companyId),
                            (0, purchasing_service_1.getSupplierQuoteLines)(serviceRole, quote.data.id),
                            (0, purchasing_service_1.getSupplierQuoteLinePricesByQuoteId)(serviceRole, quote.data.id)
                        ])];
                case 4:
                    _c = _l.sent(), company = _c[0], companySettings = _c[1], quoteLines = _c[2], quoteLinePrices = _c[3];
                    thumbnailPaths = (_e = quoteLines.data) === null || _e === void 0 ? void 0 : _e.reduce(function (acc, line) {
                        if (line.thumbnailPath) {
                            acc[line.id] = line.thumbnailPath;
                        }
                        return acc;
                    }, {});
                    if (!thumbnailPaths) return [3 /*break*/, 6];
                    return [4 /*yield*/, Promise.all(Object.entries(thumbnailPaths).map(function (_a) {
                            var id = _a[0], path = _a[1];
                            if (!path) {
                                return null;
                            }
                            return (0, shared_1.getBase64ImageFromSupabase)(serviceRole, path).then(function (data) { return ({
                                id: id,
                                data: data
                            }); });
                        }))];
                case 5:
                    _d = _l.sent();
                    return [3 /*break*/, 7];
                case 6:
                    _d = [];
                    _l.label = 7;
                case 7:
                    thumbnails = (_g = (_f = (_d)) === null || _f === void 0 ? void 0 : _f.reduce(function (acc, thumbnail) {
                        if (thumbnail) {
                            acc[thumbnail.id] = thumbnail.data;
                        }
                        return acc;
                    }, {})) !== null && _g !== void 0 ? _g : {};
                    return [2 /*return*/, {
                            state: QuoteState.Valid,
                            data: {
                                quote: quote.data,
                                company: company.data,
                                companySettings: companySettings.data,
                                quoteLines: (_j = (_h = quoteLines.data) === null || _h === void 0 ? void 0 : _h.map(function (_a) {
                                    var internalNotes = _a.internalNotes, line = __rest(_a, ["internalNotes"]);
                                    return (__assign({}, line));
                                })) !== null && _j !== void 0 ? _j : [],
                                thumbnails: thumbnails,
                                quoteLinePrices: (_k = quoteLinePrices.data) !== null && _k !== void 0 ? _k : []
                            }
                        }];
            }
        });
    });
}
// rounded icon in badge class name "rounded-full"
var EditableBadge = function () {
    return (<react_1.Badge variant="green">
      <lu_1.LuPencil className="w-3 h-3"/>
    </react_1.Badge>);
};
var Header = function (_a) {
    var _b;
    var company = _a.company, quote = _a.quote, locale = _a.locale;
    return (<div className="flex justify-between">
    <react_1.VStack spacing={4} className="tracking-tight">
      <div>
        <react_1.CardTitle className="text-3xl">{(_b = company === null || company === void 0 ? void 0 : company.name) !== null && _b !== void 0 ? _b : ""}</react_1.CardTitle>
        {(quote === null || quote === void 0 ? void 0 : quote.supplierQuoteId) && (<p className="text-lg text-muted-foreground">
            {quote.supplierQuoteId}
          </p>)}
        {(quote === null || quote === void 0 ? void 0 : quote.expirationDate) && (<p className="text-lg text-muted-foreground">
            Expires {(0, utils_1.formatDate)(quote.expirationDate, undefined, locale)}
          </p>)}
      </div>

      {quote.status === "Draft" ? (<span className="text-base font-semibold foreground">
          Please fill the columns marked with the <EditableBadge /> icon to
          provide pricing
        </span>) : null}
    </react_1.VStack>
  </div>);
};
var NotesEditorModal = function (_a) {
    var notes = _a.notes, onSave = _a.onSave, quoteStatus = _a.quoteStatus;
    var isDraft = quoteStatus === "Draft";
    var modal = (0, react_1.useDisclosure)();
    var _b = (0, react_2.useState)(notes !== null && notes !== void 0 ? notes : {}), editorContent = _b[0], setEditorContent = _b[1];
    var handleEditorChange = function (value) {
        setEditorContent(value);
    };
    var handleSave = function () {
        onSave(editorContent);
        modal.onClose();
    };
    var handleCancel = function () {
        setEditorContent(notes !== null && notes !== void 0 ? notes : {});
        modal.onClose();
    };
    var hasNotes = notes && Object.keys(notes).length > 0;
    // For non-Draft status, show rendered content (if any)
    if (!isDraft && hasNotes) {
        return (<div className="prose dark:prose-invert mt-2 text-muted-foreground" dangerouslySetInnerHTML={{
                __html: (0, react_1.generateHTML)(notes)
            }}/>);
    }
    // For Draft status, show button to open modal
    if (isDraft) {
        return (<>
        <react_1.Button className="mt-3" leftIcon={hasNotes ? <lu_1.LuPencil /> : <lu_1.LuCirclePlus />} variant={hasNotes ? "secondary" : "primary"} onClick={function (e) {
                e.stopPropagation();
                modal.onOpen();
            }}>
          {hasNotes ? "Edit Notes" : "Add Notes"}
        </react_1.Button>

        {modal.isOpen && (<react_1.Modal open onOpenChange={function (open) {
                    if (!open)
                        handleCancel();
                }}>
            <react_1.ModalOverlay />
            <react_1.ModalContent className="max-w-4xl" onClick={function (e) { return e.stopPropagation(); }}>
              <react_1.ModalHeader>
                <react_1.ModalTitle>Edit Notes</react_1.ModalTitle>
                <react_1.ModalDescription>
                  Add or edit notes for this line item
                </react_1.ModalDescription>
              </react_1.ModalHeader>
              <react_1.ModalBody>
                <react_1.VStack spacing={4} className="w-full">
                  <div className="flex flex-col gap-2 w-full">
                    <react_1.Label>Notes</react_1.Label>
                    <Editor_1.Editor initialValue={editorContent} onChange={handleEditorChange} className="min-h-[300px] p-4 border rounded-lg transition-colors" disableFileUpload/>
                  </div>
                </react_1.VStack>
              </react_1.ModalBody>
              <react_1.ModalFooter>
                <react_1.Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </react_1.Button>
                <react_1.Button onClick={handleSave}>Save Notes</react_1.Button>
              </react_1.ModalFooter>
            </react_1.ModalContent>
          </react_1.Modal>)}
      </>);
    }
    return null;
};
var LineItems = function (_a) {
    var currencyCode = _a.currencyCode, locale = _a.locale, selectedLines = _a.selectedLines, setSelectedLines = _a.setSelectedLines, quoteStatus = _a.quoteStatus, quoteLinePrices = _a.quoteLinePrices, onSaveNotes = _a.onSaveNotes;
    var _b = (0, react_router_1.useLoaderData)().data, quoteLines = _b.quoteLines, thumbnails = _b.thumbnails;
    var _c = (0, react_2.useState)(function () {
        return Array.isArray(quoteLines) && quoteLines.length > 0
            ? quoteLines.map(function (line) { return line.id; }).filter(Boolean)
            : [];
    }), openItems = _c[0], setOpenItems = _c[1];
    var toggleOpen = function (id) {
        setOpenItems(function (prev) {
            return prev.includes(id) ? prev.filter(function (item) { return item !== id; }) : __spreadArray(__spreadArray([], prev, true), [id], false);
        });
    };
    return (<react_1.VStack spacing={8} className="w-full">
      {quoteLines === null || quoteLines === void 0 ? void 0 : quoteLines.map(function (line) {
            var _a;
            if (!line.id)
                return null;
            var isGlAccount = line.supplierQuoteLineType === "G/L Account";
            var lineHeading = isGlAccount
                ? line.description || "Indirect Expense"
                : line.itemReadableId;
            return (<framer_motion_1.motion.div key={line.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="border-b border-input py-6 w-full">
            <react_1.HStack spacing={4} className="items-start">
              {thumbnails[line.id] ? (<img alt={lineHeading} className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg" src={(_a = thumbnails[line.id]) !== null && _a !== void 0 ? _a : undefined}/>) : (<div className="w-24 h-24 bg-gradient-to-bl from-muted to-muted/40 rounded-lg p-4">
                  <lu_1.LuImage className="w-16 h-16 text-muted-foreground"/>
                </div>)}

              <react_1.VStack spacing={0} className="w-full">
                <div className="flex flex-col cursor-pointer w-full" onClick={function () { return toggleOpen(line.id); }}>
                  <div className="flex items-center gap-x-4 justify-between flex-grow">
                    <react_1.Heading>{lineHeading}</react_1.Heading>
                    <react_1.HStack spacing={4}>
                      <framer_motion_1.motion.div animate={{
                    rotate: openItems.includes(line.id) ? 90 : 0
                }} transition={{ duration: 0.3 }}>
                        <lu_1.LuChevronRight size={24}/>
                      </framer_motion_1.motion.div>
                    </react_1.HStack>
                  </div>
                  <span className="text-muted-foreground text-base truncate">
                    {isGlAccount ? "Indirect Expense" : line.description}
                  </span>
                </div>
              </react_1.VStack>
            </react_1.HStack>

            <framer_motion_1.motion.div initial="collapsed" animate={openItems.includes(line.id) ? "open" : "collapsed"} variants={{
                    open: { opacity: 1, height: "auto", marginTop: 16 },
                    collapsed: { opacity: 0, height: 0, marginTop: 0 }
                }} transition={{ duration: 0.3 }} className="w-full overflow-hidden">
              <LinePricing line={line} currencyCode={currencyCode} locale={locale} selectedLines={selectedLines[line.id] || {}} setSelectedLines={setSelectedLines} quoteStatus={quoteStatus} quoteLinePrices={quoteLinePrices}/>
            </framer_motion_1.motion.div>
            <NotesEditorModal notes={line.externalNotes || {}} onSave={function (content) { return onSaveNotes(line.id, content); }} quoteStatus={quoteStatus}/>
          </framer_motion_1.motion.div>);
        })}
    </react_1.VStack>);
};
var LinePricing = function (_a) {
    var _b;
    var line = _a.line, currencyCode = _a.currencyCode, locale = _a.locale, selectedLines = _a.selectedLines, setSelectedLines = _a.setSelectedLines, quoteStatus = _a.quoteStatus, quoteLinePrices = _a.quoteLinePrices;
    var pricingOptions = (_b = quoteLinePrices === null || quoteLinePrices === void 0 ? void 0 : quoteLinePrices.filter(function (price) { return price.supplierQuoteLineId === line.id; }).sort(function (a, b) { return a.quantity - b.quantity; })) !== null && _b !== void 0 ? _b : [];
    // Get quantities from line or use pricing options, always show at least one row
    var quantities = Array.isArray(line.quantity) && line.quantity.length > 0
        ? line.quantity
        : pricingOptions.length > 0
            ? pricingOptions.map(function (opt) { return opt.quantity; })
            : [1]; // Default to showing at least one row with quantity 1
    var isDisabled = !["Draft"].includes(quoteStatus || "");
    var formatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currencyCode
    });
    // Get pricing data for a specific quantity
    var getPricingForQuantity = function (qty) {
        var _a;
        return (_a = pricingOptions.find(function (opt) { return opt.quantity === qty; })) !== null && _a !== void 0 ? _a : null;
    };
    // Store pricing for all quantities, not just selected
    var _c = (0, react_2.useState)(function () {
        var initial = {};
        quantities.forEach(function (qty) {
            var _a, _b, _c, _d;
            var pricing = getPricingForQuantity(qty);
            initial[qty] = {
                supplierUnitPrice: (_a = pricing === null || pricing === void 0 ? void 0 : pricing.supplierUnitPrice) !== null && _a !== void 0 ? _a : 0,
                leadTime: (_b = pricing === null || pricing === void 0 ? void 0 : pricing.leadTime) !== null && _b !== void 0 ? _b : 0,
                supplierShippingCost: (_c = pricing === null || pricing === void 0 ? void 0 : pricing.supplierShippingCost) !== null && _c !== void 0 ? _c : 0,
                supplierTaxAmount: (_d = pricing === null || pricing === void 0 ? void 0 : pricing.supplierTaxAmount) !== null && _d !== void 0 ? _d : 0
            };
        });
        return initial;
    }), pricingByQuantity = _c[0], setPricingByQuantity = _c[1];
    // Update pricing for a specific quantity
    var updatePricing = function (quantity, field, value) {
        var newValue = isNaN(value) ? 0 : value;
        setPricingByQuantity(function (prev) {
            var _a, _b;
            return (__assign(__assign({}, prev), (_a = {}, _a[quantity] = __assign(__assign({}, prev[quantity]), (_b = {}, _b[field] = newValue, _b)), _a)));
        });
        // If this quantity is selected, also update the selected line
        setSelectedLines(function (prev) {
            var _a, _b, _c;
            var lineSelections = prev[line.id] || {};
            var current = lineSelections[quantity];
            if (current) {
                return __assign(__assign({}, prev), (_a = {}, _a[line.id] = __assign(__assign({}, lineSelections), (_b = {}, _b[quantity] = __assign(__assign({}, current), (_c = {}, _c[field] = newValue, _c)), _b)), _a));
            }
            return prev;
        });
    };
    var handleQuantityToggle = function (quantity, checked) {
        if (checked) {
            var storedPricing_1 = pricingByQuantity[quantity];
            var pricing_1 = getPricingForQuantity(quantity);
            setSelectedLines(function (prev) {
                var _a, _b;
                var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                return (__assign(__assign({}, prev), (_a = {}, _a[line.id] = __assign(__assign({}, (prev[line.id] || {})), (_b = {}, _b[quantity] = {
                    quantity: quantity,
                    supplierUnitPrice: (_d = (_c = storedPricing_1 === null || storedPricing_1 === void 0 ? void 0 : storedPricing_1.supplierUnitPrice) !== null && _c !== void 0 ? _c : pricing_1 === null || pricing_1 === void 0 ? void 0 : pricing_1.supplierUnitPrice) !== null && _d !== void 0 ? _d : 0,
                    unitPrice: (_e = pricing_1 === null || pricing_1 === void 0 ? void 0 : pricing_1.unitPrice) !== null && _e !== void 0 ? _e : 0,
                    leadTime: (_g = (_f = storedPricing_1 === null || storedPricing_1 === void 0 ? void 0 : storedPricing_1.leadTime) !== null && _f !== void 0 ? _f : pricing_1 === null || pricing_1 === void 0 ? void 0 : pricing_1.leadTime) !== null && _g !== void 0 ? _g : 0,
                    shippingCost: (_h = pricing_1 === null || pricing_1 === void 0 ? void 0 : pricing_1.shippingCost) !== null && _h !== void 0 ? _h : 0,
                    supplierShippingCost: (_k = (_j = storedPricing_1 === null || storedPricing_1 === void 0 ? void 0 : storedPricing_1.supplierShippingCost) !== null && _j !== void 0 ? _j : pricing_1 === null || pricing_1 === void 0 ? void 0 : pricing_1.supplierShippingCost) !== null && _k !== void 0 ? _k : 0,
                    supplierTaxAmount: (_m = (_l = storedPricing_1 === null || storedPricing_1 === void 0 ? void 0 : storedPricing_1.supplierTaxAmount) !== null && _l !== void 0 ? _l : pricing_1 === null || pricing_1 === void 0 ? void 0 : pricing_1.supplierTaxAmount) !== null && _m !== void 0 ? _m : 0
                }, _b)), _a)));
            });
        }
        else {
            setSelectedLines(function (prev) {
                var _a;
                var lineSelections = __assign({}, (prev[line.id] || {}));
                delete lineSelections[quantity];
                return __assign(__assign({}, prev), (_a = {}, _a[line.id] = lineSelections, _a));
            });
        }
    };
    return (<react_1.VStack spacing={4}>
      <react_1.Table>
        <react_1.Thead>
          <react_1.Tr className="whitespace-nowrap">
            <react_1.Th className="w-[50px]"/>
            <react_1.Th className="w-2">Quantity</react_1.Th>
            <react_1.Th className="w-[150px]">
              <react_1.HStack spacing={4}>
                <span>Unit Price</span>
                {quoteStatus === "Draft" ? <EditableBadge /> : null}
              </react_1.HStack>
            </react_1.Th>
            <react_1.Th className="w-[120px]">
              <react_1.HStack spacing={4}>
                <span>Lead Time</span>
                {quoteStatus === "Draft" ? <EditableBadge /> : null}
              </react_1.HStack>
            </react_1.Th>
            <react_1.Th className="w-[150px]">
              <react_1.HStack spacing={4}>
                <span>Shipping Cost</span>
                {quoteStatus === "Draft" ? <EditableBadge /> : null}
              </react_1.HStack>
            </react_1.Th>
            <react_1.Th className="w-[150px]">
              <react_1.HStack spacing={4}>
                <span>Tax</span>
                {quoteStatus === "Draft" ? <EditableBadge /> : null}
              </react_1.HStack>
            </react_1.Th>
            <react_1.Th className="w-[100px]">Total</react_1.Th>
          </react_1.Tr>
        </react_1.Thead>
        <react_1.Tbody>
          {quantities.map(function (qty, index) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var storedPricing = pricingByQuantity[qty];
            var pricing = getPricingForQuantity(qty);
            var selectedLine = selectedLines[qty];
            var isSelected = !!selectedLine && selectedLine.quantity === qty;
            var unitPrice = (_b = (_a = storedPricing === null || storedPricing === void 0 ? void 0 : storedPricing.supplierUnitPrice) !== null && _a !== void 0 ? _a : pricing === null || pricing === void 0 ? void 0 : pricing.supplierUnitPrice) !== null && _b !== void 0 ? _b : 0;
            var leadTime = (_d = (_c = storedPricing === null || storedPricing === void 0 ? void 0 : storedPricing.leadTime) !== null && _c !== void 0 ? _c : pricing === null || pricing === void 0 ? void 0 : pricing.leadTime) !== null && _d !== void 0 ? _d : 0;
            var shippingCost = (_f = (_e = storedPricing === null || storedPricing === void 0 ? void 0 : storedPricing.supplierShippingCost) !== null && _e !== void 0 ? _e : pricing === null || pricing === void 0 ? void 0 : pricing.supplierShippingCost) !== null && _f !== void 0 ? _f : 0;
            var taxAmount = (_h = (_g = storedPricing === null || storedPricing === void 0 ? void 0 : storedPricing.supplierTaxAmount) !== null && _g !== void 0 ? _g : pricing === null || pricing === void 0 ? void 0 : pricing.supplierTaxAmount) !== null && _h !== void 0 ? _h : 0;
            var total = unitPrice * qty + shippingCost + taxAmount;
            return (<react_1.Tr key={index}>
                <react_1.Td className="w-[50px]">
                  <react_1.Checkbox isChecked={isSelected} disabled={isDisabled} onCheckedChange={function (checked) {
                    handleQuantityToggle(qty, !!checked);
                }} id={"".concat(line.id, ":").concat(qty.toString())}/>
                  <label htmlFor={"".concat(line.id, ":").concat(qty.toString())} className="sr-only">
                    {qty}
                  </label>
                </react_1.Td>
                <react_1.Td>{qty}</react_1.Td>
                {isSelected ? (<>
                    <react_1.Td className="">
                      <react_1.NumberField value={unitPrice} formatOptions={{
                        style: "currency",
                        currency: currencyCode
                    }} isDisabled={isDisabled || !isSelected} minValue={0} onChange={function (value) {
                        if (Number.isFinite(value) && value !== unitPrice) {
                            updatePricing(qty, "supplierUnitPrice", value);
                        }
                    }}>
                        <react_1.NumberInput className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100" size="sm" min={0}/>
                      </react_1.NumberField>
                    </react_1.Td>
                    <react_1.Td className="w-[150px]">
                      <react_1.NumberField value={leadTime} formatOptions={{
                        style: "unit",
                        unit: "day",
                        unitDisplay: "long"
                    }} minValue={0} isDisabled={isDisabled || !isSelected} onChange={function (value) {
                        if (Number.isFinite(value) && value !== leadTime) {
                            updatePricing(qty, "leadTime", value);
                        }
                    }}>
                        <react_1.NumberInput className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100" size="sm" min={0}/>
                      </react_1.NumberField>
                    </react_1.Td>
                    <react_1.Td className="w-[150px]">
                      <react_1.NumberField value={shippingCost} formatOptions={{
                        style: "currency",
                        currency: currencyCode
                    }} isDisabled={isDisabled || !isSelected} minValue={0} onChange={function (value) {
                        if (Number.isFinite(value) &&
                            value !== shippingCost) {
                            updatePricing(qty, "supplierShippingCost", value);
                        }
                    }}>
                        <react_1.NumberInput className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100" size="sm" min={0}/>
                      </react_1.NumberField>
                    </react_1.Td>
                    <react_1.Td className="w-[120px]">
                      <react_1.NumberField value={taxAmount} formatOptions={{
                        style: "currency",
                        currency: currencyCode
                    }} isDisabled={isDisabled || !isSelected} minValue={0} onChange={function (value) {
                        if (Number.isFinite(value) && value !== taxAmount) {
                            updatePricing(qty, "supplierTaxAmount", value);
                        }
                    }}>
                        <react_1.NumberInput className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100" size="sm" min={0}/>
                      </react_1.NumberField>
                    </react_1.Td>
                  </>) : (<react_1.Td colSpan={4} className="text-muted-foreground">
                    Select to provide pricing
                  </react_1.Td>)}
                <react_1.Td className="w-[150px]">
                  {isSelected && total > 0 ? formatter.format(total) : "—"}
                </react_1.Td>
              </react_1.Tr>);
        })}
        </react_1.Tbody>
      </react_1.Table>
    </react_1.VStack>);
};
var Quote = function (_a) {
    var _b, _c;
    var data = _a.data;
    var company = data.company, quote = data.quote, quoteLinePrices = data.quoteLinePrices;
    var t = (0, macro_1.useLingui)().t;
    var locale = (0, i18n_1.useLocale)().locale;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find external quote id");
    var submitModal = (0, react_1.useDisclosure)();
    var declineModal = (0, react_1.useDisclosure)();
    var fetcher = (0, react_router_1.useFetcher)();
    var submitted = (0, react_2.useRef)(false);
    var mode = (0, react_1.useMode)();
    var logo = mode === "dark" ? company === null || company === void 0 ? void 0 : company.logoDark : company === null || company === void 0 ? void 0 : company.logoLight;
    (0, react_2.useEffect)(function () {
        if (fetcher.state === "idle" && submitted.current) {
            submitModal.onClose();
            declineModal.onClose();
            submitted.current = false;
        }
    }, [fetcher.state, submitModal, declineModal]);
    // Initialize selected lines from existing pricing data
    var _d = (0, react_2.useState)(function () {
        var _a, _b, _c, _d, _e, _f;
        var initial = {};
        for (var _i = 0, quoteLinePrices_1 = quoteLinePrices; _i < quoteLinePrices_1.length; _i++) {
            var price = quoteLinePrices_1[_i];
            if (!price.supplierQuoteLineId)
                continue;
            if ((price.supplierUnitPrice && price.supplierUnitPrice > 0) ||
                (price.leadTime && price.leadTime > 0)) {
                if (!initial[price.supplierQuoteLineId]) {
                    initial[price.supplierQuoteLineId] = {};
                }
                initial[price.supplierQuoteLineId][price.quantity] = {
                    quantity: price.quantity,
                    supplierUnitPrice: (_a = price.supplierUnitPrice) !== null && _a !== void 0 ? _a : 0,
                    unitPrice: (_b = price.unitPrice) !== null && _b !== void 0 ? _b : 0,
                    leadTime: (_c = price.leadTime) !== null && _c !== void 0 ? _c : 0,
                    shippingCost: (_d = price.shippingCost) !== null && _d !== void 0 ? _d : 0,
                    supplierShippingCost: (_e = price.supplierShippingCost) !== null && _e !== void 0 ? _e : 0,
                    supplierTaxAmount: (_f = price.supplierTaxAmount) !== null && _f !== void 0 ? _f : 0
                };
            }
        }
        return initial;
    }), selectedLines = _d[0], setSelectedLines = _d[1];
    // Handler to save notes for a line
    var handleSaveNotes = function (lineId, content) {
        // Use fetcher to save
        fetcher.submit({
            intent: "updateNotes",
            lineId: lineId,
            notes: JSON.stringify(content)
        }, {
            method: "post",
            action: path_1.path.to.api.digitalSupplierQuote(id)
        });
    };
    // Calculate grand total for display (all selected quantities across all lines)
    var eachSelectedLineHasPricingAndLeadTime = Object.values(selectedLines).every(function (lineSelections) {
        return (Object.values(lineSelections).every(function (line) { return line.quantity > 0 && line.leadTime > 0; }) && Object.values(lineSelections).length > 0);
    }) && Object.values(selectedLines).length > 0;
    return (<react_1.VStack spacing={8} className="w-full items-center p-2 md:p-8">
      {logo && (<img src={logo} alt={(_b = company === null || company === void 0 ? void 0 : company.name) !== null && _b !== void 0 ? _b : ""} className="w-auto mx-auto max-w-5xl"/>)}
      <react_1.Card className="w-full max-w-5xl mx-auto">
        <react_1.CardHeader>
          <div className="w-full text-center">
            {(quote === null || quote === void 0 ? void 0 : quote.status) && (quote === null || quote === void 0 ? void 0 : quote.status) !== "Draft" && (<react_1.Status className="inline-flex" color={quote.status === "Active" ? "green" : "gray"}>
                {quote.status}
              </react_1.Status>)}
          </div>

          <Header company={company} quote={quote} locale={locale}/>
        </react_1.CardHeader>
        <react_1.CardContent>
          <LineItems currencyCode={(_c = quote.currencyCode) !== null && _c !== void 0 ? _c : "USD"} locale={locale} selectedLines={selectedLines} setSelectedLines={setSelectedLines} quoteStatus={quote.status} quoteLinePrices={quoteLinePrices} onSaveNotes={handleSaveNotes}/>
          <div className="flex flex-col gap-2">
            {(quote === null || quote === void 0 ? void 0 : quote.status) === "Draft" && (<react_1.VStack className="w-full mt-8 gap-4">
                <react_1.Button onClick={submitModal.onOpen} size="lg" variant="primary" isDisabled={!eachSelectedLineHasPricingAndLeadTime} className="w-full text-lg">
                  Submit Quote
                </react_1.Button>
                <react_1.Button onClick={declineModal.onOpen} size="lg" variant="secondary" className="w-full text-lg">
                  Decline Quote
                </react_1.Button>
              </react_1.VStack>)}
          </div>
        </react_1.CardContent>
      </react_1.Card>

      {submitModal.isOpen && (<react_1.Modal open onOpenChange={function (open) {
                if (!open)
                    submitModal.onClose();
            }}>
          <react_1.ModalOverlay />
          <react_1.ModalContent>
            <form_1.ValidatedForm validator={purchasing_models_1.externalSupplierQuoteValidator} action={path_1.path.to.api.digitalSupplierQuote(id)} method="post" fetcher={fetcher} onSubmit={function () {
                submitted.current = true;
            }}>
              <react_1.ModalHeader>
                <react_1.ModalTitle>Submit Quote</react_1.ModalTitle>
                <react_1.ModalDescription>
                  Are you sure you want to submit the updated pricing?
                </react_1.ModalDescription>
              </react_1.ModalHeader>
              <react_1.ModalBody>
                <input type="hidden" name="intent" value="submit"/>
                <input type="hidden" name="selectedLines" value={JSON.stringify(selectedLines)}/>
                <div className="space-y-4 py-4">
                  <form_1.Input name="digitalSupplierQuoteSubmittedBy" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Your Name"], ["Your Name"])))} placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Enter your name"], ["Enter your name"])))}/>
                  <form_1.Input name="digitalSupplierQuoteSubmittedByEmail" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Your Email"], ["Your Email"])))} placeholder={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Enter your email"], ["Enter your email"])))}/>
                </div>
              </react_1.ModalBody>
              <react_1.ModalFooter>
                <react_1.Button variant="secondary" onClick={submitModal.onClose}>
                  Cancel
                </react_1.Button>
                <react_1.Button isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"} type="submit">
                  Submit
                </react_1.Button>
              </react_1.ModalFooter>
            </form_1.ValidatedForm>
          </react_1.ModalContent>
        </react_1.Modal>)}

      {declineModal.isOpen && (<react_1.Modal open onOpenChange={function (open) {
                if (!open)
                    declineModal.onClose();
            }}>
          <react_1.ModalOverlay />
          <react_1.ModalContent>
            <form_1.ValidatedForm validator={purchasing_models_1.externalSupplierQuoteValidator} action={path_1.path.to.api.digitalSupplierQuote(id)} method="post" fetcher={fetcher} onSubmit={function () {
                submitted.current = true;
            }}>
              <react_1.ModalHeader>
                <react_1.ModalTitle>Decline Quote</react_1.ModalTitle>
                <react_1.ModalDescription>
                  Are you sure you want to decline this quote?
                </react_1.ModalDescription>
              </react_1.ModalHeader>
              <react_1.ModalBody>
                <input type="hidden" name="intent" value="decline"/>
                <div className="space-y-4 py-4">
                  <form_1.TextArea name="note" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Reason for declining (Optional)"], ["Reason for declining (Optional)"])))}/>
                  <form_1.Input name="digitalSupplierQuoteSubmittedBy" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Your Name"], ["Your Name"])))} placeholder={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Enter your name"], ["Enter your name"])))}/>
                  <form_1.Input name="digitalSupplierQuoteSubmittedByEmail" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Your Email"], ["Your Email"])))} placeholder={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Enter your email"], ["Enter your email"])))}/>
                </div>
              </react_1.ModalBody>
              <react_1.ModalFooter>
                <react_1.Button variant="ghost" onClick={declineModal.onClose}>
                  Cancel
                </react_1.Button>
                <react_1.Button isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"} type="submit" variant="destructive">
                  Decline Quote
                </react_1.Button>
              </react_1.ModalFooter>
            </form_1.ValidatedForm>
          </react_1.ModalContent>
        </react_1.Modal>)}
    </react_1.VStack>);
};
var ErrorMessage = function (_a) {
    var title = _a.title, message = _a.message;
    return (<div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>);
};
exports.ErrorMessage = ErrorMessage;
function ExternalSupplierQuote() {
    var _a = (0, react_router_1.useLoaderData)(), state = _a.state, data = _a.data;
    switch (state) {
        case QuoteState.Valid:
            if (data) {
                // TODO: Remove any (gaurav)
                return <Quote data={data}/>;
            }
            return (<exports.ErrorMessage title="Quote not found" message="Oops! The link you're trying to access is not valid."/>);
        case QuoteState.Expired:
            return (<exports.ErrorMessage title="Quote expired" message="Oops! The link you're trying to access has expired or is no longer valid."/>);
        case QuoteState.NotFound:
            return (<exports.ErrorMessage title="Quote not found" message="Oops! The link you're trying to access is not valid."/>);
    }
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
