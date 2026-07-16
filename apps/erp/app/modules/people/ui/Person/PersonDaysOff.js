"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var PersonDaysOff = function (props) {
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.CardTitle>
          <macro_1.Trans>Days Off</macro_1.Trans>
        </react_1.CardTitle>
      </react_1.CardHeader>
      <react_1.CardContent>
        <div className="text-muted-foreground p-4 w-full text-center">
          <macro_1.Trans>No days off scheduled</macro_1.Trans>
        </div>
      </react_1.CardContent>
    </react_1.Card>);
};
exports.default = PersonDaysOff;
