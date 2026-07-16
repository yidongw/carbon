"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Safety = Safety;
var SpecRow_1 = require("./SpecRow");
var Tag_1 = require("./Tag");
function Safety() {
    return (<>
      <p className="text-muted-foreground max-w-[64ch] mb-6 text-[0.95rem] [text-wrap:pretty]">
        Every tool is classified so you always know what's safe and what mutates
        data.
      </p>
      <SpecRow_1.SpecList>
        <SpecRow_1.SpecRow label={<Tag_1.Tag kind="READ"/>}>
          Always safe — no data changes.
        </SpecRow_1.SpecRow>
        <SpecRow_1.SpecRow label={<Tag_1.Tag kind="WRITE"/>}>
          Creates or updates records.
        </SpecRow_1.SpecRow>
        <SpecRow_1.SpecRow label={<Tag_1.Tag kind="DESTRUCTIVE"/>}>
          Deletes data — keep human confirmation on.
        </SpecRow_1.SpecRow>
      </SpecRow_1.SpecList>
      <p className="text-muted-foreground text-[0.9rem] mt-3 max-w-[64ch] [text-wrap:pretty]">
        A key only ever sees what its user could see in Carbon. Cross-company
        access is impossible.
      </p>
    </>);
}
