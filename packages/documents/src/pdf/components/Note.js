"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var renderer_1 = require("@react-pdf/renderer");
var tw_1 = require("../blocks/tw");
/**
 * Build a tiptap → react-pdf renderer bound to a theme, so the title/headings
 * pick up `theme.heading` and body text inherits `theme.text` (set on the
 * wrapper). Closure over `theme` keeps the recursive calls clean.
 */
function makeConvert(theme) {
    var convert = function (node, args) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        switch (node.type) {
            case "doc":
                return (<renderer_1.View style={{ fontSize: 9, width: "100%" }}>
            {(args === null || args === void 0 ? void 0 : args.title) && (<renderer_1.View style={[styles.thead, { color: theme.heading }]}>
                <renderer_1.Text>{args.title}</renderer_1.Text>
              </renderer_1.View>)}
            {(_a = node === null || node === void 0 ? void 0 : node.content) === null || _a === void 0 ? void 0 : _a.map(function (child) { return convert(child); })}
          </renderer_1.View>);
            case "heading":
                return (<renderer_1.Text key={"heading-".concat((_b = node.attrs) === null || _b === void 0 ? void 0 : _b.level)} style={{
                        fontSize: 13,
                        fontWeight: "bold",
                        marginBottom: 10,
                        width: "100%",
                        color: theme.heading
                    }}>
            {(_c = node === null || node === void 0 ? void 0 : node.content) === null || _c === void 0 ? void 0 : _c.map(function (child) { return convert(child); })}
          </renderer_1.Text>);
            case "paragraph":
                return (<renderer_1.Text key="paragraph" style={{ marginBottom: 10, fontSize: 9, width: "100%" }}>
            {((_d = node.content) === null || _d === void 0 ? void 0 : _d.map(function (child) { return convert(child); })) || ""}
          </renderer_1.Text>);
            case "bulletList":
                return (<renderer_1.View key="bulletList" style={{ marginLeft: 20 }}>
            {(_e = node === null || node === void 0 ? void 0 : node.content) === null || _e === void 0 ? void 0 : _e.map(function (child, index) {
                        return convert(child, { index: index, parentNodeType: "bulletList" });
                    })}
          </renderer_1.View>);
            case "orderedList":
                return (<renderer_1.View key="orderedList" style={{ marginLeft: 20 }}>
            {(_f = node === null || node === void 0 ? void 0 : node.content) === null || _f === void 0 ? void 0 : _f.map(function (child, index) {
                        return convert(child, { index: index, parentNodeType: "orderedList" });
                    })}
          </renderer_1.View>);
            case "listItem": {
                var indicator = (args === null || args === void 0 ? void 0 : args.parentNodeType) === "orderedList"
                    ? "".concat(((_g = args === null || args === void 0 ? void 0 : args.index) !== null && _g !== void 0 ? _g : 0) + 1, ".")
                    : "•";
                return (<renderer_1.View key={"listItem-".concat(args === null || args === void 0 ? void 0 : args.index)} style={{ flexDirection: "row", marginBottom: 5 }}>
            <renderer_1.Text style={{ marginRight: 5, fontSize: 9 }}> {indicator} </renderer_1.Text>
            <renderer_1.View style={{ flex: 1, minWidth: 0 }}>
              {(_h = node === null || node === void 0 ? void 0 : node.content) === null || _h === void 0 ? void 0 : _h.map(function (child) { return convert(child); })}
            </renderer_1.View>
          </renderer_1.View>);
            }
            case "taskList":
                return (<renderer_1.View key="taskList" style={{ marginLeft: 20 }}>
            {(_j = node === null || node === void 0 ? void 0 : node.content) === null || _j === void 0 ? void 0 : _j.map(function (child, index) { return convert(child, { index: index }); })}
          </renderer_1.View>);
            case "taskItem":
                return (<renderer_1.View key={"taskItem-".concat(args === null || args === void 0 ? void 0 : args.index)} style={{ flexDirection: "row", marginBottom: 5 }}>
            <renderer_1.Text style={{ marginRight: 5, fontSize: 9 }}>•</renderer_1.Text>
            <renderer_1.View style={{ flex: 1, minWidth: 0 }}>
              {(_k = node === null || node === void 0 ? void 0 : node.content) === null || _k === void 0 ? void 0 : _k.map(function (child) { return convert(child); })}
            </renderer_1.View>
          </renderer_1.View>);
            case "text":
                return node.text;
            default:
                return null;
        }
    };
    return convert;
}
var Note = function (_a) {
    var title = _a.title, content = _a.content;
    var theme = (0, tw_1.useDocTheme)();
    if (!content)
        return null;
    if (typeof content !== "object")
        return null;
    if (!("content" in content))
        return null;
    if (!Array.isArray(content.content) || content.content.length === 0)
        return null;
    return (<renderer_1.View style={{ width: "100%", color: theme.text }}>
      {makeConvert(theme)(content, { title: title })}
    </renderer_1.View>);
};
exports.default = Note;
var styles = renderer_1.StyleSheet.create({
    thead: {
        flexGrow: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "20px",
        marginBottom: "10px",
        padding: "6px 3px 6px 3px",
        borderTop: 1,
        borderTopColor: "#CCCCCC",
        borderTopStyle: "solid",
        borderBottom: 1,
        borderBottomColor: "#CCCCCC",
        borderBottomStyle: "solid",
        fontSize: 9,
        fontWeight: 700,
        textTransform: "uppercase"
    }
});
