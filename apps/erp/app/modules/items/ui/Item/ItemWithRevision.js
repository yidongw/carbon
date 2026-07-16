"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemWithRevision = ItemWithRevision;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
function ItemWithRevision(_a) {
    var item = _a.item;
    if (!item)
        return null;
    var readableId = item.readableId, revision = item.revision;
    if (!readableId)
        return null;
    return (<div className="flex items-center gap-1">
      <span>{readableId}</span>
      {revision && revision !== "0" && (<react_1.Badge variant="outline" className="font-mono">
          <macro_1.Trans>Rev {revision}</macro_1.Trans>
        </react_1.Badge>)}
    </div>);
}
