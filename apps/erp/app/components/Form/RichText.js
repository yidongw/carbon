"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var RichText_1 = require("@carbon/react/RichText");
var react_2 = require("react");
var RichText = function (_a) {
    var name = _a.name, _b = _a.output, output = _b === void 0 ? "html" : _b, props = __rest(_a, ["name", "output"]);
    var _c = (0, form_1.useField)(name), getInputProps = _c.getInputProps, error = _c.error, defaultValue = _c.defaultValue;
    var _d = (0, form_1.useControlField)(name), value = _d[0], setValue = _d[1];
    var richText = (0, RichText_1.useRichText)(defaultValue);
    (0, react_2.useEffect)(function () {
        if (!value) {
            richText === null || richText === void 0 ? void 0 : richText.commands.clearContent(true);
        }
    }, [value, richText]);
    (0, react_2.useEffect)(function () {
        if (richText) {
            richText.on("update", function () {
                switch (output) {
                    case "html":
                        setValue(richText.getHTML());
                        break;
                    case "json":
                        setValue(JSON.stringify(richText.getJSON()));
                        break;
                    case "text":
                        setValue(richText.getText());
                        break;
                    default:
                        setValue(richText.getHTML());
                        break;
                }
            });
        }
        return function () {
            if (richText) {
                richText.off("update");
            }
        };
    }, [richText, output, setValue]);
    return (<react_1.FormControl isInvalid={!!error}>
      <RichText_1.RichText {...props} editor={richText}/>
      <input {...getInputProps({
        // @ts-ignore
        id: name
    })} value={value} type="hidden"/>
      {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
    </react_1.FormControl>);
};
exports.default = RichText;
