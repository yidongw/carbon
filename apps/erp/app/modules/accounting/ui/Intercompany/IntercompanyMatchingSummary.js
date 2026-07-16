"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var react_2 = require("react");
var IntercompanyMatchingSummary = (0, react_2.memo)(function (_a) {
    var unmatched = _a.unmatched, matched = _a.matched, eliminated = _a.eliminated;
    return (<react_1.Card>
        <react_1.CardContent className="py-3">
          <react_1.HStack spacing={6}>
            <react_1.HStack spacing={2}>
              <react_1.Badge variant="yellow">{unmatched}</react_1.Badge>
              <span className="text-sm text-muted-foreground">Unmatched</span>
            </react_1.HStack>
            <react_1.HStack spacing={2}>
              <react_1.Badge variant="green">{matched}</react_1.Badge>
              <span className="text-sm text-muted-foreground">Matched</span>
            </react_1.HStack>
            <react_1.HStack spacing={2}>
              <react_1.Badge variant="gray">{eliminated}</react_1.Badge>
              <span className="text-sm text-muted-foreground">Eliminated</span>
            </react_1.HStack>
          </react_1.HStack>
        </react_1.CardContent>
      </react_1.Card>);
});
IntercompanyMatchingSummary.displayName = "IntercompanyMatchingSummary";
exports.default = IntercompanyMatchingSummary;
