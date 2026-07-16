"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var Share = function (_a) {
    var text = _a.text, className = _a.className, _b = _a.withTextInTooltip, withTextInTooltip = _b === void 0 ? false : _b;
    var _c = (0, react_2.useState)(false), isCopied = _c[0], setIsCopied = _c[1];
    var onCopy = function () {
        (0, react_1.copyToClipboard)(text);
        setIsCopied(true);
        setTimeout(function () { return setIsCopied(false); }, 1500);
    };
    return (<react_1.Tooltip>
      <react_1.TooltipTrigger asChild>
        <react_1.Button variant="secondary" aria-label="Copy" className={(0, react_1.cn)("text-white", isCopied && "text-emerald-500 hover:text-emerald-500", className)} rightIcon={isCopied ? (<lu_1.LuCheck className="w-3 h-3"/>) : (<lu_1.LuCopy className="w-3 h-3"/>)} onClick={onCopy}>
          Share
        </react_1.Button>
      </react_1.TooltipTrigger>
      <react_1.TooltipContent>
        <span>
          {isCopied
            ? "Copied!"
            : withTextInTooltip
                ? text
                : "Copy link to clipboard"}
        </span>
      </react_1.TooltipContent>
    </react_1.Tooltip>);
};
exports.default = Share;
