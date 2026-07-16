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
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var useCurrencyFormatter_1 = require("~/hooks/useCurrencyFormatter");
var path_1 = require("~/utils/path");
var accounting_models_1 = require("../../accounting.models");
var JournalEntryStatus_1 = require("./JournalEntryStatus");
var JournalLineRow_1 = require("./JournalLineRow");
function generateId() {
    return Math.random().toString(36).substring(2, 9);
}
function createEmptyLine() {
    return {
        id: generateId(),
        accountId: "",
        description: "",
        debit: null,
        credit: null,
        dimensions: []
    };
}
var JournalEntryForm = function (_a) {
    var journalEntryId = _a.journalEntryId, displayId = _a.displayId, status = _a.status, sourceType = _a.sourceType, reversedById = _a.reversedById, initialValues = _a.initialValues, initialLines = _a.initialLines, companies = _a.companies, dimensions = _a.dimensions, lineDimensions = _a.lineDimensions, _b = _a.isDisabled, isDisabled = _b === void 0 ? false : _b;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var deleteModal = (0, react_1.useDisclosure)();
    var reverseModal = (0, react_1.useDisclosure)();
    var company = (0, hooks_1.useUser)().company;
    var currencyFormatter = (0, useCurrencyFormatter_1.useCurrencyFormatter)({
        currency: company.baseCurrencyCode
    });
    var _c = (0, react_2.useState)(function () {
        if (initialLines.length === 0) {
            return [createEmptyLine(), createEmptyLine()];
        }
        return initialLines.map(function (line) {
            var _a, _b;
            return (__assign(__assign({}, line), { dimensions: (_b = (_a = lineDimensions[line.id]) !== null && _a !== void 0 ? _a : line.dimensions) !== null && _b !== void 0 ? _b : [] }));
        });
    }), lines = _c[0], setLines = _c[1];
    var isDraft = status === "Draft";
    var isPosted = status === "Posted";
    var isReversed = status === "Reversed";
    var companyName = (0, react_2.useMemo)(function () { var _a, _b; return (_b = (_a = companies.find(function (c) { return c.id === initialValues.companyId; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : ""; }, [companies, initialValues.companyId]);
    var sourceTypeOptions = accounting_models_1.journalEntrySourceTypes.map(function (type) { return ({
        label: type,
        value: type
    }); });
    var totalDebits = lines.reduce(function (sum, line) { return sum + (line.debit || 0); }, 0);
    var totalCredits = lines.reduce(function (sum, line) { return sum + (line.credit || 0); }, 0);
    var difference = totalDebits - totalCredits;
    var isBalanced = Math.abs(difference) < 0.01;
    var handleLineChange = (0, react_2.useCallback)(function (index, updatedLine) {
        setLines(function (prev) {
            var newLines = __spreadArray([], prev, true);
            newLines[index] = updatedLine;
            return newLines;
        });
    }, []);
    var handleDeleteLine = (0, react_2.useCallback)(function (index) {
        setLines(function (prev) {
            if (prev.length <= 2)
                return prev;
            return prev.filter(function (_, i) { return i !== index; });
        });
    }, []);
    var handleAddLine = (0, react_2.useCallback)(function () {
        setLines(function (prev) { return __spreadArray(__spreadArray([], prev, true), [createEmptyLine()], false); });
    }, []);
    var linesJson = JSON.stringify(lines.map(function (l) {
        var _a, _b, _c;
        return ({
            accountId: l.accountId,
            description: l.description,
            debit: (_a = l.debit) !== null && _a !== void 0 ? _a : 0,
            credit: (_b = l.credit) !== null && _b !== void 0 ? _b : 0,
            dimensions: ((_c = l.dimensions) !== null && _c !== void 0 ? _c : []).map(function (d) { return ({
                dimensionId: d.dimensionId,
                valueId: d.valueId
            }); })
        });
    }));
    return (<>
      <react_1.Card>
        <form_1.ValidatedForm method="post" validator={accounting_models_1.journalEntryValidator} defaultValues={initialValues} isReadOnly={isDisabled} style={{ width: "100%" }}>
          <react_1.CardHeader className="flex-row items-center justify-between">
            <react_1.HStack>
              <react_1.Heading as="h1" size="h3">
                {displayId}
              </react_1.Heading>
              <react_1.Copy text={displayId}/>

              {(isDraft || isPosted) && (<react_1.DropdownMenu>
                  <react_1.DropdownMenuTrigger asChild>
                    <react_1.IconButton type="button" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} variant="secondary" size="sm"/>
                  </react_1.DropdownMenuTrigger>
                  <react_1.DropdownMenuContent>
                    {isPosted && permissions.can("create", "accounting") && (<react_1.DropdownMenuItem destructive onClick={reverseModal.onOpen}>
                        <react_1.DropdownMenuIcon icon={<lu_1.LuRotateCcw />}/>
                        Reverse Entry
                      </react_1.DropdownMenuItem>)}
                    {isDraft && (<>
                        <react_1.DropdownMenuSeparator />
                        <react_1.DropdownMenuItem disabled={!permissions.can("delete", "accounting") ||
                    !permissions.is("employee")} destructive onClick={deleteModal.onOpen}>
                          <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                          Delete Journal Entry
                        </react_1.DropdownMenuItem>
                      </>)}
                  </react_1.DropdownMenuContent>
                </react_1.DropdownMenu>)}
              <JournalEntryStatus_1.default status={status}/>
            </react_1.HStack>
            <react_1.HStack>
              {isReversed && reversedById && (<react_1.Button variant="secondary" asChild>
                  <react_router_1.Link to={path_1.path.to.journalEntryDetails(reversedById)}>
                    Reversing Entry
                  </react_router_1.Link>
                </react_1.Button>)}
              {isDraft && permissions.can("update", "accounting") && (<>
                  <react_1.Button type="submit" name="intent" value="save" leftIcon={<lu_1.LuSave />} variant="secondary">
                    Save Draft
                  </react_1.Button>
                  <react_1.Button type="submit" name="intent" value="post" leftIcon={<lu_1.LuCheckCheck />} variant="primary" isDisabled={!isBalanced || totalDebits === 0}>
                    Post
                  </react_1.Button>
                </>)}
            </react_1.HStack>
          </react_1.CardHeader>

          <react_1.CardContent>
            <Form_1.Hidden name="id"/>
            <input type="hidden" name="lines" value={linesJson}/>
            <react_1.VStack spacing={4} className="w-full">
              {/* Entry Details */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
                <div className="col-span-3">
                  <Form_1.Input autoFocus name="description" label="Description"/>
                </div>
                <Form_1.Input name="company" label="Company" value={companyName} isReadOnly/>
                <Form_1.Select name="sourceType" label="Source" value={sourceType} options={sourceTypeOptions} isReadOnly/>
                <Form_1.DatePicker name="postingDate" label="Posting Date" isDisabled={isDisabled}/>
              </div>

              {/* Journal Lines + Totals */}
              <div className="rounded-lg border border-border overflow-hidden w-full">
                {/* Column Headers */}
                <div className="grid grid-cols-[auto_1fr_140px_140px_40px] items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground font-medium bg-muted/50 border-b border-border">
                  <div className="w-6"/>
                  <div className="pl-3">Account & Details</div>
                  <div className="text-right pr-3">Debit</div>
                  <div className="text-right pr-3">Credit</div>
                  <div />
                </div>

                {/* Lines */}
                <div className="divide-y divide-border">
                  {lines.map(function (line, index) { return (<JournalLineRow_1.default key={line.id} line={line} index={index} currencyCode={company.baseCurrencyCode} onChange={function (updatedLine) {
                return handleLineChange(index, updatedLine);
            }} onDelete={function () { return handleDeleteLine(index); }} canDelete={lines.length > 2} isDisabled={isDisabled} availableDimensions={dimensions} autoSaveDimensions={isPosted || isReversed}/>); })}
                </div>

                {/* Add Line Button */}
                {!isDisabled && (<button type="button" onClick={handleAddLine} className="flex w-full items-center justify-center gap-2 border-t border-dashed border-border py-2.5 text-sm text-muted-foreground hover:bg-muted/30 hover:text-foreground transition-colors">
                    <lu_1.LuPlus className="size-3.5"/>
                    Add Line
                  </button>)}

                {/* Totals */}
                <div className="grid grid-cols-[auto_1fr_140px_140px_40px] items-center gap-3 px-4 py-3 bg-muted/50 border-t border-border">
                  <div className="w-6"/>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    Totals
                    {isBalanced && totalDebits > 0 ? (<react_1.Status color="green">Balanced</react_1.Status>) : totalDebits === 0 && totalCredits === 0 ? (<react_1.Status color="yellow">
                        Enter at least one debit and credit
                      </react_1.Status>) : (<react_1.Status color="yellow">
                        Unbalanced
                        {totalDebits > 0 && (<span className="ml-1 font-normal">
                            ({currencyFormatter.format(Math.abs(difference))}{" "}
                            {difference > 0 ? "more debits" : "more credits"})
                          </span>)}
                      </react_1.Status>)}
                  </div>
                  <div className="text-right font-mono text-sm tabular-nums">
                    {currencyFormatter.format(totalDebits)}
                  </div>
                  <div className="text-right font-mono text-sm tabular-nums">
                    {currencyFormatter.format(totalCredits)}
                  </div>
                  <div />
                </div>
              </div>
            </react_1.VStack>
          </react_1.CardContent>
        </form_1.ValidatedForm>
      </react_1.Card>

      <Modals_1.ConfirmDelete isOpen={deleteModal.isOpen} name={displayId} text="Are you sure you want to delete this journal entry?" onCancel={deleteModal.onClose} onSubmit={function () {
            deleteModal.onClose();
            navigate(path_1.path.to.deleteJournalEntry(journalEntryId));
        }}/>
      <Modals_1.ConfirmDelete action={path_1.path.to.reverseJournalEntry(journalEntryId)} isOpen={reverseModal.isOpen} name={displayId} deleteText="Reverse Entry" text="Are you sure you want to reverse this journal entry? This will create a new posted entry with negated amounts and mark this entry as Reversed." onCancel={reverseModal.onClose} onSubmit={reverseModal.onClose}/>
    </>);
};
exports.default = JournalEntryForm;
var templateObject_1;
