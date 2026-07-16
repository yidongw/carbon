"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopyButton = CopyButton;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var string_1 = require("~/utils/string");
function CopyButton(_a) {
    var text = _a.text, className = _a.className, _b = _a.label, label = _b === void 0 ? "Copy" : _b;
    var _c = (0, react_2.useState)(false), done = _c[0], setDone = _c[1];
    return (<button type="button" aria-label={label} className={(0, react_1.cn)(className, done && "done")} onClick={function () {
            (0, string_1.copyToClipboard)(text, function () {
                setDone(true);
                setTimeout(function () { return setDone(false); }, 1400);
            });
        }}>
      {done ? <lu_1.LuCheck size={14}/> : <lu_1.LuCopy size={14}/>}
    </button>);
}
