"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimatedStatus = AnimatedStatus;
var react_1 = require("@carbon/react");
var framer_motion_1 = require("framer-motion");
function AnimatedStatus(_a) {
    var text = _a.text, _b = _a.shimmerDuration, shimmerDuration = _b === void 0 ? 1 : _b, className = _a.className, _c = _a.fadeDuration, fadeDuration = _c === void 0 ? 0.2 : _c, _d = _a.variant, variant = _d === void 0 ? "fade" : _d, Icon = _a.icon;
    // Animation variants for different effects
    var animations = {
        fade: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 }
        },
        slide: {
            initial: { opacity: 0, x: 10 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -10 }
        },
        scale: {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 }
        },
        "blur-fade": {
            initial: { opacity: 0, filter: "blur(4px)" },
            animate: { opacity: 1, filter: "blur(0px)" },
            exit: { opacity: 0, filter: "blur(4px)" }
        }
    };
    var selectedAnimation = animations[variant];
    return (<div className="relative whitespace-nowrap h-8 flex items-center">
      <framer_motion_1.AnimatePresence mode="wait">
        {text && (<framer_motion_1.motion.div key={text} // Re-mount when text changes to trigger animation
         initial={selectedAnimation.initial} animate={selectedAnimation.animate} exit={selectedAnimation.exit} transition={{
                duration: fadeDuration,
                ease: "easeInOut"
            }} className="flex items-center gap-1.5 text-muted-foreground">
            {Icon && <Icon className="h-3 w-3 shrink-0 text-current"/>}
            <react_1.TextShimmer className={className} duration={shimmerDuration}>
              {text || ""}
            </react_1.TextShimmer>
          </framer_motion_1.motion.div>)}
      </framer_motion_1.AnimatePresence>
    </div>);
}
