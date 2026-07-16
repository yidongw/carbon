"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryFlag = CountryFlag;
var flags_1 = require("react-phone-number-input/flags");
function CountryFlag(_a) {
    var countryCode = _a.countryCode, className = _a.className;
    var Flag = flags_1.default[countryCode];
    return (<span className={className !== null && className !== void 0 ? className : "flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20"}>
      {Flag && <Flag title={countryCode}/>}
    </span>);
}
