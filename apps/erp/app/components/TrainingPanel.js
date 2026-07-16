"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TrainingPanel;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var framer_motion_1 = require("framer-motion");
var lu_1 = require("react-icons/lu");
var training_1 = require("~/utils/training");
function TrainingPanel(_a) {
    var training = _a.training, isOpen = _a.isOpen, onDismiss = _a.onDismiss;
    var t = (0, macro_1.useLingui)().t;
    if (!training)
        return null;
    var embedUrl = (0, training_1.getVideoEmbedUrl)(training.videoUrl, training.videoType);
    return (<framer_motion_1.AnimatePresence mode="wait">
      {isOpen && (<framer_motion_1.motion.div key={training.title} initial={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(4px)" }} transition={{ duration: 0.3, ease: "easeOut" }} className="fixed bottom-4 right-4 w-[380px] rounded-xl border bg-background shadow-lg z-40 overflow-hidden">
          <div className="relative aspect-video w-full bg-muted">
            <iframe src={embedUrl} title={training.title} className="w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"/>
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none"/>
            <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Close"], ["Close"])))} icon={<lu_1.LuX />} variant="ghost" size="sm" className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background" onClick={onDismiss}/>
          </div>

          <div className="px-4 pt-3.5 pb-5 space-y-1">
            <h3 className="text-sm font-semibold tracking-tight">
              {training.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {training.description}
            </p>
          </div>

          <div className="px-4 pb-3.5 flex items-center justify-end gap-2">
            <react_1.Button variant="secondary" size="sm" onClick={onDismiss}>
              <macro_1.Trans>Dismiss</macro_1.Trans>
            </react_1.Button>
            {training.academyUrl ? (<react_1.Button size="sm" rightIcon={<lu_1.LuExternalLink />} onClick={function () { return window.open(training.academyUrl, "_blank"); }}>
                <macro_1.Trans>View in Academy</macro_1.Trans>
              </react_1.Button>) : (<react_1.Button size="sm" rightIcon={<lu_1.LuExternalLink />} onClick={function () { return window.open(training.videoUrl, "_blank"); }}>
                <macro_1.Trans>Watch full video</macro_1.Trans>
              </react_1.Button>)}
          </div>
        </framer_motion_1.motion.div>)}
    </framer_motion_1.AnimatePresence>);
}
var templateObject_1;
