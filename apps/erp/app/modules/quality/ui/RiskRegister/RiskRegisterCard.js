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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RiskRegisterCard;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var RiskRating_1 = require("./RiskRating");
var RiskRegisterForm_1 = require("./RiskRegisterForm");
var RiskStatus_1 = require("./RiskStatus");
var RiskType_1 = require("./RiskType");
function RiskRegisterCard(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f;
    var sourceId = _a.sourceId, source = _a.source, itemId = _a.itemId;
    var t = (0, macro_1.useLingui)().t;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var company = (0, hooks_1.useUser)().company;
    var _g = (0, react_2.useState)([]), risks = _g[0], setRisks = _g[1];
    var _h = (0, react_2.useState)(false), loading = _h[0], setLoading = _h[1];
    var formDisclosure = (0, react_1.useDisclosure)();
    var deleteDisclosure = (0, react_1.useDisclosure)();
    var _j = (0, react_2.useState)(undefined), selectedRisk = _j[0], setSelectedRisk = _j[1];
    var fetchRisks = (0, react_2.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!carbon || !(company === null || company === void 0 ? void 0 : company.id))
                        return [2 /*return*/];
                    setLoading(true);
                    return [4 /*yield*/, carbon
                            .from("riskRegister")
                            .select("*, assignee:assignee(id, firstName, lastName, avatarUrl)")
                            .eq("companyId", company.id)
                            .eq("source", source)
                            .eq("sourceId", sourceId)
                            .order("createdAt", { ascending: false })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failed to fetch risks"], ["Failed to fetch risks"]))));
                        return [2 /*return*/];
                    }
                    if (data) {
                        setRisks(data);
                    }
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); }, [carbon, company === null || company === void 0 ? void 0 : company.id, sourceId, source, t]);
    (0, react_2.useEffect)(function () {
        fetchRisks();
    }, [fetchRisks]);
    var handleAdd = function () {
        setSelectedRisk(undefined);
        formDisclosure.onOpen();
    };
    var handleEdit = function (risk) {
        setSelectedRisk(risk);
        formDisclosure.onOpen();
    };
    var handleDelete = function (risk) {
        setSelectedRisk(risk);
        deleteDisclosure.onOpen();
    };
    return (<react_1.Card className="h-full">
      <react_1.HStack className="justify-between">
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Risks</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardAction>
          <react_1.Button aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Add Risk"], ["Add Risk"])))} variant="secondary" onClick={handleAdd}>
            <macro_1.Trans>Add Risk</macro_1.Trans>
          </react_1.Button>
        </react_1.CardAction>
      </react_1.HStack>

      <react_1.CardContent className="h-full">
        {loading ? (<div className="p-4">
            <react_1.Loading isLoading={true}/>
          </div>) : risks.length === 0 ? (<components_1.Empty className="py-8"/>) : (<div className="flex flex-col gap-4">
            {risks.map(function (risk) { return (<RiskRegisterCardItem key={risk.id} risk={risk} setRisks={setRisks} handleEdit={handleEdit} handleDelete={handleDelete}/>); })}
          </div>)}
      </react_1.CardContent>

      {formDisclosure.isOpen && (<RiskRegisterForm_1.default open={formDisclosure.isOpen} onClose={function () {
                formDisclosure.onClose();
                fetchRisks();
            }} 
        // @ts-expect-error TS2322 - TODO: fix type
        initialValues={selectedRisk
                ? __assign(__assign({}, selectedRisk), { description: (_b = selectedRisk.description) !== null && _b !== void 0 ? _b : undefined, assignee: (_c = selectedRisk.assignee) !== null && _c !== void 0 ? _c : undefined, sourceId: (_d = selectedRisk.sourceId) !== null && _d !== void 0 ? _d : undefined, itemId: (_e = selectedRisk.itemId) !== null && _e !== void 0 ? _e : undefined, severity: selectedRisk.severity
                        ? selectedRisk.severity.toString()
                        : "1", likelihood: selectedRisk.likelihood
                        ? selectedRisk.likelihood.toString()
                        : "1", type: (_f = selectedRisk.type) !== null && _f !== void 0 ? _f : "Risk" }) : {
                title: "",
                status: "Open",
                source: source,
                sourceId: sourceId,
                itemId: itemId,
                severity: "1",
                likelihood: "1",
                type: "Risk"
            }}/>)}

      {selectedRisk && deleteDisclosure.isOpen && (<Modals_1.Confirm isOpen={deleteDisclosure.isOpen} confirmText={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Delete"], ["Delete"])))} onCancel={function () {
                deleteDisclosure.onClose();
                setSelectedRisk(undefined);
            }} onSubmit={function () {
                deleteDisclosure.onClose();
                setSelectedRisk(undefined);
                fetchRisks();
            }} title={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Delete Risk"], ["Delete Risk"])))} text={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Are you sure you want to delete this risk?"], ["Are you sure you want to delete this risk?"])))} 
        // @ts-expect-error TS2345 - TODO: fix type
        action={path_1.path.to.deleteRisk(selectedRisk.id)}/>)}
    </react_1.Card>);
}
function RiskRegisterCardItem(_a) {
    var _b;
    var risk = _a.risk, setRisks = _a.setRisks, handleEdit = _a.handleEdit, handleDelete = _a.handleDelete;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    return (<div key={risk.id} className="flex flex-col hover:bg-muted/50 transition-colors group rounded-md bg-muted/30 border border-border">
      <div className="p-4 flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <react_1.Heading size="h4" as="h3">
            {risk.title}
          </react_1.Heading>
          <div>
            <RiskType_1.default type={risk.type}/>
          </div>
          {risk.description && (<p className="text-sm text-muted-foreground line-clamp-2">
              {risk.description}
            </p>)}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <react_1.IconButton aria-label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Edit"], ["Edit"])))} icon={<lu_1.LuSettings2 className="h-4 w-4"/>} variant="secondary" size="sm" onClick={function () { return handleEdit(risk); }}/>
          {permissions.can("delete", "quality") && (<react_1.IconButton aria-label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Delete"], ["Delete"])))} icon={<lu_1.LuTrash2 className="h-4 w-4"/>} variant="secondary" size="sm" onClick={function () { return handleDelete(risk); }}/>)}
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 border-t border-border">
        <div>
          <components_1.Assignee table="riskRegister" 
    // @ts-expect-error TS2322 - TODO: fix type
    id={risk.id} size="sm" value={(_b = risk.assignee) !== null && _b !== void 0 ? _b : undefined} onChange={function (assignee) {
            setRisks(function (prev) {
                return prev.map(function (r) { return (r.id === risk.id ? __assign(__assign({}, r), { assignee: assignee }) : r); });
            });
        }}/>
        </div>
        <RiskStatus_1.default status={risk.status}/>
        <Enumerable_1.Enumerable value={risk.source}/>
        {risk.severity && (<react_1.Badge variant="gray" className="flex items-center gap-1">
            <lu_1.LuTriangleAlert />
            <RiskRating_1.RiskRating rating={risk.severity} size="sm"/>
          </react_1.Badge>)}
        {risk.likelihood && (<react_1.Badge variant="gray" className="flex items-center gap-1">
            <lu_1.LuDice5 />
            <RiskRating_1.RiskRating rating={risk.likelihood} size="sm"/>
          </react_1.Badge>)}
      </div>
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
