"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocPage = DocPage;
exports.DocEyebrow = DocEyebrow;
exports.DocTitle = DocTitle;
exports.Lead = Lead;
exports.H2 = H2;
exports.P = P;
exports.Code = Code;
exports.DocLink = DocLink;
exports.Warn = Warn;
exports.Table = Table;
exports.Row = Row;
function DocPage(_a) {
    var children = _a.children;
    return <div className="max-w-[760px]">{children}</div>;
}
function DocEyebrow(_a) {
    var children = _a.children;
    return (<p className="m-0 font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase tracking-[0.08em] text-[rgba(38,35,35,0.5)]">
      {children}
    </p>);
}
function DocTitle(_a) {
    var children = _a.children;
    return <h1 className="m-0 mt-[8px] text-[34px] font-[560] leading-[120%] text-[#262323]">{children}</h1>;
}
function Lead(_a) {
    var children = _a.children;
    return (<p className="m-0 mt-[12px] max-w-[640px] text-[16.5px] leading-[170%] text-[rgba(38,35,35,0.82)]">
      {children}
    </p>);
}
function H2(_a) {
    var children = _a.children, id = _a.id;
    return (<h2 id={id} className="m-0 mt-[44px] mb-[2px] scroll-mt-[88px] text-[22px] font-[560] leading-[130%] text-[#262323]">
      {children}
    </h2>);
}
function P(_a) {
    var children = _a.children;
    return <p className="m-0 mt-[12px] text-[15.5px] leading-[170%] text-[rgba(38,35,35,0.82)]">{children}</p>;
}
function Code(_a) {
    var children = _a.children;
    return <code className="font-[family-name:var(--font-mono)] text-[13.5px] text-[#a76451]">{children}</code>;
}
function DocLink(_a) {
    var href = _a.href, children = _a.children;
    return (<a href={href} className="text-[#1E84B0] underline decoration-[#A9DAF3] underline-offset-2 hover:decoration-[#1E84B0]">
      {children}
    </a>);
}
function Warn(_a) {
    var title = _a.title, children = _a.children;
    return (<div className="my-[18px] rounded-[12px] border border-[#E6CFA3] bg-[#FFF8EC] px-[16px] py-[13px]">
      <p className="m-0 text-[14.5px] font-[560] text-[#8a5a1f]">{title}</p>
      <p className="m-0 mt-[4px] text-[14px] leading-[155%] text-[rgba(38,35,35,0.78)]">{children}</p>
    </div>);
}
function Table(_a) {
    var children = _a.children;
    return (<div className="my-[18px] overflow-hidden rounded-[10px] border border-[#E3E3DF]">{children}</div>);
}
function Row(_a) {
    var cells = _a.cells, cols = _a.cols, _b = _a.head, head = _b === void 0 ? false : _b;
    return (<div className="grid border-t border-[#E3E3DF] first:border-t-0" style={{ gridTemplateColumns: cols }}>
      {cells.map(function (c, i) { return (<div key={i} className={"px-[12px] py-[9px] text-[14px] leading-[150%] ".concat(head ? "font-[560] text-[#262323]" : "text-[rgba(38,35,35,0.82)]", " ").concat(i > 0 ? "border-l border-[#E3E3DF]" : "")}>
          {c}
        </div>); })}
    </div>);
}
