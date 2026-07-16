"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Screenshot = Screenshot;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
// The source screenshots are ~3400px wide — far more detail than the
// quickstart column can show — so the thumbnail opens a full-size lightbox.
function Screenshot(_a) {
    var src = _a.src, alt = _a.alt;
    var t = (0, macro_1.useLingui)().t;
    return (<react_1.Modal>
      <react_1.ModalTrigger asChild>
        <button type="button" className="group relative block w-full cursor-zoom-in rounded-[9px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--acc)]">
          <img src={src} alt={alt} className="w-full rounded-[9px] block outline outline-1 outline-black/10 -outline-offset-1"/>
          <span className="absolute top-[8px] right-[8px] w-[28px] h-[28px] inline-flex items-center justify-center rounded-md bg-zinc-800/80 text-zinc-300 backdrop-blur-sm transition-colors group-hover:bg-zinc-800 group-hover:text-zinc-100">
            <lu_1.LuExpand size={14}/>
            <span className="sr-only">Expand screenshot</span>
          </span>
        </button>
      </react_1.ModalTrigger>
      <react_1.ModalContent size="xxxlarge" withCloseButton={false} aria-describedby={undefined} className="pt-0 gap-0 overflow-hidden">
        <react_1.ModalTitle className="sr-only">{alt}</react_1.ModalTitle>
        <img src={src} alt={alt} className="w-full block"/>
        {/* The default close button is foreground-on-transparent — invisible
            over these mostly-dark screenshots. */}
        <react_1.ModalClose asChild>
          <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Close"], ["Close"])))} icon={<lu_1.LuX />} variant="secondary" className="absolute top-2 right-2"/>
        </react_1.ModalClose>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1;
