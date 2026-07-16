"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var Avatar_1 = require("./Avatar");
var Activity = function (_a) {
    var _b, _c, _d;
    var employeeId = _a.employeeId, activityMessage = _a.activityMessage, activityTime = _a.activityTime, activityTimeDetail = _a.activityTimeDetail, activityIcon = _a.activityIcon, comment = _a.comment;
    var formatTimeAgo = (0, hooks_1.useDateFormatter)().formatTimeAgo;
    var people = (0, stores_1.usePeople)()[0];
    if (!employeeId)
        return null;
    var person = people.find(function (p) { return p.id === employeeId; });
    return (<li className="relative flex-grow w-full border rounded-lg bg-card p-6 pl-14">
      <div className="absolute left-3 top-6 flex items-center justify-center w-10 h-10">
        <Avatar_1.default path={(_b = person === null || person === void 0 ? void 0 : person.avatarUrl) !== null && _b !== void 0 ? _b : undefined} name={(_c = person === null || person === void 0 ? void 0 : person.name) !== null && _c !== void 0 ? _c : ""}/>
      </div>
      <div className={activityIcon != null ? "flex items-start gap-2" : "flex flex-col"}>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-1 gap-y-1">
            <span className="font-semibold">
              {(_d = person === null || person === void 0 ? void 0 : person.name) !== null && _d !== void 0 ? _d : "Carbon Admin"}
            </span>
            <span className="text-muted-foreground">{activityMessage}</span>
          </p>
          {comment ? <div className="mt-2 text-sm">{comment}</div> : null}
          <div className="mt-1.5 space-y-0.5">
            {activityTimeDetail ? (<time dateTime={activityTime} className="block text-sm tabular-nums text-muted-foreground">
                {activityTimeDetail}
              </time>) : null}
            <div className="text-sm text-muted-foreground">
              {formatTimeAgo(activityTime)}
            </div>
          </div>
        </div>
        {activityIcon != null ? (<div className="shrink-0">{activityIcon}</div>) : null}
      </div>
    </li>);
};
exports.default = Activity;
