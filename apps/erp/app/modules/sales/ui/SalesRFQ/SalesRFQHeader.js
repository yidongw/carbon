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
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var ri_1 = require("react-icons/ri");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var Layout_1 = require("~/components/Layout");
var ConfirmDelete_1 = require("~/components/Modals/ConfirmDelete");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
var SalesRFQStatus_1 = require("./SalesRFQStatus");
function SalesRFQTopbarLeft(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    var rfqId = _a.rfqId;
    var t = (0, macro_1.useLingui)().t;
    var convertToQuoteModal = (0, react_1.useDisclosure)();
    var requiresCustomerAlert = (0, react_1.useDisclosure)();
    var noQuoteReasonModal = (0, react_1.useDisclosure)();
    var deleteRFQModal = (0, react_1.useDisclosure)();
    var permissions = (0, hooks_1.usePermissions)();
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.salesRfq(rfqId));
    var status = (_c = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _b === void 0 ? void 0 : _b.status) !== null && _c !== void 0 ? _c : "Draft";
    var isLocked = (0, sales_models_1.isSalesRfqLocked)(status);
    var statusFetcher = (0, react_router_1.useFetcher)();
    return (<>
      <Layout_1.DetailTopbarContent>
        <Layout_1.DetailTopbarId to={path_1.path.to.salesRfqDetails(rfqId)}>
          {(_d = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _d === void 0 ? void 0 : _d.rfqId}
        </Layout_1.DetailTopbarId>
        <react_1.Copy text={(_f = (_e = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _e === void 0 ? void 0 : _e.rfqId) !== null && _f !== void 0 ? _f : ""}/>
        <SalesRFQStatus_1.default iconOnly status={(_g = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _g === void 0 ? void 0 : _g.status}/>
        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} size="sm" variant="secondary"/>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent>
            {/* Ready for Quote */}
            {((_h = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _h === void 0 ? void 0 : _h.customerId) ? (<react_1.DropdownMenuItem disabled={status !== "Draft" ||
                ((_j = routeData === null || routeData === void 0 ? void 0 : routeData.lines) === null || _j === void 0 ? void 0 : _j.length) === 0 ||
                !permissions.can("update", "sales")} onClick={function () {
                statusFetcher.submit({ status: "Ready for Quote" }, {
                    method: "post",
                    action: path_1.path.to.salesRfqStatus(rfqId)
                });
            }}>
                <react_1.DropdownMenuIcon icon={<lu_1.LuCircleCheck />}/>
                <macro_1.Trans>Ready for Quote</macro_1.Trans>
              </react_1.DropdownMenuItem>) : (<react_1.DropdownMenuItem disabled={status !== "Ready for Quote" ||
                ((_k = routeData === null || routeData === void 0 ? void 0 : routeData.lines) === null || _k === void 0 ? void 0 : _k.length) === 0 ||
                !permissions.can("update", "sales")} onClick={requiresCustomerAlert.onOpen}>
                <react_1.DropdownMenuIcon icon={<lu_1.LuCircleCheck />}/>
                <macro_1.Trans>Ready for Quote</macro_1.Trans>
              </react_1.DropdownMenuItem>)}

            {/* Quote */}
            <react_1.DropdownMenuItem disabled={status !== "Ready for Quote" ||
            ((_l = routeData === null || routeData === void 0 ? void 0 : routeData.lines) === null || _l === void 0 ? void 0 : _l.length) === 0 ||
            !permissions.can("create", "sales")} onClick={convertToQuoteModal.onOpen}>
              <react_1.DropdownMenuIcon icon={<ri_1.RiProgress4Line />}/>
              <macro_1.Trans>Quote</macro_1.Trans>
            </react_1.DropdownMenuItem>

            {/* No Quote */}
            <react_1.DropdownMenuItem disabled={status !== "Ready for Quote" ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "sales")} onClick={noQuoteReasonModal.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuCircleX />}/>
              <macro_1.Trans>No Quote</macro_1.Trans>
            </react_1.DropdownMenuItem>

            <react_1.DropdownMenuSeparator />

            {/* Reopen */}
            <react_1.DropdownMenuItem disabled={((_m = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _m === void 0 ? void 0 : _m.status) === "Draft" ||
            ((_p = (_o = routeData === null || routeData === void 0 ? void 0 : routeData.opportunity) === null || _o === void 0 ? void 0 : _o.quotes.length) !== null && _p !== void 0 ? _p : 0) > 0 ||
            statusFetcher.state !== "idle" ||
            !permissions.can("update", "sales")} onClick={function () {
            statusFetcher.submit({ status: "Draft" }, {
                method: "post",
                action: path_1.path.to.salesRfqStatus(rfqId)
            });
        }}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuLoaderCircle />}/>
              <macro_1.Trans>Reopen</macro_1.Trans>
            </react_1.DropdownMenuItem>

            {/* Delete */}
            <react_1.DropdownMenuItem disabled={isLocked ||
            !permissions.can("delete", "sales") ||
            !permissions.is("employee")} destructive onClick={deleteRFQModal.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
              <macro_1.Trans>Delete RFQ</macro_1.Trans>
            </react_1.DropdownMenuItem>
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </Layout_1.DetailTopbarContent>

      {convertToQuoteModal.isOpen && (<ConvertToQuoteModal lines={(_q = routeData === null || routeData === void 0 ? void 0 : routeData.lines) !== null && _q !== void 0 ? _q : []} rfqId={rfqId} onClose={convertToQuoteModal.onClose}/>)}
      {requiresCustomerAlert.isOpen && (<RequiresCustomerAlert onClose={requiresCustomerAlert.onClose}/>)}
      {noQuoteReasonModal.isOpen && (<NoQuoteReasonModal fetcher={statusFetcher} rfqId={rfqId} onClose={noQuoteReasonModal.onClose}/>)}
      {deleteRFQModal.isOpen && (<ConfirmDelete_1.default action={path_1.path.to.deleteSalesRfq(rfqId)} isOpen={deleteRFQModal.isOpen} name={(_r = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _r === void 0 ? void 0 : _r.rfqId} text={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), (_s = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _s === void 0 ? void 0 : _s.rfqId)} onCancel={function () {
                deleteRFQModal.onClose();
            }} onSubmit={function () {
                deleteRFQModal.onClose();
            }}/>)}
    </>);
}
var SalesRFQHeader = function () {
    var rfqId = (0, react_router_1.useParams)().rfqId;
    if (!rfqId)
        throw new Error("rfqId not found");
    var leftSlotEl = (0, Layout_1.useTopbarLeft)().leftSlotEl;
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, Layout_1.usePanels)(), hasExplorer = _a.hasExplorer, toggleExplorer = _a.toggleExplorer, toggleProperties = _a.toggleProperties;
    return (<>
      {leftSlotEl &&
            (0, react_dom_1.createPortal)(<SalesRFQTopbarLeft rfqId={rfqId}/>, leftSlotEl)}
      <div className="flex-shrink-0 h-[50px] flex items-center gap-1 px-2 bg-card border-b border-border dark:border-none dark:shadow-[inset_0_0_1px_rgb(255_255_255_/_0.24),_0_0_0_0.5px_rgb(0,0,0,1),0px_0px_4px_rgba(0,_0,_0,_0.08)]">
        {hasExplorer && (<react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Toggle Explorer"], ["Toggle Explorer"])))} icon={<lu_1.LuPanelLeft />} onClick={toggleExplorer} variant="ghost"/>)}
        <div className="flex-1"/>
        <react_1.IconButton aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Toggle Properties"], ["Toggle Properties"])))} icon={<lu_1.LuPanelRight />} onClick={toggleProperties} variant="ghost"/>
      </div>
    </>);
};
exports.default = SalesRFQHeader;
var rfqNoQuoteReasonValidator = zod_1.z.object({
    status: zod_1.z.enum(["Closed"]),
    noQuoteReasonId: zod_form_data_1.zfd.text(zod_1.z.string().optional())
});
function NoQuoteReasonModal(_a) {
    var _this = this;
    var fetcher = _a.fetcher, rfqId = _a.rfqId, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var user = (0, hooks_1.useUser)();
    var _b = (0, react_2.useState)([]), noQuoteReasons = _b[0], setNoQuoteReasons = _b[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    var fetchReasons = function () { return __awaiter(_this, void 0, void 0, function () {
        var data;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon
                            .from("noQuoteReason")
                            .select("*")
                            .eq("companyId", user.company.id)];
                case 1:
                    data = (_b.sent()).data;
                    setNoQuoteReasons((_a = data === null || data === void 0 ? void 0 : data.map(function (reason) { return ({ label: reason.name, value: reason.id }); })) !== null && _a !== void 0 ? _a : []);
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useMount)(function () {
        fetchReasons();
    });
    return (<react_1.Modal open onOpenChange={function (open) { return !open && onClose(); }}>
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" action={path_1.path.to.salesRfqStatus(rfqId)} validator={rfqNoQuoteReasonValidator} fetcher={fetcher} onSubmit={function () {
            onClose();
        }}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              <macro_1.Trans>No Quote Reason</macro_1.Trans>
            </react_1.ModalTitle>
            <react_1.ModalDescription>
              <macro_1.Trans>Select a reason for why the quote was not created.</macro_1.Trans>
            </react_1.ModalDescription>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <input type="hidden" name="status" value="Closed"/>
            <react_1.VStack spacing={2}>
              <form_1.Select name="noQuoteReasonId" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["No Quote Reason"], ["No Quote Reason"])))} options={noQuoteReasons}/>
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <form_1.Submit withBlocker={false}>
              <macro_1.Trans>Save</macro_1.Trans>
            </form_1.Submit>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
function RequiresCustomerAlert(_a) {
    var onClose = _a.onClose;
    return (<react_1.Modal open onOpenChange={function (open) { return !open && onClose(); }}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Cannot convert RFQ to quote</macro_1.Trans>
          </react_1.ModalTitle>
        </react_1.ModalHeader>
        <react_1.ModalBody>
          <react_1.Alert variant="destructive">
            <lu_1.LuTriangleAlert className="h-4 w-4"/>
            <react_1.AlertTitle>
              <macro_1.Trans>RFQ has no customer</macro_1.Trans>
            </react_1.AlertTitle>
            <react_1.AlertDescription>
              <macro_1.Trans>
                In order to convert this RFQ to a quote, it must be associated
                with a customer.
              </macro_1.Trans>
            </react_1.AlertDescription>
          </react_1.Alert>
        </react_1.ModalBody>
        <react_1.ModalFooter>
          <react_1.Button onClick={onClose}>
            <macro_1.Trans>OK</macro_1.Trans>
          </react_1.Button>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
}
function ConvertToQuoteModal(_a) {
    var _b;
    var lines = _a.lines, rfqId = _a.rfqId, onClose = _a.onClose;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.salesRfq(rfqId));
    var fetcher = (0, react_router_1.useFetcher)();
    var isLoading = fetcher.state !== "idle";
    var linesWithoutItems = lines.filter(function (line) { return !line.itemId; });
    var requiresPartNumbers = linesWithoutItems.length > 0;
    var requiresCustomer = !((_b = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _b === void 0 ? void 0 : _b.customerId);
    (0, react_2.useEffect)(function () {
        if (fetcher.state === "loading") {
            onClose();
        }
    }, [fetcher.state, onClose]);
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Convert to Quote</macro_1.Trans>
          </react_1.ModalTitle>
          <react_1.ModalDescription>
            <macro_1.Trans>Are you sure you want to convert the RFQ to a quote?</macro_1.Trans>
          </react_1.ModalDescription>
        </react_1.ModalHeader>

        <react_1.ModalBody>
          {requiresCustomer && (<react_1.Alert variant="destructive">
              <lu_1.LuTriangleAlert className="h-4 w-4"/>
              <react_1.AlertTitle>
                <macro_1.Trans>RFQ has no customer</macro_1.Trans>
              </react_1.AlertTitle>
              <react_1.AlertDescription>
                <macro_1.Trans>
                  In order to convert this RFQ to a quote, it must have a
                  customer.
                </macro_1.Trans>
              </react_1.AlertDescription>
            </react_1.Alert>)}
          {requiresPartNumbers && (<react_1.Alert variant="warning">
              <lu_1.LuTriangleAlert className="h-4 w-4"/>
              <react_1.AlertTitle>
                <macro_1.Trans>Lines need internal part numbers</macro_1.Trans>
              </react_1.AlertTitle>
              <react_1.AlertDescription>
                <macro_1.Trans>
                  In order to convert this RFQ to a quote, all lines must have
                  an internal part number.
                </macro_1.Trans>{" "}
                <br />
                <br />
                <macro_1.Trans>
                  Upon clicking Convert, parts will be created with the
                  following internal part numbers:
                </macro_1.Trans>
                <ul className="list-disc py-2 pl-4">
                  {linesWithoutItems.map(function (line) { return (<li key={line.id}>
                      {line.customerPartId}
                      {line.customerPartRevision &&
                    ".".concat(line.customerPartRevision)}
                    </li>); })}
                </ul>
                <br />
                <macro_1.Trans>
                  If you wish to change the part numbers, please click Cancel
                  and manually assign the parts for each line item before
                  converting.
                </macro_1.Trans>
              </react_1.AlertDescription>
            </react_1.Alert>)}
        </react_1.ModalBody>

        <react_1.ModalFooter>
          <react_1.Button variant="secondary" onClick={onClose}>
            <macro_1.Trans>Cancel</macro_1.Trans>
          </react_1.Button>
          <fetcher.Form method="post" action={path_1.path.to.salesRfqConvert(rfqId)}>
            <react_1.Button isDisabled={isLoading} type="submit" isLoading={isLoading}>
              <macro_1.Trans>Convert</macro_1.Trans>
            </react_1.Button>
          </fetcher.Form>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
