"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowDiagram = FlowDiagram;
var react_1 = require("react");
var Tag_1 = require("./Tag");
function FlowDiagram(_a) {
    var label = _a.label, caption = _a.caption, steps = _a.steps, _b = _a.vertical, vertical = _b === void 0 ? false : _b;
    if (vertical) {
        return (<div className="bg-card border border-border rounded-[12px] p-[18px]">
        <div className="text-[var(--acc)] font-[var(--mono)] text-[0.68rem] tracking-[0.14em] font-medium">
          {label}
        </div>
        <div className="text-muted-foreground text-[0.85rem] mt-1 mb-[15px]">
          {caption}
        </div>
        <div className="flex flex-col stagger">
          {steps.map(function (s, i) {
                var _a;
                return (<div className="grid gap-[14px] py-3 [grid-template-columns:30px_1fr] [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border" key={"".concat(s.name, "-").concat(i)}>
              <span className="text-[var(--acc)] font-[var(--mono)] text-[0.7rem]">
                {(_a = s.num) !== null && _a !== void 0 ? _a : String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <span className="font-[var(--mono)] font-medium text-foreground text-[0.85rem] flex items-center gap-2 flex-wrap">
                  {s.name}
                  {s.tag && <Tag_1.Tag kind={s.tag}/>}
                </span>
                <p className="mt-[5px] text-[0.82rem] text-muted-foreground m-0">
                  {s.text}
                </p>
              </div>
            </div>);
            })}
        </div>
      </div>);
    }
    return (<div className="bg-card border border-border rounded-[12px] p-[18px]">
      <div className="text-[var(--acc)] font-[var(--mono)] text-[0.68rem] tracking-[0.14em] font-medium">
        {label}
      </div>
      <div className="text-muted-foreground text-[0.85rem] mt-1 mb-[15px]">
        {caption}
      </div>
      <div className="flex items-stretch flex-wrap stagger">
        {steps.map(function (s, i) {
            var _a;
            return (<react_1.Fragment key={"".concat(s.name, "-").concat(i)}>
            {i > 0 && (<div className="flex items-center text-[var(--acc)] px-[10px] text-[17px]">
                →
              </div>)}
            <div className="flex-1 min-w-[172px] bg-muted border border-border rounded-[10px] p-[13px]">
              {s.tag ? (<Tag_1.Tag kind={s.tag}/>) : (<span className="font-[var(--mono)] text-[0.68rem] text-muted-foreground">
                  {(_a = s.num) !== null && _a !== void 0 ? _a : String(i + 1).padStart(2, "0")}
                </span>)}
              <div className="font-[var(--mono)] font-medium text-foreground mt-[3px] text-[0.85rem]">
                {s.name}
              </div>
              <p className="mt-[7px] text-[0.8rem] text-muted-foreground m-0">
                {s.text}
              </p>
            </div>
          </react_1.Fragment>);
        })}
      </div>
    </div>);
}
