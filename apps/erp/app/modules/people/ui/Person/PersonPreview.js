"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
// import { LuHistory } from "react-icons/lu";
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var AuditLog_1 = require("~/components/AuditLog");
var Enumerable_1 = require("~/components/Enumerable");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var PersonHeader = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var personId = (0, react_router_1.useParams)().personId;
    if (!personId)
        throw new Error("personId not found");
    var company = (0, hooks_1.useUser)().company;
    var auditDrawer = (0, react_1.useDisclosure)();
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.person(personId));
    return (<>
      <react_1.Card>
        <react_1.HStack className="justify-between items-start p-6 pl-0">
          <react_1.CardHeader>
            <react_1.CardTitle className="text-2xl">
              {(_a = routeData === null || routeData === void 0 ? void 0 : routeData.employeeSummary) === null || _a === void 0 ? void 0 : _a.name}
            </react_1.CardTitle>
            <react_1.CardDescription>
              {(_b = routeData === null || routeData === void 0 ? void 0 : routeData.employeeSummary) === null || _b === void 0 ? void 0 : _b.title}
            </react_1.CardDescription>
          </react_1.CardHeader>
          <components_1.Avatar size="lg" name={(_d = (_c = routeData === null || routeData === void 0 ? void 0 : routeData.employeeSummary) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : undefined} path={(_e = routeData === null || routeData === void 0 ? void 0 : routeData.employeeSummary) === null || _e === void 0 ? void 0 : _e.avatarUrl}/>
        </react_1.HStack>
        <react_1.CardContent>
          <react_1.CardAttributes>
            <react_1.CardAttribute>
              <react_1.CardAttributeLabel>
                <macro_1.Trans>Department</macro_1.Trans>
              </react_1.CardAttributeLabel>
              <react_1.CardAttributeValue>
                {(_f = routeData === null || routeData === void 0 ? void 0 : routeData.employeeSummary) === null || _f === void 0 ? void 0 : _f.departmentName}
              </react_1.CardAttributeValue>
            </react_1.CardAttribute>
            <react_1.CardAttribute>
              <react_1.CardAttributeLabel>
                <macro_1.Trans>Location</macro_1.Trans>
              </react_1.CardAttributeLabel>
              <react_1.CardAttributeValue>
                <Enumerable_1.Enumerable value={(_h = (_g = routeData === null || routeData === void 0 ? void 0 : routeData.employeeSummary) === null || _g === void 0 ? void 0 : _g.locationName) !== null && _h !== void 0 ? _h : null}/>
              </react_1.CardAttributeValue>
            </react_1.CardAttribute>
            <react_1.CardAttribute>
              <react_1.CardAttributeLabel>
                <macro_1.Trans>Manager</macro_1.Trans>
              </react_1.CardAttributeLabel>
              <react_1.CardAttributeValue>
                {(_j = routeData === null || routeData === void 0 ? void 0 : routeData.employeeSummary) === null || _j === void 0 ? void 0 : _j.managerName}
              </react_1.CardAttributeValue>
            </react_1.CardAttribute>
            <react_1.CardAttribute>
              <react_1.CardAttributeLabel>
                <macro_1.Trans>Start Date</macro_1.Trans>
              </react_1.CardAttributeLabel>
              <react_1.CardAttributeValue>
                {(_k = routeData === null || routeData === void 0 ? void 0 : routeData.employeeSummary) === null || _k === void 0 ? void 0 : _k.startDate}
              </react_1.CardAttributeValue>
            </react_1.CardAttribute>
          </react_1.CardAttributes>
        </react_1.CardContent>
      </react_1.Card>
      <AuditLog_1.AuditLogDrawer isOpen={auditDrawer.isOpen} onClose={auditDrawer.onClose} entityType="employee" entityId={personId} companyId={company.id}/>
    </>);
};
exports.default = PersonHeader;
