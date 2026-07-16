"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var ApprovalRuleCard_1 = require("./ApprovalRuleCard");
var ApprovalRuleSection = function (_a) {
    var documentType = _a.documentType, title = _a.title, description = _a.description, rules = _a.rules, canCreate = _a.canCreate;
    var allowsMultiple = shared_1.approvalDocumentTypesWithAmounts.includes(documentType);
    var showAddButton = canCreate && (allowsMultiple || rules.length === 0);
    var activeRules = rules.filter(function (r) { return r.id; });
    // A rule's ceiling is the next-higher tier's minimum (null for the top tier).
    var sortedFloors = Array.from(new Set(rules.map(function (r) { var _a; return (_a = r.lowerBoundAmount) !== null && _a !== void 0 ? _a : 0; }))).sort(function (a, b) { return a - b; });
    var nextTierFloor = function (lowerBoundAmount) { var _a; return (_a = sortedFloors.find(function (f) { return f > lowerBoundAmount; })) !== null && _a !== void 0 ? _a : null; };
    return (<react_1.Card>
      <react_1.CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <react_1.CardTitle className="text-lg">{title}</react_1.CardTitle>
            <react_1.CardDescription className="text-sm">{description}</react_1.CardDescription>
          </div>
          {showAddButton && (<react_1.Button variant="primary" leftIcon={<lu_1.LuPlus />} asChild>
              <react_router_1.Link to={path_1.path.to.newApprovalRule(documentType)}>
                <macro_1.Trans>New Rule</macro_1.Trans>
              </react_router_1.Link>
            </react_1.Button>)}
        </div>
      </react_1.CardHeader>
      <react_1.CardContent>
        {activeRules.length === 0 ? (<components_1.Empty className="my-4"/>) : (<react_1.VStack spacing={3} className="items-stretch">
            {activeRules.map(function (rule) {
                var _a;
                return (<ApprovalRuleCard_1.default key={rule.id} rule={rule} documentType={documentType} upperBound={allowsMultiple
                        ? nextTierFloor((_a = rule.lowerBoundAmount) !== null && _a !== void 0 ? _a : 0)
                        : null}/>);
            })}
          </react_1.VStack>)}
      </react_1.CardContent>
    </react_1.Card>);
};
exports.default = ApprovalRuleSection;
